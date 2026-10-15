import { describe, it, expect, afterEach } from 'vitest';
import Dockerode from 'dockerode';
import ContainerPool from './ContainerPool';

// alpine/java:22-jdk is pre-pulled in CI (.github/workflows/test.yml) and is
// small enough for fast pool tests. The pool is image-agnostic.
const IMAGE = 'alpine/java:22-jdk';
const held: Dockerode.Container[] = [];

afterEach(async () => {
	for (const c of held.splice(0)) {
		try {
			await ContainerPool.markForCleanup(c);
		} catch {
			/* already gone */
		}
	}
});

const docker = new Dockerode();

async function createStarted(): Promise<Dockerode.Container> {
	const container = await docker.createContainer({
		Image: IMAGE,
		Cmd: ['sh', '-lc', 'tail -f /dev/null'],
		Tty: false
	});
	await container.start();
	return container;
}

async function execEcho(container: Dockerode.Container): Promise<string> {
	const exec = await container.exec({
		Cmd: ['sh', '-c', 'echo alive'],
		AttachStdout: true,
		AttachStderr: true
	});
	const stream: any = await exec.start({ hijack: true, stdin: false });
	let out = '';
	await new Promise<void>((resolve, reject) => {
		(container as any).modem.demuxStream(
			stream,
			{ write: (chunk: any) => (out += chunk.toString()) },
			{ write: () => {} }
		);
		stream.on('end', resolve);
		stream.on('error', reject);
		stream.resume();
	});
	return out.trim();
}

describe('ContainerPool.cleanupStale', () => {
	it(
		'does not destroy an in-use container acquired recently',
		async () => {
			const container = await createStarted();
			held.push(container);
			// Idle pooled entry (like a warm container waiting in the pool).
			await ContainerPool.release(IMAGE, container);
			// Let the pool entry age, then acquire it for work
			// (like CppRunner.compile does).
			await new Promise((r) => setTimeout(r, 1500));
			const acquired = await ContainerPool.acquire(IMAGE);
			expect(acquired?.id).toBe(container.id);
			// Entry created >500ms ago, but acquired just now: killing it
			// here used to surface mid-compile as
			// "HTTP 409 ... container is not running".
			await ContainerPool.cleanupStale(500);
			const info = await container.inspect();
			expect(info.State.Running).toBe(true);
			await expect(execEcho(container)).resolves.toBe('alive');
		},
		60000
	);
});
