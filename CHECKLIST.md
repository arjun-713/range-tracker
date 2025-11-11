# ✅ Deployment Checklist

## Before Deploying

- [ ] **Firebase Setup Complete**
  - [ ] Created Firebase project
  - [ ] Enabled Realtime Database
  - [ ] Set database rules (see FIREBASE_SETUP.md)
  - [ ] Updated `src/firebase/config.ts` with your credentials
  
- [ ] **Test Locally**
  - [ ] Run `npm run dev`
  - [ ] Test login with a code
  - [ ] Test adding a trip
  - [ ] Test adding a charge
  - [ ] Verify data syncs (open in 2 browser tabs)

- [ ] **Code Ready**
  - [ ] All files saved
  - [ ] No console errors
  - [ ] Firebase config is correct (not placeholder values)

## Deployment Steps

- [ ] **Push to GitHub**
  ```bash
  git add .
  git commit -m "Ready for deployment"
  git branch -M main
  git remote add origin YOUR_GITHUB_URL
  git push -u origin main
  ```

- [ ] **Deploy on Vercel**
  - [ ] Go to https://vercel.com
  - [ ] Sign in with GitHub
  - [ ] Click "Add New Project"
  - [ ] Import your repository
  - [ ] Click "Deploy"
  - [ ] Wait for deployment to complete (~2 min)

- [ ] **Get Your URL**
  - [ ] Copy the Vercel URL (e.g., `https://scooter-range-tracker.vercel.app`)
  - [ ] Save it somewhere

## After Deployment

- [ ] **Test on Desktop**
  - [ ] Open Vercel URL in browser
  - [ ] Generate a scooter code
  - [ ] Complete onboarding
  - [ ] Add a test trip

- [ ] **Test on Phone**
  - [ ] Open Vercel URL on phone
  - [ ] Enter the same scooter code
  - [ ] Verify data synced from desktop
  - [ ] Add to home screen

- [ ] **Test Multi-Device Sync**
  - [ ] Open on 2 devices with same code
  - [ ] Add trip on device 1
  - [ ] Verify it appears on device 2
  - [ ] Add charge on device 2
  - [ ] Verify it appears on device 1

## Share with Others

- [ ] Share Vercel URL with users
- [ ] Share scooter code with family/friends
- [ ] Show them how to add to home screen

## Optional Enhancements

- [ ] Set up custom domain in Vercel
- [ ] Add app icon/favicon
- [ ] Enable Firebase Analytics
- [ ] Set up backup/export automation

## Troubleshooting

If something doesn't work:

1. **Check Firebase Console**
   - Is Realtime Database enabled?
   - Are the rules set correctly?
   - Any errors in the logs?

2. **Check Vercel Logs**
   - Go to your project → Deployments
   - Click on latest deployment
   - Check build logs for errors

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Common Issues**
   - Firebase config has placeholder values → Update with real values
   - Database rules too restrictive → Use test mode rules
   - CORS errors → Check Firebase domain settings

## Success! 🎉

When everything works:
- ✅ App loads on any device
- ✅ Login works with scooter code
- ✅ Data syncs across devices
- ✅ Can add trips and charges
- ✅ History shows correctly

You're done! Your scooter tracker is live and ready to use.
