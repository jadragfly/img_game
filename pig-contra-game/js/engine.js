/**
 * 游戏引擎
 * 处理游戏循环、渲染、视差滚动和基本游戏逻辑
 */

import { ParticleSystem } from '../lib/sprite-system.js?v=3';

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameCount = 0;

        this.backgrounds = [];
        this.foreground = null;
        this.ground = null;

        this.particles = new ParticleSystem();

        this.camera = {
            x: 0,
            y: 0,
            shake: 0,
            shakeIntensity: 0
        };

        this.groundY = this.height - 80;

        this.keys = {};
        this.setupInput();
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isKeyPressed(code) {
        return this.keys[code] === true;
    }

    async loadBackground(path, parallax = 0.5) {
        const img = await loadBackground(path);
        this.backgrounds.push({
            image: img,
            parallax: parallax,
            offsetX: 0
        });
    }

    async loadForeground(path) {
        this.foreground = await loadBackground(path);
    }

    async loadGround(path) {
        this.ground = await loadBackground(path);
    }

    updateBackgrounds(playerX) {
        this.backgrounds.forEach(bg => {
            bg.offsetX = playerX * bg.parallax;
        });
    }

    shake(intensity = 5, duration = 10) {
        this.camera.shakeIntensity = intensity;
        this.camera.shake = duration;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(currentTime);
        this.render();

        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1 / this.deltaTime);
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    update(currentTime) {
        // Update camera shake
        if (this.camera.shake > 0) {
            this.camera.shake--;
        }

        // Update particles
        this.particles.update();
    }

    render() {
        this.ctx.save();

        // Apply camera shake
        if (this.camera.shake > 0) {
            const shakeX = (Math.random() - 0.5) * this.camera.shakeIntensity;
            const shakeY = (Math.random() - 0.5) * this.camera.shakeIntensity;
            this.ctx.translate(shakeX, shakeY);
        }

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw backgrounds with parallax
        this.backgrounds.forEach(bg => {
            this.drawTiledBackground(bg.image, bg.offsetX, 0, this.width, this.height, bg.parallax);
        });

        // Draw particles (behind entities)
        this.particles.draw(this.ctx);

        this.ctx.restore();
    }

    drawTiledBackground(img, offsetX, y, w, h, parallax = 1) {
        if (!img) return;

        const imgW = img.width;
        const imgH = img.height;
        const scaledH = (w / imgW) * imgH;

        let x = -(offsetX % imgW);
        if (x > 0) x -= imgW;

        while (x < w) {
            this.ctx.drawImage(img, x, y, imgW, scaledH);
            x += imgW;
        }
    }

    createParticleEmitter(x, y, config) {
        this.particles.emit(x, y, config);
    }
}

async function loadBackground(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

export { GameEngine };
