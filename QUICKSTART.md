# 🚀 Quick Start Guide - Dungeon Survivor

## Play NOW (Fastest Method)

### Option 1: Direct Browser Play
1. Open `index.html` directly in your browser
2. Start playing immediately!

### Option 2: Local Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: Test Page
Open `test-game.html` for a test interface with quick launch buttons

---

## 🎮 Controls

| Control | Action |
|---------|--------|
| **Joystick** (bottom left) | Move character |
| **⚔️ Button** (bottom right) | Attack enemies |
| **✨ Button** (right side) | Special ability (costs mana) |
| **🔊 Button** (top right) | Toggle music |

---

## 📱 Build for Android

### Prerequisites Check
```bash
# Check Node.js
node --version  # Need v14+

# Check Java
java -version   # Need JDK 11+

# Check Android SDK
echo $ANDROID_SDK_ROOT  # Should show path
```

### One-Command Build
```bash
./build-android.sh
```

### Install on Phone
```bash
# Via USB (with USB debugging enabled)
cd android-build
cordova run android

# Or manually install APK from:
# android-build/platforms/android/app/build/outputs/apk/release/
```

---

## 🎯 Gameplay Tips

### Early Game (Rounds 1-3)
- Focus on **damage upgrades**
- Learn enemy patterns
- Collect all drops

### Mid Game (Rounds 4-7)
- Balance offense and defense
- Get **life steal** if available
- Save mana for emergencies

### Late Game (Round 8+)
- **Critical hits** are essential
- Use special ability strategically
- Keep moving to avoid being surrounded

---

## 🐛 Troubleshooting

**Game won't load?**
- Use a modern browser (Chrome/Firefox recommended)
- Check browser console (F12) for errors
- Make sure all 3 files are in same folder (HTML, CSS, JS)

**Android build fails?**
- Install Android Studio first
- Set ANDROID_SDK_ROOT environment variable
- Run: `cordova requirements` to check setup

**Touch controls not working?**
- Use landscape mode
- Make sure touch events aren't blocked
- Try refreshing the page

---

## 📊 Game Stats

| Feature | Value |
|---------|-------|
| Monster Types | 5 unique varieties |
| Upgrade Rarities | 5 tiers (Common to Legendary) |
| Music Tracks | 5 procedural themes |
| Drop Types | 4 (Health, Mana, Power, Gold) |
| Base Drop Rate | 5-30% depending on type |

---

## 🎵 Music Tracks

1. **Epic Battle** - Fast-paced combat music
2. **Dark Dungeon** - Atmospheric ambient
3. **Heroic March** - Uplifting adventure
4. **Mystic Journey** - Mysterious exploration
5. **Final Stand** - Intense boss battle

Select from the music menu on the start screen!

---

## 🏆 Challenge Yourself

- Survive 10 rounds
- Reach 100 kills
- Beat your high score
- Try different upgrade paths

---

**Ready? Launch index.html and start your adventure!** 🗡️
