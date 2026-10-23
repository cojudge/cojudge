import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import { getMarkerResponses } from '../../../lib/markerRunner';
import { ensureUserContentSeeded, resolveProblemFile } from '$lib/server/contentPaths';
import { ProgramRunner } from '$lib/runners/ProgramRunner';
import { JavaRunner } from '$lib/runners/JavaRunner';
import { PythonRunner } from '$lib/runners/PythonRunner';
import { CppRunner } from '$lib/runners/CppRunner';
import { CSharpRunner } from '$lib/runners/CSharpRunner';
import { RustRunner } from '$lib/runners/RustRunner';
import { GoRunner } from '$lib/runners/GoRunner';
import { PhpRunner } from '$lib/runners/PhpRunner';
import { TypeScriptRunner } from '$lib/runners/TypeScriptRunner';
import { startProblemDebugSession, getDebugState } from '$lib/runners/DebugRunner';
import { TIMEOUT_MESSAGE, annotateCrashSignal, type JobStatus } from '$lib/utils/util';

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
    /** 0-based index into the requested testCases of the test that crashed the runner, if any. */
    crashedTestIndex?: number;
    executionTimeMs?: number;
    memoryKB?: number;
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

async function judgeRawResults(rawResults: string[], testCases: any[], problemData: any, problemId: string, language: string): Promise<RunSuccess> {
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

        return finalResponse;
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
                // NOTE: the value may itself span multiple lines (e.g. strings
                // containing newlines), so everything from the RESULT line to
                // the end of the chunk belongs to the output. Harness output
                // (TIME/RESULT) is always printed last, so user logs can only
                // appear before it. Only the single trailing empty artifact
                // of the final newline is dropped - all other whitespace
                // (including leading/trailing spaces) is significant.
                const rawParts = [lines[idx].slice(':::RESULT:::'.length), ...lines.slice(idx + 1)];
                if (rawParts.length > 0 && rawParts[rawParts.length - 1] === '') rawParts.pop();
                const output = rawParts.join('\n');
                const logs = lines
                    .filter((_, i) => i < idx)
                    .filter((l) => l.trim().length > 0)
                    .join('\n');
                return { output, logs };
            } catch {
                return { output: (chunk || '').trim(), logs: '' };
            }
        });

        const onlyOutputs = parsed.map((p) => p.output);
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

        return finalResponse;
    }
}

async function executeRun(problemId: string, language: string, code: string, testCases: any[], job: RunJob) {
    let problemData: any = null;
    try {
        await ensureUserContentSeeded();
        const problemPath = await resolveProblemFile(problemId, 'metadata.json');
        const problemContent = await fs.readFile(problemPath, 'utf-8');
        problemData = JSON.parse(problemContent);

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
        } else if (language === 'typescript') {
            programRunner = new TypeScriptRunner(problemId, testCases, code);
        } else if (language === 'php') {
            programRunner = new PhpRunner(problemId, testCases, code);
        }
        if (!programRunner) {
            throw new Error(`${language} is not supported yet`);
        }

        job.status = 'preparing';
        await programRunner.compile();
        job.status = 'running';
        const rawResults = await programRunner.run();
        if (programRunner.lastRunMetrics) {
            job.executionTimeMs = programRunner.lastRunMetrics.executionTimeMs;
            job.memoryKB = programRunner.lastRunMetrics.memoryKB;
        }

        job.status = 'judging';
        job.results = await judgeRawResults(rawResults, testCases, problemData, problemId, language);
        job.status = 'completed';
    } catch (error: any) {
        if (error && error.toString && error.toString().indexOf(TIMEOUT_MESSAGE) !== -1) {
            job.timeout = true;
            job.status = 'completed';
        } else {
            const message = annotateCrashSignal(error.message || String(error));
            const partial = ProgramRunner.crashStdout(error);
            // A crash kills the whole runner, but tests before it already
            // printed their `---`-delimited chunks (runners flush per test).
            // Judge those so passing tests still show PASS, and mark the
            // crashed test (plus everything after it) explicitly instead of
            // failing the entire run with one generic error.
            if (partial !== null && problemData && testCases.length > 0) {
                const crashIdx = Math.min(
                    Math.max(ProgramRunner.countCompletedChunks(partial), 0),
                    testCases.length - 1
                );
                const chunks = partial.split('---\n');
                let okResults: RunSuccess = [];
                try {
                    // Drop internal timing markers: runners strip them on the
                    // success path, but a crash throws before that happens.
                    const cleanChunks = chunks.slice(0, crashIdx).map((c) => c.replace(/^:::TIME:::\d+\n?/gm, ''));
                    okResults = await judgeRawResults(cleanChunks, testCases.slice(0, crashIdx), problemData, problemId, language);
                } catch {
                    okResults = [];
                }
                if (okResults.length === crashIdx) {
                    const tail = (chunks[crashIdx] ?? '').trim();
                    const tailLogs = tail.split('\n').filter((l) => l.trim().length > 0 && !l.startsWith(':::')).join('\n');
                    job.results = [
                        ...okResults,
                        {
                            ...testCases[crashIdx],
                            output: null,
                            logs: tailLogs,
                            isCorrect: false,
                            correctAnswer: '',
                            error: message,
                        },
                        ...testCases.slice(crashIdx + 1).map((tc: any) => ({
                            ...tc,
                            output: null,
                            logs: '',
                            isCorrect: false,
                            correctAnswer: '',
                            error: 'Skipped: an earlier test case crashed the runner',
                        })),
                    ];
                    job.crashedTestIndex = crashIdx;
                    job.status = 'completed';
                    return;
                }
            }
            job.error = `Execution failed: details: ${message}`;
            job.status = 'error';
        }
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const { problemId, language, code, testCases, debugLines } = await request.json();

    if (debugLines && Array.isArray(debugLines) && debugLines.length > 0) {
        try {
            const jobId = await startProblemDebugSession(problemId, language, code, testCases, debugLines.map(Number));
            const state = await getDebugState(jobId);
            return json({ jobId, debug: true, state });
        } catch (e: any) {
            return json({ error: e.message || 'Failed to start debug session' }, { status: 400 });
        }
    }

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
    return json({
        ready: true,
        results: job.results || [],
        crashedTestIndex: job.crashedTestIndex,
        executionTimeMs: job.executionTimeMs,
        memoryKB: job.memoryKB,
    });
};
