import { expect, test, type Page } from '@playwright/test';

async function openMarkdownPlayground(page: Page) {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.removeItem('files');
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
  });
  await page.reload();
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await expect.poll(() => getMarkdownContent(page)).toContain('# Write your markdown here.');
}

function getMarkdownContent(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
    const files = JSON.parse(allFiles['playground'] || '[]');
    const entry = files.find((file: { language: string }) => file.language === 'markdown');
    return entry ? entry.content : null;
  });
}

test('playground markdown editor pastes clipboard images as base64 markdown', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await openMarkdownPlayground(page);

  await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 4;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#6965db';
    context.fillRect(0, 0, 4, 4);
    const image = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG creation failed')), 'image/png');
    });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': image })]);
  });

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('ControlOrMeta+v');

  await expect.poll(() => getMarkdownContent(page)).toMatch(/^!\[image\]\(data:image\/png;base64,/);
});

test('playground markdown preview has a WYSIWYG editing mode', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('# Hello\n\nsome text');
  await expect.poll(() => getMarkdownContent(page)).toBe('# Hello\n\nsome text');

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('h1')).toHaveText('Hello');

  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await expect(editable.locator('h1')).toHaveText('Hello');

  // Triple-click selects the paragraph, then bold it via the toolbar
  await editable.locator('p').click({ clickCount: 3 });
  await page.getByRole('button', { name: 'Bold', exact: true }).click();
  await expect.poll(() => getMarkdownContent(page)).toContain('**some text**');

  await page.getByRole('button', { name: 'Done editing' }).click();
  await expect(preview.locator('strong')).toHaveText('some text');
});
