import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('files', JSON.stringify({ playground: JSON.stringify([{
            fileId: 'debug-test', fileName: 'main.cpp', language: 'cpp', lastLanguage: 'cpp',
            content: '#include <iostream>\n// remove\n/* block\nremove\n*/\nint main() {\n    int remove = 1;\n    remove++; // remove\n}\n',
            isOpen: true, order: 0, lastUpdated: Date.now(), output: '', logs: ''
        }]) }));
    });
    await page.route('**/api/image/status?*', route => route.fulfill({ json: { docker: true, present: true } }));
    await page.goto('/playground');
    await expect(page.locator('.monaco-editor .view-lines')).toContainText('remove++');
});

test('output resizes without collapsing through its display-contents wrapper', async ({ page }) => {
    const handle = page.getByRole('button', { name: 'Resize execution panel' });
    const panel = page.locator('.exec-panel-host .panel');
    const before = (await panel.boundingBox())!;
    const grip = (await handle.boundingBox())!;
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
    await page.mouse.down();
    await page.mouse.move(grip.x + grip.width / 2, grip.y - 80, { steps: 8 });
    await page.mouse.up();
    await expect.poll(async () => (await panel.boundingBox())!.height).toBeGreaterThan(before.height + 50);
    await expect(page.getByRole('button', { name: 'Output', exact: true })).toBeVisible();
});

test('debugging skips comments and structural lines, with controls tooltips below', async ({ page }) => {
    const line = (number: number) => page.locator('.monaco-editor .line-numbers').filter({ hasText: new RegExp(`^${number}$`) });
    for (const number of [1, 2, 3, 4, 5, 9, 10]) {
        await line(number).click();
        await expect(page.locator('.cojudge-breakpoint')).toHaveCount(0);
    }
    await line(7).click();
    await expect(page.locator('.cojudge-breakpoint')).toHaveCount(1);

    const state = { status: 'paused', line: 7, vars: { remove: '1' } };
    const evaluations: string[] = [];
    await page.route('**/api/playground/run', route => route.fulfill({ json: { jobId: 'debug-test', state } }));
    await page.route('**/api/debug**', route => {
        const body = route.request().method() === 'POST' ? route.request().postDataJSON() : null;
        if (body?.action === 'eval') {
            evaluations.push(body.variable);
            return route.fulfill({ json: { variable: body.variable, value: '1' } });
        }
        return route.fulfill({ json: state });
    });
    await page.getByRole('button', { name: 'Debug', exact: true }).click();
    await expect(page.getByText('Paused at line 7')).toBeVisible();
    for (const [name, shortcut] of [['Step Over', 'F10'], ['Continue', 'F5'], ['Stop', 'Shift+F5']]) {
        const button = page.getByRole('button', { name, exact: true });
        await button.hover();
        const tooltip = page.locator('.tooltip-box');
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveText(shortcut);
        expect((await tooltip.boundingBox())!.y).toBeGreaterThan((await button.boundingBox())!.y + (await button.boundingBox())!.height);
    }
    const comments = page.locator('.view-line span').filter({ hasText: /^\/\/\sremove$/ });
    await comments.first().hover();
    await page.waitForTimeout(700);
    expect(evaluations).toEqual([]);
    await page.locator('.view-line').nth(7).locator('span').filter({ hasText: /^\s*remove\s*$/ }).hover();
    await expect.poll(() => evaluations).toContain('remove');
});
