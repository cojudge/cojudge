import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Optional extra hostnames allowed to reach `vite preview` (e.g. a Tailscale
// funnel domain proxying to this server). Set COJUDGE_ALLOWED_HOSTS to a
// comma-separated list. When unset, no `preview` options are configured and
// behavior is unchanged from stock Vite (localhost, desktop app, and normal
// `cojudge` use are unaffected). No hostnames or addresses are hardcoded here.
const extraAllowedHosts = (process.env.COJUDGE_ALLOWED_HOSTS ?? '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

export default defineConfig({
	plugins: [
		sveltekit()
	],
	...(extraAllowedHosts.length > 0
		? { preview: { allowedHosts: ['localhost', '127.0.0.1', '::1', ...extraAllowedHosts] } }
		: {})
});
