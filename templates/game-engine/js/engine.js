/**
 * 游戏引擎基础模板
 * 包含调试模式、全局配置和游戏循环
 */

// 全局调试模式控制
const DEBUG_MODE = false;

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log('[DEBUG]', ...args);
    }
}

class GameEngine {
    constructor(canvasId, config = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.width = config.width || 800;
        this.height = config.height || 600;
        this.backgroundColor = config.backgroundColor || '#87CEEB';
        
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        
        this.running = false;
        this.entities = [];
        this.player = null;
        
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        debugLog('画布设置:', this.width, 'x', this.height);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        debugLog('窗口大小改变');
    }
    
    addEntity(entity) {
        this.entities.push(entity);
        debugLog('添加实体:', entity.constructor.name);
    }
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            debugLog('移除实体:', entity.constructor.name);
        }
    }
    
    start() {
        this.running = true;
        this.lastTime = performance.now();
        debugLog('游戏开始');
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    stop() {
        this.running = false;
        debugLog('游戏暂停');
    }
    
    gameLoop(timestamp) {
        if (!this.running) return;
        
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.fps = 1000 / this.deltaTime;
        
        this.update(this.deltaTime);
        this.render();
        
        if (DEBUG_MODE && Math.floor(timestamp / 1000) !== Math.floor((timestamp - this.deltaTime) / 1000)) {
            console.log('FPS:', this.fps.toFixed(2));
        }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(deltaTime) {
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }
    }
    
    render() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        for (const entity of this.entities) {
            if (entity.render) {
                entity.render(this.ctx);
            }
        }
        
        if (DEBUG_MODE) {
            this.renderDebugInfo();
        }
    }
    
    renderDebugInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.fps.toFixed(2)}`, 10, 20);
        this.ctx.fillText(`实体数量: ${this.entities.length}`, 10, 40);
        
        if (this.player) {
            this.ctx.fillText(`玩家位置: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`, 10, 60);
        }
    }
}

window.GameEngine = GameEngine;
window.DEBUG_MODE = DEBUG_MODE;
window.debugLog = debugLog;
