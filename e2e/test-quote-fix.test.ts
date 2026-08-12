import { expect, test } from '@playwright/test';

const seedFile = (fileName: string, fileId: string) => ({
  fileId,
  fileName,
  language: 'java',
  lastLanguage: 'java',
  content: `// ${fileName}`,
  viewState: null,
  output: '',
  logs: '',
  isActive: false,
  order: 0,
  isOpen: true,
  lastUpdated: Date.now(),
  parentId: null
});

async function injectAndLoad(page: import('@playwright/test').Page, files: any[]) {
  await page.addInitScript((files) => {
    localStorage.clear();
    localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify(files) }));
  }, files);
  await page.goto('/playground');
}

test('renaming to a name with quotes is blocked with a warning', async ({ page }) => {
  await injectAndLoad(page, [seedFile('FileA', 'file-a')]);
  await expect(page.locator('[data-explorer-id="file-a"]')).toBeVisible();

  // Rename via the tab rename button to an invalid name
  await page.locator('.tab-rename[aria-label="Rename tab"]').first().click();
  const input = page.locator('.tab-rename-input');
  await expect(input).toBeVisible();
  await input.fill('"test"');
  await input.press('Enter');
  // Warning shown, rename not applied: input stays open with the old name intact
  await expect(page.locator('.rename-warning')).toHaveText('Invalid characters: " < > : / \\ | ? *');
  await expect(input).toBeVisible();
  await input.fill('bad/name');
  await expect(page.locator('.rename-warning')).toBeVisible();

  // A valid name applies normally
  await input.fill('goodName');
  await input.press('Enter');
  await expect(page.locator('.tab-title').first()).toHaveText('goodName');
  const store = await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('files') || '{}');
    const files = JSON.parse(raw.playground || '[]');
    return files.map((f: any) => f.fileName);
  });
  expect(store).toContain('goodName');
  expect(store).not.toContain('"test"');
});

test('existing file with quote is migrated on load', async ({ page }) => {
  await injectAndLoad(page, [seedFile('"bad"', 'file-bad'), seedFile('Good', 'file-good')]);
  await page.waitForTimeout(500);
  const names = await page.locator('.file-name').allInnerTexts();
  console.log('migrated names', names);
  expect(names).toContain('_bad_');
  expect(names).not.toContain('"bad"');
  const badFile = page.locator('[data-explorer-id="file-bad"]');
  await expect(badFile).toBeVisible();
  await badFile.click();
  await expect(page.locator('.tab.active .tab-title')).toHaveText('_bad_');
});

test('curly quotes are blocked with a warning like straight quotes', async ({ page }) => {
  // Autocorrect often converts typed quotes to curly U+201C/U+201D
  await page.goto('/playground');
  await expect(page.locator('.tab-title').first()).toBeVisible();
  await page.locator('.tab-rename[aria-label="Rename tab"]').first().click();
  const input = page.locator('.tab-rename-input');
  await expect(input).toBeVisible();
  await input.fill('\u201Ctest\u201D');
  await input.press('Enter');
  await expect(page.locator('.rename-warning')).toBeVisible();
  await expect(input).toBeVisible();
  // Escape cancels the rename entirely
  await input.press('Escape');
  await expect(page.locator('.rename-warning')).toHaveCount(0);
  await expect(page.locator('.tab-title').first()).toHaveText('New File');
});

test('file with bracket in name stays valid and openable', async ({ page }) => {
  // [ and ] are valid filesystem chars and must not be blocked
  await injectAndLoad(page, [seedFile('a]b', 'file-bracket')]);
  await page.waitForTimeout(500);
  const names = await page.locator('.file-name').allInnerTexts();
  expect(names).toContain('a]b');
  const file = page.locator('[data-explorer-id="file-bracket"]');
  await expect(file).toBeVisible();
  await file.click();
  await expect(page.locator('.tab.active .tab-title')).toHaveText('a]b');
});
