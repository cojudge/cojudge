import Dockerode from "dockerode";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { EXECUTION_TIMEOUT_SECONDS } from "$lib/utils/util";
import { cojudgeContainerLabels } from "$lib/server/containerSession";

const docker = new Dockerode();

/**
 * Thrown when the compiled test binary exits non-zero (e.g. SIGSEGV from a
 * stack overflow or bad access). Carries whatever the program printed before
 * dying so callers can count how many `---`-delimited test chunks completed
 * and attribute the crash to the correct test case instead of the batch start.
 */
export class RunnerCrashError extends Error {
    partialStdout: string;
    constructor(message: string, partialStdout: string) {
        super(message);
        this.name = 'RunnerCrashError';
        this.partialStdout = partialStdout;
    }
}

/** A tool provisioned into runner containers (see ProgramRunner.provisionTool). */
export type ToolSpec = {
    name: string;
    /** Shell command that exits 0 iff the tool is usable in the container. */
    probe: string;
    /** Shell command installing the tool (needs network). */
    install: string;
    /** Path harvested (getArchive) after installing. */
    harvestPath: string;
    /** Directory the harvested archive is extracted into (putArchive). */
    extractTo: string;
    installTimeoutMs: number;
    background?: boolean;
};

export abstract class ProgramRunner {
    protected readonly problemId: string;
    protected readonly testCases: any[];
    protected readonly code: string;

    lastRunMetrics: { executionTimeMs: number; memoryKB: number } | null = null;
    protected constructor(problemId: string, testCases: any[], code: string) {
        this.problemId = problemId;
        this.testCases = testCases || [];
        this.code = code;
    }

    // Prepare artifacts (e.g., write files, compile).
    abstract compile(): Promise<void>;
    // Run the prepared program and return outputs per test case
    abstract run(): Promise<string[]>;

    static wrapWithMetrics(cmd: string): string {
        // /usr/bin/time is installed on-demand via ensureTimeInstalled(), which
        // requires network (apt-get/apk). When offline the install silently
        // fails and the hard dependency on /usr/bin/time breaks execution
        // with "/bin/sh: 1: /usr/bin/time: not found". Fall back to plain
        // `timeout` so runs still work offline (memory metric unavailable;
        // execution time is still captured via :::TIME::: internal timing).
        return `if command -v /usr/bin/time >/dev/null 2>&1; then /usr/bin/time -f "COJUDGE_METRICS:%e|%M" timeout ${EXECUTION_TIMEOUT_SECONDS} ${cmd}; else timeout ${EXECUTION_TIMEOUT_SECONDS} ${cmd}; fi`;
    }

    /** `${tool}:${containerId}` keys of containers known to have a tool. */
    private static toolReady = new Set<string>();
    /** In-flight background provisioning, keyed like toolReady. */
    private static toolPending = new Map<string, Promise<boolean>>();
    /**
     * Tar archives of tools installed in a pristine sidecar container, keyed
     * by `${tool}:${imageId}`. Containers of the same image share the same
     * libc and filesystem layout, so a runner container gets the tool via a
     * single putArchive (~10ms) instead of a network install. Mirrored to disk
     * (toolCacheDir) so a server restart - and offline use after one online
     * run - does not need the network again. Keyed by image *ID*, so a
     * re-pulled/updated image never receives a stale binary.
     */
    private static toolArchives = new Map<string, Buffer>();
    /** In-flight sidecar installs, keyed like toolArchives (one per image+tool). */
    private static sidecars = new Map<string, Promise<Buffer | null>>();

    private static toolCacheDir(): string {
        return process.env.COJUDGE_TOOL_CACHE_DIR || path.join(os.homedir(), '.cojudge', 'tool-cache');
    }

    private static toolCacheFile(archiveKey: string): string {
        return path.join(ProgramRunner.toolCacheDir(), archiveKey.replace(/[^A-Za-z0-9_.-]/g, '_') + '.tar');
    }

    private static async loadToolArchive(archiveKey: string): Promise<Buffer | undefined> {
        const inMemory = this.toolArchives.get(archiveKey);
        if (inMemory) return inMemory;
        try {
            const buf = await fs.readFile(ProgramRunner.toolCacheFile(archiveKey));
            this.toolArchives.set(archiveKey, buf);
            return buf;
        } catch {
            return undefined;
        }
    }

    private static async saveToolArchive(archiveKey: string, buf: Buffer): Promise<void> {
        this.toolArchives.set(archiveKey, buf);
        try {
            const file = ProgramRunner.toolCacheFile(archiveKey);
            await fs.mkdir(path.dirname(file), { recursive: true });
            const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
            await fs.writeFile(tmp, buf);
            await fs.rename(tmp, file);
        } catch {
            // Disk cache is best-effort; the in-memory copy still applies.
        }
    }

    /** Drop a cached archive that failed to produce a working tool. */
    private static async forgetToolArchive(archiveKey: string): Promise<void> {
        this.toolArchives.delete(archiveKey);
        try { await fs.unlink(ProgramRunner.toolCacheFile(archiveKey)); } catch {}
    }

    /**
     * Install a tool in a short-lived sidecar container created from the same
     * image and harvest it as a tar archive. The sidecar never runs user code,
     * so the cached archive - which is injected into every later container of
     * the image, across server restarts - cannot be tampered with by a
     * submission (installing inside a runner container would let a program
     * running alongside the install replace the binary before it is cached).
     */
    private static installInSidecar(archiveKey: string, image: string, tool: ToolSpec): Promise<Buffer | null> {
        const existing = this.sidecars.get(archiveKey);
        if (existing) return existing;
        const job = (async () => {
            let sidecar: Dockerode.Container | null = null;
            try {
                sidecar = await docker.createContainer({
                    Image: image,
                    Cmd: ['sh', '-c', 'tail -f /dev/null'],
                    Tty: false,
                    Labels: cojudgeContainerLabels({ 'cojudge.provision': 'true' })
                });
                await sidecar.start();
                const ok = await ProgramRunner.execOk(sidecar, `${tool.install}; ${tool.probe}`, tool.installTimeoutMs);
                if (!ok) return null;
                const archive: any = await sidecar.getArchive({ path: tool.harvestPath });
                const chunks: Buffer[] = [];
                await new Promise<void>((resolve, reject) => {
                    archive.on('data', (c: Buffer) => chunks.push(c));
                    archive.on('end', resolve);
                    archive.on('error', reject);
                });
                const buf = Buffer.concat(chunks);
                await ProgramRunner.saveToolArchive(archiveKey, buf);
                return buf;
            } catch {
                return null;
            } finally {
                this.sidecars.delete(archiveKey);
                if (sidecar) {
                    try { await sidecar.remove({ force: true }); } catch {}
                }
            }
        })();
        this.sidecars.set(archiveKey, job);
        return job;
    }

    /** Inject a trusted archive into the container and confirm the tool works. */
    private static async injectTool(container: Dockerode.Container, key: string, archiveKey: string, buf: Buffer, tool: ToolSpec): Promise<boolean> {
        try {
            await container.putArchive(buf, { path: tool.extractTo });
        } catch {
            return false;
        }
        if (await ProgramRunner.execOk(container, tool.probe, 10000)) {
            this.toolReady.add(key);
            return true;
        }
        await ProgramRunner.forgetToolArchive(archiveKey);
        return false;
    }

    /**
     * Ensure a tool is present in the container: known-ready -> no-op; else
     * inject the cached archive for this image; else probe (the image may
     * ship it); else install it in a pristine sidecar (needs network), cache
     * the archive and inject it. With `background`, provisioning continues
     * without being awaited and this resolves false immediately.
     */
    static async provisionTool(container: Dockerode.Container, tool: ToolSpec): Promise<boolean> {
        const key = `${tool.name}:${container.id}`;
        if (this.toolReady.has(key)) return true;
        const pending = this.toolPending.get(key);
        if (pending) return tool.background ? false : pending;
        let image = '';
        try {
            image = (await container.inspect()).Image ?? '';
        } catch {}
        const archiveKey = `${tool.name}:${image}`;
        const cached = image ? await ProgramRunner.loadToolArchive(archiveKey) : undefined;
        if (cached && await ProgramRunner.injectTool(container, key, archiveKey, cached, tool)) return true;
        if (await ProgramRunner.execOk(container, tool.probe, 10000)) {
            this.toolReady.add(key);
            return true;
        }
        if (!image) return false;
        const job = (async () => {
            try {
                const buf = await ProgramRunner.installInSidecar(archiveKey, image, tool);
                return buf ? await ProgramRunner.injectTool(container, key, archiveKey, buf, tool) : false;
            } catch {
                return false;
            } finally {
                this.toolPending.delete(key);
            }
        })();
        this.toolPending.set(key, job);
        return tool.background ? false : job;
    }

    /**
     * Make /usr/bin/time (used for the memory metric) available WITHOUT
     * blocking execution on the network. Alpine images already ship it;
     * Debian-based ones (python/gcc/php/rust) get it injected from the cached
     * archive. Without one, the package is installed in a sidecar in the
     * background: runs fall back to plain `timeout` until it lands (see
     * wrapWithMetrics), so only the memory metric of the first run(s) on that
     * image is missing.
     * Previously the install was awaited here, costing ~20s on every fresh
     * Debian-based container (beyond the CLI's 12s poll window on cold runs).
     */
    static async ensureTimeInstalled(container: Dockerode.Container): Promise<void> {
        // The install needs network (apt/apk). Offline, apt-get update can
        // hang for minutes on DNS/connect timeouts: bound it with `timeout`,
        // short apt timeouts and the JS-side cap.
        await ProgramRunner.provisionTool(container, {
            name: 'time',
            // Functional probe: an injected binary must actually run here.
            probe: '/usr/bin/time -f %e true >/dev/null 2>&1',
            install: 'timeout 45 sh -c \'(command -v apt-get >/dev/null 2>&1 && apt-get update -qq -o Acquire::http::Timeout=5 -o Acquire::https::Timeout=5 && apt-get install -y -qq time) || (command -v apk >/dev/null 2>&1 && apk add --no-cache time)\' >/dev/null 2>&1',
            harvestPath: '/usr/bin/time',
            extractTo: '/usr/bin',
            installTimeoutMs: 60000,
            background: true
        });
    }

    /** Run a shell command in the container; resolves true iff it exits 0 within timeoutMs. */
    static async execOk(container: Dockerode.Container, cmd: string, timeoutMs: number): Promise<boolean> {
        const exec = await container.exec({
            Cmd: ['/bin/sh', '-c', cmd],
            AttachStdout: true,
            AttachStderr: true
        });
        const stream: any = await exec.start({ hijack: true, stdin: false });
        const finished = await new Promise<boolean>((resolve, reject) => {
            const timer = setTimeout(() => resolve(false), timeoutMs);
            stream.on('end', () => {
                clearTimeout(timer);
                resolve(true);
            });
            stream.on('error', (err: unknown) => {
                clearTimeout(timer);
                reject(err);
            });
            stream.resume();
        });
        if (!finished) return false;
        const inspect = await exec.inspect();
        return inspect.ExitCode === 0;
    }

    parseMetricsFromStderr(stderr: string): string {
        this.lastRunMetrics = null;
        const metricsMatch = stderr.match(/COJUDGE_METRICS:([\d.]+)\|(\d+)/);
        if (metricsMatch) {
            this.lastRunMetrics = {
                executionTimeMs: parseFloat(metricsMatch[1]) * 1000,
                memoryKB: parseInt(metricsMatch[2], 10)
            };
            return stderr.replace(/COJUDGE_METRICS:[\d.]+\|\d+\n?/g, '').trim();
        }
        return stderr;
    }

    parseInternalTiming(stdout: string): string {
        let totalNs = 0;
        const timeRegex = /:::TIME:::(\d+)/g;
        let match;
        while ((match = timeRegex.exec(stdout)) !== null) {
            totalNs += parseInt(match[1], 10);
        }
        const totalMs = totalNs / 1_000_000;
        if (this.lastRunMetrics) {
            this.lastRunMetrics.executionTimeMs = totalMs;
        } else {
            this.lastRunMetrics = { executionTimeMs: totalMs, memoryKB: 0 };
        }
        return stdout.replace(/:::TIME:::\d+\n?/g, '');
    }

    /** Raw stdout captured before a crash, or null when the error carries none. */
    static crashStdout(error: any): string | null {
        if (error && typeof (error as any).partialStdout === 'string') return (error as any).partialStdout;
        return null;
    }

    /** Number of complete `---`-delimited test chunks in raw runner stdout. */
    static countCompletedChunks(stdout: string): number {
        if (!stdout) return 0;
        return stdout.split('---\n').length - 1;
    }
}