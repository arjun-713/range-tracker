# Browser Notifications Guide

## How to Enable Notifications

### On Desktop (Chrome, Edge, Firefox)

1. Open the app in your browser
2. Click the **bell icon** (🔔) in the top right of the home screen
3. When prompted, click **"Allow"** to enable notifications
4. You'll see a test notification confirming it's enabled

### On Mobile (iPhone/Android)

#### iPhone (Safari):
1. Open the app in Safari
2. Add the app to your home screen first:
   - Tap Share button → "Add to Home Screen"
3. Open the app from your home screen
4. Tap the bell icon
5. Allow notifications when prompted

#### Android (Chrome):
1. Open the app in Chrome
2. Tap the bell icon
3. Tap "Allow" when prompted
4. Notifications will work even when the app is closed

## What Notifications You'll Get

### Low Range Alert (Yellow)
- Triggers when range drops below your threshold (default: 15 km)
- Message: "⚠️ Low Range Alert - X km remaining. Please charge your scooter soon."
- Shows once when crossing the threshold

### Critical Range Alert (Red)
- Triggers when range drops below critical threshold (default: 5 km)
- Message: "🔴 CRITICAL: Very Low Range! - Only X km remaining. Charge immediately!"
- Stays on screen until you dismiss it (requireInteraction)
- More urgent than low range alert

## Notification Behavior

- **Smart Notifications**: You'll only get notified once per threshold crossing
- **No Spam**: Won't repeatedly notify you at the same range level
- **Resets**: When you charge and range goes back up, notifications reset
- **Background**: Works even when the app is closed or in another tab
- **Synced**: If you update range on another device, all devices get notified

## Customizing Alerts

Go to **Settings** to customize:
- **Low Range Threshold**: Set when you want the warning (10-25 km)
- **Critical Range Threshold**: Set when you want urgent alerts (0-10 km)

## Troubleshooting

### Notifications not working?

1. **Check browser permissions:**
   - Chrome: Settings → Privacy → Site Settings → Notifications
   - Firefox: Settings → Privacy → Permissions → Notifications
   - Safari: Preferences → Websites → Notifications

2. **Make sure notifications are allowed for your site**

3. **On mobile, add to home screen first** for best results

4. **Check Do Not Disturb mode** on your device

### Notifications blocked?

If you accidentally clicked "Block":
1. Click the lock icon (🔒) in the address bar
2. Find "Notifications" 
3. Change to "Allow"
4. Refresh the page
5. Click the bell icon again

## Privacy

- Notifications are sent by your browser, not by any server
- No data is sent anywhere - it's all local
- You can disable notifications anytime by clicking the bell icon

## Tips

- **Enable on all devices** where you use the app
- **Test it**: After enabling, update your odometer to drop below the threshold
- **Customize thresholds** based on your typical riding patterns
- **Keep notifications on** for peace of mind about your range
