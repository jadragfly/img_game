/**
 * 角色基类模板
 * 包含基础的角色属性、动画系统和物理运动
 */

class Character {
    constructor(config) {
        this.name = config.name || 'Unnamed';
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 32;
        this.height = config.height || 32;
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = config.speed || 5;
        this.jumpPower = config.jumpPower || 12;
        this.gravity = config.gravity || 0.5;
        this.friction = config.friction || 0.8;
        
        this.isGrounded = false;
        this.isAlive = true;
        
        this.currentState = 'idle';
        this.animationFrame = 0;
        this.animationSpeed = 150;
        this.lastAnimationUpdate = 0;
        
        this.sprites = {};
        this.currentSprite = null;
        
        debugLog(`角色创建: ${this.name}`, {
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height }
        });
    }
    
    loadSprite(state, imagePath) {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
            this.sprites[state] = img;
            debugLog(`加载精灵图: ${this.name} - ${state}`);
        };
        this.currentSprite = this.sprites[this.currentState];
    }
    
    setState(newState) {
        if (this.currentState !== newState) {
            this.currentState = newState;
            this.animationFrame = 0;
            debugLog(`角色状态改变: ${this.name} - ${newState}`);
        }
    }
    
    update(deltaTime) {
        this.applyPhysics();
        this.updateAnimation(deltaTime);
    }
    
    applyPhysics() {
        this.velocityY += this.gravity;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        this.velocityX *= this.friction;
    }
    
    updateAnimation(deltaTime) {
        this.lastAnimationUpdate += deltaTime;
        
        if (this.lastAnimationUpdate >= this.animationSpeed) {
            this.animationFrame++;
            this.lastAnimationUpdate = 0;
        }
    }
    
    render(ctx) {
        if (this.currentSprite) {
            const frameWidth = this.width;
            const frameHeight = this.height;
            
            ctx.drawImage(
                this.currentSprite,
                this.animationFrame * frameWidth,
                0,
                frameWidth,
                frameHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        if (DEBUG_MODE) {
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    jump() {
        if (this.isGrounded) {
            this.velocityY = -this.jumpPower;
            this.isGrounded = false;
            this.setState('jump');
            debugLog('跳跃:', this.name);
        }
    }
    
    moveLeft() {
        this.velocityX = -this.speed;
        this.setState('walk');
    }
    
    moveRight() {
        this.velocityX = this.speed;
        this.setState('walk');
    }
    
    stop() {
        this.velocityX = 0;
        if (this.isGrounded) {
            this.setState('idle');
        }
    }
}

class Player extends Character {
    constructor(config) {
        super(config);
        
        this.lives = config.lives || 3;
        this.score = 0;
        this.invincible = false;
        this.invincibleTime = 0;
        
        this.controls = config.controls || {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: 'ArrowUp',
            attack: 'Space'
        };
        
        this.keys = {};
        this.setupControls();
        
        debugLog('玩家初始化:', {
            lives: this.lives,
            controls: this.controls
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            debugLog('按键按下:', e.key);
            this.handleKeyDown(e.key);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.handleKeyUp(e.key);
        });
    }
    
    handleKeyDown(key) {
        switch(key) {
            case this.controls.left:
                this.moveLeft();
                break;
            case this.controls.right:
                this.moveRight();
                break;
            case this.controls.jump:
                this.jump();
                break;
            case this.controls.attack:
                this.attack();
                break;
        }
    }
    
    handleKeyUp(key) {
        if (key === this.controls.left || key === this.controls.right) {
            this.stop();
        }
    }
    
    attack() {
        this.setState('attack');
        debugLog('攻击:', this.name);
    }
    
    takeDamage() {
        if (this.invincible) return;
        
        this.lives--;
        debugLog('受到伤害:', this.name, '剩余生命:', this.lives);
        
        if (this.lives <= 0) {
            this.isAlive = false;
            this.setState('dead');
        } else {
            this.invincible = true;
            this.invincibleTime = 2000;
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.invincible) {
            this.invincibleTime -= deltaTime;
            if (this.invincibleTime <= 0) {
                this.invincible = false;
            }
        }
    }
    
    render(ctx) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }
        
        super.render(ctx);
        
        if (DEBUG_MODE) {
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.fillText(`生命: ${this.lives}`, this.x, this.y - 5);
            ctx.fillText(`分数: ${this.score}`, this.x, this.y - 15);
        }
    }
}

class Enemy extends Character {
    constructor(config) {
        super(config);
        
        this.patrolRange = config.patrolRange || 100;
        this.startX = this.x;
        this.direction = 1;
        this.health = config.health || 1;
        this.damage = config.damage || 1;
        this.speed = config.speed || 2;
        
        this.setState('patrol');
    }
    
    update(deltaTime) {
        switch(this.currentState) {
            case 'patrol':
                this.patrol();
                break;
            case 'chase':
                this.chasePlayer();
                break;
            case 'attack':
                this.performAttack();
                break;
        }
        
        super.update(deltaTime);
    }
    
    patrol() {
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
            this.setState('idle');
            setTimeout(() => this.setState('patrol'), 500);
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
            this.setState('idle');
            setTimeout(() => this.setState('patrol'), 500);
        }
    }
    
    chasePlayer() {
        if (!this.targetPlayer) return;
        
        const dx = this.targetPlayer.x - this.x;
        this.direction = dx > 0 ? 1 : -1;
        this.velocityX = this.direction * this.speed * 1.5;
    }
    
    performAttack() {
        debugLog('敌人攻击:', this.name);
        this.setState('patrol');
    }
    
    takeDamage(amount) {
        this.health -= amount;
        debugLog('敌人受伤:', this.name, '剩余生命:', this.health);
        
        if (this.health <= 0) {
            this.isAlive = false;
            this.setState('dead');
        }
    }
}

window.Character = Character;
window.Player = Player;
window.Enemy = Enemy;
