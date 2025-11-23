import { expect, Page } from '@playwright/test';

export class DealerLocatorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomepage() {
    await this.page.goto('https://www.boschtools.com/us/en/');
  }

  async openDealerLocator() {
    // Try multiple variants for the Dealer Locator link
    const variants = [
      /dealer locator/i,
      /where to buy/i,
      /find a dealer/i,
      /store locator/i,
      /find a store/i,
      /authorized sellers/i
    ];
    // Try header, nav, footer, and anywhere
    for (const variant of variants) {
      // Header/nav
      const headerLink = this.page.locator('header, nav').getByRole('link', { name: variant }).first();
      if (await headerLink.count() && await headerLink.isVisible()) {
        await headerLink.click();
        return;
      }
      // Footer
      const footerLink = this.page.locator('footer').getByRole('link', { name: variant }).first();
      if (await footerLink.count() && await footerLink.isVisible()) {
        await footerLink.click();
        return;
      }
      // Anywhere
      const anyLink = this.page.getByRole('link', { name: variant }).first();
      if (await anyLink.count() && await anyLink.isVisible()) {
        await anyLink.click();
        return;
      }
      // Fallback: text
      const anyText = this.page.getByText(variant).first();
      if (await anyText.count() && await anyText.isVisible()) {
        await anyText.click();
        return;
      }
    }
    // Log all links for debugging
    const allLinks = await this.page.locator('a').allTextContents();
    console.log('All links on page:', allLinks);
    throw new Error('Dealer Locator/Where to Buy link not found.');
  }

  async enterZipAndSubmit(zip = '90210') {
    // Try to find a visible and enabled ZIP input
    const inputSelectors = [
      'input[placeholder*="ZIP" i]',
      'input[aria-label*="ZIP" i]',
      'input[name*="zip" i]',
      'input[type="search"]',
      'input[type="text"]',
    ];
    let input = null;
    for (const sel of inputSelectors) {
      const candidates = this.page.locator(sel);
      const count = await candidates.count();
      for (let i = 0; i < count; i++) {
        const candidate = candidates.nth(i);
        if (await candidate.isVisible() && !(await candidate.isDisabled())) {
          input = candidate;
          break;
        }
      }
      if (input) break;
    }
    if (!input) {
      // Log all visible input fields for debugging
      const allInputs = this.page.locator('input');
      const inputCount = await allInputs.count();
      const visibleInputs: string[] = [];
      for (let i = 0; i < inputCount; i++) {
        const inp = allInputs.nth(i);
        if (await inp.isVisible()) {
          const placeholder = await inp.getAttribute('placeholder');
          const name = await inp.getAttribute('name');
          const aria = await inp.getAttribute('aria-label');
          visibleInputs.push(`placeholder='${placeholder}', name='${name}', aria-label='${aria}'`);
        }
      }
      console.log('Visible input fields:', visibleInputs);
      throw new Error('Dealer locator ZIP input not found.');
    }
    await input.fill(zip);
    // Try to submit (button or Enter)
    const submitBtn = this.page.getByRole('button', { name: /search|find|go|submit/i }).first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    } else {
      await input.press('Enter');
    }
  }

  async assertDealersOrMapVisible() {
    // Wait for results: map or dealer list
    const map = this.page.locator('iframe, [id*="map" i], [class*="map" i]').first();
    const list = this.page.locator('[class*="dealer" i], [class*="result" i], ul, ol').first();
    // Wait for either map or list to be visible
    await expect(
      map.or(list),
      'Dealer map or list should be visible after search'
    ).toBeVisible({ timeout: 15000 });
  }
}
