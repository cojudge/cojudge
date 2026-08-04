<script lang='ts'>
  import { onMount } from 'svelte';

  export let text = '';
  export let pos: 'top' | 'bottom' | 'left' | 'right' = 'top';
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
      class:showleft={pos === 'left'}
      class:showright={pos === 'right'}
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
    left: 50%;
    transform: translateX(-50%);
  }
  .tooltip-box.showbottom {
    top: 125%; /* Position below the element */
    left: 50%;
    transform: translateX(-50%);
  }
  .tooltip-box.showleft {
    right: 125%; /* Position to the left of the element */
    top: 50%;
    transform: translateY(-50%);
  }
  .tooltip-box.showright {
    left: 125%; /* Position to the right of the element */
    top: 50%;
    transform: translateY(-50%);
  }
  .tooltip-box {
    position: absolute;
    background-color: #333;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
  }
</style>
