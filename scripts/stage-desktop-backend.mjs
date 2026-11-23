import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, delimiter, join, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { WINDOWS_BUNDLED_CONTENT_DIR } from '../bin/lib/bundledContent.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const backend = join(root, 'src-tauri', 'resources', 'backend');

rmSync(backend, { recursive: true, force: true });
mkdirSync(backend, { recursive: true });

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
delete packageJson.scripts;
writeFileSync(join(backend, 'package.json'), `${JSON.stringify(packageJson, null, '\t')}\n`);
cpSync(join(root, 'package-lock.json'), join(backend, 'package-lock.json'));

const env = { ...process.env, FIREBASE_WEBAPP_CONFIG: '' };
env.PATH = (env.PATH ?? '')
	.split(delimiter)
	.filter((entry) => !entry.endsWith(`${sep}node_modules${sep}.bin`))
	.join(delimiter);

const npmArgs = [
	'ci',
	'--omit=dev',
	'--omit=optional',
	'--ignore-scripts',
	'--no-audit',
	'--no-fund'
];
const npmExecPath = process.env.npm_execpath;
const install = npmExecPath
	? spawnSync(process.execPath, [npmExecPath, ...npmArgs], { cwd: backend, env, stdio: 'inherit' })
	: spawnSync('npm', npmArgs, { cwd: backend, env, stdio: 'inherit' });

if (install.error) throw install.error;
if (install.status !== 0) process.exit(install.status ?? 1);

const target = process.env.COJUDGE_DESKTOP_TARGET ?? process.env.TAURI_ENV_TARGET_TRIPLE;
const windows = target ? target.toLowerCase().includes('-windows-') : process.platform === 'win32';
// NSIS overlays the previous backend on in-place updates. Give the post-plugin
// course and problem trees a fresh destination so old resources stay out of the catalog.
const content = windows ? join(backend, WINDOWS_BUNDLED_CONTENT_DIR) : backend;
mkdirSync(content, { recursive: true });

for (const directory of ['build', 'courses', 'problems', 'docker', 'bin']) {
	const source = join(root, directory);
	if (!existsSync(source)) throw new Error(`Missing ${source}`);
	const destination = directory === 'courses' || directory === 'problems' ? content : backend;
	cpSync(source, join(destination, directory), {
		filter: (entry) => !basename(entry).startsWith('.'),
		recursive: true
	});
}

cpSync(join(root, 'src-tauri', 'backend', 'desktop-server.mjs'), join(backend, 'desktop-server.mjs'));
console.log(`Staged desktop backend at ${backend}`);
