# Android Studio Setup Guide

This guide provides detailed instructions for setting up and running the Dabira Foods mobile app in Android Studio.

## Prerequisites

1. **Android Studio**: Download and install the latest version of [Android Studio](https://developer.android.com/studio)
2. **JDK 11+**: Ensure you have JDK 11 or newer installed
3. **Node.js**: Version 16 or newer
4. **npm or yarn**: Latest stable version

## Initial Setup

### 1. Configure Android Studio

1. Open Android Studio
2. Go to **File > Settings > Build, Execution, Deployment > Build Tools > Gradle**
3. Make sure the Gradle JDK is set to version 11 or newer
4. Go to **File > Settings > Appearance & Behavior > System Settings > Android SDK**
5. Ensure you have the following installed:
   - Android SDK Platform for API level 33 (or the latest stable)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (HAXM) or Android Emulator Hypervisor Driver

### 2. Configure Environment Variables

1. Set `ANDROID_HOME` environment variable to your Android SDK location
   - Windows: `C:\Users\<username>\AppData\Local\Android\Sdk`
   - macOS: `~/Library/Android/sdk`
   - Linux: `~/Android/Sdk`

2. Add the following to your PATH:
   - Windows:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     ```
   - macOS/Linux:
     ```
     $ANDROID_HOME/platform-tools
     $ANDROID_HOME/emulator
     ```

## Opening the Project in Android Studio

1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to the `mobile_new/android` directory and select it
4. Wait for Gradle sync to complete

## Running the App from Android Studio

### 1. Create an Android Virtual Device (AVD)

1. Go to **Tools > AVD Manager**
2. Click "Create Virtual Device"
3. Select a device definition (e.g., Pixel 6)
4. Select a system image (e.g., Android 13.0)
5. Complete the AVD creation process

### 2. Start the Metro Bundler

Before running the app from Android Studio, you need to start the Metro bundler:

1. Open a terminal
2. Navigate to the project root directory
3. Run:
   ```bash
   npm start
   # or
   yarn start
   ```

### 3. Run the App

1. In Android Studio, select your AVD from the device dropdown
2. Click the "Run" button (green triangle)
3. Wait for the app to build and install on the emulator

## Troubleshooting

### Build Issues

1. **Gradle Sync Failed**:
   - Try "File > Invalidate Caches / Restart"
   - Check your internet connection
   - Make sure you have the correct JDK version

2. **Missing SDK Components**:
   - Open the SDK Manager and install any missing components

3. **Execution failed for task ':app:processDebugResources'**:
   - Update your Android SDK Build-Tools to the latest version

### Emulator Issues

1. **Emulator is slow**:
   - Enable hardware acceleration (HAXM or KVM)
   - Allocate more RAM to the emulator
   - Use a simpler device profile

2. **App crashes immediately**:
   - Check the logcat output for error details
   - Make sure Metro bundler is running
   - Check for any native module issues

### Connection Issues

1. **Cannot connect to Metro bundler**:
   - Make sure Metro is running on the correct port (8081)
   - Check your firewall settings
   - Try using the `adb reverse tcp:8081 tcp:8081` command

2. **Cannot connect to backend API**:
   - Verify the API URL in `src/config/api.js`
   - Make sure the IP address is accessible from the emulator
   - Try using `10.0.2.2` instead of `localhost` for the emulator

## Generating a Signed APK

1. In Android Studio, go to **Build > Generate Signed Bundle / APK**
2. Select "APK"
3. Create a new keystore or use an existing one
4. Fill in the required information
5. Select a destination folder
6. Choose build variant (release)
7. Click "Finish"

The signed APK will be generated in the specified destination folder.

## Debugging Tips

1. **React Native Debugger**:
   - Enable debugging in the app's developer menu
   - Use Chrome DevTools for JavaScript debugging

2. **Native Code Debugging**:
   - Use Android Studio's built-in debugger
   - Set breakpoints in Java/Kotlin files

3. **Layout Issues**:
   - Use Android Studio's Layout Inspector
   - Enable "Show layout bounds" in Developer Options

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/environment-setup)
- [Android Developer Documentation](https://developer.android.com/docs)
- [Android Studio Documentation](https://developer.android.com/studio/intro)
