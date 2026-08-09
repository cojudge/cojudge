import { expect, test, type Page } from '@playwright/test';

async function openWysiwyg(page: Page, content: string) {
  await page.goto('/playground');
  await page.evaluate((seed) => {
    localStorage.setItem('user-settings', JSON.stringify({ playgroundPreferredLanguage: 'markdown' }));
    localStorage.setItem('playground-markdown-mode', 'source');
    localStorage.setItem('files', JSON.stringify({
      playground: JSON.stringify([
        { fileId: 'n1', fileName: 'Notes', language: 'markdown', content: seed, isOpen: true, order: 0, lastUpdated: Date.now() }
      ])
    }));
  }, content);
  await page.reload();
  const dismiss = page.getByRole('button', { name: 'Dismiss' });
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
  await expect(page.locator('.monaco-editor')).toBeVisible();
  await page.getByRole('button', { name: 'WYSIWYG' }).click();
  const editable = page.locator('.wysiwyg-editing');
  await expect(editable).toBeVisible();
  await editable.locator('p').first().click();
  await page.keyboard.press('End');
  return editable;
}

function getMarkdownContent(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
    const files = JSON.parse(allFiles['playground'] || '[]');
    const entry = files.find((file: { language: string }) => file.language === 'markdown');
    return entry ? entry.content : null;
  });
}

// Chrome's contenteditable stores significant typed spaces as non-breaking
// spaces, so the markdown round-trip keeps them as \u00A0. Normalize them for
// assertions; the code-wrap behavior under test is unaffected.
async function getMarkdownText(page: Page): Promise<string | null> {
  const markdown = await getMarkdownContent(page);
  return markdown ? markdown.replace(/\u00A0/g, ' ') : null;
}

const markerSpan = (editable: ReturnType<Page['locator']>) =>
  editable.locator('span[style*="var(--color-second-bg)"]');

test('WYSIWYG auto-close: text typed after the closing backtick stays outside the code', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' `code`extra');

  await expect(markerSpan(editable)).toHaveText('code');
  await expect(editable.locator('p').first()).toContainText('codeextra');
  await expect.poll(() => getMarkdownText(page)).toContain('`code`extra');

  // Keep typing: more characters must stay outside the already-closed code
  await page.keyboard.type('!');
  await expect.poll(() => getMarkdownText(page)).toContain('`code`extra!');
});

test('WYSIWYG auto-close: a space and words after the closing backtick stay outside the code', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' `code` more words');

  await expect(markerSpan(editable)).toHaveText('code');
  await expect(editable.locator('p').first()).toContainText('code more words');
  await expect.poll(() => getMarkdownText(page)).toContain('`code` more words');
});

test('WYSIWYG auto-close: two code pairs on the same line both wrap without nesting', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' `a` and `b`');

  const spans = markerSpan(editable);
  await expect(spans).toHaveCount(2);
  await expect(spans.nth(0)).toHaveText('a');
  await expect(spans.nth(1)).toHaveText('b');
  await expect(editable.locator('p').first()).toContainText('a and b');
  await expect.poll(() => getMarkdownText(page)).toContain('`a` and `b`');
});

test('WYSIWYG auto-close: wrapping before an existing marker span keeps both spans marked', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  // First pair at the end of the line
  await page.keyboard.type(' `a`');
  await expect(markerSpan(editable)).toHaveText('a');

  // Jump to the start of the line and type a second pair there: the new span
  // is inserted BEFORE the existing one, so the marker update must target the
  // newly inserted span, not the last span in document order.
  await page.keyboard.press('Home');
  await page.keyboard.type('x `b`');

  const spans = markerSpan(editable);
  await expect(spans).toHaveCount(2);
  await expect(spans.nth(0)).toHaveText('b');
  await expect(spans.nth(1)).toHaveText('a');
  await expect.poll(() => getMarkdownText(page)).toContain('x `b`hello `a`');
});

test('WYSIWYG auto-close: wrapping a second pair right after a previous auto-close works', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' `a`');
  await expect(markerSpan(editable)).toHaveText('a');

  // Caret must sit AFTER the first span (not inside it), so the next pair
  // typed immediately afterwards forms its own code instead of nesting.
  await page.keyboard.type('`b`');

  const spans = markerSpan(editable);
  await expect(spans).toHaveCount(2);
  await expect(spans.nth(0)).toHaveText('a');
  await expect(spans.nth(1)).toHaveText('b');
  await expect.poll(() => getMarkdownText(page)).toContain('`a``b`');
});

test('WYSIWYG auto-close: auto-close works after toolbar-wrapped inline code', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello world');

  await page.keyboard.press('ControlOrMeta+a');
  await page.getByRole('button', { name: 'Inline code' }).click();
  await expect(editable.locator('code')).toHaveText('hello world');

  // Move the caret past the wrapped code, then type a new pair after it
  await editable.locator('code').click();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type(' `x`');

  await expect(markerSpan(editable)).toHaveText('x');
  await expect.poll(() => getMarkdownText(page)).toContain('`hello world`');
  await expect.poll(() => getMarkdownText(page)).toContain('`x`');
});

test('WYSIWYG auto-close: undo still cancels the wrap after typing continued', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' `code` x');
  await expect(markerSpan(editable)).toHaveText('code');
  await expect.poll(() => getMarkdownText(page)).toContain('`code` x');

  // The wrap and the characters typed after it are separate undo steps, so
  // two undos restore the literal backticks (and drop the text after the pair)
  await page.keyboard.press('ControlOrMeta+z');
  await page.keyboard.press('ControlOrMeta+z');
  await expect(markerSpan(editable)).toHaveCount(0);
  await expect(editable.locator('p').first()).toContainText('`code`');
});

test('WYSIWYG auto-close: whitespace around the code text stays literal (no wrap)', async ({ page }) => {
  const editable = await openWysiwyg(page, 'hello');

  await page.keyboard.type(' ` code`');

  await expect(markerSpan(editable)).toHaveCount(0);
  await expect(editable.locator('p').first()).toContainText('` code`');
  // The literal backticks are stored escaped so they render as plain text
  await expect.poll(() => getMarkdownText(page)).toContain('\\` code\\`');
});
