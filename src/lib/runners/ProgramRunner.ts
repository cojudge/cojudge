import Dockerode from "dockerode";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { EXECUTION_TIMEOUT_SECONDS } from "$lib/utils/util";

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
    /** In-flight installs, keyed like toolReady. */
    private static toolInstalls = new Map<string, Promise<boolean>>();
    /**
     * Tar archives of installed tools harvested from a container, keyed by
     * `${tool}:${imageId}`. Containers of the same image share the same libc
     * and filesystem layout, so later containers get the tool via a single
     * putArchive (~10ms) instead of a network install. Mirrored to disk
     * (toolCacheDir) so a server restart - and offline use after one online
     * run - does not need the network again. Keyed by image *ID*, so a
     * re-pulled/updated image never receives a stale binary.
     */
    private static toolArchives = new Map<string, Buffer>();

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
     * Ensure a tool is present in the container: known-ready -> no-op; else
     * inject the archive harvested from an earlier container of the same
     * image; else probe; else install (needs network) and harvest the result
     * for later containers. With `background`, the install is started but not
     * awaited and this resolves false immediately.
     */
    static async provisionTool(container: Dockerode.Container, tool: {
        name: string;
        probe: string;
        install: string;
        harvestPath: string;
        extractTo: string;
        installTimeoutMs: number;
        background?: boolean;
    }): Promise<boolean> {
        const key = `${tool.name}:${container.id}`;
        if (this.toolReady.has(key)) return true;
        const inflight = this.toolInstalls.get(key);
        if (inflight) return tool.background ? false : inflight;
        let image = '';
        try {
            image = (await container.inspect()).Image ?? '';
        } catch {}
        const archiveKey = `${tool.name}:${image}`;
        const cached = image ? await ProgramRunner.loadToolArchive(archiveKey) : undefined;
        if (cached) {
            try {
                await container.putArchive(cached, { path: tool.extractTo });
            } catch {}
        }
        if (await ProgramRunner.execOk(container, tool.probe, 10000)) {
            this.toolReady.add(key);
            return true;
        }
        if (cached) await ProgramRunner.forgetToolArchive(archiveKey);
        const install = (async () => {
            try {
                const ok = await ProgramRunner.execOk(container, `${tool.install}; ${tool.probe}`, tool.installTimeoutMs);
                if (!ok) return false;
                this.toolReady.add(key);
                if (image && !this.toolArchives.has(archiveKey)) {
                    const archive: any = await container.getArchive({ path: tool.harvestPath });
                    const chunks: Buffer[] = [];
                    await new Promise<void>((resolve, reject) => {
                        archive.on('data', (c: Buffer) => chunks.push(c));
                        archive.on('end', resolve);
                        archive.on('error', reject);
                    });
                    await ProgramRunner.saveToolArchive(archiveKey, Buffer.concat(chunks));
                }
                return true;
            } catch {
                return false;
            } finally {
                this.toolInstalls.delete(key);
            }
        })();
        this.toolInstalls.set(key, install);
        return tool.background ? false : install;
    }

    /**
     * Make /usr/bin/time (used for the memory metric) available WITHOUT
     * blocking execution on the network. Alpine images already ship it;
     * Debian-based ones (python/gcc/php/rust) get it injected from the archive
     * harvested from the first container that installed it. When neither
     * applies, the package install runs in the background: runs fall back to
     * plain `timeout` until it lands (see wrapWithMetrics), so only the memory
     * metric of the first run on a fresh container of that image is missing.
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