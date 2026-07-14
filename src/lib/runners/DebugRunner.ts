import { generateJavaClassSolution, generateJavaRunner, javaGraphNodeClass, javaImage, javaListNodeClass, javaTreeNodeClass } from "$lib/utils/javaUtil";
import { generatePythonClassSolution, generatePythonRunner, pythonGraphNodeClass, pythonImage, pythonListNodeClass, pythonTreeNodeClass } from "$lib/utils/pythonUtil";
import { ensureImageAvailable, EXECUTION_TIMEOUT_SECONDS, extractOperations, TIMEOUT_MESSAGE } from "$lib/utils/util";
import { getMarkerResponses } from "../markerRunner";
import Dockerode from "dockerode";
import fs from 'fs/promises';
import path from 'path';
import tar from 'tar-stream';
import ContainerPool from "./ContainerPool";
import { JAVA_DEBUG_DRIVER } from "./JavaDebugDriver";

const docker = new Dockerode();

const DEBUG_STATE_FILE = '/tmp/cojudge_debug_state.json';
const DEBUG_CMD_FILE = '/tmp/cojudge_debug_cmd.json';

export type DebugState = {
    status: 'running' | 'paused' | 'completed' | 'error' | 'stopped';
    line?: number;
    vars?: Record<string, string>;
    output?: string;
    error?: string;
    testCase?: number;
    totalTestCases?: number;
    results?: any[];
};

export type DebugSession = {
    jobId: string;
    container: Dockerode.Container;
    language: string;
    code: string;
    breakpoints: number[];
    state: 'idle' | 'running' | 'paused' | 'completed' | 'error';
    stateData?: DebugState;
    runCmd: string[];
    mode: 'playground' | 'problem';
    totalTestCases?: number;
    createdAt: number;
    problemId?: string;
    testCases?: any[];
    resultsCache?: any[];
};

const debugSessions: Map<string, DebugSession> = new Map();

export function getDebugSession(jobId: string): DebugSession | undefined {
    return debugSessions.get(jobId);
}

function genId(): string {
    const g: any = globalThis as any;
    if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function generatePythonDebugWrapper(breakpoints: number[], entryFile: string, sourceFile: string): string {
    const bpSet = new Set(breakpoints);
    const bpStr = `{${[...bpSet].join(', ')}}`;

    return `
import sys, os, json, time, types, io

_COJUDGE_BREAKPOINTS = ${bpStr}
_COJUDGE_STATE_FILE = '${DEBUG_STATE_FILE}'
_COJUDGE_CMD_FILE = '${DEBUG_CMD_FILE}'
_COJUDGE_SOURCE_FILE = '${sourceFile}'
_COJUDGE_ENTRY_FILE = '${entryFile}'

_next_line_only = False
_capture_buffer = io.StringIO()

class _Capture:
    def write(self, s):
        _capture_buffer.write(s)
    def flush(self):
        pass

sys.stdout = _Capture()

def _write_state(status, line=None, vars=None, error=None):
    state = {'status': status}
    if line is not None:
        state['line'] = line
    if vars is not None:
        state['vars'] = vars
    state['output'] = _capture_buffer.getvalue()
    if error is not None:
        state['error'] = error
    try:
        with open(_COJUDGE_STATE_FILE, 'w') as f:
            json.dump(state, f)
    except:
        pass

def _wait_for_cmd():
    global _COJUDGE_BREAKPOINTS
    while True:
        try:
            with open(_COJUDGE_CMD_FILE, 'r') as f:
                cmd = json.load(f)
            if cmd.get('action') == 'set_breakpoints':
                _COJUDGE_BREAKPOINTS = set(cmd.get('breakpoints', []))
                os.remove(_COJUDGE_CMD_FILE)
                continue
            if cmd.get('action') in ('continue', 'step', 'stop'):
                os.remove(_COJUDGE_CMD_FILE)
                return cmd
        except:
            pass
        time.sleep(0.1)

def _cojudge_trace(frame, event, arg):
    global _next_line_only, _COJUDGE_BREAKPOINTS

    if event != 'line':
        return _cojudge_trace

    fname = frame.f_code.co_filename or ''
    if _COJUDGE_SOURCE_FILE not in fname:
        return _cojudge_trace

    lineno = frame.f_lineno

    if os.path.exists(_COJUDGE_CMD_FILE):
        try:
            with open(_COJUDGE_CMD_FILE, 'r') as f:
                cmd = json.load(f)
            if cmd.get('action') == 'set_breakpoints':
                _COJUDGE_BREAKPOINTS = set(cmd.get('breakpoints', []))
                os.remove(_COJUDGE_CMD_FILE)
        except:
            pass

    if _next_line_only or lineno in _COJUDGE_BREAKPOINTS:
        _next_line_only = False

        vars_dict = {}
        for k, v in frame.f_locals.items():
            if k.startswith('_cojudge') or k.startswith('__'):
                continue
            try:
                json.dumps(v)
                vars_dict[k] = repr(v)
            except:
                vars_dict[k] = '<' + type(v).__name__ + '>'

        _write_state('paused', line=lineno, vars=vars_dict)

        cmd = _wait_for_cmd()

        if cmd.get('action') == 'stop':
            _write_state('stopped')
            sys.exit(0)
        elif cmd.get('action') == 'step':
            _next_line_only = True

    return _cojudge_trace

_write_state('running')

sys.settrace(_cojudge_trace)

try:
    exec(compile(open(_COJUDGE_ENTRY_FILE).read(), _COJUDGE_ENTRY_FILE, 'exec'), {'__name__': '__main__'})
    _write_state('completed')
except SystemExit:
    pass
except Exception as e:
    _write_state('error', error=str(e))
`.trim();
}

async function readDebugState(container: Dockerode.Container): Promise<DebugState> {
    try {
        const exec = await container.exec({
            Cmd: ['cat', DEBUG_STATE_FILE],
            AttachStdout: true,
            AttachStderr: true
        });
        const stream: any = await exec.start({ hijack: true, stdin: false });
        let stdout = '';
        await new Promise<void>((resolve) => {
            (container as any).modem.demuxStream(
                stream,
                { write: (chunk: any) => (stdout += chunk.toString()) },
                { write: () => {} }
            );
            stream.on('end', resolve);
            stream.on('error', resolve);
        });
        if (stdout.trim()) {
            return JSON.parse(stdout.trim());
        }
    } catch {}
    return { status: 'running' };
}

async function writeDebugCmd(container: Dockerode.Container, action: 'continue' | 'step' | 'stop' | 'set_breakpoints', extra?: Record<string, any>): Promise<void> {
    const cmdContent: any = { action };
    if (extra) Object.assign(cmdContent, extra);
    const cmd = JSON.stringify(cmdContent);
    let escaped: string;
    if (action === 'set_breakpoints') {
        escaped = `echo '${cmd.replace(/'/g, "'\\''")}' > ${DEBUG_CMD_FILE}`;
    } else {
        const newState = JSON.stringify({ status: 'running' });
        escaped = `echo '${newState.replace(/'/g, "'\\''")}' > ${DEBUG_STATE_FILE} && echo '${cmd.replace(/'/g, "'\\''")}' > ${DEBUG_CMD_FILE}`;
    }
    const exec = await container.exec({
        Cmd: ['sh', '-c', escaped],
        AttachStdout: true,
        AttachStderr: true
    });
    const stream: any = await exec.start({ hijack: true, stdin: false });
    await new Promise<void>((resolve) => {
        stream.on('end', resolve);
        stream.on('error', resolve);
        stream.resume();
    });
}

async function waitForPause(container: Dockerode.Container, timeoutMs: number = 10000): Promise<DebugState> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const state = await readDebugState(container);
        if (state.status === 'paused' || state.status === 'completed' || state.status === 'error') {
            return state;
        }
        await new Promise(r => setTimeout(r, 200));
    }
    return { status: 'running' };
}

const SUPPORTED_DEBUG_LANGUAGES: Record<string, string> = {
    python: pythonImage,
    java: javaImage,
};

async function runExec(container: Dockerode.Container, cmd: string[]): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true
    });
    const stream: any = await exec.start({ hijack: true, stdin: false });
    let stdout = '';
    let stderr = '';
    await new Promise<void>((resolve) => {
        (container as any).modem.demuxStream(
            stream,
            { write: (chunk: any) => (stdout += chunk.toString()) },
            { write: (chunk: any) => (stderr += chunk.toString()) }
        );
        stream.on('end', resolve);
        stream.on('error', resolve);
    });
    const inspect = await exec.inspect();
    return { stdout, stderr, exitCode: inspect.ExitCode };
}

async function acquireDebugContainer(image: string): Promise<Dockerode.Container> {
    let container: Dockerode.Container | null = await ContainerPool.acquire(image);
    if (!container) {
        await ensureImageAvailable(docker, image);
        container = await docker.createContainer({
            Image: image,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true', 'cojudge.debug': 'true' }
        });
        await container.start();
        ContainerPool.acquirePermanent(image, container);
    }
    // Clear stale state from a previous debug session on a pooled container
    await runExec(container, ['sh', '-c', `rm -f ${DEBUG_STATE_FILE} ${DEBUG_CMD_FILE}`]);
    return container;
}

function countCompletedCases(output?: string): number {
    if (!output) return 0;
    return output.split('\n').filter(l => l.trim() === '---').length;
}

function decorateState(session: DebugSession, state: DebugState): DebugState {
    if (session.mode === 'problem' && session.totalTestCases) {
        state.totalTestCases = session.totalTestCases;
        if (state.status === 'paused' || state.status === 'running') {
            state.testCase = Math.min(countCompletedCases(state.output) + 1, session.totalTestCases);
        } else if (state.status === 'completed') {
            state.testCase = session.totalTestCases;
        }
    }
    return state;
}

function parseDebugOutputToChunks(output: string, totalCount: number): string[] {
    const rawChunks = output.split(/---\r?\n/);
    const chunks = rawChunks.map(c => c.trim());
    if (chunks.length > totalCount && chunks[chunks.length - 1] === '') {
        chunks.pop();
    }
    while (chunks.length < totalCount) {
        chunks.push('');
    }
    return chunks.slice(0, totalCount);
}

async function evaluateCompletedResults(session: DebugSession, state: DebugState): Promise<DebugState> {
    if (session.mode === 'problem' && session.problemId && session.testCases) {
        if (session.resultsCache) {
            state.results = session.resultsCache;
            return state;
        }
        try {
            const chunks = parseDebugOutputToChunks(state.output || '', session.totalTestCases || session.testCases.length);
            const parsed = chunks.map((chunk) => {
                const lines = chunk.split('\n');
                const idx = lines.findIndex((l) => l.startsWith(':::RESULT:::'));
                const output = idx !== -1 ? lines[idx].slice(':::RESULT:::'.length).trim() : '';
                const logs = lines
                    .filter((l) =>
                        !l.startsWith(':::RESULT:::') &&
                        !l.startsWith(':::VERDICT:::') &&
                        !l.startsWith(':::ANSWER:::') &&
                        !l.startsWith(':::ERROR:::')
                    )
                    .filter((l) => l.trim().length > 0)
                    .join('\n');
                return { output, logs };
            });

            const onlyOutputs = parsed.map((p) => p.output);
            const markerOutputs = onlyOutputs.map((o, i) => {
                if (!o) {
                    const tc = session.testCases![i];
                    return tc.adjList || tc.input || '[]';
                }
                return o;
            });

            const problemPath = path.resolve('problems', session.problemId, 'metadata.json');
            const problemContent = await fs.readFile(problemPath, 'utf-8');
            const problemData = JSON.parse(problemContent);

            const markerResponses = await getMarkerResponses(
                session.problemId,
                problemData.functionName,
                problemData.params,
                session.testCases,
                markerOutputs,
                problemData.outputType
            );

            state.results = session.testCases.map((tc: any, index: number) => ({
                ...tc,
                output: parsed[index]?.output ?? '',
                logs: parsed[index]?.logs ?? '',
                isCorrect: markerResponses[index].isCorrect,
                correctAnswer: markerResponses[index].correctAnswer,
                error: null
            }));
            session.resultsCache = state.results;
        } catch (err) {
            console.error('Failed to evaluate debug results with marker:', err);
        }
    }
    return state;
}

function registerSession(session: DebugSession): string {
    debugSessions.set(session.jobId, session);
    executeDebugRun(session);
    return session.jobId;
}

export async function startDebugSession(language: string, code: string, debugLines: number[]): Promise<string> {
    const jobId = genId();

    const image = SUPPORTED_DEBUG_LANGUAGES[language];
    if (!image) {
        const supported = Object.keys(SUPPORTED_DEBUG_LANGUAGES).join(', ');
        throw new Error(`Debugging is not yet supported for ${language}. Currently supported: ${supported}.`);
    }

    const container = await acquireDebugContainer(image);

    let runCmd: string[];

    if (language === 'python') {
        const debugWrapper = generatePythonDebugWrapper(debugLines, '/app/user_code.py', '/app/user_code.py');
        const pack = tar.pack();
        pack.entry({ name: 'debug_main.py' }, Buffer.from(debugWrapper));
        pack.entry({ name: 'user_code.py' }, Buffer.from(code));
        pack.finalize();
        await container.putArchive(pack as any, { path: '/app' });
        runCmd = ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'python3 debug_main.py'];
    } else {
        // java
        const pack = tar.pack();
        pack.entry({ name: 'Main.java' }, Buffer.from(code));
        pack.entry({ name: 'DebugDriver.java' }, Buffer.from(JAVA_DEBUG_DRIVER));
        pack.finalize();
        await container.putArchive(pack as any, { path: '/app' });

        const compile = await runExec(container, ['/bin/sh', '-c', 'javac -g Main.java DebugDriver.java']);
        if (compile.exitCode !== 0) {
            await ContainerPool.markForCleanup(container);
            throw new Error(`Compilation failed:\n${compile.stderr || compile.stdout}`);
        }
        const bps = debugLines.join(',');
        runCmd = ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', `java DebugDriver "${bps}"`];
    }

    return registerSession({
        jobId,
        container,
        language,
        code,
        breakpoints: debugLines,
        state: 'running',
        stateData: { status: 'running' },
        runCmd,
        mode: 'playground',
        createdAt: Date.now()
    });
}

export async function startProblemDebugSession(problemId: string, language: string, code: string, testCases: any[], debugLines: number[]): Promise<string> {
    const jobId = genId();

    const image = SUPPORTED_DEBUG_LANGUAGES[language];
    if (!image) {
        const supported = Object.keys(SUPPORTED_DEBUG_LANGUAGES).join(', ');
        throw new Error(`Debugging is not yet supported for ${language}. Currently supported: ${supported}.`);
    }
    if (!problemId) throw new Error('Missing problemId for problem debug session');
    if (!Array.isArray(testCases) || testCases.length === 0) {
        throw new Error(`No test cases available for problem '${problemId}'`);
    }

    const problemPath = path.resolve('problems', problemId, 'metadata.json');
    const problemContent = await fs.readFile(problemPath, 'utf-8');
    const problemData = JSON.parse(problemContent);

    const container = await acquireDebugContainer(image);

    let runCmd: string[];

    if (language === 'python') {
        const runnerCode = generatePythonRunner(problemData.functionName, problemData.params, testCases, problemData.checkGraphClone);
        let sourceFile = '/app/Solution.py';

        const pack = tar.pack();
        pack.entry({ name: 'ListNode.py' }, Buffer.from(pythonListNodeClass));
        pack.entry({ name: 'TreeNode.py' }, Buffer.from(pythonTreeNodeClass));
        pack.entry({ name: 'GraphNode.py' }, Buffer.from(pythonGraphNodeClass));
        if (problemData.classProblem) {
            const className = problemData.classProblem.userClassName || 'MedianFinder';
            const operations = extractOperations(testCases, className);
            const wrapperCode = generatePythonClassSolution(className, problemData.params, problemData.outputType, operations);
            pack.entry({ name: `${className}.py` }, Buffer.from(code));
            pack.entry({ name: 'Solution.py' }, Buffer.from(wrapperCode));
            sourceFile = `/app/${className}.py`;
        } else {
            pack.entry({ name: 'Solution.py' }, Buffer.from(code));
        }
        pack.entry({ name: 'main.py' }, Buffer.from(runnerCode));
        pack.entry({ name: 'debug_main.py' }, Buffer.from(generatePythonDebugWrapper(debugLines, '/app/main.py', sourceFile)));
        pack.finalize();
        await container.putArchive(pack as any, { path: '/app' });
        runCmd = ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'python3 -B debug_main.py'];
    } else {
        // java
        const runnerCode = generateJavaRunner(problemData.functionName, problemData.params, testCases, problemData.outputType, problemData.checkGraphClone);
        let sourceFile = 'Solution.java';

        const pack = tar.pack();
        pack.entry({ name: 'ListNode.java' }, Buffer.from(javaListNodeClass));
        pack.entry({ name: 'TreeNode.java' }, Buffer.from(javaTreeNodeClass));
        pack.entry({ name: 'GraphNode.java' }, Buffer.from(javaGraphNodeClass));
        if (problemData.classProblem) {
            const className = problemData.classProblem.userClassName || 'MedianFinder';
            const operations = extractOperations(testCases, className);
            const wrapperCode = generateJavaClassSolution(className, problemData.params, problemData.outputType, operations);
            pack.entry({ name: `${className}.java` }, Buffer.from(code));
            pack.entry({ name: 'Solution.java' }, Buffer.from(wrapperCode));
            sourceFile = `${className}.java`;
        } else {
            pack.entry({ name: 'Solution.java' }, Buffer.from(code));
        }
        pack.entry({ name: 'Main.java' }, Buffer.from(runnerCode));
        pack.entry({ name: 'DebugDriver.java' }, Buffer.from(JAVA_DEBUG_DRIVER));
        pack.finalize();
        await container.putArchive(pack as any, { path: '/app' });

        const compile = await runExec(container, ['/bin/sh', '-c', 'javac -g *.java']);
        if (compile.exitCode !== 0) {
            await ContainerPool.markForCleanup(container);
            throw new Error(`Compilation failed:\n${compile.stderr || compile.stdout}`);
        }
        const bps = debugLines.join(',');
        runCmd = ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', `java DebugDriver "${bps}" Main "${sourceFile}"`];
    }

    return registerSession({
        jobId,
        container,
        language,
        code,
        breakpoints: debugLines,
        state: 'running',
        stateData: { status: 'running' },
        runCmd,
        mode: 'problem',
        problemId,
        testCases,
        totalTestCases: testCases.length,
        createdAt: Date.now()
    });
}

async function executeDebugRun(session: DebugSession) {
    const { container } = session;
    try {
        const exec = await container.exec({
            Cmd: session.runCmd,
            AttachStdout: true,
            AttachStderr: true
        });
        const stream: any = await exec.start({ hijack: true, stdin: false });
        let stderr = '';

        await new Promise<void>((resolve) => {
            (container as any).modem.demuxStream(
                stream,
                { write: () => {} },
                { write: (chunk: any) => (stderr += chunk.toString()) }
            );
            stream.on('end', resolve);
            stream.on('error', resolve);
        });

        const state = await readDebugState(container);
        if (state.status === 'running') {
            const inspect = await exec.inspect();
            if (inspect.ExitCode === 124) {
                state.status = 'error';
                state.error = TIMEOUT_MESSAGE;
            } else if (stderr.trim()) {
                state.status = 'error';
                state.error = stderr.trim();
            } else {
                state.status = 'completed';
            }
        }

        session.state = state.status === 'paused' ? 'paused' :
                       state.status === 'completed' ? 'completed' : 'error';
        session.stateData = decorateState(session, state);
        if (state.status === 'completed') {
            await evaluateCompletedResults(session, session.stateData);
        }

    } catch (e: any) {
        session.state = 'error';
        session.stateData = { status: 'error', error: `Execution failed: ${e}` };
    }
}

export async function getDebugState(jobId: string): Promise<DebugState> {
    const session = debugSessions.get(jobId);
    if (!session) throw new Error(`Debug session '${jobId}' not found`);

    const state = await readDebugState(session.container);

    if (state.status === 'paused') {
        session.state = 'paused';
    } else if (state.status === 'completed') {
        session.state = 'completed';
    } else if (state.status === 'error') {
        session.state = 'error';
    }

    session.stateData = decorateState(session, state);
    if (state.status === 'completed') {
        await evaluateCompletedResults(session, session.stateData);
    }
    return session.stateData;
}

export async function debugContinue(jobId: string): Promise<DebugState> {
    const session = debugSessions.get(jobId);
    if (!session) throw new Error(`Debug session '${jobId}' not found`);

    await writeDebugCmd(session.container, 'continue');
    const state = await waitForPause(session.container);

    if (state.status === 'paused') {
        session.state = 'paused';
    } else if (state.status === 'completed') {
        session.state = 'completed';
    } else {
        session.state = 'error';
    }

    session.stateData = decorateState(session, state);
    if (state.status === 'completed') {
        await evaluateCompletedResults(session, session.stateData);
    }
    return session.stateData;
}

export async function debugStep(jobId: string): Promise<DebugState> {
    const session = debugSessions.get(jobId);
    if (!session) throw new Error(`Debug session '${jobId}' not found`);

    await writeDebugCmd(session.container, 'step');
    const state = await waitForPause(session.container);

    if (state.status === 'paused') {
        session.state = 'paused';
    } else if (state.status === 'completed') {
        session.state = 'completed';
    } else {
        session.state = 'error';
    }

    session.stateData = decorateState(session, state);
    if (state.status === 'completed') {
        await evaluateCompletedResults(session, session.stateData);
    }
    return session.stateData;
}

export async function debugStop(jobId: string): Promise<void> {
    const session = debugSessions.get(jobId);
    if (!session) throw new Error(`Debug session '${jobId}' not found`);

    try {
        await writeDebugCmd(session.container, 'stop');
    } catch {}

    try {
        await ContainerPool.markForCleanup(session.container);
    } catch {}

    debugSessions.delete(jobId);
}

export async function debugSetBreakpoints(jobId: string, breakpoints: number[]): Promise<void> {
    const session = debugSessions.get(jobId);
    if (!session) throw new Error(`Debug session '${jobId}' not found`);

    session.breakpoints = breakpoints;
    await writeDebugCmd(session.container, 'set_breakpoints', { breakpoints });
}
