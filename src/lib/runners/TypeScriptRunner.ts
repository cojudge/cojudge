import { tsImage, generateTypeScriptRunner, tsGetTypeImports, tsListNodeClass, tsTreeNodeClass, tsGraphNodeClass } from "$lib/utils/tsUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE, type Param } from "$lib/utils/util";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import { ProgramRunner } from "./ProgramRunner";
import ContainerPool from "./ContainerPool";

const docker = new Dockerode();

export class TypeScriptRunner extends ProgramRunner {
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

            const hasMarker = false; // TypeScript doesn't use Marker.java pattern
            const runnerCode = generateTypeScriptRunner(
                problemData.functionName, problemData.params, this.testCases, problemData.outputType, problemData.checkGraphClone, problemData.classProblem?.userClassName
            );

            this.container = await ContainerPool.acquire(tsImage);
            if (!this.container) {
                await ensureImageAvailable(docker, tsImage);
                this.container = await docker.createContainer({
                    Image: tsImage,
                    Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                    WorkingDir: '/app',
                    Tty: false,
                    Labels: { 'cojudge.created': 'true' }
                });
                await this.container.start();

                const initExec = await this.container.exec({
                    Cmd: ['/bin/sh', '-c', 'npm init -y'],
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

            const typeImports = tsGetTypeImports(problemData.params, problemData.outputType);
            const prefix = typeImports ? typeImports + '\n' : '';

            const pack = tar.pack();
            pack.entry({ name: 'ListNode.ts' }, Buffer.from(tsListNodeClass));
            pack.entry({ name: 'TreeNode.ts' }, Buffer.from(tsTreeNodeClass));
            pack.entry({ name: 'GraphNode.ts' }, Buffer.from(tsGraphNodeClass));
            if (problemData.classProblem) {
                const className = problemData.classProblem.userClassName || 'MedianFinder';
                pack.entry({ name: `${className}.ts` }, Buffer.from(prefix + this.code));
                const wrapperCode = generateTypeScriptClassSolution(className, problemData.params, problemData.outputType);
                pack.entry({ name: 'Solution.ts' }, Buffer.from(prefix + wrapperCode));
            } else {
                pack.entry({ name: 'Solution.ts' }, Buffer.from(prefix + this.code));
            }
            pack.entry({ name: 'main.ts' }, Buffer.from(runnerCode));
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
        if (!this.prepared || !this.container) throw new Error('TypeScriptRunner: not prepared. Call compile() first.');
        try {
            const exec = await this.container.exec({
                Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'npx --yes tsx main.ts'],
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
                await ContainerPool.release(tsImage, this.container);
                this.container = null;
            }
            this.prepared = false;
        }
    }
}

function generateTypeScriptClassSolution(className: string, params?: Param[], outputType?: string): string {
    const importLine = `import { ${className} } from './${className}';`;
    if (params && params.length > 0 && params[0]?.type === 'tree_node') {
        return `
${importLine}
export class Solution {
    solve(root: TreeNode | null): TreeNode | null {
        const ser = new ${className}();
        const deser = new ${className}();
        return deser.deserialize(ser.serialize(root));
    }
}`;
    }
    if (params && params.length === 1 && params[0]?.type === 'string_array') {
        return `
${importLine}
export class Solution {
    solve(strs: string[]): string[] {
        const codec = new ${className}();
        const encoded = codec.encode(strs);
        return codec.decode(encoded);
    }
}`;
    }
    return `
${importLine}
export class Solution {
    solve(operations: string[], values: any[]): string[] {
        const result: string[] = [];
        let obj: any = null;
        for (let i = 0; i < operations.length; i++) {
            const op = operations[i];
            if (op === "${className}") {
                obj = new ${className}();
                result.push("null");
            } else if (op === "addNum") {
                obj.addNum(values[i][0]);
                result.push("null");
            } else if (op === "findMedian") {
                const med = obj.findMedian();
                if (med === Math.floor(med)) {
                    result.push(med.toFixed(0) + ".0");
                } else {
                    result.push(med.toString());
                }
            } else if (op === "addWord") {
                obj.addWord(values[i]);
                result.push("null");
            } else if (op === "insert") {
                obj.insert(values[i]);
                result.push("null");
            } else if (op === "search") {
                result.push(obj.search(values[i]).toString().toLowerCase());
            } else if (op === "startsWith") {
                result.push(obj.startsWith(values[i]).toString().toLowerCase());
            }
        }
        return result;
    }
}`;
}
