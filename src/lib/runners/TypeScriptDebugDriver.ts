export function rewriteTsImportsForNode(code: string): string {
    return code.replace(/(\bfrom\s+['"])(\.\/[^'"]+?)(['"])/g, (match, pre, spec, post) => {
        if (spec.endsWith('.ts') || spec.endsWith('.js') || spec.endsWith('.mjs') || spec.endsWith('.cjs')) return match;
        return `${pre}${spec}.ts${post}`;
    });
}

export function buildMissingTypeImports(typeImports: string, code: string): string {
    if (!typeImports) return '';
    const missing: string[] = [];
    for (const line of typeImports.split('\n')) {
        const m = line.match(/import\s*\{\s*(\w+)\s*\}/);
        if (!m) continue;
        const identifier = m[1];
        const alreadyImported = new RegExp(`import\\s*(type\\s*)?\\{[^}]*\\b${identifier}\\b[^}]*\\}`).test(code);
        if (!alreadyImported) missing.push(line);
    }
    return missing.length > 0 ? missing.join('\n') + '\n' : '';
}

export function generateTypeScriptDebugWrapper(breakpoints: number[], entryFile: string, sourceBasename: string, lineOffset: number): string {
    const bpArr = `[${[...new Set(breakpoints)].join(', ')}]`;

    return String.raw`import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import fs from 'node:fs';
import inspector from 'node:inspector';

const STATE_FILE = '/tmp/cojudge_debug_state.json';
const CMD_FILE = '/tmp/cojudge_debug_cmd.json';
const OUTPUT_FILE = '/tmp/cojudge_debug_output.txt';

const ENTRY_FILE = '${entryFile}';
const SOURCE_BASENAME = '${sourceBasename}';
const LINE_OFFSET = ${lineOffset};
const BREAKPOINTS = ${bpArr};

function readOutput() {
    try { return fs.readFileSync(OUTPUT_FILE, 'utf8'); } catch { return ''; }
}

function writeState(state) {
    try { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); } catch {}
}

function readCmd() {
    try {
        const raw = fs.readFileSync(CMD_FILE, 'utf8');
        if (!raw.trim()) return null;
        return JSON.parse(raw);
    } catch { return null; }
}

function consumeCmd() {
    try { fs.unlinkSync(CMD_FILE); } catch {}
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (isMainThread) {
    try { fs.writeFileSync(OUTPUT_FILE, ''); } catch {}
    process.stdout.write = (chunk, enc, cb) => {
        try { fs.appendFileSync(OUTPUT_FILE, typeof chunk === 'string' ? chunk : Buffer.from(chunk)); } catch {}
        if (typeof enc === 'function') enc();
        else if (typeof cb === 'function') cb();
        return true;
    };
    writeState({ status: 'running', output: '' });
    const worker = new Worker(new URL(import.meta.url));
    worker.on('message', async (msg) => {
        if (msg === 'ready') {
            try {
                await import(ENTRY_FILE);
                writeState({ status: 'completed', output: readOutput() });
                process.exit(0);
            } catch (e) {
                writeState({ status: 'error', error: String((e && e.stack) || e), output: readOutput() });
                process.exit(1);
            }
        }
    });
    worker.on('error', (e) => {
        writeState({ status: 'error', error: 'debug worker failed: ' + String((e && e.stack) || e), output: readOutput() });
        process.exit(1);
    });
} else {
    runWorker().catch((e) => {
        writeState({ status: 'error', error: 'debug driver failed: ' + String((e && e.stack) || e), output: readOutput() });
        process.kill(process.pid, 'SIGKILL');
    });
}

function post(session, method, params) {
    return new Promise((resolve, reject) => {
        session.post(method, params || {}, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

function escapeRegex(s) {
    return s.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
}

function renderExpr(name) {
    return '(() => {' +
        'try {' +
        'const __v = ' + name + ';' +
        "if (typeof __v === 'function') return '<function>';" +
        "if (__v === undefined) return 'undefined';" +
        "if (__v instanceof Map) return 'Map ' + JSON.stringify(Object.fromEntries(Array.from(__v.entries()).map(([k, v]) => [String(k), v])));" +
        "if (__v instanceof Set) return 'Set ' + JSON.stringify(Array.from(__v));" +
        'const __s = JSON.stringify(__v);' +
        'if (__s === undefined) return String(__v);' +
        "return __s.length > 500 ? __s.slice(0, 500) + '...' : __s;" +
        "} catch (e) { return '<unavailable>'; }" +
        '})()';
}

async function runWorker() {
    const session = new inspector.Session();
    session.connectToMainThread();

    const scriptUrls = new Map();
    let pausedFlag = false;
    const bpIds = [];
    const srcRe = escapeRegex(SOURCE_BASENAME);

    setInterval(async () => {
        if (pausedFlag) return;
        const cmd = readCmd();
        if (!cmd) return;
        if (cmd.action === 'set_breakpoints') {
            consumeCmd();
            await setBreakpoints(cmd.breakpoints || []);
        } else if (cmd.action === 'stop') {
            consumeCmd();
            writeState({ status: 'stopped', output: readOutput() });
            process.kill(process.pid, 'SIGKILL');
        }
    }, 100);

    session.on('Debugger.scriptParsed', (m) => {
        scriptUrls.set(m.params.scriptId, m.params.url || '');
    });

    session.on('Debugger.paused', (m) => {
        handlePaused(m.params).catch(() => {
            try { session.post('Debugger.resume'); } catch {}
        });
    });

    async function setBreakpoints(lines) {
        while (bpIds.length) {
            const id = bpIds.pop();
            try { await post(session, 'Debugger.removeBreakpoint', { breakpointId: id }); } catch {}
        }
        for (const line of lines) {
            try {
                const r = await post(session, 'Debugger.setBreakpointByUrl', {
                    lineNumber: line - 1 + LINE_OFFSET,
                    urlRegex: '.*' + srcRe + '$'
                });
                bpIds.push(r.breakpointId);
            } catch {}
        }
    }

    async function collectVars(frame) {
        const vars = {};
        for (const scope of frame.scopeChain || []) {
            if (scope.type !== 'local' && scope.type !== 'block' && scope.type !== 'catch' && scope.type !== 'module') continue;
            let props;
            try {
                props = await post(session, 'Runtime.getProperties', {
                    objectId: scope.object.objectId,
                    ownProperties: false,
                    accessorPropertiesOnly: false,
                    generatePreview: false
                });
            } catch { continue; }
            for (const p of props.result || []) {
                const name = p.name;
                if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) continue;
                if (name.startsWith('__') || name.startsWith('_cojudge')) continue;
                if (name in vars) continue;
                try {
                    const r = await post(session, 'Debugger.evaluateOnCallFrame', {
                        callFrameId: frame.callFrameId,
                        expression: renderExpr(name),
                        returnByValue: true,
                        throwOnSideEffect: false
                    });
                    const val = r && r.result ? (r.result.value !== undefined ? String(r.result.value) : String(r.result.description || '')) : '';
                    if (val === '<function>' || val === '<unavailable>') continue;
                    vars[name] = val;
                } catch {}
            }
        }
        return vars;
    }

    async function handlePaused(params) {
        const frame = params.callFrames && params.callFrames[0];
        if (!frame) {
            await post(session, 'Debugger.resume');
            return;
        }
        const url = scriptUrls.get(frame.location.scriptId) || '';
        if (!url.includes(SOURCE_BASENAME)) {
            await post(session, 'Debugger.resume');
            return;
        }
        pausedFlag = true;
        const line = frame.location.lineNumber + 1 - LINE_OFFSET;
        const vars = await collectVars(frame);
        writeState({ status: 'paused', line, vars, output: readOutput() });

        while (true) {
            const cmd = readCmd();
            if (cmd) {
                if (cmd.action === 'set_breakpoints') {
                    consumeCmd();
                    await setBreakpoints(cmd.breakpoints || []);
                    continue;
                }
                if (cmd.action === 'continue') {
                    consumeCmd();
                    pausedFlag = false;
                    await post(session, 'Debugger.resume');
                    return;
                }
                if (cmd.action === 'step') {
                    consumeCmd();
                    pausedFlag = false;
                    await post(session, 'Debugger.stepOver');
                    return;
                }
                if (cmd.action === 'stop') {
                    consumeCmd();
                    writeState({ status: 'stopped', output: readOutput() });
                    process.kill(process.pid, 'SIGKILL');
                    return;
                }
                consumeCmd();
            }
            await sleep(100);
        }
    }

    await post(session, 'Debugger.enable');
    try {
        await post(session, 'Debugger.setBlackboxPatterns', { patterns: ['^(?!.*' + srcRe + ').*$'] });
    } catch {}
    await setBreakpoints(BREAKPOINTS);

    parentPort.postMessage('ready');
}
`;
}
