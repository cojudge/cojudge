import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import { ProgramRunner } from "./ProgramRunner";
import fs from 'fs/promises';
import path from 'path';
import { cppImage, cppListNodeClass, generateCppRunner, cppTreeNodeClass } from "$lib/utils/cppUtil";
import tar from 'tar-stream';

const docker = new Dockerode();

export class CppRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private compiled = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    // Step 1: prepare and compile inside a container (no host bind mount)
    async compile(): Promise<void> {
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const solutionCode = `
            #include "ListNode.cpp"
            #include "TreeNode.cpp"
            ${this.code}
            `;
            const runnerCode = generateCppRunner(problemData.functionName, problemData.params, this.testCases);
            await ensureImageAvailable(docker, cppImage);

            // Create a long-lived container, we'll exec to compile/run
            this.container = await docker.createContainer({
                Image: cppImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false
            });
            await this.container.start();

            // Upload sources via tar archive
            const pack = tar.pack();
            pack.entry({ name: 'ListNode.cpp' }, Buffer.from(cppListNodeClass));
            pack.entry({ name: 'TreeNode.cpp' }, Buffer.from(cppTreeNodeClass));
            pack.entry({ name: 'Solution.cpp' }, Buffer.from(solutionCode));
            pack.entry({ name: 'Main.cpp' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            // Compile with the original command via exec
            const exec = await this.container.exec({
                Cmd: ['timeout', '7', '/bin/sh', '-c', 'g++ -std=c++17 -O2 -pipe -s -o main Main.cpp'],
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
            this.cleanup();
            throw e;
        }
    }

    // Step 2: run previously compiled program
    async run(): Promise<string[]> {
        if (!this.container || !this.compiled) {
            throw new Error('CppRunner: not compiled. Call compile() first.');
        }
        try {
            // Run with the original command via exec
            const exec = await this.container.exec({
                Cmd: ['timeout', '2', '/bin/sh', '-c', './main'],
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
        this.compiled = false;
    }
}
