BIRTHDAY REMINDER FIREBASE FREE v2.0.1 — LOGIN BUTTON FIX

FIXED
-----
Firebase modules loaded after DOMContentLoaded had already fired, so the UI
initialization function did not run and the Google login button had no click
event.

v2.0.1 initializes immediately when the page is already loaded and uses the
DOMContentLoaded event only when it is still needed.

UPLOAD
------
1. Extract this ZIP.
2. Delete the old frontend files from the GitHub repository root.
3. Upload every extracted file directly to the repository root.
4. Commit changes.
5. Wait for GitHub Pages deployment.
6. Open:
   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=2.0.1
7. Press Ctrl + Shift + R.

EXPECTED
--------
The login card should show:

Google sign-in is ready.

Clicking Continue with Google & Sync Contacts should then open the Google
account selection popup.
