<script lang="ts">
    import { LANGUAGE_ICONS } from '$lib/utils/languageIcon';
    import type { ProgrammingLanguage } from '$lib/utils/util';

    export let language: ProgrammingLanguage;
    export let size: number = 17;

    $: icon = LANGUAGE_ICONS[language] ?? LANGUAGE_ICONS.plaintext;
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    style="flex-shrink: 0;"
>
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill={icon.bg} />
    {#if language === 'plaintext' || !icon.label}
        <path d="M4 5.5h8M4 8h8M4 10.5h5" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" />
    {:else}
        <text
            x="8"
            y="8"
            text-anchor="middle"
            dominant-baseline="central"
            fill="#ffffff"
            font-size={icon.fontSize}
            font-weight="700"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        >{icon.label}</text>
    {/if}
</svg>
