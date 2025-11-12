# Enable Firebase Authentication

## IMPORTANT: You must enable Authentication in Firebase!

### Steps:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project "scooty-charge"
3. In the left menu, click **"Build"** → **"Authentication"**
4. Click **"Get started"**
5. Go to the **"Sign-in method"** tab
6. Find **"Anonymous"** in the list
7. Click on it
8. Toggle **"Enable"** to ON
9. Click **"Save"**

That's it! Anonymous authentication is now enabled.

## Why is this needed?

Firebase requires authentication before you can read/write to the database. We use anonymous authentication so users don't need to create accounts - they just use scooter codes.

## After enabling:

1. Save the changes in Firebase Console
2. Restart your dev server: `npm run dev`
3. Try connecting with a scooter code again
4. Check the browser console (F12) for any errors
