import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDebugState, debugContinue, debugStep, debugStop, debugSetBreakpoints } from '$lib/runners/DebugRunner';

export const GET: RequestHandler = async ({ url }) => {
    const jobId = url.searchParams.get('jobId') || '';
    if (!jobId) {
        return json({ error: 'Missing jobId parameter' }, { status: 400 });
    }
    try {
        const state = await getDebugState(jobId);
        if (state.status === 'completed' || state.status === 'error') {
            console.log(`[debug] session ${jobId} reached terminal state: ${state.status}`);
        }
        return json(state);
    } catch (e: any) {
        console.error(`[debug] session ${jobId} error: ${e.message}`);
        return json({ error: e.message || 'Failed to get debug state' }, { status: 404 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    const { jobId, action, breakpoints } = await request.json();

    if (!jobId || !action) {
        return json({ error: 'Missing jobId or action' }, { status: 400 });
    }

    const validActions = ['continue', 'step', 'stop', 'setBreakpoints'];
    if (!validActions.includes(action)) {
        return json({ error: `Invalid action '${action}'. Must be one of: ${validActions.join(', ')}` }, { status: 400 });
    }

    try {
        if (action === 'continue') {
            const state = await debugContinue(jobId);
            return json(state);
        } else if (action === 'step') {
            const state = await debugStep(jobId);
            return json(state);
        } else if (action === 'stop') {
            await debugStop(jobId);
            return json({ status: 'stopped' });
        } else if (action === 'setBreakpoints') {
            if (!Array.isArray(breakpoints)) {
                return json({ error: 'breakpoints must be an array of line numbers' }, { status: 400 });
            }
            await debugSetBreakpoints(jobId, breakpoints);
            return json({ status: 'ok' });
        }
    } catch (e: any) {
        return json({ error: e.message || 'Debug action failed' }, { status: 400 });
    }
};
