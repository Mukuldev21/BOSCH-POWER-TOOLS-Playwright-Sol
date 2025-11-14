import { expect, Locator, Page } from '@playwright/test';

export class ServicePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoHomepage() {
    await this.page.goto('https://www.boschtools.com/us/en/');
  }

  async openServiceOrSupportMenu() {
    // Try header and footer links for Service/Support
    const headerLink = this.page.getByRole('link', { name: /service|support/i }).first();
    if (await headerLink.isVisible()) {
      await headerLink.click();
      return;
    }
    const footerLink = this.page.locator('footer').getByRole('link', { name: /service|support/i }).first();
    if (await footerLink.isVisible()) {
      await footerLink.click();
      return;
    }
    throw new Error('Service/Support link not found in header or footer.');
  }

  async clickToolRepairOrOnlineRepair() {
    // Try to find and click "Tool Repair" or "Online Repair Service"
    const repairLink = this.page.getByRole('link', { name: /tool repair|online repair service/i }).first();
    if (await repairLink.isVisible()) {
      await repairLink.click();
      return;
    }
    // Fallback: search for text
    const repairText = this.page.getByText(/tool repair|online repair service/i).first();
    if (await repairText.isVisible()) {
      await repairText.click();
      return;
    }
    throw new Error('Tool Repair or Online Repair Service link not found.');
  }

  async assertRepairPageLoaded() {
    // Check for URL
    await expect(this.page).toHaveURL(/repair/i);

    // Try to find any visible element with 'repair' or 'service' in the text
    const repairText = this.page.getByText(/repair|service/i, { exact: false });
    if (await repairText.count() > 0) {
      for (let i = 0; i < await repairText.count(); i++) {
        if (await repairText.nth(i).isVisible()) {
          // Found a visible element with repair/service
          return;
        }
      }
    }

    // If not found, log the main content for debugging
    const mainContent = await this.page.locator('main, .main, #main, body').innerText();
    console.log('Main content text:', mainContent);

    // Optionally, pass if URL and main content both contain 'repair' or 'service'
    if (/repair|service/i.test(mainContent)) {
      return;
    }

    throw new Error('Repair/Service heading or content not found on Tool Repair page.');
  }
}
