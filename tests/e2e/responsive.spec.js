/**
 * E2E tests — responsive layout
 * Tests critical UI across mobile, tablet, desktop viewports.
 * Requires Docker container running on http://localhost:3000
 */
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844  }, // iPhone 14
  { name: 'tablet',  width: 768,  height: 1024 }, // iPad
  { name: 'desktop', width: 1440, height: 900  }, // MacBook
];

for (const vp of VIEWPORTS) {
  test.describe(`Responsive — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('hero title is visible', async ({ page }) => {
      await expect(page.locator('.hero-title')).toBeVisible();
    });

    test('no horizontal overflow on body', async ({ page }) => {
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = vp.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
    });

    test('navbar is visible', async ({ page }) => {
      await expect(page.locator('#navbar')).toBeVisible();
    });

    test('hero CTA buttons are visible', async ({ page }) => {
      const btns = page.locator('#heroBtns');
      // Wait for GSAP entrance animation
      await page.waitForTimeout(3000);
      await expect(btns).toBeVisible();
    });
  });
}
