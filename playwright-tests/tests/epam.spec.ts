import { test, expect } from '@playwright/test';
import { EpamHomePage } from '../pages/EpamHomePage'; // Imports the Page Object [playwright.dev]

test.describe.configure({ 
  mode: 'parallel',
  retries: 1,
  timeout: 20000
});

test.describe('EPAM Homepage Tests', () => {
  let epamHome: EpamHomePage; 

  test.beforeEach(async ({ page, context }) => {
    // Bypass automation detection
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // Set standard desktop User-Agent
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    epamHome = new EpamHomePage(page); // Initialize the Page Object [playwright.dev]
    await epamHome.navigate();
    await epamHome.waitForPageLoad();
  });

  test('Test case #1: Verify the page title', async ({ page }) => {
    await expect(page).toHaveTitle('EPAM | Software Engineering & Product Development Services');
  });

  test('Test case #2: Verify the opening of burger menu', async () => {
    await epamHome.openHamburgerMenu();
    await expect(epamHome.menuDropdown).toBeVisible();
  });
});