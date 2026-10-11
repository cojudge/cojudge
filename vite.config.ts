import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	// Temporary: allow access via Tailscale Funnel MagicDNS name.
	preview: {
		allowedHosts: ['cachyos-x8664.tail6986be.ts.net']
	}
});
