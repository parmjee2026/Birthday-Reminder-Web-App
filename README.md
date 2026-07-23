# Birthday Reminder Web App v1.2

This update focuses on dashboard consistency and daily usability.

## Fixed

### Upcoming Birthdays consistency

- `Next Birthday` can show the next birthday even when it is outside the
  short reminder period.
- The dashboard Upcoming Birthdays table now explicitly shows birthdays
  within the next **30 days**.
- The top `Next 7 Days` card continues to use the configurable Reminder Days
  setting.

Example:

- Next Birthday: 28 days away
- Next 7 Days KPI: 0
- Upcoming 30 Days table: contains that birthday

### Past-wish wording

The unclear `20 missed` badge was removed from Today's Birthdays.

A new actionable KPI is shown:

`Past Wishes Pending`

Clicking it opens the Birthdays page with the Missed filter selected.

### Age and relation

- Known DOB: age is calculated automatically.
- Unknown birth year: shows `Age: —`.
- Empty relation is hidden.
- Available relation is shown as a compact badge.

### Empty states

Upcoming Birthdays now shows:

`🎉 You're all caught up!`

`No birthdays in the next 30 days.`

## New dashboard metrics

The main KPI row remains:

- Total Birthdays
- Today
- Next reminder period
- This Month

A compact analytics row adds:

- Upcoming 30 Days
- Average / Month
- Wishes Sent Today
- Past Wishes Pending

`This Year` was not added because, in a birthday directory, it normally
duplicates Total Birthdays.

## Search

A global search box is available in the desktop header.

It searches:

- Name
- Relation
- Month
- Mobile
- WhatsApp
- Email
- Gender
- Wish Status

## Chart interaction

- Hover/focus tooltip
- Click a month to open the Birthdays page filtered by that month

## Dark mode

Use the moon/sun button in the header.
The selection is saved in the browser.

## Notifications and sync

Settings now includes:

- Enable Browser Alerts
- Sync Google Calendar
- Send Email Digest Now

Browser alerts work while the app is being used. Reliable notifications while
the browser is completely closed require a push-notification service.

---

# Update instructions

## 1. Replace Apps Script backend

Replace the complete existing Web API code with:

`apps-script/09_WebAppApi.gs`

Then:

1. Save.
2. Open Deploy > Manage deployments.
3. Edit the deployment.
4. Select New version.
5. Deploy.

The `/exec` URL and existing private API key remain unchanged.

## 2. Replace GitHub Pages frontend

For the easiest update, use:

`Birthday_Reminder_GitHub_Pages_v1.2_Flat.zip`

Delete the old frontend files from the GitHub repository root and upload all
files from the flat package directly to the root.

## 3. Refresh

After GitHub Pages deploys:

- Open the site with `?v=1.2`
- Press Ctrl + Shift + R
- Reopen the installed PWA if necessary
