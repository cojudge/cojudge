import Dockerode from 'dockerode';

const docker = new Dockerode();

interface PoolEntry {
    container: Dockerode.Container;
    image: string;
    createdAt: number;
    lastUsed: number;
    inUse: boolean;
}

class ContainerPool {
    private static pools: Map<string, PoolEntry[]> = new Map();
    private static MAX_IDLE = 2;

    static async acquire(image: string): Promise<Dockerode.Container | null> {
        const entries = this.pools.get(image) || [];
        const idx = entries.findIndex(e => !e.inUse);
        if (idx === -1) return null;
        const entry = entries[idx];
        entry.inUse = true;
        entry.lastUsed = Date.now();
        try {
            const info = await entry.container.inspect();
            if (!info.State.Running) {
                entries.splice(idx, 1);
                return null;
            }
        } catch {
            entries.splice(idx, 1);
            return null;
        }
        await ContainerPool.cleanContainer(entry.container);
        return entry.container;
    }

    static async release(image: string, container: Dockerode.Container): Promise<void> {
        const entries = this.pools.get(image) || [];
        const existing = entries.find(e => e.container.id === container.id);
        if (existing) {
            existing.inUse = false;
            existing.lastUsed = Date.now();
            return;
        }
        if (entries.length < this.MAX_IDLE) {
            entries.push({
                container,
                image,
                createdAt: Date.now(),
                lastUsed: Date.now(),
                inUse: false
            });
            this.pools.set(image, entries);
        } else {
            await ContainerPool.destroyContainer(container);
        }
    }

    static async markForCleanup(container: Dockerode.Container): Promise<void> {
        for (const [, entries] of this.pools.entries()) {
            const idx = entries.findIndex(e => e.container.id === container.id);
            if (idx !== -1) {
                entries.splice(idx, 1);
                break;
            }
        }
        await ContainerPool.destroyContainer(container);
    }

    static async cleanupStale(maxAgeMs = 300000): Promise<void> {
        const now = Date.now();
        for (const [key, entries] of this.pools.entries()) {
            const active = entries.filter(e => {
                if (e.inUse) return true;
                if (now - e.lastUsed > maxAgeMs) {
                    ContainerPool.destroyContainer(e.container);
                    return false;
                }
                return true;
            });
            if (active.length > 0) {
                this.pools.set(key, active);
            } else {
                this.pools.delete(key);
            }
        }
    }

    static async destroyAll(): Promise<void> {
        for (const [, entries] of this.pools.entries()) {
            for (const e of entries) {
                try { await e.container.stop({ t: 1 }); } catch {}
                try { await e.container.remove({ force: true }); } catch {}
            }
        }
        this.pools.clear();
    }

    private static async cleanContainer(container: Dockerode.Container): Promise<void> {
        try {
            const exec = await container.exec({
                Cmd: ['sh', '-c', 'cd /tmp && rm -rf /app && mkdir /app'],
                AttachStdout: true,
                AttachStderr: true
            });
            const stream: any = await exec.start({ hijack: true, stdin: false });
            await new Promise<void>((resolve, reject) => {
                stream.on('end', resolve);
                stream.on('error', reject);
                stream.resume();
                setTimeout(resolve, 10000);
            });
            const inspect = await exec.inspect();
            if (inspect.ExitCode !== 0) {
                console.error(`cleanContainer exit code: ${inspect.ExitCode}`);
            }
        } catch (e) {
            console.error('cleanContainer failed:', e);
        }
    }

    private static async destroyContainer(container: Dockerode.Container): Promise<void> {
        try {
            try { await container.stop({ t: 1 }); } catch {}
            await container.remove({ force: true });
        } catch {}
    }

    static getStats(): Record<string, { idle: number; inUse: number }> {
        const stats: Record<string, { idle: number; inUse: number }> = {};
        for (const [key, entries] of this.pools.entries()) {
            stats[key] = {
                idle: entries.filter(e => !e.inUse).length,
                inUse: entries.filter(e => e.inUse).length
            };
        }
        return stats;
    }
}

export default ContainerPool;
