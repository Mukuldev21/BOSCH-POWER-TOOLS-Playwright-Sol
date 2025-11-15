import { test, expect } from '@playwright/test';
import { DealerLocatorPage } from '../pages/DealerLocatorPage';

test.describe('SERVICE-002 Verify the Dealer Locator map loads', () => {
  test('Should display dealers or map after searching by ZIP', async ({ page }) => {
    const locator = new DealerLocatorPage(page);
    await locator.gotoHomepage();
    await locator.openDealerLocator();
    await locator.enterZipAndSubmit('90210');
    await locator.assertDealersOrMapVisible();
  });
});
