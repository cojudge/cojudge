import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5375' });

test('leetcode-1000 shows LC numbers, 1-100 labels, last tab', async ({ page }) => {
  await page.goto('/?course=leetcode-1000');
  // Tabs: LeetCode 1000 last
  const tabs = page.locator('nav.tabs a.tab');
  await expect(tabs.last()).toContainText('LeetCode 1000');
  // Category label keeps hyphen
  await expect(page.getByText('1-100', { exact: false }).first()).toBeVisible();
  // Expand the 101-200 group, then check LC numbers in rows
  await page.locator('button.group-header', { hasText: '101-200' }).click();
  await expect(page.getByRole('link', { name: /169\. Majority Element/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /191\. Number of 1 Bits/ })).toBeVisible();
  await page.screenshot({ path: '/tmp/lc1000-check.png' });
});
