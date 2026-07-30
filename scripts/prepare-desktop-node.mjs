import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
	chmodSync,
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const version = 'v24.18.0';
const releases = {
	'aarch64-apple-darwin': {
		filename: `node-${version}-darwin-arm64.tar.gz`,
		sha256: 'e1a97e14c99c803e96c7339403282ea05a499c32f8d83defe9ef5ec66f979ed1',
		directory: `node-${version}-darwin-arm64`,
		executable: ['bin', 'node']
	},
	'x86_64-apple-darwin': {
		filename: `node-${version}-darwin-x64.tar.gz`,
		sha256: 'dfd0dbd3e721503434df7b7205e719f61b3a3a31b2bcf9729b8b91fea240f080',
		directory: `node-${version}-darwin-x64`,
		executable: ['bin', 'node']
	},
	'x86_64-pc-windows-msvc': {
		filename: `node-${version}-win-x64.zip`,
		sha256: '0ae68406b42d7725661da979b1403ec9926da205c6770827f33aac9d8f26e821',
		directory: `node-${version}-win-x64`,
		executable: ['node.exe']
	},
	'x86_64-unknown-linux-gnu': {
		filename: `node-${version}-linux-x64.tar.gz`,
		sha256: '783130984963db7ba9cbd01089eaf2c2efb055c7c1693c943174b967b3050cb8',
		directory: `node-${version}-linux-x64`,
		executable: ['bin', 'node']
	}
};

function hostTarget() {
	if (process.platform === 'darwin' && process.arch === 'arm64') return 'aarch64-apple-darwin';
	if (process.platform === 'darwin' && process.arch === 'x64') return 'x86_64-apple-darwin';
	if (process.platform === 'win32' && process.arch === 'x64') return 'x86_64-pc-windows-msvc';
	if (process.platform === 'linux' && process.arch === 'x64') return 'x86_64-unknown-linux-gnu';
	throw new Error(`Unsupported desktop host: ${process.platform}/${process.arch}`);
}

const requested = (
	process.env.COJUDGE_DESKTOP_TARGET ??
	process.env.TAURI_ENV_TARGET_TRIPLE ??
	(process.env.COJUDGE_DESKTOP_ARCH === 'universal' ? 'universal-apple-darwin' : undefined) ??
	hostTarget()
).toLowerCase();
const targets = requested === 'universal-apple-darwin'
	? ['aarch64-apple-darwin', 'x86_64-apple-darwin']
	: [requested];
for (const target of targets) {
	if (!(target in releases)) throw new Error(`Unsupported desktop target: ${target}`);
}
if (requested === 'universal-apple-darwin' && process.platform !== 'darwin') {
	throw new Error('The universal macOS runtime must be prepared on macOS');
}

const root = fileURLToPath(new URL('../', import.meta.url));
const binaries = join(root, 'src-tauri', 'binaries');
const backend = join(root, 'src-tauri', 'resources', 'backend');
const temporary = mkdtempSync(join(tmpdir(), 'cojudge-node-'));

async function download(target) {
	const release = releases[target];
	const response = await fetch(`https://nodejs.org/dist/${version}/${release.filename}`);
	if (!response.ok) throw new Error(`Node download failed: ${response.status} ${response.statusText}`);

	const archive = Buffer.from(await response.arrayBuffer());
	const actual = createHash('sha256').update(archive).digest('hex');
	if (actual !== release.sha256) throw new Error(`Checksum mismatch for ${release.filename}`);

	const archivePath = join(temporary, release.filename);
	writeFileSync(archivePath, archive);
	const extraction = spawnSync('tar', ['-xf', archivePath, '-C', temporary], {
		stdio: 'inherit'
	});
	if (extraction.error) throw extraction.error;
	if (extraction.status !== 0) throw new Error(`Could not extract ${release.filename}`);

	return join(temporary, release.directory);
}

function executablePath(distribution, target) {
	return join(distribution, ...releases[target].executable);
}

try {
	mkdirSync(binaries, { recursive: true });
	const distributions = new Map();
	for (const target of targets) distributions.set(target, await download(target));

	for (const target of targets) {
		const extension = target.includes('windows') ? '.exe' : '';
		const output = join(binaries, `cojudge-node-${target}${extension}`);
		copyFileSync(executablePath(distributions.get(target), target), output);
		if (!extension) chmodSync(output, 0o755);
		console.log(`Prepared ${output}`);
	}

	if (requested === 'universal-apple-darwin') {
		const output = join(binaries, 'cojudge-node-universal-apple-darwin');
		const lipo = spawnSync(
			'/usr/bin/xcrun',
			[
				'lipo',
				'-create',
				executablePath(distributions.get('aarch64-apple-darwin'), 'aarch64-apple-darwin'),
				executablePath(distributions.get('x86_64-apple-darwin'), 'x86_64-apple-darwin'),
				'-output',
				output
			],
			{ stdio: 'inherit' }
		);
		if (lipo.error) throw lipo.error;
		if (lipo.status !== 0) throw new Error('Could not create universal Node binary');
		chmodSync(output, 0o755);
		console.log(`Prepared ${output}`);
	}

	const notices = join(backend, 'node-runtime');
	rmSync(notices, { recursive: true, force: true });
	mkdirSync(notices, { recursive: true });
	copyFileSync(join(distributions.get(targets[0]), 'LICENSE'), join(notices, 'LICENSE'));
	writeFileSync(join(notices, 'VERSION'), `${version}\n`);
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
