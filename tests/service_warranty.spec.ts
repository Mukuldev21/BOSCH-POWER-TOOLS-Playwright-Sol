import { test, expect } from '@playwright/test';
import { ServicePage } from '../pages/ServicePage';

test.describe('🛡️ Warranty & Manuals', () => {

    test('WARRANTY-001: Verify "Product Warranty" page loads and displays warranty categories', async ({ page }) => {
        // Use the ServicePage object
        const servicePage = new ServicePage(page);

        // Direct navigation to Warranty page
        await page.goto('https://www.boschtools.com/us/en/service/product-warranty/');

        // Verify using page method
        await servicePage.verifyWarrantyPageLoaded();
    });

    test('MANUAL-001: Verify "Manuals and Part Diagrams" page is accessible', async ({ page }) => {
        await page.goto('https://www.boschtools.com/us/en/service/manuals-and-part-diagrams/');

        await expect(page).toHaveTitle(/Manuals|Parts/i);
        await expect(page.locator('h1')).toContainText('Manuals and Part Diagrams');
    });

    test('REPAIR-001: Verify "Start a Repair" link points to repair order page', async ({ page }) => {
        // Use the ServicePage object for modularity
        const servicePage = new ServicePage(page);

        // Go to main Service page to find loop
        await page.goto('https://www.boschtools.com/us/en/service/product-warranty/');

        // Verify using the Page Class method
        await servicePage.verifyStartRepairLink();
    });

});
