import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import { ProgramRunner } from "./ProgramRunner";
import fs from 'fs/promises';
import path from 'path';
import { generatePythonRunner, pythonImage, pythonListNodeClass, pythonTreeNodeClass } from "$lib/utils/pythonUtil";
import tar from 'tar-stream';

const docker = new Dockerode();

export class PythonRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private prepared = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    // For Python, compile prepares the container and uploads sources; no actual compilation
    async compile(): Promise<void> {
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const runnerCode = generatePythonRunner(problemData.functionName, problemData.params, this.testCases);
            const solutionCode = `from ListNode import ListNode\nfrom TreeNode import TreeNode\n${this.code}`;

            // Ensure Python image exists; pull if missing
            await ensureImageAvailable(docker, pythonImage);

            // Create a long-lived container; no bind mounts
            this.container = await docker.createContainer({
                Image: pythonImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false
            });
            await this.container.start();

            // Upload sources via in-memory tar archive
            const pack = tar.pack();
            pack.entry({ name: 'ListNode.py' }, Buffer.from(pythonListNodeClass));
            pack.entry({ name: 'TreeNode.py' }, Buffer.from(pythonTreeNodeClass));
            pack.entry({ name: 'Solution.py' }, Buffer.from(solutionCode));
            pack.entry({ name: 'main.py' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            this.prepared = true;
        } catch (e) {
            this.cleanup();
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.prepared || !this.container) throw new Error('PythonRunner: not prepared. Call compile() first.');
        try {
            // Run the program inside the prepared container with the exact Cmd array
            const exec = await this.container.exec({
                Cmd: ['timeout', '5', 'python', '-B', 'main.py'],
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
            this.cleanup();
        }
    }

    private async cleanup() {
        if (this.container) {
            try {
                const info = await this.container.inspect();
                if (info.State.Running) await this.container.stop();
                await this.container.remove();
            } catch {}
            this.container = null;
        }
        this.prepared = false;
    }
}
