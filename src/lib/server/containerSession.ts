import { randomUUID } from 'node:crypto';
import process from 'node:process';

export const containerSessionId = process.env.COJUDGE_SESSION_ID || randomUUID();

export function cojudgeContainerLabels(extra: Record<string, string> = {}) {
    return {
        'cojudge.created': 'true',
        'cojudge.session': containerSessionId,
        ...extra
    };
}
