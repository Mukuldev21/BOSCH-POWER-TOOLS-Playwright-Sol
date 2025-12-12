import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

// PDP-004: Verify related accessories section (cross-selling)
test.describe('📦 Product Details Page (PDP)', () => {
  test('should display at least one accessory tile and links should be clickable', async ({ page }) => {
    // Go to a sample product PDP (reuse existing navigation logic)
    const pdp = new ProductPage(page);
    await pdp.goto('https://www.boschtools.com/us/en/products/gxl18v-496b22-06019G5215');

    // Verify related accessories using Page Object
    await pdp.verifyRelatedAccessories();
  });
});
