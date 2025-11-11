# Deployment Guide - Scooter Range Tracker

## Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Website (Easiest)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"
   - Done! Your app will be live in ~2 minutes

3. **Access from your phone**
   - Vercel gives you a URL like: `https://scooter-range-tracker.vercel.app`
   - Open this URL on any device
   - Add to home screen for app-like experience

### Option 2: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Accept defaults
   - Your app will be deployed!

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Important: Firebase Configuration

Before deploying, make sure you've set up Firebase:

1. **Update Firebase Config**
   - Edit `src/firebase/config.ts`
   - Replace with your actual Firebase credentials
   - See `FIREBASE_SETUP.md` for details

2. **Firebase Security Rules**
   - Make sure your Realtime Database rules are set
   - See `FIREBASE_SETUP.md` for the rules

## After Deployment

### Add to Phone Home Screen

**iPhone:**
1. Open Safari and go to your Vercel URL
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name it "Scooter Tracker"
5. Tap "Add"

**Android:**
1. Open Chrome and go to your Vercel URL
2. Tap the menu (3 dots)
3. Tap "Add to Home screen"
4. Name it "Scooter Tracker"
5. Tap "Add"

### Share with Others

Share your Vercel URL with anyone who needs to track the same scooter:
- They open the URL
- Enter the same scooter code
- Data syncs across all devices!

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch automatically deploys
- Preview deployments for pull requests
- Rollback to previous versions anytime

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Troubleshooting

**Build fails?**
- Check that `src/firebase/config.ts` has valid Firebase config
- Make sure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

**App loads but Firebase doesn't work?**
- Verify Firebase config is correct
- Check Firebase Console for errors
- Ensure Realtime Database is enabled

**Can't access from phone?**
- Make sure you're using the HTTPS URL from Vercel
- Check if phone has internet connection
- Try clearing browser cache

## Environment Variables (If Needed)

If you want to use environment variables for Firebase:

1. In Vercel dashboard, go to Settings → Environment Variables
2. Add your Firebase config as variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.
3. Update `src/firebase/config.ts` to use `import.meta.env.VITE_*`
4. Redeploy

## Cost

- **Vercel Free Tier**: Perfect for this app
  - Unlimited deployments
  - Automatic HTTPS
  - Global CDN
  - 100GB bandwidth/month

## Support

Need help? Check:
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
