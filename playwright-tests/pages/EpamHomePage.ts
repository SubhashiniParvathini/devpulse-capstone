import { Page, Locator, expect } from '@playwright/test';

export class EpamHomePage {
  readonly page: Page;
  readonly hamburgerMenuButton: Locator;
  readonly menuDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hamburgerMenuButton = page.locator('button.hamburger-menu__button');
    this.menuDropdown = page.locator('.hamburger-menu__dropdown');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.epam.com/');
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.hamburgerMenuButton).toBeVisible({ timeout: 15000 });
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerMenuButton.click();
  }
}