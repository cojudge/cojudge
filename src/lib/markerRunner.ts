import fs from 'fs/promises';
import path from 'path';
import Dockerode from 'dockerode';
import { fileURLToPath } from 'url';
import { formatAndSplitJavaString, getDisplayFuncName, javaGetFullParam, javaHelperMethods, javaImage, javaListNodeClass, javaTreeNodeClass } from './utils/javaUtil';
import { ensureImageAvailable, type Param } from './utils/util';

const docker = new Dockerode();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    try {
        await fs.mkdir(path.join(__dirname, 'temp'));
    } catch (err) {}
    const tempDir = await fs.mkdtemp(path.join(__dirname, 'temp/run-'));
    const markerPath = path.resolve('problems', problemId, 'Marker.java');
    const markerCode = await fs.readFile(markerPath, 'utf-8');

    await fs.writeFile(path.join(tempDir, 'ListNode.java'), javaListNodeClass);
    await fs.writeFile(path.join(tempDir, 'TreeNode.java'), javaTreeNodeClass);
    await fs.writeFile(path.join(tempDir, 'Marker.java'), markerCode);
    await fs.writeFile(path.join(tempDir, 'Main.java'), runner);
    await ensureImageAvailable(docker, javaImage);
    const container = await docker.createContainer({
        Image: javaImage,
        Cmd: ['/bin/sh', '-c', 'javac *.java && java Main'],
        WorkingDir: '/app',
        HostConfig: {
            Binds: [`${tempDir}:/app`]
        },
        Tty: false
    });

    await container.start();
    await container.wait();

    const logStream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true
    });

    let stdout = '';
    let stderr = '';

    const streamPromise = new Promise((resolve, reject) => {
        container.modem.demuxStream(logStream, { write: (chunk: any) => stdout += chunk.toString() }, { write: (chunk: any) => stderr += chunk.toString() });
        
        logStream.on('end', resolve);
        logStream.on('error', reject);
    });

    await streamPromise;

    const results = stdout.split('---\n').filter(res => res.trim() !== '');

    if (stderr) {
        throw new Error(stderr);
    }

    return results.map((x, i) => {
        const arr = x.split('\n');
        return {
            actualAnswer: outputs[i],
            isCorrect: arr[0] === 'true',
            correctAnswer: arr[1]
        } as MarkerResponse;
    });
}


