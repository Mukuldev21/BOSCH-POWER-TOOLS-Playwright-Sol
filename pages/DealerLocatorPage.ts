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
    // Be more specific to avoid matching hidden iframes and navigation menus
    const map = this.page.locator('iframe:visible, [id*="map" i]:visible, [class*="map" i]:visible').first();
    const list = this.page.locator('[class*="dealer" i]:visible, [class*="result" i]:visible, [class*="location" i]:visible, [data-testid*="dealer" i]:visible').first();

    // Try to wait for either map or list to be visible
    try {
      await expect(
        map.or(list),
        'Dealer map or list should be visible after search'
      ).toBeVisible({ timeout: 15000 });
    } catch (error) {
      // If the .or() fails due to strict mode, try each individually
      const mapVisible = await map.isVisible().catch(() => false);
      const listVisible = await list.isVisible().catch(() => false);

      if (!mapVisible && !listVisible) {
        // Log what's on the page for debugging
        console.log('Current URL:', this.page.url());
        throw new Error('Neither dealer map nor dealer list is visible after search');
      }
    }
  }
}
