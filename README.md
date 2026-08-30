### Register via API, login via UI (Playwright)

demoqa.com's `/register` page has reCAPTCHA. Automating past it is either
flaky (bot-detection triggers randomly) or requires a paid solver — neither
is acceptable in CI. This is a well-known DemoQA limitation, publicly
documented in other Playwright + DemoQA projects.

The pattern used here — **API for test setup, UI for the behaviour that
matters** — is standard in professional test automation. It keeps tests
deterministic while still verifying the user-facing flow through the UI.

## Running locally

Both suites require the `TEST_USER_PASSWORD` environment variable. There is
no hardcoded fallback anywhere in the code — passwords must never live in
git, so the tests fail loudly at startup if it's missing.

The password must meet DemoQA's rules: min 8 characters, at least one
uppercase, one lowercase, one digit, and one special character. You can use
the example password below or set your own, as long as it meets these rules.

### Playwright

```bash
npm install
npx playwright install --with-deps
cp .env.example .env         # copy the template, then open .env and set your own password
npm test                     # run tests
npm run test:headed          # run tests in headed mode
npm run test:ui              # Playwright's interactive UI mode
npm run report                # open the last HTML report
```

### Karate

```bash
cd karate
mvn test -DtestPassword="YourStr0ng!Pass"
```

Report at `target/karate-reports/karate-summary.html`

In CI both suites read the password from a `TEST_USER_PASSWORD` repository
secret. Set it once in GitHub Actions settings and both jobs will pick it up.

## What CI produces

Every run uploads:

- **Playwright HTML reports** — one per browser, with screenshots, videos,
  and full traces on any failure. You can debug a red CI run without
  re-running locally.
- **Karate summary report** — request/response for every step, JSON
  matches, and timing.

Reports are retained for 14 days per run and downloadable from the GitHub
Actions run page.