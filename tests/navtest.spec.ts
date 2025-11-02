// tests/homepage.spec.ts
import { test } from '@playwright/test';
import { Homepage } from '../pages/Homepage';

/*
test.describe('Category A: Site Integrity and Navigation (Smoke)', () => {
  test('Should load homepage, dismiss consent, and display core elements', async ({ page }) => {
    const homepage = new Homepage(page);

    await test.step('Navigate to Homepage', async () => {
      await homepage.navigate();
    });

    /*
    await test.step('Dismiss Consent Banner', async () => {
      await homepage.dismissConsentBanner();
    });
    
    await test.step('Verify Page Title', async () => {
      await homepage.verifyTitle();
    });

    await test.step('Verify Search Bar Visibility', async () => {
      await homepage.verifySearchBarVisible();
    });
  });
  */

   test.describe('Category A: Site Integrity and Navigation (Smoke)', () => {
    
    // NAV-001: Verify Homepage loads and essential elements are present.
    test('NAV-001: Should load homepage, dismiss consent, and display core elements', async ({ page }) => {
        const homepage = new Homepage(page);

        await test.step('1. Navigate to Homepage', async () => {
            await homepage.navigate();
        });

        await test.step('2. Dismiss Consent Banner', async () => {
            // This is crucial for consistent subsequent tests
            await homepage.dismissConsentBanner();
        });
        
        // 3. Expected Result checks
        await test.step('3a. Verify Page Title', async () => {
            await homepage.verifyTitle();
        });

        await test.step('3b. Verify Search Bar Visibility', async () => {
            await homepage.verifySearchBarVisible();
        });
    });


  // NAV-002: Verify main product category links are functional.
    test('NAV-002: Verify main product category links are functional', async ({ page }) => {
        const homepage = new Homepage(page);

        // Precondition: Ensure we are on the homepage and ready
        await test.step('Precondition: Navigate to Homepage and dismiss banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });

        // Test Step 1: Click "Power Tools" and verify URL
        await test.step('1. Click "Power Tools" link and verify page loads', async () => {
            await homepage.clickAndVerifyCategoryLink(homepage.powerToolsLink, 'power-tools');
        });

        // Test Step 2: Click "Accessories" and verify URL
        await test.step('2. Click "Accessories" link and verify page loads', async () => {
            await homepage.clickAndVerifyCategoryLink(homepage.accessoriesLink, 'accessories');
        });

        // Test Step 3: Click "Measuring Tools" and verify URL
        await test.step('3. Click "Measuring Tools" link and verify page loads', async () => {
            await homepage.clickAndVerifyCategoryLink(homepage.measuringToolsLink, 'measuring-and-layout-tools');
        });

        // NEW Step 4: Click "Hand Tools" link
    await test.step('4. Click "Hand Tools" link and verify page loads', async () => {
      await homepage.clickAndVerifyCategoryLink(homepage.handToolsLink, 'hand-tools');
    });

    // NEW Step 5: Click "Service" link
    await test.step('5. Click "Service" link and verify page loads', async () => {
      await homepage.clickAndVerifyCategoryLink(homepage.serviceLink, 'service');
    });
    // NEW Step 6: Click "Trade Solutions" link
    await test.step('6. Click "Trade Solutions" link and verify page loads', async () => {
      await homepage.clickAndVerifyCategoryLink(homepage.tradeSolutionsLink, 'trade-solutions');  
    });
    // NEW Step 7: Click "New Products" link
    await test.step('7. Click "New Products" link and verify page loads', async () => {
      await homepage.clickAndVerifyCategoryLink(homepage.newProductsLink, 'new-products');  
    });
  });

  // NAV-003: Verify all footer links return HTTP 200 status.
    test('NAV-003: Verify all footer links return HTTP 200 status', async ({ page }) => {
        const homepage = new Homepage(page);

        // Precondition: Ensure we are on the homepage and ready
        await test.step('Precondition: Navigate to Homepage and dismiss banner', async () => {
            await homepage.navigate();
            await homepage.dismissConsentBanner();
        });
        // Test Step: Verify footer links
        await test.step('1. Verify all footer links return HTTP 200 status', async () => {
            await homepage.verifyFooterLinks();
        });
    });
    
});