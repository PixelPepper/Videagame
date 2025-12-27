#!/bin/bash

echo "====================================="
echo "Dungeon Survivor - Android Build Script"
echo "====================================="
echo ""

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "Cordova is not installed. Installing..."
    npm install -g cordova
fi

# Check if Android SDK is installed
if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    echo "WARNING: Android SDK not found!"
    echo "Please install Android Studio and set ANDROID_SDK_ROOT or ANDROID_HOME"
    echo "Download from: https://developer.android.com/studio"
    exit 1
fi

echo "Step 1: Creating Cordova project..."
if [ ! -d "android-build" ]; then
    cordova create android-build com.dungeonsurvior.game DungeonSurvivor
    echo "Cordova project created"
else
    echo "Cordova project already exists"
fi

echo ""
echo "Step 2: Copying game files..."
cp index.html android-build/www/
cp styles.css android-build/www/
cp game.js android-build/www/
cp config.xml android-build/
if [ -f "icon.png" ]; then
    cp icon.png android-build/
fi

echo ""
echo "Step 3: Adding Android platform..."
cd android-build
if ! cordova platform list | grep -q "android"; then
    cordova platform add android
    echo "Android platform added"
else
    echo "Android platform already exists"
fi

echo ""
echo "Step 4: Building APK..."
cordova build android --release

echo ""
echo "====================================="
echo "Build complete!"
echo "====================================="
echo "APK location: android-build/platforms/android/app/build/outputs/apk/release/"
echo ""
echo "To install on device:"
echo "1. Enable USB debugging on your Android device"
echo "2. Connect device via USB"
echo "3. Run: cordova run android"
echo ""
echo "Or manually install the APK from the location above"
