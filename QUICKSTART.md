# 🚀 Quick Start - Get Your App Online in 5 Minutes

## Step 1: Setup Firebase (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "Scooter Tracker"
3. Go to "Realtime Database" → Click "Create Database" → Start in test mode
4. Go to Project Settings → Scroll to "Your apps" → Click web icon (</>)
5. Copy the `firebaseConfig` object
6. Open `src/firebase/config.ts` and paste your config

## Step 2: Test Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:5173 and test the app

## Step 3: Deploy to Vercel (2 minutes)

### Option A: Via Website (Easiest)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   
2. Create a repo on GitHub and push:
   ```bash
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

3. Go to https://vercel.com → "Add New Project" → Import your repo → Deploy

### Option B: Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 4: Access from Phone

1. Open the Vercel URL on your phone (e.g., `https://your-app.vercel.app`)
2. Add to home screen:
   - **iPhone**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home screen

## Step 5: Share with Others

1. Generate a scooter code in the app
2. Share the code with family/friends
3. They enter the same code on their device
4. All data syncs in real-time!

## Done! 🎉

Your scooter tracker is now:
- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Syncing data in real-time
- ✅ Ready to track trips

## Need Help?

- Firebase setup: See `FIREBASE_SETUP.md`
- Deployment details: See `DEPLOYMENT.md`
- App features: See `README.md`
