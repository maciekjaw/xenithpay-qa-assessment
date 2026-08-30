import { Page, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
  }

  async expectBookVisible(title: string): Promise<void> {
    await expect(
      this.page.getByRole('link', { name: title, exact: true }),
    ).toBeVisible();
  }

  async expectBookAbsent(title: string): Promise<void> {
    await expect(
      this.page.getByRole('link', { name: title, exact: true }),
    ).toBeHidden();
  }

  async deleteBook(title: string): Promise<void> {
    const row = this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('link', { name: title, exact: true }) });
    await row.getByTitle('Delete').click();
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.page.getByRole('button', { name: 'OK', exact: true }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Book deleted');
    await dialog.accept();
    await this.expectBookAbsent(title);
  }
}