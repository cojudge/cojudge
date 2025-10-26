import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { getMarkerResponses } from '../../../lib/markerRunner';
import type { ProgramRunner } from '$lib/runners/ProgramRunner';
import { JavaRunner } from '$lib/runners/JavaRunner';
import { PythonRunner } from '$lib/runners/PythonRunner';
import { CppRunner } from '$lib/runners/CppRunner';
import { TIMEOUT_MESSAGE } from '$lib/utils/util';

export const POST: RequestHandler = async ({ request }) => {
    const { problemId, language, code, testCases } = await request.json();
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
        await programRunner.compile();
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
        const markerResponses = await getMarkerResponses(
            problemId,
            problemData.functionName,
            problemData.params,
            testCases,
            onlyOutputs,
            problemData.outputType
        );

        const finalResponse = testCases.map((tc: any, index: number) => ({
            ...tc,
            output: parsed[index]?.output ?? 'No output',
            logs: parsed[index]?.logs ?? '',
            isCorrect: markerResponses[index].isCorrect,
            correctAnswer: markerResponses[index].correctAnswer,
            error: null
        }));
        return json(finalResponse);
    } catch (error: any) {
        if (error && error.toString() && error.toString().indexOf(TIMEOUT_MESSAGE) !== -1) {
            return json({ timeout: true }, {status: 400});
        }
        return json({ error: `Execution failed: details: ${error}` }, { status: 400 });
    }
};