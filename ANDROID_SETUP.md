# 📱 Setup Guide for Android Galaxy S24

## 🎮 Play the Game on Your Phone - Multiple Options

### Option 1: Simple HTTP Server App (RECOMMENDED)

This is the best way to play the game with full functionality.

**Step 1: Install "Simple HTTP Server" App**
1. Open **Google Play Store** on your Galaxy S24
2. Search for **"Simple HTTP Server"** or **"HTTP Server"**
3. Install one of these apps:
   - "Simple HTTP Server" by Vlad Varnavin
   - "Servers Ultimate" (free version)
   - "HTTP Server" by Core Mobile

**Step 2: Transfer Game Files to Your Phone**
1. Connect your phone to computer via USB
2. Copy the entire game folder to:
   - `/Internal Storage/Download/DungeonSurvivor/`
   - OR `/Internal Storage/Documents/DungeonSurvivor/`

Files to copy:
- `index.html`
- `game.js`
- `styles.css`
- `icon.svg` (optional)

**Step 3: Start the Server**
1. Open the HTTP Server app
2. Set the **Root Directory** to where you copied the files
3. Tap **Start Server**
4. Note the address (usually `http://localhost:8080` or similar)

**Step 4: Play!**
1. Open Chrome or Samsung Internet
2. Go to the server address (e.g., `http://localhost:8080`)
3. Start playing! 🎮

---

### Option 2: Direct File Access (QUICK BUT LIMITED)

**Step 1: Copy Files to Phone**
1. Connect Galaxy S24 to computer via USB
2. Copy these 3 files to `/Internal Storage/Download/`:
   - `index.html`
   - `game.js`
   - `styles.css`

**Step 2: Open in Browser**
1. Open **My Files** app on your phone
2. Go to **Downloads** folder
3. Tap `index.html`
4. Select "Open with Chrome" or "Samsung Internet"
5. Game should load!

⚠️ **Note:** Some features may not work with `file://` protocol, so use Option 1 if possible.

---

### Option 3: Build Full Android APK (BEST EXPERIENCE)

If you have a computer available, you can build a real Android app:

**On Your Computer:**

1. **Install Prerequisites:**
```bash
# Install Node.js (from nodejs.org)
# Install Android Studio (from developer.android.com)
# Set up Android SDK
```

2. **Build the APK:**
```bash
cd /path/to/game/folder
./build-android.sh
```

3. **Transfer APK to Phone:**
   - Connect Galaxy S24 via USB
   - Copy APK from:
     `android-build/platforms/android/app/build/outputs/apk/release/`
   - Paste to phone's `Download` folder

**On Your Galaxy S24:**

1. **Enable Installation:**
   - Go to: **Settings** → **Security** → **Install Unknown Apps**
   - Allow **My Files** or **Chrome** to install apps

2. **Install the Game:**
   - Open **My Files** app
   - Go to **Downloads**
   - Tap the APK file
   - Tap **Install**
   - Tap **Open** to play!

---

### Option 4: Use GitHub Pages (ONLINE)

If you want to play without any setup:

**Step 1: Upload to GitHub**
1. Create a GitHub account (if you don't have one)
2. Create a new repository called "dungeon-survivor"
3. Upload these files:
   - `index.html`
   - `game.js`
   - `styles.css`

**Step 2: Enable GitHub Pages**
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Select **main** branch
4. Click **Save**

**Step 3: Play!**
1. GitHub will give you a URL like:
   `https://yourusername.github.io/dungeon-survivor/`
2. Open that URL on your Galaxy S24
3. Bookmark it for easy access!

---

## 🎯 Recommended Setup for Galaxy S24

### For Quick Testing:
→ Use **Option 2** (Direct File Access)

### For Best Performance:
→ Use **Option 1** (HTTP Server App)

### For Full App Experience:
→ Use **Option 3** (Build APK)

### For Easy Sharing:
→ Use **Option 4** (GitHub Pages)

---

## 🎮 Gameplay Tips for Touchscreen

Since you're playing on a Galaxy S24:

1. **Hold Phone in Landscape Mode** - Game is optimized for landscape
2. **Use Two Thumbs:**
   - Left thumb on joystick (movement)
   - Right thumb on attack/special buttons
3. **Enable Full Screen:**
   - Tap the menu button in Chrome
   - Select "Add to Home Screen"
   - Launch from home screen for fullscreen experience

---

## 🔧 Troubleshooting on Galaxy S24

**Game won't load?**
- Make sure all 3 files (HTML, CSS, JS) are in the same folder
- Try Chrome instead of Samsung Internet
- Clear browser cache and reload

**Touch controls not working?**
- Make sure you're in landscape mode
- Try tapping directly on the joystick base
- Refresh the page

**Music not playing?**
- Tap the music toggle button (top right)
- Check phone volume
- Some browsers require user interaction first - tap anywhere on screen

**Performance issues?**
- Close other apps
- Restart your phone
- Use Chrome for best performance

---

## 📱 Galaxy S24 Specific Features

Your S24 has great specs for gaming:

- **120Hz Display** - Smooth gameplay!
- **Powerful Processor** - No lag
- **Large Screen** - Easy to see and control

**Optimize for S24:**
1. Enable **Game Mode** (Settings → Advanced Features → Game Launcher)
2. Add the game to Game Launcher for better performance
3. Use **High Performance Mode** for best experience

---

## 🚀 Quick Start Summary

**Fastest Way to Play RIGHT NOW:**

1. Copy `index.html`, `game.js`, `styles.css` to your phone
2. Open **My Files** app
3. Navigate to where you copied them
4. Tap `index.html`
5. Choose "Open with Chrome"
6. Start playing! 🎮

---

**Need Help?** Check the other documentation files:
- `QUICKSTART.md` - General quick start
- `GAME_README.md` - Full documentation
- `FEATURES.md` - Complete feature list
