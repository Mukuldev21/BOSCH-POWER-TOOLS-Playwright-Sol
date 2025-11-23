const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.boschtools.com/us/en/');
    // Dismiss consent if present
    try {
        const consent = page.getByRole('button', { name: /Accept All|Accept Cookies|OK/i });
        if (await consent.isVisible({ timeout: 3000 })) {
            await consent.click();
        }
    } catch (e) { }
    // Click search button
    const searchBtn = page.getByRole('button', { name: 'Onsite Search', exact: true });
    await searchBtn.waitFor({ state: 'visible', timeout: 5000 });
    await searchBtn.click();
    const searchInput = page.getByRole('combobox', { name: 'Search' });
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill('drill');
    // Wait for suggestions
    const container = page.locator('[class*="searchSuggestion"], [class*="searchResults"], ul[role="listbox"]').first();
    await container.waitFor({ state: 'visible', timeout: 8000 });
    const html = await container.evaluate(node => node.outerHTML);
    console.log('AUTO_SUGGEST_HTML_START');
    console.log(html);
    console.log('AUTO_SUGGEST_HTML_END');
    await browser.close();
})();
