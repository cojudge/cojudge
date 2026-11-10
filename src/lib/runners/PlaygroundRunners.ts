import { cppImage } from "$lib/utils/cppUtil";
import { csharpImage } from "$lib/utils/csharpUtil";
import { goImage } from "$lib/utils/goUtil";
import { JAVAC, javaImage } from "$lib/utils/javaUtil";
import { phpImage } from "$lib/utils/phpUtil";
import { pythonImage } from "$lib/utils/pythonUtil";
import { rustImage } from "$lib/utils/rustUtil";
import { tsImage } from "$lib/utils/tsUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import tar from 'tar-stream';
import ContainerPool from "./ContainerPool";
import { TypeScriptRunner } from "./TypeScriptRunner";
import { cojudgeContainerLabels } from "$lib/server/containerSession";

const docker = new Dockerode();

export abstract class PlaygroundRunner {
    protected readonly code: string;
    protected abstract readonly image: string;
    protected container: Dockerode.Container | null = null;

    constructor(code: string) {
        this.code = code;
    }

    abstract compile(): Promise<void>;
    abstract run(stdin?: string): Promise<{ output: string; logs: string }>;

    /** Stage piped stdin as a file so the program can `<` redirect from it.
     *  Empty stdin yields immediate EOF (same as before). */
    protected async stageStdin(stdin: string = ''): Promise<void> {
        if (!this.container) throw new Error('Container not initialized');
        const stdinPack = tar.pack();
        stdinPack.entry({ name: 'cojudge_stdin.txt' }, Buffer.from(stdin ?? ''));
        stdinPack.finalize();
        await this.container.putArchive(stdinPack as any, { path: '/app' });
    }

    /** Return the held container to the pool (it is cleaned on release). */
    protected async releaseContainer(): Promise<void> {
        if (!this.container) return;
        const container = this.container;
        this.container = null;
        await ContainerPool.release(this.image, container);
    }

    /**
     * Drop a container still held after compile()/run() failed unexpectedly
     * (e.g. a Docker error). Its state is unknown, so it is not reused.
     * No-op after a normal run, timeout or compile error.
     */
    async dispose(): Promise<void> {
        if (!this.container) return;
        const container = this.container;
        this.container = null;
        await ContainerPool.markForCleanup(container);
    }
}

export class PlaygroundJavaRunner extends PlaygroundRunner {
    protected readonly image = javaImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(javaImage);
        if (!this.container) {
            await ensureImageAvailable(docker, javaImage);
            this.container = await docker.createContainer({
                Image: javaImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();
        }

        const pack = tar.pack();
        pack.entry({ name: 'Main.java' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', `${JAVAC} Main.java`],
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
        if (inspect.ExitCode !== 0) {
            // No user code ran, so the container is safe to reuse: hand it
            // back to the pool instead of leaking it until cleanupStale.
            await this.releaseContainer();
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);
        
        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'java Main < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(javaImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundPythonRunner extends PlaygroundRunner {
    protected readonly image = pythonImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(pythonImage);
        if (!this.container) {
            await ensureImageAvailable(docker, pythonImage);
            this.container = await docker.createContainer({
                Image: pythonImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();
        }

        const pack = tar.pack();
        pack.entry({ name: 'main.py' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);
        
        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'python3 main.py < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(pythonImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundCppRunner extends PlaygroundRunner {
    protected readonly image = cppImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(cppImage);
        if (!this.container) {
            await ensureImageAvailable(docker, cppImage);
            this.container = await docker.createContainer({
                Image: cppImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();
        }

        const pack = tar.pack();
        pack.entry({ name: 'main.cpp' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', 'g++ -std=c++17 -O2 -pipe -g -rdynamic -o main main.cpp'],
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
        if (inspect.ExitCode !== 0) {
            // No user code ran, so the container is safe to reuse: hand it
            // back to the pool instead of leaking it until cleanupStale.
            await this.releaseContainer();
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', './main < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(cppImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundCSharpRunner extends PlaygroundRunner {
    protected readonly image = csharpImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(csharpImage);
        if (!this.container) {
            await ensureImageAvailable(docker, csharpImage);
            this.container = await docker.createContainer({
                Image: csharpImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();

            const initExec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'dotnet new console'],
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
        pack.entry({ name: 'Program.cs' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

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
        if (inspect.ExitCode !== 0) {
            // No user code ran, so the container is safe to reuse: hand it
            // back to the pool instead of leaking it until cleanupStale.
            await this.releaseContainer();
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'dotnet run --no-build < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(csharpImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundRustRunner extends PlaygroundRunner {
    protected readonly image = rustImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(rustImage);
        if (!this.container) {
            await ensureImageAvailable(docker, rustImage);
            this.container = await docker.createContainer({
                Image: rustImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();
        }

        const pack = tar.pack();
        pack.entry({ name: 'main.rs' }, Buffer.from(this.code));
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
        if (inspect.ExitCode !== 0) {
            // No user code ran, so the container is safe to reuse: hand it
            // back to the pool instead of leaking it until cleanupStale.
            await this.releaseContainer();
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', './main < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(rustImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundGoRunner extends PlaygroundRunner {
    protected readonly image = goImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(goImage);
        if (!this.container) {
            await ensureImageAvailable(docker, goImage);
            this.container = await docker.createContainer({
                Image: goImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
            });
            await this.container.start();

            const initExec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', 'go mod init playground'],
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
        pack.entry({ name: 'main.go' }, Buffer.from(this.code));
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
        if (inspect.ExitCode !== 0) {
            // No user code ran, so the container is safe to reuse: hand it
            // back to the pool instead of leaking it until cleanupStale.
            await this.releaseContainer();
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', './main < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(goImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundTypeScriptRunner extends PlaygroundRunner {
    protected readonly image = tsImage;

    async compile(): Promise<void> {
        this.container = await ContainerPool.acquire(tsImage);
        if (!this.container) {
            await ensureImageAvailable(docker, tsImage);
            this.container = await docker.createContainer({
                Image: tsImage,
                Cmd: ['sh', '-lc', 'tail -f /dev/null'],
                WorkingDir: '/app',
                Tty: false,
                Labels: cojudgeContainerLabels()
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

        const pack = tar.pack();
        pack.entry({ name: 'main.ts' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

        // Same tsx provisioning as problem Run/Submit: inject the cached
        // install if we have one, otherwise provision it in the background.
        // Never blocks on the network; TSX_CMD falls back to `npx --yes tsx`.
        await TypeScriptRunner.ensureTsx(this.container);
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', `${TypeScriptRunner.TSX_CMD} < cojudge_stdin.txt`],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(tsImage, this.container);
        this.container = null;
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundPhpRunner extends PlaygroundRunner {
    protected readonly image = phpImage;

    async compile(): Promise<void> {
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

        const pack = tar.pack();
        pack.entry({ name: 'main.php' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });
    }

    async run(stdin: string = ''): Promise<{ output: string; logs: string }> {
        await this.stageStdin(stdin);

        const exec = await this.container!.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'php main.php < cojudge_stdin.txt'],
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
        if (inspect.ExitCode === 124) {
            await ContainerPool.markForCleanup(this.container);
            this.container = null;
            throw new Error(TIMEOUT_MESSAGE);
        }

        await ContainerPool.release(phpImage, this.container);
        this.container = null;

        return { output: stdout, logs: stderr };
    }
}
