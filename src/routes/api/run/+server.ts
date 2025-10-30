import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { getMarkerResponses } from '../../../lib/markerRunner';
import type { ProgramRunner } from '$lib/runners/ProgramRunner';
import { JavaRunner } from '$lib/runners/JavaRunner';
import { PythonRunner } from '$lib/runners/PythonRunner';
import { CppRunner } from '$lib/runners/CppRunner';
import { TIMEOUT_MESSAGE, type JobStatus } from '$lib/utils/util';

type RunSuccess = Array<{
    output: string | null;
    logs: string;
    isCorrect: boolean;
    correctAnswer: any;
    error: string | null;
    [key: string]: any;
}>;

type RunJob = {
    id: string;
    status: JobStatus;
    createdAt: number;
    results?: RunSuccess;
    timeout?: boolean;
    error?: string;
};

const jobs: Map<string, RunJob> = new Map();

function genId() {
    // Prefer crypto.randomUUID if available
    const g: any = globalThis as any;
    if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function executeRun(problemId: string, language: string, code: string, testCases: any[], job: RunJob) {
    try {
        const problemPath = path.resolve('problems', problemId, 'metadata.json');
        const problemContent = await fs.readFile(problemPath, 'utf-8');
        const problemData = JSON.parse(problemContent);

        let programRunner: ProgramRunner | null = null;
        if (language === 'java') {
            programRunner = new JavaRunner(problemId, testCases, code);
        } else if (language === 'python') {
            programRunner = new PythonRunner(problemId, testCases, code);
        } else if (language === 'cpp') {
            programRunner = new CppRunner(problemId, testCases, code);
        }
        if (!programRunner) {
            throw new Error(`${language} is not supported yet`);
        }

        job.status = 'preparing';
        await programRunner.compile();
        job.status = 'running';
        const rawResults = await programRunner.run();

        // Parse each chunk to separate final result from user logs
        const parsed = rawResults.map((chunk) => {
            try {
                const lines = (chunk || '').split('\n');
                const idx = lines.findIndex((l) => l.startsWith(':::RESULT:::'));
                if (idx === -1) {
                    return { output: (chunk || '').trim(), logs: '' };
                }
                const output = lines[idx].slice(':::RESULT:::'.length).trim();
                const logs = lines
                    .filter((_, i) => i !== idx)
                    .filter((l) => l.trim().length > 0)
                    .join('\n');
                return { output, logs };
            } catch {
                return { output: (chunk || '').trim(), logs: '' };
            }
        });

        const onlyOutputs = parsed.map((p) => p.output);
        job.status = 'judging';
        const markerResponses = await getMarkerResponses(
            problemId,
            problemData.functionName,
            problemData.params,
            testCases,
            onlyOutputs,
            problemData.outputType
        );

        const finalResponse: RunSuccess = testCases.map((tc: any, index: number) => ({
            ...tc,
            output: parsed[index]?.output ?? 'No output',
            logs: parsed[index]?.logs ?? '',
            isCorrect: markerResponses[index].isCorrect,
            correctAnswer: markerResponses[index].correctAnswer,
            error: null
        }));

        job.results = finalResponse;
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
    const { problemId, language, code, testCases } = await request.json();
    // Create a job and start execution in background
    const id = genId();
    const job: RunJob = { id, status: 'pending', createdAt: Date.now() };
    jobs.set(id, job);
    // fire and forget
    executeRun(problemId, language, code, testCases, job);
    return json({ jobId: id });
};

export const GET: RequestHandler = async ({ url }) => {
    const jobId = url.searchParams.get('jobId') || '';
    const job = jobs.get(jobId);
    if (!job) {
        return json({ error: 'Job not found' }, { status: 404 });
    }
    if (job.status === 'pending' || job.status === 'running' || job.status === 'preparing' || job.status === 'judging') {
        return json({ ready: false, status: job.status });
    }
    // completed or error
    if (job.timeout) {
        return json({ ready: true, timeout: true });
    }
    if (job.status === 'error') {
        return json({ ready: true, error: job.error || 'Execution failed' }, { status: 400 });
    }
    return json({ ready: true, results: job.results || [] });
};