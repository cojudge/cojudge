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
  await editable.locator('p').first().click({ clickCount: 3 });
  await page.getByRole('button', { name: 'Bold', exact: true }).click();
  await expect.poll(() => getMarkdownContent(page)).toContain('**some text**');

  await page.getByRole('button', { name: 'Done editing' }).click();
  await expect(preview.locator('strong')).toHaveText('some text');
});

async function writeImageToClipboard(page: Page, width = 800, height = 600) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(async ({ width, height }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#6965db';
    context.fillRect(0, 0, width, height);
    const image = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG creation failed')), 'image/png');
    });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': image })]);
  }, { width, height });
}

async function pasteImageIntoEditor(page: Page, width = 800, height = 600) {
  await writeImageToClipboard(page, width, height);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('ControlOrMeta+v');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/^!\[image\]\(data:image\/png;base64,/);
}

test('pasted images render as thumbnails with lightbox and delete in the preview', async ({ page }) => {
  await openMarkdownPlayground(page);
  await pasteImageIntoEditor(page);

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  const thumbnail = preview.locator('.md-thumb');
  await expect(thumbnail).toBeVisible();
  await expect(thumbnail.locator('.md-thumb-delete')).toBeAttached();

  // The thumbnail is constrained, not the original 800x600 size
  const thumbBox = await thumbnail.locator('img').boundingBox();
  expect(thumbBox).not.toBeNull();
  expect(thumbBox!.width).toBeLessThanOrEqual(240);
  expect(thumbBox!.height).toBeLessThanOrEqual(160);

  // Clicking the thumbnail opens a full-screen lightbox
  await thumbnail.locator('img').click();
  const lightbox = page.locator('.image-lightbox');
  await expect(lightbox).toBeVisible();
  const lightboxBox = await lightbox.locator('img').boundingBox();
  expect(lightboxBox!.height).toBeGreaterThan(thumbBox!.height);

  // Esc closes the lightbox
  await page.keyboard.press('Escape');
  await expect(lightbox).not.toBeAttached();

  // Re-open, then close via the cross icon
  await thumbnail.locator('img').click();
  await expect(lightbox).toBeVisible();
  await lightbox.locator('.lightbox-close').click();
  await expect(lightbox).not.toBeAttached();

  // The trash icon removes the image from the source markdown
  await thumbnail.locator('.md-thumb-delete').click();
  await expect.poll(() => getMarkdownContent(page)).not.toContain('![image](');
  await expect(preview.locator('.md-thumb')).toHaveCount(0);
});

test('WYSIWYG keeps an empty line at the end so typing continues after a pasted image', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello');

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // The editor always ends with an empty line
  await expect(editable.locator('> p:last-child')).toHaveText('');

  // Paste an image at the end of the last line
  await writeImageToClipboard(page);
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');

  const thumbnail = editable.locator('.md-thumb');
  await expect(thumbnail).toBeVisible();
  // An empty line is kept after the thumbnail so the caret is not trapped
  await expect(editable.locator('> p:last-child')).toHaveText('');

  // Move past the image and keep typing. Images pasted in WYSIWYG mode have no
  // alt text, so they round-trip as ![](...), not ![image](...).
  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('more text');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/!\[\]\(data:image\/png;base64,[^)]*\)\n\nmore text/);

  // Round-tripping through edit mode must not accumulate blank lines: leaving
  // and re-entering WYSIWYG rebuilds the document from the stored markdown, so
  // typing on the trailing empty line adds exactly one blank line plus the
  // typed line, never more
  const stable = await getMarkdownContent(page);
  await page.getByRole('button', { name: 'Done editing' }).click();
  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  await editable.locator('p').last().click();
  await page.keyboard.type('x');
  await page.getByRole('button', { name: 'Done editing' }).click();
  await expect.poll(() => getMarkdownContent(page)).toBe(`${stable}\n\nx`);
});

test('WYSIWYG toolbar wraps the selection in inline code', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello world');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world');

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Select all the text, then apply inline code from the toolbar
  await editable.locator('p').first().click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Inline code' }).click();

  await expect(editable.locator('code')).toHaveText('hello world');
  await expect.poll(() => getMarkdownContent(page)).toContain('`hello world`');

  await page.getByRole('button', { name: 'Done editing' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('code')).toHaveText('hello world');
});

test('WYSIWYG auto-matches backticks into inline code and undo cancels it', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello');

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Type `code` at the end of the paragraph: the closing backtick should
  // match the opening one and form an inline code element
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.type(' `code`');

  const markerSpan = editable.locator('span[style*="var(--color-second-bg)"]');
  await expect(markerSpan).toHaveText('code');
  // The marker span is immediately styled like inline code (this rule lives in
  // app.css; Svelte strips it from component styles because it only matches
  // runtime-created elements)
  const markerFont = await markerSpan.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(markerFont.toLowerCase()).toContain('mono');
  await expect.poll(() => getMarkdownContent(page)).toContain('`code`');

  // Undo reverts the auto-format, keeping the typed backticks as plain text
  await page.keyboard.press('ControlOrMeta+z');
  await expect(markerSpan).toHaveCount(0);
  await expect(editable.locator('p').first()).toContainText('`code`');

  // The undone state stores the literal backticks (escaped in markdown), so
  // the preview shows them as plain text, not inline code
  await page.getByRole('button', { name: 'Done editing' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('p')).toContainText('`code`');
  await expect(preview.locator('code')).toHaveCount(0);
});

test('WYSIWYG code blocks have a working copy button', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```js\nconst a = 1;\n```');
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');

  await page.getByRole('button', { name: 'Preview Markdown' }).click();
  await page.getByRole('button', { name: 'Edit markdown (WYSIWYG)' }).click();
  const editable = page.locator('.wysiwyg-editing');
  const copyButton = editable.locator('.md-code-copy .copy-code-button');
  await expect(copyButton).toBeVisible();

  // Copying must not modify the stored markdown
  await copyButton.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('const a = 1;\n');

  await page.getByRole('button', { name: 'Done editing' }).click();
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');
});
