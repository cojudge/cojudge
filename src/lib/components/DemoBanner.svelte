<script lang="ts">
    import InstallModal from "$lib/components/InstallModal.svelte";

	let showInstall = $state(false);
</script>

<div class="demo-banner">
	<p>
		This is a demo site. Run the judge locally -
		<button class="demo-banner-link" onclick={() => (showInstall = true)}>
			[instruction]
		</button>
	</p>
	<div class="demo-banner-actions">
		<a
			class="demo-banner-icon"
			href="https://github.com/cojudge/cojudge"
			target="_blank"
			rel="noreferrer"
			aria-label="Cojudge on GitHub"
			data-tip="Give us a star if you find this helpful!"
		>
			<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
				></path>
			</svg>
		</a>
	</div>
</div>
<InstallModal open={showInstall} onClose={() => (showInstall = false)} />

<style>
	.demo-banner {
    background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0.75rem 1rem;
		text-align: center;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: var(--font-sans, sans-serif);
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.demo-banner p {
		margin: 0;
		font-size: 0.95rem;
		padding-right: 3rem; /* Space for GitHub button */
	}

	.demo-banner-link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--color-text);
		text-decoration: underline;
		font-weight: 600;
		cursor: pointer;
	}

	.demo-banner-link:hover {
		text-decoration: none;
		opacity: 0.9;
	}

	.demo-banner-actions {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.demo-banner-icon {
		position: relative;
		display: inline-flex;
		padding: 0.25rem;
		color: var(--color-text);
		opacity: 0.8;
	}

	.demo-banner-icon:hover {
		opacity: 1;
	}

	.demo-banner-icon::after {
		content: attr(data-tip);
		position: absolute;
		top: 135%;
		right: 0;
		background-color: #333;
		color: white;
		padding: 6px 12px;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 400;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
		z-index: 10;
	}

	.demo-banner-icon:hover::after,
	.demo-banner-icon:focus-visible::after {
		opacity: 1;
	}
</style>
