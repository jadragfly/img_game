/**
 * 玩家角色控制器
 * 处理玩家输入、物理移动、动画和战斗
 */

import { SpriteAnimator } from '../lib/sprite-system.js?v=3';
import { GameAudio } from '../lib/audio.js?v=3';

const DEBUG = true;

function debug(...args) {
    if (DEBUG) console.log('[Player]', ...args);
}

class Player {
    constructor(gameEngine, x, y) {
        this.engine = gameEngine;
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;

        this.width = 96;
        this.height = 104;
        this.scale = 0.8;

        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.friction = 0.85;

        this.isOnGround = false;
        this.facingRight = true;
        this.isAttacking = false;
        this.isCrouching = false;
        this.health = 100;
        this.maxHealth = 100;

        this.animator = null;
        this.config = null;

        this.bullets = [];
        this.shootCooldown = 0;
        this.attackCooldown = 0;
        this.invincible = false;
        this.invincibleTime = 0;

        this.dead = false;
        this.animationQueue = [];

        this.stepTimer = 0;
        this.frameCount = 0;

        this.audio = new GameAudio();

        this.setupInput();
    }

    setupInput() {
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false,
            attack: false
        };
    }

    async init(configPath) {
        debug('加载角色配置:', configPath);
        const response = await fetch(configPath);
        this.config = await response.json();
        debug('角色配置:', this.config);

        const spritePath = configPath.replace('character.json', this.config.spritesheetPath);
        debug('精灵图路径:', spritePath);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                debug('精灵图加载成功');
                this.animator = new SpriteAnimator(img, {
                    frameWidth: this.config.frameWidth,
                    frameHeight: this.config.frameHeight,
                    columns: this.config.columns,
                    frameSpeed: 120
                });

                for (const [name, anim] of Object.entries(this.config.animations)) {
                    debug('注册动画:', name, anim);
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = (e) => {
                debug('精灵图加载失败', e);
                reject(e);
            };
            img.src = spritePath;
        });
    }

    update(deltaTime) {
        if (this.dead) return;

        this.frameCount++;

        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.invincibleTime > 0) {
            this.invincibleTime--;
            if (this.invincibleTime === 0) {
                this.invincible = false;
            }
        }

        this.readInput();

        if (this.frameCount % 60 === 0) {
            debug('输入状态:', this.input);
            debug('Engine keys:', this.engine.keys);
        }

        if (this.input.down && this.isOnGround && !this.isAttacking) {
            this.isCrouching = true;
            this.vx *= 0.5;
        } else {
            this.isCrouching = false;
        }

        if (!this.isCrouching && !this.isAttacking) {
            if (this.input.left) {
                this.vx = -this.speed;
                this.facingRight = false;
            } else if (this.input.right) {
                this.vx = this.speed;
                this.facingRight = true;
            } else {
                this.vx *= this.friction;
            }

            if (this.input.up && this.isOnGround) {
                this.vy = this.jumpForce;
                this.isOnGround = false;
                this.audio.playJump();
                debug('跳跃!');
            }
        }

        if (this.input.shoot && this.shootCooldown === 0 && !this.isCrouching) {
            this.shoot();
        }

        if (this.input.attack && this.attackCooldown === 0 && !this.isCrouching && !this.input.down) {
            this.attack();
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.height >= this.engine.groundY) {
            this.y = this.engine.groundY - this.height;
            this.vy = 0;
            this.isOnGround = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > this.engine.width - this.width) {
            this.x = this.engine.width - this.width;
        }

        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            return bullet.x > -100 && bullet.x < this.engine.width + 200;
        });

        if (this.frameCount % 60 === 0) {
            debug('子弹数量:', this.bullets.length);
        }

        if (Math.abs(this.vx) > 0.5 && this.isOnGround) {
            this.stepTimer++;
            if (this.stepTimer > 15) {
                this.audio.playStep();
                this.stepTimer = 0;
            }
        }

        this.updateAnimation();
    }

    readInput() {
        this.input.left = this.engine.isKeyPressed('ArrowLeft');
        this.input.right = this.engine.isKeyPressed('ArrowRight');
        this.input.up = this.engine.isKeyPressed('ArrowUp');
        this.input.down = this.engine.isKeyPressed('ArrowDown');
        this.input.shoot = this.engine.isKeyPressed('KeyX');
        this.input.attack = this.engine.isKeyPressed('KeyZ');
    }

    updateAnimation() {
        if (!this.animator) return;

        let animName = 'idle';

        if (this.isAttacking) {
            animName = 'attack';
        } else if (this.isCrouching) {
            animName = 'crouch';
        } else if (!this.isOnGround) {
            animName = 'jump';
        } else if (Math.abs(this.vx) > 0.5) {
            animName = this.facingRight ? 'walk-right' : 'walk-left';
        }

        this.animator.play(animName);
    }

    shoot() {
        this.shootCooldown = 15;
        const bulletSpeed = 15;
        const bulletDir = this.facingRight ? 1 : -1;

        const bullet = {
            x: this.x + (this.facingRight ? this.width * this.scale : 0),
            y: this.y + this.height * this.scale / 2 - 3,
            vx: bulletSpeed * bulletDir,
            width: 20,
            height: 6
        };

        this.bullets.push(bullet);
        debug('射击! 子弹:', bullet);

        this.audio.playShoot();

        this.engine.createParticleEmitter(
            this.x + (this.facingRight ? this.width * this.scale : 0),
            this.y + this.height * this.scale / 2,
            {
                count: 5,
                speed: 3,
                life: 10,
                color: '#ff0',
                size: 2
            }
        );
    }

    attack() {
        this.attackCooldown = 30;
        this.isAttacking = true;
        this.vx = 0;

        this.audio.playAttack();
        debug('近身攻击!');

        this.engine.createParticleEmitter(
            this.x + (this.facingRight ? this.width * this.scale : 0),
            this.y + this.height * this.scale / 2,
            {
                count: 15,
                speed: 8,
                life: 15,
                color: '#0f0',
                size: 4,
                gravity: 0.1
            }
        );

        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    }

    takeDamage(amount) {
        if (this.invincible) return;

        this.health -= amount;
        this.invincible = true;
        this.invincibleTime = 60;

        this.audio.playHurt();
        this.engine.shake(10, 15);

        this.engine.createParticleEmitter(
            this.x + this.width * this.scale / 2,
            this.y + this.height * this.scale / 2,
            {
                count: 20,
                speed: 6,
                life: 30,
                color: '#f00',
                size: 3,
                gravity: 0.3
            }
        );

        debug('玩家受伤! 生命:', this.health);

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.dead = true;
        this.vx = 0;
        this.vy = 0;

        this.audio.playExplosion();

        this.engine.createParticleEmitter(
            this.x + this.width * this.scale / 2,
            this.y + this.height * this.scale / 2,
            {
                count: 50,
                speed: 10,
                life: 60,
                color: '#f80',
                size: 5,
                gravity: 0.2
            }
        );
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.health = this.maxHealth;
        this.dead = false;
        this.invincible = true;
        this.invincibleTime = 120;
        this.isOnGround = true;
        this.vx = 0;
        this.vy = 0;
    }

    draw(ctx) {
        if (this.dead) return;

        ctx.save();

        if (this.invincible && Math.floor(this.invincibleTime / 4) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.animator) {
            this.animator.draw(ctx, this.x, this.y, this.scale, !this.facingRight);
        }

        ctx.fillStyle = '#ff0';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 10;
        this.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x + 10,
            y: this.y + 10,
            width: this.width * this.scale - 20,
            height: this.height * this.scale - 10
        };
    }

    getAttackHitbox() {
        if (!this.isAttacking) return null;

        const attackWidth = 60;
        return {
            x: this.facingRight ? this.x + this.width * this.scale : this.x - attackWidth,
            y: this.y,
            width: attackWidth,
            height: this.height * this.scale
        };
    }
}

export { Player };
