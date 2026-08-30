import { Page, Locator, expect } from '@playwright/test';

export class BookStorePage {
  readonly page: Page;
  readonly searchBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder('Type to search');
  }

  async goto(): Promise<void> {
    await this.page.goto('/books');
    await expect(this.searchBox).toBeVisible();
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
  }

  async openBook(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title, exact: true }).click();
    await expect(this.page.getByText(title, { exact: true }).first()).toBeVisible();
  }

  async addOpenBookToCollection(): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.page.getByRole('button', { name: 'Add To Your Collection' }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Book added to your collection');
    await dialog.accept();
  }
}