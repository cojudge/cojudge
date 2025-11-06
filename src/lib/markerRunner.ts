import fs from 'fs/promises';
import path from 'path';
import Dockerode from 'dockerode';
import tar from 'tar-stream';
import { formatAndSplitJavaString, getDisplayFuncName, javaGetFullParam, javaHelperMethods, javaImage, javaListNodeClass, javaTreeNodeClass } from './utils/javaUtil';
import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE, type Param } from './utils/util';

const docker = new Dockerode();

export type MarkerResponse = {
    actualAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

export async function getMarkerResponses(problemId: string, functionName: string, params: Param[], testCases: any, outputs: string[], outputType: string): Promise<MarkerResponse[]> {
    const testCalls = testCases
    .map((tc: any, i: number) => {
        let fullParam = javaGetFullParam(params, tc);
        const out = formatAndSplitJavaString(outputs[i].trim());
        const toFunc = `to_${outputType}`;
        return `System.out.println(marker.isCorrect(${fullParam}, ${toFunc}(${out})));
            System.out.println(${getDisplayFuncName(outputType)}(marker.${functionName}(${fullParam})));\n                    System.out.println("---");`;
    })
    .join('\n        ');

    const runner = `
    import java.util.*;
    public class Main {
        ${javaHelperMethods}
        public static void main(String[] args) throws Exception {
            Marker marker = new Marker();
            ${testCalls}
        }
    }`;
    const markerPath = path.resolve('problems', problemId, 'Marker.java');
    const markerCode = await fs.readFile(markerPath, 'utf-8');
    await ensureImageAvailable(docker, javaImage);
    let container: Dockerode.Container | null = null;
    const cleanup = async() => {
        if (container) {
            try {
                const info = await container.inspect();
                if (info.State.Running) {
                    await container.stop();
                }
                await container.remove();
            } catch {}
        }
    }
    try {
        // Create container that stays up for execs
        container = await docker.createContainer({
            Image: javaImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false
        });
        await container.start();

        // Upload sources via in-memory tar
        const pack = tar.pack();
        pack.entry({ name: 'ListNode.java' }, Buffer.from(javaListNodeClass));
        pack.entry({ name: 'TreeNode.java' }, Buffer.from(javaTreeNodeClass));
        pack.entry({ name: 'Marker.java' }, Buffer.from(markerCode));
        pack.entry({ name: 'Main.java' }, Buffer.from(runner));
        pack.finalize();
        await container.putArchive(pack as any, { path: '/app' });

        // Compile
        const compileExec = await container.exec({
            Cmd: ['timeout', '5', '/bin/sh', '-c', 'javac *.java'],
            AttachStdout: true,
            AttachStderr: true
        });
        const cstream: any = await compileExec.start({ hijack: true, stdin: false });
        let cstdout = '';
        let cstderr = '';
        await new Promise((resolve, reject) => {
            (container as any).modem.demuxStream(
                cstream,
                { write: (chunk: any) => (cstdout += chunk.toString()) },
                { write: (chunk: any) => (cstderr += chunk.toString()) }
            );
            cstream.on('end', resolve);
            cstream.on('error', reject);
        });
        const cinspect = await compileExec.inspect();
        if (cinspect.ExitCode === LINUX_TIMEOUT_CODE) {
            throw new Error(TIMEOUT_MESSAGE);
        }
        if (cinspect.ExitCode !== 0) {
            throw new Error(cstderr || cstdout);
        }

        const runExec = await container.exec({
            Cmd: ['timeout', '2', '/bin/sh', '-c', 'java Main'],
            AttachStdout: true,
            AttachStderr: true
        });
        const rstream: any = await runExec.start({ hijack: true, stdin: false });
        let rstdout = '';
        let rstderr = '';
        await new Promise((resolve, reject) => {
            (container as any).modem.demuxStream(
                rstream,
                { write: (chunk: any) => (rstdout += chunk.toString()) },
                { write: (chunk: any) => (rstderr += chunk.toString()) }
            );
            rstream.on('end', resolve);
            rstream.on('error', reject);
        });
        const rinspect = await runExec.inspect();
        if (rinspect.ExitCode === LINUX_TIMEOUT_CODE) {
            throw new Error(TIMEOUT_MESSAGE);
        }
        if (rinspect.ExitCode !== 0) {
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
        cleanup();
    }
}


