# 🗡️ Dungeon Survivor - Roguelike Android Game

A complete roguelike dungeon survival game for Android with progressive difficulty, diverse monsters, upgrades, and music!

## 🚀 Quick Start

**Play Instantly:**
```bash
# Open in browser
open index.html

# OR start local server
python3 -m http.server 8000
```

**Build Android APK:**
```bash
./build-android.sh
```

## ✨ Features

### Gameplay
- ✅ **Roguelike mechanics** - Progressive difficulty each round
- ✅ **5 Monster types** - Each with unique mechanics
- ✅ **11 Upgrades** - Common to Legendary rarities
- ✅ **4 Drop types** - Health, Mana, Power-ups, Gold
- ✅ **Round system** - Choose upgrades between rounds
- ✅ **Touch controls** - Mobile-optimized joystick & buttons

### Monster Variety
1. **Basic Monster** (Round 1+) - Standard enemy
2. **Fast Monster** (Round 2+) - Quick but fragile
3. **Tank Monster** (Round 3+) - Heavily armored
4. **Ranged Monster** (Round 4+) - Shoots projectiles
5. **Splitter Monster** (Round 5+) - Divides on death

### Music System
- 5 procedurally generated tracks
- Full track selector menu
- Toggle on/off anytime
- Web Audio API powered

## 🎮 Controls

| Control | Action |
|---------|--------|
| Joystick (Bottom Left) | Move character |
| ⚔️ Button (Bottom Right) | Attack enemies |
| ✨ Button (Right) | Special AoE ability |
| 🔊 Button (Top Right) | Toggle music |

## 📦 Project Structure

```
├── index.html              Main game file
├── game.js                 Game engine (1,268 lines)
├── styles.css              Mobile UI styling
├── config.xml              Android configuration
├── build-android.sh        APK build script
├── GAME_README.md          Full documentation
├── QUICKSTART.md           Quick start guide
└── FEATURES.md             Complete feature list
```

## 📱 Build for Android

**Prerequisites:**
- Android Studio with SDK
- ANDROID_SDK_ROOT environment variable
- Node.js and npm
- Java JDK 11+

**Build:**
```bash
./build-android.sh
```

**Install:**
```bash
cd android-build
cordova run android
```

Or manually install APK from:
`android-build/platforms/android/app/build/outputs/apk/release/`

## 📊 Game Stats

- **Monster Types:** 5 unique varieties
- **Upgrades:** 11 across 5 rarity tiers
- **Drop Types:** 4 (rates: 5-30%)
- **Music Tracks:** 5 themes
- **Lines of Code:** 1,779
- **Features:** 100+

## 🎯 Gameplay Tips

1. **Early Game** - Focus on damage upgrades
2. **Mid Game** - Balance offense and defense
3. **Late Game** - Prioritize life steal and crits
4. **Always** - Keep moving to avoid being surrounded!

## 📖 Documentation

- **QUICKSTART.md** - Quick start guide
- **GAME_README.md** - Full game documentation
- **FEATURES.md** - Complete feature list
- **PROJECT_SUMMARY.md** - Technical summary
- **START_HERE.txt** - Welcome message

## 🛠️ Customization

Edit `game.js` CONFIG object:
```javascript
const CONFIG = {
    player: {
        maxHealth: 100,
        attackDamage: 15,
        // ... more settings
    },
    drops: {
        healthPotionChance: 0.08,
        // ... more rates
    }
};
```

## ✅ Requirements Fulfilled

- ✅ Roguelike gameplay with continuous waves
- ✅ Round-end upgrade menus
- ✅ Progressive difficulty scaling
- ✅ Multiple monster types with varied mechanics
- ✅ Random drops with balanced rates
- ✅ Music system with track selection
- ✅ Mobile touch controls
- ✅ Android APK packaging

## 🏆 Challenge

Can you survive past **Round 10**?

## 📄 License

MIT License - Feel free to modify and distribute!

---

**🗡️ Ready to battle? Open `index.html` and start your adventure!**

For complete documentation, see [GAME_README.md](GAME_README.md)
