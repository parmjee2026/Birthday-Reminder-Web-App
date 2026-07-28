V5.3.0 CURRENT ARCHITECTURE NOTICE
==================================
My App Suite is now embedded inside Birthday Reminder and Naam Jaap.
Any older README sections mentioning a separate My App Suite launcher are historical only.
Use the embedded launcher and archive the old launcher repository only after both apps are verified.

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


V4.2 DEVICE PROFILE + QUICK RECONNECT
-------------------------------------
Added Settings & Privacy:

PROFILE
- User can save their own Name.
- User can save a custom Status.
- Name/status are stored only in localStorage on that device.
- They are never uploaded to the app owner.

OPTIONAL DEVICE CONTACT MEMORY
- "Remember contacts on this device" is OFF by default.
- When enabled, the current contact list is stored in IndexedDB on that device.
- The installed app can reopen and show the saved contact list without Google
  authorization just to view existing data.
- Uploaded birthday-wish images are NOT cached.
- Clear Saved Device Data removes the saved name, status and contact cache.

QUICK GOOGLE RECONNECT
- After the first Google consent is granted, the app remembers only that the
  grant previously existed.
- A future Sync tap asks Google for a new access token with prompt="" when
  Quick Reconnect is enabled.
- Google may return the token without showing the consent screen again if the
  grant and Google session are still valid.
- Google Identity Services still requires a user gesture to request a new
  browser access token; the installed PWA cannot silently refresh it in the
  background without a backend/refresh-token architecture.

PRIVACY
- No Firebase / Firestore
- No Google Sheets / Apps Script
- No owner-controlled contact database
- Optional persistence exists ONLY on the user's own device.
- OAuth scope remains contacts.readonly.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2


V4.2.1 MOBILE AUTH + PWA FIX
----------------------------
Fixed from mobile video review:

1. Google Connect button
   - Root cause: the browser click MouseEvent was accidentally being passed into
     authorizeAndSync(promptMode) and then used as Google's OAuth `prompt`.
   - Connect click now explicitly calls authorizeAndSync(null).
   - authorizeAndSync also rejects non-string prompt values defensively.

2. Login screen
   - Bottom navigation is now hidden until the main app is visible.
   - Install Birthday Reminder button is available directly on the login screen.

3. PWA install reliability
   - Added a service worker that caches ONLY public static app-shell assets:
     index.html, manifest and icons.
   - It NEVER intercepts/caches Google OAuth or People API requests.
   - It never contains or caches contacts, access tokens, profile data, wish
     images, or IndexedDB data.
   - Contacts remain governed by the existing Session / Private Device settings.

TEST
----
Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.1

Then:
1. Ctrl+Shift+R on desktop, or close/reopen Chrome tab on mobile.
2. Tap Connect Google Contacts Privately.
3. Google authorization should open immediately.
4. For install, tap Install Birthday Reminder.


V4.2.2 SHARE APP
----------------
Added Share App in:
- Login screen
- Main orange header
- Settings & Privacy

Behavior:
- Supported mobile browsers open the native device share sheet.
- WhatsApp, Messages, email and other installed apps can be selected.
- Unsupported browsers copy the public app URL to clipboard.
- Final fallback shows a copyable URL prompt.

Shared data:
- ONLY the public Birthday Reminder app URL and generic share text.
- No contacts
- No birthdays
- No profile name/status
- No Google access token
- No device-cached data

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.2


V4.2.3 CLEAN HEADER
-------------------
UI refinement:
- Removed Share button from the orange app header.
- Mobile header now keeps only Brand, Profile and Sync.
- Share App remains available on:
  - Login screen
  - Settings & Privacy
- This keeps the header visually cleaner and closer to a native mobile app.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.3


V4.2.4 CONTACT EDIT
-------------------
Added working contact editing.

CONTACTS PAGE
- Edit button on every Google/manual contact.
- Editable:
  Name
  Gender
  Mobile
  WhatsApp
  Birthday

GOOGLE CONTACT SAFETY
- Google Contacts remain read-only.
- Editing a Google Contact changes only Birthday Reminder's local copy.
- The original Google values are preserved inside the local contact object.
- Edited Google contacts show "Edited on this device".
- "Restore Google" returns the Birthday Reminder record to the original
  Google-synced values.
- Local edits survive another Google Sync during the current session.
- If Remember Contacts on This Device is ON, local edits are saved in the
  device's IndexedDB and remain after reopening.

MANUAL CONTACTS
- Manual contacts can also be edited.
- They remain session-only or device-only according to Device Memory setting.

No Google write/edit OAuth permission was added.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.4


V4.2.5 NAAM JAAP COUNTER LINK
-----------------------------
Added:
Settings & Privacy -> More Apps -> Naam Jaap Counter

Link:
https://parmeshwarbtpl-rgb.github.io/japa-counter/

Behavior:
- Opens in a new browser tab/window.
- Uses rel="noopener noreferrer".
- No Birthday Reminder contact/profile data is passed to Naam Jaap Counter.
- Header remains clean; the link lives only in Settings.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.5


V4.2.6 PROFILE PHOTO
--------------------
Added:
Settings & Privacy -> Profile Settings -> Choose Photo

Features:
- JPG / PNG / WebP
- Max source image: 10 MB
- Center-cropped and resized locally to 512 x 512
- WebP compression with JPEG fallback
- Photo appears in top profile circle
- Settings shows profile photo preview
- Remove Photo option

Privacy:
- Profile photo is stored only in this device's IndexedDB.
- It is never uploaded to Firebase, Firestore, Google Sheets, Apps Script or
  the website owner.
- Share App does not include the photo.
- Clear Saved Device Data removes the photo.
- No extra Google OAuth permission is required.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=4.2.6


V5.0 CALENDAR + BACKUP + APP UPDATE
===================================

CALENDAR
- Add to Calendar button on every contact that has a birthday.
- Individual recurring yearly birthday .ics export.
- Export All Birthdays creates one recurring .ics calendar file.
- Import Birthdays (.ics) imports birthday events as local/manual records.
- Birthday Reminder's own .ics export includes optional custom contact metadata
  (name, gender, mobile, WhatsApp and birth year) for better round-trip import.
- Generic .ics files still import the event name/date when those custom fields
  are not present.

BACKUP / RESTORE
- Export My Data (JSON)
  Includes profile name/status, profile photo, contacts, birthdays, local edits,
  and original Google snapshots used by Restore Google.
- Export My Data (CSV)
  Portable spreadsheet-style export of contact/birthday fields.
- Import Backup accepts Birthday Reminder JSON or CSV.
- Imports merge with current local data and skip obvious duplicates.
- JSON profile photo is restored to this device's IndexedDB.
- No backup is uploaded to the app owner.

APP UPDATE
- PWA service worker updated to v5.0.
- When a newer service worker is installed and waiting, app shows:
    New version available
    [Update Now]
- Update Now activates the waiting version and reloads the app.
- Settings also includes Check for Updates.
- Service worker caches only public same-origin app-shell files.
- Google OAuth, Google People API, contacts, tokens, profile data, backups and
  uploaded wish images are never placed in Cache Storage.

PRIVACY
- Google Contacts scope remains contacts.readonly.
- No Firebase / Firestore / Google Sheets / Apps Script.
- Device contact persistence remains optional.
- Calendar and backup files are created locally in the browser.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.0


V5.0.1 UPDATE ACTIVATION FIX
============================

Video review showed the phone was still displaying the older Settings screen.
The v5.0 Calendar & Backup and App Updates cards were not active on the device.

Fixes:
- Versioned service-worker URL: ./sw.js?v=5.0.1
- updateViaCache: none
- Automatic update check after service-worker registration
- Old Birthday Reminder static Cache Storage entries removed
- IndexedDB contacts/profile photo are preserved
- localStorage profile/settings are preserved
- Current build clearly shows Birthday Reminder v5.0.1 in Settings

Expected Settings order:
1. Profile Settings
2. Calendar & Backup
3. App Updates
4. More Apps
5. Share Birthday Reminder
6. Device Memory
7. Privacy information

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.0.1


V5.1 DUPLICATES + SETTINGS + PRIVACY
====================================

1. DUPLICATE CONTACT DETECTION
- Detects contacts sharing the same normalized mobile number.
- Displays duplicate group count and extra-contact count.
- Review Duplicates opens a local review dialog.
- Each duplicate record can be opened in the existing Edit Contact dialog.
- No contact is automatically deleted, merged or modified.
- Google Contacts remain read-only.

2. SETTINGS ORGANIZATION
Settings now has three clear sections:
- Profile
- Data & Privacy
- App & More

3. PRIVACY DASHBOARD
Live values:
- Google Contacts: Read Only
- Saved on this device: Yes/No
- Google connection: Connected / Grant remembered / Not connected
- Cloud storage: None
- Owner server storage: None

Actions:
- Clear Device Data
- Disconnect Google

Privacy model remains unchanged:
- No Firebase / Firestore / Sheets / Apps Script contact database
- Google scope remains contacts.readonly
- Device persistence remains optional

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.1


V5.2 COMPACT LOGIN + PRIVACY
============================

Login improvements:
- Long privacy paragraphs replaced with four short points.
- Added expandable Learn more section.
- Added Why connect? card:
  - Find birthdays automatically
  - See upcoming birthdays and calendar export
  - Manage a local copy privately

Wording is intentionally precise:
- "No separate app account" because Google authorization is still required
  when syncing Google Contacts.
- Google contacts are delivered by Google People API to the user's browser.
- Birthday Reminder does not maintain an owner-controlled cloud contact database.

All v5.1 features remain unchanged.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.2


V5.2.1 COMPACT WHY CONNECT
==========================

Refined the login screen based on UX feedback:
- Why connect? now appears as a compact 3-point list directly above Connect.
- Reduced white space on mobile.
- Benefits are immediately scannable:
  1. Find birthdays automatically
  2. Upcoming birthday reminders
  3. Manage contacts privately

The detailed explanation remains available under Privacy -> Learn more.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.2.1


V5.3.0 PRIVACY NOTICE IN SETTINGS
=================================

UI refinement:
- Removed the large privacy notice from Dashboard/front screen.
- Privacy/legal-style information now lives under:
  Settings -> Data & Privacy -> Privacy Notice
- Added expandable "Read privacy details" section.
- Dashboard is now cleaner and focused on birthdays/actions.
- Privacy Dashboard remains available in Settings.

Dynamic notice:
- Session Mode:
  contacts stay in current browser memory.
- Private Device Mode:
  contacts may be remembered only on this device.

No privacy architecture change:
- Google Contacts remains read-only.
- No Firebase / Firestore / Sheets / Apps Script contact database.
- Device persistence remains optional.

Open:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.3.0


V5.3.0 APP SUITE NAVIGATION
===========================

Phase 2 soft-merge navigation has been added.

Settings > App & More > My Apps now includes:
- My App Suite
  [retired separate launcher — My App Suite is now embedded]
- Naam Jaap Counter
  https://parmeshwarbtpl-rgb.github.io/japa-counter/

Architecture remains separate:
- Birthday Reminder Google Contacts permission remains read-only.
- No shared database has been added.
- No Naam Jaap activity is read by Birthday Reminder.
- Links open as separate apps with noopener/noreferrer protection.

Deploy/test:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.3.0


V5.3.0 COMMON APP SUITE BRANDING
================================
Branding-only Phase 3 update.

Settings > App & More > My Apps:
- shows "Part of My App Suite"
- marks My App Suite as the common home
- keeps Naam Jaap Counter as the direct related app

No changes to:
- contacts.readonly OAuth scope
- Google People API behaviour
- IndexedDB/localStorage data model
- backup/calendar logic
- contact editing
- service-worker cross-origin privacy rules

Central home:
[retired separate launcher — My App Suite is now embedded]

V5.3.0 APP LAUNCH FIX
=====================
- My App Suite and Naam Jaap links no longer force target="_blank".
- WhatsApp/external action links are unchanged.
- Added PWA launch_handler navigate-existing.
- contacts.readonly and privacy/data architecture unchanged.


V5.3.0 HEADER APP SWITCHER
==========================
A compact Apps icon (▦) is now available in the Birthday Reminder header.

Tap it to open a bottom sheet:
- Birthday Reminder — Current
- Naam Jaap Counter
- My App Suite

The header contains no app URL or long app-link text.
Switching uses the same browsing context; target=_blank is not used.
Google Contacts remains read-only and all privacy/storage architecture is unchanged.

Test:
https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=5.3.0


V5.3.0 — EMBEDDED MY APP SUITE
==============================
- My App Suite is now the first screen inside Birthday Reminder.
- Header ▦ reopens the same launcher.
- Login screen gets a My Apps button.
- The separate My App Suite URL is removed from this build.
- Cross-app switch opens Naam Jaap with ?enter=1, then the target cleans that parameter.
- contacts.readonly and all privacy/storage logic remain unchanged.

Archive the old my-app-suite repository only after both apps are tested.
