# 🗡️ Dungeon Survivor - Roguelike Game

A thrilling roguelike dungeon survival game for Android devices! Battle waves of monsters, collect powerful upgrades, and see how long you can survive!

## 🎮 Features

### Core Gameplay
- **Roguelike Mechanics**: Procedurally challenging rounds that get progressively harder
- **Round-Based Progression**: Complete rounds to unlock powerful upgrades
- **Multiple Monster Types**:
  - **Basic Monsters**: Standard enemies
  - **Fast Monsters**: Quick but fragile (Round 2+)
  - **Tank Monsters**: Slow but heavily armored (Round 3+)
  - **Ranged Monsters**: Shoot projectiles from a distance (Round 4+)
  - **Splitter Monsters**: Split into smaller enemies on death (Round 5+)

### Combat System
- Melee attacks with cooldown
- Special ability (mana-based AoE attack)
- Dynamic difficulty scaling each round
- Visual attack range indicator

### Drop System
All monsters have a chance to drop:
- **Health Potions** (8% drop rate) - Restore 30 HP
- **Mana Potions** (8% drop rate) - Restore 25 mana
- **Power-Ups** (5% drop rate) - Permanently increase attack damage
- **Gold** (30% drop rate) - Currency for future features

### Upgrade System
After each round, choose from 3 random upgrades with varying rarities:

**Common Upgrades:**
- Health Boost (+30 max HP)
- Mana Pool (+20 max mana)

**Uncommon Upgrades:**
- Damage Up (+10 attack damage)
- Speed Boost (+20% movement speed)
- Attack Speed (+15% faster attacks)

**Rare Upgrades:**
- Critical Strike (+15% crit chance)
- Life Steal (20% of damage as healing)
- Extended Reach (+20 attack range)

**Epic Upgrades:**
- Berserker (+50% damage multiplier)
- Full Restore (restore all health and mana)

**Legendary Upgrades:**
- Legendary Power (double all stats!)

### Music System
- **5 Procedurally Generated Tracks**:
  1. Epic Battle (140 BPM - Intense)
  2. Dark Dungeon (100 BPM - Ambient)
  3. Heroic March (120 BPM - Heroic)
  4. Mystic Journey (110 BPM - Mystical)
  5. Final Stand (160 BPM - Boss Battle)
- Toggle music on/off
- Select tracks from the music menu
- Uses Web Audio API for real-time sound generation

### Mobile Controls
- **Virtual Joystick**: Move your character
- **Attack Button**: Perform melee attacks
- **Special Button**: Use mana-powered AoE attack
- Touch-optimized UI with visual feedback
- Landscape orientation for best experience

## 🚀 Getting Started

### Playing in Browser

The easiest way to test the game is in a web browser:

1. Start a local server:
```bash
python3 -m http.server 8000
```

2. Open your browser to:
```
http://localhost:8000
```

3. For mobile testing, find your local IP and access from your phone on the same network

### Building for Android

#### Prerequisites
- Node.js and npm installed
- Android Studio with Android SDK
- ANDROID_SDK_ROOT or ANDROID_HOME environment variable set
- Java Development Kit (JDK) 11 or higher

#### Quick Build

Use the provided build script:

```bash
./build-android.sh
```

This script will:
1. Install Cordova if needed
2. Create a Cordova project
3. Copy game files
4. Add Android platform
5. Build the APK

#### Manual Build

If you prefer to build manually:

```bash
# Install Cordova globally
npm install -g cordova

# Create Cordova project
cordova create android-build com.dungeonsurvior.game DungeonSurvivor

# Copy files
cp index.html styles.css game.js android-build/www/
cp config.xml android-build/

# Navigate to project
cd android-build

# Add Android platform
cordova platform add android

# Build release APK
cordova build android --release

# Or build and run on connected device
cordova run android
```

The APK will be located at:
```
android-build/platforms/android/app/build/outputs/apk/release/
```

#### Installing on Device

**Via USB:**
1. Enable USB debugging on your Android device
2. Connect device via USB
3. Run: `cordova run android`

**Manual Installation:**
1. Copy the APK to your device
2. Enable "Install from Unknown Sources" in settings
3. Tap the APK file to install

## 🎯 How to Play

### Controls
- **Move**: Use the virtual joystick (bottom left)
- **Attack**: Tap the sword button (bottom right)
- **Special**: Tap the star button (next to attack)
- **Music**: Tap the speaker icon (top right)

### Gameplay Tips
1. **Keep Moving**: Don't let monsters surround you
2. **Use Special Wisely**: It costs mana but deals massive AoE damage
3. **Collect Drops**: Health and mana potions are crucial for survival
4. **Choose Upgrades Carefully**: Balance offense and defense
5. **Watch Your Health**: There's no respawn - survive as long as you can!

### Strategy
- **Early Rounds**: Focus on damage upgrades to kill monsters quickly
- **Mid Rounds**: Balance survivability (health/life steal) with damage
- **Late Rounds**: Prioritize life steal and critical hits for sustainability

## 📁 Project Structure

```
/workspace/
├── index.html              # Main game HTML
├── styles.css              # Game styling and UI
├── game.js                 # Core game engine
├── package.json            # npm configuration
├── config.xml              # Cordova configuration
├── capacitor.config.json   # Capacitor configuration
├── manifest.json           # PWA manifest
├── build-android.sh        # Android build script
├── create-icon.html        # Icon generator
└── README.md              # This file
```

## 🛠️ Technical Details

### Architecture
- **Pure HTML5/JavaScript/CSS** - No frameworks required
- **Canvas API** - For 2D rendering
- **Web Audio API** - For procedural music generation
- **Touch Events** - Mobile-optimized controls
- **Cordova** - Android packaging

### Game Engine Features
- Object-oriented design with ES6 classes
- Particle system for visual effects
- Collision detection system
- Round-based state management
- Dynamic difficulty scaling
- Procedural upgrade generation

### Performance
- Optimized rendering with requestAnimationFrame
- Efficient particle pooling
- Minimal DOM manipulation
- Canvas-based rendering for smooth 60 FPS

## 🎨 Customization

### Adding New Monster Types

Edit `game.js` and create a new class:

```javascript
class YourMonster extends Monster {
    constructor(x, y, round) {
        super(x, y, round);
        this.color = '#yourcolor';
        // Customize stats
    }
}
```

Then add it to the spawn system in `spawnMonstersForRound()`.

### Adding New Upgrades

Add to the `allUpgrades` array in `generateUpgrades()`:

```javascript
{
    name: 'Your Upgrade',
    description: 'What it does',
    rarity: 'rare',
    apply: (player) => {
        // Modify player stats
    }
}
```

### Adjusting Difficulty

Modify the `CONFIG` object at the top of `game.js`:

```javascript
const CONFIG = {
    player: {
        maxHealth: 100,  // Starting health
        attackDamage: 15, // Base damage
        // ... more settings
    },
    drops: {
        healthPotionChance: 0.08, // 8% drop rate
        // ... more drop rates
    }
};
```

## 🐛 Troubleshooting

### Game Won't Load
- Check browser console for errors
- Ensure all three files (HTML, CSS, JS) are in the same directory
- Try a different browser (Chrome/Firefox recommended)

### Android Build Fails
- Verify Android SDK is installed
- Check ANDROID_SDK_ROOT environment variable
- Ensure JDK 11+ is installed
- Run `cordova requirements` to check dependencies

### Performance Issues
- Close other apps when playing
- Lower the number of particles in game.js
- Reduce monster count per round

### Touch Controls Not Working
- Ensure device supports touch events
- Try in landscape mode
- Check browser compatibility

## 📱 Compatibility

### Browsers
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Android
- Android 7.0 (API 24) or higher
- Recommended: Android 10.0 or higher
- Works on phones and tablets

## 🔄 Future Enhancements

Potential features to add:
- [ ] Boss battles every 5 rounds
- [ ] Multiple character classes
- [ ] Permanent progression (meta-upgrades)
- [ ] Achievement system
- [ ] Leaderboards
- [ ] More music tracks
- [ ] Additional monster types
- [ ] Special weapons/items
- [ ] Particle effects optimization
- [ ] Save/load system

## 📄 License

MIT License - Feel free to modify and distribute!

## 🙏 Credits

Created as a roguelike mobile game demonstration.

- Game Design: Roguelike mechanics
- Programming: Pure JavaScript with HTML5 Canvas
- Music: Procedurally generated with Web Audio API

## 🎮 Have Fun!

Survive as long as you can and climb the leaderboard! Each round brings new challenges and opportunities for power. Will you become the ultimate Dungeon Survivor?

---

**Made with ❤️ for roguelike fans everywhere!**
