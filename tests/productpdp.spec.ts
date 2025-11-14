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
});
