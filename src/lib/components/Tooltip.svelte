<script lang='ts'>
  import { onMount } from 'svelte';

  export let text = '';
  export let pos: 'top' | 'bottom' | 'left' | 'right' = 'top';
  let show = false;
  let element: any;

  onMount(() => {
    const onEnter = () => (show = true);
    const onLeave = () => (show = false);
    // Dismiss on click: activating a toggle reshuffles the layout and can
    // move the button out from under the cursor, so mouseleave may never
    // fire and the tooltip would stay stuck until the next hover.
    const onClick = () => (show = false);
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    element.addEventListener('click', onClick);
    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      element.removeEventListener('click', onClick);
    };
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
