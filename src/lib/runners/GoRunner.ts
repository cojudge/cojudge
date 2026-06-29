import { goImage, generateGoRunner, generateGoClassSolution } from "$lib/utils/goUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";

const docker = new Dockerode();

export class GoRunner extends ProgramRunner {
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

            const className = problemData.classProblem?.userClassName;
            const runnerCode = generateGoRunner(problemData.functionName, problemData.params, this.testCases, problemData.outputType, className, problemData.checkGraphClone);

            this.container = await ContainerPool.acquire(goImage);
            if (!this.container) {
                await ensureImageAvailable(docker, goImage);
                this.container = await docker.createContainer({
                    Image: goImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: { 'cojudge.created': 'true' }
                });
                await this.container.start();

                const initExec = await this.container.exec({
                    Cmd: ['/bin/sh', '-c', 'go mod init solution'],
                    AttachStdout: true,
                    AttachStderr: true
                });
                const initStream: any = await initExec.start({ hijack: true, stdin: false });
                await new Promise((resolve, reject) => {
                    initStream.on('end', resolve);
                    initStream.on('error', reject);
                    initStream.resume();
                });
            }

            const pack = tar.pack();
            pack.entry({ name: 'solution.go' }, Buffer.from(this.code));
            pack.entry({ name: 'main.go' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'go build -o main .'],
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
            throw new Error('GoRunner: not compiled. Call compile() first.');
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
                await ContainerPool.release(goImage, this.container);
                this.container = null;
            }
            this.compiled = false;
        }
    }
}
