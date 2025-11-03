# How to Run Dabira Foods Mobile App

## Prerequisites
1. Install **Expo Go** app on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Make sure your phone and computer are on the **same WiFi network**

## Steps to Run

### 1. Open a NEW terminal (close all old terminals first)

### 2. Navigate to mobile folder
```bash
cd "C:\Users\franklyAhmad\Desktop\Delivery App\mobile"
```

### 3. Start the Expo development server
```bash
npm start
```

### 4. Wait for the QR code to appear (30-60 seconds)

You will see:
- Metro bundler starting
- A QR code (square black and white pattern)
- Text saying "Scan the QR code above with Expo Go"

### 5. On your phone:
- Open the **Expo Go** app
- Tap **"Scan QR Code"**
- Point camera at the QR code in your terminal
- Wait 10-30 seconds for the app to load

## ⚠️ IMPORTANT - DO NOT:
- ❌ Press `w` in the terminal (web doesn't work)
- ❌ Open any browser
- ❌ Copy/paste error messages into terminal
- ❌ Try to access localhost in browser

## ✅ ONLY:
- ✅ Use Expo Go app on your phone
- ✅ Scan the QR code from terminal
- ✅ Keep both devices on same WiFi

## Troubleshooting

If you see "Failed to download remote update":
1. Make sure phone and computer are on same WiFi
2. OR use your phone as a hotspot and connect your computer to it
3. Then restart: `npm start`

If the QR code doesn't appear:
1. Wait 60 seconds
2. If still nothing, press `Ctrl+C` to stop
3. Run `npm start` again












