import { expect, test } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toBeTruthy();
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
