/**
 * 猪版魂斗罗 - 游戏主逻辑
 * 整合所有游戏组件并开始游戏
 */

const V = '?v=3';

let GameEngine, Player, Enemy;

try {
    const engineMod = await import('./engine.js' + V);
    GameEngine = engineMod.GameEngine;

    const playerMod = await import('./player.js' + V);
    Player = playerMod.Player;

    const enemyMod = await import('./enemy.js' + V);
    Enemy = enemyMod.Enemy;

    console.log('[Game] 所有模块加载成功');
} catch (err) {
    console.error('[Game] 模块加载失败:', err);
    const loadingEl = document.getElementById('loading-screen');
    if (loadingEl) {
        loadingEl.innerHTML =
            '<h1 style="color:#ff6b6b;">模块加载失败</h1>' +
            '<p style="color:#fff;">' + err.message + '</p>' +
            '<p style="color:#fff;margin-top:20px;">请确保通过 http://localhost:8080 访问游戏</p>';
    }
}

const DEBUG = true;

function debug(...args) {
    if (DEBUG) console.log('[Game]', ...args);
}

class PigContraGame {
    constructor() {
        this.engine = null;
        this.player = null;
        this.enemies = [];
        this.score = 0;
        this.lives = 3;
        this.gameState = 'loading';
        this.enemySpawnTimer = 0;
        this.maxEnemies = 5;
        this.frameCount = 0;
    }

    async init() {
        debug('开始初始化猪版魂斗罗...');

        try {
            // 步骤1: 创建引擎
            debug('[步骤1/4] 创建游戏引擎...');
            this.engine = new GameEngine('gameCanvas');
            debug('[步骤1/4] 引擎创建成功');

            // 步骤2: 加载背景
            debug('[步骤2/4] 加载背景图片...');
            try {
                await this.engine.loadBackground('assets/backgrounds/layer1__0.png', 0.2);
                debug('[步骤2/4] layer1 加载完成');
                await this.engine.loadBackground('assets/backgrounds/main-bg__0.png', 0.5);
                debug('[步骤2/4] main-bg 加载完成');
                debug('[步骤2/4] 背景加载全部成功');
            } catch (e) {
                console.error('[步骤2/4] 背景加载失败（继续运行）:', e);
                debug('[步骤2/4] 背景加载失败但继续初始化');
            }

            // 步骤3: 加载玩家
            debug('[步骤3/4] 加载玩家角色...');
            this.player = new Player(this.engine, 100, 300);
            await this.player.init('assets/characters/player/character.json');
            debug('[步骤3/4] 玩家加载成功');

            // 步骤4: 生成敌人
            debug('[步骤4/4] 生成敌人...');
            await this.spawnEnemy();
            await this.spawnEnemy();
            debug('[步骤4/4] 敌人全部生成成功，当前数量:', this.enemies.length);

            // 初始化完成
            this.setupUI();
            const loadingEl = document.getElementById('loading-screen');
            if (loadingEl) loadingEl.classList.add('hidden');
            debug('========== 游戏初始化完成，等待玩家点击开始 ==========');

        } catch (e) {
            console.error('[Game] 初始化失败:', e);
            const loadingEl = document.getElementById('loading-screen');
            if (loadingEl) {
                loadingEl.innerHTML =
                    '<h1 style="color:#ff6b6b;">加载失败</h1>' +
                    '<p style="color:#fff;">' + (e.message || '未知错误') + '</p>' +
                    '<p style="color:#fff;margin-top:20px;">请刷新页面重试</p>';
            }
        }
    }

    startGame() {
        if (!this.engine || !this.player) {
            console.error('[Game] 初始化未完成，无法开始游戏');
            alert('游戏初始化未完成，请刷新页面重试。');
            return;
        }
        debug('游戏开始!');
        this.gameState = 'playing';
        document.getElementById('start-screen').classList.add('hidden');
        this.engine.start();
        this.gameLoop();
    }

    async spawnEnemy() {
        const minX = this.engine.width - 300;
        const maxX = this.engine.width - 50;
        const x = minX + Math.random() * (maxX - minX);
        const y = this.engine.groundY - 104;

        const enemy = new Enemy(this.engine, x, y);
        await enemy.init('assets/characters/enemy/character.json');

        this.enemies.push(enemy);
        debug('敌人生成:', { x, y, total: this.enemies.length });
    }

    setupUI() {
        if (this._uiReady) return;
        this._uiReady = true;

        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('restart-button').addEventListener('click', () => {
            this.restart();
        });
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        this.frameCount++;

        this.player.update(1 / 60);

        this.enemies = this.enemies.filter(enemy => {
            const alive = enemy.update(1 / 60, this.player.x, this.player.y);

            const playerHitbox = this.player.getHitbox();
            const playerAttackHitbox = this.player.getAttackHitbox();

            enemy.bullets = enemy.bullets.filter(bullet => {
                if (this.checkCollision(bullet, playerHitbox) && !this.player.invincible) {
                    debug('玩家被敌人子弹击中!');
                    this.player.takeDamage(10);
                    return false;
                }
                return true;
            });

            if (playerAttackHitbox && !enemy.dead) {
                if (this.checkCollision(enemy.getHitbox(), playerAttackHitbox)) {
                    debug('近身攻击击中敌人!');
                    enemy.takeDamage(1);
                    if (enemy.dead) {
                        this.score += 100;
                        this.updateUI();
                        debug('敌人被近身攻击击杀! 分数:', this.score);
                    }
                }
            }

            if (!enemy.dead) {
                const enemyHitbox = enemy.getHitbox();

                for (let i = this.player.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.player.bullets[i];

                    if (this.checkCollision(bullet, enemyHitbox)) {
                        debug('子弹击中敌人!');
                        enemy.takeDamage(1);
                        this.player.bullets.splice(i, 1);

                        if (enemy.dead) {
                            this.score += 100;
                            this.updateUI();
                            debug('敌人被子弹击杀! 分数:', this.score);
                        }
                        break;
                    }
                }
            }

            if (!enemy.dead && this.checkCollision(enemy.getHitbox(), playerHitbox) && !this.player.invincible) {
                debug('玩家与敌人碰撞!');
                this.player.takeDamage(20);
            }

            if (enemy.dead && enemy.deathTimer > 60) {
                debug('敌人死亡并移除');
                return false;
            }

            return alive;
        });

        this.engine.updateBackgrounds(this.player.x);

        if (this.enemies.length < this.maxEnemies) {
            this.enemySpawnTimer++;
            if (this.enemySpawnTimer > 300) {
                this.spawnEnemy();
                this.enemySpawnTimer = 0;
            }
        }

        if (this.player.dead) {
            this.lives--;
            this.updateUI();
            debug('玩家死亡，剩余生命:', this.lives);

            if (this.lives <= 0) {
                this.gameOver();
            } else {
                setTimeout(() => {
                    this.player.respawn();
                    this.enemies = [];
                    this.spawnEnemy();
                    this.spawnEnemy();
                }, 2000);
            }
        }

        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    render() {
        this.engine.render();

        this.enemies.forEach(enemy => enemy.draw(this.engine.ctx));
        this.player.draw(this.engine.ctx);

        if (this.engine.camera.shake > 0) {
            this.engine.camera.shake--;
        }
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    updateUI() {
        document.getElementById('score-value').textContent = this.score;
        document.getElementById('lives-value').textContent = this.lives;
    }

    gameOver() {
        this.gameState = 'gameover';
        this.engine.stop();
        debug('游戏结束! 最终分数:', this.score);

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.enemies = [];
        this.enemySpawnTimer = 0;

        this.player.respawn();
        this.spawnEnemy();
        this.spawnEnemy();

        document.getElementById('game-over-screen').classList.add('hidden');
        this.updateUI();

        this.gameState = 'playing';
        this.engine.start();
        this.gameLoop();
    }
}

// 模块脚本是延迟执行的，此时 DOM 已解析完毕，可以直接启动
console.log('[Game] 准备启动游戏初始化...');
if (GameEngine && Player && Enemy) {
    const game = new PigContraGame();
    game.init();
} else {
    console.error('[Game] 模块未正确加载，无法启动');
}
