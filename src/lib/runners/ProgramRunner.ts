import Dockerode from "dockerode";
import { EXECUTION_TIMEOUT_SECONDS } from "$lib/utils/util";

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
        return `/usr/bin/time -f "COJUDGE_METRICS:%e|%M" timeout ${EXECUTION_TIMEOUT_SECONDS} ${cmd}`;
    }

    /** Install the `time` package (provides /usr/bin/time) inside the container */
    static async ensureTimeInstalled(container: Dockerode.Container): Promise<void> {
        const exec = await container.exec({
            Cmd: ['/bin/sh', '-c', 'command -v /usr/bin/time >/dev/null 2>&1 || (command -v apt-get >/dev/null 2>&1 && apt-get update -qq && apt-get install -y -qq time) || (command -v apk >/dev/null 2>&1 && apk add --no-cache time) || true'],
            AttachStdout: true,
            AttachStderr: true
        });
        const stream: any = await exec.start({ hijack: true, stdin: false });
        await new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
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
}