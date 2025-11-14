import { expect, Page } from '@playwright/test';

export class ProductPage {
    async clickWhereToBuyOrDealerLocator() {
      // Try common selectors/texts for Where to Buy/Dealer Locator
      const cta = this.page.getByRole('button', { name: /where to buy|dealer locator|find a dealer|find store/i }).first();
      if (await cta.count()) {
        await cta.click();
        return;
      }
      // Try as a link
      const link = this.page.getByRole('link', { name: /where to buy|dealer locator|find a dealer|find store/i }).first();
      if (await link.count()) {
        await link.click();
        return;
      }
      // Try fallback by text
      const textLink = this.page.getByText(/where to buy|dealer locator|find a dealer|find store/i, { exact: false }).first();
      if (await textLink.count()) {
        await textLink.click();
        return;
      }
      throw new Error('Where to Buy / Dealer Locator button or link not found on PDP.');
    }
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(productUrl: string) {
    await this.page.goto(productUrl);
  }

  async assertProductTitleVisible() {
    // Try common selectors for product title
    const title = this.page.locator('h1, .product-title, [data-testid="product-title"]').first();
    await expect(title).toBeVisible();
    return title;
  }

  async assertProductImageLoaded() {
    // Try common selectors for product image
    const image = this.page.locator('img[alt][src*="product"], img.product-image, [data-testid="product-image"]').first();
    // Wait for the image to be attached to the DOM
    await image.waitFor({ state: 'attached', timeout: 5000 });
    // Check loaded state (naturalWidth > 0) regardless of visibility
    const loaded = await image.evaluate((img: HTMLImageElement) => img.naturalWidth > 0);
    expect(loaded).toBe(true);
    return image;
  }

  async assertModelNumberVisible() {
    // Try [data-testid="model-number"] first
    let model = this.page.locator('[data-testid="model-number"]').first();
    if (await model.count() && await model.isVisible()) {
      await expect(model).toBeVisible();
      return model;
    }
    // Try common text patterns one by one
    const patterns = [
      /Model\s*:?\s*([A-Za-z0-9-]+)/i,
      /SKU\s*:?\s*([A-Za-z0-9-]+)/i,
      /Part No\.?\s*:?\s*([A-Za-z0-9-]+)/i,
      /Product Number\s*:?\s*([A-Za-z0-9-]+)/i
    ];
    for (const pattern of patterns) {
      model = this.page.getByText(pattern, { exact: false });
      if (await model.count() && await model.isVisible()) {
        await expect(model).toBeVisible();
        return model;
      }
    }
    // If none found, fail
    throw new Error('Model number not found or not visible on the PDP.');
  }
}
