import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import { getMarkerResponses } from '../../../lib/markerRunner';
import type { ProgramRunner } from '$lib/runners/ProgramRunner';
import { JavaRunner } from '$lib/runners/JavaRunner';
import { PythonRunner } from '$lib/runners/PythonRunner';
import { CppRunner } from '$lib/runners/CppRunner';
import { CSharpRunner } from '$lib/runners/CSharpRunner';
import { RustRunner } from '$lib/runners/RustRunner';
import { GoRunner } from '$lib/runners/GoRunner';
import { TIMEOUT_MESSAGE, type JobStatus } from '$lib/utils/util';

type SubmitResult = {
    accepted?: boolean;
    allAccepted?: boolean;
    totalTc?: number;
    passedTc?: number;
    results?: any[];
};
type SubmitJob = {
    id: string;
    status: JobStatus;
    createdAt: number;
    result?: SubmitResult;
    timeout?: boolean;
    timeoutTestCase?: any;
    error?: string;
};

const jobs: Map<string, SubmitJob> = new Map();

function genId() {
    const g: any = globalThis as any;
    if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isJavaLanguage(language: string): boolean {
    return language === 'java';
}

async function executeSubmit(problemId: string, language: string, code: string, startTcNo: number, job: SubmitJob) {
    let timeoutTestcase: any = null;
    try {
        job.status = 'running';

        const problemPath = path.resolve('problems', problemId, 'metadata.json');
        const problemContent = await fs.readFile(problemPath, 'utf-8');
        const problemData = JSON.parse(problemContent);

        let officialTestsPath = path.resolve('problems', problemId, 'official-tests.json');
        let testCases: any[] = [];
        let totalTc = 0;
        let passedTc = 0;
        try {
            const officialContent = await fs.readFile(officialTestsPath, 'utf-8');
            testCases = JSON.parse(officialContent);
            totalTc = testCases.length;
            if (startTcNo >= totalTc) {
                job.result = { allAccepted: true, totalTc, passedTc: totalTc, results: [] };
                job.status = 'completed';
                return;
            }
            let tcNo = startTcNo;
            const newTestCases = [testCases[tcNo]];
            timeoutTestcase = newTestCases[0];
            while (!testCases[tcNo]._isLargeTest && tcNo + 1 < testCases.length && !testCases[tcNo + 1]._isLargeTest) {
                newTestCases.push(testCases[tcNo + 1]);
                tcNo++;
            }
            testCases = newTestCases;
            passedTc = newTestCases.length;
            const JAVASCRIPT_PREFIX = '@javascript:';
            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                if (tc && typeof tc === 'object') {
                    for (const k of Object.keys(tc)) {
                        const v = tc[k];
                        if (typeof v === 'string' && v.startsWith(JAVASCRIPT_PREFIX)) {
                            const expr = v.slice(JAVASCRIPT_PREFIX.length);
                            try {
                                const evaluated = vm.runInNewContext(expr, {}, { timeout: 2000 });
                                if (typeof evaluated === 'string') {
                                    tc[k] = evaluated;
                                } else if (typeof evaluated === 'object') {
                                    tc[k] = JSON.stringify(evaluated);
                                } else {
                                    tc[k] = String(evaluated);
                                }
                            } catch (e) {
                                try { tc[k] = v.replace(JAVASCRIPT_PREFIX, ''); } catch {}
                            }
                        }
                    }
                }
            }
        } catch (err) {
            testCases = problemData.testCases || [];
            totalTc = testCases.length;
            passedTc = testCases.length;
            if (startTcNo >= totalTc) {
                job.result = { allAccepted: true, totalTc, passedTc: 0, results: [] };
                job.status = 'completed';
                return;
            }
        }

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
        await programRunner.compile();
        const rawResults = await programRunner.run();

        const hasMergedMarker = isJavaLanguage(language) &&
            rawResults.length > 0 &&
            rawResults[0].includes(':::VERDICT:::');

        let markerResponses: any[];
        const parsed: any[] = [];
        if (hasMergedMarker) {
            markerResponses = rawResults.map((chunk) => {
                const lines = (chunk || '').split('\n');
                const errorLine = lines.find((l) => l.startsWith(':::ERROR:::'));
                if (errorLine) {
                    const errMsg = errorLine.slice(':::ERROR:::'.length).trim();
                    parsed.push({ output: errMsg, error: true });
                    return {
                        actualAnswer: errMsg,
                        isCorrect: false,
                        correctAnswer: '',
                        logs: errMsg
                    };
                }
                const resultLine = lines.find((l) => l.startsWith(':::RESULT:::'));
                const verdictLine = lines.find((l) => l.startsWith(':::VERDICT:::'));
                const answerLine = lines.find((l) => l.startsWith(':::ANSWER:::'));
                parsed.push({ output: resultLine?.slice(':::RESULT:::'.length).trim() ?? '', error: false });
                return {
                    actualAnswer: resultLine ? resultLine.slice(':::RESULT:::'.length).trim() : '',
                    isCorrect: verdictLine ? verdictLine.slice(':::VERDICT:::'.length).trim() === 'true' : false,
                    correctAnswer: answerLine ? answerLine.slice(':::ANSWER:::'.length).trim() : '',
                    logs: lines
                        .filter((l) =>
                            !l.startsWith(':::RESULT:::') &&
                            !l.startsWith(':::VERDICT:::') &&
                            !l.startsWith(':::ANSWER:::') &&
                            !l.startsWith(':::ERROR:::')
                        )
                        .filter((l) => l.trim().length > 0)
                        .join('\n')
                };
            });
        } else {
            const parsedResults = rawResults.map((chunk) => {
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
            parsed.push(...parsedResults);
            const onlyOutputs = parsed.map((p) => p.output);
            const markerOutputs = onlyOutputs.map((o, i) => {
                if (parsed[i]?.error) {
                    const tc = testCases[i];
                    return tc.adjList || tc.input || '[]';
                }
                return o;
            });
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
                    isCorrect: false,
                    logs: ''
                }));
            }
            markerResponses = markerResponses.map((mr, i) => ({
                ...mr,
                isCorrect: parsed[i]?.error ? false : mr.isCorrect,
                logs: parsed[i]?.logs ?? ''
            }));
        }

        const finalResponse = testCases.map((tc, index) => ({
            ...tc,
            output: parsed[index]?.error ? parsed[index].output : ((markerResponses[index] as any)?.actualAnswer ?? markerResponses[index]?.output ?? 'No output'),
            logs: markerResponses[index]?.logs ?? '',
            isCorrect: markerResponses[index].isCorrect,
            correctAnswer: markerResponses[index].correctAnswer,
            error: null
        }));
        const accepted = markerResponses.every((m: any) => m.isCorrect);
        job.result = { accepted, totalTc, passedTc: (job.result?.passedTc ? job.result?.passedTc : 0) + testCases.length, results: finalResponse };
        job.status = 'completed';
    } catch (error: any) {
        if (error && error.toString() && error.toString().indexOf(TIMEOUT_MESSAGE) !== -1) {
            job.timeout = true;
            job.timeoutTestCase = timeoutTestcase;
            job.status = 'completed';
        } else {
            job.error = `Submission failed: details: ${error.message || error}`;
            job.status = 'error';
        }
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const { problemId, language, code, startTcNo } = await request.json();
    const id = genId();
    const job: SubmitJob = { id, status: 'pending', createdAt: Date.now() };
    jobs.set(id, job);
    executeSubmit(problemId, language, code, Number(startTcNo) || 0, job);
    return json({ jobId: id });
};

export const GET: RequestHandler = async ({ url }) => {
    const jobId = url.searchParams.get('jobId') || '';
    const job = jobs.get(jobId);
    if (!job) return json({ error: 'Job not found' }, { status: 404 });
    if (job.status === 'pending' || job.status === 'running') {
        return json({ ready: false, status: job.status, passedTc: job.result?.passedTc });
    }
    if (job.timeout) {
        return json({ ready: true, timeout: true, timeoutTestCase: job.timeoutTestCase });
    }
    if (job.status === 'error') {
        return json({ ready: true, error: job.error || 'Submission failed' }, { status: 400 });
    }
    return json({ ready: true, ...(job.result || {}) });
};
