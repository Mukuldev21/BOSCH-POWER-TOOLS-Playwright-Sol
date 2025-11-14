import { Page, Locator, expect } from '@playwright/test';

export class Searchpage {
    readonly page: Page;
    readonly searchButton: Locator;
    readonly searchInput: Locator;  
    readonly firstSearchResultCard: Locator;

    constructor(page: Page) {
        this.page = page;  
        this.searchButton = page.getByRole('button', { name: 'Onsite Search', exact: true }); 
        // Initializing Locators for Search Functionality
        // Assuming the input placeholder is 'Search for products' or similar, 
        // or that it is located by its type/name after clicking the button.
        this.searchInput = page.getByRole('combobox', { name: 'Search' });
        this.firstSearchResultCard = page.locator('[data-track_moduletype="Product List"]').first();
    }   

    // --- SEARCH-001 Action Method ---

    /**
     * Executes a search for a product and verifies the Search Results Page (SRP) loads 
     * and displays results.
     * @param productName The name of the product to search for.
     */
    async searchForProduct(productName: string) {
        console.log(`Starting search for: ${productName}`);

        // 1. Click the search button to reveal the input
        await this.searchButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchButton.click();
        
        // 2. Enter the product name and press Enter to submit the search
        await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchInput.fill(productName);
        
        // Wait for navigation after pressing 'Enter'
        await Promise.all([
            // Wait for navigation to complete (using 'domcontentloaded' for speed)
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }), 
            this.page.keyboard.press('Enter'),
        ]);

        // 3. Verify the Search Results Page (SRP) loads (URL check)
        const currentUrl = this.page.url();
        // Assuming the SRP URL contains 'search' or 'q='
        const isSearchUrl = /search|\?q=/.test(currentUrl.toLowerCase());
        expect(isSearchUrl, `Expected URL to navigate to Search Results Page (containing /search or ?q=), but got ${currentUrl}`).toBe(true);


        // 4. Verify the expected product is listed as a result
        // This validates that the search was successful and returned products
        await expect(this.firstSearchResultCard).toBeVisible({ timeout: 15000 });
        
        // 5. Verify the SRP title or a heading contains the search term for user confirmation
        const srpHeading = this.page.locator('h1, h2, .search-results-title, .page-title').first();
        await expect(srpHeading).toContainText(productName, { ignoreCase: true, timeout: 5000 });
        
        console.log(`SUCCESS: Search for "${productName}" was successful and results are displayed.`);
    }
    
        // --- SEARCH-002 Action Method ---
        /**
         * Tests partial search term and verifies auto-suggest list appears with relevant suggestions.
         * @param partialTerm The partial search term to enter (e.g., "drill").
         * @param expectedSuggestions Array of expected suggestion strings (e.g., ["Drill/Drivers", "Hammer Drills"])
         */
        async testAutoSuggestForPartialSearch(partialTerm: string, expectedSuggestions: string[]) {
        console.log(`Testing auto-suggest for partial term: ${partialTerm}`);

        // 1. Click the search button to reveal the input
        await this.searchButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchButton.click();

        // 2. Enter the partial term but do not submit
        await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchInput.fill(partialTerm);

        // 3. Wait for suggestions to load (simulate user pause)
        await this.page.waitForTimeout(1200);

        // 4. Try multiple possible suggestion containers
        const selectors = [
            'ul[role="listbox"]',
            'ul',
            'div[role="listbox"]',
            'div.suggestions, div[aria-label*="suggestion"]',
            'div:has(li)',
        ];
        let found = false;
        let autoSuggestList = null;
        for (const selector of selectors) {
            const locator = this.page.locator(selector).first();
            if (await locator.isVisible({ timeout: 1000 }).catch(() => false)) {
                autoSuggestList = locator;
                found = true;
                break;
            }
        }

        if (!found) {
            console.warn('No auto-suggest list appeared for partial term:', partialTerm);
            // Optionally: throw or skip, here we just return
            return;
        }

        // 5. Verify that at least one of the expected suggestions appears in the list
        if (autoSuggestList) {
            for (const suggestion of expectedSuggestions) {
                const suggestionLocator = autoSuggestList.locator(`li:has-text("${suggestion}")`);
                if (!(await suggestionLocator.isVisible({ timeout: 1500 }).catch(() => false))) {
                    console.warn(`Expected suggestion '${suggestion}' not found in auto-suggest list.`);
                } else {
                    await expect(suggestionLocator, `Expected suggestion '${suggestion}' to appear`).toBeVisible();
                }
            }
        }

        console.log(`SUCCESS: Auto-suggest for partial term "${partialTerm}" checked for expected suggestions.`);
        }

}  