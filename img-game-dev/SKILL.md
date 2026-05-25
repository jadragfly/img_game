---
name: "img-game-dev"
description: "使用 AI 图片资源的网页游戏开发技能。通过 game-character-design 生成角色精灵图，doubao-api 生成背景材质，sprite-management 提供通用精灵管理，最终生成高质量 HTML5 网页游戏。Invoke when user wants high quality graphics, commercial game development, or explicitly requests image-based game assets."
---

# Image-Based Game Development (img-game-dev)

使用 AI 生成图片资源的高质量网页游戏开发技能。通过 Seedream 生成角色精灵图、豆包 API 生成背景和材质，最终产出专业级 HTML5 网页游戏。

## 核心特点

🎨 **AI 生成资源**
- 使用 `game-character-design` 技能生成角色精灵图
- 使用 `doubao-api` 生成游戏背景和材质图
- 支持自定义风格和主题

🧩 **通用精灵管理**
- 集成 `sprite-management` 通用精灵管理技能
- 支持精灵图动画、资源加载、粒子效果等核心功能
- 开箱即用，无需重复开发

🎮 **高质量游戏**
- 专业级美术资源
- 流畅的动画效果
- 商业级游戏品质

🚀 **完整工作流**
- 从概念到可运行游戏
- 模块化代码架构
- 易于扩展和维护

## 工作流程

### 1️⃣ 需求收集

**游戏基本信息**：
- 游戏类型（平台跳跃、射击、RPG、格斗等）
- 游戏主题和风格（奇幻、科幻、卡通、像素等）
- 目标平台（PC、移动端）
- 核心玩法描述

**角色需求**：
```
角色类型：
- 主角（Player）：主要控制角色
- 敌人（Enemy）：对抗角色
- NPC：交互角色
- Boss：关卡首领（可选）

⚠️ 重要：角色形象区分要求
- 每个角色必须有独特的外观和特征
- 玩家角色和敌人角色必须在视觉上有明显区别
- 建议使用不同的物种、颜色、服装或装备来区分
- 禁止使用相同的角色描述生成不同阵营的角色

动画需求：
- 移动（walk-right, walk-left）
- 跳跃（jump）
- 攻击（attack）
- 待机（idle）
- 下蹲（crouch）
- 拾取（pickup）
```

**场景需求**：
```
背景类型：
- 主背景：远景氛围
- 层背景：多层视差
- 前景：装饰元素

材质需求：
- 地面/平台
- 障碍物
- 道具
- UI 元素
```

### 2️⃣ AI 资源生成

#### 2.1 玩家角色精灵生成

使用 `game-character-design` 技能：

```
Use Skill: game-character-design
```

**生成流程**：

```bash
# 1. 准备角色数据
python scripts/prepare_run.py \
  --animation-mode game \
  --game-type platformer \
  --character-name "Hero Knight" \
  --description "A brave knight in silver armor with blue cape, holding sword" \
  --style platformer-16bit \
  --category "Fantasy Adventure" \
  --output-dir ./run/hero-knight

# 2. 生成基础形象（必须人工检查！）
python scripts/generate_base.py --run-dir ./run/hero-knight

# 3. 生成动作动画（所有动作）
python scripts/generate_row.py --run-dir ./run/hero-knight --row all --mode grid --force

# 4. 后期处理
python scripts/extract_frames.py --run-dir ./run/hero-knight
python scripts/chroma_key.py --run-dir ./run/hero-knight
python scripts/compose_atlas.py --run-dir ./run/hero-knight
python scripts/render_qa.py --run-dir ./run/hero-knight  # 质量检查！

# 5. 打包输出
python scripts/package_pet.py --run-dir ./run/hero-knight --slug hero-knight-v1 --output-dir ./assets/characters/player
```

**输出文件**：
```
assets/characters/player/
├── spritesheet.png          # 精灵图合集
├── spritesheet.webp        # WebP 格式（推荐）
├── character.json          # 角色配置（重要！）
└── qa/                     # 质量检查
    ├── contact-sheet.png
    ├── run-summary.json
    ├── chroma-report.txt
    └── gifs/
        ├── idle.gif
        ├── walk-right.gif
        ├── jump.gif
        └── attack.gif
```

**character.json 格式**：
```json
{
  "id": "hero-knight-v1",
  "name": "Hero Knight",
  "frameWidth": 192,
  "frameHeight": 208,
  "columns": 8,
  "animations": {
    "idle": {"row": 0, "startFrame": 0, "endFrame": 7, "loop": true},
    "walk-right": {"row": 1, "startFrame": 0, "endFrame": 7, "loop": true},
    "walk-left": {"row": 2, "startFrame": 0, "endFrame": 7, "loop": true},
    "jump": {"row": 3, "startFrame": 0, "endFrame": 7, "loop": false},
    "attack": {"row": 5, "startFrame": 0, "endFrame": 5, "loop": false}
  }
}
```

#### 2.2 敌方角色精灵生成

⚠️ **重要提醒**：敌方角色必须与玩家角色在视觉上明显不同！禁止直接复用玩家精灵或使用相似的描述。

**推荐：独立生成敌方角色（使用 doubao-api）**：

```bash
# 1. 准备敌方角色数据
# ⚠️ 描述必须与玩家角色有明显区别！
python scripts/prepare_run.py \
  --animation-mode game \
  --game-type platformer \
  --character-name "Enemy Dog" \
  --description "A fierce red dog soldier with helmet, aggressive expression, different from player character" \
  --style platformer-16bit \
  --category "Action Adventure" \
  --output-dir ./run/enemy-dog

# 2. 生成基础形象（必须人工检查！）
python scripts/generate_base.py --run-dir ./run/enemy-dog

# 3. 生成动作动画
python scripts/generate_row.py --run-dir ./run/enemy-dog --row all --mode grid --force

# 4. 后期处理
python scripts/extract_frames.py --run-dir ./run/enemy-dog
python scripts/chroma_key.py --run-dir ./run/enemy-dog
python scripts/compose_atlas.py --run-dir ./run/enemy-dog
python scripts/render_qa.py --run-dir ./run/enemy-dog

# 5. 打包输出
python scripts/package_pet.py --run-dir ./run/enemy-dog --slug enemy-dog --output-dir ./assets/characters/enemy
```

**⚠️ 禁止使用 `generate_enemy.py` 从玩家精灵生成敌方！**

**敌方精灵规格**：
- 动作：idle, walk, attack, death（4-8帧/动作）
- 网格：4-8列
- 尺寸：根据游戏需求定

**角色区分示例**：
| 玩家角色 | 敌人角色 |
|---------|---------|
| 猫士兵（绿色服装） | 狗士兵（红色服装） |
| 蓝甲骑士 | 红甲战士 |
| 女性法师 | 男性战士 |

#### 2.3 背景图生成

使用 `doubao-api` 技能：

```
Use Skill: doubao-api
```

> 💡 注意：`doubao-api` 技能会自动从环境变量中获取 `API_KEY` 配置，无需手动设置密钥。系统已预置火山引擎/豆包API访问凭证，可直接调用。

**生成内容**：

| 图片类型 | 尺寸建议 | 用途 |
|---------|---------|------|
| 主背景 | 1920x1080 | 游戏主场景 |
| 层背景1 | 1920x1080 | 远景视差 |
| 层背景2 | 1920x1080 | 中景视差 |
| 前景装饰 | 1920x200 | 前景元素 |

**提示词示例**：

```
# 主背景
"A beautiful fantasy forest landscape, magical atmosphere, detailed illustration, vibrant colors, game background"

# 层背景
"A mystical mountain range, soft clouds, distant castles, parallax scrolling ready, game art style"

# 地面材质
"Seamless grass texture, top-down view, vibrant green, game material"
```

#### 2.4 Web Audio 声音系统

使用 Web Audio API 生成游戏音效，无需外部音频文件：

**audio.js - 音效管理器**：

```javascript
class GameAudio {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.7;
        this.sounds = {};
        this.musicPlaying = false;
        this.init();
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // 生成射击音效
    playShoot() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // 生成跳跃音效
    playJump() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // 生成近身攻击音效
    playAttack() {
        if (!this.ctx) return;
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.masterVolume * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start();
        noise.stop(this.ctx.currentTime + 0.2);
    }

    // 生成爆炸音效
    playExplosion() {
        if (!this.ctx) return;
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.masterVolume * 0.6, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start();
        noise.stop(this.ctx.currentTime + 0.5);
    }

    // 生成受伤音效
    playHurt() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    // 生成敌人射击音效
    playEnemyShoot() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    // 生成脚步声
    playStep() {
        if (!this.ctx) return;
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.masterVolume * 0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start();
        noise.stop(this.ctx.currentTime + 0.05);
    }

    // 生成拾取道具音效
    playPickup() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.setValueAtTime(600, this.ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // 设置主音量
    setMasterVolume(vol) {
        this.masterVolume = Math.max(0, Math.min(1, vol));
    }

    // 静音/取消静音
    toggleMute() {
        this.masterVolume = this.masterVolume > 0 ? 0 : 0.7;
    }
}

export { GameAudio };
```

**在游戏中的使用示例**：

```javascript
// 在 main.js 中初始化
const audio = new GameAudio();

// 在玩家射击时
player.shoot = function() {
    audio.playShoot();
    // ... 射击逻辑
}

// 在玩家跳跃时
if (this.input.up && this.isOnGround) {
    audio.playJump();
    // ... 跳跃逻辑
}

// 在玩家受伤时
player.takeDamage = function(amount) {
    audio.playHurt();
    // ... 受伤逻辑
}

// 在敌人爆炸时
enemy.die = function() {
    audio.playExplosion();
    // ... 死亡逻辑
}
```

**音效类型对照表**：

| 音效 | 使用场景 | 特点 |
|------|---------|------|
| 射击 | 玩家射击 | 短促、尖锐 |
| 跳跃 | 玩家起跳 | 上升音调 |
| 攻击 | 近身格斗 | 挥舞、冲击 |
| 爆炸 | 敌人死亡 | 噪声、低沉 |
| 受伤 | 角色受击 | 下降音调 |
| 敌射 | 敌人射击 | 三角波 |
| 脚步 | 行走时 | 轻微噪声 |
| 拾取 | 获取道具 | 上升音阶 |

### 2.4 QA 质量检查

**⚠️ 重要：每个角色必须单独进行 QA 检查！**

```bash
# 1. 检查玩家角色
python scripts/render_qa.py --run-dir ./run/cat-soldier --chroma-threshold 5

# 2. 检查敌方角色（必须分开检查！）
python scripts/render_qa.py --run-dir ./run/dog-soldier --chroma-threshold 5

# 查看报告
cat ./run/cat-soldier/qa/chroma-report.txt
cat ./run/dog-soldier/qa/chroma-report.txt
```

**⚠️ 人工视觉检查（必须执行！）**：

1. **检查原始图片**：
   ```bash
   # 查看 decoded/ 目录下的原始 AI 生成图片
   ls ./run/cat-soldier/decoded/
   ls ./run/dog-soldier/decoded/
   ```
   - 确认背景是否为**纯绿色 #00FF00**
   - 确认角色**不包含绿色元素**（避免描述中使用"green"、"grass"等词）

2. **检查帧图片**：
   ```bash
   # 查看 frames/ 目录下的抠图后帧
   ls ./run/cat-soldier/frames/
   ls ./run/dog-soldier/frames/
   ```
   - 确认背景已完全去除
   - 确认角色边缘清晰

3. **检查 GIF 动画**：
   ```bash
   # 查看 qa/gifs/ 目录
   ls ./run/cat-soldier/qa/gifs/
   ls ./run/dog-soldier/qa/gifs/
   ```
   - 确认敌我双方 GIF 文件名不混淆
   - ⚠️ 建议将敌方 GIF 重命名为 `enemy_idle.gif`、`enemy_walk.gif` 等

**QA 失败标准**：
- 绿色像素 > 5%
- 背景未完全去除
- 角色边缘有残留颜色
- 动画帧缺失或不连贯

**处理流程**：
```
1. 运行 render_qa.py
2. 检查 chroma-report.txt（绿色像素是否 < 5%）
3. 人工检查 decoded/ 原始图片
4. 人工检查 frames/ 抠图后帧
5. 人工检查 qa/gifs/ 动画效果
6. 如有问题：删除问题帧 → 重新生成 → 重新检查
```

**检查项目**：
- [ ] 所有帧文件存在
- [ ] 抠图质量通过（绿色像素 < 5%）
- [ ] 动画 GIF 正常播放
- [ ] 角色身份一致
- [ ] 敌我双方分别检查通过
- [ ] 人工视觉检查通过

### 3️⃣ 游戏开发

#### 3.1 项目结构

```
game_project/
├── index.html              # 游戏主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── main.js            # 游戏主逻辑
│   ├── engine.js          # 游戏引擎
│   ├── player.js          # 玩家控制
│   ├── enemy.js           # 敌人逻辑
│   ├── level.js           # 关卡管理
│   └── audio.js           # 音效管理
├── lib/
│   └── sprite-system.js   # 通用精灵管理系统
├── assets/
│   ├── characters/
│   │   ├── player/        # 玩家角色（character.json + spritesheet.webp）
│   │   └── enemy/         # 敌人角色
│   ├── backgrounds/       # 背景图片
│   ├── materials/         # 材质图片
│   └── audio/            # 音效文件
├── SPEC.md               # 游戏规格说明
└── README.md             # 项目说明
```

#### 3.2 核心代码 - 从配置加载角色

⚠️ **重要：模块脚本的启动方式**

使用 ES Module 时，**不要使用** `window.addEventListener('DOMContentLoaded', ...)`，因为模块脚本的顶层 `await import()` 可能导致 DOMContentLoaded 已触发。直接调用即可。

**main.js - 资源加载**：

```javascript
// ✅ 正确：模块脚本默认延迟执行，直接调用
const { GameEngine } = await import('./engine.js');
const { Player } = await import('./player.js');
const { Enemy } = await import('./enemy.js');

class PigContraGame {
    constructor() {
        this.engine = null;
        this.player = null;
        this.enemies = [];
        this.gameState = 'loading';
    }

    async init() {
        // 加载资源（不要在这里设置 gameState = 'playing'！）
        this.engine = new GameEngine('gameCanvas');
        this.player = new Player(this.engine, 100, 300);
        await this.player.init('assets/characters/player/character.json');

        // 加载背景
        await this.engine.loadBackground('assets/backgrounds/main-bg.png', 0.3);
        await this.engine.loadBackground('assets/backgrounds/layer1.png', 0.5);

        // 显示开始画面，等待按钮点击
        document.getElementById('loading-screen').classList.add('hidden');
    }

    // ✅ 正确：点击开始按钮后才启动游戏
    startGame() {
        this.gameState = 'playing';
        this.engine.start();
        this.gameLoop();
    }

    async spawnEnemy() {
        // ⚠️ 重要：敌人生成在可见区域内！
        // 不要用 x = engine.width + 50，会与子弹边界重合
        const x = this.engine.width * 0.7 + Math.random() * this.engine.width * 0.25;
        const enemy = new Enemy(this.engine, x, this.engine.groundY - 104);
        await enemy.init('assets/characters/enemy/character.json');
        this.enemies.push(enemy);
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;
        // ... 游戏循环
    }

    setupUI() {
        // ✅ 正确：点击后才 startGame()
        document.getElementById('start-button').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            this.startGame();
        });
    }
}

// ✅ 正确：直接调用，无需 DOMContentLoaded
const game = new PigContraGame();
game.init();
```

**player.js - 使用 character.json 配置**：

```javascript
class Player {
    constructor(gameEngine, x, y) {
        this.engine = gameEngine;
        this.x = x;
        this.y = y;
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

        this.setupInput();
    }

    async init(configPath) {
        const response = await fetch(configPath);
        this.config = await response.json();
        const spritePath = configPath.replace('character.json', this.config.spritesheetPath);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.animator = new SpriteAnimator(img, {
                    frameWidth: this.config.frameWidth,
                    frameHeight: this.config.frameHeight,
                    columns: this.config.columns,
                    frameSpeed: 120
                });

                for (const [name, anim] of Object.entries(this.config.animations)) {
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = reject;
            img.src = spritePath;
        });
    }

    shoot() {
        this.shootCooldown = 15;
        const bulletSpeed = 15;
        const bulletDir = this.facingRight ? 1 : -1;

        // ⚠️ 重要：子弹边界要足够大，能打到屏幕外的敌人
        this.bullets.push({
            x: this.x + (this.facingRight ? this.width * this.scale : 0),
            y: this.y + this.height * this.scale / 2 - 3,
            vx: bulletSpeed * bulletDir,
            width: 20,
            height: 6
        });
    }

    // ⚠️ 重要：更新子弹时边界要足够大
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            // 不要用 this.engine.width + 50，与敌人生成位置重合！
            return bullet.x > -50 && bullet.x < this.engine.width + 200;
        });
    }

    update(deltaTime) {
        if (this.dead) return;

        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.invincibleTime > 0) this.invincibleTime--;

        this.readInput();

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
            }
        }

        if (this.input.shoot && this.shootCooldown === 0) {
            this.shoot();
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.height >= this.engine.groundY) {
            this.y = this.engine.groundY - this.height;
            this.vy = 0;
            this.isOnGround = true;
        }

        // ⚠️ 重要：调用 updateBullets()
        this.updateBullets();

        this.updateAnimation();
    }

    draw(ctx) {
        if (this.dead) return;

        if (this.animator) {
            this.animator.draw(ctx, this.x, this.y, this.scale, !this.facingRight);
        }

        ctx.fillStyle = '#ff0';
        this.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
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
```

**enemy.js - 敌人使用精灵动画**：

```javascript
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

        // ⚠️ 重要：独立的巡逻方向，与 facingRight 解耦！
        this.patrolDir = 1;
        this.state = 'idle';
        this.stateTimer = 0;
        this.patrolRange = 200;

        this.shootCooldown = 0;
        this.bullets = [];
        this.deathTimer = 0;
    }

    async init(configPath) {
        const response = await fetch(configPath);
        this.config = await response.json();
        const spritePath = configPath.replace('character.json', this.config.spritesheetPath);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.animator = new SpriteAnimator(img, {
                    frameWidth: this.config.frameWidth,
                    frameHeight: this.config.frameHeight,
                    columns: this.config.columns,
                    frameSpeed: 150
                });

                // ⚠️ 重要：使用 walk-right/walk-left，不是 walk！
                for (const [name, anim] of Object.entries(this.config.animations)) {
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = reject;
            img.src = spritePath;
        });
    }

    update(deltaTime, playerX, playerY) {
        if (this.dead) {
            this.deathTimer++;
            return this.deathTimer <= 60;
        }

        if (this.shootCooldown > 0) this.shootCooldown--;
        const distToPlayer = Math.abs(this.x - playerX);
        this.facingRight = playerX > this.x;

        // ⚠️ 重要：正确的巡逻AI
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
                    // ⚠️ 使用 patrolDir 移动，不受 facingRight 影响
                    this.vx = this.speed * this.patrolDir;

                    if (Math.abs(this.x - this.startX) > this.patrolRange) {
                        // 到达边界后反转方向继续巡逻
                        this.patrolDir *= -1;
                        this.vx = this.speed * this.patrolDir;
                    }
                }
                break;

            case 'chase':
                if (distToPlayer < 150) {
                    this.state = 'attack';
                    this.vx = 0;
                } else if (distToPlayer > 500) {
                    this.state = 'patrol';
                    this.stateTimer = 0;
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

        // ⚠️ 子弹边界扩大，避免与敌人生成位置重合
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            return bullet.x > -50 && bullet.x < this.engine.width + 200;
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
            // ⚠️ 使用 walk-right/walk-left，不是 walk！
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
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.dead = true;
        this.vx = 0;
        this.vy = 0;
        this.state = 'dead';
    }

    draw(ctx) {
        if (this.animator) {
            this.animator.draw(ctx, this.x, this.y, this.scale, !this.facingRight);
        }

        this.bullets.forEach(bullet => {
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
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
```

### 4️⃣ 质量检查清单

在游戏开发前，**必须**完成以下检查：

- [ ] **玩家角色**
  - [ ] 使用 `game-character-design` 生成
  - [ ] 运行 `render_qa.py` 检查通过
  - [ ] `character.json` 配置正确
  - [ ] `spritesheet.webp` 存在且透明正确
  - [ ] 人工检查 decoded/ 原始图片背景为纯绿色
  - [ ] 人工检查 frames/ 抠图后无残留

- [ ] **敌方角色**
  - [ ] ⚠️ 精灵动画正常（不同于玩家角色）
  - [ ] ⚠️ 敌方与玩家在视觉上有明显区别
  - [ ] ⚠️ 独立生成（非从玩家复制）
  - [ ] 动作与玩家协调
  - [ ] 敌方AI行为正常
  - [ ] ⚠️ **敌人巡逻AI正常**（patrolDir与facingRight解耦）
  - [ ] ⚠️ **敌人能正常被击杀**（出生点与子弹边界不重合）
  - [ ] 人工检查 decoded/ 原始图片背景为纯绿色
  - [ ] 人工检查 frames/ 抠图后无残留
  - [ ] ⚠️ **分别运行 QA 检查**，不是一起检查

- [ ] **背景图**
  - [ ] 视差滚动正常
  - [ ] 加载无错误

- [ ] **声音系统**
  - [ ] Web Audio API 正常初始化
  - [ ] 射击音效正常播放
  - [ ] 跳跃音效正常播放
  - [ ] 攻击音效正常播放
  - [ ] 受伤/死亡音效正常播放
  - [ ] 音量控制正常

- [ ] **游戏引擎**
  - [ ] 角色动画播放正常
  - [ ] 移动/跳跃/攻击响应正确
  - [ ] 碰撞检测工作正常
  - [ ] ⚠️ **游戏在点击开始后才运行**（不是加载后就自动运行）
  - [ ] ⚠️ **敌人能正常巡逻移动**（不会卡在原地）
  - [ ] ⚠️ **子弹能击中刚出生的敌人**（出生点不在子弹射程外）
  - [ ] ⚠️ **敌人动画名正确**（使用 walk-right/walk-left，不用 walk）

## 已知问题排查

### 问题1：角色只有一个动画

**原因**：`compose_atlas.py` 未正确处理游戏角色模式

**解决**：确保使用修复后的 `game-character-design` 技能脚本

### 问题2：抠图不完整

**原因**：`chroma_key.py` 未处理所有动作行

**解决**：确保运行 `render_qa.py` 检查，所有行绿色像素 < 5%

### 问题3：敌方角色与玩家角色相同

**原因**：
1. 使用 `generate_enemy.py` 从玩家精灵直接复制
2. 敌方描述与玩家描述过于相似
3. AI 生成时没有明确要求不同的角色特征

**解决**：
1. ⚠️ **禁止使用 `generate_enemy.py`** 从玩家精灵生成敌方
2. 必须为敌方角色准备**独立的 `prepare_run.py`**
3. 敌方描述必须包含与玩家**明显不同的特征**：
   - 不同物种（如猫 vs 狗）
   - 不同颜色（如绿色服装 vs 红色服装）
   - 不同装备（如剑 vs 枪）
   - 不同发型、体型等

**正确示例**：
```bash
# 玩家：猫士兵（绿色）
python scripts/prepare_run.py \
  --character-name "Cat Soldier" \
  --description "A green uniformed cat soldier, brave hero" \
  --output-dir ./run/cat-soldier

# 敌人：狗士兵（红色）
python scripts/prepare_run.py \
  --character-name "Dog Soldier" \
  --description "A fierce red armored dog soldier, enemy warrior" \
  --output-dir ./run/dog-soldier
```

### 问题4：敌方不是动画精灵

**原因**：使用了静态图片而非精灵图

**解决**：独立生成敌方精灵，使用完整的动画生成流程

### 问题5：动画播放不正确

**原因**：`character.json` 路径或配置错误

**解决**：检查 `spritesheetPath` 是否正确，确认 `animations` 配置

### 问题6：抠图后有残留背景色

**原因**：
1. AI 生成的原始图片背景不是纯绿色（#00FF00）
2. 背景中包含绿色元素（如草地、植物、树叶）
3. 角色本身包含绿色元素

**解决**：

**A. 预防措施（提示词优化）**：
```bash
# ✅ 正确示例：
"Character on pure green background #00FF00, no grass, no plants"
"A brave cat soldier, pure green screen background, uniform in blue and yellow"

# ❌ 错误示例：
"A brave cat soldier in the grass"  # 包含草地！
"A green uniformed soldier"         # 角色本身就是绿色！
"A forest warrior"                   # 森林包含绿色植物！
```

**B. 快速检查脚本**：
```python
# 检查原始图片绿色像素比例
from PIL import Image
import numpy as np

def check_green_pixels(image_path, threshold=5):
    img = Image.open(image_path).convert('RGB')
    pixels = np.array(img)
    green_pixels = np.sum(
        (pixels[:,:,0] < 100) &  # R < 100
        (pixels[:,:,1] > 150) &  # G > 150
        (pixels[:,:,2] < 100)    # B < 100
    )
    total = pixels.shape[0] * pixels.shape[1]
    percent = green_pixels / total * 100
    print(f"绿色像素: {green_pixels}/{total} ({percent:.2f}%)")
    return percent <= threshold

# 检查所有原始图片
import os
for f in os.listdir('./decoded/'):
    if f.endswith('.png'):
        passed = check_green_pixels(f'./decoded/{f}')
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{f}: {status}")
```

**C. 修复流程**：
```
1. 运行 QA 检查
2. 如果绿色像素 > 5%：
   a. 删除该帧的原始图片（decoded/）
   b. 删除该帧的抠图结果（frames/）
   c. 使用优化后的提示词重新生成该帧
   d. 重新运行 extract_frames.py
   e. 重新运行 chroma_key.py
   f. 重新检查
3. 重复直到所有帧通过
```

### 问题7：游戏在点击"开始游戏"前就后台运行

**原因**：`init()` 中直接设置 `gameState = 'playing'` 并启动游戏循环。CSS 中开始画面 `z-index: 100` 遮住了 canvas，玩家看不到但敌人已经在生成和射击。

**症状**：玩家被看不见的敌人击杀，"加载中..."一直显示。

**解决**：
```javascript
// ❌ 错误：在 init() 中自动开始
async init() {
    // ... 加载资源
    this.gameState = 'playing';  // 错误！游戏已运行
    this.engine.start();
    this.gameLoop();
}

// ✅ 正确：init() 仅加载资源，不自动开始
async init() {
    // ... 加载资源
    this.gameState = 'loading';  // 保持加载状态
    // 显示开始画面，等待按钮点击
}

// 新增 startGame() 方法
startGame() {
    this.gameState = 'playing';
    this.engine.start();
    this.gameLoop();
}

// setupUI() 中绑定按钮
setupUI() {
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        this.startGame();  // 点击后才开始
    });
}
```

### 问题8：敌人巡逻AI陷入deadlock（卡在原地不动）

**原因**：巡逻时方向由 `facingRight` 决定（始终朝向玩家），所以敌人永远只往玩家方向走。一旦到达 patrol 边界就 idle 60 帧，再 patrol 1 帧又立刻回到 idle。敌人几乎完全静止。

**症状**：敌人站在屏幕右侧不动，或者只在很小的范围内移动。

**解决**：新增独立属性 `patrolDir`（-1=左, 1=右），与 `facingRight` 解耦：
```javascript
// 敌人构造函数中新增
this.patrolDir = 1;  // 独立的巡逻方向

// 敌人 update() 中 patrol 逻辑修复
case 'patrol':
    if (distToPlayer < 400) {
        this.state = 'chase';
        this.stateTimer = 0;
    } else {
        // 使用 patrolDir 移动，不受 facingRight 影响
        this.vx = this.speed * this.patrolDir;

        if (Math.abs(this.x - this.startX) > this.patrolRange) {
            // 到达边界后反转方向继续巡逻
            this.patrolDir *= -1;
            this.vx = this.speed * this.patrolDir;
        }
    }
    break;
```

### 问题9：敌人出生点与子弹销毁边界重合

**原因**：敌人出生在 `x = engine.width + 50 = 1010`，而子弹在 `x >= 1010` 被销毁。新刷出的敌人恰好在子弹极限射程外。

**症状**：子弹打不到刚出生的敌人，或者敌人一出生就无敌。

**解决**：
```javascript
// main.js 中敌人生成位置改为可见区域
async spawnEnemy() {
    const x = this.engine.width * 0.7 + Math.random() * this.engine.width * 0.25; // 660-910范围
    const y = this.engine.groundY - 104;
    // ...
}

// player.js 中子弹销毁边界扩大
this.bullets = this.bullets.filter(bullet => {
    bullet.x += bullet.vx;
    return bullet.x > -50 && bullet.x < this.engine.width + 200;  // 扩大边界
});

// enemy.js 中敌人子弹边界同样扩大
this.bullets = this.bullets.filter(bullet => {
    bullet.x += bullet.vx;
    return bullet.x > -50 && bullet.x < this.engine.width + 200;
});
```

### 问题10：顶层 await import 后 DOMContentLoaded 事件已触发

**原因**：使用 `window.addEventListener('DOMContentLoaded', ...)` 时，如果 `type="module"` 脚本的顶层 `await import(...)` 耗时较长，DOMContentLoaded 事件会在模块加载完成前触发。

**症状**：`init()` 从不执行，"加载中..."永远不消失，控制台无输出。

**解决**：
```javascript
// ❌ 错误：依赖 DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new PigContraGame();
    game.init();
});

// ✅ 正确：模块脚本默认延迟执行，顶层 await 完成后 DOM 已就绪
const { GameEngine } = await import('./engine.js');
const { Player } = await import('./player.js');
const { Enemy } = await import('./enemy.js');

class PigContraGame {
    async init() {
        // ... 加载资源
        document.getElementById('loading-screen').classList.add('hidden');
    }
}

// 直接调用，无需事件监听
const game = new PigContraGame();
game.init().catch(err => {
    console.error('游戏初始化失败:', err);
});
```

### 问题11：敌人动画 'walk' not found

**原因**：敌人在巡逻状态时使用动画名 `walk`，但 `character.json` 中的动画名是 `walk-right` 和 `walk-left`。

**症状**：控制台出现 `Animation 'walk' not found` 警告。

**解决**：
```javascript
// enemy.js 中 updateAnimation() 使用正确名称
updateAnimation() {
    if (Math.abs(this.vx) > 0.5) {
        animName = this.facingRight ? 'walk-right' : 'walk-left';
    }
}
```

## 总结

`img-game-dev` 技能提供了一套完整的高质量游戏开发方案：

✅ **AI 资源生成**：专业的角色、背景、材质  
✅ **完整质量检查**：render_qa.py 确保资源正确  
✅ **模块化架构**：易于维护和扩展  
✅ **配置驱动**：character.json 自动加载动画  
✅ **性能优化**：确保流畅的游戏体验  

---

**提示**：结合 `game-character-design`、`doubao-api` 和 `sprite-management` 技能使用，可获得最佳效果。
- `game-character-design`：生成角色精灵图和动画配置
- `doubao-api`：生成背景图、材质图等游戏资源
- `sprite-management`：提供通用精灵动画、资源管理、粒子效果等核心功能
