V4.0 ORANGE MOBILE APP UI
-------------------------
UI redesigned to match the supplied orange mobile-app reference.

Added:
- Orange gradient app header.
- Birthday Reminder brand icon and subtitle.
- User initial/profile circle.
- Live date + clock card.
- Large Next Birthday focus card.
- Days-to-go counter.
- Large Birthday Wish WhatsApp action.
- Rounded white cards with warm orange accents.
- Fixed mobile bottom navigation:
  Dashboard / Contacts / Birthdays / Yearly / Privacy.
- Existing search, filters, KPI cards and quick actions preserved.

PRIVACY
-------
No privacy architecture changes:
- No Firebase / Firestore
- No Google Sheets / Apps Script
- No localStorage / sessionStorage / IndexedDB
- Contact data remains only in current browser-tab memory
- OAuth scope remains contacts.readonly only

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.0


V4.1 ADD CONTACT + WISH IMAGE + INSTALL
---------------------------------------
Added:
1. + Add Contact
   - Name
   - Gender
   - Mobile
   - WhatsApp
   - Birthday
   - Stored only in current browser-tab memory.
   - Manual contacts survive Google re-sync within the same tab session.
   - Reload/close clears them.

2. Birthday Wish Image
   - Wish composer opens from birthday Wish buttons.
   - User can upload JPG/PNG/WebP/GIF up to 10 MB.
   - Image remains in local browser memory only.
   - On supported mobile browsers, native Web Share sends image + text via
     the device share sheet; WhatsApp can be selected.
   - Text-only WhatsApp fallback is included.

3. Install App
   - PWA manifest added with 192px/512px icons.
   - In-app Install App button uses beforeinstallprompt when supported.
   - iPhone/iPad and unsupported-browser guidance is provided.
   - No service worker or Cache Storage was added, so contact data and app data
     are not cached persistently by this build.

PRIVACY
-------
- No Firebase / Firestore
- No Google Sheet / Apps Script
- No contact/image upload to an owner server
- No localStorage / sessionStorage / IndexedDB
- Manual contacts and wish images are current-session memory only
- OAuth scope remains contacts.readonly only

Open after upload:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.1
