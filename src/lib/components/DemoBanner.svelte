<script lang="ts">
    import { onMount } from "svelte";


	let visible = $state(false);

	function dismiss() {
		visible = false;
    localStorage.setItem('banner-dismissed', 'true');
	}

  onMount(() => {
    const dismissed = localStorage.getItem('banner-dismissed');
    if (!dismissed) {
      visible = true;
    }
  });
</script>

{#if visible}
	<div class="demo-banner">
		<p>
			This is a demo site. Run the judge locally
			<a href="https://github.com/cojudge/cojudge" target="_blank" rel="noreferrer">
				here
			</a>
		</p>
		<button onclick={dismiss} aria-label="Dismiss">
			&times;
		</button>
	</div>
{/if}

<style>
	.demo-banner {
    background-color: var(--color-bg);
		color: var(--color-text);
		padding: 0.75rem 1rem;
		text-align: center;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: var(--font-sans, sans-serif);
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.demo-banner p {
		margin: 0;
		font-size: 0.95rem;
		padding-right: 2rem; /* Space for close button */
	}

	.demo-banner a {
		color: var(--color-text);
		text-decoration: underline;
		font-weight: 600;
	}

	.demo-banner a:hover {
		text-decoration: none;
		opacity: 0.9;
	}

	.demo-banner button {
		background: none;
		border: none;
		color: var(--color-text);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.demo-banner button:hover {
		opacity: 1;
	}
</style>
