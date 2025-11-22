import { generateJavaRunner, javaImage, javaListNodeClass, javaTreeNodeClass } from "$lib/utils/javaUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
const docker = new Dockerode();

export class JavaRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private compiled = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            // Read problem metadata and generate runner code
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const runnerCode = generateJavaRunner(problemData.functionName, problemData.params, this.testCases, problemData.outputType);

            // Ensure Java image exists; pull it if missing
            await ensureImageAvailable(docker, javaImage);

            this.container = await docker.createContainer({
                Image: javaImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'], // keep container running for execs
                WorkingDir: '/app',
                Tty: false,
                Labels: { 'cojudge.created': 'true' }
            });
            await this.container.start();

            // Create an in-memory tar archive of sources and upload to /app
            const pack = tar.pack();
            pack.entry({ name: 'ListNode.java' }, Buffer.from(javaListNodeClass));
            pack.entry({ name: 'TreeNode.java' }, Buffer.from(javaTreeNodeClass));
            pack.entry({ name: 'Solution.java' }, Buffer.from(this.code));
            pack.entry({ name: 'Main.java' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            // Compile inside the container
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
            await this.cleanup();
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
            this.cleanup();
        }
    }

    private async cleanup() {
        if (this.container) {
            try {
                const info = await this.container.inspect();
                if (info.State.Running) {
                    await this.container.stop();
                }
                await this.container.remove();
            } catch {}
            this.container = null;
        }
        this.compiled = false;
    }
}