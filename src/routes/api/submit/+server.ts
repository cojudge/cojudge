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
import { TIMEOUT_MESSAGE } from '$lib/utils/util';

export const POST: RequestHandler = async ({ request }) => {
    const { problemId, language, code, startTcNo } = await request.json();
    let timeoutTestcase: any = null;

    try {
        await fs.mkdir(path.join(__dirname, 'temp'));
    } catch (err) {}
    try {
        const problemPath = path.resolve('problems', problemId, 'metadata.json');
        const problemContent = await fs.readFile(problemPath, 'utf-8');
        const problemData = JSON.parse(problemContent);

        // Prefer official tests when available
        let officialTestsPath = path.resolve('problems', problemId, 'official-tests.json');
        let testCases: any[] = [];
        let totalTc = 0;
        let passedTc = 0;
        try {
            const officialContent = await fs.readFile(officialTestsPath, 'utf-8');
            testCases = JSON.parse(officialContent);
            totalTc = testCases.length;
            if (startTcNo >= totalTc) {
                return json({ allAccepted: true });
            }
            let tcNo = startTcNo;
            const newTestCases = [testCases[tcNo]]
            // Set the default timeout test case to the first in this chunk
            timeoutTestcase = newTestCases[0];
            while (!testCases[tcNo]._isLargeTest && tcNo + 1 < testCases.length && !testCases[tcNo + 1]._isLargeTest) {
                newTestCases.push(testCases[tcNo + 1]);
                tcNo++;
            }
            testCases = newTestCases
            passedTc = newTestCases.length
            // Evaluate any @javascript: fields in the test cases
            const JAVASCRIPT_PREFIX = '@javascript:';
            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                if (tc && typeof tc === 'object') {
                    for (const k of Object.keys(tc)) {
                        const v = tc[k];
                        if (typeof v === 'string' && v.startsWith(JAVASCRIPT_PREFIX)) {
                            const expr = v.slice(JAVASCRIPT_PREFIX.length);
                            try {
                                // run in a minimal sandbox; do not expose require or other host globals
                                const evaluated = vm.runInNewContext(expr, {}, { timeout: 2000 });
                                if (typeof evaluated === 'string') {
                                    tc[k] = evaluated;
                                } else if (typeof evaluated === 'object') {
                                    tc[k] = JSON.stringify(evaluated);
                                } else {
                                    tc[k] = String(evaluated);
                                }
                            } catch (e) {
                                // If eval fails, keep original string (without prefix) or the original v
                                try {
                                    tc[k] = v.replace(JAVASCRIPT_PREFIX, '');
                                } catch (ee) {
                                    // leave as-is
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            // fallback to problem's sample test cases
            testCases = problemData.testCases || [];
        }

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
        await programRunner.compile();
        const rawResults = await programRunner.run();
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
        const markerResponses = await getMarkerResponses(problemId, problemData.functionName, problemData.params, testCases, onlyOutputs, problemData.outputType)
        const finalResponse = testCases.map((tc, index) => ({
            ...tc,
            output: parsed[index]?.output ?? 'No output',
            logs: parsed[index]?.logs ?? '',
            isCorrect: markerResponses[index].isCorrect,
            correctAnswer: markerResponses[index].correctAnswer,
            error: null
        }));

        const accepted = markerResponses.every((m: any) => m.isCorrect);

        return json({ accepted, totalTc, passedTc: passedTc, results: finalResponse });
    } catch (error: any) {
        if (error && error.toString() && error.toString().indexOf(TIMEOUT_MESSAGE) !== -1) {
            return json({ timeout: true, timeoutTestCase: timeoutTestcase }, {status: 400});
        }
        return json({ error: `Submission failed: details: ${error.message}` }, { status: 400 });
    }
};
