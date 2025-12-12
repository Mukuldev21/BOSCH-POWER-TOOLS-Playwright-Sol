import { test, expect } from '@playwright/test';
import { ServicePage } from '../pages/ServicePage';

test.describe('Category: Service & Warranty', () => {

    test('WARRANTY-001: Verify "Product Warranty" page loads and displays warranty categories', async ({ page }) => {
        // Direct navigation to Warranty page
        await page.goto('https://www.boschtools.com/us/en/service/product-warranty/');

        // Verify Title
        await expect(page).toHaveTitle(/Warranty/i);

        // Verify key headers for warranty types exist
        const warrantyTypes = [
            '18V Warranty',
            '12V Warranty',
            'Corded Warranty',
            'Measuring Warranty'
        ];

        for (const type of warrantyTypes) {
            await expect(page.getByRole('link', { name: type, exact: false }).first()).toBeVisible();
        }
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
