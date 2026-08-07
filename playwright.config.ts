import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	// The MCP manager is a server singleton, so browser contexts share its
	// file snapshot and revision. Serialize tests to avoid cross-test races.
	workers: 1,
	use: {
		baseURL: 'http://localhost:4173'
	}
});
