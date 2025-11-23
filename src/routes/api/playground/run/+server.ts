import { PlaygroundCppRunner, PlaygroundCSharpRunner, PlaygroundJavaRunner, PlaygroundPythonRunner } from '$lib/runners/PlaygroundRunners';
import { TIMEOUT_MESSAGE, type JobStatus } from '$lib/utils/util';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type RunResult = {
    output: string | null;
    logs: string;
    error: string | null;
};

type RunJob = {
    id: string;
    status: JobStatus;
    createdAt: number;
    result?: RunResult;
    timeout?: boolean;
    error?: string;
};

const jobs: Map<string, RunJob> = new Map();

function genId() {
    const g: any = globalThis as any;
    if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function executeRun(language: string, code: string, job: RunJob) {
    try {
        let runner: any = null;
        if (language === 'java') {
            runner = new PlaygroundJavaRunner(code);
        } else if (language === 'python') {
            runner = new PlaygroundPythonRunner(code);
        } else if (language === 'cpp') {
            runner = new PlaygroundCppRunner(code);
        } else if (language === 'csharp') {
            runner = new PlaygroundCSharpRunner(code);
        }
        if (!runner) {
            throw new Error(`${language} is not supported yet`);
        }

        job.status = 'preparing';
        await runner.compile();
        job.status = 'running';
        const rawOutput = await runner.run();

        job.result = {
            output: rawOutput.output,
            logs: rawOutput.logs,
            error: null
        };
        job.status = 'completed';
    } catch (error: any) {
        if (error && error.toString && error.toString().indexOf(TIMEOUT_MESSAGE) !== -1) {
            job.timeout = true;
            job.status = 'completed';
        } else {
            job.error = `Execution failed: details: ${error}`;
            job.status = 'error';
        }
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const { language, code } = await request.json();
    const id = genId();
    const job: RunJob = { id, status: 'pending', createdAt: Date.now() };
    jobs.set(id, job);
    executeRun(language, code, job);
    return json({ jobId: id });
};

export const GET: RequestHandler = async ({ url }) => {
    const jobId = url.searchParams.get('jobId') || '';
    const job = jobs.get(jobId);
    if (!job) {
        return json({ error: 'Job not found' }, { status: 404 });
    }
    if (job.status === 'pending' || job.status === 'running' || job.status === 'preparing') {
        return json({ ready: false, status: job.status });
    }
    if (job.timeout) {
        return json({ ready: true, timeout: true });
    }
    if (job.status === 'error') {
        return json({ ready: true, error: job.error || 'Execution failed' }, { status: 400 });
    }
    return json({ ready: true, ...job.result });
};
