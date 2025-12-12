import { test, expect } from '@playwright/test';
import { DealerLocatorPage } from '../pages/DealerLocatorPage';

test.describe('📍 Store Locator', () => {
    test('STORE-001: Verify "Where to Buy" page loads and map container is present', async ({ page }) => {
        const dealerPage = new DealerLocatorPage(page);

        // 1. Navigate to Homepage
        await dealerPage.gotoHomepage();

        // 2. Open Dealer Locator
        await dealerPage.openDealerLocator();

        // 3. Verify Page Loaded and Map/List is present
        await dealerPage.verifyStoreLocatorLoaded();
    });
});
