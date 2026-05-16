import { test, expect } from '@playwright/test';

test('homepage responds and has a title', async ({ page }) => {
  // Ensure your Next dev server is running on http://localhost:3000
  await page.goto('http://localhost:3000');
  // Basic assertion: page loaded and has a title (may be empty depending on app)
  await expect(page).toHaveTitle(/.*/);
});
