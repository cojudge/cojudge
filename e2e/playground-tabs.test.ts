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

test('closing an inactive preview keeps the active file and other contents unchanged', async ({ page }) => {
  await page.addInitScript(() => {
    const now = Date.now();
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'java' }));
    localStorage.setItem('playground-markdown-mode', 'source');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        {
          fileId: 'preview-a',
          fileName: 'Notes',
          language: 'markdown',
          content: '',
          isOpen: true,
          order: 0,
          lastUpdated: now,
          type: 'preview',
          sourceFileId: 'source-a'
        },
        {
          fileId: 'source-a',
          fileName: 'Notes',
          language: 'markdown',
          content: '# Notes',
          isOpen: false,
          order: 1,
          lastUpdated: now
        },
        {
          fileId: 'file-b',
          fileName: 'FileB',
          language: 'java',
          lastLanguage: 'java',
          content: '// file B',
          isOpen: true,
          order: 2,
          lastUpdated: now + 200
        },
        {
          fileId: 'file-c',
          fileName: 'FileC',
          language: 'java',
          lastLanguage: 'java',
          content: '// file C',
          isOpen: true,
          order: 3,
          lastUpdated: now + 100
        }
      ])
    }));
  });
  await page.goto('/playground');
  await expect(page.locator('.tab.active .tab-title')).toHaveText('FileB');
  await expect(page.locator('.monaco-editor .view-lines')).toContainText('file B');

  const notesTab = page.locator('.tab', { hasText: 'Notes' });
  await notesTab.hover();
  await notesTab.locator('.tab-close').click();

  await expect.poll(() => page.evaluate(() => {
    const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
    const files = JSON.parse(allFiles.playground || '[]');
    return files.find((file: { fileId: string; language: string }) =>
      file.fileId === 'file-c' && file.language === 'java'
    )?.content;
  })).toBe('// file C');
  await expect(page.locator('.tab.active .tab-title')).toHaveText('FileB');
  await expect(page.locator('.monaco-editor .view-lines')).toContainText('file B');
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

test('closing the last whiteboard tab clears its activity state', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    const files = [
      {
        fileId: 'whiteboard',
        fileName: 'Whiteboard',
        language: 'plaintext',
        content: '',
        isActive: false,
        order: 0,
        isOpen: true,
        type: 'whiteboard',
        lastUpdated: Date.now()
      }
    ];
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  });
  await page.reload();

  const whiteboardButton = page.locator('button[aria-label="Whiteboard"]');
  await expect(whiteboardButton).toHaveClass(/active/);
  await page.locator('.tab', { hasText: 'Whiteboard' }).locator('.tab-close').click();
  await expect(whiteboardButton).not.toHaveClass(/active/);
});
