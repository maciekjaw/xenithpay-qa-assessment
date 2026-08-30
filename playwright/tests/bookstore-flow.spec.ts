import { test, expect } from '@playwright/test';
import { AccountApi, generateUniqueUserName, CreatedUser } from '../src/api/AccountApi';
import { LoginPage } from '../src/pages/LoginPage';
import { BookStorePage } from '../src/pages/BookStorePage';
import { ProfilePage } from '../src/pages/ProfilePage';

const BOOK_TO_ADD = 'Git Pocket Guide';

const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;
if (!TEST_PASSWORD) {
  throw new Error(
    'TEST_USER_PASSWORD is not set. Copy .env.example to .env and set a password, ' +
    'or set the env var in your CI secrets. Must meet DemoQA rules: min 8 chars, ' +
    'at least one uppercase, one lowercase, one digit, one special character.',
  );
}

test.describe('Book Store — full user flow', () => {
  let user: CreatedUser;
  let accountApi: AccountApi;

  test.beforeAll(async ({ request }) => {
    accountApi = new AccountApi(request);
    const userName = generateUniqueUserName();
    user = await accountApi.setupUser(userName, TEST_PASSWORD);
  });

  test.afterAll(async () => {
    if (user) {
      await accountApi.deleteUser(user.userID, user.token);
    }
  });

  test('user can register, log in, add a book, view it, delete it, and log out', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const bookStore = new BookStorePage(page);
    const profile = new ProfilePage(page);

    // Register is done via API because demoqa.com/register has an
    // intermittent reCAPTCHA that makes UI registration flaky. Login
    // itself — the user-facing behaviour that matters — runs through the UI.
    await test.step('1. Log in with the registered user', async () => {
      await loginPage.goto();
      await loginPage.login(user.userName, user.password);
      await expect(page.getByText(user.userName)).toBeVisible();
    });

    await test.step('2. Search for a book and add it to the collection', async () => {
      await bookStore.goto();
      await bookStore.search(BOOK_TO_ADD);
      await bookStore.openBook(BOOK_TO_ADD);
      await bookStore.addOpenBookToCollection();
    });

    await test.step('3. See the book in the profile collection', async () => {
      await profile.goto();
      await profile.expectBookVisible(BOOK_TO_ADD);
    });

    await test.step('4. Delete the book from the collection', async () => {
      await profile.deleteBook(BOOK_TO_ADD);
    });

    await test.step('5. Log out', async () => {
      await loginPage.logout();
    });
  });
});