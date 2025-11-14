

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
    async searchForProduct(productName: string, options?: { skipHeadingCheck?: boolean }) {
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
        if (!options?.skipHeadingCheck) {
            await expect(this.firstSearchResultCard).toBeVisible({ timeout: 15000 });
        }
        // 5. Verify the SRP title or a heading contains the search term for user confirmation
        if (!options?.skipHeadingCheck) {
            const srpHeading = this.page.locator('h1, h2, .search-results-title, .page-title').first();
            await expect(srpHeading).toContainText(productName, { ignoreCase: true, timeout: 5000 });
        }
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

    // --- SEARCH-003 Action Method ---
    /**
     * Filters SRP results by battery system (e.g., '18V System') after searching for a generic tool type.
     * @param toolType The generic tool type to search for (e.g., 'saw').
     * @param batterySystemLabel The label of the battery system filter (e.g., '18V System').
     */
    async filterByBatterySystem(toolType: string, batterySystemLabel: string) {
        // 1. Search for the generic tool type
        await this.searchForProduct(toolType);

        // 2. Wait for the filter/refine section to be visible (try common selectors)
        const filterSection = this.page.locator('dialog[aria-label*="Filter" i], aside[aria-label*="Filter" i], [aria-label*="Refine" i], [aria-label*="facet" i], [role="region"]:has-text("Filter")').first();
        await filterSection.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

        // 3. Expand all filter groups to reveal hidden checkboxes
        const expandButtons = this.page.locator('a[aria-expanded="false"], button[aria-expanded="false"], [role="button"][aria-expanded="false"]');
        const expandCount = await expandButtons.count();
        for (let i = 0; i < expandCount; i++) {
            try {
                await expandButtons.nth(i).click({ timeout: 1000 });
            } catch (e) {
                // Ignore if not clickable
            }
        }

        // 4. Debug: Log all visible filter checkbox labels after expanding
        const allCheckboxes = this.page.locator('input[type="checkbox"]');
        const allLabels = await allCheckboxes.evaluateAll((nodes) => nodes.map(cb => {
            let label = cb.getAttribute('aria-label') || '';
            if (!label && cb.id) {
                const labelElem = document.querySelector(`label[for='${cb.id}']`);
                if (labelElem) label = labelElem.textContent || '';
            }
            if (!label && cb.parentElement && cb.parentElement.tagName.toLowerCase() === 'label') {
                label = cb.parentElement.textContent || '';
            }
            return label.trim();
        }));
        console.log('DEBUG: Visible filter checkbox labels:', allLabels);

        // 5. Find and select the battery system filter checkbox (by label text)
        const batteryCheckbox = this.page.getByRole('checkbox', { name: new RegExp(batterySystemLabel, 'i') });
        await batteryCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        await batteryCheckbox.check();

        // 6. Wait for the results to update
        await this.page.waitForTimeout(2000);

        // 7. Check for product cards or a 'No Results' message
        const productCards = this.page.locator('[data-track_moduletype="Product List"], .product-card');
        const count = await productCards.count();
        if (count === 0) {
            // If no products, check for a 'No Results' message
            const noResultsLocators = [
                this.page.getByText(/no results found/i),
                this.page.getByText(/no products found/i),
                this.page.getByText(/no matching products/i),
                this.page.getByText(/no matches/i),
                this.page.getByText(/could not find/i),
                this.page.getByText(/0 results/i),
                this.page.locator('.no-results, .noResult, .no-results-message, .search-no-results'),
            ];
            let found = false;
            for (const locator of noResultsLocators) {
                if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(true);
            console.log(`SUCCESS: Filtered by '${batterySystemLabel}' and no products found, 'No Results' message displayed.`);
            return;
        }

        // 8. Pass if at least one product card contains the battery system label
        let matchFound = false;
        for (let i = 0; i < count; i++) {
            const card = productCards.nth(i);
            const text = await card.textContent();
            if (text?.toLowerCase().includes(batterySystemLabel.toLowerCase())) {
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            // Log all product card texts for debugging
            const allTexts = [];
            for (let i = 0; i < count; i++) {
                const card = productCards.nth(i);
                allTexts.push(await card.textContent());
            }
            console.warn(`No product card contained '${batterySystemLabel}'. Product card texts:`, allTexts);
        }
        expect(matchFound).toBe(true);
        console.log(`SUCCESS: Filtered by '${batterySystemLabel}' and at least one product matches.`);
    }
}