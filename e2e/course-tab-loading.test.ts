import { expect, test } from '@playwright/test';

// The course-tab navigation waits for __data.json, which can take seconds on
// slow connections. Hold that response so the pending UI stays observable,
// then assert the spinner, status line, and dimmed content appear and clear.
test('course tab shows loading state while course data is slow', async ({ page }) => {
  await page.goto('/?course=blind75');
  const nc150Tab = page.getByRole('link', { name: 'NeetCode 150' });
  await expect(nc150Tab).toBeVisible();

  await page.route('**/__data.json*', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });

  await nc150Tab.click();

  const pendingTab = page.locator('.tab.pending');
  await expect(pendingTab).toBeVisible();
  await expect(pendingTab).toContainText('NeetCode 150');
  await expect(pendingTab.locator('.tab-spinner')).toBeVisible();
  await expect(page.locator('.intro.stale')).toBeVisible();
  await page.screenshot({ path: '/tmp/course-tab-loading.png' });

  await expect(page).toHaveURL(/course=nc150/);
  await expect(page.locator('.overall-count')).toContainText('/ 150');
  await expect(page.locator('.tab.pending')).toHaveCount(0);
  await expect(page.locator('.stale')).toHaveCount(0);
});
