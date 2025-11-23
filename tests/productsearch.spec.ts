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

     /**
     * Test Case: SEARCH-002
     * Description: Enter a partial search term ("drill") and verify the auto-suggest dropdown 
     * appears with relevant suggestions.
     */
    /*
    test('SEARCH-002: Should display auto-suggest list with relevant results for partial term', async ({page}) => {
        const homepage = new Homepage(page);
        const searchpage = new Searchpage(page);
        const partialTerm = 'drill';
        await test.step('Navigate to Homepage and dismiss consent banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });

        await test.step(`Enter partial search term: ${partialTerm} and verify auto-suggest`, async () => {
            await searchpage.testAutoSuggest(partialTerm);
        });
        console.log('Test case SEARCH-002 passed successfully.');
    }); */

     test('SEARCH-002: Should display auto-suggest list with relevant results for partial term', async ({page}) => {
        const partialTerm = 'drill';
        const homepage = new Homepage(page);
        const searchPage = new Searchpage(page);
        // These are common and relevant suggestions expected for "drill"
        const expectedSuggestions = [
            'Drill/Drivers', 
            'Hammer Drills', 
            'Cordless Drills' 
        ];
        await test.step('Navigate to Homepage and dismiss consent banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });
        

        await test.step(`Verify auto-suggest for partial term: ${partialTerm}`, async () => {
            // Updated method name to verifyAutoSuggest
            await searchPage.verifyAutoSuggest(partialTerm, expectedSuggestions);
        });
    });


});
