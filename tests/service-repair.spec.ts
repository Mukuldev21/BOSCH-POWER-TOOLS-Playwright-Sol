import { test, expect } from '@playwright/test';
import { ServicePage } from '../pages/ServicePage';

test.describe('SERVICE-001 Verify the Tool Repair landing page is accessible', () => {
  test('should navigate to Tool Repair page from Service/Support section', async ({ page }) => {
    const service = new ServicePage(page);
    await service.gotoHomepage();
    await service.openServiceOrSupportMenu();
    await service.clickToolRepairOrOnlineRepair();
    await service.assertRepairPageLoaded();
  });
});
