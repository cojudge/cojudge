<script lang="ts">
	interface Props {
		name: string;
		size?: number;
		strokeWidth?: number;
	}

	let { name, size = 20, strokeWidth = 1.8 }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'menu'}
		<path d="M4 7h16M4 12h16M4 17h16" />
	{:else if name === 'whiteboard'}
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="m8 15 6-6 2 2-6 6H8v-2Z" />
	{:else if name === 'lock'}
		<rect x="5.5" y="10" width="13" height="10" rx="2" />
		<path d="M8.5 10V7a3.5 3.5 0 0 1 7 0" />
		<circle cx="12" cy="15" r="1" />
	{:else if name === 'unlock'}
		<rect x="5.5" y="10" width="13" height="10" rx="2" />
		<path d="M15.5 10V7a3.5 3.5 0 0 0-6.7-1.4" />
		<circle cx="12" cy="15" r="1" />
	{:else if name === 'hand'}
		<path d="M8.3 11.4V6.2a1.4 1.4 0 0 1 2.8 0v4.1-5.7a1.4 1.4 0 0 1 2.8 0v5.7-4.7a1.4 1.4 0 0 1 2.8 0v5.6-3.3a1.4 1.4 0 0 1 2.8 0v6.2c0 4.2-2.6 6.9-6.4 6.9h-.8c-2.1 0-3.5-.9-4.8-2.5l-3-3.7a1.55 1.55 0 0 1 2.3-2.1l1.5 1.4" />
	{:else if name === 'selection'}
		<path d="m5 3 13.2 7.1-6.1 1.8-2.2 6.1L5 3Z" fill="currentColor" stroke="none" />
		<path d="m12 12 4.2 4.2" />
	{:else if name === 'rectangle'}
		<rect x="4" y="4" width="16" height="16" rx="1.5" />
	{:else if name === 'diamond'}
		<path d="m12 3 9 9-9 9-9-9 9-9Z" />
	{:else if name === 'ellipse'}
		<circle cx="12" cy="12" r="8.5" />
	{:else if name === 'arrow'}
		<path d="M5 19 19 5M10 5h9v9" />
	{:else if name === 'line'}
		<path d="M5 19 19 5" />
	{:else if name === 'pencil'}
		<path d="m4 20 3.8-.8L19 8a2.1 2.1 0 0 0-3-3L4.8 16.2 4 20Z" />
		<path d="m14.7 6.3 3 3" />
	{:else if name === 'text'}
		<path d="M5 5V3h14v2M9 21h6M12 3v18" />
	{:else if name === 'image'}
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<circle cx="8.5" cy="9" r="1.5" />
		<path d="m4 17 4.5-4.5 3 3 2-2L20 20" />
	{:else if name === 'eraser'}
		<path d="m7.3 19.7-3-3a2 2 0 0 1 0-2.8L14.9 3.3a2 2 0 0 1 2.8 0l3 3a2 2 0 0 1 0 2.8L10.1 19.7a2 2 0 0 1-2.8 0Z" />
		<path d="m12 6.2 5.8 5.8M10 21h11" />
	{:else if name === 'more'}
		<circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
		<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
		<circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
	{:else if name === 'panel'}
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="M14 4v16" />
	{:else if name === 'minus'}
		<path d="M5 12h14" />
	{:else if name === 'plus'}
		<path d="M12 5v14M5 12h14" />
	{:else if name === 'undo'}
		<path d="m9 8-5 4 5 4" />
		<path d="M5 12h8.5a5.5 5.5 0 0 1 5.5 5.5" />
	{:else if name === 'redo'}
		<path d="m15 8 5 4-5 4" />
		<path d="M19 12h-8.5A5.5 5.5 0 0 0 5 17.5" />
	{:else if name === 'help'}
		<circle cx="12" cy="12" r="9" />
		<path d="M9.7 9a2.5 2.5 0 1 1 3.6 2.2c-.9.5-1.3 1-1.3 2" />
		<circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
	{:else if name === 'shield'}
		<path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" fill="currentColor" stroke="none" />
		<path d="m8.5 12 2.2 2.2 4.8-5" stroke="white" stroke-width="1.8" />
	{:else if name === 'close'}
		<path d="m6 6 12 12M18 6 6 18" />
	{:else if name === 'download'}
		<path d="M12 3v12m-4-4 4 4 4-4M5 20h14" />
	{:else if name === 'upload'}
		<path d="M12 16V4m-4 4 4-4 4 4M5 20h14" />
	{:else if name === 'trash'}
		<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
	{:else if name === 'home'}
		<path d="m3 11 9-8 9 8M5.5 9v11h13V9M9.5 20v-6h5v6" />
	{:else if name === 'moon'}
		<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
	{:else if name === 'sun'}
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
	{:else if name === 'grid'}
		<rect x="4" y="4" width="16" height="16" rx="1" />
		<path d="M4 10h16M4 16h16M10 4v16M16 4v16" />
	{:else if name === 'copy'}
		<rect x="8" y="8" width="12" height="12" rx="2" />
		<path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
	{:else if name === 'check'}
		<path d="m5 12 4 4L19 6" />
	{:else if name === 'fit'}
		<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
	{:else if name === 'layers-up'}
		<path d="m12 3 9 5-9 5-9-5 9-5Z" />
		<path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
	{:else if name === 'layers-down'}
		<path d="m12 11 9 5-9 5-9-5 9-5Z" />
		<path d="m3 12 9-5 9 5M3 8l9-5 9 5" />
	{:else if name === 'external'}
		<path d="M14 4h6v6M20 4 11 13" />
		<path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
	{:else if name === 'chevron-right'}
		<path d="m9 5 7 7-7 7" />
	{:else}
		<circle cx="12" cy="12" r="8" />
	{/if}
</svg>
