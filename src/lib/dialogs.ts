import { writable } from 'svelte/store';

export type DialogTone = 'default' | 'danger' | 'success';

export type DialogOptions = {
	title?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	tone?: DialogTone;
};

export type AppDialogState = Required<DialogOptions> & {
	id: number;
	kind: 'alert' | 'confirm';
	message: string;
};

type DialogRequest = {
	state: AppDialogState;
	resolve: (result: boolean | null) => void;
};

export const activeDialog = writable<AppDialogState | null>(null);

const queue: DialogRequest[] = [];
let current: DialogRequest | null = null;
let nextId = 1;

function showNext(): void {
	if (current || queue.length === 0) return;
	current = queue.shift() ?? null;
	activeDialog.set(current?.state ?? null);
}

function enqueue(request: DialogRequest): void {
	queue.push(request);
	showNext();
}

export function showAlert(message: string, options: DialogOptions = {}): Promise<void> {
	return new Promise((resolve) => {
		enqueue({
			state: {
				id: nextId++,
				kind: 'alert',
				message,
				title: options.title ?? 'Cojudge',
				confirmLabel: options.confirmLabel ?? 'OK',
				cancelLabel: options.cancelLabel ?? 'Cancel',
				tone: options.tone ?? 'default'
			},
			resolve: () => resolve()
		});
	});
}

export function showConfirm(message: string, options: DialogOptions = {}): Promise<boolean> {
	return new Promise((resolve) => {
		enqueue({
			state: {
				id: nextId++,
				kind: 'confirm',
				message,
				title: options.title ?? 'Confirm action',
				confirmLabel: options.confirmLabel ?? 'Continue',
				cancelLabel: options.cancelLabel ?? 'Cancel',
				tone: options.tone ?? 'default'
			},
			resolve: (result) => resolve(result === true)
		});
	});
}

export function showChoice(message: string, options: DialogOptions = {}): Promise<boolean | null> {
	return new Promise((resolve) => {
		enqueue({
			state: {
				id: nextId++,
				kind: 'confirm',
				message,
				title: options.title ?? 'Choose an option',
				confirmLabel: options.confirmLabel ?? 'Continue',
				cancelLabel: options.cancelLabel ?? 'Cancel',
				tone: options.tone ?? 'default'
			},
			resolve
		});
	});
}

export function settleDialog(result: boolean | null): void {
	if (!current) return;
	const request = current;
	current = null;
	activeDialog.set(null);
	request.resolve(result);
	queueMicrotask(showNext);
}
