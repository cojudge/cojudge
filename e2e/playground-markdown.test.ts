import { expect, test, type Page } from '@playwright/test';

async function openMarkdownPlayground(page: Page) {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'source');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'n1', fileName: 'Notes', language: 'markdown', content: '# Write your markdown here.', isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    }));
  });
  await page.reload();
  const dismiss = page.getByRole('button', { name: 'Dismiss' });
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
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

function getFileContent(page: Page, fileId: string, language: string): Promise<string | null> {
  return page.evaluate(({ fileId, language }) => {
    const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
    const files = JSON.parse(allFiles.playground || '[]');
    const entry = files.find((file: { fileId: string; language: string }) =>
      file.fileId === fileId && file.language === language
    );
    return entry?.content ?? null;
  }, { fileId, language });
}

test('closing the active WYSIWYG tab keeps the other markdown tab in WYSIWYG mode', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'n1', fileName: 'Notes', language: 'markdown', content: '# Notes', isOpen: false, order: 0, lastUpdated: Date.now() },
        { fileId: 'n2', fileName: 'Tasks', language: 'markdown', content: '# Tasks', isOpen: false, order: 1, lastUpdated: Date.now() }
      ])
    }));
  });
  await page.reload();
  const dismiss = page.getByRole('button', { name: 'Dismiss' });
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click();

  // Open both files in WYSIWYG mode
  await page.locator('.file-item', { hasText: 'Notes' }).click();
  await expect(page.locator('.wysiwyg-editing h1')).toHaveText('Notes');
  await page.locator('.file-item', { hasText: 'Tasks' }).click();
  await expect(page.locator('.wysiwyg-editing h1')).toHaveText('Tasks');

  // Close the active (Tasks) tab — the remaining Notes tab should stay in WYSIWYG
  await page.locator('.tab:has-text("Tasks") .tab-close').click();
  await expect(page.locator('.wysiwyg-editing')).toBeVisible();
  await expect(page.locator('.wysiwyg-editing h1')).toHaveText('Notes');
});

test('closing the last WYSIWYG tab does not restore stale source content', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'note', fileName: 'Note', language: 'markdown', content: '# Original', isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    }));
  });
  await page.goto('/playground');

  const editable = page.locator('.wysiwyg-editing');
  await expect(editable.locator('h1')).toHaveText('Original');
  await editable.evaluate((element) => {
    element.innerHTML = '<h1>Edited in WYSIWYG</h1>';
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  });
  await expect.poll(() => getFileContent(page, 'note', 'markdown')).toContain('Edited in WYSIWYG');

  await page.locator('.tab.active .tab-close').click();

  await expect(page.locator('.empty-state')).toBeVisible();
  await expect.poll(() => getFileContent(page, 'note', 'markdown')).toContain('Edited in WYSIWYG');
});

test('WYSIWYG creates a missing markdown source before saving', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('missing-markdown-source-seeded')) return;
    sessionStorage.setItem('missing-markdown-source-seeded', 'true');
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        {
          fileId: 'new-note',
          fileName: 'New note',
          language: 'java',
          lastLanguage: 'markdown',
          content: '// Existing language version',
          isOpen: true,
          order: 0,
          lastUpdated: Date.now()
        }
      ])
    }));
  });
  await page.goto('/playground');

  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await editable.evaluate((element) => {
    element.innerHTML = '<p>First saved note</p>';
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  });

  await expect.poll(() => getFileContent(page, 'new-note', 'markdown')).toContain('First saved note');
  await page.reload();
  await expect(page.locator('.wysiwyg-editing')).toContainText('First saved note');
});

test('discarding an active WYSIWYG file reloads the restored content', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'active-file', fileName: 'Notes', language: 'markdown', content: '\n\n# Local version', isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    }));
  });
  await page.reload();
  await expect(page.locator('.wysiwyg-editing h1')).toHaveText('Local version');
  await page.evaluate(() => window.dispatchEvent(new Event('cojudge:cloud-flush')));
  await expect.poll(() => getMarkdownContent(page)).toBe('\n\n# Local version');

  await page.evaluate(() => {
    const restoredFiles = JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'active-file', fileName: 'Notes', language: 'markdown', content: '\n\n# Cloud version', isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    });
    localStorage.setItem('files', restoredFiles);
    window.dispatchEvent(new StorageEvent('storage', { key: 'files', newValue: restoredFiles }));
    window.dispatchEvent(new CustomEvent('cojudge:cloud-file-discarded', { detail: { fileId: 'active-file' } }));
    window.dispatchEvent(new Event('cojudge:cloud-flush'));
  });

  await expect(page.locator('.wysiwyg-editing h1')).toHaveText('Cloud version');
  await expect.poll(() => getMarkdownContent(page)).toBe('\n\n# Cloud version');
});

test('playground markdown editor stores pasted clipboard images by reference', async ({ page }) => {
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

  await expect.poll(() => getMarkdownContent(page)).toMatch(/^!\[image\]\(cojudge:\/\/image\/[^)]+\)$/);
});

test('WYSIWYG paste turns a URL string into a link', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  await editable.locator('> p:last-child').click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');

  await page.evaluate(async () => {
    await navigator.clipboard.writeText('https://example.com/path');
  });
  await page.keyboard.press('ControlOrMeta+v');

  await expect(editable.locator('a[href="https://example.com/path"]')).toHaveAttribute('target', '_blank');
  await expect.poll(() => getMarkdownContent(page)).toContain('[https://example.com/path](https://example.com/path)');
});

test('browser WYSIWYG opens external links in a new tab', async ({ page }) => {
  await page.goto('/playground');
  await page.evaluate(() => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'linked-note', fileName: 'Linked note', language: 'markdown', content: '[Example](https://example.com/path)', isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    }));
  });
  await page.reload();
  const dismiss = page.getByRole('button', { name: 'Dismiss' });
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click();

  const link = page.locator('.wysiwyg-editing a[href="https://example.com/path"]');
  await expect(link).toBeVisible();
  const popup = page.waitForEvent('popup');
  await link.click();
  await expect(await popup).toHaveURL('https://example.com/path');
});

test('playground markdown preview has a WYSIWYG editing mode', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('# Hello\n\nsome text');
  await expect.poll(() => getMarkdownContent(page)).toBe('# Hello\n\nsome text');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await expect(editable.locator('h1')).toHaveText('Hello');

  // Triple-click selects the paragraph, then bold it via the toolbar
  await editable.locator('p').first().click({ clickCount: 3 });
  await page.getByRole('button', { name: 'Bold', exact: true }).click();
  await expect.poll(() => getMarkdownContent(page)).toContain('**some text**');

  await page.getByRole('button', { name: 'Preview' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('strong')).toHaveText('some text');

  // Switch to source via Source button, then back to preview
  await page.getByRole('button', { name: 'Source' }).click();
  await expect(page.locator('.monaco-editor')).toBeVisible();

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  await expect(editable).toBeVisible();

  // Click "Preview" to view read-only mode while on preview tab
  await page.getByRole('button', { name: 'Preview' }).click();
  await expect(preview).toBeVisible();

  // Switch to source and back to preview (mode switch replaces the tab in place)
  await page.getByRole('button', { name: 'Source' }).click();
  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  // By default, opening preview opens the WYSIWYG editor
  await expect(editable).toBeVisible();
});

test('WYSIWYG turns an exact three-hyphen line into a horizontal rule', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  await editable.locator('> p:last-child').click();
  await page.keyboard.type('not---');
  await expect(editable.locator('hr')).toHaveCount(0);
  await page.keyboard.press('Enter');
  await page.keyboard.type('-');
  await page.keyboard.press('Shift+Enter');
  await page.keyboard.type('--');
  await expect(editable.locator('hr')).toHaveCount(0);
  await page.keyboard.press('Enter');
  await page.keyboard.type('---');
  await expect(editable.locator('hr')).toHaveCount(1);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^---$/gm)?.length ?? 0).toBe(1);

  await page.getByRole('button', { name: 'Horizontal rule' }).click();
  await expect(editable.locator('hr')).toHaveCount(2);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^---$/gm)?.length ?? 0).toBe(2);
});

test('horizontal rule toolbar preserves Markdown tables', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('| A | B |\n| - | - |\n| 1 | 2 |');
  await expect.poll(() => getMarkdownContent(page)).toContain('| 1 | 2 |');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('td').first().click();
  await page.getByRole('button', { name: 'Horizontal rule' }).click();

  await expect(editable.locator('table')).toHaveCount(1);
  await expect(editable.locator('hr')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toContain('| 1 | 2 |');
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

async function delayImageClipboardReads(page: Page, delayMs: number | number[] = 250) {
  const delays = Array.isArray(delayMs) ? delayMs : [delayMs];
  await page.evaluate((schedule) => {
    const readAsDataUrl = FileReader.prototype.readAsDataURL;
    let readIndex = 0;
    FileReader.prototype.readAsDataURL = function (blob: Blob) {
      const delay = schedule[Math.min(readIndex++, schedule.length - 1)];
      setTimeout(() => readAsDataUrl.call(this, blob), delay);
    };
  }, delays);
}

async function failNextImageClipboardRead(page: Page) {
  await page.evaluate(() => {
    FileReader.prototype.readAsDataURL = function () {
      queueMicrotask(() => this.dispatchEvent(new ProgressEvent('error')));
    };
  });
}

async function storedImageExists(page: Page, id: string) {
  return page.evaluate((imageId) => new Promise<boolean>((resolve, reject) => {
    const request = indexedDB.open('cojudge-images', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const lookup = db.transaction('images', 'readonly').objectStore('images').get(imageId);
      lookup.onerror = () => reject(lookup.error);
      lookup.onsuccess = () => {
        resolve(!!lookup.result);
        db.close();
      };
    };
  }), id);
}

async function pasteImageIntoEditor(page: Page, width = 800, height = 600) {
  await writeImageToClipboard(page, width, height);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('ControlOrMeta+v');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/^!\[image\]\(cojudge:\/\/image\/[^)]+\)$/);
}

test('pasted images render as thumbnails with lightbox and delete in the preview', async ({ page }) => {
  await openMarkdownPlayground(page);
  await pasteImageIntoEditor(page);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  await page.getByRole('button', { name: 'Preview' }).click();
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

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
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
  await expect.poll(() => getMarkdownContent(page)).toMatch(/!\[\]\(cojudge:\/\/image\/[^)]+\)\n\nmore text/);

  // Round-tripping through edit mode must not accumulate blank lines: leaving
  // and re-entering WYSIWYG rebuilds the document from the stored markdown, so
  // typing on the trailing empty line adds exactly one blank line plus the
  // typed line, never more
  const stable = await getMarkdownContent(page);
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  await editable.locator('p').last().click();
  await page.keyboard.type('x');
  await page.getByRole('button', { name: 'Preview' }).click();
  await expect.poll(() => getMarkdownContent(page)).toBe(`${stable}\n\nx`);
});

test('WYSIWYG can undo deletion of a pasted image', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await writeImageToClipboard(page);
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);

  await editable.locator('.md-thumb-delete').click();
  await expect(editable.locator('.md-thumb')).toHaveCount(0);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).toContain('cojudge://image/');
});

test('WYSIWYG keeps a pending image paste as one undoable action', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await delayImageClipboardReads(page, 1000);
  await writeImageToClipboard(page);
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('[data-wysiwyg-pending-image]')).toHaveCount(1);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('[data-wysiwyg-pending-image]')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  // Redo while storage is still pending must retain the paste and its ordering.
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).toMatch(/^before\s*!\[\]\(cojudge:\/\/image\/[^)]+\)$/);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('before');
});

test('WYSIWYG updates an open link transaction when a pending image resolves', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await delayImageClipboardReads(page, 1000);
  await writeImageToClipboard(page);
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('[data-wysiwyg-pending-image]')).toHaveCount(1);

  await page.getByRole('button', { name: 'Insert link' }).click();
  await page.getByRole('textbox', { name: 'Link URL' }).fill('https://example.com');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(editable.locator('a[href="https://example.com"]')).toBeVisible();

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('a[href="https://example.com"]')).toHaveCount(0);
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('before');
});

test('WYSIWYG restores selected text when an image paste fails', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello world');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await failNextImageClipboardRead(page);
  await writeImageToClipboard(page);
  await editable.focus();
  await editable.locator('p').first().evaluate((paragraph) => {
    const text = paragraph.firstChild!;
    window.getSelection()?.setBaseAndExtent(text, 6, text, 11);
  });
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('[data-wysiwyg-pending-image]')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world');

  await page.keyboard.type('!');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world!');
  await page.keyboard.press('ControlOrMeta+z');
  await page.keyboard.type('?');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world?');
  await page.keyboard.press('ControlOrMeta+z');
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(() => editable.evaluate(() => window.getSelection()?.toString())).toBe('world');
});

test('WYSIWYG failed image paste preserves untouched source syntax', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('__hello__');
  await expect.poll(() => getMarkdownContent(page)).toBe('__hello__');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await failNextImageClipboardRead(page);
  await writeImageToClipboard(page);
  await editable.locator('strong').click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('[data-wysiwyg-pending-image]')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('__hello__');
});

test('WYSIWYG retains two image pastes that resolve out of order', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await delayImageClipboardReads(page, [1000, 100]);
  await writeImageToClipboard(page, 10, 10);
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('ControlOrMeta+v');
  await writeImageToClipboard(page, 20, 20);
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('.md-thumb')).toHaveCount(2);
  await expect.poll(() => editable.locator('.md-thumb img').evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).naturalWidth)
  )).toEqual([10, 20]);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/cojudge:\/\/image\//g)?.length ?? 0).toBe(2);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('.md-thumb')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('before');
});

test('WYSIWYG finalizes image storage removed by ordinary editing', async ({ page }) => {
  await openMarkdownPlayground(page);
  await pasteImageIntoEditor(page);
  const markdown = await getMarkdownContent(page);
  const imageId = /cojudge:\/\/image\/([^)]+)/.exec(markdown ?? '')?.[1];
  expect(imageId).toBeTruthy();
  await expect.poll(() => storedImageExists(page, imageId!)).toBe(true);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await editable.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('replacement');
  await expect.poll(() => getMarkdownContent(page)).toBe('replacement');
  await page.getByRole('button', { name: 'Source' }).click();
  await expect.poll(() => storedImageExists(page, imageId!)).toBe(false);
});

test('WYSIWYG cleans up an existing image replaced by another image paste', async ({ page }) => {
  await openMarkdownPlayground(page);
  await pasteImageIntoEditor(page, 10, 10);
  const originalMarkdown = await getMarkdownContent(page);
  const originalImageId = /cojudge:\/\/image\/([^)]+)/.exec(originalMarkdown ?? '')?.[1];
  expect(originalImageId).toBeTruthy();

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await writeImageToClipboard(page, 20, 20);
  await editable.focus();
  await editable.locator('.md-thumb').evaluate((thumbnail) => {
    const range = document.createRange();
    range.selectNode(thumbnail);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await page.keyboard.press('ControlOrMeta+v');
  await expect(editable.locator('.md-thumb')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).not.toContain(originalImageId!);

  await page.getByRole('button', { name: 'Source' }).click();
  await expect.poll(() => storedImageExists(page, originalImageId!)).toBe(false);
});

test('WYSIWYG toolbar wraps the selection in inline code', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello world');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Select all the text, then apply inline code from the toolbar
  await editable.locator('p').first().click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Inline code' }).click();

  await expect(editable.locator('code')).toHaveText('hello world');
  await expect.poll(() => getMarkdownContent(page)).toContain('`hello world`');

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('code')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('hello world');
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(editable.locator('code')).toHaveText('hello world');

  await page.getByRole('button', { name: 'Preview' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('code')).toHaveText('hello world');
});

test('WYSIWYG undo restores backward selection direction', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('abcdef');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.focus();
  await editable.locator('p').first().evaluate((paragraph) => {
    const text = paragraph.firstChild!;
    window.getSelection()?.setBaseAndExtent(text, 4, text, 2);
  });
  await expect.poll(() => editable.evaluate(() => window.getSelection()?.toString())).toBe('cd');
  await page.keyboard.type('X');
  await expect(editable.locator('p').first()).toHaveText('abXef');
  await page.keyboard.press('ControlOrMeta+z');

  const restored = await editable.evaluate(() => {
    const selection = window.getSelection();
    return {
      text: selection?.toString(),
      anchorOffset: selection?.anchorOffset,
      focusOffset: selection?.focusOffset
    };
  });
  expect(restored).toEqual({ text: 'cd', anchorOffset: 4, focusOffset: 2 });
});

test('WYSIWYG link undo restores the original text selection', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello world');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('p').first().evaluate((paragraph) => {
    const text = paragraph.firstChild!;
    window.getSelection()?.setBaseAndExtent(text, 6, text, 11);
  });
  await page.getByRole('button', { name: 'Insert link' }).click();
  await page.getByRole('textbox', { name: 'Link URL' }).fill('https://example.com');
  await page.keyboard.press('Enter');
  await expect(editable.locator('a')).toHaveText('world');

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('a')).toHaveCount(0);
  await expect.poll(() => editable.evaluate(() => window.getSelection()?.toString())).toBe('world');
  await page.keyboard.type('X');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello X');
});

test('WYSIWYG cancels an open link transaction after another edit', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Insert link' }).click();
  await expect(page.getByRole('textbox', { name: 'Link URL' })).toBeVisible();

  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.type('X');
  await expect(page.getByRole('textbox', { name: 'Link URL' })).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('helloX');
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello');
});

test('WYSIWYG cancels an open link transaction when history changes', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.type('X');
  await expect.poll(() => getMarkdownContent(page)).toBe('helloX');
  await page.getByRole('button', { name: 'Insert link' }).click();
  await expect(page.getByRole('textbox', { name: 'Link URL' })).toBeVisible();

  await editable.locator('p').first().click();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(page.getByRole('textbox', { name: 'Link URL' })).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('hello');
});

test('WYSIWYG auto-matches backticks into inline code and undo cancels it', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('hello');
  await expect.poll(() => getMarkdownContent(page)).toBe('hello');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
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
  await page.getByRole('button', { name: 'Preview' }).click();
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

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  const copyButton = editable.locator('.md-code-copy .copy-code-button');
  await editable.locator('.code-block-wrapper').first().hover();
  await expect(copyButton).toBeVisible();

  // Copying must not modify the stored markdown
  await copyButton.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('const a = 1;\n');

  await page.getByRole('button', { name: 'Preview' }).click();
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');
});

test('WYSIWYG copy-button feedback does not block code undo', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```js\nconst value = 1;\n```');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  const pre = editable.locator('pre');
  await pre.click();
  await page.keyboard.press('End');
  await page.keyboard.type(' changed');
  const copyButton = editable.locator('.copy-code-button');
  await editable.locator('.code-block-wrapper').hover();
  await copyButton.click();
  await expect(copyButton).toHaveAttribute('style', /color:/);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(pre).not.toContainText('changed');
  await expect.poll(() => getMarkdownContent(page)).not.toContain('changed');
});

test('WYSIWYG undo removes a paste made inside a code block', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```js\nconst value = 1;\n```');
  await expect.poll(() => getMarkdownContent(page)).toContain('const value = 1;');
  const original = await getMarkdownContent(page);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  const pre = editable.locator('pre').first();
  await pre.click();
  await page.keyboard.press('End');

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(async () => navigator.clipboard.writeText(' pasted();'));
  await page.keyboard.press('ControlOrMeta+v');
  await expect(pre).toContainText('pasted();');

  await page.keyboard.press('ControlOrMeta+z');
  await expect(pre).not.toContainText('pasted();');
  await expect.poll(() => getMarkdownContent(page)).toBe(original);

  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(pre).toContainText('pasted();');
  await expect.poll(() => getMarkdownContent(page)).toContain('pasted();');
});

test('WYSIWYG code blocks have a language autocomplete and syntax highlighting', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```python\nif True:\n    print("ok")\n```');
  await expect.poll(() => getMarkdownContent(page)).toContain('```python');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');

  const wrapper = editable.locator('.code-block-wrapper').first();
  await wrapper.hover();

  const langBtn = wrapper.locator('.code-lang-btn');
  await expect(langBtn).toContainText('Python');
  await expect(editable.locator('.hl-keyword')).toContainText('if');
  await expect(editable.locator('.hl-string').filter({ hasText: '"ok"' })).toBeVisible();

  await editable.locator('pre').evaluate((pre) => {
    const range = document.createRange();
    range.selectNodeContents(pre);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  await langBtn.click();
  const popover = page.locator('.lang-picker-popover');
  await expect(popover).toBeVisible();

  const searchInput = popover.locator('.lang-search-input');
  await searchInput.fill('javascript');
  await page.keyboard.press('Enter');

  await expect.poll(() => getMarkdownContent(page)).toContain('```javascript');
  await expect(langBtn).toContainText('JavaScript');
  await expect(editable.locator('.hl-keyword')).toContainText('if');
  await page.keyboard.type('X');
  await expect(editable.locator('pre')).toHaveText(/X\s*$/);
});

test('WYSIWYG turns an exact three-backtick line into a code block', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // An exact ``` line becomes a code block with a copy button
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await expect(editable.locator('pre')).toHaveCount(1);
  const codeBlockWrapper = editable.locator('.code-block-wrapper').first();
  await codeBlockWrapper.hover();
  await expect(editable.locator('.md-code-copy .copy-code-button')).toBeVisible();
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(2);

  // Typing continues inside the code block and round-trips as fenced code
  await page.keyboard.type('const y = 2;');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('const y = 2;');
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(2);

  // The copy button copies the bare <pre> content (no <code> child in WYSIWYG blocks)
  await codeBlockWrapper.hover();
  await editable.locator('.md-code-copy .copy-code-button').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('const y = 2;');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).not.toContain('\u200B');

  await page.getByRole('button', { name: 'Preview' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('code')).toHaveText('const y = 2;');
});

test('WYSIWYG deletes a code block from the trash button and ctrl+z restores it', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```js\nconst a = 1;\n```');
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  const wrapper = editable.locator('.code-block-wrapper').first();
  await wrapper.hover();
  await expect(editable.locator('.delete-code-button')).toBeVisible();

  // The trash button removes the block immediately (no confirmation dialog)
  await editable.locator('.delete-code-button').click();
  await expect(editable.locator('pre')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).not.toContain('```js');

  // ctrl+z (undo) restores the code block and its markdown
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('pre')).toHaveCount(1);
  await expect(editable.locator('pre')).toContainText('const a = 1');
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');

  // Recreate a code block so the preview can be checked too
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await page.keyboard.type('const b = 2;');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/^```\nconst b = 2;\n```$/m);

  // The trash button also works from the read-only preview (now 2 blocks)
  await page.getByRole('button', { name: 'Preview' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('code')).toHaveCount(2);
  await preview.locator('.code-block-wrapper').first().hover();
  await preview.locator('.delete-code-button').first().click();
  const dialog = page.locator('.dialog-card');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(preview.locator('code')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).not.toContain('const a = 1');
  await expect.poll(() => getMarkdownContent(page)).toContain('const b = 2');
});

test('WYSIWYG handles native history beforeinput events with custom undo and redo', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('```js\nconst a = 1;\n```');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('.code-block-wrapper').hover();
  await editable.locator('.delete-code-button').click();
  await expect(editable.locator('pre')).toHaveCount(0);

  const undoCanceled = await editable.evaluate((element) => !element.dispatchEvent(new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    inputType: 'historyUndo'
  })));
  expect(undoCanceled).toBe(true);
  await expect(editable.locator('pre')).toContainText('const a = 1');
  await expect.poll(() => getMarkdownContent(page)).toContain('```js');

  const redoCanceled = await editable.evaluate((element) => !element.dispatchEvent(new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    inputType: 'historyRedo'
  })));
  expect(redoCanceled).toBe(true);
  await expect(editable.locator('pre')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).not.toContain('```js');
});

test('WYSIWYG Enter stays inside a code block and only exits on an empty line', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Create a code block and type two lines, separated by Enter
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await page.keyboard.type('line1');
  await page.keyboard.press('Enter');
  await page.keyboard.type('line2');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('```\nline1\nline2\n```');
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(2);

  // Enter again on the empty trailing line exits the block, keeping it intact
  await page.keyboard.press('Enter'); // creates the empty line 3, still in the block
  await expect(editable.locator('pre')).toHaveCount(1);
  await expect(editable.locator('pre')).toContainText('line1\nline2\n');
  await page.keyboard.press('Enter'); // exits the code block, dropping the empty line
  await expect(editable.locator('pre')).toHaveCount(1);
  expect(await editable.locator('pre').textContent()).toBe('line1\nline2');
  await page.keyboard.type('after');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('after');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('```\nline1\nline2\n```');
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(2);

  // Enter on an empty line in the middle of the block stays inside it
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await page.keyboard.type('a');
  await page.keyboard.press('Enter');
  await page.keyboard.type('b');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter'); // splits into 'a\n\nb' with the caret on the empty middle line
  await page.keyboard.press('Enter'); // empty middle line: must stay inside the block
  await expect(editable.locator('pre')).toHaveCount(2);
  await expect(editable.locator('pre').last()).toContainText('a\n\n\nb');
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(4);

  // Enter on a freshly created empty code block deletes the block entirely
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await expect(editable.locator('pre')).toHaveCount(3);
  await page.keyboard.press('Enter');
  await expect(editable.locator('pre')).toHaveCount(2);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(4);
});

test('WYSIWYG undo restores an empty code block after exiting it', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await expect(editable.locator('pre')).toHaveCount(1);

  await page.keyboard.press('Enter');
  await expect(editable.locator('pre')).toHaveCount(0);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('pre')).toHaveCount(1);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(2);

  await editable.locator('> p:last-child').click();
  await page.keyboard.type('after');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('pre')).toHaveCount(0);
  await expect(editable).not.toContainText('after');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('pre')).toHaveCount(1);
});

test('WYSIWYG Ctrl+A inside a code block selects only the code', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await page.keyboard.type('old code');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.type('after');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('```\nold code\n```');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('after');

  await editable.locator('pre').click();
  await page.keyboard.press('ControlOrMeta+a');
  const selected = await page.evaluate(() => (window.getSelection()?.toString() ?? '').replace(/\u200B/g, ''));
  expect(selected).toBe('old code');

  await page.keyboard.type('new code');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('before');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('```\nnew code\n```');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').toContain('after');
  await expect.poll(async () => (await getMarkdownContent(page)) ?? '').not.toContain('old code');
});

test('WYSIWYG removes the copy button when the code block is deleted', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('before');
  await expect.poll(() => getMarkdownContent(page)).toBe('before');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Create a code block, type, then delete all its content
  await editable.locator('> p:last-child').click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('```');
  await page.keyboard.type('abc');
  await expect(editable.locator('.md-code-copy')).toHaveCount(1);
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await expect(editable.locator('pre')).toHaveCount(1);

  // Clicking away removes the empty code block, copy button and all
  await editable.locator('> p').first().click();
  await expect(editable.locator('.md-code-copy')).toHaveCount(0);
  await expect(editable.locator('pre')).toHaveCount(0);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/^```$/gm)?.length ?? 0).toBe(0);
});

test('WYSIWYG code block button wraps the selection in a fenced code block and toggles off', async ({ page }) => {
  await openMarkdownPlayground(page);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('const x = 1;');
  await expect.poll(() => getMarkdownContent(page)).toBe('const x = 1;');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  // Wrap the paragraph in a code block via the toolbar button
  await editable.locator('p').first().click();
  await page.getByRole('button', { name: 'Code block', exact: true }).click();
  await expect(editable.locator('pre')).toHaveText('const x = 1;');
  await expect(editable.locator('.md-code-copy .copy-code-button')).toBeVisible();
  await expect.poll(() => getMarkdownContent(page)).toBe('```\nconst x = 1;\n```');

  // The copy button copies the bare <pre> content
  await editable.locator('.md-code-copy').hover();
  await editable.locator('.md-code-copy .copy-code-button').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('const x = 1;');

  // The preview renders it as a real code block
  await page.getByRole('button', { name: 'Preview' }).click();
  const preview = page.locator('.markdown-preview:not(.wysiwyg-editing)');
  await expect(preview.locator('code')).toHaveText('const x = 1;');

  // Re-entering WYSIWYG and clicking the button again unwraps it back to a paragraph
  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  await expect(editable).toBeVisible();
  await editable.locator('pre').click();
  await page.getByRole('button', { name: 'Code block', exact: true }).click();
  await expect(editable.locator('pre')).toHaveCount(0);
  await expect.poll(() => getMarkdownContent(page)).toBe('const x = 1;');
});

test('WYSIWYG @ mention inserts a playground file link and click switches tab', async ({ page }) => {
  const noteId = 'note-file-id-001';
  const targetId = 'target-file-id-002';
  await page.goto('/playground');
  await page.evaluate(({ noteId, targetId }) => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'wysiwyg');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        {
          fileId: noteId,
          fileName: 'Notes',
          language: 'markdown',
          content: 'hello',
          isOpen: true,
          order: 0,
          lastUpdated: Date.now(),
        },
        {
          fileId: targetId,
          fileName: 'TargetDoc',
          language: 'markdown',
          content: '# target',
          isOpen: true,
          order: 1,
          lastUpdated: Date.now() - 1000,
        },
      ]),
    }));
  }, { noteId, targetId });
  await page.reload();

  // Notes is most recently updated, so it should be active; open WYSIWYG
  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible({ timeout: 15000 });

  await editable.locator('> p:last-child').click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('@Target');

  const mentionPopup = page.locator('.mention-popup');
  await expect(mentionPopup).toBeVisible();
  await expect(mentionPopup.locator('.mention-result-item')).toContainText('TargetDoc');
  await page.keyboard.press('Enter');
  await expect(mentionPopup).toBeHidden();

  const link = editable.locator(`a.md-file-mention[href="/playground?fileId=${targetId}"]`);
  await expect(link).toBeVisible();
  await expect(link.locator('.md-file-mention-label')).toHaveText('TargetDoc');
  await expect(link.locator('.md-file-mention-icon')).toBeVisible();
  // Markdown files use the MD language icon
  await expect(link.locator('.md-file-mention-icon text')).toHaveText('MD');
  await expect(link).not.toHaveAttribute('target', '_blank');
  await expect.poll(async () => {
    return page.evaluate((id) => {
      const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
      const files = JSON.parse(allFiles['playground'] || '[]') as { fileId: string; content: string }[];
      return files.find((f) => f.fileId === id)?.content ?? '';
    }, noteId);
  }).toContain(`[TargetDoc](/playground?fileId=${targetId})`);

  // Clicking the in-app link switches tab without leaving playground
  await link.click();
  await expect(page).toHaveURL(/\/playground/);
  await expect(page.locator('.tab.active')).toContainText('TargetDoc');
});

test('WYSIWYG checklists toggle, continue on Enter, and break out when empty', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first item');
  await expect.poll(() => getMarkdownContent(page)).toContain('- [ ] first item');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  const checkbox = editable.locator('li input[type="checkbox"]').first();
  await expect(checkbox).toBeEnabled();
  await expect(checkbox).not.toBeChecked();
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[x\]\s+first item/i);

  // Enter on a filled checklist item creates another checkbox item
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await page.keyboard.type('second');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[\s\]\s+second/);

  // Enter on an empty checklist item breaks out of the list
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(3);
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await page.keyboard.type('after list');
  await expect.poll(() => getMarkdownContent(page)).toContain('after list');
  await expect.poll(async () => {
    const md = await getMarkdownContent(page);
    return md?.includes('after list') && !md.match(/\[\s\]\s+after list/);
  }).toBeTruthy();
});

test('WYSIWYG undo removes a newly created checklist item', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first item');
  await expect.poll(() => getMarkdownContent(page)).toContain('- [ ] first item');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).toBe('- [ ] first item');

  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect.poll(async () => (await getMarkdownContent(page))?.match(/\[\s\]/g)?.length ?? 0).toBe(2);
});

test('WYSIWYG undo restores a checklist checkbox state', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first item');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const checkbox = page.locator('.wysiwyg-editing li input[type="checkbox"]');
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('ControlOrMeta+z');
  await expect(checkbox).not.toBeChecked();
  await expect(checkbox).toBeFocused();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[\s\]\s+first item/);
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toBeFocused();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[x\]\s+first item/i);
  await page.keyboard.press('ControlOrMeta+z');
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[x\]\s+first item/i);
});

test('WYSIWYG keeps earlier typing available after undoing checklist creation', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first item');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.type(' updated');
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(1);
  await expect(editable.locator('li').first()).toContainText('updated');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li').first()).not.toContainText('updated');
  await expect.poll(() => getMarkdownContent(page)).toBe('- [ ] first item');

  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(editable.locator('li').first()).toContainText('updated');
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
});

test('WYSIWYG undoes checklist text before the item that contains it', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first item');
  await page.getByRole('button', { name: 'WYSIWYG' }).click();

  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('second item');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect(editable.locator('li').last()).not.toContainText('second item');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).toBe('- [ ] first item');
});

test('WYSIWYG supports multiple checklist undo steps', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] first\n- [ ] second');
  await expect.poll(() => getMarkdownContent(page)).toContain('- [ ] second');
  const original = await getMarkdownContent(page);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(3);

  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(4);

  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(3);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect.poll(() => getMarkdownContent(page)).toBe(original);
});

test('WYSIWYG checklist item merges keep checkboxes intact', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] one\n- [ ] two');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[\s\]\s+two/);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);

  // Delete at the end of the first item merges it with the second; the merged
  // item must keep exactly one checkbox (no "one[ ] two" corruption).
  await editable.locator('li').first().click();
  await page.keyboard.press('End');
  await page.keyboard.press('Delete');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(1);
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[\s\]\s+one\s+two/);

  // Backspace at the very start of a checklist item merges into the item above
  await editable.locator('> p:last-child').click();
  await page.getByRole('button', { name: 'Checklist' }).click();
  await page.keyboard.type('three');
  await page.keyboard.press('Enter');
  await page.keyboard.type('four');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(3);
  await editable.locator('li').nth(2).click();
  await page.keyboard.press('Home');
  await page.keyboard.press('Backspace');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect.poll(() => getMarkdownContent(page)).toMatch(/three\s+four/);
});

test('WYSIWYG Tab indents list items and Shift+Tab outdents them', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- one\n- two\n- three');
  await expect.poll(() => getMarkdownContent(page)).toContain('three');

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();

  const indentOf = async (text: string) => {
    const md = await getMarkdownContent(page);
    const line = md?.split('\n').find((l) => l.includes(text));
    return line ? (line.match(/^\s*/)?.[0].length ?? 0) : -1;
  };

  // Tab on the second item nests it under the first
  await editable.locator('li').nth(1).click();
  await page.keyboard.press('Tab');
  await expect.poll(() => indentOf('two')).toBeGreaterThan(0);
  await expect.poll(() => indentOf('three')).toBe(0);

  // Tab on the third item joins the first item's nested list (same level as two)
  await editable.locator('li').nth(2).click();
  await page.keyboard.press('Tab');
  const twoIndent = await indentOf('two');
  await expect.poll(() => indentOf('three')).toBe(twoIndent);

  // Tab again nests it under the second item
  await page.keyboard.press('Tab');
  await expect.poll(() => indentOf('three')).toBeGreaterThan(twoIndent);

  // Shift+Tab moves it back one level
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => indentOf('three')).toBe(twoIndent);

  // Shift+Tab again moves it back to the top level
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => indentOf('three')).toBe(0);
});

test('WYSIWYG Tab/Shift+Tab on checklists keeps checkboxes intact', async ({ page }) => {
  await openMarkdownPlayground(page);

  await page.locator('.monaco-editor .view-lines').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('- [ ] one\n- [x] two');
  await expect.poll(() => getMarkdownContent(page)).toMatch(/\[\s\]\s+one/);

  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);

  // Tab nests the second checklist item under the first; checkbox states survive
  await editable.locator('li').nth(1).click();
  await page.keyboard.press('Tab');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect(editable.locator('li').nth(1).locator('input[type="checkbox"]')).toBeChecked();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/- +\[ \] +one\s*\n\s+- +\[x\] +two/);

  // Shift+Tab returns it to the top level
  await page.keyboard.press('Shift+Tab');
  await expect(editable.locator('li input[type="checkbox"]')).toHaveCount(2);
  await expect(editable.locator('li').nth(1).locator('input[type="checkbox"]')).toBeChecked();
  await expect.poll(() => getMarkdownContent(page)).toMatch(/- +\[ \] +one\s*\n- +\[x\] +two/);
});
