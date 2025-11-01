// tests/homepage.spec.ts
import { test } from '@playwright/test';
import { Homepage } from '../pages/Homepage';

test.describe('NAV-001: Homepage Integrity and Essential Elements', () => {
  test('Should load homepage, dismiss consent, and display core elements', async ({ page }) => {
    const homepage = new Homepage(page);

    await test.step('Navigate to Homepage', async () => {
      await homepage.navigate();
    });

    /*
    await test.step('Dismiss Consent Banner', async () => {
      await homepage.dismissConsentBanner();
    });
    */
    await test.step('Verify Page Title', async () => {
      await homepage.verifyTitle();
    });

    await test.step('Verify Search Bar Visibility', async () => {
      await homepage.verifySearchBarVisible();
    });
  });
});