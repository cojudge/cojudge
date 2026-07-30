import { expect, test } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toBeTruthy();
});

test('progress import uses an in-app confirmation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('desktop-import-probe', 'old'));

  const backup = {
    name: 'cojudge-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      'desktop-import-probe': 'new',
      'user-checkboxes': { 'two-sum': true }
    }))
  };
  const input = page.locator('input[type="file"]');

  await input.setInputFiles(backup);
  await expect(page.getByRole('dialog', { name: 'Import local data?' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('desktop-import-probe'))).toBe('old');

  await input.setInputFiles(backup);
  await page.evaluate(() => {
    const setItem = Storage.prototype.setItem;
    let shouldFail = true;
    Storage.prototype.setItem = function (key, value) {
      if (shouldFail && key === 'desktop-import-probe') {
        shouldFail = false;
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
      }
      return setItem.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Import data' }).click();
  await expect(page.getByRole('alert')).toContainText('Failed to import: Storage quota exceeded');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('desktop-import-probe'))).toBe('old');

  await input.setInputFiles(backup);
  await page.getByRole('button', { name: 'Import data' }).click();
  await expect(page.getByRole('status')).toHaveText('Import complete.');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('desktop-import-probe'))).toBe('new');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('user-checkboxes'))).toContain('two-sum');
});

test('desktop Firebase settings enable loading a shared code', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await expect(page.getByRole('menuitem', { name: /Firebase settings/ })).toHaveCount(0);

  await page.goto('http://cojudge.localhost:4173/');
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.getByRole('menuitem', { name: /Firebase settings/ }).click();

  const dialog = page.getByRole('dialog', { name: 'Firebase settings' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/API key/).fill('desktop-api-key');
  await dialog.getByLabel(/Auth domain/).fill('desktop.firebaseapp.com');
  await dialog.getByLabel(/Project ID/).fill('desktop-project');
  await dialog.getByLabel(/Messaging sender ID/).fill('123456789');
  await dialog.getByLabel(/App ID/).fill('1:123456789:web:desktop');
  await dialog.getByRole('button', { name: 'Save settings' }).click();

  await expect.poll(() => page.evaluate(() => {
    const raw = localStorage.getItem('cojudge-firebase-settings');
    return raw ? JSON.parse(raw).projectId : null;
  })).toBe('desktop-project');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.getByRole('menuitem', { name: 'Load', exact: true }).click();
  const loadDialog = page.getByRole('dialog', { name: 'Enter code' });
  await expect(loadDialog).toBeVisible();
  const loadDialogBox = await loadDialog.boundingBox();
  expect(loadDialogBox).not.toBeNull();
  expect(loadDialogBox!.width).toBeLessThanOrEqual(390);

  await page.getByLabel('Code character 1').fill('a');
  await page.getByLabel('Code character 2').fill('B');
  await page.getByLabel('Code character 3').fill('3');
  await page.getByLabel('Code character 4').fill('z');
  await expect(page).toHaveURL('http://cojudge.localhost:4173/p/aB3z');
});

test('Tauri development mode exposes Firebase settings', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __TAURI_INTERNALS__?: object }).__TAURI_INTERNALS__ = {};
  });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Toggle menu' });
  await menuButton.focus();
  await menuButton.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: /Firebase settings/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('file removal uses the in-app confirmation dialog', async ({ page }) => {
  await page.addInitScript(() => {
    window.confirm = () => { throw new Error('Native confirm must not be called'); };
    window.alert = () => { throw new Error('Native alert must not be called'); };
  });
  await page.goto('/problems/two-sum');

  await page.getByRole('button', { name: 'New tab' }).click();
  await expect(page.getByRole('tab')).toHaveCount(2);
  await page.getByRole('button', { name: 'Close tab' }).last().click();

  const dialog = page.getByRole('dialog', { name: 'Remove file?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('tab')).toHaveCount(2);

  await page.getByRole('button', { name: 'Close tab' }).last().click();
  await page.getByRole('dialog', { name: 'Remove file?' })
    .getByRole('button', { name: 'Remove file' }).click();
  await expect(page.getByRole('tab')).toHaveCount(1);
});

test('game mode errors use the in-app alert dialog', async ({ page }) => {
  await page.addInitScript(() => {
    window.alert = () => { throw new Error('Native alert must not be called'); };
  });
  await page.goto('/');
  const groupHeaders = page.locator('.group-header');
  for (let index = 0; index < await groupHeaders.count(); index++) {
    await groupHeaders.nth(index).click();
  }
  const problemIds = await page.locator('a[href^="/problems/"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')!.split('/').pop()!)
  );
  await page.evaluate((ids) => {
    localStorage.setItem('user-checkboxes', JSON.stringify(Object.fromEntries(ids.map((id) => [id, true]))));
  }, problemIds);
  await page.reload();

  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.getByRole('menuitem', { name: /Game/ }).click();
  await page.getByRole('dialog', { name: 'Game Mode' }).getByRole('button', { name: 'Start' }).click();

  const alert = page.getByRole('alertdialog', { name: 'No problems available' });
  await expect(alert).toBeVisible();
  await alert.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('dialog', { name: 'Game Mode' })).toBeVisible();
});

test('fork handoff preserves the exact source and is consumed once', async ({ page }) => {
  const fileName = 'Remote solution';
  const destinations = [
    {
      path: '/playground',
      storageKey: 'playground',
      language: 'typescript',
      source: 'const forkRegression = "server source";\nconsole.log(forkRegression);'
    },
    {
      path: '/problems/two-sum',
      storageKey: 'two-sum',
      language: 'java',
      source: 'class ForkRegression { String source = "server source"; }'
    }
  ];

  for (const destination of destinations) {
    await page.goto('/');
    await page.evaluate(({ content, name, language }) => {
      localStorage.removeItem('files');
      localStorage.removeItem('solutions');
      sessionStorage.setItem('cojudge-fork-transfer', JSON.stringify({
        content,
        language,
        viewState: '',
        fileName: name
      }));
    }, { content: destination.source, name: fileName, language: destination.language });
    await page.goto(destination.path);

    const forkTab = page.getByRole('tab', { name: /Fork of Remote solution/ });
    await expect(forkTab).toHaveCount(1);
    await expect(forkTab).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => page.evaluate(({ key, expectedName, language }) => {
      const allFiles = JSON.parse(localStorage.getItem('files') || '{}');
      const files = JSON.parse(allFiles[key] || '[]');
      return files
        .filter((file: { fileName: string; language: string }) =>
          file.fileName === expectedName && file.language === language
        )
        .map((file: { content: string }) => file.content);
    }, {
      key: destination.storageKey,
      expectedName: `Fork of ${fileName}`,
      language: destination.language
    })).toEqual([destination.source]);
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('cojudge-fork-transfer'))).toBeNull();

    await page.reload();
    await expect(page.getByRole('tab', { name: /Fork of Remote solution/ })).toHaveCount(1);
  }
});

test('whiteboard can create and undo a shape', async ({ page }) => {
  await page.goto('/whiteboard');
  await page.evaluate(() => localStorage.removeItem('cojudge-whiteboard-v1'));
  await page.reload();

  await expect(page.getByRole('application', { name: 'Whiteboard drawing canvas' })).toBeVisible();
  await page.getByRole('button', { name: 'Rectangle (2 or R)' }).click();
  await page.mouse.move(400, 220);
  await page.mouse.down();
  await page.mouse.move(620, 380);
  await page.mouse.up();

  await expect(page.locator('.elements-layer rect')).toHaveCount(1);
  await page.keyboard.press('ControlOrMeta+z');
  await expect(page.locator('.elements-layer rect')).toHaveCount(0);
  await page.getByRole('button', { name: 'Redo' }).click();
  await expect(page.locator('.elements-layer rect')).toHaveCount(1);

  await page.reload();
  await expect(page.locator('.elements-layer rect')).toHaveCount(1);
});

test('whiteboard commits text when clicking elsewhere', async ({ page }) => {
  await page.goto('/whiteboard');
  await page.evaluate(() => localStorage.removeItem('cojudge-whiteboard-v1'));
  await page.reload();

  await page.getByRole('button', { name: 'Text (8 or T)' }).click();
  await page.mouse.click(600, 220);
  await page.locator('.text-editor').fill('Architecture notes');
  await page.mouse.click(850, 420);

  await expect(page.locator('.elements-layer text')).toHaveText('Architecture notes');
  await expect(page.locator('.text-editor')).toHaveCount(0);
});

test('whiteboard supports modifier-click and marquee multi-selection', async ({ page }) => {
  await page.goto('/whiteboard');
  await page.evaluate(() => localStorage.removeItem('cojudge-whiteboard-v1'));
  await page.reload();

  await page.getByRole('button', { name: 'Rectangle (2 or R)' }).click();
  await page.mouse.move(400, 220);
  await page.mouse.down();
  await page.mouse.move(520, 320);
  await page.mouse.up();
  await page.getByRole('button', { name: 'Ellipse (4 or O)' }).click();
  await page.mouse.move(700, 220);
  await page.mouse.down();
  await page.mouse.move(820, 320);
  await page.mouse.up();

  await page.mouse.click(460, 270);
  await page.keyboard.down('Meta');
  await page.mouse.click(760, 270);
  await page.keyboard.up('Meta');
  await expect(page.locator('.individual-selection')).toHaveCount(2);

  await page.mouse.move(350, 170);
  await page.mouse.down();
  await page.mouse.move(870, 370);
  await page.mouse.up();
  await expect(page.locator('.individual-selection')).toHaveCount(2);
});

test('whiteboard pastes clipboard images', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/whiteboard');
  await page.evaluate(() => localStorage.removeItem('cojudge-whiteboard-v1'));
  await page.reload();

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
  await page.getByRole('application', { name: 'Whiteboard drawing canvas' }).focus();
  await page.keyboard.press('ControlOrMeta+v');

  await expect(page.locator('.elements-layer image')).toHaveCount(1);
  await expect(page.getByText('Image pasted from clipboard')).toBeVisible();
});

test('whiteboard pans with trackpad deltas and middle-button drag', async ({ page }) => {
  await page.goto('/whiteboard');
  await page.evaluate(() => localStorage.removeItem('cojudge-whiteboard-v1'));
  await page.reload();

  const canvas = page.getByRole('application', { name: 'Whiteboard drawing canvas' });
  const world = page.locator('.drawing-canvas > g');
  await canvas.hover({ position: { x: 700, y: 400 } });
  await page.mouse.wheel(80, 60);
  await expect(world).toHaveAttribute('transform', 'translate(-80 -60) scale(1)');

  await page.mouse.move(700, 400);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(800, 450, { steps: 4 });
  await page.mouse.up({ button: 'middle' });
  await expect(world).toHaveAttribute('transform', 'translate(20 -10) scale(1)');
});

test('whiteboard shares the app theme preference', async ({ page }) => {
  await page.goto('/whiteboard');
  await page.getByLabel('Open main menu').click();
  await page.getByRole('button', { name: 'Dark mode' }).click();

  await expect(page.locator('.whiteboard-page')).toHaveClass(/dark/);
  await expect.poll(async () => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('user-settings') || '{}').theme)).toBe('dark');

  await page.goto('/');
  await page.getByLabel('Toggle menu').click();
  await page.getByTitle('Toggle theme').click();
  await page.getByLabel('Toggle menu').click();
  await page.getByRole('menuitem', { name: 'Whiteboard' }).click();

  await expect(page).toHaveURL(/\/whiteboard$/);
  await expect(page.locator('.whiteboard-page')).not.toHaveClass(/dark/);
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('user-settings') || '{}').theme)).toBe('light');
});
