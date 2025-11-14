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
     * Description: Test partial search term and auto-suggest (if applicable).
     * Steps:
     *   1. Enter "drill" into the search bar, but do not submit.
     *   2. Wait for auto-suggest to appear.
     * Expected: The auto-suggest list appears with relevant suggestions (e.g., "Drill/Drivers", "Hammer Drills").
     */
    test('SEARCH-002: Should show auto-suggest for partial search term', async ({ page }) => {
        const homepage = new Homepage(page);
        const searchpage = new Searchpage(page);
        const partialTerm = 'drill';
        const expectedSuggestions = ['Drill/Drivers', 'Hammer Drills'];

        await test.step('Navigate to Homepage and dismiss consent banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });

        await test.step(`Enter partial search term: ${partialTerm} and verify auto-suggest`, async () => {
            await searchpage.testAutoSuggestForPartialSearch(partialTerm, expectedSuggestions);
        });

        console.log('Test case SEARCH-002 passed successfully.');
    });
    /**
     * Test Case: SEARCH-003
     * Description: Verify filtering by battery system on SRP.
     * Steps:
     *   1. Search for a generic tool type (e.g., "saw") that yields multiple results.
     *   2. Locate the "Filter" or "Refine" section.
     *   3. Select the filter for "18V System."
     *   4. Apply the filter.
     * Expected: The list of products updates, and only products matching the "18V System" criteria are displayed.
     */
    const batterySystemLabels = [
        '18V Drill/Drivers',
        '18V Hammer Drill/Drivers',
        '12V Max Drill/Drivers',
        'Cordless Drill/Drivers',
        'Cordless Hammer Drill/Drivers',
    ];

    for (const batterySystemLabel of batterySystemLabels) {
        test(`SEARCH-003: Should filter by battery system '${batterySystemLabel}' on SRP`, async ({ page }) => {
            const homepage = new Homepage(page);
            const searchpage = new Searchpage(page);
            const toolType = 'drill';

            await test.step('Navigate to Homepage and dismiss consent banner', async () => {
                await homepage.navigate();
                await homepage.dismissConsentBanner();
            });

            await test.step(`Search for tool type: ${toolType} and filter by battery system: ${batterySystemLabel}`, async () => {
                await searchpage.filterByBatterySystem(toolType, batterySystemLabel);
            });

            console.log(`Test case SEARCH-003 passed for battery system: ${batterySystemLabel}`);
        });
    }

     /**
     * Test Case: SEARCH-004
     * Description: Search for a non-existent product and verify the SRP displays a 'No Results Found' message or error state.
     * Steps:
     *   1. Search for a unique, fictional product code (e.g., "XYZ-999-BOSCH").
     *   2. Verify the SRP displays a 'No Results Found' message or relevant error state.
     */
    test('SEARCH-004: Should show "No Results Found" for a non-existent product', async ({ page }) => {
        const homepage = new Homepage(page);
        const searchpage = new Searchpage(page);
        const nonExistentProduct = 'XYZ-999-BOSCH';

                await homepage.navigate();
                await homepage.dismissConsentBanner();
                await searchpage.searchForProduct(nonExistentProduct, { skipHeadingCheck: true });
                // Pass if 'No Results Found' message is visible
                if (await page.locator('text=No Results Found').first().isVisible().catch(() => false)) return;
                // Pass if there are zero product cards
                if ((await page.locator('[data-testid="product-card"]').count()) === 0) return;
                // Pass if 'Products (0)' tab is present (no products, only fallback)
                const productsTab = page.locator('a:has-text("Products")').first();
                if (await productsTab.isVisible()) {
                    const tabText = await productsTab.textContent();
                    if (tabText && /Products\s*\(0\)/.test(tabText)) return;
                }
                // Otherwise, fail
                expect(false).toBe(true);
    });
});
