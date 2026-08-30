import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly userNameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameField = page.getByPlaceholder('UserName');
    this.passwordField = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(userName: string, password: string): Promise<void> {
    await this.userNameField.fill(userName);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await expect(this.logoutButton).toBeVisible({ timeout: 15_000 });
    await expect(this.page).toHaveURL(/.*\/profile/);
  }
  
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/.*\/login/)
    await expect(this.loginButton).toBeVisible();
  }
}