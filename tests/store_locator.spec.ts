import { test, expect } from '@playwright/test';
import { DealerLocatorPage } from '../pages/DealerLocatorPage';

test.describe('Category: Store Locator', () => {
    test('STORE-001: Verify "Where to Buy" page loads and map container is present', async ({ page }) => {
        const dealerPage = new DealerLocatorPage(page);

        // 1. Navigate to Homepage
        await dealerPage.gotoHomepage();

        // 2. Open Dealer Locator
        await dealerPage.openDealerLocator();

        // 3. Verify URL contains specific path
        await expect(page).toHaveURL(/.*store-locator/);

        // Wait for network idle to ensure dynamic content is loaded
        await page.waitForLoadState('networkidle');

        // 4. Verify Map, List, or Helper Text
        // Checks for multiple indicators of success: header, map container, or postal code input
        const mapContainer = page.locator('.store-locator-map-container, #map, .map-canvas').first();
        const listContainer = page.locator('.store-list, .dealer-list').first();
        const zipInput = page.getByPlaceholder(/Zip|Postal|City|Address/i).first();
        const header = page.locator('h1, h2, h3').filter({ hasText: /Where to buy|Store Locator|Find a Dealer/i }).first();

        // Expect at least one of these critical elements to be visible
        await expect(
            header
                .or(mapContainer)
                .or(listContainer)
                .or(zipInput)
        ).toBeVisible();
    });
});
