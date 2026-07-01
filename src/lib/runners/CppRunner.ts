import { cppImage, cppListNodeClass, cppTreeNodeClass, cppGraphNodeClass, generateCppRunner, generateCppClassSolution } from "$lib/utils/cppUtil";
import { extractOperations } from "$lib/utils/util";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";

const docker = new Dockerode();

export class CppRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private compiled = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const runnerCode = generateCppRunner(problemData.functionName, problemData.params, this.testCases, problemData.checkGraphClone);

            this.container = await ContainerPool.acquire(cppImage);
            if (!this.container) {
                await ensureImageAvailable(docker, cppImage);
                this.container = await docker.createContainer({
                    Image: cppImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: { 'cojudge.created': 'true' }
                });
                await this.container.start();
            }

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.cpp' }, Buffer.from(cppListNodeClass));
            pack.entry({ name: 'TreeNode.cpp' }, Buffer.from(cppTreeNodeClass));
            pack.entry({ name: 'GraphNode.cpp' }, Buffer.from(cppGraphNodeClass));
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                const operations = extractOperations(this.testCases, className);
                const wrapperCode = generateCppClassSolution(className, problemData.params, problemData.outputType, operations);
                const userCode = this.code;
                pack.entry({ name: `${className}.cpp` }, Buffer.from(userCode));
                pack.entry({ name: 'Solution.cpp' }, Buffer.from(wrapperCode));
            } else {
                const solutionCode = this.code;
                pack.entry({ name: 'Solution.cpp' }, Buffer.from(solutionCode));
            }
            pack.entry({ name: 'Main.cpp' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'g++ -std=c++17 -O2 -pipe -g -rdynamic -o main Main.cpp'],
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
            if (inspect.ExitCode === LINUX_TIMEOUT_CODE) throw new Error(TIMEOUT_MESSAGE);
            if (inspect.ExitCode !== 0) throw new Error(stderr || stdout);
            this.compiled = true;
        } catch (e) {
            if (this.container) {
                await ContainerPool.markForCleanup(this.container);
                this.container = null;
            }
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.container || !this.compiled) {
            throw new Error('CppRunner: not compiled. Call compile() first.');
        }
        try {
            const exec = await this.container.exec({
                Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', './main'],
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
            if (inspect.ExitCode === LINUX_TIMEOUT_CODE) throw new Error(TIMEOUT_MESSAGE);
            if (inspect.ExitCode !== 0) throw new Error(stderr || stdout);
            const results = stdout.split('---\n').filter((res) => res.trim() !== '');
            return results;
        } catch (error: any) {
            throw new Error(`${error}`);
        } finally {
            if (this.container) {
                await ContainerPool.release(cppImage, this.container);
                this.container = null;
            }
            this.compiled = false;
        }
    }
}
