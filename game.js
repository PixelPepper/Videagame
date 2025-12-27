// Game Configuration
const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        speed: 3,
        size: 20,
        maxHealth: 100,
        maxMana: 50,
        attackDamage: 15,
        attackRange: 40,
        attackCooldown: 500,
        manaRegen: 0.1
    },
    monster: {
        spawnDistance: 400
    },
    drops: {
        healthPotionChance: 0.08,
        manaPotionChance: 0.08,
        powerUpChance: 0.05,
        goldChance: 0.3
    }
};

// Utility Functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

// Particle System
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.life = 1;
        this.decay = 0.02;
        this.size = randomRange(2, 5);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vy += 0.2; // gravity
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Drop Items
class Drop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 12;
        this.bobOffset = 0;
        this.collected = false;
        
        this.colors = {
            health: '#ff4444',
            mana: '#4444ff',
            powerup: '#ffd700',
            gold: '#ffaa00'
        };
    }

    update() {
        this.bobOffset += 0.1;
    }

    draw(ctx) {
        const bob = Math.sin(this.bobOffset) * 3;
        ctx.save();
        ctx.fillStyle = this.colors[this.type];
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y + bob, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Icon
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { health: '❤', mana: '✦', powerup: '⚡', gold: '⭐' };
        ctx.fillText(icons[this.type], this.x, this.y + bob);
        
        ctx.restore();
    }

    checkCollision(player) {
        return distance(this.x, this.y, player.x, player.y) < this.size + player.size;
    }
}

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.player.size;
        this.speed = CONFIG.player.speed;
        this.health = CONFIG.player.maxHealth;
        this.maxHealth = CONFIG.player.maxHealth;
        this.mana = CONFIG.player.maxMana;
        this.maxMana = CONFIG.player.maxMana;
        this.attackDamage = CONFIG.player.attackDamage;
        this.attackRange = CONFIG.player.attackRange;
        this.attackCooldown = CONFIG.player.attackCooldown;
        this.lastAttackTime = 0;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.gold = 0;
        
        // Upgrades
        this.critChance = 0;
        this.critMultiplier = 2;
        this.lifeSteal = 0;
        this.damageMultiplier = 1;
        this.speedMultiplier = 1;
        this.attackSpeedMultiplier = 1;
    }

    move(dx, dy) {
        this.vx = dx * this.speed * this.speedMultiplier;
        this.vy = dy * this.speed * this.speedMultiplier;
    }

    update(canvas) {
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Keep player in bounds
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));

        // Friction
        this.vx *= 0.9;
        this.vy *= 0.9;

        // Mana regeneration
        this.mana = Math.min(this.maxMana, this.mana + CONFIG.player.manaRegen);
    }

    attack(monsters, particles, currentTime) {
        const cooldown = this.attackCooldown / this.attackSpeedMultiplier;
        if (currentTime - this.lastAttackTime < cooldown) return false;

        this.lastAttackTime = currentTime;
        let hit = false;

        monsters.forEach(monster => {
            const dist = distance(this.x, this.y, monster.x, monster.y);
            if (dist < this.attackRange + this.size + monster.size) {
                let damage = this.attackDamage * this.damageMultiplier;
                
                // Critical hit
                if (Math.random() < this.critChance) {
                    damage *= this.critMultiplier;
                    this.createCritText(monster.x, monster.y);
                }
                
                monster.takeDamage(damage);
                hit = true;

                // Life steal
                if (this.lifeSteal > 0) {
                    this.heal(damage * this.lifeSteal);
                }

                // Hit particles
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(
                        monster.x,
                        monster.y,
                        '#ff4444',
                        {
                            x: randomRange(-3, 3),
                            y: randomRange(-3, 3)
                        }
                    ));
                }
            }
        });

        return hit;
    }

    specialAttack(monsters, particles) {
        const manaCost = 20;
        if (this.mana < manaCost) return false;

        this.mana -= manaCost;

        // Area damage
        monsters.forEach(monster => {
            const dist = distance(this.x, this.y, monster.x, monster.y);
            if (dist < 150) {
                monster.takeDamage(this.attackDamage * 2 * this.damageMultiplier);
                
                for (let i = 0; i < 15; i++) {
                    particles.push(new Particle(
                        monster.x,
                        monster.y,
                        '#4444ff',
                        {
                            x: randomRange(-4, 4),
                            y: randomRange(-4, 4)
                        }
                    ));
                }
            }
        });

        // Special effect particles
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            particles.push(new Particle(
                this.x,
                this.y,
                '#00ffff',
                {
                    x: Math.cos(angle) * 5,
                    y: Math.sin(angle) * 5
                }
            ));
        }

        return true;
    }

    createCritText(x, y) {
        // This would be better with a proper text system
        console.log('CRIT!');
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    restoreMana(amount) {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }

    draw(ctx) {
        ctx.save();
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size, this.size * 0.8, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Player body
        ctx.fillStyle = '#4444ff';
        ctx.strokeStyle = '#6666ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Direction indicator
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle) * this.size,
            this.y + Math.sin(this.angle) * this.size
        );
        ctx.stroke();

        ctx.restore();
    }
}

// Monster Classes
class Monster {
    constructor(x, y, round) {
        this.x = x;
        this.y = y;
        this.round = round;
        this.size = 15;
        this.speed = 1;
        this.health = 30;
        this.maxHealth = 30;
        this.damage = 5;
        this.attackCooldown = 1000;
        this.lastAttackTime = 0;
        this.isDead = false;
        this.color = '#ff4444';
        this.goldValue = 5;
        this.behaviorTimer = 0;
        
        this.scaleWithRound(round);
    }

    scaleWithRound(round) {
        const scale = 1 + (round - 1) * 0.3;
        this.health *= scale;
        this.maxHealth = this.health;
        this.damage *= scale;
        this.speed *= (1 + (round - 1) * 0.1);
        this.goldValue = Math.floor(this.goldValue * scale);
    }

    update(player, currentTime) {
        if (this.isDead) return;

        // Move towards player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // Attack player
        if (dist < this.size + player.size + 5) {
            if (currentTime - this.lastAttackTime > this.attackCooldown) {
                player.takeDamage(this.damage);
                this.lastAttackTime = currentTime;
            }
        }

        this.behaviorTimer += 0.016;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isDead = true;
        }
    }

    draw(ctx) {
        if (this.isDead) return;

        ctx.save();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size, this.size * 0.8, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Monster body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Health bar
        this.drawHealthBar(ctx);

        ctx.restore();
    }

    drawHealthBar(ctx) {
        const barWidth = this.size * 2;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.size - 10;

        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    createDrops(drops) {
        // Gold
        if (Math.random() < CONFIG.drops.goldChance) {
            drops.push(new Drop(this.x, this.y, 'gold'));
        }

        // Health potion
        if (Math.random() < CONFIG.drops.healthPotionChance) {
            drops.push(new Drop(this.x + randomRange(-10, 10), this.y + randomRange(-10, 10), 'health'));
        }

        // Mana potion
        if (Math.random() < CONFIG.drops.manaPotionChance) {
            drops.push(new Drop(this.x + randomRange(-10, 10), this.y + randomRange(-10, 10), 'mana'));
        }

        // Power up
        if (Math.random() < CONFIG.drops.powerUpChance) {
            drops.push(new Drop(this.x + randomRange(-10, 10), this.y + randomRange(-10, 10), 'powerup'));
        }
    }
}

class FastMonster extends Monster {
    constructor(x, y, round) {
        super(x, y, round);
        this.speed *= 1.8;
        this.health *= 0.7;
        this.maxHealth = this.health;
        this.size = 12;
        this.color = '#ff6600';
        this.damage *= 0.8;
    }
}

class TankMonster extends Monster {
    constructor(x, y, round) {
        super(x, y, round);
        this.speed *= 0.5;
        this.health *= 3;
        this.maxHealth = this.health;
        this.size = 22;
        this.color = '#666666';
        this.damage *= 1.5;
        this.goldValue *= 2;
    }
}

class RangedMonster extends Monster {
    constructor(x, y, round) {
        super(x, y, round);
        this.speed *= 0.7;
        this.color = '#9944ff';
        this.attackRange = 150;
        this.projectiles = [];
    }

    update(player, currentTime) {
        if (this.isDead) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Keep distance from player
        if (dist < this.attackRange) {
            this.x -= (dx / dist) * this.speed * 0.5;
            this.y -= (dy / dist) * this.speed * 0.5;
        } else if (dist > this.attackRange + 50) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // Shoot projectiles
        if (dist < this.attackRange + 100 && currentTime - this.lastAttackTime > this.attackCooldown) {
            this.shootProjectile(player);
            this.lastAttackTime = currentTime;
        }

        this.behaviorTimer += 0.016;
    }

    shootProjectile(player) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.projectiles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            size: 5,
            damage: this.damage
        });
    }

    updateProjectiles(player, particles) {
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx;
            proj.y += proj.vy;

            // Check collision with player
            if (distance(proj.x, proj.y, player.x, player.y) < proj.size + player.size) {
                player.takeDamage(proj.damage);
                
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(proj.x, proj.y, '#9944ff', {
                        x: randomRange(-2, 2),
                        y: randomRange(-2, 2)
                    }));
                }
                
                return false;
            }

            // Remove if off screen
            return proj.x > -50 && proj.x < 850 && proj.y > -50 && proj.y < 650;
        });
    }

    draw(ctx) {
        super.draw(ctx);

        // Draw projectiles
        ctx.fillStyle = '#9944ff';
        this.projectiles.forEach(proj => {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class SplitterMonster extends Monster {
    constructor(x, y, round, isSplit = false) {
        super(x, y, round);
        this.color = '#00ff88';
        this.isSplit = isSplit;
        if (!isSplit) {
            this.health *= 1.5;
            this.maxHealth = this.health;
            this.size = 18;
        } else {
            this.size = 10;
            this.speed *= 1.3;
        }
    }

    split(monsters) {
        if (!this.isSplit) {
            // Create two smaller monsters
            monsters.push(new SplitterMonster(this.x + 20, this.y, this.round, true));
            monsters.push(new SplitterMonster(this.x - 20, this.y, this.round, true));
        }
    }
}

// Audio Manager
class AudioManager {
    constructor() {
        this.currentTrack = null;
        this.audioContext = null;
        this.gainNode = null;
        this.musicEnabled = true;
        this.tracks = [];
        this.currentTrackIndex = 0;
        
        this.initAudioContext();
        this.generateTracks();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.3;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    generateTracks() {
        this.tracks = [
            { name: 'Epic Battle', tempo: 140, style: 'intense' },
            { name: 'Dark Dungeon', tempo: 100, style: 'ambient' },
            { name: 'Heroic March', tempo: 120, style: 'heroic' },
            { name: 'Mystic Journey', tempo: 110, style: 'mystical' },
            { name: 'Final Stand', tempo: 160, style: 'boss' }
        ];
    }

    playTrack(index) {
        if (!this.audioContext || !this.musicEnabled) return;

        this.stopTrack();
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        // Generate procedural music based on track style
        this.generateMusic(track);
    }

    generateMusic(track) {
        if (!this.audioContext) return;

        // This is a simplified version - in a real game, you'd load actual audio files
        // For now, we'll create some ambient tones
        const oscillator = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        
        oscillator.type = 'sine';
        oscillator2.type = 'triangle';
        
        // Different frequencies based on style
        const baseFreq = track.style === 'intense' ? 110 : 
                        track.style === 'ambient' ? 65 :
                        track.style === 'heroic' ? 130 : 82;
        
        oscillator.frequency.value = baseFreq;
        oscillator2.frequency.value = baseFreq * 1.5;
        
        const gainNode1 = this.audioContext.createGain();
        const gainNode2 = this.audioContext.createGain();
        
        gainNode1.gain.value = 0.05;
        gainNode2.gain.value = 0.03;
        
        oscillator.connect(gainNode1);
        oscillator2.connect(gainNode2);
        gainNode1.connect(this.gainNode);
        gainNode2.connect(this.gainNode);
        
        oscillator.start();
        oscillator2.start();
        
        this.currentTrack = { oscillator, oscillator2 };
    }

    stopTrack() {
        if (this.currentTrack) {
            try {
                this.currentTrack.oscillator.stop();
                this.currentTrack.oscillator2.stop();
            } catch (e) {}
            this.currentTrack = null;
        }
    }

    toggle() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopTrack();
        } else {
            this.playTrack(this.currentTrackIndex);
        }
        return this.musicEnabled;
    }

    playSound(type) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'hit':
                oscillator.frequency.value = 200;
                oscillator.type = 'square';
                gainNode.gain.value = 0.1;
                break;
            case 'pickup':
                oscillator.frequency.value = 600;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;
                break;
            case 'death':
                oscillator.frequency.value = 100;
                oscillator.type = 'sawtooth';
                gainNode.gain.value = 0.15;
                break;
        }
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
}

// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.player = null;
        this.monsters = [];
        this.drops = [];
        this.particles = [];
        this.round = 1;
        this.kills = 0;
        this.roundKills = 0;
        this.roundGold = 0;
        this.monstersToKill = 10;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.joystick = { active: false, x: 0, y: 0 };
        this.audioManager = new AudioManager();
        
        this.setupControls();
        this.setupMusicMenu();
        
        this.lastTime = 0;
        this.animationId = null;
    }

    setupCanvas() {
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        
        const scale = Math.min(
            rect.width / CONFIG.canvas.width,
            rect.height / CONFIG.canvas.height
        ) * 0.9;
        
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
        this.canvas.style.width = (CONFIG.canvas.width * scale) + 'px';
        this.canvas.style.height = (CONFIG.canvas.height * scale) + 'px';
    }

    setupControls() {
        // Joystick
        const joystickBase = document.getElementById('joystick-base');
        const joystickStick = document.getElementById('joystick-stick');
        
        const handleJoystickStart = (e) => {
            e.preventDefault();
            this.joystick.active = true;
        };
        
        const handleJoystickMove = (e) => {
            if (!this.joystick.active) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            const rect = joystickBase.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = rect.width / 2;
            
            if (distance > maxDistance) {
                dx = (dx / distance) * maxDistance;
                dy = (dy / distance) * maxDistance;
            }
            
            this.joystick.x = dx / maxDistance;
            this.joystick.y = dy / maxDistance;
            
            joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        };
        
        const handleJoystickEnd = (e) => {
            e.preventDefault();
            this.joystick.active = false;
            this.joystick.x = 0;
            this.joystick.y = 0;
            joystickStick.style.transform = 'translate(-50%, -50%)';
        };
        
        joystickBase.addEventListener('touchstart', handleJoystickStart);
        joystickBase.addEventListener('mousedown', handleJoystickStart);
        document.addEventListener('touchmove', handleJoystickMove);
        document.addEventListener('mousemove', handleJoystickMove);
        document.addEventListener('touchend', handleJoystickEnd);
        document.addEventListener('mouseup', handleJoystickEnd);
        
        // Attack button
        const attackBtn = document.getElementById('attack-button');
        attackBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player && this.gameRunning && !this.gamePaused) {
                const hit = this.player.attack(this.monsters, this.particles, Date.now());
                if (hit) this.audioManager.playSound('hit');
            }
        });
        attackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.player && this.gameRunning && !this.gamePaused) {
                const hit = this.player.attack(this.monsters, this.particles, Date.now());
                if (hit) this.audioManager.playSound('hit');
            }
        });
        
        // Special button
        const specialBtn = document.getElementById('special-button');
        specialBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.player && this.gameRunning && !this.gamePaused) {
                const used = this.player.specialAttack(this.monsters, this.particles);
                if (used) this.audioManager.playSound('hit');
            }
        });
        specialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.player && this.gameRunning && !this.gamePaused) {
                const used = this.player.specialAttack(this.monsters, this.particles);
                if (used) this.audioManager.playSound('hit');
            }
        });

        // Keyboard controls (for desktop testing)
        document.addEventListener('keydown', (e) => {
            if (!this.player || !this.gameRunning || this.gamePaused) return;
            
            if (e.key === ' ') {
                e.preventDefault();
                const hit = this.player.attack(this.monsters, this.particles, Date.now());
                if (hit) this.audioManager.playSound('hit');
            } else if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                this.player.specialAttack(this.monsters, this.particles);
            }
        });
    }

    setupMusicMenu() {
        const musicOptions = document.getElementById('music-options');
        this.audioManager.tracks.forEach((track, index) => {
            const option = document.createElement('div');
            option.className = 'music-option';
            if (index === 0) option.classList.add('active');
            option.innerHTML = `
                <span>${track.name}</span>
                <span>${track.tempo} BPM</span>
            `;
            option.addEventListener('click', () => {
                document.querySelectorAll('.music-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.audioManager.playTrack(index);
            });
            musicOptions.appendChild(option);
        });
    }

    start() {
        document.getElementById('start-screen').classList.add('hidden');
        this.gameRunning = true;
        this.gamePaused = false;
        
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.monsters = [];
        this.drops = [];
        this.particles = [];
        this.round = 1;
        this.kills = 0;
        this.roundKills = 0;
        this.roundGold = 0;
        this.monstersToKill = 10;
        
        this.spawnMonstersForRound();
        this.updateHUD();
        
        this.audioManager.playTrack(0);
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    }

    restart() {
        document.getElementById('game-over').classList.add('hidden');
        this.start();
    }

    spawnMonstersForRound() {
        const count = this.monstersToKill;
        const types = [Monster, FastMonster, TankMonster, RangedMonster, SplitterMonster];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = CONFIG.monster.spawnDistance;
            const x = this.canvas.width / 2 + Math.cos(angle) * distance;
            const y = this.canvas.height / 2 + Math.sin(angle) * distance;
            
            // Introduce new monster types as rounds progress
            let availableTypes = [Monster];
            if (this.round >= 2) availableTypes.push(FastMonster);
            if (this.round >= 3) availableTypes.push(TankMonster);
            if (this.round >= 4) availableTypes.push(RangedMonster);
            if (this.round >= 5) availableTypes.push(SplitterMonster);
            
            const MonsterType = availableTypes[randomInt(0, availableTypes.length - 1)];
            this.monsters.push(new MonsterType(x, y, this.round));
        }
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return;

        const currentTime = Date.now();

        // Update player
        if (this.player) {
            this.player.move(this.joystick.x, this.joystick.y);
            this.player.update(this.canvas);
            
            // Update player angle based on joystick
            if (this.joystick.x !== 0 || this.joystick.y !== 0) {
                this.player.angle = Math.atan2(this.joystick.y, this.joystick.x);
            }
        }

        // Update monsters
        this.monsters.forEach(monster => {
            monster.update(this.player, currentTime);
            
            if (monster instanceof RangedMonster) {
                monster.updateProjectiles(this.player, this.particles);
            }
            
            if (monster.isDead && !monster.processed) {
                monster.processed = true;
                this.kills++;
                this.roundKills++;
                monster.createDrops(this.drops);
                this.audioManager.playSound('death');
                
                // Handle splitter
                if (monster instanceof SplitterMonster) {
                    monster.split(this.monsters);
                }
                
                // Create death particles
                for (let i = 0; i < 20; i++) {
                    this.particles.push(new Particle(
                        monster.x,
                        monster.y,
                        monster.color,
                        {
                            x: randomRange(-5, 5),
                            y: randomRange(-5, 5)
                        }
                    ));
                }
            }
        });

        // Remove dead monsters
        this.monsters = this.monsters.filter(m => !m.isDead || m instanceof SplitterMonster);

        // Update drops
        this.drops.forEach(drop => {
            drop.update();
            
            if (!drop.collected && drop.checkCollision(this.player)) {
                drop.collected = true;
                this.collectDrop(drop);
            }
        });

        this.drops = this.drops.filter(d => !d.collected);

        // Update particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);

        // Check round completion
        if (this.roundKills >= this.monstersToKill && this.monsters.length === 0) {
            this.completeRound();
        }

        // Check game over
        if (this.player && this.player.health <= 0) {
            this.gameOver();
        }

        this.updateHUD();
    }

    collectDrop(drop) {
        this.audioManager.playSound('pickup');
        
        switch(drop.type) {
            case 'health':
                this.player.heal(30);
                break;
            case 'mana':
                this.player.restoreMana(25);
                break;
            case 'powerup':
                this.player.attackDamage += 5;
                break;
            case 'gold':
                this.player.gold += randomInt(3, 8);
                this.roundGold += randomInt(3, 8);
                break;
        }
        
        // Pickup particles
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(
                drop.x,
                drop.y,
                drop.colors[drop.type],
                {
                    x: randomRange(-3, 3),
                    y: randomRange(-5, -1)
                }
            ));
        }
    }

    completeRound() {
        this.gamePaused = true;
        this.showUpgradeMenu();
    }

    showUpgradeMenu() {
        const menu = document.getElementById('upgrade-menu');
        const optionsContainer = document.getElementById('upgrade-options');
        
        document.getElementById('round-kills').textContent = this.roundKills;
        document.getElementById('round-gold').textContent = this.roundGold;
        
        optionsContainer.innerHTML = '';
        
        const upgrades = this.generateUpgrades();
        
        upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <h4>${upgrade.name}</h4>
                <p>${upgrade.description}</p>
                <span class="rarity ${upgrade.rarity}">${upgrade.rarity.toUpperCase()}</span>
            `;
            card.addEventListener('click', () => {
                this.applyUpgrade(upgrade);
                menu.classList.add('hidden');
                this.nextRound();
            });
            optionsContainer.appendChild(card);
        });
        
        menu.classList.remove('hidden');
    }

    generateUpgrades() {
        const allUpgrades = [
            { name: 'Health Boost', description: 'Increase max health by 30', rarity: 'common', 
              apply: (p) => { p.maxHealth += 30; p.health += 30; } },
            { name: 'Mana Pool', description: 'Increase max mana by 20', rarity: 'common',
              apply: (p) => { p.maxMana += 20; p.mana += 20; } },
            { name: 'Damage Up', description: 'Increase attack damage by 10', rarity: 'uncommon',
              apply: (p) => p.attackDamage += 10 },
            { name: 'Speed Boost', description: 'Increase movement speed by 20%', rarity: 'uncommon',
              apply: (p) => p.speedMultiplier *= 1.2 },
            { name: 'Attack Speed', description: 'Attack 15% faster', rarity: 'uncommon',
              apply: (p) => p.attackSpeedMultiplier *= 1.15 },
            { name: 'Critical Strike', description: 'Gain 15% critical hit chance', rarity: 'rare',
              apply: (p) => p.critChance += 0.15 },
            { name: 'Life Steal', description: 'Heal for 20% of damage dealt', rarity: 'rare',
              apply: (p) => p.lifeSteal += 0.2 },
            { name: 'Extended Reach', description: 'Increase attack range by 20', rarity: 'rare',
              apply: (p) => p.attackRange += 20 },
            { name: 'Berserker', description: 'Gain 50% damage boost', rarity: 'epic',
              apply: (p) => p.damageMultiplier *= 1.5 },
            { name: 'Full Restore', description: 'Restore all health and mana', rarity: 'epic',
              apply: (p) => { p.health = p.maxHealth; p.mana = p.maxMana; } },
            { name: 'Legendary Power', description: 'Double all stats!', rarity: 'legendary',
              apply: (p) => {
                  p.maxHealth *= 2;
                  p.health *= 2;
                  p.attackDamage *= 2;
                  p.speedMultiplier *= 1.5;
              }
            }
        ];
        
        // Weight by rarity
        const rarityWeights = {
            common: 40,
            uncommon: 30,
            rare: 20,
            epic: 8,
            legendary: 2
        };
        
        const selected = [];
        for (let i = 0; i < 3; i++) {
            const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            let selectedRarity = 'common';
            
            for (const [rarity, weight] of Object.entries(rarityWeights)) {
                random -= weight;
                if (random <= 0) {
                    selectedRarity = rarity;
                    break;
                }
            }
            
            const availableUpgrades = allUpgrades.filter(u => 
                u.rarity === selectedRarity && !selected.includes(u)
            );
            
            if (availableUpgrades.length > 0) {
                selected.push(availableUpgrades[randomInt(0, availableUpgrades.length - 1)]);
            } else {
                selected.push(allUpgrades[randomInt(0, allUpgrades.length - 1)]);
            }
        }
        
        return selected;
    }

    applyUpgrade(upgrade) {
        upgrade.apply(this.player);
    }

    nextRound() {
        this.round++;
        this.roundKills = 0;
        this.roundGold = 0;
        this.monstersToKill = 10 + Math.floor(this.round * 1.5);
        this.gamePaused = false;
        
        // Heal player slightly
        this.player.heal(20);
        this.player.restoreMana(10);
        
        this.spawnMonstersForRound();
        this.updateHUD();
    }

    gameOver() {
        this.gameRunning = false;
        this.gamePaused = true;
        
        document.getElementById('final-round').textContent = this.round;
        document.getElementById('final-kills').textContent = this.kills;
        document.getElementById('game-over').classList.remove('hidden');
        
        this.audioManager.stopTrack();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0f0f1e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw particles
        this.particles.forEach(p => p.draw(this.ctx));

        // Draw drops
        this.drops.forEach(d => d.draw(this.ctx));

        // Draw monsters
        this.monsters.forEach(m => m.draw(this.ctx));

        // Draw player
        if (this.player) {
            this.player.draw(this.ctx);
            
            // Draw attack range indicator
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.attackRange + this.player.size, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    updateHUD() {
        if (!this.player) return;

        // Health
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent = 
            `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;

        // Mana
        const manaPercent = (this.player.mana / this.player.maxMana) * 100;
        document.getElementById('mana-fill').style.width = manaPercent + '%';
        document.getElementById('mana-text').textContent = 
            `${Math.ceil(this.player.mana)}/${this.player.maxMana}`;

        // Stats
        document.getElementById('round-number').textContent = this.round;
        document.getElementById('kill-count').textContent = this.kills;
        document.getElementById('gold-count').textContent = this.player.gold;
    }

    toggleMusic() {
        const enabled = this.audioManager.toggle();
        document.getElementById('music-toggle').textContent = enabled ? '🔊' : '🔇';
    }

    openMusicMenu() {
        document.getElementById('music-menu').classList.remove('hidden');
    }

    closeMusicMenu() {
        document.getElementById('music-menu').classList.add('hidden');
    }

    gameLoop(timestamp = 0) {
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Initialize game
const game = new Game();

// Handle window resize
window.addEventListener('resize', () => {
    game.setupCanvas();
});

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, { passive: false });
