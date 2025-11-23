import { Page, Locator, expect } from '@playwright/test';

export class Searchpage {
    readonly page: Page;
    readonly searchButton: Locator;
    readonly searchInput: Locator;  
    readonly firstSearchResultCard: Locator;

    readonly autoSuggestContainer: Locator;
    readonly autoSuggestItems: Locator; 

    constructor(page: Page) {
        this.page = page;  
        this.searchButton = page.getByRole('button', { name: 'Onsite Search', exact: true }); 
        // Initializing Locators for Search Functionality
        // Assuming the input placeholder is 'Search for products' or similar, 
        // or that it is located by its type/name after clicking the button.
        this.searchInput = page.getByRole('combobox', { name: 'Search' });
        this.firstSearchResultCard = page.locator('[data-track_moduletype="Product List"]').first();

        // Locators for Auto-Suggest Feature
        this.autoSuggestContainer = page.locator('[class*="searchResults"], [class*="searchSuggestion"], ul[role="listbox"]');
        this.autoSuggestItems = this.autoSuggestContainer.locator('a, li');
          
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
     * Tests the auto-suggest feature by entering a partial product name and verifying suggestions appear.
     * @param partialProductName The partial name of the product to trigger auto-suggestions.
     */
    async verifyAutoSuggest(partialProductName: string, expectedSuggestions?: string[]) {
        console.log(`Testing auto-suggest with input: ${partialProductName}`); 
        
        // 1. Click the search button to reveal the input
        await this.searchButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchButton.click(); 

    
        
        // 2. Enter the partial product name
        await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.searchInput.fill(partialProductName);
        
        
        // 3. Verify that the auto-suggest container appears
        await this.autoSuggestContainer.waitFor({ state: 'visible', timeout: 7000 });
        await expect(this.autoSuggestContainer).toBeVisible();
        
        

        // 4. Verify that at least one suggestion is listed
        const suggestionCount = await this.autoSuggestItems.count();
        expect(suggestionCount, 'Expected at least one auto-suggest item to be displayed').toBeGreaterThan(0);

        // 5. Check for specific suggestions if provided
        if (expectedSuggestions && expectedSuggestions.length > 0) {
            for (const suggestion of expectedSuggestions) {
                // Check if the suggestion container contains the expected text
                await expect(this.autoSuggestContainer).toContainText(suggestion, { ignoreCase: true, timeout: 3000 });
                console.log(`- Verified expected suggestion: "${suggestion}" is present.`);
            }
        }

        console.log(`SUCCESS: Auto-suggest displayed ${suggestionCount} items for input "${partialProductName}".`);
    }

}  