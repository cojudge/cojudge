import { expect, test } from '@playwright/test';

test('folder collapse/expand state persists to localStorage across reloads', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.removeItem('files');
    // Reset the playground collapse-state key so the test starts clean
    localStorage.removeItem('playground-collapsed-folders');
    const now = Date.now();
    const files = [
      {
        fileId: 'folder-a',
        fileName: 'FolderA',
        type: 'folder',
        content: '',
        language: 'plaintext',
        isActive: false,
        order: 0,
        lastUpdated: now
      },
      {
        fileId: 'file-b',
        fileName: 'FileB',
        language: 'java',
        lastLanguage: 'java',
        content: '// file b',
        viewState: null,
        output: '',
        logs: '',
        isActive: false,
        order: 1,
        isOpen: true,
        lastUpdated: now,
        parentId: 'folder-a'
      }
    ];
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  });
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();

  const fileB = page.locator('[data-explorer-id="file-b"]');
  await expect(fileB).toBeVisible();

  // Collapse the folder: the child file becomes hidden
  await page.locator('[data-explorer-id="folder-a"] .folder-chevron').click();
  await expect(fileB).toHaveCount(0);

  // The collapse state is written to a device-local key, not the cloud 'files' bucket
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('playground-collapsed-folders') || '{}')
  );
  expect(stored['folder-a']).toBe(true);

  // Reload: the folder stays collapsed
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await expect(page.locator('[data-explorer-id="file-b"]')).toHaveCount(0);

  // Expand again: the child file reappears and the state is updated
  await page.locator('[data-explorer-id="folder-a"] .folder-chevron').click();
  await expect(page.locator('[data-explorer-id="file-b"]')).toBeVisible();
  const stored2 = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('playground-collapsed-folders') || '{}')
  );
  expect(stored2['folder-a']).toBe(false);
});