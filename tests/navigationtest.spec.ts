import { test, expect, Page } from '@playwright/test';

// Define the base URL to be used in the test
const BASE_URL = 'https://www.boschtools.com/us/en/';
const EXPECTED_TITLE_REGEX = /Bosch Power Tools \| Boschtools/i;

// Helper function to handle cookie or initial pop-up banners
// Note: This locator is a common pattern for cookie consent and may need adjustment 
// based on the specific HTML structure of the banner on the Bosch site.
async function dismissConsentBanner(page: Page) {
    console.log('Attempting to dismiss consent banner...');
    
    // Attempt to locate and click a common 'Accept' or 'OK' button on a banner
    const acceptButton = page.getByRole('button', { name: /Accept All|Accept Cookies|OK/i });
    
    // Wait for the button to appear, or for a maximum of 5 seconds, before timeout
    try {
        await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
        await acceptButton.click();
        console.log('Consent banner dismissed.');
    } catch (error) {
        console.log('No visible consent banner found or timeout reached. Continuing test.');
        // Ignore the error and continue, as the banner might not always be present or visible
    }
}

test.describe('NAV-001: Homepage Integrity and Essential Elements', () => {

    test('Should load the homepage, dismiss consent, and display core elements', async ({ page }) => {
        // Step 1: Navigate to the URL
        await test.step('Navigate to Homepage', async () => {
            await page.goto(BASE_URL);
            await expect(page).toHaveURL(BASE_URL);
        });

        // Step 2: Dismiss any initial cookie/pop-up banners
        await test.step('Dismiss Consent Banner', async () => {
            await dismissConsentBanner(page);
        });

        // Step 3 (Expected Result - Part 1): Page loads successfully and title is correct
        await test.step('Verify Page Title', async () => {
            const pageTitle = await page.title();
            console.log(`Page Title: ${pageTitle}`);
            await expect(page).toHaveTitle(EXPECTED_TITLE_REGEX);
        });

        // Step 3 (Expected Result - Part 2): The main search bar is visible
        await test.step('Verify Main Search Bar Visibility', async () => {
            // Bosch search icon/button is often a magnifying glass. 
            // We look for a common role for the search initiator or the input itself.
            const searchInput = page.getByRole('button', { name: 'Onsite Search', exact: true });
            
            // Wait for the element to be visible and assert its visibility
            await searchInput.waitFor({ state: 'visible' });
            await expect(searchInput).toBeVisible();
            console.log('Main search bar element is visible.');
        });
    });
});
