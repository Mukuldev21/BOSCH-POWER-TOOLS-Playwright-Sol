import { test, expect } from '@playwright/test';
import { Homepage } from '../pages/Homepage';
import { ProductPage } from '../pages/ProductPage';

// Example product URL (replace with a real PDP URL from your site)
const PRODUCT_URL = 'https://www.boschtools.com/us/en/products/gxl18v-496b22-06019G5215';

test.describe('Category C: Product Details Page (PDP) Validation', () => {
  /**
   * Test Case: PDP-001
   * Description: Verify essential product information loads on the PDP.
   * Steps:
   *   1. Navigate to the PDP for a specific product (e.g., a popular drill).
   *   2. Assert the main product title is visible.
   *   3. Assert the product image is loaded (check for naturalWidth > 0).
   *   4. Assert the product model number is displayed.
   * Expected: The main details (Name, Image, Model) are present and correctly rendered.
   */
  test('PDP-001: Should display essential product information on the PDP', async ({ page }) => {
    const homepage = new Homepage(page);
    const pdp = new ProductPage(page);

    await test.step('Navigate directly to the Product Details Page (PDP)', async () => {
      await pdp.goto(PRODUCT_URL);
    });

    await test.step('Assert the main product title is visible', async () => {
      await pdp.assertProductTitleVisible();
    });

    await test.step('Assert the product image is loaded', async () => {
      await pdp.assertProductImageLoaded();
    });

    await test.step('Assert the product model number is displayed', async () => {
      await pdp.assertModelNumberVisible();
    });

    console.log('Test case PDP-001 passed successfully.');
  });

  /**
   * Test Case: PDP-002
   * Description: Verify link to "Where to Buy" or "Dealer Locator".
   * Steps:
   *   1. On a PDP, click the "Where to Buy" or similar call-to-action button.
   *   2. A modal or new page loads, showing authorized sellers or directing to the Dealer Locator.
   * Expected: Modal or new page with dealer/seller info is shown.
   */
  test('PDP-002: Should open "Where to Buy" or Dealer Locator from PDP', async ({ page, context }) => {
    const pdp = new ProductPage(page);
    await test.step('Navigate directly to the Product Details Page (PDP)', async () => {
      await pdp.goto(PRODUCT_URL);
    });

    await test.step('Click the "Where to Buy" or Dealer Locator button', async () => {
      await pdp.clickWhereToBuyOrDealerLocator();
    });

    await test.step('Verify a modal or new page with dealer/seller info is shown', async () => {
      // Check for modal
      const modal = page.locator('text=/authorized sellers|dealer locator|where to buy/i');
      if (await modal.isVisible()) {
        expect(await modal.isVisible()).toBe(true);
        return;
      }
      // Or check for new page
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        // The click is already done, so this is just a fallback in case a new page opened
      ]).catch(() => [null]);
      if (newPage) {
        await newPage.waitForLoadState('domcontentloaded');
        const url = newPage.url();
        expect(url).toMatch(/dealer|where-to-buy|store-locator/i);
        await newPage.close();
        return;
      }
      // If neither, fail
      throw new Error('Dealer locator modal or page did not appear after clicking Where to Buy.');
    });
    console.log('Test case PDP-002 passed successfully.');
  });
});
