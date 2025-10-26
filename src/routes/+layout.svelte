<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Offline Code Judge for LeetCode-style problems</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
