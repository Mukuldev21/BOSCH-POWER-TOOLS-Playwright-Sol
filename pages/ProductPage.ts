import { expect, Page } from '@playwright/test';

export class ProductPage {
      async openSpecificationSectionIfNeeded() {
        // Try clicking a tab or expanding a section if needed
        const tab = this.page.getByRole('tab', { name: /specification|specs|technical/i }).first();
        if (await tab.count()) {
          await tab.click();
          return;
        }
        // Try a button or link
        const btn = this.page.getByRole('button', { name: /specification|specs|technical/i }).first();
        if (await btn.count()) {
          await btn.click();
          return;
        }
        // Try fallback by text
        const textLink = this.page.getByText(/specification|specs|technical/i, { exact: false }).first();
        if (await textLink.count()) {
          await textLink.click();
          return;
        }
        // If nothing to click, assume section is already visible
      }

      async getSpecificationValue(key: string): Promise<string | null> {
        // 1. Try to find any element whose text includes the key (case-insensitive, partial match)
        // 2. Try to extract value from nearby cell, sibling, or text node
        // 3. Return the first non-empty value found

        // Try common variants for the key
        const variants = [
          key,
          key.toUpperCase(),
          key.toLowerCase(),
        ];
        if (key.toLowerCase() === 'rpm') {
          variants.push('Speed', 'No-load speed', 'Speed (RPM)', 'Rotational Speed', 'No Load Speed', 'Speed Range');
        }
        let found = false;
        // Table row pattern: find all rows, filter for th or td containing the key (case-insensitive, partial match)
        const allRows = this.page.locator('tr');
        const rowCount = await allRows.count();
        for (let i = 0; i < rowCount; i++) {
          const row = allRows.nth(i);
          const thText = (await row.locator('th').textContent())?.trim() || '';
          const tdText = (await row.locator('td').first().textContent())?.trim() || '';
          for (const variant of variants) {
            if (
              thText.toLowerCase().includes(variant.toLowerCase()) ||
              tdText.toLowerCase().includes(variant.toLowerCase())
            ) {
              found = true;
              // Prefer value in td (if th matched), or next td
              const valueCell = row.locator('td').last();
              if (await valueCell.count()) {
                const value = (await valueCell.textContent())?.trim();
                if (value) return value;
              }
              // Try th's next sibling
              const thCell = row.locator('th').first();
              if (await thCell.count()) {
                const nextTd = thCell.locator('xpath=following-sibling::td[1]');
                if (await nextTd.count()) {
                  const value = (await nextTd.textContent())?.trim();
                  if (value) return value;
                }
              }
            }
          }
        }

        // Definition list pattern: find all dt, filter for text containing the key or variants (case-insensitive, partial match)
        const allDts = this.page.locator('dt');
        const dtCount = await allDts.count();
        for (let i = 0; i < dtCount; i++) {
          const dt = allDts.nth(i);
          const dtText = (await dt.textContent())?.trim() || '';
          for (const variant of variants) {
            if (dtText.toLowerCase().includes(variant.toLowerCase())) {
              found = true;
              const dd = dt.locator('xpath=following-sibling::dd[1]');
              if (await dd.count()) {
                const value = (await dd.textContent())?.trim();
                if (value) return value;
              }
            }
          }
        }

        // Any element (div, span, li, etc.) containing the key or variants, try to extract value from text
        for (const variant of variants) {
          const label = this.page.getByText(new RegExp(variant, 'i')).first();
          if (await label.count()) {
            // Try next sibling
            const next = label.locator('xpath=following-sibling::*[1]');
            if (await next.count()) {
              const value = (await next.textContent())?.trim();
              if (value && !value.toLowerCase().includes(variant.toLowerCase())) return value;
            }
            // Try parent text
            const parent = await label.evaluateHandle(el => el?.parentElement);
            if (parent) {
              const value = await parent.evaluate((el, k) => {
                if (!el) return null;
                const text = el.textContent || '';
                // Find the first value after the key
                const match = text.match(new RegExp(`${k}\\s*:?\\s*([^\\n]+)`, 'i'));
                return match ? match[1].trim() : null;
              }, variant);
              if (value && !value.toLowerCase().includes(variant.toLowerCase())) return value;
            }
          }
        }

        // As a last resort, search all visible text for a line containing the key or variants and try to extract a value
        const allText = (await this.page.content()).toString();
        for (const variant of variants) {
          const regex = new RegExp(`${variant}\\s*:?\\s*([^<\\n]+)`, 'i');
          const match = allText.match(regex);
          if (match && match[1]) {
            const value = match[1].trim();
            if (value && !value.toLowerCase().includes(variant.toLowerCase())) return value;
          }
        }

        // If not found, log all found spec labels and values for debugging
        const foundSpecs: string[] = [];
        // Table rows
        for (let i = 0; i < rowCount; i++) {
          const row = allRows.nth(i);
          const thText = (await row.locator('th').textContent())?.trim() || '';
          const tdText = (await row.locator('td').first().textContent())?.trim() || '';
          foundSpecs.push(`TR: th='${thText}' td='${tdText}'`);
        }
        // Definition list
        for (let i = 0; i < dtCount; i++) {
          const dt = allDts.nth(i);
          const dtText = (await dt.textContent())?.trim() || '';
          const dd = dt.locator('xpath=following-sibling::dd[1]');
          const ddText = (await dd.count()) ? (await dd.textContent())?.trim() || '' : '';
          foundSpecs.push(`DL: dt='${dtText}' dd='${ddText}'`);
        }
        console.log(`Could not find spec for key '${key}'. Found specs:`, foundSpecs);
        return null;
      }
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
