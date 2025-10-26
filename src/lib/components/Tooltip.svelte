<script lang='ts'>
  import { onMount } from 'svelte';

  export let text = '';
  export let pos: 'top' | 'bottom' = 'top';
  let show = false;
  let element: any;

  onMount(() => {
    // Add event listeners to the wrapped element
    element.addEventListener('mouseenter', () => (show = true));
    element.addEventListener('mouseleave', () => (show = false));
  });
</script>

<div class="tooltip-container" bind:this={element}>
  <slot />
  {#if show}
    <div class="tooltip-box"
      class:showtop={pos === 'top'}
      class:showbottom={pos === 'bottom'}
    >{text}</div>
  {/if}
</div>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }
  .tooltip-box.showtop {
    bottom: 125%; /* Position above the element */
  }
  .tooltip-box.showbottom {
    top: 125%; /* Position below the element */
  }
  .tooltip-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
  }
</style>
