import type { ProgrammingLanguage } from '$lib/utils/util';

export const FORK_TRANSFER_STORAGE_KEY = 'cojudge-fork-transfer';

const programmingLanguages = new Set<ProgrammingLanguage>([
	'java',
	'python',
	'cpp',
	'csharp',
	'rust',
	'go',
	'typescript',
	'plaintext',
	'markdown'
]);

export type ForkTransfer = {
	content: string;
	language: ProgrammingLanguage;
	viewState?: string;
	fileName: string;
};

export function storeForkTransfer(transfer: ForkTransfer): void {
	if (typeof sessionStorage === 'undefined') return;
	sessionStorage.setItem(FORK_TRANSFER_STORAGE_KEY, JSON.stringify(transfer));
}

export function consumeForkTransfer(): ForkTransfer | undefined {
	if (typeof sessionStorage === 'undefined') return undefined;
	const raw = sessionStorage.getItem(FORK_TRANSFER_STORAGE_KEY);
	if (!raw) return undefined;
	sessionStorage.removeItem(FORK_TRANSFER_STORAGE_KEY);

	try {
		const value = JSON.parse(raw) as Partial<ForkTransfer>;
		if (
			typeof value.content !== 'string' ||
			typeof value.language !== 'string' ||
			!programmingLanguages.has(value.language as ProgrammingLanguage) ||
			typeof value.fileName !== 'string' ||
			(value.viewState !== undefined && typeof value.viewState !== 'string')
		) {
			return undefined;
		}
		return value as ForkTransfer;
	} catch {
		return undefined;
	}
}
