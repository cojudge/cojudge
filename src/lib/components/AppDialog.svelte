<script lang="ts">
	import { activeDialog, settleDialog } from '$lib/dialogs';
	import { onDestroy, tick } from 'svelte';

	let dialogCard: HTMLDivElement | null = null;
	let cancelButton: HTMLButtonElement | null = null;
	let confirmButton: HTMLButtonElement | null = null;
	let previousFocus: HTMLElement | null = null;
	let previousBodyOverflow = '';
	let renderedDialogId = 0;

	async function activateDialog(): Promise<void> {
		if (typeof document === 'undefined') return;
		previousFocus = document.activeElement as HTMLElement | null;
		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		await tick();
		if ($activeDialog?.kind === 'confirm' && $activeDialog.tone === 'danger') {
			cancelButton?.focus();
		} else {
			confirmButton?.focus();
		}
	}

	function deactivateDialog(): void {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = previousBodyOverflow;
		if (previousFocus?.isConnected) previousFocus.focus();
		previousFocus = null;
	}

	$: {
		const nextId = $activeDialog?.id ?? 0;
		if (nextId !== renderedDialogId) {
			if (nextId) void activateDialog();
			else if (renderedDialogId) deactivateDialog();
			renderedDialogId = nextId;
		}
	}

	function close(confirmed: boolean): void {
		settleDialog(confirmed);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (!$activeDialog) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			close(false);
			return;
		}
		if (event.key !== 'Tab' || !dialogCard) return;

		const focusable = Array.from(
			dialogCard.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled)')
		);
		if (!focusable.length) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	onDestroy(() => {
		if (renderedDialogId && typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $activeDialog}
	<div class="dialog-shell">
		<button
			class="dialog-backdrop"
			aria-label={$activeDialog.kind === 'confirm' ? 'Cancel' : 'Close'}
			tabindex="-1"
			onclick={() => close(false)}
		></button>
		<div
			bind:this={dialogCard}
			class="dialog-card"
			class:danger={$activeDialog.tone === 'danger'}
			class:success={$activeDialog.tone === 'success'}
			role={$activeDialog.kind === 'alert' ? 'alertdialog' : 'dialog'}
			aria-modal="true"
			aria-labelledby="app-dialog-title"
			aria-describedby="app-dialog-message"
		>
			<div class="dialog-icon" aria-hidden="true">
				{#if $activeDialog.tone === 'danger'}
					!
				{:else if $activeDialog.tone === 'success'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="m5 12 4 4L19 6"></path>
					</svg>
				{:else if $activeDialog.kind === 'confirm'}
					?
				{:else}
					i
				{/if}
			</div>
			<div class="dialog-copy">
				<h2 id="app-dialog-title">{$activeDialog.title}</h2>
				<p id="app-dialog-message">{$activeDialog.message}</p>
			</div>
			<div class="dialog-actions">
				{#if $activeDialog.kind === 'confirm'}
					<button bind:this={cancelButton} class="dialog-button secondary" type="button" onclick={() => close(false)}>
						{$activeDialog.cancelLabel}
					</button>
				{/if}
				<button
					bind:this={confirmButton}
					class="dialog-button primary"
					class:danger={$activeDialog.tone === 'danger'}
					type="button"
					onclick={() => close(true)}
				>
					{$activeDialog.confirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-shell {
		position: fixed;
		inset: 0;
		z-index: 5000;
		display: grid;
		place-items: center;
		padding: 1rem;
	}
	.dialog-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(15, 23, 42, 0.58);
		backdrop-filter: blur(3px);
		cursor: default;
	}
	.dialog-card {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0 1rem;
		width: min(440px, 100%);
		box-sizing: border-box;
		padding: 1.4rem;
		border: 1px solid var(--color-border);
		border-radius: 0.9rem;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
		animation: dialog-enter 130ms ease-out both;
	}
	.dialog-icon {
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 0.7rem;
		background: color-mix(in srgb, var(--color-highlight) 16%, transparent);
		color: var(--color-highlight);
		font-size: 1.25rem;
		font-weight: 800;
	}
	.dialog-card.danger .dialog-icon {
		background: color-mix(in srgb, var(--color-hard) 14%, transparent);
		color: var(--color-hard);
	}
	.dialog-card.success .dialog-icon {
		background: color-mix(in srgb, var(--color-easy) 14%, transparent);
		color: var(--color-easy);
	}
	.dialog-copy h2 {
		margin: 0;
		font-size: 1.12rem;
		line-height: 1.35;
	}
	.dialog-copy p {
		margin: 0.45rem 0 0;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		line-height: 1.55;
		white-space: pre-wrap;
	}
	.dialog-actions {
		grid-column: 1 / -1;
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
		margin-top: 1.35rem;
	}
	.dialog-button {
		min-height: 2.35rem;
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 650;
		cursor: pointer;
	}
	.dialog-button.secondary {
		background: var(--color-surface);
		color: var(--color-text);
	}
	.dialog-button.primary {
		border-color: var(--color-highlight);
		background: var(--color-highlight);
		color: #fff;
	}
	.dialog-button.primary.danger {
		border-color: var(--color-hard);
		background: var(--color-hard);
	}
	.dialog-button:hover {
		filter: brightness(1.04);
	}
	.dialog-button:focus-visible {
		outline: 3px solid color-mix(in srgb, var(--color-highlight) 28%, transparent);
		outline-offset: 2px;
	}
	@keyframes dialog-enter {
		from { opacity: 0; transform: translateY(6px) scale(0.985); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
	@media (max-width: 520px) {
		.dialog-shell { align-items: end; padding: 0.7rem; }
		.dialog-card { padding: 1.2rem; border-radius: 1rem; }
		.dialog-actions { display: grid; grid-template-columns: 1fr 1fr; }
		.dialog-actions .primary:only-child { grid-column: 1 / -1; }
	}
	@media (prefers-reduced-motion: reduce) {
		.dialog-card { animation: none; }
	}
</style>
