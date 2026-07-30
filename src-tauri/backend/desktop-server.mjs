import { createServer } from 'node:http';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const host = process.env.COJUDGE_DESKTOP_HOST;
const port = Number(process.env.COJUDGE_DESKTOP_PORT);
const token = process.env.COJUDGE_DESKTOP_TOKEN;
if (host !== 'cojudge.localhost') throw new Error('COJUDGE_DESKTOP_HOST is invalid');
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
	throw new Error('COJUDGE_DESKTOP_PORT is invalid');
}
if (!token || !/^[0-9a-f]{64}$/.test(token)) throw new Error('COJUDGE_DESKTOP_TOKEN is invalid');

const authority = `${host}:${port}`;
const origin = `http://${authority}`;
const cookie = `cojudge-desktop=${token}`;
let handler;
let shuttingDown = false;

const server = createServer((request, response) => {
	if (request.headers.host !== authority) {
		response.writeHead(421, { connection: 'close', 'content-type': 'text/plain' });
		response.end('Misdirected Request');
		return;
	}

	let requestUrl;
	try {
		requestUrl = new URL(request.url ?? '/', origin);
	} catch {
		response.writeHead(400, { connection: 'close', 'content-type': 'text/plain' });
		response.end('Bad Request');
		return;
	}
	if (requestUrl.pathname === '/__cojudge_bootstrap') {
		if (request.method !== 'GET' || requestUrl.searchParams.get('token') !== token) {
			response.writeHead(403, { connection: 'close', 'content-type': 'text/plain' });
			response.end('Forbidden');
			return;
		}

		response.writeHead(302, {
			'cache-control': 'no-store',
			location: '/',
			'set-cookie': `${cookie}; HttpOnly; SameSite=Strict; Path=/`
		});
		response.end();
		return;
	}

	const authenticated = (request.headers.cookie ?? '')
		.split(';')
		.some((value) => value.trim() === cookie);
	if (!authenticated) {
		response.writeHead(403, { connection: 'close', 'content-type': 'text/plain' });
		response.end('Forbidden');
		return;
	}

	if (!handler) {
		response.writeHead(503, { connection: 'close', 'content-type': 'text/plain' });
		response.end('Service Unavailable');
		return;
	}

	try {
		Promise.resolve(handler(request, response)).catch((error) => {
			console.error(error);
			if (response.headersSent) response.destroy(error);
			else response.writeHead(500).end('Internal Server Error');
		});
	} catch (error) {
		console.error(error);
		if (response.headersSent) response.destroy(error);
		else response.writeHead(500).end('Internal Server Error');
	}
});

async function shutdown(exitCode = 0) {
	if (shuttingDown) return;
	shuttingDown = true;

	const fallback = setTimeout(() => process.exit(exitCode), 10000);
	fallback.unref();
	server.close();
	server.closeAllConnections();

	try {
		await globalThis.__cojudgeShutdown?.();
	} catch (error) {
		console.error('Backend cleanup failed:', error);
	}
	process.exit(exitCode);
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
	input += chunk;
	let newline;
	while ((newline = input.indexOf('\n')) !== -1) {
		const line = input.slice(0, newline).trim();
		input = input.slice(newline + 1);
		if (line === 'shutdown') void shutdown();
	}
});
process.stdin.on('end', () => void shutdown());
process.on('SIGINT', () => void shutdown(130));
process.on('SIGTERM', () => void shutdown(143));

async function main() {
	await new Promise((resolveListen, rejectListen) => {
		const onError = (error) => rejectListen(error);
		server.once('error', onError);
		server.listen(port, '127.0.0.1', () => {
			server.off('error', onError);
			resolveListen();
		});
	});

	process.env.ORIGIN = origin;
	process.env.BODY_SIZE_LIMIT = '10M';
	delete process.env.PROTOCOL_HEADER;
	delete process.env.HOST_HEADER;
	delete process.env.PORT_HEADER;

	({ handler } = await import(pathToFileURL(resolve('build/handler.js')).href));
	if (shuttingDown) return;

	server.on('error', (error) => {
		console.error(error);
		void shutdown(1);
	});
	console.log(`COJUDGE_READY=${port}`);
}

main().catch((error) => {
	console.error(error);
	void shutdown(1);
});
