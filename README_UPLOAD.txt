BIRTHDAY REMINDER FIREBASE FREE v2.0.4
ACCOUNT MISMATCH FIX

ERROR FIXED
-----------
Firebase: Error (auth/user-mismatch)

The dashboard was logged into one Gmail account, but another Gmail account
was selected in the Sync Contacts authorization popup.

FIXES
-----
- Sync Contacts now preselects the currently logged-in Gmail.
- The current Gmail is passed as login_hint.
- A clear error explains which Gmail must be selected.
- To use another Gmail, logout first and login with that account.
- Initial login still allows normal account selection.

UPLOAD
------
1. Extract this ZIP.
2. Replace all frontend files in the GitHub repository root.
3. Commit changes.
4. Wait for GitHub Pages deployment.
5. Open:
   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=2.0.4
6. Press Ctrl + Shift + R.

TEST
----
1. Click Sync Contacts.
2. Continue with the same Gmail shown in the bottom-left profile.
3. Approve read-only Contacts access.
