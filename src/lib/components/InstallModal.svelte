<script lang="ts">
	const RELEASES_URL = 'https://github.com/cojudge/cojudge/releases';

	const MACOS_COMMANDS = `brew tap cojudge/tap
brew install --cask cojudge
xattr -dr com.apple.quarantine /Applications/Cojudge.app`;
	const WINDOWS_COMMANDS = `winget install -e --id Cojudge.Cojudge`;

	let {
		open,
		onClose
	}: {
		open: boolean;
		onClose: () => void;
	} = $props();

	let copiedBlock: string | null = $state(null);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;
	let previousBodyOverflow = '';

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (open) {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previousBodyOverflow;
			};
		}
	});

	async function copyBlock(name: string, text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const area = document.createElement('textarea');
			area.value = text;
			document.body.appendChild(area);
			area.select();
			document.execCommand('copy');
			area.remove();
		}
		copiedBlock = name;
		if (copiedTimer) clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => {
			copiedBlock = null;
		}, 1500);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="install-modal-shell">
		<button class="install-modal-backdrop" aria-label="Close install instructions" tabindex="-1" onclick={onClose}></button>
		<div class="install-modal-card" role="dialog" aria-modal="true" aria-labelledby="install-modal-title">
			<div class="install-modal-header">
				<h2 id="install-modal-title">Run Cojudge locally</h2>
				<button class="install-modal-close" onclick={onClose} aria-label="Close"> &times; </button>
			</div>
			<p class="install-modal-sub">
				The demo uses a free server for judging, so the speed could be limited. Install the desktop app for the full
				offline judge with Docker sandboxing.
			</p>

			<section class="install-block">
				<div class="install-block-head">
					<h3>macOS <span>(Homebrew)</span></h3>
					<button
						class="install-copy-btn"
						onclick={() => void copyBlock('macos', MACOS_COMMANDS)}
						title={copiedBlock === 'macos' ? 'Copied' : 'Copy commands'}
					>
						{copiedBlock === 'macos' ? 'Copied' : 'Copy'}
					</button>
				</div>
				<pre><code>{MACOS_COMMANDS}</code></pre>
				<p class="install-note">
					The <code>xattr</code> step is required on first install (ad-hoc signed, not yet
					notarized). Update later with <code>brew upgrade --cask cojudge</code>.
				</p>
			</section>

			<section class="install-block">
				<div class="install-block-head">
					<h3>Windows <span>(winget)</span></h3>
					<button
						class="install-copy-btn"
						onclick={() => void copyBlock('windows', WINDOWS_COMMANDS)}
						title={copiedBlock === 'windows' ? 'Copied' : 'Copy command'}
					>
						{copiedBlock === 'windows' ? 'Copied' : 'Copy'}
					</button>
				</div>
				<pre><code>{WINDOWS_COMMANDS}</code></pre>
				<p class="install-note">
					Update later with <code>winget upgrade Cojudge.Cojudge</code>.
				</p>
			</section>

			<section class="install-block">
				<div class="install-block-head">
					<h3>Linux</h3>
				</div>
				<p class="install-note">
					Download the <code>.deb</code>, <code>.rpm</code>, or <code>.AppImage</code> from
					<a href={RELEASES_URL} target="_blank" rel="noreferrer">GitHub Releases</a>
					— per-distro install commands are in the release notes.
				</p>
			</section>
		</div>
	</div>
{/if}

<style>
	.install-modal-shell {
		position: fixed;
		inset: 0;
		z-index: 2000;
		display: grid;
		place-items: center;
		padding: 1rem;
	}
	.install-modal-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(15, 23, 42, 0.58);
		backdrop-filter: blur(3px);
		cursor: default;
	}
	.install-modal-card {
		position: relative;
		width: min(560px, 100%);
		max-height: min(85vh, 40rem);
		overflow-y: auto;
		box-sizing: border-box;
		padding: 1.4rem;
		border: 1px solid var(--color-border);
		border-radius: 0.9rem;
		background: var(--color-bg);
		color: var(--color-text);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
		font-family: var(--font-sans, sans-serif);
	}
	.install-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.install-modal-header h2 {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.35;
	}
	.install-modal-close {
		background: none;
		border: none;
		color: var(--color-text);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.25rem 0.4rem;
		opacity: 0.8;
	}
	.install-modal-close:hover {
		opacity: 1;
	}
	.install-modal-sub {
		margin: 0.5rem 0 0;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		line-height: 1.55;
	}
	.install-block {
		margin-top: 1.1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.65rem;
		padding: 0.8rem 0.9rem;
		background: var(--color-surface);
	}
	.install-block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.install-block-head h3 {
		margin: 0;
		font-size: 0.95rem;
	}
	.install-block-head h3 span {
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	.install-copy-btn {
		border: 1px solid var(--color-border);
		border-radius: 0.45rem;
		background: var(--color-bg);
		color: var(--color-text);
		font: inherit;
		font-size: 0.78rem;
		font-weight: 650;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
	}
	.install-copy-btn:hover {
		filter: brightness(1.04);
	}
	.install-block pre {
		margin: 0.6rem 0 0;
		padding: 0.65rem 0.75rem;
		border-radius: 0.5rem;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.install-block pre code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		white-space: pre;
	}
	.install-note {
		margin: 0.55rem 0 0;
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--color-text-secondary);
	}
	.install-note code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.78rem;
	}
	.install-note a {
		color: var(--color-highlight);
	}
	@media (max-width: 520px) {
		.install-modal-shell {
			align-items: end;
			padding: 0.7rem;
		}
	}
</style>
