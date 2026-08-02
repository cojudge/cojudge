import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { activeDialog, settleDialog, showAlert, showChoice, showConfirm } from './dialogs';

describe('app dialogs', () => {
	it('queues dialogs and resolves their results in order', async () => {
		const confirmation = showConfirm('Remove it?', { title: 'First dialog' });
		const alert = showAlert('Finished', { title: 'Second dialog' });

		expect(get(activeDialog)?.title).toBe('First dialog');
		settleDialog(true);
		expect(await confirmation).toBe(true);
		await new Promise<void>((resolve) => queueMicrotask(resolve));

		expect(get(activeDialog)?.title).toBe('Second dialog');
		settleDialog(false);
		await alert;
		expect(get(activeDialog)).toBeNull();
	});

	it('distinguishes dismissing a choice from selecting its secondary action', async () => {
		const dismissed = showChoice('Clear local data?');
		settleDialog(null);
		expect(await dismissed).toBeNull();

		const secondary = showChoice('Clear local data?');
		settleDialog(false);
		expect(await secondary).toBe(false);
	});
});
