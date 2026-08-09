import { expect, test, type Page } from '@playwright/test';

function tabsFor(key: string) {
  const now = Date.now();
  return [
    {
      fileId: `${key}-a`,
      fileName: 'Left',
      language: 'java',
      lastLanguage: 'java',
      content: '// left',
      viewState: null,
      isActive: false,
      order: 0,
      isOpen: true,
      lastUpdated: now
    },
    {
      fileId: `${key}-b`,
      fileName: 'Middle',
      language: 'java',
      lastLanguage: 'java',
      content: '// middle',
      viewState: null,
      isActive: false,
      order: 1,
      isOpen: true,
      lastUpdated: now + 1
    },
    {
      fileId: `${key}-c`,
      fileName: 'Right',
      language: 'java',
      lastLanguage: 'java',
      content: '// right',
      viewState: null,
      isActive: false,
      order: 2,
      isOpen: true,
      lastUpdated: now + 2
    },
    {
      fileId: `${key}-d`,
      fileName: 'Far Right',
      language: 'java',
      lastLanguage: 'java',
      content: '// far right',
      viewState: null,
      isActive: false,
      order: 3,
      isOpen: true,
      lastUpdated: now + 3
    }
  ];
}

async function seedFiles(page: Page, key: string) {
  await page.addInitScript(({ key, files }) => {
    localStorage.setItem('files', JSON.stringify({ [key]: JSON.stringify(files) }));
  }, { key, files: tabsFor(key) });
  await page.reload();
}

function tab(page: Page, name: string) {
  return page.locator('.editor-header .tab').filter({ hasText: name });
}

test('playground tab context menu closes tabs on either side or all other tabs', async ({ page }) => {
  await page.goto('/playground');
  await seedFiles(page, 'playground');

  const menu = page.getByRole('menu', { name: 'Tab actions' });
  const menuItems = menu.getByRole('menuitem');
  await tab(page, 'Middle').click({ button: 'right' });
  await expect(menuItems).toHaveText(['Close', 'Close Left', 'Close Right', 'Close Others', 'Rename']);

  await menu.getByRole('menuitem', { name: 'Close Left' }).click();
  await expect(page.locator('.editor-header .tab')).toHaveCount(3);
  await expect(tab(page, 'Left')).toHaveCount(0);

  await tab(page, 'Middle').click({ button: 'right' });
  await menu.getByRole('menuitem', { name: 'Close Right' }).click();
  await expect(page.locator('.editor-header .tab')).toHaveCount(1);
  await expect(tab(page, 'Middle')).toHaveCount(1);

  await seedFiles(page, 'playground');
  await tab(page, 'Middle').click({ button: 'right' });
  await menu.getByRole('menuitem', { name: 'Close Others' }).click();
  await expect(page.locator('.editor-header .tab')).toHaveCount(1);
  await expect(tab(page, 'Middle')).toHaveCount(1);

  await seedFiles(page, 'playground');
  await tab(page, 'Middle').click({ button: 'right' });
  await menu.getByRole('menuitem', { name: 'Rename' }).click();
  await expect(page.locator('.tab-rename-input')).toBeVisible();
  await page.locator('.tab-rename-input').press('Escape');

  await tab(page, 'Middle').click({ button: 'right' });
  await menu.getByRole('menuitem', { name: 'Close', exact: true }).click();
  await expect(page.locator('.editor-header .tab')).toHaveCount(3);
  await expect(tab(page, 'Middle')).toHaveCount(0);
});

test('problem tabs expose context actions and close other files together', async ({ page }) => {
  await page.goto('/problems/two-sum');
  await seedFiles(page, 'two-sum');

  await expect(page.locator('.editor-header .tab')).toHaveCount(4);
  const menu = page.getByRole('menu', { name: 'Tab actions' });
  await tab(page, 'Middle').click({ button: 'right' });
  await expect(menu.getByRole('menuitem')).toHaveText(['Close', 'Close Left', 'Close Right', 'Close Others', 'Rename']);

  await menu.getByRole('menuitem', { name: 'Rename' }).click();
  await expect(page.locator('.tab-rename-input')).toBeVisible();
  await page.locator('.tab-rename-input').press('Escape');

  await tab(page, 'Middle').click({ button: 'right' });

  await menu.getByRole('menuitem', { name: 'Close Others' }).click();
  const dialog = page.getByRole('dialog', { name: 'Remove files?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Remove files' }).click();
  await expect(page.locator('.editor-header .tab')).toHaveCount(1);
  await expect(tab(page, 'Middle')).toHaveCount(1);
});
