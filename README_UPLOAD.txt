BIRTHDAY REMINDER FIREBASE FREE v2.0.6
FULL-YEAR GOOGLE CONTACTS SYNC

FIXED
-----
The app now performs a complete contact scan instead of relying only on the
initial contact data returned in one response.

FULL-YEAR SYNC NOW
------------------
- Reads every People API page using nextPageToken.
- Scans up to 1000 contacts per page.
- Hydrates every contact through people.getBatchGet in safe batches.
- Reads standard birthday fields.
- Reads birthday-like contact events.
- Supports structured birthday dates and legacy birthday text.
- Counts birthdays month by month.
- Shows contacts scanned, API pages scanned and months containing birthdays.
- Imports all months into the Yearly List.

UPLOAD
------
1. Extract this ZIP.
2. Replace all frontend files in the GitHub repository root.
3. Commit changes.
4. Wait for GitHub Pages deployment.
5. Open:
   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=2.0.6
6. Press Ctrl + Shift + R.

TEST
----
1. Login with the correct Gmail.
2. Click Full Year Sync.
3. Approve read-only Contacts access.
4. Wait until the completion message appears.
5. Open Yearly List.

The dashboard sync box will show:
- total birthday records,
- number of months containing birthdays,
- total contacts scanned,
- total API pages scanned.

NOTE
----
Only birthdays actually saved in Google Contacts can be imported. Google
Calendar events that are not backed by a Google Contact are not People API
contact birthdays.
