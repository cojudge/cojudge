import { getPort } from "../utils.js";

export async function handleDebug(args, PORT) {
    const subAction = args[1];
    const jobId = args[2];

    if (!subAction || subAction === '-h' || subAction === '--help') {
        console.log(`
cojudge debug - Inspect and control a debug session

Usage:
  cojudge debug <jobId>                  Show the current debug state
  cojudge debug continue <jobId>          Continue execution (run until next breakpoint or end)
  cojudge debug step <jobId>              Step over to the next line
  cojudge debug stop <jobId>              Stop the debug session

Start a debug session with:
  cojudge run <file> --debug-lines 5,10,15
`);
        return;
    }

    if (subAction === 'continue' || subAction === 'step' || subAction === 'stop') {
        if (!jobId) {
            console.error(`Error: Missing job ID for '${subAction}' action.`);
            console.error(`Usage: cojudge debug ${subAction} <jobId>`);
            process.exit(1);
        }
        await debugAction(PORT, subAction, jobId);
        return;
    }

    const possibleJobId = subAction;
    await showState(PORT, possibleJobId);
}

async function showState(PORT, jobId) {
    try {
        const response = await fetch(
            `http://localhost:${PORT}/api/debug?jobId=${encodeURIComponent(jobId)}`,
        );
        const data = await response.json();

        if (!response.ok) {
            console.error(`\x1b[31mError: ${data.error || response.statusText}\x1b[0m`);
            process.exit(1);
        }

        printState(data, jobId);
    } catch (e) {
        console.error(`\x1b[31mFailed to connect to server: ${e.message}\x1b[0m`);
        process.exit(1);
    }
}

async function debugAction(PORT, action, jobId) {
    try {
        const response = await fetch(
            `http://localhost:${PORT}/api/debug`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, action }),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            console.error(`\x1b[31mError: ${data.error || response.statusText}\x1b[0m`);
            process.exit(1);
        }

        if (action === 'stop') {
            console.log('\x1b[33mDebug session stopped.\x1b[0m');
            return;
        }

        printState(data, jobId);
    } catch (e) {
        console.error(`\x1b[31mFailed to connect to server: ${e.message}\x1b[0m`);
        process.exit(1);
    }
}

function printState(data, jobId) {
    console.log(`\n\x1b[1mDebug Session: ${jobId}\x1b[0m`);

    if (data.status === 'running') {
        console.log('Status:  \x1b[33mRunning\x1b[0m (waiting to hit a breakpoint)');
    } else if (data.status === 'paused') {
        console.log('Status:  \x1b[36mPaused\x1b[0m');
        console.log(`Line:    \x1b[33m${data.line}\x1b[0m`);

        if (data.vars && Object.keys(data.vars).length > 0) {
            console.log('Variables:');
            for (const [key, value] of Object.entries(data.vars)) {
                const truncated = String(value).length > 120
                    ? String(value).slice(0, 120) + '...'
                    : value;
                console.log(`  \x1b[32m${key}\x1b[0m = ${truncated}`);
            }
        }

        if (data.output && data.output.trim()) {
            console.log('Output so far:');
            const lines = data.output.trim().split('\n');
            for (const line of lines) {
                console.log(`  \x1b[90m${line}\x1b[0m`);
            }
        }
    } else if (data.status === 'completed') {
        console.log('Status:  \x1b[32mCompleted\x1b[0m');

        if (data.output && data.output.trim()) {
            console.log('Output:');
            const lines = data.output.trim().split('\n');
            for (const line of lines) {
                console.log(`  ${line}`);
            }
        }
    } else if (data.status === 'error') {
        console.log('Status:  \x1b[31mError\x1b[0m');
        if (data.error) {
            console.log(`Error:   \x1b[31m${data.error}\x1b[0m`);
        }
    } else if (data.status === 'stopped') {
        console.log('Status:  \x1b[33mStopped\x1b[0m');
    }

    console.log('');
}
