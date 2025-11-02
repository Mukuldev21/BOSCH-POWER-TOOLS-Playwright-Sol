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

}  