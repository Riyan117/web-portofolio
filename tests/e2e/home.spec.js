/**
 * E2E tests — homepage render
 * Requires Docker container running on http://localhost:3000
 * Run: npm run test:e2e
 */
import { test, expect } from '@playwright/test';

test.describe('Homepage — render & content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Riyan/i);
  });

  test('hero title is visible', async ({ page }) => {
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
  });

  test('hero line 1 "Full Stack" renders characters', async ({ page }) => {
    await page.waitForSelector('#hl1 .h-char', { timeout: 5000 });
    const chars = page.locator('#hl1 .h-char');
    await expect(chars.first()).toBeVisible();
  });

  test('hero line 3 "From Scratch." has accent color class', async ({ page }) => {
    const hl3 = page.locator('#hl3');
    await expect(hl3).toHaveClass(/h-accent/);
  });

  test('all 7 sections are present in DOM', async ({ page }) => {
    const sectionIds = ['#hero', '#about', '#skills', '#projects', '#experience', '#certifications', '#contact'];
    for (const id of sectionIds) {
      await expect(page.locator(id)).toBeAttached();
    }
  });

  test('navbar is visible', async ({ page }) => {
    await expect(page.locator('#navbar')).toBeVisible();
  });
});
