// pages/Homepage.ts
import { Page, Locator, expect } from '@playwright/test';

export class Homepage {
  readonly page: Page;
  readonly baseURL = 'https://www.boschtools.com/us/en/';
  readonly expectedTitle = /Bosch Power Tools \| Boschtools/i;
  readonly consentButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentButton = page.getByRole('button', { name: /Accept All|Accept Cookies|OK/i });
    this.searchButton = page.getByRole('button', { name: 'Onsite Search', exact: true });
  }

  async navigate() {
    await this.page.goto(this.baseURL);
    await expect(this.page).toHaveURL(this.baseURL);
  }

  async dismissConsentBanner() {
    try {
      await this.consentButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.consentButton.click();
      console.log('Consent banner dismissed.');
    } catch {
      console.log('No visible consent banner found or timeout reached.');
    }
  }

  async verifyTitle() {
    const title = await this.page.title();
    console.log(`Page Title: ${title}`);
    await expect(this.page).toHaveTitle(this.expectedTitle);
  }

  async verifySearchBarVisible() {
    await this.searchButton.waitFor({ state: 'visible' });
    await expect(this.searchButton).toBeVisible();
    console.log('Main search bar element is visible.');
  }
}