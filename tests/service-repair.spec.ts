import { test, expect } from '@playwright/test';
import { ServicePage } from '../pages/ServicePage';

test.describe('🛠️ Service & Support', () => {
  test('should navigate to Tool Repair page from Service/Support section', async ({ page }) => {
    const service = new ServicePage(page);
    await service.gotoHomepage();
    await service.openServiceOrSupportMenu();
    await service.clickToolRepairOrOnlineRepair();
    await service.assertRepairPageLoaded();
  });
});
