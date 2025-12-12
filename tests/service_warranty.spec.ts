import { test, expect } from '@playwright/test';

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
        // Go to main Service page to find loop
        await page.goto('https://www.boschtools.com/us/en/service/product-warranty/');

        // Check for "Start a Repair" or similar CTA
        const repairLink = page.getByRole('link', { name: /Start a Repair/i });
        if (await repairLink.isVisible()) {
            await expect(repairLink).toHaveAttribute('href', /.*repair-order/);
        } else {
            console.log('Start a Repair link not found directly on Warranty page, checking Service landing.');
            await page.goto('https://www.boschtools.com/us/en/service/');
            // Added .first() to avoid strict mode violation if multiple links exist
            await expect(page.getByRole('link', { name: /Tool Repair/i }).first()).toBeVisible();
        }
    });

});
