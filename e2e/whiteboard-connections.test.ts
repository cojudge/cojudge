import { expect, test, type Page } from '@playwright/test';

const storageKey = 'cojudge-whiteboard-v1';
async function board(page: Page) {
	return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).elements, storageKey);
}
async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
	await page.mouse.move(from.x, from.y);
	await page.mouse.down();
	await page.mouse.move(to.x, to.y, { steps: 10 });
	await page.mouse.up();
}

test('arrowheads are independent and persistent, while normal lines remain unattached', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/whiteboard');
	await page.locator('.drawing-canvas').focus();
	await page.keyboard.press('5');
	await page.getByLabel('Start arrowhead', { exact: true }).click();
	await page.getByRole('button', { name: 'start arrowhead: Filled triangle', exact: true }).click();
	await page.getByLabel('End arrowhead', { exact: true }).click();
	await page.getByRole('button', { name: 'end arrowhead: Outlined triangle', exact: true }).click();
	await drag(page, { x: 450, y: 300 }, { x: 750, y: 400 });
	await expect.poll(async () => (await board(page))[0]).toMatchObject({ startArrowhead: 'triangle', endArrowhead: 'triangle-outline' });
	await expect(page.locator('.elements-layer > g').first().locator('path')).toHaveCount(3);
	await page.getByLabel('Start arrowhead', { exact: true }).click();
	await page.getByRole('button', { name: 'start arrowhead: None', exact: true }).click();
	await expect(page.locator('.elements-layer > g').first().locator('path')).toHaveCount(2);
	await page.locator('.drawing-canvas').focus();
	await page.keyboard.press('ControlOrMeta+z');
	await expect.poll(async () => (await board(page))[0].startArrowhead).toBe('triangle');
	await page.reload();
	await expect(page.locator('.elements-layer > g').first().locator('path')).toHaveCount(3);
	await page.locator('.drawing-canvas').focus();
	await page.keyboard.press('2');
	await drag(page, { x: 350, y: 500 }, { x: 450, y: 600 });
	await page.keyboard.press('6');
	await drag(page, { x: 400, y: 550 }, { x: 700, y: 550 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'line')).toMatchObject({ x: 400, y: 550, width: 300, height: 0 });
	let line = (await board(page)).find((element: any) => element.type === 'line');
	expect(line.startConnection).toBeUndefined();
	expect(line.endConnection).toBeUndefined();
	const handle = (await page.locator('[data-endpoint="end"]').boundingBox())!;
	await drag(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, { x: 420, y: 570 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'line').width).toBe(20);
	line = (await board(page)).find((element: any) => element.type === 'line');
	expect(line.endConnection).toBeUndefined();
	await drag(page, { x: 380, y: 520 }, { x: 480, y: 620 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'rectangle').x).toBe(450);
	expect((await board(page)).find((element: any) => element.type === 'line')).toEqual(line);
});

test('chosen edge positions survive endpoint editing, moving, resizing, reload, and duplication', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/whiteboard');
	await page.locator('.drawing-canvas').focus();
	await page.keyboard.press('2');
	await drag(page, { x: 400, y: 300 }, { x: 600, y: 500 });
	await page.keyboard.press('5');
	await drag(page, { x: 450, y: 300 }, { x: 850, y: 400 });
	const arrow = async () => (await board(page)).find((element: any) => element.type === 'arrow');
	await expect.poll(arrow).toMatchObject({ x: 450, y: 300, startConnection: { anchor: { x: -0.5, y: -1 } } });
	const startHandle = page.locator('[data-endpoint="start"]');
	for (const point of [{ x: 400, y: 440 }, { x: 550, y: 500 }, { x: 600, y: 350 }]) {
		const handle = (await startHandle.boundingBox())!;
		await drag(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, point);
		await expect.poll(arrow).toMatchObject({ x: point.x, y: point.y });
	}
	await page.keyboard.press('ControlOrMeta+z');
	await expect.poll(arrow).toMatchObject({ x: 550, y: 500 });
	await page.reload();
	await expect(page.locator('.elements-layer > g')).toHaveCount(2);
	await expect.poll(arrow).toMatchObject({ x: 550, y: 500, startConnection: { anchor: { x: 0.5, y: 1 } } });
	await drag(page, { x: 450, y: 400 }, { x: 500, y: 450 });
	await expect.poll(arrow).toMatchObject({ x: 600, y: 550 });
	const resize = (await page.locator('[data-resize-handle="se"]').boundingBox())!;
	await drag(page, { x: resize.x + resize.width / 2, y: resize.y + resize.height / 2 }, { x: 750, y: 650 });
	await expect.poll(arrow).toMatchObject({ x: 675, y: 650 });
	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.press('ControlOrMeta+d');
	await expect.poll(async () => (await board(page)).length).toBe(4);
	const copies = (await board(page)).slice(2);
	expect(copies.find((element: any) => element.type === 'arrow')).toMatchObject({
		x: 693, y: 668, startConnection: {
			elementId: copies.find((element: any) => element.type === 'rectangle').id,
			anchor: { x: 0.5, y: 1 }
		}
	});
});

test('connectors follow shapes, reconnect, detach, undo, and survive reload', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.addInitScript((key) => {
		if (localStorage.getItem(key)) return;
		localStorage.setItem(key, JSON.stringify({ version: 1, elements: [
			{ id: 'a', type: 'rectangle', x: 320, y: 250 },
			{ id: 'b', type: 'ellipse', x: 650, y: 250 },
			{ id: 'c', type: 'diamond', x: 650, y: 550 }
		].map((element) => ({ ...element, width: 100, height: 100, stroke: '#1b1b1f', fill: 'transparent',
			strokeWidth: 2, strokeStyle: 'solid', opacity: 100, fontSize: 24 })) }));
	}, storageKey);
	await page.goto('/whiteboard');
	await expect(page.locator('.elements-layer > g')).toHaveCount(3);
	await page.locator('.drawing-canvas').focus();
	await page.keyboard.press('a');
	await drag(page, { x: 370, y: 300 }, { x: 700, y: 300 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'arrow')).toMatchObject({
		startConnection: { elementId: 'a' }, endConnection: { elementId: 'b' }, x: 420, y: 300, width: 230, height: 0
	});

	// Verify the SVG updates during dragging, before pointerup saves the board.
	await page.mouse.move(700, 300);
	await page.mouse.down();
	await page.mouse.move(900, 400, { steps: 10 });
	await expect(page.locator('.elements-layer > g').last().locator('path').first()).not.toHaveAttribute('d', 'M 420 300 L 650 300');
	await page.mouse.up();
	const moved = (await board(page)).find((element: any) => element.type === 'arrow');
	await page.mouse.click(moved.x + moved.width / 2, moved.y + moved.height / 2);
	const endHandle = page.locator('[data-endpoint="end"]');
	await expect(endHandle).toBeVisible();
	let handle = (await endHandle.boundingBox())!;
	await drag(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, { x: 700, y: 600 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'arrow').endConnection).toEqual({ elementId: 'c' });

	handle = (await endHandle.boundingBox())!;
	await page.keyboard.down('Alt');
	await drag(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, { x: 700, y: 600 });
	await page.keyboard.up('Alt');
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'arrow').endConnection).toBeUndefined();
	await page.keyboard.press('ControlOrMeta+z');
	await expect.poll(async () => (await board(page)).find((element: any) => element.type === 'arrow').endConnection).toEqual({ elementId: 'c' });
	await page.reload();
	await expect(page.locator('.elements-layer > g')).toHaveCount(4);
	await drag(page, { x: 700, y: 600 }, { x: 800, y: 650 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.id === 'c').x).toBe(750);
	const restored = (await board(page)).find((element: any) => element.type === 'arrow');
	await expect(restored.endConnection).toEqual({ elementId: 'c' });
	expect(restored.x + restored.width).toBeGreaterThan(750);

	const resize = (await page.locator('[data-resize-handle="se"]').boundingBox())!;
	await drag(page, { x: resize.x + resize.width / 2, y: resize.y + resize.height / 2 }, { x: 950, y: 780 });
	const resized = (await board(page)).find((element: any) => element.type === 'arrow');
	expect(resized.endConnection).toEqual({ elementId: 'c' });
	expect(resized.width).not.toBe(restored.width);

	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.press('ControlOrMeta+d');
	await expect.poll(async () => (await board(page)).length).toBe(8);
	const copies = (await board(page)).slice(4);
	const copiedLine = copies.find((element: any) => element.type === 'arrow');
	expect(copiedLine.startConnection.elementId).toBe(copies.find((element: any) => element.type === 'rectangle').id);
	expect(copiedLine.endConnection.elementId).toBe(copies.find((element: any) => element.type === 'diamond').id);
	expect(copiedLine.x).toBeCloseTo(resized.x + 18);
});

test('bend handles route an arrow and embedded labels stay with the route', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.addInitScript((key) => {
		if (localStorage.getItem(key)) return;
		localStorage.setItem(key, JSON.stringify({ version: 1, elements: [
			{ id: 'a', type: 'diamond', x: 320, y: 250, width: 100, height: 100 },
			{ id: 'b', type: 'diamond', x: 650, y: 550, width: 100, height: 100 },
			{ id: 'arrow', type: 'arrow', x: 370, y: 300, width: 330, height: 300,
				startConnection: { elementId: 'a' }, endConnection: { elementId: 'b' } }
		].map((element) => ({ ...element, stroke: '#1b1b1f', fill: 'transparent',
			strokeWidth: 2, strokeStyle: 'solid', opacity: 100, fontSize: 24 })) }));
	}, storageKey);
	await page.goto('/whiteboard');
	await expect(page.locator('.elements-layer > g')).toHaveCount(3);
	await page.mouse.click(535, 450);
	const midpoint = page.locator('[data-insert-index="0"]');
	await expect(midpoint).toBeVisible();
	const handle = (await midpoint.boundingBox())!;
	await drag(page, { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 }, { x: 375, y: 605 });
	await expect.poll(async () => (await board(page)).find((element: any) => element.id === 'arrow')).toMatchObject({
		x: 370, y: 350, width: 280, height: 250, points: [{ x: 0, y: 250 }]
	});
	const arrow = page.locator('.elements-layer > g').last();
	await expect(arrow.locator('path').first()).toHaveAttribute('d', 'M 370 350 L 370 576 Q 370 600 394 600 L 650 600');

	await page.mouse.dblclick(550, 600);
	const editor = page.getByRole('textbox', { name: 'Whiteboard text' });
	await expect(editor).toBeFocused();
	await editor.fill('Yes\ncontinue');
	await editor.press('ControlOrMeta+Enter');
	await expect(arrow.locator('text')).toContainText('Yes');
	await expect.poll(async () => (await board(page)).find((element: any) => element.id === 'arrow').text).toBe('Yes\ncontinue');
	const labelBefore = await arrow.locator('text tspan').first().getAttribute('x');
	await drag(page, { x: 370, y: 300 }, { x: 470, y: 300 });
	await expect(arrow.locator('text tspan').first()).not.toHaveAttribute('x', labelBefore!);
	await expect(arrow.locator('text')).toContainText('continue');

	// Double-clicking a bend edits text without changing the route.
	let label = (await arrow.locator('text').boundingBox())!;
	await page.mouse.click(label.x + label.width / 2, label.y + label.height / 2);
	const beforeBendClick = (await board(page)).find((element: any) => element.id === 'arrow').points;
	await page.locator('[data-bend-index="0"]').dblclick();
	await expect(editor).toBeFocused();
	await expect(editor).toHaveValue('Yes\ncontinue');
	await editor.press('Escape');
	expect((await board(page)).find((element: any) => element.id === 'arrow').points).toEqual(beforeBendClick);
	// Bend removal is a separate, deliberate right-click action and remains undoable.
	await page.locator('[data-bend-index="0"]').click({ button: 'right' });
	await expect.poll(async () => (await board(page)).find((element: any) => element.id === 'arrow').points).toEqual([]);
	await page.keyboard.press('ControlOrMeta+z');
	await expect.poll(async () => (await board(page)).find((element: any) => element.id === 'arrow').points.length).toBe(1);
	await page.reload();
	await expect(arrow.locator('text')).toContainText('continue');
	await expect(arrow.locator('path').first()).toHaveAttribute('d', / Q /);
	label = (await arrow.locator('text').boundingBox())!;
	await page.mouse.dblclick(label.x + label.width / 2, label.y + label.height / 2);
	await expect(editor).toHaveValue('Yes\ncontinue');
	await editor.fill('');
	await editor.press('ControlOrMeta+Enter');
	await expect(arrow.locator('text')).toHaveCount(0);
	await expect(arrow.locator('path').first()).toHaveAttribute('d', / Q /);
});
