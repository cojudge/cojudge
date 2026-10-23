import Dockerode from "dockerode";
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

    /** Install the `time` package (provides /usr/bin/time) inside the container */
    static async ensureTimeInstalled(container: Dockerode.Container): Promise<void> {
        // The install needs network (apt/apk). Offline, apt-get update can
        // hang for minutes on DNS/connect timeouts, wedging compile at
        // "Preparing / Compiling" until the cleanup cron kills the container
        // (surfacing as HTTP 409). Bound it at both levels: `timeout` in the
        // shell (fail-safe if the binary is missing: 127 -> `|| true`) plus
        // short apt timeouts, and a JS-side cap as a final backstop. Missing
        // metrics are fine: run commands fall back to plain `timeout`.
        const exec = await container.exec({
            Cmd: ['/bin/sh', '-c', 'command -v /usr/bin/time >/dev/null 2>&1 || timeout 45 sh -c \'(command -v apt-get >/dev/null 2>&1 && apt-get update -qq -o Acquire::http::Timeout=5 -o Acquire::https::Timeout=5 && apt-get install -y -qq time) || (command -v apk >/dev/null 2>&1 && apk add --no-cache time)\' || true'],
            AttachStdout: true,
            AttachStderr: true
        });
        const stream: any = await exec.start({ hijack: true, stdin: false });
        await new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, 60000);
            stream.on('end', () => {
                clearTimeout(timer);
                resolve(null);
            });
            stream.on('error', (err: unknown) => {
                clearTimeout(timer);
                reject(err);
            });
            stream.resume();
        });
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