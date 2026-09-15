<script lang="ts">
	export let head: 'none' | 'arrow' | 'triangle' | 'triangle-outline';
	export let start = false;
</script>

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	<g transform={start ? 'translate(24 0) scale(-1 1)' : undefined}>
		<path d={head === 'triangle' || head === 'triangle-outline' ? 'M 3 12 H 12' : 'M 3 12 H 21'} />
		{#if head === 'arrow'}
			<path d="m 14 7 7 5 -7 5" />
		{:else if head === 'triangle' || head === 'triangle-outline'}
			<path d="M 21 12 12 7 V 17 Z" fill={head === 'triangle' ? 'currentColor' : 'none'} />
		{/if}
	</g>
</svg>
