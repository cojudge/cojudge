import { phpImage, generatePhpRunner, generatePhpClassSolution, phpGetTypeImports, phpListNodeClass, phpTreeNodeClass, phpGraphNodeClass } from "$lib/utils/phpUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE, type Param } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import tar from 'tar-stream';
import { resolveProblemFile } from "$lib/server/contentPaths";
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";
import { cojudgeContainerLabels } from "$lib/server/containerSession";

const docker = new Dockerode();

function stripPhpTag(code: string): string {
    return code.replace(/^\s*<\?php\s?/, '');
}

export class PhpRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private prepared = false;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    async compile(): Promise<void> {
        try {
            const problemPath = await resolveProblemFile(this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);

            const runnerCode = generatePhpRunner(
                problemData.functionName, problemData.params, this.testCases, problemData.outputType, problemData.checkGraphClone, problemData.classProblem?.userClassName
            );

            this.container = await ContainerPool.acquire(phpImage);
            if (!this.container) {
                await ensureImageAvailable(docker, phpImage);
                this.container = await docker.createContainer({
                    Image: phpImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: cojudgeContainerLabels()
                });
                await this.container.start();
            }

            const typeImports = phpGetTypeImports(problemData.params, problemData.outputType);
            const prefix = `<?php\n${typeImports ? typeImports + '\n' : ''}`;
            const userCode = prefix + stripPhpTag(this.code);

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.php' }, Buffer.from(phpListNodeClass));
            pack.entry({ name: 'TreeNode.php' }, Buffer.from(phpTreeNodeClass));
            pack.entry({ name: 'GraphNode.php' }, Buffer.from(phpGraphNodeClass));
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                pack.entry({ name: `${className}.php` }, Buffer.from(userCode));
                const wrapperCode = generatePhpClassSolution(className, problemData.params, problemData.outputType);
                pack.entry({ name: 'Solution.php' }, Buffer.from(wrapperCode));
            } else {
                pack.entry({ name: 'Solution.php' }, Buffer.from(userCode));
            }
            pack.entry({ name: 'main.php' }, Buffer.from(runnerCode));
            pack.finalize();
            await this.container.putArchive(pack as any, { path: '/app' });

            // Syntax-check user code early for a clear error message
            const lintTarget = problemData.classProblem ? problemData.classProblem.userClassName + '.php' : 'Solution.php';
            const lintExec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', `php -l ${lintTarget}`],
                AttachStdout: true,
                AttachStderr: true
            });
            const lintStream: any = await lintExec.start({ hijack: true, stdin: false });
            let lintOut = '';
            let lintErr = '';
            await new Promise((resolve, reject) => {
                (this.container as any).modem.demuxStream(
                    lintStream,
                    { write: (chunk: any) => (lintOut += chunk.toString()) },
                    { write: (chunk: any) => (lintErr += chunk.toString()) }
                );
                lintStream.on('end', resolve);
                lintStream.on('error', reject);
            });
            const lintInspect = await lintExec.inspect();
            if (lintInspect.ExitCode !== 0) {
                throw new Error(`Compilation failed:\n${lintErr || lintOut}`);
            }

            await ProgramRunner.ensureTimeInstalled(this.container);
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
        if (!this.prepared || !this.container) throw new Error('PhpRunner: not prepared. Call compile() first.');
        try {
            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', ProgramRunner.wrapWithMetrics('php main.php')],
                AttachStdout: true,
                AttachStderr: true
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
            const cleanedStderr = this.parseMetricsFromStderr(stderr);
            if (inspect.ExitCode === LINUX_TIMEOUT_CODE) throw new Error(TIMEOUT_MESSAGE);
            if (inspect.ExitCode !== 0) throw new Error(cleanedStderr || stdout);
            stdout = this.parseInternalTiming(stdout);
            const results = stdout.split('---\n').filter((res) => res.trim() !== '');
            return results;
        } catch (error: any) {
            throw new Error(`${error}`);
        } finally {
            if (this.container) {
                await ContainerPool.release(phpImage, this.container);
                this.container = null;
            }
            this.prepared = false;
        }
    }
}
