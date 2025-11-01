// pages/Homepage.ts
import { Page, Locator, expect } from '@playwright/test';

export class Homepage {
  readonly page: Page;
  readonly baseURL = 'https://www.boschtools.com/us/en/';
  readonly expectedTitle = /Bosch Power Tools \| Boschtools/i;
  readonly consentButton: Locator;
  readonly searchButton: Locator;

  // Locators for NAV-002: Main Category Links
    readonly powerToolsLink: Locator;
    readonly accessoriesLink: Locator;
    readonly measuringToolsLink: Locator;
    readonly handToolsLink: Locator;
    readonly serviceLink: Locator;
    readonly tradeSolutionsLink: Locator;
    readonly newProductsLink: Locator;
    readonly proDealsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentButton = page.getByRole('button', { name: /Accept All|Accept Cookies|OK/i });
    this.searchButton = page.getByRole('button', { name: 'Onsite Search', exact: true });

    // Initializing Locators for NAV-002
    // Targeting main navigation links by text/role
    this.powerToolsLink = page.getByRole('link', { name: 'Power Tools' }).first();
    this.accessoriesLink = page.getByRole('link', { name: 'Accessories' }).first();
    this.measuringToolsLink = page.getByRole('link', { name: 'Measuring Tools' }).first();
    this.handToolsLink = page.getByRole('link', { name: 'Hand Tools' }).first();
    this.serviceLink = page.getByRole('link', { name: 'Service' }).first();
    this.tradeSolutionsLink = page.getByRole('link', { name: 'Trade Solutions' }).first();
    this.newProductsLink = page.getByRole('link', { name: 'New Products' }).first();
    this.proDealsLink = page.getByRole('link', { name: 'Pro Deals' }).first();
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

  // --- NAV-002 Action Method ---

    /**
     * Clicks a category link and verifies the resulting URL contains the expected category slug.
     * After verification, it navigates back to the homepage.
     * @param locator The locator for the category link.
     * @param categoryName The expected URL slug (e.g., 'power-tools').
     */
    async clickAndVerifyCategoryLink(locator: Locator, categoryName: string) {
        await expect(locator).toBeVisible();
        
    const categoryLabel = (await locator.textContent())?.trim() || categoryName;
        
    await locator.click();
        
   // Wait for the navigation to complete and the page to settle
    await this.page.waitForLoadState('domcontentloaded');

    const expectedSubstring = categoryName.replace(/-/g, ' '); // e.g., "power tools"

     const categoryAnchor = categoryName.split('-')[0];

        // 1. Verify URL contains the category anchor (case-insensitive)
        const currentUrl = this.page.url().toLowerCase();
        
        const urlCheckPassed = currentUrl.includes(categoryAnchor);
        expect(urlCheckPassed, 
            `Expected URL "${currentUrl}" to contain category slug anchor "${categoryAnchor}"`)
            .toBe(true);
        console.log(`URL check passed: URL contains "${categoryAnchor}".`);
        
        // 2. Verify Page Title contains the category anchor (case-insensitive)
        const currentTitle = await this.page.title();
        const titleCheckPassed = currentTitle.toLowerCase().includes(categoryAnchor);

        expect(titleCheckPassed, 
            `Expected page title "${currentTitle}" to contain category anchor "${categoryAnchor}"`)
            .toBe(true);
            
        console.log(`Title check passed: Title is "${currentTitle}" and contains "${categoryAnchor}".`);
        
        console.log(`Successfully navigated to the "${categoryLabel}" page.`);


  // Navigate back to the homepage for the next link click
    await this.page.goto(this.baseURL);
    await this.page.waitForLoadState('domcontentloaded');
        
  // Re-dismiss banner in case the navigation back to the root page causes it to reappear
    await this.dismissConsentBanner();
  }
}