import { expect, test } from '@playwright/test';

test('Cojudge Cloud is optional and explicitly offline-first', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Toggle menu' }).click();
	await page.getByRole('menuitem', { name: /Cojudge Cloud/ }).click();

	const dialog = page.getByRole('dialog', { name: 'Cojudge Cloud' });
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText('Nothing syncs automatically');
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
});

test('cloud status fits in the responsive menu without wrapping labels', async ({ page }) => {
	await page.setViewportSize({ width: 360, height: 760 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Toggle menu' }).click();

	const menu = page.getByRole('menu');
	const cloudItem = page.getByRole('menuitem', { name: /Cojudge Cloud/ });
	await expect(menu).toBeVisible();
	const menuBox = await menu.boundingBox();
	expect(menuBox?.width).toBeGreaterThanOrEqual(220);
	await expect(cloudItem.locator('.dropdown-item-content')).toHaveCSS('white-space', 'nowrap');
});

test('progress exports omit Firebase auth and cloud bookkeeping', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.setItem('solutions', JSON.stringify({ 'two-sum': 'return result;' }));
		localStorage.setItem('firebase:authUser:test', 'private-auth-state');
		localStorage.setItem('cojudge-cloud-sync-meta', JSON.stringify({ private: true }));
		localStorage.setItem('cojudge-firebase-settings', JSON.stringify({ projectId: 'untrusted' }));
	});

	await page.getByRole('button', { name: 'Toggle menu' }).click();
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('menuitem', { name: 'Export progress' }).click();
	const download = await downloadPromise;
	const stream = await download.createReadStream();
	const chunks: Buffer[] = [];
	for await (const chunk of stream) chunks.push(Buffer.from(chunk));
	const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));

	expect(exported.solutions).toEqual({ 'two-sum': 'return result;' });
	expect(exported['firebase:authUser:test']).toBeUndefined();
	expect(exported['cojudge-cloud-sync-meta']).toBeUndefined();
	expect(exported['cojudge-firebase-settings']).toBeUndefined();
});

test('progress imports cannot replace the Firebase project', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.setItem('cojudge-firebase-settings', JSON.stringify({ projectId: 'trusted' }));
	});
	await page.locator('input[type="file"]').setInputFiles({
		name: 'untrusted-backup.json',
		mimeType: 'application/json',
		buffer: Buffer.from(
			JSON.stringify({
				'cojudge-firebase-settings': { projectId: 'untrusted' },
				'user-checkboxes': { 'two-sum': true }
			})
		)
	});
	await page.getByRole('button', { name: 'Import data' }).click();

	await expect
		.poll(() =>
			page.evaluate(() => JSON.parse(localStorage.getItem('cojudge-firebase-settings') || '{}').projectId)
		)
		.toBe('trusted');
});

test('progress imports accept historical preview tabs', async ({ page }) => {
	await page.goto('/');
	const preview = {
		fileId: 'preview-1',
		fileName: 'Preview',
		language: 'markdown',
		content: '# Preview',
		isOpen: true,
		lastUpdated: 1,
		type: 'preview',
		sourceFileId: 'source-1',
		order: 1
	};
	await page.locator('input[type="file"]').setInputFiles({
		name: 'historical-backup.json',
		mimeType: 'application/json',
		buffer: Buffer.from(JSON.stringify({ files: { playground: JSON.stringify([preview]) } }))
	});
	await page.getByRole('button', { name: 'Import data' }).click();

	await expect
		.poll(() =>
			page.evaluate(() => {
				const files = JSON.parse(localStorage.getItem('files') || '{}');
				return JSON.parse(files.playground || '[]')[0]?.type;
			})
		)
		.toBe('preview');
});
