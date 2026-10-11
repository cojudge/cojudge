import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5375' });

test('leetcode-1000 shows Cojudge numbers, pattern groups, last tab', async ({ page }) => {
  await page.goto('/?course=leetcode-1000');
  // Tabs: LeetCode 1000 last
  const tabs = page.locator('nav.tabs a.tab');
  await expect(tabs.last()).toContainText('LeetCode 1000');
  // Pattern groups (NeetCode 250 style + union-find / segment-tree + prefix-sum / strings / sorting / simulation / design)
  await expect(page.getByText('Arrays Hashing', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Union Find', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Segment Tree', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Prefix Sum', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Simulation', { exact: false }).first()).toBeVisible();
  // Expand the arrays-hashing group, then check Cojudge numbers in rows
  await page.locator('button.group-header', { hasText: 'Arrays Hashing' }).click();
  await expect(page.getByRole('link', { name: /1\. Two Sum/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /6\. Majority Element/ })).toBeVisible();
  await page.screenshot({ path: '/tmp/lc1000-check.png' });
});
