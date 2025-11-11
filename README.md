# Scooter Range Tracker

A comprehensive electric scooter tracking app with **multi-device sync**. Track your range, log trips, manage charging sessions across all your devices in real-time using Firebase.

## 🚀 Key Features

### 🔐 Multi-Device Sync
- **Share one scooter across multiple devices** using a 6-character code
- Real-time data synchronization via Firebase
- Log trips from any phone or tablet
- All data stored securely in the cloud

### 🔋 Range Tracking
- Real-time remaining range display with visual indicators
- Color-coded warnings (Green > 20km, Yellow 15-20km, Red < 15km)
- Automatic range calculation based on trips
- Customizable maximum range

### 📍 Trip Logging
- Log odometer readings after each trip
- Automatic distance calculation
- Add trip notes/labels
- View trip history with filters (Today, This Week, This Month, All Time)
- Export trip data to CSV

### ⚡ Charging Management
- Full charge option
- Partial charge with duration input
- Automatic range calculation for partial charges
- Charging history with statistics
- Export charging data to CSV

### 🎯 Smart Features
- "Can I Make It?" range predictor
- Low range alerts (customizable threshold)
- Critical range warnings
- Trip statistics and analytics
- Efficiency tracking

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Firebase** (Authentication + Realtime Database)
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **date-fns** for date handling
- **Lucide React** for icons

## 📦 Installation

### 1. Clone and Install

```bash
npm install
```

### 2. Setup Firebase

Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Quick steps:**
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Copy your Firebase config
4. Update `src/firebase/config.ts` with your credentials

### 3. Run the App

```bash
npm run dev
```

Open http://localhost:5173

## 🎮 How to Use

### First Time Setup

1. **Login Screen**
   - Generate a new 6-character scooter code OR
   - Enter an existing code to sync with other devices

2. **Onboarding**
   - Enter current odometer reading
   - Set battery status
   - Configure charging settings
   - Set alert preferences

### Daily Use

1. **Update Odometer** - Log trips after each ride
2. **Add Charge** - Track full or partial charges
3. **View History** - Check trips and charging sessions
4. **Range Predictor** - Check if you can reach your destination

### Multi-Device Sync

1. On Device 1: Generate a scooter code (e.g., "ABC123")
2. On Device 2: Enter the same code "ABC123"
3. Both devices now share the same scooter data
4. All changes sync in real-time across devices

## 📱 Sharing Your Scooter

To share your scooter with family/friends:

1. Go to **Settings**
2. Find your **Scooter Code** (6 characters)
3. Share this code with others
4. They enter the code on their device
5. Everyone can now track and log data

## 🔒 Security

- Anonymous authentication via Firebase
- Each scooter has a unique code
- Only users with the code can access data
- Data is stored securely in Firebase

## 🏗️ Build for Production

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

## 📊 Data Export

Export your data anytime:
- **Trip History** → Export CSV button
- **Charging History** → Export CSV button

## 🔄 Switching Scooters

To track a different scooter:
1. Go to **Settings**
2. Click **Switch Scooter**
3. Enter a new scooter code

Your previous scooter data remains in the cloud.

## 🐛 Troubleshooting

**Data not syncing?**
- Check your internet connection
- Verify Firebase config in `src/firebase/config.ts`
- Check Firebase Console for database rules

**Can't login?**
- Make sure Firebase Authentication is enabled
- Check browser console for errors

## 📄 License

Private project for personal use.

## 🎯 Version

2.0.0 - Multi-device sync with Firebase
