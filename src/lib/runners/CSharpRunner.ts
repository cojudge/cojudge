import { generateCSharpRunner, generateCSharpClassSolution, csharpImage, csharpListNodeClass, csharpTreeNodeClass, csharpGraphNodeClass } from "$lib/utils/csharpUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
const docker = new Dockerode();

export class CSharpRunner extends ProgramRunner {
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
            const runnerCode = generateCSharpRunner(problemData.functionName, problemData.params, this.testCases, problemData.outputType);

            // Ensure C# image exists; pull it if missing
            await ensureImageAvailable(docker, csharpImage);

            this.container = await docker.createContainer({
                Image: csharpImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'], // keep container running for execs
                WorkingDir: '/app',
                Tty: false,
                Labels: { 'cojudge.created': 'true' }
            });
            await this.container.start();

            // Initialize a .NET project first
            const initExec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'dotnet new console'],
                AttachStdout: true,
                AttachStderr: true
            });
            const initStream: any = await initExec.start({ hijack: true, stdin: false });
            await new Promise((resolve, reject) => {
                initStream.on('end', resolve);
                initStream.on('error', reject);
                initStream.resume(); // Consume stream
            });

            // Create an in-memory tar archive of sources and upload to /app
            const pack = tar.pack();
            pack.entry({ name: 'ListNode.cs' }, Buffer.from(csharpListNodeClass));
            pack.entry({ name: 'TreeNode.cs' }, Buffer.from(csharpTreeNodeClass));
            pack.entry({ name: 'GraphNode.cs' }, Buffer.from(csharpGraphNodeClass));
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                const wrapperCode = generateCSharpClassSolution(className, problemData.params, problemData.outputType);
                pack.entry({ name: `${className}.cs` }, Buffer.from(this.code));
                pack.entry({ name: 'Solution.cs' }, Buffer.from(wrapperCode));
            } else {
                pack.entry({ name: 'Solution.cs' }, Buffer.from(this.code));
            }
            pack.entry({ name: 'Program.cs' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            // Compile inside the container
            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'dotnet build'],
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
        if (!this.compiled || !this.container) throw new Error('CSharpRunner: not compiled. Call compile() first.');
        try {
            const exec = await this.container.exec({
                Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'dotnet run --no-build'],
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