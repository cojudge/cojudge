<script lang="ts">
	import type { AppUpdateInfo, AppUpdateStatus } from '$lib/appUpdate';
	import { APP_UPDATE_RELEASES_URL } from '$lib/appUpdate';

	let {
		availableAppUpdate,
		appUpdateStatus,
		appUpdateError,
		downloadProgress = null,
		onInstall,
		onSkipVersion,
		onRemindLater,
		onClose
	}: {
		availableAppUpdate: AppUpdateInfo;
		appUpdateStatus: AppUpdateStatus;
		appUpdateError: string | null;
		downloadProgress?: { downloadedBytes: number; totalBytes: number | null } | null;
		onInstall: () => void;
		onSkipVersion: () => void;
		onRemindLater: () => void;
		onClose: () => void;
	} = $props();

	const isInstalling = $derived(appUpdateStatus === 'installing');
	const isInstalled = $derived(appUpdateStatus === 'installed');
	// The dialog must stay dismissible while the download runs in the
	// background — locking it here is what made the popup feel "stuck".
	const showSkipButton = $derived(!isInstalled && !isInstalling);
	const primaryActionLabel = $derived(
		isInstalling
			? 'Installing…'
			: isInstalled
				? 'Restart to Apply'
				: appUpdateStatus === 'error'
					? 'Retry Install'
					: 'Install Update'
	);
	const title = $derived(isInstalled ? 'Update Installed' : 'Update Available');
	const subtitle = $derived(
		isInstalled
			? `Version ${availableAppUpdate.version} is installed. Restart Cojudge to finish applying it.`
			: `Version ${availableAppUpdate.version} is available for Cojudge.`
	);
	const remindLaterLabel = $derived(isInstalled ? 'Later' : isInstalling ? 'Hide' : 'Remind Later');
	const effectiveReleaseNotesUrl = $derived(
		availableAppUpdate.releaseNotesUrl?.trim() || APP_UPDATE_RELEASES_URL
	);
	const formattedPublishedAt = $derived.by(() => {
		if (!availableAppUpdate.publishedAt) return null;
		const parsed = new Date(availableAppUpdate.publishedAt);
		if (Number.isNaN(parsed.valueOf())) return availableAppUpdate.publishedAt;
		return parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	});
	const progressPercent = $derived.by(() => {
		if (!downloadProgress || !downloadProgress.totalBytes) return null;
		if (downloadProgress.totalBytes <= 0) return null;
		return Math.min(
			100,
			Math.round((downloadProgress.downloadedBytes / downloadProgress.totalBytes) * 100)
		);
	});
	const progressText = $derived.by(() => {
		if (!downloadProgress) return null;
		const downloaded = formatBytes(downloadProgress.downloadedBytes);
		if (downloadProgress.totalBytes == null) return `${downloaded} downloaded`;
		return `${downloaded} of ${formatBytes(downloadProgress.totalBytes)}${progressPercent != null ? ` (${progressPercent}%)` : ''}`;
	});

	function formatBytes(bytes: number): string {
		if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
		if (bytes < 1024) return `${bytes} B`;
		const units = ['KB', 'MB', 'GB'];
		let value = bytes / 1024;
		let unit = 0;
		while (value >= 1024 && unit < units.length - 1) {
			value /= 1024;
			unit += 1;
		}
		return `${value >= 100 ? Math.round(value) : value.toFixed(value >= 10 ? 1 : 2)} ${units[unit]}`;
	}

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
</script>

<div class="home-modal-shell">
	<button class="home-modal-backdrop" aria-label="Dismiss update dialog" tabindex="-1" onclick={onClose}></button>
	<div
		class="home-modal-card update-modal-card"
		role="dialog"
		aria-modal="true"
		aria-labelledby="cojudge-update-title"
		aria-busy={isInstalling}
	>
		<div class="modal-heading-row">
			<div>
				<span class="modal-eyebrow">Software update</span>
				<h2 id="cojudge-update-title">{title}</h2>
			</div>
			<span class="update-version-pill" title="Latest available version">
				<span></span>v{availableAppUpdate.version}
			</span>
		</div>
		<p class="update-intro">{subtitle}</p>

		<div class="update-section">
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

		{#if isInstalling}
			<div class="update-progress">
				<div
					class="update-progress-track"
					role="progressbar"
					aria-label="Download progress"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={progressPercent ?? undefined}
				>
					<div
						class="update-progress-fill"
						class:indeterminate={progressPercent == null}
						style={progressPercent != null ? `width: ${progressPercent}%` : undefined}
					></div>
				</div>
				<div class="update-progress-text">
					<span class="update-progress-numbers">{progressText ?? 'Downloading update…'}</span>
					<span class="update-progress-hint">
						The dialog can be hidden; the install continues in the background.
					</span>
				</div>
			</div>
		{/if}

		<button type="button" class="update-link" onclick={openReleaseNotes}>
			See the full release notes
		</button>

		{#if appUpdateError}
			<p class="modal-error update-error-text" role="alert">{appUpdateError}</p>
		{/if}

		<div class="home-modal-actions">
			{#if showSkipButton}
				<button type="button" class="btn" onclick={onSkipVersion}>
					Skip for this version
				</button>
			{/if}
			<button type="button" class="btn" onclick={onRemindLater}>
				{remindLaterLabel}
			</button>
			<button type="button" class="btn modal-primary-btn" onclick={onInstall} disabled={isInstalling}>
				{primaryActionLabel}
			</button>
		</div>

		<button type="button" class="update-close" aria-label="Dismiss update dialog" onclick={onClose}>
			×
		</button>
	</div>
</div>

<style>
	.btn {
		appearance: none;
		border: 1px solid var(--color-border);
		padding: 0.35rem 0.75rem;
		border-radius: 0.375rem;
		background: var(--color-btn);
		cursor: pointer;
		font-size: 0.9rem;
		color: inherit;
	}
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.home-modal-shell {
		position: fixed;
		inset: 0;
		z-index: 1200;
		display: grid;
		place-items: center;
		padding: 1.25rem;
		overflow-y: auto;
	}
	.home-modal-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(0, 0, 0, 0.52);
		cursor: default;
	}
	.home-modal-card {
		position: relative;
		width: min(430px, 100%);
		max-height: calc(100vh - 2.5rem);
		max-height: calc(100dvh - 2.5rem);
		overflow-y: auto;
		padding: 1.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.875rem;
		background: var(--color-bg);
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
		color: var(--color-text);
	}
	.home-modal-card h2 {
		margin: 0.15rem 0 0.5rem;
		font-size: 1.25rem;
	}
	.home-modal-card p {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.55;
	}
	.home-modal-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 0.625rem;
		margin-top: 1.15rem;
	}
	.modal-primary-btn {
		border-color: var(--color-highlight);
		background: var(--color-highlight);
		color: #fff;
		font-weight: 650;
	}
	.modal-primary-btn:hover {
		filter: brightness(1.05);
	}
	.modal-heading-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
		padding-right: 2rem;
	}
	.modal-heading-row h2 {
		margin-bottom: 0;
	}
	.modal-eyebrow {
		display: block;
		margin-top: 0.35rem;
		color: var(--color-highlight);
		font-size: 0.7rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.modal-error {
		margin-top: 0.75rem !important;
		color: var(--color-hard) !important;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.update-modal-card {
		width: min(520px, 100%);
	}
	.update-version-pill {
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		gap: 0.4rem;
		margin-top: 0.35rem;
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		color: var(--color-text-secondary);
		font-size: 0.72rem;
		font-weight: 650;
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
		white-space: nowrap;
	}
	.update-version-pill span {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--color-highlight);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-highlight) 16%, transparent);
	}
	.update-intro {
		margin: 0 0 0.85rem !important;
		font-size: 0.92rem;
		line-height: 1.5;
	}
	.update-section {
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.55rem;
		background: var(--color-surface);
		margin: 0 0 0.65rem;
	}
	.update-row {
		display: grid;
		grid-template-columns: minmax(88px, 112px) minmax(0, 1fr);
		gap: 0.75rem;
		align-items: center;
		padding: 0.2rem 0;
	}
	.update-row + .update-row {
		border-top: 1px solid var(--color-border);
		margin-top: 0.2rem;
		padding-top: 0.45rem;
	}
	.update-label {
		color: var(--color-text-secondary);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.update-value {
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--color-text);
		word-break: break-word;
	}
	.update-mono {
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
	}
	.update-progress {
		display: grid;
		gap: 0.45rem;
		margin: 0 0 0.65rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.55rem;
		background: var(--color-surface);
	}
	.update-progress-track {
		height: 0.5rem;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-second-bg);
	}
	.update-progress-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--color-highlight);
		transition: width 0.2s ease;
	}
	.update-progress-fill.indeterminate {
		width: 33%;
		animation: update-progress-slide 1.2s ease-in-out infinite alternate;
	}
	@keyframes update-progress-slide {
		from {
			margin-left: 0;
		}
		to {
			margin-left: 67%;
		}
	}
	.update-progress-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		font-size: 0.78rem;
		line-height: 1.45;
		color: var(--color-text-secondary);
	}
	.update-progress-numbers {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'tnum' 1;
	}
	.update-progress-hint {
		color: var(--color-text-secondary);
	}
	.update-link {
		align-self: flex-start;
		border: none;
		background: none;
		padding: 0;
		color: var(--color-highlight);
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
	}
	.update-link:hover {
		text-decoration: underline;
	}
	.update-error-text {
		white-space: pre-wrap;
	}
	.update-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 2rem;
		height: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-secondary);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
	}
	.update-close:hover {
		background: var(--color-surface-hover, rgba(0, 0, 0, 0.05));
		color: var(--color-text);
	}
	@media (max-width: 640px) {
		.home-modal-shell {
			padding: 0.75rem;
		}
		.modal-heading-row {
			padding-right: 1.75rem;
		}
		.update-row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.2rem;
		}
	}
</style>
