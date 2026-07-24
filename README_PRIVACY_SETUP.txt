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
