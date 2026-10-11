import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5375' });

// Examples render once from metadata.json (statement.md carries none).
test('examples render once from metadata', async ({ page }) => {
  await page.goto('/problems/max-sum-of-rectangle-no-larger-than-k');
  // max-sum has exactly 2 metadata examples -> exactly 2 Explanation cards,
  // and no "Example N:" code-block headers from statement.md
  await expect(page.getByText('Explanation:').first()).toBeVisible();
  await expect(page.getByText('Explanation:')).toHaveCount(2);
  await expect(page.getByText(/Example \d+:/)).toHaveCount(0);
});
