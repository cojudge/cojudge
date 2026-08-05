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

test('explorer highlights markdown files in nested folders while in WYSIWYG mode', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.removeItem('files');
    localStorage.removeItem('playground-collapsed-folders');
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    const now = Date.now();
    const files = [
      {
        fileId: 'folder-a',
        fileName: 'FolderA',
        type: 'folder',
        content: '',
        language: 'plaintext',
        order: 0,
        lastUpdated: now
      },
      {
        fileId: 'note-a',
        fileName: 'NoteA',
        language: 'markdown',
        lastLanguage: 'markdown',
        content: '# A',
        viewState: null,
        output: '',
        logs: '',
        order: 1,
        isOpen: true,
        lastUpdated: now,
        parentId: 'folder-a'
      },
      {
        fileId: 'folder-b',
        fileName: 'FolderB',
        type: 'folder',
        content: '',
        language: 'plaintext',
        order: 2,
        lastUpdated: now
      },
      {
        fileId: 'note-b',
        fileName: 'NoteB',
        language: 'markdown',
        lastLanguage: 'markdown',
        content: '# B',
        viewState: null,
        output: '',
        logs: '',
        order: 3,
        isOpen: true,
        lastUpdated: now - 1,
        parentId: 'folder-b'
      }
    ];
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  });
  await page.reload();
  await expect(page.locator('[data-explorer-id="note-a"]')).toBeVisible();

  await page.locator('[data-explorer-id="note-b"]').click();
  await expect(page.locator('.markdown-mode-switch')).toBeVisible();
  await expect(page.locator('[data-explorer-id="note-b"]')).toHaveClass(/active/);
  await expect(page.locator('.file-item.active')).toHaveCount(1);

  await page.locator('[data-explorer-id="note-a"]').click();
  await expect(page.locator('[data-explorer-id="note-a"]')).toHaveClass(/active/);
  await expect(page.locator('[data-explorer-id="note-b"]')).not.toHaveClass(/active/);
});
