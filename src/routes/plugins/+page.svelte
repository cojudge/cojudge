<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	type Installed = {
		id: string;
		name: string;
		version: string;
		description: string;
		source: string;
		enabled: boolean;
	};
	type CatalogEntry = {
		id: string;
		name: string;
		description: string;
		source: string;
		version: string;
		problems?: number;
	};

	let tab = $state<'installed' | 'explore'>('installed');
	let installed = $state<Installed[]>([]);
	let catalog = $state<CatalogEntry[]>([]);
	let catalogError = $state('');
	let catalogLoaded = $state(false);
	let pluginsDir = $state('');
	let busy = $state<string | null>(null);
	let notice = $state('');
	let noticeIsError = $state(false);
	let customSource = $state('');

	/** https://github.com/owner/repo for GitHub sources; null for local paths. */
	function githubUrl(source: string): string | null {
		const m = /^(?:https?:\/\/)?(?:github\.com\/)?([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?\/?(?:@.*)?$/.exec(source.trim());
		if (!m || source.startsWith('/') || source.startsWith('.')) return null;
		return `https://github.com/${m[1]}/${m[2]}`;
	}

	const installedById = $derived(new Map(installed.map((p) => [p.id, p])));

	async function load(withCatalog = false) {
		const res = await fetch(`/api/plugins${withCatalog ? '?catalog=1' : ''}`);
		const data = await res.json();
		installed = data.installed ?? [];
		pluginsDir = data.pluginsDir ?? '';
		if (withCatalog) {
			catalog = data.catalog ?? [];
			catalogError = data.catalogError ?? '';
			catalogLoaded = true;
		}
	}

	async function act(action: string, payload: { id?: string; source?: string }, label: string) {
		busy = payload.id ?? payload.source ?? action;
		notice = '';
		try {
			const res = await fetch('/api/plugins', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, ...payload })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
			notice = label;
			noticeIsError = false;
			await load(catalogLoaded);
			await invalidateAll();
		} catch (error) {
			notice = error instanceof Error ? error.message : String(error);
			noticeIsError = true;
		} finally {
			busy = null;
		}
	}

	function openExplore() {
		tab = 'explore';
		if (!catalogLoaded) void load(true);
	}

	onMount(() => {
		void load();
		if (new URLSearchParams(location.search).get('tab') === 'explore') openExplore();
	});
</script>

<svelte:head>
	<title>Plugins · Cojudge</title>
</svelte:head>

<main class="plugins-page">
	<header>
		<a class="back" href="/">← Problems</a>
		<h1>Plugins</h1>
		<p class="sub">
			Problem packs add problems and courses. Installed packs work offline.
			{#if pluginsDir}<span class="dir">Folder: <code>{pluginsDir}</code></span>{/if}
		</p>
	</header>

	<div class="tabs" role="tablist">
		<button role="tab" aria-selected={tab === 'installed'} class:active={tab === 'installed'} onclick={() => (tab = 'installed')}>
			Installed ({installed.length})
		</button>
		<button role="tab" aria-selected={tab === 'explore'} class:active={tab === 'explore'} onclick={openExplore}>
			Explore
		</button>
	</div>

	{#if notice}
		<p class="notice" class:error={noticeIsError} role="status">{notice}</p>
	{/if}

	{#if tab === 'installed'}
		{#if installed.length === 0}
			<p class="empty">No plugins installed. <button class="link" onclick={openExplore}>Browse the catalog</button></p>
		{/if}
		<ul class="cards">
			{#each installed as p (p.id)}
				<li class="card" class:disabled={!p.enabled}>
					<div class="meta">
						<h2>{p.name} <span class="ver">v{p.version}</span></h2>
						<p>{p.description}</p>
						<p class="src"><code>{p.id}</code>{#if p.source} · {p.source}{/if}</p>
					</div>
					<div class="actions">
						{#if githubUrl(p.source)}
							<a class="gh" href={githubUrl(p.source)} target="_blank" rel="noopener noreferrer" title="View repository on GitHub" aria-label="View {p.name} on GitHub">
								<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
							</a>
						{/if}
						<label class="toggle" title={p.enabled ? 'Disable' : 'Enable'}>
							<input
								type="checkbox"
								checked={p.enabled}
								disabled={busy !== null}
								onchange={() => act(p.enabled ? 'disable' : 'enable', { id: p.id }, `${p.enabled ? 'Disabled' : 'Enabled'} ${p.name}`)}
							/>
							{p.enabled ? 'Enabled' : 'Disabled'}
						</label>
						{#if p.source && !p.source.startsWith('/')}
							<button disabled={busy !== null} onclick={() => act('upgrade', { id: p.id }, `Upgraded ${p.name}`)}>Upgrade</button>
						{/if}
						<button
							class="danger"
							disabled={busy !== null}
							onclick={() => confirm(`Uninstall ${p.name}? Your progress is kept.`) && act('uninstall', { id: p.id }, `Uninstalled ${p.name}`)}
						>
							Uninstall
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		{#if !catalogLoaded}
			<p class="empty">Loading catalog…</p>
		{:else if catalogError}
			<p class="notice error">Catalog unavailable ({catalogError}). You can still install by repository below.</p>
		{/if}
		<ul class="cards">
			{#each catalog as e (e.id)}
				{@const mine = installedById.get(e.id)}
				<li class="card">
					<div class="meta">
						<h2>{e.name} {#if e.version}<span class="ver">v{e.version}</span>{/if}</h2>
						<p>{e.description}</p>
						<p class="src">
							<code>{e.id}</code> · {e.source}{#if e.problems} · {e.problems} problems{/if}
						</p>
					</div>
					<div class="actions">
						{#if githubUrl(e.source)}
							<a class="gh" href={githubUrl(e.source)} target="_blank" rel="noopener noreferrer" title="View repository on GitHub" aria-label="View {e.name} on GitHub">
								<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
							</a>
						{/if}
						{#if mine}
							<span class="badge">Installed v{mine.version}{mine.enabled ? '' : ' (disabled)'}</span>
						{:else}
							<button class="primary" disabled={busy !== null} onclick={() => act('install', { source: e.source }, `Installed ${e.name}`)}>
								{busy === e.source ? 'Installing…' : 'Install'}
							</button>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
		<form
			class="custom"
			onsubmit={(ev) => {
				ev.preventDefault();
				const src = customSource.trim();
				if (src) void act('install', { source: src }, `Installed ${src}`);
			}}
		>
			<label for="custom-source">Install from GitHub</label>
			<input id="custom-source" placeholder="owner/repo" bind:value={customSource} />
			<button class="primary" type="submit" disabled={busy !== null || !customSource.trim()}>Install</button>
		</form>
	{/if}
</main>

<style>
	.plugins-page {
		max-width: 860px;
		margin: 0 auto;
		padding: 1.5rem 1rem 3rem;
		color: var(--color-text);
	}
	.back {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.9rem;
	}
	h1 {
		margin: 0.5rem 0 0.25rem;
	}
	.sub {
		color: var(--color-text-secondary);
		margin: 0 0 1rem;
	}
	.dir {
		display: block;
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}
	.tabs {
		display: flex;
		gap: 0.5rem;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 1rem;
	}
	.tabs button {
		background: none;
		font-weight: normal;
		border-radius: 0;
		transform: none !important;
		border: none;
		color: var(--color-text-secondary);
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		font-size: 0.95rem;
	}
	.tabs button.active {
		color: var(--color-text);
		border-bottom-color: var(--color-highlight);
	}
	.cards {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}
	.card {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: flex-start;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-md);
		padding: 0.9rem 1rem;
	}
	.card.disabled {
		opacity: 0.6;
	}
	.meta h2 {
		margin: 0 0 0.25rem;
		font-size: 1.05rem;
	}
	.meta p {
		margin: 0.15rem 0;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
	.ver {
		font-weight: normal;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}
	.src {
		font-size: 0.8rem !important;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-shrink: 0;
	}
	/* Same look as the problem page's Run / Submit buttons (ExecutionPanel .btn). */
	button {
		background-color: var(--color-surface-hover);
		color: var(--color-text-primary);
		border: none;
		border-radius: var(--border-radius-sm);
		padding: 0.4rem 0.9rem;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;
		transition: all 0.2s ease-in-out;
	}
	button:hover:not(:disabled) {
		transform: translateY(-2px);
	}
	button:active:not(:disabled) {
		transform: translateY(-1px);
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
	button.primary {
		background-color: var(--color-primary);
		color: var(--color-primary-text);
	}
	button.danger {
		color: var(--color-hard);
	}
	button.link {
		background: none;
		font-weight: normal;
		transform: none !important;
		border: none;
		padding: 0;
		color: var(--color-highlight);
		text-decoration: underline;
	}
	.toggle {
		display: flex;
		gap: 0.35rem;
		align-items: center;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.gh {
		display: inline-flex;
		color: var(--color-text-secondary);
		padding: 0.25rem;
		border-radius: var(--border-radius-sm);
	}
	.gh:hover {
		color: var(--color-text);
		background: var(--color-surface-hover);
	}
	.badge {
		font-size: 0.8rem;
		color: var(--color-easy);
	}
	.notice {
		padding: 0.5rem 0.75rem;
		border-radius: var(--border-radius-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
	}
	.notice.error {
		color: var(--color-incorrect);
	}
	.empty {
		color: var(--color-text-secondary);
	}
	.custom {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-top: 1.25rem;
	}
	.custom label {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}
	.custom input {
		flex: 1;
		background: var(--color-third-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-sm);
		padding: 0.4rem 0.6rem;
	}
</style>
