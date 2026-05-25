/**
 * 游戏主入口
 * 
 * 这个文件是游戏的启动点
 * 初始化游戏引擎、加载资源、设置游戏逻辑
 */

import { GameEngine } from './engine.js';
import { Player, Enemy } from './character.js';
import { Platform, Collectible, CollisionManager } from './collision.js';
import { UIManager } from './ui.js';

class Game extends GameEngine {
    constructor() {
        super('gameCanvas', {
            width: 800,
            height: 600,
            backgroundColor: '#87CEEB'
        });
        
        this.platforms = [];
        this.collectibles = [];
        this.enemies = [];
        this.ui = new UIManager();
        
        this.init();
    }
    
    init() {
        debugLog('游戏初始化');
        
        this.ui.init('ui-layer');
        this.createUI();
        this.loadLevel();
        this.setupGameControls();
        
        this.addEntity(this.player);
        
        this.start();
    }
    
    createUI() {
        this.scoreDisplay = this.ui.createScoreDisplay(10, 10);
        this.livesDisplay = this.ui.createLivesDisplay(10, 50, 3);
    }
    
    loadLevel() {
        debugLog('加载关卡');
        
        this.player = new Player({
            name: 'Player',
            x: 100,
            y: 400,
            width: 40,
            height: 60,
            lives: 3,
            controls: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                jump: 'ArrowUp',
                attack: 'Space'
            }
        });
        
        const levelData = {
            platforms: [
                { x: 0, y: 550, width: 800, height: 50, type: 'static' },
                { x: 200, y: 450, width: 150, height: 20, type: 'static' },
                { x: 450, y: 350, width: 150, height: 20, type: 'static' },
                { x: 100, y: 250, width: 150, height: 20, type: 'static' },
                { x: 350, y: 200, width: 200, height: 20, type: 'moving', moveRange: 100 }
            ],
            collectibles: [
                { x: 250, y: 400, type: 'coin', value: 10 },
                { x: 500, y: 300, type: 'coin', value: 10 },
                { x: 150, y: 200, type: 'coin', value: 10 },
                { x: 400, y: 150, type: 'coin', value: 20 }
            ],
            enemies: [
                { x: 400, y: 510, width: 40, height: 40, patrolRange: 100, speed: 2 }
            ]
        };
        
        for (const pData of levelData.platforms) {
            const platform = new Platform(pData);
            this.platforms.push(platform);
            this.addEntity(platform);
        }
        
        for (const cData of levelData.collectibles) {
            const collectible = new Collectible(cData);
            this.collectibles.push(collectible);
            this.addEntity(collectible);
        }
        
        for (const eData of levelData.enemies) {
            const enemy = new Enemy(eData);
            this.enemies.push(enemy);
            this.addEntity(enemy);
        }
    }
    
    setupGameControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
    }
    
    togglePause() {
        if (this.running) {
            this.stop();
            this.ui.showPauseScreen();
        } else {
            this.ui.hidePauseScreen();
            this.start();
        }
    }
    
    update(deltaTime) {
        if (!this.player.isAlive) {
            this.ui.showGameOverScreen(this.player.score);
            return;
        }
        
        this.player.update(deltaTime);
        
        CollisionManager.checkPlatformCollision(this.player, this.platforms);
        CollisionManager.checkBoundaryCollision(this.player, this.width, this.height);
        
        for (const enemy of this.enemies) {
            enemy.update(deltaTime);
            
            if (CollisionManager.checkCollision(this.player, enemy)) {
                this.player.takeDamage();
            }
        }
        
        const collected = CollisionManager.checkCollectibleCollision(this.player, this.collectibles);
        for (const item of collected) {
            item.isActive = false;
            this.removeEntity(item);
            this.player.score += item.value;
            debugLog('收集物品, 当前分数:', this.player.score);
        }
        
        for (const platform of this.platforms) {
            platform.update(deltaTime);
        }
        
        for (const collectible of this.collectibles) {
            collectible.update(deltaTime);
        }
        
        this.scoreDisplay.update(this.player.score);
        this.livesDisplay.update(this.player.lives);
    }
    
    render() {
        super.render();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    debugLog('页面加载完成, 启动游戏');
    new Game();
});
