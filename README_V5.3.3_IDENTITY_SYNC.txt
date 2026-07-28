BIRTHDAY REMINDER v5.3.3 — CROSS-APP IDENTITY SYNC
=======================================================

Fixed:
- Naam Jaap passes the signed-in display name when switching to Birthday.
- Birthday saves that display name on this device.
- Birthday launcher then shows Parmeshwar and initial P.
- Google People API name is now saved after successful Birthday sync.
- Direct future Birthday openings keep the saved name.

Privacy:
- display name is transferred in the URL fragment (#), not the query string
- URL fragments are not sent to GitHub Pages/server
- fragment is removed immediately after reading
- no shared cloud database was added

Photo:
- Birthday shows its own saved device photo when available
- otherwise the correct initial (for example P) is shown
- no profile image is uploaded or copied between apps

Unchanged:
- contacts.readonly
- Google People API read-only behaviour
- contacts/backups/calendar
- app switching
- local privacy architecture
