V3.0.4 MOBILE COMPACTNESS
-------------------------
- Mobile header is one compact row: menu, title and Sync.
- Upcoming 30 Days cards are shorter and horizontal.
- Name, mobile, birthday date and WhatsApp action stay visible.
- Gender and birth-year are hidden only in compact upcoming cards.
- Desktop layout is unchanged.
- Privacy-first local-only architecture is unchanged.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=3.0.4


V3.1.0 SMART CONTACT UX
-----------------------
Added:
1. Birthday Missing is clickable -> Complete Profiles.
2. Last Sync date/time is shown beside the Sync button on desktop.
3. Stable Google-Contacts-style avatar colors derived from contact name.
4. Contact search remains available and is more prominent.
5. Filters:
   - All
   - Birthday Available
   - Birthday Missing
   - Current Month
   - Next 30 Days
6. Quick actions in contact cards:
   - Call
   - WhatsApp
   - SMS
   - Birthday Wish
   - Ask Birthday when DOB is missing

PRIVACY DECISION
----------------
The suggested AI feature based on call/message history was intentionally NOT
added. It would require extra sensitive permissions and potentially broader
personal-data processing. This build keeps the existing privacy-first model.

No new storage or backend was added:
- No Firebase
- No Firestore
- No Sheets / Apps Script
- No localStorage / IndexedDB / sessionStorage
- Contact data remains in current browser-tab memory only

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=3.1.0


V3.1.1 MINIMUM OAUTH SCOPE FIX
------------------------------
Fixed:
"Request had insufficient authentication scopes."

The app now requests ONLY:

https://www.googleapis.com/auth/contacts.readonly

The separate userinfo.profile scope has been removed.

The same contacts.readonly token is used for:
- reading Google Contacts
- reading the signed-in user's display name through People API people/me

The returned OAuth token is checked before sync. If contacts.readonly was not
actually granted, the app shows a clear reconnect message instead of a raw API
error.

AFTER UPLOAD
------------
1. Open:
   https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=3.1.1
2. Press Ctrl + Shift + R.
3. Press Disconnect & Clear once.
4. Connect again.
5. Allow read-only Google Contacts permission.

GOOGLE AUTH PLATFORM
--------------------
Data Access must include:

https://www.googleapis.com/auth/contacts.readonly

No userinfo.profile scope is required by this app.

Privacy-first local-only architecture remains unchanged.


V3.1.2 SYNC STATUS + ONBOARDING
-------------------------------
Added:
- Animated loading spinner while Sync All Contacts runs.
- Sync status indicator:
  - red dot + Never synced
  - green dot + Synced just now / X minutes ago / X hours ago
- Relative sync status refreshes automatically every 30 seconds.
- Exact sync date/time remains available as a tooltip.
- Friendly onboarding card when contact counts are zero.
- If a completed sync finds zero mobile contacts, onboarding shows a distinct
  "Sync completed" message.
- KPI cards remain clickable from v3.1.0.

Privacy model remains unchanged:
- No Firebase / Firestore
- No Google Sheets / Apps Script
- No localStorage / sessionStorage / IndexedDB
- Contact records remain only in current browser-tab memory

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=3.1.2
