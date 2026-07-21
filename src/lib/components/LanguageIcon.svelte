<script lang="ts">
    import type { ProgrammingLanguage } from '$lib/utils/util';

    export let language: ProgrammingLanguage;
    export let size: number = 17;

    type IconDef = { label: string; bg: string; fontSize: number };

    const icons: Record<ProgrammingLanguage, IconDef> = {
        java: { label: 'J', bg: '#e76f00', fontSize: 9.5 },
        python: { label: 'Py', bg: '#eebb62', fontSize: 8 },
        cpp: { label: 'C++', bg: '#9b4f96', fontSize: 6.2 },
        csharp: { label: 'C#', bg: '#68217a', fontSize: 8 },
        rust: { label: 'Rs', bg: '#ce422b', fontSize: 8 },
        go: { label: 'Go', bg: '#00add8', fontSize: 8 },
        typescript: { label: 'TS', bg: '#3178c6', fontSize: 8 },
        markdown: { label: 'MD', bg: '#519aba', fontSize: 7 },
        plaintext: { label: '', bg: '#6b7280', fontSize: 8 }
    };

    $: icon = icons[language] ?? icons.plaintext;
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
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
