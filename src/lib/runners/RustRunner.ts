import { rustImage, generateRustRunner } from "$lib/utils/rustUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";

const docker = new Dockerode();

export class RustRunner extends ProgramRunner {
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
            
            const runnerCode = generateRustRunner(problemData.functionName, problemData.params, this.testCases, this.code);
            await ensureImageAvailable(docker, rustImage);

            this.container = await docker.createContainer({
                Image: rustImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: { 'cojudge.created': 'true' }
            });
            await this.container.start();

            const pack = tar.pack();
            pack.entry({ name: 'main.rs' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'rustc --edition 2021 -O main.rs -o main'],
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
            await this.cleanup();
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.container || !this.compiled) {
            throw new Error('RustRunner: not compiled. Call compile() first.');
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
            await this.cleanup();
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
