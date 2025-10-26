import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE, type Param } from "$lib/utils/util";
import Dockerode from "dockerode";
import { ProgramRunner } from "./ProgramRunner";
import fs from 'fs/promises';
import path from 'path';
import { generateJavaRunner, javaImage, javaListNodeClass, javaTreeNodeClass } from "$lib/utils/javaUtil";
import { fileURLToPath } from "url";
const docker = new Dockerode();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class JavaRunner extends ProgramRunner {
    private tempDir: string | null = null;
    private compiled = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            await fs.mkdir(path.join(__dirname, 'temp'));
        } catch (err) {}
        this.tempDir = await fs.mkdtemp(path.join(__dirname, 'temp/run-'));
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);

            const runnerCode = generateJavaRunner(problemData.functionName, problemData.params, this.testCases, problemData.outputType);
            await fs.writeFile(path.join(this.tempDir, 'ListNode.java'), javaListNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'TreeNode.java'), javaTreeNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'Solution.java'), this.code);
            await fs.writeFile(path.join(this.tempDir, 'Main.java'), runnerCode);

            // Ensure Java image exists; pull it if missing
            await ensureImageAvailable(docker, javaImage);
            const container = await docker.createContainer({
                Image: javaImage,
                Cmd: ['timeout', '5', '/bin/sh', '-c', 'javac *.java'],
                WorkingDir: '/app',
                HostConfig: {
                    Binds: [`${this.tempDir}:/app`]
                },
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
                if (StatusCode == LINUX_TIMEOUT_CODE) {
                    throw new Error(TIMEOUT_MESSAGE);
                }
                if (StatusCode !== 0) {
                    throw new Error(stderr || stdout);
                }
                this.compiled = true;
            } finally {
                try {
                    const info = await container.inspect();
                    if (info.State.Running) {
                        await container.stop();
                    }
                    await container.remove();
                } catch {}
            }
        } catch (e) {
            await this.cleanup();
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.tempDir || !this.compiled) throw new Error('JavaRunner: not compiled. Call compile() first.');
        let container: any;
        try {
            await ensureImageAvailable(docker, javaImage);
            container = await docker.createContainer({
                Image: javaImage,
                Cmd: ['timeout', '2', '/bin/sh', '-c', 'java Main'],
                WorkingDir: '/app',
                HostConfig: {
                    Binds: [`${this.tempDir}:/app`]
                },
                Tty: false
            });

            await container.start();
            const { StatusCode } = await container.wait();
            if (StatusCode == LINUX_TIMEOUT_CODE) {
                throw new Error(TIMEOUT_MESSAGE);
            }

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

            if (StatusCode !== 0) {
                throw new Error(stderr || stdout);
            }
            const results = stdout.split('---\n').filter(res => res.trim() !== '');
            return results;
        } catch (error: any) {
            throw new Error(`${error}`);
        } finally {
            if (container) {
                try {
                    const containerInfo = await container.inspect();
                    if (containerInfo.State.Running) {
                        await container.stop();
                    }
                    await container.remove();
                } catch {}
            }
            await this.cleanup();
        }
    }

    private async cleanup() {
        if (this.tempDir) {
            try {
                await fs.rm(this.tempDir, { recursive: true, force: true });
            } catch {}
            this.tempDir = null;
            this.compiled = false;
        }
    }
}