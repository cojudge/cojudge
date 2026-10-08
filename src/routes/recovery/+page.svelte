<script lang="ts">
	import { browser } from '$app/environment';
	import { collectProgressData } from '$lib/progressBackup';
	import {
		stripRegenerableState,
		summarizeFileStoreValue,
		type FileSizeRow
	} from '$lib/persistLimits';
	import { PASTED_IMAGES_KEY, getAllPastedImages } from '$lib/utils/imageStore';
	import { isDesktopRuntime } from '$lib/firebaseSettings';
	import { onMount } from 'svelte';

	// Safe-mode storage inspector. Deliberately dependency-light: no Monaco,
	// no whiteboard, no execution panels. Everything runs client-side against
	// localStorage/IndexedDB — no server round-trip — so this page stays
	// usable even when a bloated workspace wedges the playground or export.

	type KeyRow = { key: string; chars: number };
	type SlugInfo = {
		slug: string;
		chars: number;
		rows: FileSizeRow[] | null;
		error: string | null;
	};

	let keyRows = $state<KeyRow[]>([]);
	let slugs = $state<SlugInfo[]>([]);
	let imageCount = $state(0);
	let imageBytes = $state(0);
	let isDesktop = $state(false);
	let notice = $state('');
	let noticeIsError = $state(false);
	let loaded = $state(false);

	function formatBytes(chars: number): string {
		if (chars < 1024) return `${chars} B`;
		if (chars < 1024 * 1024) return `${(chars / 1024).toFixed(1)} KB`;
		return `${(chars / (1024 * 1024)).toFixed(2)} MB`;
	}

	function setNotice(message: string, isError = false) {
		notice = message;
		noticeIsError = isError;
	}

	function refresh() {
		if (!browser) return;
		isDesktop = isDesktopRuntime();
		const rows: KeyRow[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) rows.push({ key, chars: (localStorage.getItem(key) ?? '').length });
		}
		rows.sort((a, b) => b.chars - a.chars);
		keyRows = rows;

		const slugInfos: SlugInfo[] = [];
		try {
			const files = JSON.parse(localStorage.getItem('files') ?? '{}') as Record<string, unknown>;
			for (const [slug, serialized] of Object.entries(files)) {
				const raw = typeof serialized === 'string' ? serialized : JSON.stringify(serialized);
				const summary = summarizeFileStoreValue(raw);
				slugInfos.push({
					slug,
					chars: raw.length,
					rows: summary.ok ? summary.rows : null,
					error: summary.ok ? null : summary.error
				});
			}
		} catch (error) {
			setNotice(`Could not parse the files store: ${error instanceof Error ? error.message : String(error)}`, true);
		}
		slugInfos.sort((a, b) => b.chars - a.chars);
		slugs = slugInfos;
		loaded = true;
	}

	function writeFiles(next: Record<string, string>) {
		localStorage.setItem('files', JSON.stringify(next));
	}

	function readFiles(): Record<string, string> {
		return JSON.parse(localStorage.getItem('files') ?? '{}') as Record<string, string>;
	}

	function stripRunState() {
		try {
			const files = readFiles();
			let changed = 0;
			for (const [slug, serialized] of Object.entries(files)) {
				if (typeof serialized !== 'string') continue;
				try {
					const before = serialized.length;
					files[slug] = stripRegenerableState(serialized);
					if (files[slug].length !== before) changed++;
				} catch {
					// Leave unparseable slugs alone; the per-slug error shows why.
				}
			}
			writeFiles(files);
			setNotice(`Cleared run output/logs in ${changed} workspace(s). Reloading…`);
			setTimeout(() => location.reload(), 600);
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	function closePreviewTabs() {
		try {
			const files = readFiles();
			let closed = 0;
			for (const [slug, serialized] of Object.entries(files)) {
				if (typeof serialized !== 'string') continue;
				let entries: Array<Record<string, unknown>>;
				try {
					entries = JSON.parse(serialized) as Array<Record<string, unknown>>;
				} catch {
					continue;
				}
				if (!Array.isArray(entries)) continue;
				for (const entry of entries) {
					if (entry && typeof entry === 'object' && entry.type === 'preview' && entry.isOpen) {
						entry.isOpen = false;
						closed++;
					}
				}
				files[slug] = JSON.stringify(entries);
			}
			writeFiles(files);
			setNotice(`Closed ${closed} preview tab(s). Reloading…`);
			setTimeout(() => location.reload(), 600);
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	function deleteFile(slug: string, fileId: string, fileName: string) {
		if (!confirm(`Delete "${fileName}" and all of its language variants? This cannot be undone.`)) return;
		try {
			const files = readFiles();
			const entries = JSON.parse(files[slug] ?? '[]') as Array<Record<string, unknown>>;
			files[slug] = JSON.stringify(entries.filter((e) => e?.fileId !== fileId));
			writeFiles(files);
			setNotice(`Deleted "${fileName}". Reloading…`);
			setTimeout(() => location.reload(), 600);
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	function dropPlayground() {
		if (!confirm('Delete the ENTIRE playground workspace? Your problem solutions are kept. This cannot be undone.')) return;
		try {
			const files = readFiles();
			delete files.playground;
			writeFiles(files);
			setNotice('Playground workspace deleted. Reloading…');
			setTimeout(() => location.reload(), 600);
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	async function downloadBackup() {
		try {
			const data = collectProgressData(localStorage);
			const images = await getAllPastedImages();
			if (Object.keys(images).length > 0) data[PASTED_IMAGES_KEY] = images;
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `cojudge-localStorage-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				URL.revokeObjectURL(url);
				a.remove();
			}, 0);
			setNotice('Backup download started.');
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	async function savePartsToDownloads() {
		// Splits the backup so each server save stays far under the body limit.
		try {
			const filesRaw = localStorage.getItem('files') ?? '{}';
			const images = await getAllPastedImages();
			const parts: Array<[string, string]> = [
				['cojudge-files-part.json', filesRaw],
				['cojudge-images-part.json', JSON.stringify(images)]
			];
			const saved: string[] = [];
			for (const [filename, textData] of parts) {
				const response = await fetch('/api/export-file', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ textData, filename })
				});
				const result = await response.json().catch(() => ({}));
				if (!response.ok || !result.success) {
					throw new Error(result?.error || `Could not save ${filename} (HTTP ${response.status})`);
				}
				saved.push(result.filePath);
			}
			setNotice(`Saved parts to Downloads: ${saved.join(', ')}`);
		} catch (error) {
			setNotice(`Failed: ${error instanceof Error ? error.message : String(error)}`, true);
		}
	}

	onMount(async () => {
		refresh();
		try {
			const images = await getAllPastedImages();
			imageCount = Object.keys(images).length;
			imageBytes = Object.values(images).reduce(
				(total, dataUrl) => total + (typeof dataUrl === 'string' ? dataUrl.length : 0),
				0
			);
		} catch {
			// IndexedDB unavailable; localStorage report is still useful.
		}
	});
</script>

<svelte:head>
	<title>Recovery | Cojudge</title>
</svelte:head>

<div class="container">
	<h1>Recovery (safe mode)</h1>
	<p class="muted">
		This page never renders your files — it only measures them — so it stays usable when the
		playground hangs. Actions apply instantly to this device and reload the page.
		<a href="/">Back home</a> · <a href="/playground">Open playground</a>
	</p>

	{#if notice}
		<p class:notice-error={noticeIsError} class:notice-ok={!noticeIsError}>{notice}</p>
	{/if}

	{#if !loaded}
		<p>Loading…</p>
	{:else}
		<div class="actions">
			<button class="btn" onclick={downloadBackup} title="Download the full backup in the app (no server round-trip)">Download backup</button>
			{#if isDesktop}
				<button class="btn" onclick={savePartsToDownloads} title="Save files + images as two small files in Downloads via the desktop backend">Save parts to Downloads</button>
			{/if}
			<button class="btn" onclick={stripRunState} title="Clear persisted run output/logs everywhere (code and notes are kept)">Strip run output</button>
			<button class="btn" onclick={closePreviewTabs} title="Close preview tabs so the playground opens on an editor tab">Close preview tabs</button>
			<button class="btn danger" onclick={dropPlayground} title="Delete the whole playground workspace (problem solutions are kept)">Delete playground</button>
		</div>

		<h2>Storage keys ({formatBytes(keyRows.reduce((t, r) => t + r.chars, 0))} total)</h2>
		<table>
			<thead><tr><th>Key</th><th>Size</th></tr></thead>
			<tbody>
				{#each keyRows as row}
					<tr><td><code>{row.key}</code></td><td>{formatBytes(row.chars)}</td></tr>
				{/each}
			</tbody>
		</table>

		<h2>Pasted images (IndexedDB): {imageCount} images, {formatBytes(imageBytes)}</h2>
		<p class="muted">Screenshots embedded in markdown notes. They are bundled into every backup export, so they dominate export size.</p>

		{#each slugs as slug}
			<h2>Workspace <code>{slug.slug}</code> ({formatBytes(slug.chars)})</h2>
			{#if slug.error}
				<p class="notice-error">Could not parse this workspace: {slug.error}. Delete individual files is unavailable; use “Delete playground” above if this is the broken one.</p>
			{:else if slug.rows}
				<table>
					<thead><tr><th>File</th><th>Lang</th><th>Content</th><th>Output</th><th>Logs</th><th></th></tr></thead>
					<tbody>
						{#each slug.rows as row}
							<tr>
								<td>{row.fileName} <span class="muted">[{row.type}]</span></td>
								<td>{row.language}</td>
								<td>{formatBytes(row.contentChars)}</td>
								<td>{formatBytes(row.outputChars)}</td>
								<td>{formatBytes(row.logsChars)}</td>
								<td><button class="btn small" onclick={() => deleteFile(slug.slug, row.fileId, row.fileName)}>Delete</button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.container {
		max-width: 960px;
	}
	.muted {
		color: #666;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 12px 0 20px;
	}
	.btn.small {
		padding: 2px 8px;
		font-size: 12px;
	}
	.btn.danger {
		border-color: #c00;
		color: #c00;
	}
	table {
		border-collapse: collapse;
		margin-bottom: 20px;
		width: 100%;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 4px 8px;
		text-align: left;
	}
	.notice-ok {
		background: #eef7ee;
		border-left: 4px solid #2a7;
		padding: 8px 12px;
	}
	.notice-error {
		background: #fdf1ef;
		border-left: 4px solid #c00;
		padding: 8px 12px;
	}
</style>
