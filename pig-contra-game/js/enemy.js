/**
 * 敌方角色控制器
 * 处理敌人AI、移动、动画和战斗
 */

import { SpriteAnimator } from '../lib/sprite-system.js?v=3';
import { GameAudio } from '../lib/audio.js?v=3';

const DEBUG = true;

function debug(...args) {
    if (DEBUG) console.log('[Enemy]', ...args);
}

class Enemy {
    constructor(gameEngine, x, y) {
        this.engine = gameEngine;
        this.x = x;
        this.y = y;
        this.startX = x;

        this.width = 96;
        this.height = 104;
        this.scale = 0.8;

        this.vx = 0;
        this.vy = 0;
        this.speed = 2;
        this.gravity = 0.8;

        this.isOnGround = false;
        this.facingRight = false;
        this.health = 1;
        this.maxHealth = 1;
        this.dead = false;

        this.animator = null;
        this.config = null;

        this.audio = new GameAudio();

        this.state = 'idle';
        this.stateTimer = 0;
        this.patrolRange = 200;
        this.patrolDir = -1; // 巡逻方向，独立于 facingRight，-1=左, 1=右

        this.shootCooldown = 0;
        this.bullets = [];

        this.deathTimer = 0;
    }

    async init(configPath) {
        debug('加载敌人配置:', configPath);
        const response = await fetch(configPath);
        this.config = await response.json();
        debug('敌人配置:', this.config);

        const spritePath = configPath.replace('character.json', this.config.spritesheetPath);
        debug('敌人精灵图路径:', spritePath);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                debug('敌人精灵图加载成功');
                this.animator = new SpriteAnimator(img, {
                    frameWidth: this.config.frameWidth,
                    frameHeight: this.config.frameHeight,
                    columns: this.config.columns,
                    frameSpeed: 150
                });

                for (const [name, anim] of Object.entries(this.config.animations)) {
                    debug('注册敌人动画:', name, anim);
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = (e) => {
                debug('敌人精灵图加载失败', e);
                reject(e);
            };
            img.src = spritePath;
        });
    }

    update(deltaTime, playerX, playerY) {
        if (this.dead) {
            this.deathTimer++;
            if (this.deathTimer > 60) {
                debug('敌人死亡超时移除');
                return false;
            }
            return true;
        }

        if (this.shootCooldown > 0) this.shootCooldown--;

        const distToPlayer = Math.abs(this.x - playerX);

        this.facingRight = playerX > this.x;

        switch (this.state) {
            case 'idle':
                this.stateTimer++;
                if (this.stateTimer > 60) {
                    this.state = 'patrol';
                    this.stateTimer = 0;
                }
                break;

            case 'patrol':
                if (distToPlayer < 400) {
                    this.state = 'chase';
                    this.stateTimer = 0;
                } else {
                    this.vx = this.patrolDir * this.speed;
                    // 到达巡逻边界时反转方向
                    if (Math.abs(this.x - this.startX) > this.patrolRange) {
                        this.patrolDir *= -1;
                        this.vx = this.patrolDir * this.speed;
                        debug('敌人反转巡逻方向:', this.patrolDir > 0 ? '右' : '左');
                    }
                }
                break;

            case 'chase':
                if (distToPlayer < 150) {
                    this.state = 'attack';
                    this.vx = 0;
                } else if (distToPlayer > 500) {
                    this.state = 'patrol';
                } else {
                    this.vx = this.facingRight ? this.speed * 1.5 : -this.speed * 1.5;
                }
                break;

            case 'attack':
                this.stateTimer++;
                if (this.stateTimer > 90) {
                    if (distToPlayer < 200) {
                        this.shoot();
                    }
                    this.stateTimer = 0;
                }

                if (distToPlayer > 300) {
                    this.state = 'patrol';
                }
                break;
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

        this.updateAnimation();

        return true;
    }

    updateAnimation() {
        if (!this.animator) return;

        let animName = 'idle';

        if (this.dead) {
            animName = 'death';
        } else if (this.state === 'attack') {
            animName = 'attack';
        } else if (Math.abs(this.vx) > 0.5) {
            animName = this.facingRight ? 'walk-right' : 'walk-left';
        }

        this.animator.play(animName);
    }

    shoot() {
        this.shootCooldown = 60;
        const bulletSpeed = 8;
        const bulletDir = this.facingRight ? 1 : -1;

        this.bullets.push({
            x: this.x + (this.facingRight ? this.width * this.scale : 0),
            y: this.y + this.height * this.scale / 2,
            vx: bulletSpeed * bulletDir,
            width: 15,
            height: 5
        });

        debug('敌人射击!');
        this.audio.playEnemyShoot();
    }

    takeDamage(amount) {
        debug('敌人受伤! 伤害:', amount, '当前生命:', this.health);
        this.health -= amount;

        this.engine.createParticleEmitter(
            this.x + this.width * this.scale / 2,
            this.y + this.height * this.scale / 2,
            {
                count: 15,
                speed: 5,
                life: 20,
                color: '#f00',
                size: 3,
                gravity: 0.2
            }
        );

        if (this.health <= 0) {
            debug('敌人死亡!');
            this.die();
        }
    }

    die() {
        this.dead = true;
        this.vx = 0;
        this.vy = 0;
        this.state = 'dead';

        debug('敌人执行死亡动画');
        this.audio.playExplosion();

        this.engine.createParticleEmitter(
            this.x + this.width * this.scale / 2,
            this.y + this.height * this.scale / 2,
            {
                count: 30,
                speed: 8,
                life: 40,
                color: '#f80',
                size: 4,
                gravity: 0.2
            }
        );
    }

    draw(ctx) {
        ctx.save();

        if (this.animator) {
            this.animator.draw(ctx, this.x, this.y, this.scale, !this.facingRight);
        }

        ctx.fillStyle = '#f00';
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = 10;
        this.bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, bullet.width / 2, 0, Math.PI * 2);
            ctx.fill();
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
}

export { Enemy };
