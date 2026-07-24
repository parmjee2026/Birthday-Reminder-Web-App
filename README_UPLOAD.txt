BIRTHDAY REMINDER FIREBASE FREE v2.0.2 — SDK LOADER FIX

PROBLEM
-------
The login page remained on:
"Loading secure Google sign-in..."

This meant Firebase SDK loading did not finish, so the login button was not
initialized.

FIX
---
- Firebase SDK loading now has a timeout.
- Firebase 12.16.0 is tried first.
- Firebase 10.13.2 is used as a fallback.
- Startup errors are shown on the login card.
- The login button becomes a Retry button if SDK loading fails.
- The page no longer remains silently stuck.

UPLOAD
------
1. Extract this ZIP.
2. Replace all frontend files in the GitHub repository root.
3. Commit changes.
4. Wait for GitHub Pages deployment.
5. Open:
   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=2.0.2
6. Press Ctrl + Shift + R.

SUCCESS MESSAGE
---------------
Google sign-in is ready · Firebase 12.16.0

or:

Google sign-in is ready · Firebase 10.13.2

Then click Continue with Google & Sync Contacts.
