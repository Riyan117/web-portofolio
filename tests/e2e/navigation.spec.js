/**
 * E2E tests — navigation & smooth scroll anchors
 * Requires Docker container running on http://localhost:3000
 */
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for hero animation to finish before testing nav
    await page.waitForTimeout(1000);
  });

  test('navbar scrolled class added after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(200);
    const navbar = page.locator('#navbar');
    await expect(navbar).toHaveClass(/scrolled/);
  });

  test('navbar scrolled class removed when back at top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const navbar = page.locator('#navbar');
    await expect(navbar).not.toHaveClass(/scrolled/);
  });

  test('clicking anchor link scrolls to target section', async ({ page }) => {
    const aboutLink = page.locator('a[href="#about"]').first();
    await aboutLink.click();
    await page.waitForTimeout(800); // allow smooth scroll
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('clicking Projects link scrolls to projects section', async ({ page }) => {
    const projLink = page.locator('a[href="#projects"]').first();
    await projLink.click();
    await page.waitForTimeout(800);
    await expect(page.locator('#projects')).toBeInViewport();
  });
});
