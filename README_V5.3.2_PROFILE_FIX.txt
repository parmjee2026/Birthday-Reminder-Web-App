BIRTHDAY REMINDER v5.3.2 — PROFILE HEADER FIX
=================================================

Fixed:
- live Birthday state.userName is used
- live state.userStatus is used
- live state.profilePhotoUrl is used
- direct IndexedDB fallback loads the device-only profile photo
- profile DOM changes refresh the launcher immediately
- Guest is no longer the Birthday fallback heading

Identity priority:
1. live Birthday profile state
2. saved local profile
3. rendered name/status
4. friendly fallback

Unchanged:
- contacts.readonly
- Google People API behaviour
- profile photo remains device-only
- contacts/backups/calendar
- app switching
- privacy architecture
