# Assets Directory

This directory contains static assets for the Dabira Foods mobile app.

## Logo

The app logo should be placed in this directory with the following specifications:

- File name: `logo.png`
- Recommended size: 512x512 pixels
- Format: PNG with transparency

## App Icons

App icons for different platforms should be placed in their respective platform directories:

- Android: Place in `android/app/src/main/res/mipmap-*`
- iOS: Place in `ios/DabiraFoods/Images.xcassets/AppIcon.appiconset`

## Splash Screen

The splash screen image should be placed in this directory with the following specifications:

- File name: `splash.png`
- Recommended size: 1242x2436 pixels (portrait)
- Format: PNG

## Other Assets

Other assets such as images, fonts, and icons should be organized in appropriate subdirectories:

- Images: `images/`
- Fonts: `fonts/`
- Icons: `icons/`

## Usage in Code

To use these assets in your React Native components:

```javascript
// For local images
import logo from '../assets/logo.png';

// Usage
<Image source={logo} style={styles.logo} />
```

## Placeholder Logo

A placeholder logo is included for development purposes. Replace it with the actual logo when available.
