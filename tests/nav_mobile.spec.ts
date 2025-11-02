import { test, devices } from '@playwright/test';
import { Homepage } from '../pages/Homepage';

// Use Playwright's device emulation for mobile viewport (e.g., 'iPhone 13')
test.use({ 
    viewport: devices['iPhone 13'].viewport,
    userAgent: devices['iPhone 13'].userAgent,
});

test.describe('NAV-004: Mobile Responsiveness and Navigation', () => {
    test('Should verify the Hamburger Menu opens and reveals navigation links', async ({ page }) => {
        const homepage = new Homepage(page);

        await test.step('Navigate to Homepage and dismiss banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });

        await test.step('Verify and click the Hamburger Menu', async () => {
            await homepage.verifyMobileMenu();
        });
    });
});
