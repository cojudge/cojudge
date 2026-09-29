<script lang="ts">
	import type { AppUpdateInfo, AppUpdateStatus } from '$lib/appUpdate';
	import { APP_UPDATE_RELEASES_URL } from '$lib/appUpdate';

	let {
		availableAppUpdate,
		appUpdateStatus,
		appUpdateError,
		onInstall,
		onSkipVersion,
		onRemindLater,
		onClose
	}: {
		availableAppUpdate: AppUpdateInfo;
		appUpdateStatus: AppUpdateStatus;
		appUpdateError: string | null;
		onInstall: () => void;
		onSkipVersion: () => void;
		onRemindLater: () => void;
		onClose: () => void;
	} = $props();

	const actionDisabled = $derived(appUpdateStatus === 'installing');
	const showSkipButton = $derived(appUpdateStatus !== 'installed');
	const primaryActionLabel = $derived(
		appUpdateStatus === 'installing'
			? 'Installing…'
			: appUpdateStatus === 'installed'
				? 'Restart to Apply'
				: appUpdateStatus === 'error'
					? 'Retry Install'
					: 'Install Update'
	);
	const title = $derived(
		appUpdateStatus === 'installed' ? 'Update Installed' : 'Update Available'
	);
	const subtitle = $derived(
		appUpdateStatus === 'installed'
			? `Version ${availableAppUpdate.version} is installed. Restart Cojudge to finish applying it.`
			: `Version ${availableAppUpdate.version} is available for Cojudge.`
	);
	const remindLaterLabel = $derived(appUpdateStatus === 'installed' ? 'Later' : 'Remind Later');
	const effectiveReleaseNotesUrl = $derived(
		availableAppUpdate.releaseNotesUrl?.trim() || APP_UPDATE_RELEASES_URL
	);
	const formattedPublishedAt = $derived.by(() => {
		if (!availableAppUpdate.publishedAt) return null;
		const parsed = new Date(availableAppUpdate.publishedAt);
		if (Number.isNaN(parsed.valueOf())) return availableAppUpdate.publishedAt;
		return parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	});

	async function openReleaseNotes() {
		try {
			const tauriInternals = (
				window as Window & {
					__TAURI_INTERNALS__?: { invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown> };
				}
			).__TAURI_INTERNALS__;
			if (tauriInternals?.invoke) {
				await tauriInternals.invoke('plugin:opener|open_url', {
					url: effectiveReleaseNotesUrl
				});
			} else {
				window.open(effectiveReleaseNotesUrl, '_blank', 'noopener');
			}
		} catch (error) {
			console.error('Failed to open release notes:', error);
			window.open(effectiveReleaseNotesUrl, '_blank', 'noopener');
		}
	}

	function handleBackdropClick() {
		if (actionDisabled) return;
		onRemindLater();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="update-backdrop" role="presentation" onclick={handleBackdropClick}>
	<div
		class="update-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="cojudge-update-title"
		tabindex="-1"
		onclick={(event) => event.stopPropagation()}
	>
		<div class="update-header">
			<div class="update-copy">
				<span class="update-kicker">Software Update</span>
				<h2 class="update-title" id="cojudge-update-title">{title}</h2>
				<p class="update-subtitle">{subtitle}</p>
			</div>
			<span class="update-badge">v{availableAppUpdate.version}</span>
		</div>

		<div class="update-metadata">
			<div class="update-row">
				<span class="update-label">Current</span>
				<span class="update-value update-mono">{availableAppUpdate.currentVersion || 'Unknown'}</span>
			</div>
			<div class="update-row">
				<span class="update-label">Latest</span>
				<span class="update-value update-mono">{availableAppUpdate.version}</span>
			</div>
			{#if formattedPublishedAt}
				<div class="update-row">
					<span class="update-label">Published</span>
					<span class="update-value">{formattedPublishedAt}</span>
				</div>
			{/if}
		</div>

		{#if availableAppUpdate.notes}
			<div class="update-notes">{availableAppUpdate.notes}</div>
		{/if}

		<button type="button" class="update-link" onclick={openReleaseNotes}>
			See the full release notes
		</button>

		{#if appUpdateError}
			<div class="update-error">{appUpdateError}</div>
		{/if}

		<div class="update-actions">
			{#if showSkipButton}
				<button
					type="button"
					class="btn update-secondary"
					onclick={onSkipVersion}
					disabled={actionDisabled}
				>
					Skip for this version
				</button>
			{/if}
			<button
				type="button"
				class="btn update-secondary"
				onclick={onRemindLater}
				disabled={actionDisabled}
			>
				{remindLaterLabel}
			</button>
			<button type="button" class="btn modal-primary-btn" onclick={onInstall} disabled={actionDisabled}>
				{primaryActionLabel}
			</button>
		</div>

		<button type="button" class="update-close" aria-label="Close update dialog" onclick={onClose} disabled={actionDisabled}>
			×
		</button>
	</div>
</div>

<style>
	.update-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1200;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: rgba(0, 0, 0, 0.45);
	}
	.update-modal {
		position: relative;
		width: min(100%, 560px);
		max-height: min(calc(100vh - 40px), 760px);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		border-radius: 16px;
		background: var(--surface, #fff);
		border: 1px solid var(--border, #e5e7eb);
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
		color: var(--text, #111827);
	}
	:global(:root[data-theme='dark']) .update-modal {
		--surface: #1f1f23;
		--border: #33333a;
		--text: #e8e8ed;
	}
	.update-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}
	.update-copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}
	.update-kicker {
		color: var(--accent, #0b5c8a);
		font-size: 0.76rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.update-title {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.update-subtitle {
		margin: 0;
		opacity: 0.75;
		font-size: 0.94rem;
		line-height: 1.5;
	}
	.update-badge {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 12px;
		border-radius: 999px;
		background: var(--badge-bg, #e8f3fb);
		border: 1px solid var(--border, #e5e7eb);
		color: var(--badge-text, #0b5c8a);
		font-size: 0.82rem;
		font-weight: 800;
	}
	:global(:root[data-theme='dark']) .update-badge {
		--badge-bg: #16324a;
		--badge-text: #7cc4ea;
	}
	.update-metadata {
		display: grid;
		gap: 10px;
		padding: 16px;
		border-radius: 12px;
		background: var(--meta-bg, #f8fafc);
		border: 1px solid var(--border, #e5e7eb);
	}
	:global(:root[data-theme='dark']) .update-metadata {
		--meta-bg: rgba(255, 255, 255, 0.04);
	}
	.update-row {
		display: grid;
		grid-template-columns: minmax(88px, 112px) minmax(0, 1fr);
		gap: 12px;
		align-items: center;
	}
	.update-label {
		opacity: 0.6;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.update-value {
		font-size: 0.92rem;
		line-height: 1.4;
		word-break: break-word;
	}
	.update-mono {
		font-family:
			ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace;
	}
	.update-notes {
		padding: 14px 16px;
		border-radius: 12px;
		background: var(--meta-bg, #f8fafc);
		border: 1px solid var(--border, #e5e7eb);
		font-size: 0.9rem;
		line-height: 1.55;
		white-space: pre-wrap;
	}
	:global(:root[data-theme='dark']) .update-notes {
		--meta-bg: rgba(255, 255, 255, 0.04);
	}
	.update-link {
		align-self: flex-start;
		border: none;
		background: none;
		padding: 0;
		color: var(--accent, #0b5c8a);
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
	}
	.update-link:hover {
		text-decoration: underline;
	}
	.update-error {
		padding: 12px 14px;
		border-radius: 12px;
		background: rgba(220, 38, 38, 0.08);
		border: 1px solid rgba(220, 38, 38, 0.25);
		color: #b91c1c;
		font-size: 0.88rem;
		line-height: 1.45;
		white-space: pre-wrap;
	}
	:global(:root[data-theme='dark']) .update-error {
		color: #ffbbb4;
		background: rgba(255, 112, 98, 0.12);
		border-color: rgba(255, 112, 98, 0.24);
	}
	.update-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		flex-wrap: wrap;
	}
	.update-secondary {
		background: transparent;
	}
	.update-close {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--border, #e5e7eb);
		background: transparent;
		color: inherit;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
	}
	@media (max-width: 640px) {
		.update-backdrop {
			padding: 12px;
		}
		.update-modal {
			padding: 20px;
		}
		.update-header {
			flex-direction: column;
		}
		.update-badge {
			align-self: flex-start;
		}
		.update-row {
			grid-template-columns: minmax(0, 1fr);
			gap: 4px;
		}
		.update-actions {
			flex-direction: column-reverse;
		}
		.update-actions :global(.btn) {
			width: 100%;
		}
	}
</style>
