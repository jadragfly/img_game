/**
 * 碰撞检测和平台管理
 */

class CollisionManager {
    static checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    static checkPlatformCollision(player, platforms) {
        player.isGrounded = false;
        
        for (const platform of platforms) {
            if (!platform.isActive) continue;
            
            if (CollisionManager.checkCollision(player, platform)) {
                debugLog('平台碰撞检测:', platform.type);
                
                if (player.velocityY > 0) {
                    const playerBottom = player.y + player.height;
                    const playerPrevBottom = playerBottom - player.velocityY;
                    
                    if (playerPrevBottom <= platform.y + 5) {
                        player.y = platform.y - player.height;
                        player.velocityY = 0;
                        player.isGrounded = true;
                        
                        if (platform.type === 'moving') {
                            player.x += platform.velocityX;
                        }
                        
                        return platform;
                    }
                }
            }
        }
        
        return null;
    }
    
    static checkEnemyCollision(player, enemies) {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;
            
            if (CollisionManager.checkCollision(player, enemy)) {
                debugLog('敌人碰撞:', enemy.name);
                return enemy;
            }
        }
        return null;
    }
    
    static checkCollectibleCollision(player, collectibles) {
        const collected = [];
        
        for (const collectible of collectibles) {
            if (!collectible.isActive) continue;
            
            if (CollisionManager.checkCollision(player, collectible)) {
                debugLog('收集物品:', collectible.type);
                collected.push(collectible);
            }
        }
        
        return collected;
    }
    
    static checkBoundaryCollision(entity, width, height) {
        if (entity.x < 0) {
            entity.x = 0;
            entity.velocityX = 0;
        }
        if (entity.x + entity.width > width) {
            entity.x = width - entity.width;
            entity.velocityX = 0;
        }
        if (entity.y + entity.height > height) {
            entity.y = height - entity.height;
            entity.velocityY = 0;
            entity.isGrounded = true;
        }
    }
}

class Platform {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 100;
        this.height = config.height || 20;
        this.type = config.type || 'static';
        this.isActive = true;
        
        this.color = config.color || '#8B4513';
        this.image = null;
        
        if (config.imagePath) {
            this.image = new Image();
            this.image.src = config.imagePath;
        }
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.moveRange = config.moveRange || 100;
        this.startX = this.x;
        this.startY = this.y;
        this.moveSpeed = config.moveSpeed || 2;
        this.direction = 1;
        
        debugLog('平台创建:', this.type, {
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height }
        });
    }
    
    update(deltaTime) {
        if (this.type === 'moving') {
            this.x += this.moveSpeed * this.direction;
            
            if (this.x > this.startX + this.moveRange ||
                this.x < this.startX - this.moveRange) {
                this.direction *= -1;
            }
        }
    }
    
    render(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        
        if (DEBUG_MODE) {
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.fillText(this.type, this.x, this.y - 5);
        }
    }
}

class Collectible {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 24;
        this.height = config.height || 24;
        this.type = config.type || 'coin';
        this.value = config.value || 10;
        this.isActive = true;
        
        this.image = null;
        if (config.imagePath) {
            this.image = new Image();
            this.image.src = config.imagePath;
        }
        
        this.floatOffset = 0;
        this.floatSpeed = 0.05;
        this.rotation = 0;
        
        debugLog('收集物创建:', this.type, this.value);
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        this.floatOffset = Math.sin(Date.now() * this.floatSpeed) * 5;
        this.rotation += 0.05;
    }
    
    render(ctx) {
        if (!this.isActive) return;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + this.floatOffset);
        ctx.rotate(this.rotation);
        
        if (this.image) {
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = this.type === 'coin' ? 'gold' : 'green';
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
        
        if (DEBUG_MODE) {
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.fillText(`+${this.value}`, this.x, this.y - 5);
        }
    }
}

window.CollisionManager = CollisionManager;
window.Platform = Platform;
window.Collectible = Collectible;
