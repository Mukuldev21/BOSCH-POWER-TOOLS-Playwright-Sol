import { test, expect } from '@playwright/test';
import { Homepage } from '../pages/Homepage';
import { Searchpage } from '../pages/Searchpage';
test.describe('Category B: Product Search Functionality', () => {

    /**
     * Test Case: SEARCH-001
     * Description: Search for a known product name ("GWX10-45E") and verify the Search Results Page (SRP) loads 
     * and displays product results.
     */
    test('SEARCH-001: Should search for a known product and verify the SRP loads with results', async ({ page }) => {
        const homepage = new Homepage(page);
        const searchpage = new Searchpage(page);
        // The test case specifies "GWX10-45E" as a known product example.
        const knownProduct = 'GWX10-45E'; 

        await test.step('Navigate to Homepage and dismiss consent banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });

        await test.step(`Execute search for product: ${knownProduct}`, async () => {
            // The method handles clicking the search button, typing the query, submitting, and verifying the SRP.
            await searchpage.searchForProduct(knownProduct);
        });
        
        // Final verification confirmation
        console.log('Test case SEARCH-001 passed successfully.');
    });
});
