<script lang="ts">
  export let active: boolean = false;
  export let dir: 'asc' | 'desc' | undefined;
</script>

{#if active}
  {#if dir === 'asc'}
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="8,4 12,8 4,8" />
    </svg>
  {:else}
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="4,8 12,8 8,12" />
    </svg>
  {/if}
{:else}
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <polygon points="8,4 12,8 4,8" />
    <polygon points="4,10 12,10 8,14" />
  </svg>
{/if}
