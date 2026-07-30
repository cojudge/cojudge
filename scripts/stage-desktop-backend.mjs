import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, delimiter, join, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

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

for (const directory of ['build', 'courses', 'problems', 'docker']) {
	const source = join(root, directory);
	if (!existsSync(source)) throw new Error(`Missing ${source}`);
	cpSync(source, join(backend, directory), {
		filter: (entry) => !basename(entry).startsWith('.'),
		recursive: true
	});
}

cpSync(join(root, 'src-tauri', 'backend', 'desktop-server.mjs'), join(backend, 'desktop-server.mjs'));
console.log(`Staged desktop backend at ${backend}`);
