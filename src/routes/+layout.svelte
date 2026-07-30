<script lang="ts">
	import { page } from '$app/stores';
	import AppDialog from '$lib/components/AppDialog.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import DemoBanner from '$lib/components/DemoBanner.svelte';
	import '../app.css';

	let { children, data } = $props();
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
