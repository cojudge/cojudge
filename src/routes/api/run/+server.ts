import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { getMarkerResponses } from '../../../lib/markerRunner';
import type { ProgramRunner } from '$lib/runners/ProgramRunner';
import { JavaRunner } from '$lib/runners/JavaRunner';
import { PythonRunner } from '$lib/runners/PythonRunner';
import { CppRunner } from '$lib/runners/CppRunner';
import { CSharpRunner } from '$lib/runners/CSharpRunner';
import { RustRunner } from '$lib/runners/RustRunner';
import { GoRunner } from '$lib/runners/GoRunner';
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
    const g: any = globalThis as any;
    if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isJavaLanguage(language: string): boolean {
    return language === 'java';
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
        } else if (language === 'csharp') {
            programRunner = new CSharpRunner(problemId, testCases, code);
        } else if (language === 'rust') {
            programRunner = new RustRunner(problemId, testCases, code);
        } else if (language === 'go') {
            programRunner = new GoRunner(problemId, testCases, code);
        }
        if (!programRunner) {
            throw new Error(`${language} is not supported yet`);
        }

        job.status = 'preparing';
        await programRunner.compile();
        job.status = 'running';
        const rawResults = await programRunner.run();

        // Check if this is a merged marker result (Java with Marker.java)
        const hasMergedMarker = isJavaLanguage(language) &&
            rawResults.length > 0 &&
            rawResults[0].includes(':::VERDICT:::');

        if (hasMergedMarker) {
            // Parse merged output format: :::RESULT:::, :::VERDICT:::, :::ANSWER:::
            const finalResponse: RunSuccess = rawResults.map((chunk, index) => {
                try {
                    const lines = (chunk || '').split('\n');
                    const errorLine = lines.find((l) => l.startsWith(':::ERROR:::'));
                    if (errorLine) {
                        const errMsg = errorLine.slice(':::ERROR:::'.length).trim();
                        return {
                            ...(testCases[index] || {}),
                            output: errMsg,
                            logs: errMsg,
                            isCorrect: false,
                            correctAnswer: '',
                            error: errMsg
                        };
                    }
                    const resultLine = lines.find((l) => l.startsWith(':::RESULT:::'));
                    const verdictLine = lines.find((l) => l.startsWith(':::VERDICT:::'));
                    const answerLine = lines.find((l) => l.startsWith(':::ANSWER:::'));

                    const output = resultLine ? resultLine.slice(':::RESULT:::'.length).trim() : (chunk || '').trim();
                    const isCorrect = verdictLine ? verdictLine.slice(':::VERDICT:::'.length).trim() === 'true' : false;
                    const correctAnswer = answerLine ? answerLine.slice(':::ANSWER:::'.length).trim() : '';
                    const logs = lines
                        .filter((l) =>
                            !l.startsWith(':::RESULT:::') &&
                            !l.startsWith(':::VERDICT:::') &&
                            !l.startsWith(':::ANSWER:::')
                        )
                        .filter((l) => l.trim().length > 0)
                        .join('\n');

                    return {
                        ...(testCases[index] || {}),
                        output,
                        logs,
                        isCorrect,
                        correctAnswer,
                        error: null
                    };
                } catch {
                    return {
                        ...(testCases[index] || {}),
                        output: (chunk || '').trim(),
                        logs: '',
                        isCorrect: false,
                        correctAnswer: '',
                        error: null
                    };
                }
            });

            job.results = finalResponse;
            job.status = 'completed';
        } else {
            // Standard flow: parse output and call marker separately
            const parsed = rawResults.map((chunk) => {
                try {
                    const lines = (chunk || '').split('\n');
                    const errorLine = lines.find((l) => l.startsWith(':::ERROR:::'));
                    if (errorLine) {
                        const errMsg = errorLine.slice(':::ERROR:::'.length).trim();
                        return { output: errMsg, logs: errMsg, error: true };
                    }
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
            // For error cases, use the input adjList as placeholder output to get correctAnswer from marker
            const markerOutputs = onlyOutputs.map((o, i) => {
                if (parsed[i]?.error) {
                    const tc = testCases[i];
                    return tc.adjList || tc.input || '[]';
                }
                return o;
            });
            let markerResponses: any[];
            try {
                markerResponses = await getMarkerResponses(
                    problemId,
                    problemData.functionName,
                    problemData.params,
                    testCases,
                    markerOutputs,
                    problemData.outputType
                );
            } catch {
                markerResponses = testCases.map(() => ({
                    actualAnswer: '',
                    correctAnswer: '',
                    isCorrect: false
                }));
            }

            const finalResponse: RunSuccess = testCases.map((tc: any, index: number) => ({
                ...tc,
                output: parsed[index]?.output ?? 'No output',
                logs: parsed[index]?.logs ?? '',
                isCorrect: parsed[index]?.error ? false : markerResponses[index].isCorrect,
                correctAnswer: markerResponses[index].correctAnswer,
                error: parsed[index]?.error ? 'invalid clone - same object' : null
            }));

            job.results = finalResponse;
            job.status = 'completed';
        }
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
    const id = genId();
    const job: RunJob = { id, status: 'pending', createdAt: Date.now() };
    jobs.set(id, job);
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
    if (job.timeout) {
        return json({ ready: true, timeout: true });
    }
    if (job.status === 'error') {
        return json({ ready: true, error: job.error || 'Execution failed' }, { status: 400 });
    }
    return json({ ready: true, results: job.results || [] });
};
