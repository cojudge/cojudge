import { expect, test } from '@playwright/test';

test('closing the active tab keeps the next tab\'s own language', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    const now = Date.now();
    const files = [
      {
        fileId: 'file-a',
        fileName: 'FileA',
        language: 'java',
        lastLanguage: 'java',
        content: '// java file A',
        viewState: null,
        output: '',
        logs: '',
        isActive: false,
        order: 0,
        isOpen: true,
        // Most recently viewed: becomes the active tab on load
        lastUpdated: now + 1000
      },
      {
        fileId: 'file-b',
        fileName: 'FileB',
        language: 'python',
        lastLanguage: 'python',
        content: '# python file B',
        viewState: null,
        output: '',
        logs: '',
        isActive: false,
        order: 1,
        isOpen: true,
        lastUpdated: now
      }
    ];
    localStorage.removeItem('user-settings');
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  });
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();

  // Tab A (java) is active initially
  await expect(page.locator('.tab.active .tab-title')).toHaveText('FileA');
  await expect(page.locator('#language-select')).toHaveValue('java');

  // Closing tab A activates tab B, which must keep its own language (python)
  // instead of inheriting the closed tab's language (java)
  await page.locator('.tab', { hasText: 'FileA' }).locator('.tab-close').click();
  await expect(page.locator('.tab.active .tab-title')).toHaveText('FileB');
  await expect(page.locator('#language-select')).toHaveValue('python');
  await expect(page.locator('.monaco-editor .view-lines')).toContainText('python file B');
});

test('recent whiteboards use the whiteboard icon', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    const now = Date.now();
    const files = [
      {
        fileId: 'whiteboard',
        fileName: 'Whiteboard',
        language: 'plaintext',
        content: '',
        isActive: false,
        order: 0,
        isOpen: false,
        type: 'whiteboard',
        lastUpdated: now + 1000
      },
      {
        fileId: 'markdown-file',
        fileName: 'Notes',
        language: 'markdown',
        content: '# Notes',
        isActive: false,
        order: 1,
        isOpen: false,
        lastUpdated: now
      }
    ];
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  });
  await page.reload();

  const card = page.locator('.recent-file-card').filter({ hasText: 'Whiteboard' });
  await expect(card).toHaveCount(1);
  await expect(card.locator('svg[viewBox="0 0 24 24"]')).toHaveCount(1);
});
