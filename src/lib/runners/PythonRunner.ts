import { ensureImageAvailable, LINUX_TIMEOUT_CODE, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import { ProgramRunner } from "./ProgramRunner";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";
import { generatePythonRunner, pythonImage, pythonListNodeClass, pythonTreeNodeClass } from "$lib/utils/pythonUtil";

const docker = new Dockerode();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PythonRunner extends ProgramRunner {
    private tempDir: string | null = null;

    constructor(problemId: string, testCases: any[], code: string) {
        super(problemId, testCases, code);
    }

    // For Python, compile is effectively a no-op build step; we just generate the files
    async compile(): Promise<void> {
        try { await fs.mkdir(path.join(__dirname, 'temp')); } catch {}
        this.tempDir = await fs.mkdtemp(path.join(__dirname, 'temp/run-'));
        try {
            const problemPath = path.resolve('problems', this.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);
            const runnerCode = generatePythonRunner(problemData.functionName, problemData.params, this.testCases);
            const solutionCode = `from ListNode import ListNode\nfrom TreeNode import TreeNode\n${this.code}`;
            await fs.writeFile(path.join(this.tempDir, 'ListNode.py'), pythonListNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'TreeNode.py'), pythonTreeNodeClass);
            await fs.writeFile(path.join(this.tempDir, 'Solution.py'), solutionCode);
            await fs.writeFile(path.join(this.tempDir, 'main.py'), runnerCode);
        } catch (e) {
            await this.cleanup();
            throw e;
        }
    }

    async run(): Promise<string[]> {
        if (!this.tempDir) throw new Error('PythonRunner: not prepared. Call compile() first.');
        let container: any;
        try {
            // Ensure the Python image is available locally; pull if missing
            await ensureImageAvailable(docker, pythonImage);
            container = await docker.createContainer({
                Image: pythonImage,
                Cmd: ['timeout', '5', 'python', '-B', 'main.py'],
                Env: ['PYTHONDONTWRITEBYTECODE=1'],
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
                container.modem.demuxStream(logStream, { write: (chunk: any) => (stdout += chunk.toString()) }, { write: (chunk: any) => (stderr += chunk.toString()) });
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
                    const containerInfo = await container.inspect();
                    if (containerInfo.State.Running) await container.stop();
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
        }
    }
}
