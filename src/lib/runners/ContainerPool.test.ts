import { describe, it, expect, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import ContainerPool from './ContainerPool';

// NOTE: stub containers, not real Docker ones — the unit-test step in CI
// runs before any runtime image is pulled, so this must stay Docker-free.

const IMAGE = 'test-image:latest';

type StubContainer = {
	id: string;
	stopCalls: number;
	removeCalls: number;
	running: boolean;
	modem: { demuxStream: () => void };
	inspect: () => Promise<{ State: { Running: boolean } }>;
	exec: () => Promise<{
		start: () => Promise<EventEmitter & { resume: () => void }>;
		inspect: () => Promise<{ ExitCode: number }>;
	}>;
	stop: () => Promise<void>;
	remove: () => Promise<void>;
};

function createStubContainer(id: string): StubContainer {
	const stub: StubContainer = {
		id,
		stopCalls: 0,
		removeCalls: 0,
		running: true,
		modem: { demuxStream: () => {} },
		inspect: async () => {
			if (!stub.running) {
				const err: any = new Error(`No such container: ${id}`);
				err.statusCode = 404;
				throw err;
			}
			return { State: { Running: true } };
		},
		exec: async () => ({
			start: async () => {
				const stream = new EventEmitter() as EventEmitter & { resume: () => void };
				stream.resume = () => setImmediate(() => stream.emit('end'));
				return stream;
			},
			inspect: async () => ({ ExitCode: 0 })
		}),
		stop: async () => {
			stub.stopCalls++;
			stub.running = false;
		},
		remove: async () => {
			stub.removeCalls++;
			stub.running = false;
		}
	};
	return stub;
}

const held: StubContainer[] = [];

afterEach(async () => {
	for (const c of held.splice(0)) {
		try {
			await ContainerPool.markForCleanup(c as any);
		} catch {
			/* already gone */
		}
	}
});

describe('ContainerPool.cleanupStale', () => {
	it('does not destroy an in-use container acquired recently', async () => {
		const container = createStubContainer('test-container-1');
		held.push(container);
		// Idle pooled entry (like a warm container waiting in the pool).
		await ContainerPool.release(IMAGE, container as any);
		// Let the pool entry age, then acquire it for work
		// (like CppRunner.compile does).
		await new Promise((r) => setTimeout(r, 600));
		const acquired = await ContainerPool.acquire(IMAGE);
		expect((acquired as unknown as StubContainer)?.id).toBe(container.id);
		// Entry created >300ms ago, but acquired just now: killing it here
		// used to surface mid-compile as
		// "HTTP 409 ... container is not running".
		await ContainerPool.cleanupStale(300);
		expect(container.stopCalls).toBe(0);
		expect(container.removeCalls).toBe(0);
		const info = await container.inspect();
		expect(info.State.Running).toBe(true);
	}, 30000);

	it('still reclaims in-use containers held past the stale threshold', async () => {
		const container = createStubContainer('test-container-2');
		held.push(container);
		await ContainerPool.release(IMAGE, container as any);
		await new Promise((r) => setTimeout(r, 600));
		const acquired = await ContainerPool.acquire(IMAGE);
		expect((acquired as unknown as StubContainer)?.id).toBe(container.id);
		// Held (without re-acquire) longer than the threshold: treated as
		// leaked and reclaimed.
		await ContainerPool.cleanupStale(300);
		await new Promise((r) => setTimeout(r, 600));
		await ContainerPool.cleanupStale(300);
		expect(container.removeCalls).toBe(1);
	}, 30000);
});
