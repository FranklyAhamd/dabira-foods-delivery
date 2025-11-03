# Dabira Foods Mobile App

A React Native mobile application for the Dabira Foods food delivery service.

## Features

- User authentication (login/register)
- Browse food menu with categories
- View detailed menu item information
- Add items to cart
- Checkout and place orders
- Track order status
- View order history
- User profile management

## Prerequisites

- Node.js >= 16
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or newer

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobile_new
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Update API configuration:
   - Open `src/config/api.js`
   - Update the `API_URL` constant to match your backend server URL

## Running the App

### Android

1. Make sure you have an Android emulator running or a physical device connected
2. Run the following command:
```bash
npm run android
# or
yarn android
```

### iOS (macOS only)

1. Install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

2. Run the following command:
```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
mobile_new/
├── android/                # Android native code
├── ios/                    # iOS native code
├── src/
│   ├── assets/             # Images, fonts, and other static assets
│   ├── components/         # Reusable components
│   ├── config/             # Configuration files
│   │   └── api.js          # API configuration
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js  # Authentication context
│   │   └── CartContext.js  # Shopping cart context
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js # Main navigation setup
│   ├── screens/            # Application screens
│   │   ├── Auth/           # Authentication screens
│   │   ├── Cart/           # Cart and checkout screens
│   │   ├── Home/           # Home and menu screens
│   │   ├── MyOrders/       # Order history screens
│   │   └── Profile/        # User profile screens
│   └── utils/              # Utility functions
├── App.js                  # Main application component
├── app.json                # Application configuration
├── babel.config.js         # Babel configuration
├── index.js                # Application entry point
├── metro.config.js         # Metro bundler configuration
└── package.json            # Project dependencies
```

## Connecting to the Backend

This mobile app is designed to work with the Dabira Foods backend API. Make sure your backend server is running and accessible from your device or emulator.

By default, the app connects to `http://192.168.41.12:5000/api`. You can change this in `src/config/api.js`.

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

The APK file will be generated at `android/app/build/outputs/apk/release/app-release.apk`

### iOS (macOS only)

Build the app using Xcode by opening the `.xcworkspace` file in the `ios` folder.

## Troubleshooting

- **Network errors**: Make sure your backend server is running and accessible from your device or emulator
- **Build errors**: Check that you have the correct versions of Node.js, React Native, and other dependencies
- **Android emulator issues**: Ensure that your Android emulator has internet access and can reach your backend server
- **iOS simulator issues**: Check network settings and make sure your backend server is accessible

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
