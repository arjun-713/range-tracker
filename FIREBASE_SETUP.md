# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Scooter Range Tracker"
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In your Firebase project, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **test mode** for now
5. Click "Enable"

## Step 3: Set Database Rules

Go to the "Rules" tab and paste:

```json
{
  "rules": {
    "scooters": {
      "$scooterId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Click "Publish"

## Step 4: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>)
4. Register app name: "Scooter Tracker"
5. Copy the firebaseConfig object

## Step 5: Update Your App

Open `src/firebase/config.ts` and replace with your config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Run the App

```bash
npm run dev
```

## How It Works

- Each scooter has a unique 6-character code
- Share the code across devices to sync data
- All changes sync in real-time via Firebase
- Data persists in the cloud
