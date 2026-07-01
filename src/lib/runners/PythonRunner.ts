import { generatePythonRunner, generatePythonClassSolution, pythonImage, pythonListNodeClass, pythonTreeNodeClass, pythonGraphNodeClass } from "$lib/utils/pythonUtil";
import { extractOperations } from "$lib/utils/util";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";

const docker = new Dockerode();

export class PythonRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private prepared = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const runnerCode = generatePythonRunner(problemData.functionName, problemData.params, this.testCases, problemData.checkGraphClone);

            this.container = await ContainerPool.acquire(pythonImage);
            if (!this.container) {
                await ensureImageAvailable(docker, pythonImage);
                this.container = await docker.createContainer({
                    Image: pythonImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: { 'cojudge.created': 'true' }
                });
                await this.container.start();
            }

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.py' }, Buffer.from(pythonListNodeClass));
            pack.entry({ name: 'TreeNode.py' }, Buffer.from(pythonTreeNodeClass));
            pack.entry({ name: 'GraphNode.py' }, Buffer.from(pythonGraphNodeClass));
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                const operations = extractOperations(this.testCases, className);
                const wrapperCode = generatePythonClassSolution(className, problemData.params, problemData.outputType, operations);
                pack.entry({ name: `${className}.py` }, Buffer.from(this.code));
                pack.entry({ name: 'Solution.py' }, Buffer.from(wrapperCode));
            } else {
                pack.entry({ name: 'Solution.py' }, Buffer.from(this.code));
            }
            pack.entry({ name: 'main.py' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            this.prepared = true;
        } catch (e) {
            if (this.container) {
                await ContainerPool.markForCleanup(this.container);
                this.container = null;
            }
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.prepared || !this.container) throw new Error('PythonRunner: not prepared. Call compile() first.');
        try {
            const exec = await this.container.exec({
                Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, 'python', '-B', 'main.py'],
                AttachStdout: true,
                AttachStderr: true,
                WorkingDir: '/app',
                Env: ['PYTHONDONTWRITEBYTECODE=1']
            } as any);
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
                await ContainerPool.release(pythonImage, this.container);
                this.container = null;
            }
            this.prepared = false;
        }
    }
}
