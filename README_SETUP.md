# Birthday Reminder Firebase Free v2.0

This version uses only services available on the Firebase Spark plan and
GitHub Pages. Do not upgrade the Firebase project to Blaze.

## What it does

- Google Gmail login through Firebase Authentication
- Requests read-only Google Contacts permission during login
- Automatically imports contacts with saved birthdays after the first login
- Manual one-tap Google Contacts resync
- Separate Firestore data for every Firebase user UID
- Add, edit and delete manual birthdays
- Search, dashboard, WhatsApp wish shortcut and PWA install
- No shared API key
- No Apps Script backend
- No paid Cloud Functions, Cloud Run or Scheduler

## Free-only limitation

Google OAuth browser access tokens are short-lived. Therefore:

- First login can sync contacts automatically.
- Later syncs happen when the user presses `Sync Contacts`.
- The app cannot reliably sync while the browser is closed.
- Automatic background email/WhatsApp sending is not included.

This limitation keeps the project completely free and avoids storing refresh
tokens on a paid backend.

---

# Setup

## 1. Create a Firebase project

1. Open Firebase Console.
2. Create a project.
3. Keep the project on the `Spark` plan.
4. Do not link a billing account.
5. Analytics is optional and can be disabled.

## 2. Register the web app

1. Project Overview > Web icon.
2. Register app, for example:
   `Birthday Reminder Web`
3. Copy the Firebase configuration object.
4. Open `index.html`.
5. Find:

```js
const FIREBASE_CONFIG = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_APP_ID"
};
```

6. Replace all placeholder values.

Firebase web configuration values are public identifiers. Firestore Rules
protect the private data.

## 3. Enable Google Login

1. Firebase Console > Authentication.
2. Get Started.
3. Sign-in method > Google.
4. Enable.
5. Select a support email.
6. Save.

## 4. Add the GitHub Pages domain

Firebase Console > Authentication > Settings > Authorized domains.

Add:

`parmjee2026.github.io`

Also keep:

- localhost
- your-project.firebaseapp.com

## 5. Create Firestore

1. Firebase Console > Firestore Database.
2. Create database.
3. Choose a location close to your users.
4. Start in Production mode.
5. Open Rules.
6. Replace the complete rules with `firestore.rules`.
7. Publish.

The rules ensure that a user can access only:

`users/{their-own-firebase-uid}/...`

## 6. Enable People API

Use the Google Cloud project linked to the same Firebase project.

1. Google Cloud Console > APIs & Services > Library.
2. Search `Google People API`.
3. Click Enable.

## 7. Configure OAuth consent

1. Google Cloud Console > Google Auth Platform / OAuth consent screen.
2. Configure the app name and support email.
3. Choose External for Gmail users outside your Workspace.
4. Add the contacts read-only scope when requested.
5. During development, add the Gmail accounts that will test the app.

The app requests:

`https://www.googleapis.com/auth/contacts.readonly`

It can read contacts but cannot edit or delete them.

For use by unrestricted public Gmail accounts, Google may require OAuth app
verification because contact access is a sensitive scope. Verification is an
approval process, not a paid Firebase upgrade.

## 8. Upload to GitHub Pages

Delete old frontend files from the repository root, then upload these files
directly to root:

- `.nojekyll`
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `404.html`
- `icon-192.png`
- `icon-512.png`

GitHub Pages settings:

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

Open:

`https://parmjee2026.github.io/Birthday-Reminder-Web-App/?v=2.0`

Press `Ctrl + Shift + R` after deployment.

---

# Firestore structure

```text
users/
  FIREBASE_UID/
    displayName
    email
    lastContactSyncAt
    lastContactSyncCount

    birthdays/
      contact_or_manual_document/
        name
        birthYear
        birthMonth
        birthDay
        email
        mobile
        whatsapp
        relation
        source

    private/
      settings
```

Every Gmail login receives a different Firebase UID and a separate birthday
collection.

---

# No payment checklist

- Firebase plan: Spark
- Billing account: Not linked
- Google Login: Enabled
- Firestore: Free quota only
- Hosting: Existing GitHub Pages
- Cloud Functions: Not used
- Cloud Run: Not used
- Scheduler: Not used
- Phone OTP: Not used
