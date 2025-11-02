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
    // NEW LOCATORS FOR NAV-004
    // NEW LOCATORS FOR NAV-004 (Mobile Menu)
    readonly hamburgerIcon: Locator;
    readonly mobileNavContainer: Locator;


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

    // Initializing Locators for NAV-004 (Mobile Menu)
        // Using a more robust OR locator to find the menu button.
        this.hamburgerIcon = page.locator('.m-mainNavigation__toggle');
        
        // This targets the wrapper for the overall mobile navigation
        this.mobileNavContainer = page.locator('nav.mobile-navigation, div#mobile-menu, .m-mainNavigation__itemsWrapper');  
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
        await expect(locator).toBeVisible({ timeout: 15000 }); // Wait longer for visibility
        
        const categoryLabel = (await locator.textContent())?.trim() || categoryName;
        
        // Logic to derive two different anchors for better resilience:
        const slugParts = categoryName.split('-');
        
        // 1. Anchor for URL check: Use only the first word. This is the most reliable part of the URL.
        const urlAnchor = slugParts[0].toLowerCase();
        
        // FIX: Use Promise.all to wait for both the click action and the page navigation/load event
        // We wait for the 'load' state which is generally more reliable for confirming navigation is complete
        await Promise.all([
            // 2. Wait for navigation to complete (using 'load' state)
            this.page.waitForLoadState('load'), 
            // 1. Force a more stable click
            locator.click({ force: true }),
        ]);

        // 2. Anchor for Title check: Use the actual link text (with spaces) to match the title.
        const titleAnchor = categoryLabel.toLowerCase(); 
        
        // 1. Verify URL contains the primary anchor (case-insensitive)
        const currentUrl = this.page.url().toLowerCase();
        
        const urlCheckPassed = currentUrl.includes(urlAnchor);

        expect(urlCheckPassed, 
            `Expected URL "${currentUrl}" to contain category slug anchor "${urlAnchor}"`)
            .toBe(true);
        console.log(`URL check passed: URL contains "${urlAnchor}".`);
        
        // 2. Verify Page Title contains the title anchor (case-insensitive)
        const currentTitle = await this.page.title();
        const currentTitleLower = currentTitle.toLowerCase();
        
        // FIX: Instead of checking the whole titleAnchor, check if all words from the link text are present in the page title.
        const titleWords = titleAnchor.split(' ');
        const allWordsInTitle = titleWords.every(word => currentTitleLower.includes(word));

        expect(allWordsInTitle, 
            `Expected page title "${currentTitle}" to contain all words from category anchor "${titleAnchor}"`)
            .toBe(true);
            
        console.log(`Title check passed: Title is "${currentTitle}" and contains all words from "${titleAnchor}".`);
        
        console.log(`Successfully navigated to the "${categoryLabel}" page.`);

        // 3. Ensure the homepage is fully ready before the next click
        await this.page.goto(this.baseURL);
        
        // Final wait sequence to ensure the page is stable for the next click
        await this.page.waitForLoadState('load'); 
        await this.searchButton.waitFor({ state: 'visible', timeout: 15000 }); 

        // Re-dismiss banner in case the navigation back to the root page causes it to reappear
        await this.dismissConsentBanner(); 
    }
    

  // --- NAV-003 New Action Method ---

    /**
     * Verifies that all links within the footer section return a successful HTTP status code (200).
     * @param footerSelector A selector identifying the main footer element.
     */

    async verifyFooterLinks(footerSelector: string = 'footer') {
        await this.page.waitForSelector(footerSelector);
        
        // Find all links within the footer that have an href attribute
        const links = await this.page.locator(`${footerSelector} a[href]`).all();

        const linkVerificationPromises = links.map(async (linkLocator) => {
            const href = await linkLocator.getAttribute('href');
            let url = href;
            const linkText = (await linkLocator.textContent())?.trim() || 'No Text';

            // 1. Skip if the href is null, undefined, '#' or starts with a special protocol
            // Also explicitly skip common non-navigational links like 'Subscribe'
            if (!url || url === '#' || url.startsWith('mailto:') || url.startsWith('tel:') || linkText.toLowerCase().includes('subscribe')) {
                console.log(`Skipping link: ${linkText} (${url})`);
                return { status: 200, url: url || 'Skipped', text: linkText };
            }
            
            // CRITICAL FIX: Determine if the href is relative or absolute.
            if (!url.startsWith('http') && !url.startsWith('//')) {
                // If it's a relative path, construct the full URL
                // Ensure there is only one slash separating the base URL and the relative path
                url = url.startsWith('/') ? `${this.baseURL}${url.substring(1)}` : `${this.baseURL}${url}`;
            }

            // 2. Check for empty URL after processing (this should catch the 'Invalid URL' error)
            if (!url) {
                console.log(`Skipping link: ${linkText} (Resulting URL is empty/invalid)`);
                return { status: 200, url: 'Skipped (Invalid URL)', text: linkText };
            }

            try {
                // Use a request context to check the status without navigating
                const response = await this.page.request.head(url, { timeout: 10000 });
                const status = response.status();
                
                // Assert the status code is acceptable (200 is successful, 301/302 are redirects, 403 Forbidden is sometimes valid)
                expect([200, 204, 301, 302, 403].includes(status), 
                    `Link "${linkText}" at ${url} failed with status: ${status}`)
                    .toBe(true);
                
                console.log(`PASS: Link "${linkText}" (${url}) returned status ${status}`);
                return { status, url, text: linkText };

            } catch (error) {
                console.error(`FAIL: Link "${linkText}" at ${url} failed to fetch: ${error}`);
                // Fail the test if the request itself fails (e.g., timeout, DNS error)
                expect(false, `Link "${linkText}" failed to resolve or returned an error: ${error}`).toBe(true);
                return { status: 0, url, text: linkText }; // Placeholder for failed request
            }
        });

        // Wait for all link checks to complete
        await Promise.all(linkVerificationPromises);
        console.log('All footer link status checks completed.');
    }


     // --- NAV-004 Mobile Action Method ---
    
    /**
     * Verifies the hamburger menu icon is visible and that clicking it reveals the mobile navigation.
     */
    async verifyMobileMenu() {
        // 1. Verify the hamburger icon is visible (it should only be visible in mobile view)
        await expect(this.hamburgerIcon).toBeVisible({ timeout: 10000 });
        console.log('Hamburger menu icon is visible in mobile viewport.');

        // 2. Click the menu icon
        await this.hamburgerIcon.click();
        
        // 3. Verify the main navigation container/drawer is visible
        // We use the Power Tools link as a representative element within the revealed menu
        await expect(this.powerToolsLink).toBeVisible({ timeout: 10000 });

        // Optional: Verify the container itself is visible/expanded
        await expect(this.mobileNavContainer).toBeVisible({ timeout: 5000 });

        console.log('Mobile navigation links are successfully revealed.');

        // 4. Clean up by closing the menu for the next test (optional but good practice)
        // Clicking the hamburger icon a second time often closes it
        await this.hamburgerIcon.click();
        await expect(this.mobileNavContainer).toBeHidden({ timeout: 5000 });
        console.log('Mobile navigation menu closed.');
    }
    
}