/**
 * 通用精灵动画系统
 * 支持从 character.json 配置加载动画
 */

class SpriteAnimator {
    constructor(spriteSheet, config) {
        this.spriteSheet = spriteSheet;
        this.frameWidth = config.frameWidth || 192;
        this.frameHeight = config.frameHeight || 208;
        this.columns = config.columns || 8;
        this.frameSpeed = config.frameSpeed || 120;
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.isPlaying = false;
        this.loop = true;
        this.onAnimationEnd = null;
    }

    addAnimation(name, config) {
        this.animations[name] = {
            row: config.row,
            startFrame: config.startFrame,
            endFrame: config.endFrame,
            loop: config.loop !== false
        };
    }

    play(animationName, forceRestart = false) {
        if (this.currentAnimation === animationName && !forceRestart) {
            return;
        }

        const anim = this.animations[animationName];
        if (!anim) {
            console.warn(`Animation '${animationName}' not found`);
            return;
        }

        this.currentAnimation = animationName;
        this.currentFrame = anim.startFrame;
        this.loop = anim.loop;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
    }

    update(currentTime) {
        if (!this.isPlaying || !this.currentAnimation) {
            return;
        }

        const anim = this.animations[this.currentAnimation];
        const elapsed = currentTime - this.lastFrameTime;

        if (elapsed >= this.frameSpeed) {
            this.lastFrameTime = currentTime;
            this.currentFrame++;

            if (this.currentFrame > anim.endFrame) {
                if (this.loop) {
                    this.currentFrame = anim.startFrame;
                } else {
                    this.currentFrame = anim.endFrame;
                    this.isPlaying = false;
                    if (this.onAnimationEnd) {
                        this.onAnimationEnd(this.currentAnimation);
                    }
                }
            }
        }
    }

    getFramePosition() {
        if (!this.currentAnimation) {
            return { x: 0, y: 0 };
        }

        const anim = this.animations[this.currentAnimation];
        const col = this.currentFrame % this.columns;
        const row = anim.row;

        return {
            x: col * this.frameWidth,
            y: row * this.frameHeight
        };
    }

    draw(ctx, x, y, scale = 1, flipX = false) {
        const pos = this.getFramePosition();
        const w = this.frameWidth;
        const h = this.frameHeight;

        ctx.save();

        if (flipX) {
            ctx.translate(x + w * scale, y);
            ctx.scale(-scale, scale);
            ctx.drawImage(
                this.spriteSheet,
                pos.x, pos.y, w, h,
                0, 0, w, h
            );
        } else {
            ctx.drawImage(
                this.spriteSheet,
                pos.x, pos.y, w, h,
                x, y, w * scale, h * scale
            );
        }

        ctx.restore();
    }
}

/**
 * 加载角色精灵
 */
async function loadCharacterSprite(configPath) {
    const response = await fetch(configPath);
    const config = await response.json();

    const spritePath = configPath.replace('character.json', config.spritesheetPath);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                config: config,
                spriteSheet: img,
                animator: new SpriteAnimator(img, {
                    frameWidth: config.frameWidth,
                    frameHeight: config.frameHeight,
                    columns: config.columns,
                    frameSpeed: 120
                })
            });
        };
        img.onerror = reject;
        img.src = spritePath;
    });
}

/**
 * 加载背景图片
 */
async function loadBackground(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

/**
 * 简单的粒子系统
 */
class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.life = config.life || 60;
        this.maxLife = this.life;
        this.color = config.color || '#fff';
        this.size = config.size || 4;
        this.gravity = config.gravity || 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, config) {
        for (let i = 0; i < (config.count || 10); i++) {
            this.particles.push(new Particle(x, y, {
                vx: (Math.random() - 0.5) * (config.speed || 5),
                vy: (Math.random() - 0.5) * (config.speed || 5) - 2,
                life: config.life || 30,
                color: config.color || '#ff0',
                size: config.size || 3,
                gravity: config.gravity || 0.2
            }));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.update());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

export { SpriteAnimator, Particle, ParticleSystem, loadCharacterSprite, loadBackground };
