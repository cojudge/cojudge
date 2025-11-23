import { cppImage } from "$lib/utils/cppUtil";
import { csharpImage } from "$lib/utils/csharpUtil";
import { javaImage } from "$lib/utils/javaUtil";
import { pythonImage } from "$lib/utils/pythonUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, TIMEOUT_MESSAGE } from "$lib/utils/util";
import Dockerode from "dockerode";
import tar from 'tar-stream';

const docker = new Dockerode();

export abstract class PlaygroundRunner {
    protected readonly code: string;

    constructor(code: string) {
        this.code = code;
    }

    abstract compile(): Promise<void>;
    abstract run(): Promise<{ output: string; logs: string }>;
}

export class PlaygroundJavaRunner extends PlaygroundRunner {
    private container: Dockerode.Container | null = null;

    async compile(): Promise<void> {
        await ensureImageAvailable(docker, javaImage);
        this.container = await docker.createContainer({
            Image: javaImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true' }
        });
        await this.container.start();

        const pack = tar.pack();
        pack.entry({ name: 'Main.java' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', 'javac Main.java'],
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
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(): Promise<{ output: string; logs: string }> {
        if (!this.container) throw new Error('Container not initialized');
        
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
        if (inspect.ExitCode === 124) {
            throw new Error(TIMEOUT_MESSAGE);
        }
        
        await this.container.stop();
        await this.container.remove();
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundPythonRunner extends PlaygroundRunner {
    private container: Dockerode.Container | null = null;

    async compile(): Promise<void> {
        await ensureImageAvailable(docker, pythonImage);
        this.container = await docker.createContainer({
            Image: pythonImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true' }
        });
        await this.container.start();

        const pack = tar.pack();
        pack.entry({ name: 'main.py' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });
    }

    async run(): Promise<{ output: string; logs: string }> {
        if (!this.container) throw new Error('Container not initialized');
        
        const exec = await this.container.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'python3 main.py'],
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
            throw new Error(TIMEOUT_MESSAGE);
        }
        
        await this.container.stop();
        await this.container.remove();
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundCppRunner extends PlaygroundRunner {
    private container: Dockerode.Container | null = null;

    async compile(): Promise<void> {
        await ensureImageAvailable(docker, cppImage);
        this.container = await docker.createContainer({
            Image: cppImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true' }
        });
        await this.container.start();

        const pack = tar.pack();
        pack.entry({ name: 'main.cpp' }, Buffer.from(this.code));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });

        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', 'g++ -o main main.cpp'],
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
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(): Promise<{ output: string; logs: string }> {
        if (!this.container) throw new Error('Container not initialized');
        
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
        if (inspect.ExitCode === 124) {
            throw new Error(TIMEOUT_MESSAGE);
        }
        
        await this.container.stop();
        await this.container.remove();
        
        return { output: stdout, logs: stderr };
    }
}

export class PlaygroundCSharpRunner extends PlaygroundRunner {
    private container: Dockerode.Container | null = null;

    async compile(): Promise<void> {
        await ensureImageAvailable(docker, csharpImage);
        this.container = await docker.createContainer({
            Image: csharpImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true' }
        });
        await this.container.start();

        // Initialize project
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
            throw new Error(`Compilation failed:\n${stderr || stdout}`);
        }
    }

    async run(): Promise<{ output: string; logs: string }> {
        if (!this.container) throw new Error('Container not initialized');
        
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
        if (inspect.ExitCode === 124) {
            throw new Error(TIMEOUT_MESSAGE);
        }
        
        await this.container.stop();
        await this.container.remove();
        
        return { output: stdout, logs: stderr };
    }
}
