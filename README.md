# Birthday Reminder Web App v1.1

Professional dashboard, advanced search and filters, Wish Status tracking,
and a WhatsApp message generator for Birthday Reminder System v4.3.

## What is new in v1.1

### Professional dashboard

- Full-width responsive desktop layout
- Four summary cards:
  - Total Birthdays
  - Today
  - Next reminder period
  - This Month
- Detailed Next Birthday card
- Upcoming Birthdays table
- Today's Birthdays panel
- Upcoming six-month birthday chart
- Missed-wish count

### Smart search and filters

One search field searches:

- Name
- Relation
- Birthday month
- Gender
- Mobile number
- WhatsApp number
- Email
- Wish Status

Quick filters:

- All
- Today
- Upcoming
- This Month
- Next Month
- Missed

Additional filters:

- Gender
- Wish Status

### Wish Status

The app tracks birthday wishes separately for each birthday year:

- Pending
- Sent
- Skipped
- Missed

A new Google Sheet tab named `Wish History` is created automatically.
Existing Birthday data is not modified.

### WhatsApp message generator

- Creates a message from the saved template
- Supports placeholders:
  - `{name}`
  - `{date}`
  - `{age}`
  - `{relation}`
- Copy Message
- Open WhatsApp
- Mark Sent
- Mark Skipped

The WhatsApp button prepares a message. The user still presses Send inside
WhatsApp.

---

# Upgrade from Web App v1.0

## Part 1 — Replace the Apps Script API

1. Open the Birthday Reminder Google Sheet.
2. Open `Extensions > Apps Script`.
3. Open the existing Web API file. It may currently be named:
   - `09_WebApp.gs`, or
   - `09_WebAppApi.gs`
4. Delete its complete old contents.
5. Paste the complete contents of:

   `apps-script/09_WebAppApi.gs`

6. Save the Apps Script project.

You do not need to replace files 01–08.

Your existing `BIRTHDAY_WEB_API_KEY` Script Property remains valid.

### API key setup

If the key is already saved in Script Properties, do not change it.

For a new project, either:

- Add this Script Property manually:

  Property:
  `BIRTHDAY_WEB_API_KEY`

  Value:
  your own private key of at least 10 characters

or run:

`configureBirthdayWebApi`

The v1.1 function no longer opens a prompt. It generates a private key and
prints it in the Execution Log. It does not replace an existing key.

## Part 2 — Redeploy the Apps Script Web App

Saving code is not enough for an existing deployment.

1. Open `Deploy > Manage deployments`.
2. Click the Edit pencil on the Web App deployment.
3. Under Version, choose `New version`.
4. Click `Deploy`.
5. Keep the same `/exec` URL.

Recommended deployment settings:

- Execute as: `Me`
- Who has access: `Anyone`

The private API key protects the API actions.

## Part 3 — Replace GitHub Pages files

Upload the complete contents inside the `github-pages` folder to the root of
the existing GitHub repository.

Replace:

- `index.html`
- `404.html`
- `manifest.webmanifest`
- `sw.js`
- `assets/style.css`
- `js/app.js`
- icons if requested by GitHub

Do not upload the outer `github-pages` folder as a nested folder. Its contents
must be at the repository root.

## Part 4 — Refresh the installed app

The Service Worker cache name changed in v1.1.

After GitHub Pages finishes deploying:

1. Open the GitHub Pages URL.
2. Press `Ctrl + Shift + R` on desktop.

For an installed mobile PWA that still shows the old interface:

1. Close the app.
2. Open the GitHub Pages URL in Chrome.
3. Refresh it.
4. Reopen or reinstall the PWA if required.

The app uses the same browser storage key as v1.0, so the saved Apps Script
URL, access key and settings should remain available.

---

# Files

## GitHub Pages frontend

`github-pages/`

## Apps Script backend

`apps-script/09_WebAppApi.gs`

---

# Important behaviour

## Missed filter

A birthday is considered Missed when:

- its birthday date in the current year has passed, and
- its Wish Status is still Pending.

Marking it Sent or Skipped removes it from the Missed filter.

## Wish History

The backend creates this sheet automatically:

`Wish History`

Columns:

- Record ID
- Birthday Year
- Status
- Channel
- Message
- Updated At

## Calendar birthdays

Calendar-imported birthdays can be viewed and wished from the Web App.
Their source birthday should still be managed in Google Calendar.

## Security

- Never commit the private API key into GitHub files.
- The key is stored in Apps Script Script Properties and browser local storage.
- This access-key model is suitable for a private/small-team app.
- A public multi-user product should use full user authentication.
