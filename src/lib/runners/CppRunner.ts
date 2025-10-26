import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import { ProgramRunner } from "./ProgramRunner";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";
import { cppImage, cppListNodeClass, generateCppRunner, cppTreeNodeClass } from "$lib/utils/cppUtil";

const docker = new Dockerode();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CppRunner extends ProgramRunner {
    private tempDir: string | null = null;
    private compiled = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    // Step 1: compile (generate files and build with g++)
    async compile(): Promise<void> {
        try { await fs.mkdir(path.join(__dirname, 'temp')); } catch {}
        this.tempDir = await fs.mkdtemp(path.join(__dirname, 'temp/run-'));

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
            await fs.writeFile(path.join(this.tempDir, 'ListNode.cpp'), cppListNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'TreeNode.cpp'), cppTreeNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'Solution.cpp'), solutionCode);
            await fs.writeFile(path.join(this.tempDir, 'Main.cpp'), runnerCode);

            await ensureImageAvailable(docker, cppImage);
            const container = await docker.createContainer({
                Image: cppImage,
                Cmd: ['timeout', '7', '/bin/sh', '-c', 'g++ -std=c++17 -O2 -pipe -s -o main Main.cpp'],
                WorkingDir: '/app',
                HostConfig: { Binds: [`${this.tempDir}:/app`] },
                User: `${process.getuid?.() ?? 1000}:${process.getgid?.() ?? 1000}`,
                Tty: false
            });
            try {
                await container.start();
                const { StatusCode } = await container.wait();
                const logStream = await container.logs({ stdout: true, stderr: true, follow: true });
                let stdout = '';
                let stderr = '';
                const streamPromise = new Promise((resolve, reject) => {
                    container.modem.demuxStream(
                        logStream,
                        { write: (chunk: any) => (stdout += chunk.toString()) },
                        { write: (chunk: any) => (stderr += chunk.toString()) }
                    );
                    logStream.on('end', resolve);
                    logStream.on('error', reject);
                });
                await streamPromise;
                if (StatusCode == LINUX_TIMEOUT_CODE) throw new Error(TIMEOUT_MESSAGE);
                if (StatusCode !== 0) throw new Error(stderr || stdout);
                this.compiled = true;
            } finally {
                try {
                    const info = await container.inspect();
                    if (info.State.Running) await container.stop();
                    await container.remove();
                } catch {}
            }
        } catch (e) {
            await this.cleanup();
            throw e;
        }
    }

    // Step 2: run previously compiled program
    async run(): Promise<string[]> {
        if (!this.tempDir || !this.compiled) {
            throw new Error('CppRunner: not compiled. Call compile() first.');
        }
        let container: any;
        try {
            await ensureImageAvailable(docker, cppImage);
            container = await docker.createContainer({
                Image: cppImage,
                Cmd: ['timeout', '1', '/bin/sh', '-c', './main'],
                WorkingDir: '/app',
                HostConfig: { Binds: [`${this.tempDir}:/app`] },
                User: `${process.getuid?.() ?? 1000}:${process.getgid?.() ?? 1000}`,
                Tty: false
            });

            await container.start();
            const { StatusCode } = await container.wait();
            if (StatusCode == LINUX_TIMEOUT_CODE) throw new Error(TIMEOUT_MESSAGE);

            const logStream = await container.logs({ stdout: true, stderr: true, follow: true });
            let stdout = '';
            let stderr = '';
            const streamPromise = new Promise((resolve, reject) => {
                container.modem.demuxStream(
                    logStream,
                    { write: (chunk: any) => (stdout += chunk.toString()) },
                    { write: (chunk: any) => (stderr += chunk.toString()) }
                );
                logStream.on('end', resolve);
                logStream.on('error', reject);
            });
            await streamPromise;
            if (StatusCode !== 0) throw new Error(stderr || stdout);
            const results = stdout.split('---\n').filter((res) => res.trim() !== '');
            return results;
        } catch (error: any) {
            throw new Error(`${error}`);
        } finally {
            if (container) {
                try {
                    const info = await container.inspect();
                    if (info.State.Running) await container.stop();
                    await container.remove();
                } catch {}
            }
            await this.cleanup();
        }
    }

    private async cleanup() {
        if (this.tempDir) {
            try { await fs.rm(this.tempDir, { recursive: true, force: true }); } catch {}
            this.tempDir = null;
            this.compiled = false;
        }
    }
}
