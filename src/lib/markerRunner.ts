import fs from 'fs/promises';
import Dockerode from 'dockerode';
import { resolveProblemFile } from './server/contentPaths';
import tar from 'tar-stream';
import { JAVAC, formatAndSplitJavaString, getDisplayFuncName, javaGetFullParam, javaHelperMethods, javaImage, javaListNodeClass, javaTreeNodeClass, javaGraphNodeClass } from './utils/javaUtil';
import { isTranscriptKind } from './utils/interactiveUtil';
import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE, type Param } from './utils/util';
import ContainerPool from './runners/ContainerPool';
import { cojudgeContainerLabels } from './server/containerSession';

const docker = new Dockerode();

export type MarkerResponse = {
    actualAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

/** File (in the container's /app) the marker harness reads runner outputs from. */
export const MARKER_OUTPUTS_FILE = '__marker_outputs.txt';

/**
 * Marker harness compiled ahead of time. The generated Main no longer inlines
 * the user's outputs as string literals: it reads them (base64, one per line)
 * from MARKER_OUTPUTS_FILE. That makes the source independent of the user's
 * program, so `javac` of Marker + Main (~1s+) can run in parallel with the
 * user's compile + run instead of after it.
 */
export type PreparedMarker = {
    judge(outputs: string[]): Promise<MarkerResponse[]>;
    /** Release the container if judge() is never called (e.g. compile error/TLE). */
    dispose(): void;
};

type MarkerBuild = { container: Dockerode.Container; cstderr: string };

export function prepareMarker(problemId: string, functionName: string, params: Param[], testCases: any, outputType: string): PreparedMarker {
    let settled = false;
    let container: Dockerode.Container | null = null;
    const release = async () => {
        if (container) {
            const c = container;
            container = null;
            await ContainerPool.release(javaImage, c);
        }
    };
    const build: Promise<MarkerBuild> = (async () => {
        try {
            const runner = await generateMarkerMain(problemId, functionName, params, testCases, outputType);
            const markerPath = await resolveProblemFile(problemId, 'Marker.java');
            const markerCode = await fs.readFile(markerPath, 'utf-8');
            container = await ContainerPool.acquire(javaImage);
            if (!container) {
                await ensureImageAvailable(docker, javaImage);
                container = await docker.createContainer({
                    Image: javaImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: cojudgeContainerLabels()
                });
                await container.start();
            }

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.java' }, Buffer.from(javaListNodeClass));
            pack.entry({ name: 'TreeNode.java' }, Buffer.from(javaTreeNodeClass));
            pack.entry({ name: 'GraphNode.java' }, Buffer.from(javaGraphNodeClass));
            pack.entry({ name: 'Marker.java' }, Buffer.from(markerCode));
            pack.entry({ name: 'Main.java' }, Buffer.from(runner));
            pack.finalize();
            await container.putArchive(pack as any, { path: '/app' });

            const { exitCode, stdout: cstdout, stderr: cstderr } = await execCapture(container, ['/bin/sh', '-c', `${JAVAC} *.java`]);
            if (exitCode === LINUX_TIMEOUT_CODE) {
                throw new Error(TIMEOUT_MESSAGE);
            }
            if (exitCode !== 0) {
                throw new Error(cstderr || cstdout);
            }
            return { container, cstderr };
        } catch (e) {
            await release();
            throw e;
        }
    })();
    // Errors surface from judge(); never as an unhandled rejection.
    build.catch(() => {});

    return {
        async judge(outputs: string[]): Promise<MarkerResponse[]> {
            if (settled) throw new Error('PreparedMarker: already used');
            settled = true;
            try {
                const { container: c, cstderr } = await build;
                const encoded = testCases.map((_: any, i: number) => {
                    let out: any = outputs[i] ?? '';
                    if (typeof out !== 'string') out = JSON.stringify(out);
                    return Buffer.from(out, 'utf8').toString('base64');
                }).join('\n') + '\n';
                const pack = tar.pack();
                pack.entry({ name: MARKER_OUTPUTS_FILE }, Buffer.from(encoded));
                pack.finalize();
                await c.putArchive(pack as any, { path: '/app' });

                const { exitCode, stdout: rstdout, stderr: rstderr } = await execCapture(c, ['timeout', '15', '/bin/sh', '-c', `java Main; __rc=$?; rm -f ${MARKER_OUTPUTS_FILE}; exit $__rc`]);
                if (exitCode === LINUX_TIMEOUT_CODE) {
                    throw new Error(TIMEOUT_MESSAGE);
                }
                if (exitCode !== 0) {
                    throw new Error(rstderr || rstdout);
                }

                const combinedStderr = (cstderr || '') + (rstderr || '');
                if (combinedStderr) {
                    throw new Error(combinedStderr);
                }

                const results = rstdout.split('---\n').filter(res => res.trim() !== '');
                return results.map((x, i) => {
                    const arr = x.split('\n');
                    return {
                        actualAnswer: outputs[i],
                        isCorrect: arr[0] === 'true',
                        correctAnswer: arr[1]
                    } as MarkerResponse;
                });
            } finally {
                await release();
            }
        },
        dispose() {
            if (settled) return;
            settled = true;
            void build.then(release, () => {});
        }
    };
}

export async function getMarkerResponses(problemId: string, functionName: string, params: Param[], testCases: any, outputs: string[], outputType: string, prepared?: PreparedMarker | null): Promise<MarkerResponse[]> {
    const marker = prepared ?? prepareMarker(problemId, functionName, params, testCases, outputType);
    return marker.judge(outputs);
}

async function generateMarkerMain(problemId: string, functionName: string, params: Param[], testCases: any, outputType: string): Promise<string> {
    // Interactive problems (e.g. guess-word): outputs[i] is a harness-generated
    // transcript "solved:N"/"failed:N". Marker.isCorrect(wordlist, secret, transcript)
    // validates it; the correct answer shown is the secret itself.
    // Return-value judge kinds (guess-number, first-bad, array-reader,
    // mountain-array, celebrity) behave like standard problems: outputs[i] is
    // the integer answer (or "over-budget:N", which fails to parse as int and
    // is therefore rejected), graded by Marker.isCorrect.
    let interactive: any = null;
    try {
        const metaPath = await resolveProblemFile(problemId, 'metadata.json');
        const metaContent = await fs.readFile(metaPath, 'utf-8');
        const meta = JSON.parse(metaContent);
        if (meta?.interactive?.secretField && isTranscriptKind(String(meta.interactive.kind ?? 'guess-word'))) interactive = meta.interactive;
    } catch {}
    const testCalls = testCases
    .map((tc: any, i: number) => {
        let fullParam = javaGetFullParam(params, tc);
        // The output is read verbatim from the outputs file (no trimming:
        // runner outputs are already exact and whitespace is significant).
        const out = `__outs[${i}]`;
        const toFunc = `to_${outputType}`;
        const displayFunc = getDisplayFuncName(outputType);
        if (interactive) {
            const secretVal = String(tc[interactive.secretField] ?? '');
            const secretLit = formatAndSplitJavaString(secretVal);
            return `try {
            System.out.println(marker.isCorrect(${fullParam}, ${toFunc}(${out})));
        } catch (Exception __e) {
            System.out.println("false");
        }
        System.out.println(${displayFunc}(${secretLit}));
        System.out.println("---");`;
        }
        return `try {
            System.out.println(marker.isCorrect(${fullParam}, ${toFunc}(${out})));
        } catch (Exception __e) {
            System.out.println("false");
        }
        System.out.println(${displayFunc}(marker.${functionName}(${fullParam})));
        System.out.println("---");`;
    })
    .join('\n        ');

    return `
    import java.util.*;
    public class Main {
        ${javaHelperMethods}
        private static String[] __readOutputs() throws Exception {
            List<String> lines = java.nio.file.Files.readAllLines(java.nio.file.Paths.get("${MARKER_OUTPUTS_FILE}"));
            String[] res = new String[lines.size()];
            for (int i = 0; i < res.length; i++) {
                res[i] = new String(Base64.getDecoder().decode(lines.get(i)), java.nio.charset.StandardCharsets.UTF_8);
            }
            return res;
        }
        public static void main(String[] args) throws Exception {
            String[] __outs = __readOutputs();
            Marker marker = new Marker();
            ${testCalls}
        }
    }`;
}

async function execCapture(container: Dockerode.Container, cmd: string[]): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
    const exec = await container.exec({ Cmd: cmd, AttachStdout: true, AttachStderr: true });
    const stream: any = await exec.start({ hijack: true, stdin: false });
    let stdout = '';
    let stderr = '';
    await new Promise((resolve, reject) => {
        (container as any).modem.demuxStream(
            stream,
            { write: (chunk: any) => (stdout += chunk.toString()) },
            { write: (chunk: any) => (stderr += chunk.toString()) }
        );
        stream.on('end', resolve);
        stream.on('error', reject);
    });
    const inspect = await exec.inspect();
    return { exitCode: inspect.ExitCode, stdout, stderr };
}
