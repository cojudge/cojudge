<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import AppDialog from '$lib/components/AppDialog.svelte';
	import { startCloudSync, stopCloudSync } from '$lib/cloudSync';
	import { isDesktopRuntime } from '$lib/firebaseSettings';
	import favicon from '$lib/assets/favicon.svg';
	import DemoBanner from '$lib/components/DemoBanner.svelte';
	import '../app.css';

	let { children, data } = $props();

	let zoom = 1;

	function isMacOS(): boolean {
		return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
	}

	async function handleZoomShortcut(event: KeyboardEvent): Promise<void> {
		if (!event.metaKey || event.ctrlKey || event.altKey) return;

		const zoomIn = event.key === '+' || event.key === '=' || event.code === 'Equal';
		const zoomOut = event.key === '-' || event.code === 'Minus';
		const resetZoom = event.key === '0' || event.code === 'Digit0';
		if (!zoomIn && !zoomOut && !resetZoom) return;

		event.preventDefault();
		event.stopPropagation();

		if (resetZoom) {
			zoom = 1;
		} else if (zoomIn) {
			zoom = Math.min(10, zoom + 0.2);
		} else {
			zoom = Math.max(0.2, zoom - 0.2);
		}

		const { getCurrentWebview } = await import('@tauri-apps/api/webview');
		await getCurrentWebview().setZoom(zoom);
	}

	onMount(() => {
		void startCloudSync();
		return stopCloudSync;
	});

	onMount(() => {
		if (!isDesktopRuntime() || !isMacOS()) return;

		// Tauri disables its native mousewheel zoom polyfill on macOS. Keep the
		// keyboard shortcut available without affecting Whiteboard's canvas zoom.
		window.addEventListener('keydown', handleZoomShortcut, true);
		return () => window.removeEventListener('keydown', handleZoomShortcut, true);
	});
</script>

<svelte:head>
	<title>Offline Code Judge for LeetCode-style problems - Cojudge</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.isDemoSite}
	<DemoBanner />
{/if}

{@render children?.()}
<AppDialog />
