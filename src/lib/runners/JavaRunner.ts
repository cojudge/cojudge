import { generateJavaRunner, generateJavaRunnerWithMarker, generateJavaClassSolution, javaImage, javaListNodeClass, javaTreeNodeClass, javaGraphNodeClass } from "$lib/utils/javaUtil";
import { extractOperations } from "$lib/utils/util";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";
const docker = new Dockerode();

export class JavaRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private compiled = false;
    private useMarker = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);

            let runnerCode: string;
            const markerPath = path.resolve('problems', this.problemId, 'Marker.java');
            let hasMarker = false;
            try {
                await fs.access(markerPath);
                hasMarker = true;
            } catch {}

            if (hasMarker) {
                this.useMarker = true;
                runnerCode = generateJavaRunnerWithMarker(
                    problemData.functionName, problemData.params, this.testCases, problemData.outputType, problemData.checkGraphClone
                );
            } else {
                runnerCode = generateJavaRunner(
                    problemData.functionName, problemData.params, this.testCases, problemData.outputType, problemData.checkGraphClone
                );
            }

            this.container = await ContainerPool.acquire(javaImage);
            if (!this.container) {
                await ensureImageAvailable(docker, javaImage);
                this.container = await docker.createContainer({
                    Image: javaImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: { 'cojudge.created': 'true' }
                });
                await this.container.start();
            }

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.java' }, Buffer.from(javaListNodeClass));
            pack.entry({ name: 'TreeNode.java' }, Buffer.from(javaTreeNodeClass));
            pack.entry({ name: 'GraphNode.java' }, Buffer.from(javaGraphNodeClass));
            if (hasMarker) {
                const markerCode = await fs.readFile(markerPath, 'utf-8');
                pack.entry({ name: 'Marker.java' }, Buffer.from(markerCode));
            }
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                const operations = extractOperations(this.testCases, className);
                const wrapperCode = generateJavaClassSolution(className, problemData.params, problemData.outputType, operations);
                pack.entry({ name: `${className}.java` }, Buffer.from(this.code));
                pack.entry({ name: 'Solution.java' }, Buffer.from(wrapperCode));
            } else {
                pack.entry({ name: 'Solution.java' }, Buffer.from(this.code));
            }
            pack.entry({ name: 'Main.java' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'javac *.java'],
                AttachStdout: true,
                AttachStderr: true
            });
            const stream: any = await exec.start({ hijack: true, stdin: false });
            let stdout = '';
            let stderr = '';
            await new Promise((resolve, reject) => {
                (this.container as any).modem.demuxStream(
                    stream,
                    { write: (chunk: any) => (stdout += chunk.toString()) },
                    { write: (chunk: any) => (stderr += chunk.toString()) }
                );
                stream.on('end', resolve);
                stream.on('error', reject);
            });
            const inspect = await exec.inspect();
            if (inspect.ExitCode === LINUX_TIMEOUT_CODE) {
                throw new Error(TIMEOUT_MESSAGE);
            }
            if (inspect.ExitCode !== 0) {
                throw new Error(stderr || stdout);
            }
            this.compiled = true;
        } catch (e) {
            await ContainerPool.markForCleanup(this.container!);
            this.container = null;
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.compiled || !this.container) throw new Error('JavaRunner: not compiled. Call compile() first.');
        try {
            const exec = await this.container.exec({
                Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'java Main'],
                AttachStdout: true,
                AttachStderr: true
            });
            const stream: any = await exec.start({ hijack: true, stdin: false });
            let stdout = '';
            let stderr = '';
            await new Promise((resolve, reject) => {
                (this.container as any).modem.demuxStream(
                    stream,
                    { write: (chunk: any) => (stdout += chunk.toString()) },
                    { write: (chunk: any) => (stderr += chunk.toString()) }
                );
                stream.on('end', resolve);
                stream.on('error', reject);
            });
            const inspect = await exec.inspect();
            if (inspect.ExitCode === LINUX_TIMEOUT_CODE) {
                throw new Error(TIMEOUT_MESSAGE);
            }
            if (inspect.ExitCode !== 0) {
                throw new Error(stderr || stdout);
            }
            const results = stdout.split('---\n').filter(res => res.trim() !== '');
            return results;
        } catch (error: any) {
            throw new Error(`${error}`);
        } finally {
            if (this.container) {
                await ContainerPool.release(javaImage, this.container);
                this.container = null;
            }
            this.compiled = false;
        }
    }
}
