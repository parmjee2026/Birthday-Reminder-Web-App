BIRTHDAY REMINDER — PRIVACY-FIRST LOCAL-ONLY v3.0

PURPOSE
-------
This build removes all application-controlled cloud storage.

NOT USED
--------
- Firebase Authentication
- Cloud Firestore
- Google Sheets
- Apps Script
- Cloud Functions
- Cloud Scheduler
- Analytics or advertising SDKs
- localStorage
- sessionStorage
- IndexedDB
- Service Worker data caching

DATA FLOW
---------
Google Contacts
    -> Google People API
    -> The user's current browser tab memory

The application does not send imported contact records to the website owner,
a database, GitHub, Google Sheets, Firebase or any other application backend.

TEMPORARY SESSION
-----------------
Imported data is cleared when:
- the page is reloaded,
- the tab/browser is closed, or
- Disconnect & Clear is pressed.

GOOGLE OAUTH CLIENT ID
----------------------
Configured client ID:

205720505540-ncjatpfsvr91pcebl9mkd5obum3cjf62.apps.googleusercontent.com

GOOGLE CLOUD SETUP
------------------
In the Google Cloud project that owns the client ID:

1. Open APIs & Services -> Credentials.
2. Open the Web application OAuth client.
3. Add this Authorized JavaScript origin:

   https://parmjee2026.github.io

4. Ensure Google People API is enabled in the same Cloud project.
5. Keep this OAuth scope in the consent screen:

   https://www.googleapis.com/auth/contacts.readonly

6. While the app is in Testing, add every allowed Gmail account as a Test User.

GITHUB UPLOAD
-------------
1. Extract this ZIP.
2. Delete the previous Firebase version files from the repository root.
3. Upload these files directly to the repository root:
   - .nojekyll
   - index.html
   - 404.html
4. Commit the changes.
5. Open:

   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=3.0

6. Press Ctrl + Shift + R.

PRIVACY TEST
------------
After deployment, open Browser Developer Tools -> Network.

Expected application data traffic:
- accounts.google.com for Google authorization
- people.googleapis.com for read-only Google Contacts requests
- parmjee2026.github.io for the static HTML application

There should be no requests to:
- firestore.googleapis.com
- firebaseio.com
- firebaseapp.com
- script.google.com
- Google Sheets API
- an owner-controlled API or database

FIELDS READ
-----------
- Name
- Gender
- Mobile / WhatsApp number
- Birthday

Only contacts containing a phone number are displayed.
Birthday is optional.

IMPORTANT LIMITATION
--------------------
Because no application database or device storage is used:
- data must be synced again after refresh,
- there is no cross-device sync,
- background reminders cannot run while the page is closed.

These limitations are intentional for maximum privacy.
