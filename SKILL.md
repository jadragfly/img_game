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

#### 2.1 一键生成所有角色（推荐）

⚠️ **重要**：为了避免敌我角色使用相同素材，必须分别生成！

**使用 `generate_all.py` 一键生成玩家和敌方角色：**

```bash
# 进入技能脚本目录
cd D:\impotent\skills\make_game\game-character-design\scripts

# 一键生成所有角色（玩家 + 敌方）
python generate_all.py \
  --player "Pig Soldier" \
  --player-desc "A brave pig soldier in green military uniform, holding rifle" \
  --enemy "Monkey Soldier" \
  --enemy-desc "A fierce monkey soldier in red uniform, aggressive warrior" \
  --output-dir D:\impotent\skills\make_game\game_project\run \
  --style platformer-16bit \
  --category "Action Adventure"
```

**脚本会自动：**
1. 分别生成玩家和敌方角色的所有帧
2. 执行抠图处理
3. 合成精灵图
4. 打包到 `assets/characters/player/` 和 `assets/characters/enemy/`

**⚠️ 注意事项：**
- 玩家和敌方必须使用不同的描述！
- 建议使用不同的物种（如猪 vs 猴子）、不同的服装颜色
- 如果角色已存在会跳过，可用 `--force` 强制重新生成

#### 2.2 玩家角色精灵生成（手动流程）

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

# 6. 可选：AI 背景移除（改善图片质量，不影响游戏可玩性）
# python scripts/ai_bg_remove_game.py  # ⚠️ 执行时间长，可跳过
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

#### 2.3 敌方角色精灵生成（手动流程）

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

#### 2.4 背景图生成

使用 `doubao-api` 技能或提供的一键生成脚本：

**方法1：使用自动化脚本（推荐）**

```bash
# 进入游戏目录
cd D:\impotent\skills\make_game\game-name

# 运行背景生成脚本
python generate_background.py
```

**generate_background.py 脚本内容**：

```python
#!/usr/bin/env python3
"""
背景图生成脚本
使用方法: python generate_background.py [--prompt "描述"] [--output "路径"]
"""
import os
import sys
import argparse
import base64
import json
import requests
from pathlib import Path

def load_env():
    """从环境变量或 .env 文件加载配置"""
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())
    
    return os.environ.get('DOUBAO_API_KEY') or os.environ.get('API_KEY')

def generate_background(prompt, output_path, api_key):
    """使用豆包 API 生成背景图"""
    base_url = os.environ.get('DOUBAO_BASE_URL', 'https://ark.cn-beijing.volces.com/api/v3')
    model = os.environ.get('DOUBAO_MODEL', 'doubao-seedream-250416')
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'model': model,
        'input': {
            'prompt': prompt,
            'aspect_ratio': '16:9'
        }
    }
    
    response = requests.post(
        f'{base_url}/tasks/image-generation',
        headers=headers,
        json=data,
        timeout=60
    )
    response.raise_for_status()
    result = response.json()
    
    task_id = result.get('id')
    print(f'任务ID: {task_id}')
    
    # 轮询任务状态
    for _ in range(60):
        response = requests.get(
            f'{base_url}/tasks/image-generation/{task_id}',
            headers=headers
        )
        result = response.json()
        status = result.get('status')
        
        if status == 'success':
            image_url = result['data']['image_url']
            # 下载图片
            image_response = requests.get(image_url)
            image_response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                f.write(image_response.content)
            print(f'背景图已保存: {output_path}')
            return True
        elif status == 'failed':
            print(f'生成失败: {result.get("error", "未知错误")}')
            return False
        
        print(f'状态: {status}...')
        import time
        time.sleep(2)
    
    print('超时')
    return False

def main():
    parser = argparse.ArgumentParser(description='生成游戏背景图')
    parser.add_argument('--prompt', '-p', default='A beautiful fantasy landscape, vibrant colors, game background, seamless',
                       help='背景描述')
    parser.add_argument('--output', '-o', default='assets/backgrounds/game-bg.webp',
                       help='输出路径')
    parser.add_argument('--width', '-w', type=int, default=960, help='图片宽度')
    parser.add_argument('--height', '-H', type=int, default=640, help='图片高度')
    
    args = parser.parse_args()
    
    api_key = load_env()
    if not api_key:
        print('错误: 请设置 DOUBAO_API_KEY 或 API_KEY 环境变量')
        sys.exit(1)
    
    # 创建输出目录
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    
    # 添加尺寸到提示词
    prompt = f'{args.prompt}, {args.width}x{args.height}'
    
    generate_background(prompt, args.output, api_key)

if __name__ == '__main__':
    main()
```

**提示词示例**：

```bash
# 坦克大战背景
python generate_background.py -p "A military battlefield at night, dark blue sky with stars, moon in corner, tactical grid overlay, radar elements, dramatic lighting, war game style, seamless edges"

# 平台跳跃背景
python generate_background.py -p "A beautiful fantasy forest landscape, magical atmosphere, detailed illustration, vibrant colors, game background, seamless"

# 科幻背景
python generate_background.py -p "A futuristic cityscape at night, neon lights, cyberpunk style, distant buildings, dramatic sky, game background"

# 合金弹头风格
python generate_background.py -p "Desert battlefield with tanks, military vehicles, explosions in distance, dramatic sky with clouds, warzone atmosphere, 2D side-scrolling game background"
```

**⚠️ 重要**：即使不生成背景图，游戏也会自动使用程序化星空背景作为后备！

**方法2：手动使用 doubao-api 技能**

```
Use Skill: doubao-api
```

> 💡 注意：`doubao-api` 技能会自动从环境变量中获取 `API_KEY` 配置，无需手动设置密钥。

**背景图规格**：

| 属性 | 值 |
|------|-----|
| 尺寸 | 960x640（与画布一致）或 1920x1080 |
| 格式 | WebP（推荐）或 PNG |
| 路径 | `assets/backgrounds/game-bg.webp` |
| 透明 | 不需要，填满整个画布 |

#### 2.5 物品精灵生成（可选）

有些游戏需要物品精灵（如 HP 血包、弹药、道具等），有些游戏不需要。根据游戏需求决定是否生成。

**判断方法**：
- 平台跳跃游戏：需要血包、弹药、道具精灵 ✅
- 射击游戏：需要子弹、爆炸、特效精灵 ✅
- 俄罗斯方块、贪吃蛇等：不需要物品精灵 ❌

**方法：使用 doubao-api 技能生成**

```
Use Skill: doubao-api
```

**常用物品提示词示例**：

```bash
# 血包/HP
python generate_item.py -p "Red medical cross icon, pixel art style, video game item, health pack, transparent background" -o assets/items/health.webp

# 弹药箱
python generate_item.py -p "Yellow ammo box with bullets, military style, pixel art, video game item, transparent background" -o assets/items/ammo.webp

# 金币
python generate_item.py -p "Golden coin, shiny, pixel art style, video game collectible, transparent background" -o assets/items/coin.webp

# 星星
python generate_item.py -p "Yellow star, glowing, pixel art, video game power-up, transparent background" -o assets/items/star.webp
```

**generate_item.py 脚本内容**：

```python
#!/usr/bin/env python3
"""
物品精灵生成脚本
使用方法: python generate_item.py --prompt "描述" --output "路径"
"""
import os
import sys
import argparse
import requests
from pathlib import Path

def load_env():
    """从环境变量或 .env 文件加载配置"""
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())
    
    return os.environ.get('DOUBAO_API_KEY') or os.environ.get('API_KEY')

def generate_item(prompt, output_path, api_key):
    """使用豆包 API 生成物品精灵"""
    base_url = os.environ.get('DOUBAO_BASE_URL', 'https://ark.cn-beijing.volces.com/api/v3')
    model = os.environ.get('DOUBAO_MODEL', 'doubao-seedream-250416')
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'model': model,
        'input': {
            'prompt': prompt,
            'aspect_ratio': '1:1'
        }
    }
    
    response = requests.post(
        f'{base_url}/tasks/image-generation',
        headers=headers,
        json=data,
        timeout=60
    )
    response.raise_for_status()
    result = response.json()
    
    task_id = result.get('id')
    print(f'任务ID: {task_id}')
    
    # 轮询任务状态
    for _ in range(60):
        response = requests.get(
            f'{base_url}/tasks/image-generation/{task_id}',
            headers=headers
        )
        result = response.json()
        status = result.get('status')
        
        if status == 'success':
            image_url = result['data']['image_url']
            image_response = requests.get(image_url)
            image_response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                f.write(image_response.content)
            print(f'物品精灵已保存: {output_path}')
            return True
        elif status == 'failed':
            print(f'生成失败: {result.get("error", "未知错误")}')
            return False
        
        print(f'状态: {status}...')
        import time
        time.sleep(2)
    
    print('超时')
    return False

def main():
    parser = argparse.ArgumentParser(description='生成游戏物品精灵')
    parser.add_argument('--prompt', '-p', required=True, help='物品描述')
    parser.add_argument('--output', '-o', default='assets/items/item.webp', help='输出路径')
    
    args = parser.parse_args()
    
    api_key = load_env()
    if not api_key:
        print('错误: 请设置 DOUBAO_API_KEY 或 API_KEY 环境变量')
        sys.exit(1)
    
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    generate_item(args.prompt, args.output, api_key)

if __name__ == '__main__':
    main()
```

**物品精灵规格**：

| 属性 | 值 |
|------|-----|
| 尺寸 | 64x64 或 128x128 |
| 格式 | PNG（支持透明）或 WebP |
| 路径 | `assets/items/` 目录 |
| 背景 | 透明背景（重要！） |

#### 2.6 Web Audio 声音系统

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
│   ├── config.js          # 全局配置（版本号等）
│   ├── main.js            # 游戏主逻辑
│   ├── engine.js          # 游戏引擎
│   ├── player.js          # 玩家控制
│   ├── enemy.js           # 敌人逻辑
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

#### 3.2 全局配置（config.js）

```javascript
// js/config.js - 全局配置，所有 JS 文件导入此配置
export const ASSET_VERSION = 'v1.0.0';
export const GAME_CONFIG = {
    width: 960,
    height: 640,
    groundHeight: 80
};
```

**所有 JS 文件导入配置的方式**：

```javascript
// engine.js
import { ASSET_VERSION, GAME_CONFIG } from './config.js';

// player.js
import { ASSET_VERSION } from './config.js';

// enemy.js
import { ASSET_VERSION } from './config.js';

// main.js
import { ASSET_VERSION } from './config.js';
```

#### 3.3 核心代码 - 从配置加载角色

⚠️ **重要：模块脚本的启动方式**

使用 ES Module 时，**不要使用** `window.addEventListener('DOMContentLoaded', ...)`，因为模块脚本的顶层 `await import()` 可能导致 DOMContentLoaded 已触发。直接调用即可。

**main.js - 资源加载**：

```javascript
import { ASSET_VERSION } from './config.js';

// ✅ 正确：模块脚本默认延迟执行，直接调用
const { GameEngine } = await import('./engine.js');
const { Player } = await import('./player.js');
const { Enemy } = await import('./enemy.js');

class PigContraGame {
    constructor() {
        this.engine = null;
        this.player = null;
        this.enemies = [];
        this.enemyPositions = [];
        this.gameState = 'loading';
        this.gameStarted = false;
        this.enemiesSpawned = 0;
        this.enemiesPerLevel = 5;
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
        var loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        
        var startScreen = document.getElementById('start-screen');
        if (startScreen) startScreen.classList.remove('hidden');
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
        this.enemyPositions.push({ x: x, y: this.engine.groundY - 104 });
        this.enemiesSpawned++;
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

        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
    }

    restartGame() {
        this.gameStarted = true;
        this.gameState = 'playing';
        this.enemies.forEach((enemy, i) => {
            if (this.enemyPositions[i]) {
                enemy.enemy.x = this.enemyPositions[i].x;
                enemy.enemy.y = this.enemyPositions[i].y;
                enemy.enemy.dead = false;
                enemy.enemy.deathTimer = 0;
                enemy.enemy.health = 1;
                enemy.enemy.state = 'idle';
                enemy.active = true;
            }
        });
        this.enemiesSpawned = 0;
        this.player.x = 100;
        this.player.y = 300;
        this.player.health = 100;
        this.player.dead = false;
        this.player.vx = 0;
        this.player.vy = 0;
        document.getElementById('game-over-screen').classList.add('hidden');
        this.gameLoop();
    }

    gameOver() {
        this.gameState = 'gameover';
        var gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.classList.remove('hidden');
        }
    }
}

// ✅ 正确：直接调用，无需 DOMContentLoaded
const game = new PigContraGame();
game.init();
```

**player.js - 使用 character.json 配置**：

```javascript
import { ASSET_VERSION } from './config.js';

class SpriteAnimator {
    // ... SpriteAnimator class code
}

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
        const basePath = configPath.endsWith('/') ? configPath : configPath + '/';
        
        try {
            const response = await fetch(basePath + 'character.json?v=' + ASSET_VERSION);
            if (!response.ok) {
                throw new Error('Failed to load config');
            }
            this.config = await response.json();
            const spritePath = basePath + (this.config.spritesheetPath || 'spritesheet.webp');
            
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.animator = new SpriteAnimator(img, {
                        frameWidth: this.config.frameWidth || 192,
                        frameHeight: this.config.frameHeight || 208,
                        columns: this.config.columns || 8,
                        frameSpeed: 120
                    });

                for (const [name, anim] of Object.entries(this.config.animations)) {
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = reject;
            img.src = spritePath + '?v=' + ASSET_VERSION;
        });
    }

    shoot() {
        this.shootCooldown = 15;
        this.isAttacking = true;  // ⚠️ 重要：射击时也要播放攻击动画！
        const bulletSpeed = 15;
        const bulletDir = this.facingRight ? 1 : -1;

        this.bullets.push({
            x: this.x + (this.facingRight ? this.width * this.scale : 0),
            y: this.y + this.height * this.scale / 2 - 3,
            vx: bulletSpeed * bulletDir,
            width: 20,
            height: 6
        });
    }

    attack() {
        this.attackCooldown = 30;
        this.isAttacking = true;
        this.vx = 0;
        // 近身攻击逻辑...
    }

    update(deltaTime) {
        if (this.dead) return;

        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.isAttacking) {
            // 攻击/射击动画播放完后重置
            // 根据实际动画帧数调整时间
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
            // ✅ 重要：使用世界坐标到屏幕坐标转换
            const screenX = this.engine.worldToScreen(this.x);
            this.animator.draw(ctx, screenX, this.y, this.scale, false);
        }

        ctx.fillStyle = '#ff0';
        this.bullets.forEach(bullet => {
            // ✅ 重要：子弹也需要转换到屏幕坐标
            const bulletScreenX = this.engine.worldToScreen(bullet.x);
            ctx.fillRect(bulletScreenX, bullet.y, bullet.width, bullet.height);
        });
    }

    getHitbox() {
        // ✅ 重要：使用精灵帧尺寸计算碰撞箱
        const spriteWidth = this.animator ? this.animator.frameWidth : 192;
        const spriteHeight = this.animator ? this.animator.frameHeight : 208;
        const hitboxWidth = spriteWidth * this.scale * 0.8;
        const hitboxHeight = spriteHeight * this.scale * 0.8;
        
        return {
            x: this.x + (spriteWidth * this.scale - hitboxWidth) / 2,
            y: this.y + (spriteHeight * this.scale - hitboxHeight),
            width: hitboxWidth,
            height: hitboxHeight
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

    updateAnimation() {
        if (!this.animator) return;

        let animName = 'idle';

        if (this.dead) {
            animName = 'idle';
        } else if (this.isCrouching) {
            animName = 'crouch';
        } else if (this.vy < 0 || !this.isOnGround) {
            animName = 'jump';
        } else if (Math.abs(this.vx) > 0.5) {
            // ⚠️ 重要：使用 walk-right/walk-left，不是 walk！
            animName = this.facingRight ? 'walk-right' : 'walk-left';
        } else if (this.isAttacking && this.shootCooldown > 0) {
            animName = this.isCrouching ? 'shoot-crouch' : 'shoot-stand';
        }

        this.animator.play(animName);
    }
}
```

**enemy.js - 敌人使用精灵动画**：

```javascript
import { ASSET_VERSION } from './config.js';

class SpriteAnimator {
    constructor(image, options) {
        this.image = image;
        this.frameWidth = options.frameWidth || 192;
        this.frameHeight = options.frameHeight || 208;
        this.columns = options.columns || 8;
        this.frameSpeed = options.frameSpeed || 120;
        
        this.currentFrame = 0;
        this.currentRow = 0;
        this.lastUpdate = 0;
        this.animations = {};
        this.currentAnimation = 'idle';
        this.loop = true;
    }
    
    addAnimation(name, config) {
        this.animations[name] = {
            row: config.row,
            startFrame: config.startFrame,
            endFrame: config.endFrame,
            loop: config.loop !== false
        };
    }
    
    play(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.lastUpdate = 0;
            
            if (this.animations[name]) {
                this.currentRow = this.animations[name].row;
            }
        }
    }
    
    update(timestamp) {
        if (!this.animations[this.currentAnimation]) return;
        
        if (timestamp - this.lastUpdate > this.frameSpeed) {
            const anim = this.animations[this.currentAnimation];
            this.currentFrame++;
            
            if (this.currentFrame > anim.endFrame) {
                if (anim.loop) {
                    this.currentFrame = anim.startFrame;
                } else {
                    this.currentFrame = anim.endFrame;
                }
            }
            
            this.lastUpdate = timestamp;
        }
    }
    
    draw(ctx, x, y, scale, flipHorizontal) {
        if (!this.image) return;
        
        ctx.save();
        
        const srcX = this.currentFrame * this.frameWidth;
        const srcY = this.currentRow * this.frameHeight;
        
        if (flipHorizontal) {
            ctx.translate(x + this.frameWidth * scale, y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                srcX, srcY, this.frameWidth, this.frameHeight,
                0, 0, this.frameWidth * scale, this.frameHeight * scale
            );
        } else {
            ctx.drawImage(
                this.image,
                srcX, srcY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * scale, this.frameHeight * scale
            );
        }
        
        ctx.restore();
    }
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

        // ⚠️ 重要：独立的巡逻方向，与 facingRight 解耦！
        this.patrolDir = 1;
        this.state = 'idle';
        this.stateTimer = 0;
        this.patrolRange = 200;

        this.shootCooldown = 0;
        this.bullets = [];
        this.deathTimer = 0;
        this.spriteOffsetY = 0;
    }

    async init(configPath) {
        const basePath = configPath.endsWith('/') ? configPath : configPath + '/';
        
        try {
            const response = await fetch(basePath + 'character.json?v=' + ASSET_VERSION);
            if (!response.ok) {
                throw new Error('Failed to load enemy config');
            }
            this.config = await response.json();
            const spritePath = basePath + (this.config.spritesheetPath || 'spritesheet.webp');
            
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.animator = new SpriteAnimator(img, {
                        frameWidth: this.config.frameWidth || 192,
                        frameHeight: this.config.frameHeight || 208,
                        columns: this.config.columns || 8,
                        frameSpeed: 150
                    });
                });

                // ⚠️ 重要：使用 walk-right/walk-left，不是 walk！
                for (const [name, anim] of Object.entries(this.config.animations)) {
                    this.animator.addAnimation(name, anim);
                }

                this.animator.play('idle');
                resolve();
            };
            img.onerror = reject;
            img.src = spritePath + '?v=' + ASSET_VERSION;
        });
        } catch (e) {
            console.error('[Enemy] Init failed:', e);
            return Promise.resolve();
        }
    }

    update(deltaTime, playerX, playerY) {
        if (this.dead) {
            this.deathTimer++;
            return this.deathTimer < 30;
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

        if (this.animator) {
            const spriteHeight = this.animator.frameHeight || 208;
            this.spriteOffsetY = this.height - spriteHeight * this.scale;
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
        // ✅ 重要：使用世界坐标到屏幕坐标转换
        const screenX = this.engine.worldToScreen(this.x);
        
        if (this.dead) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - this.deathTimer / 25);
            ctx.translate(screenX + this.width / 2, this.y + this.height);
            ctx.scale(1, 1 - this.deathTimer / 40);
            ctx.translate(-(screenX + this.width / 2), -(this.y + this.height));
            if (this.animator) {
                this.animator.draw(ctx, screenX, this.y + this.spriteOffsetY, this.scale, false);
            }
            ctx.restore();
            return;
        }

        if (this.animator) {
            this.animator.draw(ctx, screenX, this.y + this.spriteOffsetY, this.scale, false);
        }

        this.bullets.forEach(bullet => {
            // ✅ 重要：子弹也需要转换到屏幕坐标
            const bulletScreenX = this.engine.worldToScreen(bullet.x);
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(bulletScreenX, bullet.y, bullet.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    getHitbox() {
        // ✅ 重要：使用精灵帧尺寸计算碰撞箱
        const spriteWidth = this.animator ? this.animator.frameWidth : 192;
        const spriteHeight = this.animator ? this.animator.frameHeight : 208;
        const hitboxWidth = spriteWidth * this.scale * 0.8;
        const hitboxHeight = spriteHeight * this.scale * 0.8;
        
        return {
            x: this.x + (spriteWidth * this.scale - hitboxWidth) / 2,
            y: this.y + (spriteHeight * this.scale - hitboxHeight),
            width: hitboxWidth,
            height: hitboxHeight
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
  - [ ] ⚠️ **敌人精灵不被地面挡住**（使用 spriteOffsetY 计算）
  - [ ] ⚠️ **敌人死亡动画正确**（30帧内消失，有压扁效果）
  - [ ] ⚠️ **重新开始时敌人精灵正常显示**（复用敌人对象，不重新创建）
  - [ ] 人工检查 decoded/ 原始图片背景为纯绿色
  - [ ] 人工检查 frames/ 抠图后无残留
  - [ ] ⚠️ **分别运行 QA 检查**，不是一起检查

- [ ] **背景图**
  - [ ] ✅ engine.js 内置程序化背景后备
  - [ ] ✅ 背景图加载失败时自动使用程序化背景
  - [ ] ⚠️ **需要生成背景图？**（可选）
    - 如果需要：从 `img-game-dev` 技能文档获取 `generate_background.py` 脚本
    - 使用方法：`python generate_background.py -p "描述"`
    - 输出路径：`assets/backgrounds/game-bg.webp`
  - [ ] 视差滚动正常（如果有）
  - [ ] 加载无错误（可选）

- [ ] **物品精灵**（根据游戏类型判断是否需要）
  - [ ] ⚠️ **平台跳跃/射击类游戏** → 需要物品精灵
    - 如果需要：从 `img-game-dev` 技能文档获取 `generate_item.py` 脚本
    - 使用方法：`python generate_item.py -p "描述" -o "路径"`
    - 输出路径：`assets/items/` 目录
    - 物品类型：HP血包、弹药箱、金币、星星等
  - [ ] ⚠️ **俄罗斯方块/贪吃蛇等** → 不需要物品精灵 ✅
  - [ ] 物品精灵显示正常（如有）
  - [ ] 物品碰撞检测正常（如有）

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
  - [ ] ⚠️ **敌人初始位置在地面上**（使用 groundY 计算，不是硬编码）
  - [ ] ⚠️ **敌人程序化绘制后备正常**（精灵加载失败时能显示占位图形）
  - [ ] ⚠️ **敌人生成数量正确**（每关只生成指定数量，不会无限循环）

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

### 问题4.1：角色只显示上半身或下半身

**原因**：AI 生成的图片只包含部分身体，而非完整角色

**解决**：在 `--description` 中**明确要求完整角色**：

```bash
# ❌ 错误：没有强调完整角色
python scripts/prepare_run.py \
  --character-name "Warrior" \
  --description "A brave warrior holding sword" \
  --output-dir ./run/warrior

# ✅ 正确：强调完整角色
python scripts/prepare_run.py \
  --character-name "Warrior" \
  --description "A full body warrior character from head to toe, complete human figure, holding sword, standing pose" \
  --output-dir ./run/warrior
```

**提示词关键要素**：
1. `full body` - 明确要求全身
2. `complete human figure` - 完整人形
3. `from head to toe` - 从头到脚
4. `standing pose` - 站立姿势
5. `full view` - 完整视角

**完整角色提示词模板**：
```
A full body [character type], complete figure from head to toe,
[detailed description of appearance],
standing pose, full view, no cut-off,
[style keywords]
```

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

### 问题12：射击时动画不播放

**原因**：`shoot()` 方法没有设置 `isAttacking = true`，所以射击时动画仍是 `idle`。

**症状**：按 X 射击时角色没有播放攻击动画。

**解决**：
```javascript
shoot() {
    this.shootCooldown = 15;
    this.isAttacking = true;  // 添加这行！
    // ... 发射子弹逻辑

    setTimeout(() => {
        this.isAttacking = false;
    }, 200);  // 根据动画时长调整
}
```

### 问题13：白色背景/黑色线框伪影

**原因**：AI 生成的图片可能包含白色背景伪影或黑色线框，当前 QA 只检查绿色像素。

**症状**：精灵图有白色方块、黑色线框等瑕疵。

**解决**：更新 `render_qa.py` 添加白/黑像素检测：
```python
# 检测白色背景/伪影 (高亮度)
if r > 240 and g > 240 and b > 240:
    white_count += 1
# 检测黑色线框/伪影 (低亮度)
if r < 15 and g < 15 and b < 15:
    black_count += 1
```

阈值：白色像素 > 1% 或黑色像素 > 1% 视为不合格。

### 问题14：敌方精灵没成功使用

**原因**：异步加载问题，`draw()` 在 `init()` 完成前被调用。

**症状**：
```
Enemy draw: x=891, y=540, sprite=false, useSprite=false
Enemy sprite loaded successfully  // 加载成功但绘制时还未完成
```

**解决**：提供程序化绘制后备方案：
```javascript
// enemy.js 中

async init() {
    try {
        this.sprite = await this.loadSprite();
        this.useSprite = true;
    } catch (e) {
        console.log('Sprite load failed, using procedural drawing:', e.message);
        this.useSprite = false;
        this.sprite = null;
    }
    return Promise.resolve();
}

draw(ctx) {
    if (this.dead) return;
    
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    if (this.useSprite && this.sprite) {
        // 绘制精灵图
        ctx.drawImage(this.sprite, ...);
    } else {
        // ✅ 程序化绘制后备（敌方红色坦克）
        this.drawTankProcedural(ctx);
    }

    ctx.restore();
}

drawTankProcedural(ctx) {
    // 坦克主体 - 亮红色
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(-22, -22, 44, 44);
    
    // 轮廓线 - 深红色
    ctx.strokeStyle = '#990000';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22, -22, 44, 44);

    // 履带
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-25, -25, 8, 50);
    ctx.fillRect(17, -25, 8, 50);

    // 炮塔
    ctx.fillStyle = '#cc2222';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // 炮管
    ctx.fillStyle = '#333';
    ctx.fillRect(-4, -35, 8, 25);
}
```

### 问题15：背景图没生成

**原因**：游戏代码模板中没有背景图加载逻辑，图片不存在时显示黑屏。

**症状**：
```
GET http://localhost:8923/assets/backgrounds/game-bg.webp 404 (File not found)
```

**解决**：在 engine.js 中内置程序化背景后备：

```javascript
// engine.js
import { ASSET_VERSION } from './config.js';

constructor(canvasId) {
    // ... 其他初始化
    this.background = null;
    this.backgroundLoaded = false;
    this.loadBackground();
}

loadBackground() {
    const img = new Image();
    img.onload = () => {
        this.background = img;
        this.backgroundLoaded = true;
        console.log('Background loaded:', img.width, 'x', img.height);
    };
    img.onerror = (e) => {
        console.log('Background load failed, using procedural background');
        this.background = null;
    };
    img.src = 'assets/backgrounds/game-bg.webp';
}

drawBackground() {
    if (this.backgroundLoaded && this.background) {
        this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
        return;
    }
    
    // ✅ 程序化星空背景后备
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.5, '#1a1a3e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.groundY);
    
    // 星星
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 80; i++) {
        const x = (i * 137) % this.width;
        const y = (i * 89) % this.groundY;
        const size = (i % 3 === 0) ? 2 : 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// 在 main.js 的 draw() 中调用
draw() {
    this.engine.clear();
    this.engine.drawBackground();  // ✅ 添加这行
    this.engine.drawGround();
    // ...
}
```

### 问题27：玩家和敌人走出屏幕/碰撞位置偏移

**原因**：
1. 玩家和敌人使用**世界坐标**绘制，但绘制时未转换为**屏幕坐标**
2. 碰撞检测使用世界坐标，而物品绘制使用屏幕坐标
3. 摄像机系统未正确集成
4. 碰撞箱尺寸计算错误（使用配置宽度而非精灵帧宽度）

**症状**：
- 玩家向右跑时越跑越靠右直至出屏
- 子弹和玩家视觉错位
- 物品碰撞位置与视觉位置不匹配

**解决**：

**1. 在 engine.js 中添加摄像机系统和坐标转换方法：**
```javascript
// engine.js
constructor(canvasId) {
    this.cameraX = 0;
    this.levelWidth = 3000;  // 根据关卡长度设置
    // ... 其他初始化
}

updateCamera(targetX) {
    // 摄像机跟随玩家，目标位置在屏幕左侧30%处
    const idealCameraX = targetX - this.width * 0.3;
    this.cameraX += (idealCameraX - this.cameraX) * 0.15;
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.levelWidth - this.width));
}

worldToScreen(worldX) {
    return worldX - this.cameraX;
}

screenToWorld(screenX) {
    return screenX + this.cameraX;
}
```

**2. 在 main.js 的 update() 中先更新摄像机，再更新玩家：**
```javascript
update(timestamp) {
    if (this.gameState !== 'playing') return;
    
    // ✅ 重要：先更新摄像机
    this.engine.updateCamera(this.player.x);
    
    // 然后更新玩家（玩家代码会使用最新的摄像机位置）
    this.player.update(timestamp);
    
    // 更新敌人...
    // 碰撞检测...
}
```

**3. 修复 player.js 和 enemy.js 的绘制方法：**
```javascript
// player.js / enemy.js

draw(ctx) {
    if (this.dead) return;

    // ✅ 重要：使用世界坐标到屏幕坐标转换
    const screenX = this.engine.worldToScreen(this.x);
    
    if (this.animator) {
        this.animator.draw(ctx, screenX, this.y, this.scale, false);
    }

    // ✅ 子弹也需要转换到屏幕坐标
    this.bullets.forEach(bullet => {
        const bulletScreenX = this.engine.worldToScreen(bullet.x);
        ctx.fillRect(bulletScreenX, bullet.y, bullet.width, bullet.height);
    });
}
```

**4. 修复碰撞箱计算，使用精灵帧尺寸：**
```javascript
// player.js / enemy.js

getHitbox() {
    // ✅ 重要：使用精灵帧尺寸计算碰撞箱
    const spriteWidth = this.animator ? this.animator.frameWidth : 192;
    const spriteHeight = this.animator ? this.animator.frameHeight : 208;
    const hitboxWidth = spriteWidth * this.scale * 0.8;
    const hitboxHeight = spriteHeight * this.scale * 0.8;
    
    return {
        x: this.x + (spriteWidth * this.scale - hitboxWidth) / 2,
        y: this.y + (spriteHeight * this.scale - hitboxHeight),
        width: hitboxWidth,
        height: hitboxHeight
    };
}
```

**5. 修复玩家移动边界限制（防止走出屏幕）：**
```javascript
// player.js

update(deltaTime) {
    // ... 移动和物理更新 ...
    
    // ✅ 重要：使用精灵帧尺寸限制移动边界
    const spriteWidth = this.animator ? this.animator.frameWidth : 192;
    const levelMaxX = this.engine.levelWidth - spriteWidth * this.scale;
    const levelMinX = 0;
    
    const cameraMinX = this.engine.cameraX + spriteWidth * this.scale * 0.3;
    const cameraMaxX = this.engine.cameraX + this.engine.width - spriteWidth * this.scale * 0.3;
    
    this.x = Math.max(levelMinX, Math.min(this.x, levelMaxX));
    
    // 根据移动方向限制，不让玩家超出摄像机可见区域
    if (this.vx > 0 && this.x > cameraMaxX) {
        this.x = cameraMaxX;
    } else if (this.vx < 0 && this.x < cameraMinX) {
        this.x = cameraMinX;
    }
}
```

**关键要点：**
1. 所有绘制都使用屏幕坐标（世界坐标 - cameraX）
2. 碰撞检测使用世界坐标（保持不变）
3. 摄像机先于玩家更新
4. 碰撞箱使用精灵帧尺寸计算，不是配置中的宽度
5. 玩家移动边界要同时考虑关卡边界和摄像机边界

### 问题16：敌人生成无限循环

**原因**：只控制同时存在敌人数 (`maxEnemies`)，不控制总生成数量。

**症状**：第一关需要击杀 5 个敌人，但敌人无限生成，似乎永远打不完。

**解决**：添加 `enemiesSpawned` 追踪已生成数量：
```javascript
// main.js 中

constructor() {
    // ... 其他属性
    this.enemiesSpawned = 0;  // ✅ 新增：追踪已生成数量
}

async spawnEnemy() {
    // ✅ 检查：已生成数量 >= 需要的数量，不再生成
    if (this.enemiesSpawned >= this.enemiesPerLevel) {
        console.log(`All enemies spawned: ${this.enemiesSpawned}/${this.enemiesPerLevel}`);
        return;
    }
    
    const enemy = new Enemy(this.engine, x);
    await enemy.init();
    this.enemies.push(enemy);
    this.enemiesSpawned++;  // ✅ 计数增加
    
    console.log(`Spawned enemy ${this.enemiesSpawned}/${this.enemiesPerLevel}`);
}

resetGame() {
    // ... 其他重置
    this.enemiesSpawned = 0;  // ✅ 重置计数
}

nextLevel() {
    // ... 其他逻辑
    this.enemiesSpawned = 0;  // ✅ 重置计数
}
```

### 问题17：游戏立即显示胜利界面

**原因**：缺少 `gameStarted` 标志，胜利条件在游戏开始前就被检查。

**症状**：打开游戏就显示"胜利！"，点击"下一关"后才进入游戏。

**解决**：添加 `gameStarted` 标志：
```javascript
// main.js 中

constructor() {
    this.gameStarted = false;  // ✅ 新增
}

startGame() {
    this.gameStarted = true;  // ✅ 点击开始按钮后才设为 true
    this.gameState = 'playing';
    // ...
}

restartGame() {
    this.gameStarted = true;
    this.gameState = 'playing';
    // ...
}

update() {
    if (!this.gameStarted) return;  // ✅ 游戏未开始不执行逻辑
    
    // ... 游戏逻辑
    if (this.player.dead) {
        this.gameOver();
    } else if (this.enemiesKilled >= this.enemiesPerLevel && this.enemies.length === 0) {
        this.levelComplete();
    }
}
```

### 问题18：敌人初始位置在空中

**原因**：敌人 y 坐标硬编码为 50，而非基于地面高度计算。

**症状**：敌人生成后 y=50，在屏幕最上方，不是在地面上。

**解决**：使用 `engine.groundY` 计算初始位置：
```javascript
// enemy.js 中

constructor(engine, x) {
    this.engine = engine;
    this.x = x;
    this.y = engine.groundY - 50;  // ✅ 基于地面高度计算
    this.width = 48;
    this.height = 48;
    // ...
}
```

### 问题19：敌人移动不明显

**原因**：巡逻速度设置过低（`speed * 0.5 = 0.75` 像素/帧）。

**症状**：敌人虽然有巡逻 AI，但移动很慢，看起来像在原地不动。

**解决**：增加巡逻速度并添加调试日志：
```javascript
// enemy.js 中

constructor() {
    this.speed = 2;  // ✅ 从 1.5 增加到 2
}

updateState(playerX, playerY, distToPlayer) {
    switch (this.state) {
        case 'patrol':
            this.y += this.speed;  // ✅ 直接使用 speed，不乘 0.5
            this.direction = 2;
            this.rotation = Math.PI;

            // ✅ 每秒输出一次日志（60帧）
            if (this.stateTimer % 60 === 0) {
                console.log(`Patrol: y=${this.y.toFixed(0)}, state=${this.state}`);
            }
            // ...
        }
    }
}
```

### 问题20：精灵图绘制错误 - 只显示一小块

**原因**：游戏代码没有从 `character.json` 读取精灵图规格，直接硬编码了错误的尺寸。

**症状**：
- 精灵图文件存在且加载成功
- 但游戏只显示精灵图左上角的一小块（比如 48x48 而不是完整的 192x208）
- 敌方坦克看起来只有一个像素点或小块

**根因**：
```javascript
// ❌ 错误：硬编码尺寸，从 0,0 取一小块
ctx.drawImage(
    this.sprite,
    0, 0, 48, 48,  // 错误！应该用 frameWidth, frameHeight
    -24, -24, 48, 48
);
```

**正确解决方案**：从 character.json 加载配置：
```javascript
// enemy.js / player.js 中

async init() {
    // ✅ 1. 先加载配置
    try {
        const configResponse = await fetch('assets/characters/enemy/character.json');
        if (configResponse.ok) {
            const config = await configResponse.json();
            this.frameWidth = config.frameWidth;  // 192
            this.frameHeight = config.frameHeight; // 208
            console.log('Config loaded:', this.frameWidth, 'x', this.frameHeight);
        }
    } catch (e) {
        console.log('Config load failed:', e.message);
    }

    // ✅ 2. 然后加载精灵图
    this.sprite = await this.loadSprite();
}

// ✅ 3. 在绘制时使用配置中的规格
draw(ctx) {
    const srcX = this.currentFrame * this.frameWidth;  // 0, 192, 384...
    const srcY = row * this.frameHeight;             // 0, 208, 416...

    ctx.drawImage(
        this.sprite,
        srcX, srcY, this.frameWidth, this.frameHeight,  // ✅ 使用配置的值
        -this.width / 2, -this.height / 2,
        this.width, this.height
    );
}
```

**character.json 规格参考**：
```json
{
  "frameWidth": 192,
  "frameHeight": 208,
  "columns": 8,
  "atlasWidth": 1536,
  "atlasHeight": 1872
}
```

**关键要点**：
1. 精灵图每帧是 `192x208`，不是 `48x48`
2. 必须从 character.json 读取规格，不能硬编码
3. drawImage 的源区域参数必须使用 frameWidth/frameHeight

### 问题21：JavaScript ES Module 报错

**常见错误**：

#### 错误1：`SyntaxError: Invalid left-hand side in assignment`

**原因**：使用了可选链操作符 `?.`，但环境不完全支持

```javascript
// ❌ 错误：?. 在某些环境不支持
document.getElementById('xxx')?.classList.add('hidden');

// ✅ 正确：使用传统写法
var el = document.getElementById('xxx');
if (el) { el.classList.add('hidden'); }
```

#### 错误2：`SyntaxError: The requested module './xxx.js' does not provide an export named 'ClassName'`

**原因**：类定义没有 `export` 关键字

```javascript
// ❌ 错误：没有导出
class GameEngine {
    constructor() { }
}

// ✅ 正确：添加 export
export class GameEngine {
    constructor() { }
}
```

#### 错误3：`TypeError: xxx.getHitbox is not a function`

**原因**：使用了普通对象而不是类实例

```javascript
// ❌ 错误：普通对象没有方法
this.collectibles = [
    { x: 100, y: 200, type: 'coin' }  // 没有 getHitbox() 方法
];

// ✅ 正确：导入并使用类实例
import { Collectible } from './collectibles.js';

this.collectibles = [
    new Collectible({ x: 100, y: 200, type: 'coin' })  // 有 getHitbox() 方法
];
```

**ES Module 最佳实践**：
1. 所有需要被导入的类必须使用 `export class ClassName`
2. 导入时使用 `import { ClassName } from './xxx.js'`
3. 创建对象时使用 `new ClassName({...})`
4. 避免使用 `?.` 可选链，改用 `if (obj) { obj.method() }`
5. 避免使用模板字符串中的变量 `${var}` 在某些旧环境的问题，改用字符串拼接

### 问题22：敌人精灵被地面挡住

**原因**：碰撞箱高度与精灵帧高度不匹配。碰撞箱可能是 104px，但精灵帧高度是 208px，直接用碰撞箱底部对齐地面会导致精灵底部被地面覆盖。

**症状**：
- 敌人站立时身体下半部分被地面挡住
- 玩家站立在高处平台上时，脚部被平台边缘挡住

**解决**：使用 `spriteOffsetY` 计算精灵绘制偏移：
```javascript
// enemy.js / player.js 中

constructor() {
    // ... 其他属性
    this.spriteOffsetY = 0;  // 新增
}

update(deltaTime) {
    // ... 其他更新逻辑

    if (this.animator) {
        const spriteHeight = this.animator.frameHeight || 208;
        this.spriteOffsetY = this.height - spriteHeight * this.scale;
    }
}

draw(ctx) {
    if (this.animator) {
        this.animator.draw(ctx, this.x, this.y + this.spriteOffsetY, this.scale, false);
    }
}
```

### 问题23：敌人死亡后不消失

**原因**：`deathTimer <= 60` 导致敌人死亡动画持续 60 帧（约 1 秒），时间太长。

**症状**：敌人被踩后横躺在地上 1 秒才消失，感觉卡顿。

**解决**：
1. 将死亡判定从 60 帧改为 30 帧
2. 添加压扁动画效果增强视觉反馈
```javascript
// enemy.js 中

update(deltaTime, playerX, playerY) {
    if (this.dead) {
        this.deathTimer++;
        return this.deathTimer < 30;  // 从 60 改为 30
    }
    // ...
}

draw(ctx) {
    if (this.dead) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - this.deathTimer / 25);
        ctx.translate(this.x + this.width / 2, this.y + this.height);
        ctx.scale(1, 1 - this.deathTimer / 40);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height));
        if (this.animator) {
            this.animator.draw(ctx, this.x, this.y + this.spriteOffsetY, this.scale, false);
        }
        ctx.restore();
        return;
    }

    if (this.animator) {
        this.animator.draw(ctx, this.x, this.y + this.spriteOffsetY, this.scale, false);
    }
    // ...
}
```

### 问题24：重新开始时敌人显示为程序化绘制

**原因**：`restartGame()` 方法直接清空敌人数组并重新创建敌人，导致敌人精灵异步加载未完成，显示为简单的程序化图形。

**症状**：点击"重新开始"后，敌人不是精灵图而是简单的几何图形。

**解决**：复用敌人对象而非重新创建：
```javascript
// main.js 中

constructor() {
    // ... 其他属性
    this.enemyPositions = [];  // 保存敌人初始位置
}

async spawnEnemy() {
    // ... 创建敌人逻辑
    this.enemyPositions.push({ x: enemyX, y: enemyY });  // 保存位置
}

restartGame() {
    this.gameStarted = true;
    this.gameState = 'playing';

    // ✅ 复用敌人对象，而不是重新创建
    this.enemies.forEach((enemy, i) => {
        if (this.enemyPositions[i]) {
            enemy.enemy.x = this.enemyPositions[i].x;
            enemy.enemy.y = this.enemyPositions[i].y;
            enemy.enemy.dead = false;
            enemy.enemy.deathTimer = 0;
            enemy.enemy.health = 1;
            enemy.enemy.state = 'idle';
            enemy.active = true;
        }
    });

    // 重置玩家
    this.player.x = 100;
    this.player.y = 300;
    this.player.health = 100;
    this.player.dead = false;

    document.getElementById('game-over-screen').classList.add('hidden');
    this.gameLoop();
}
```

### 问题25：资源路径构建错误导致加载失败

**原因**：`init()` 方法中直接使用传入的 `configPath`，假设它是完整文件路径。当传入目录路径（如 `assets/characters/player/`）时，会导致请求错误的 URL。

**症状**：
- 浏览器控制台报错：`SyntaxError: Unexpected token '<', "<!DOCTYPE"... is not valid JSON`
- 或者：`Failed to load resource 404`

**解决**：正确处理目录路径：
```javascript
// player.js / enemy.js 中

async init(configPath) {
    const basePath = configPath.endsWith('/') ? configPath : configPath + '/';
    
    try {
        const response = await fetch(basePath + 'character.json?v=' + ASSET_VERSION);
        if (!response.ok) {
            throw new Error('Failed to load config');
        }
        this.config = await response.json();
        const spritePath = basePath + (this.config.spritesheetPath || 'spritesheet.webp');
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // 初始化动画器...
                resolve();
            };
            img.onerror = reject;
            img.src = spritePath + '?v=' + ASSET_VERSION;
        });
    } catch (e) {
        console.error('[Player/Enemy] Init failed:', e);
        return Promise.resolve();
    }
}
```

**调用方式**：
```javascript
// main.js 中
await this.player.init('assets/characters/player/');
await enemy.init('assets/characters/enemy/');
```

### 问题26：SpriteAnimator 类未定义

**原因**：`SpriteAnimator` 类只在 `player.js` 中定义，但 `enemy.js` 也需要使用它。

**症状**：浏览器控制台报错：`ReferenceError: SpriteAnimator is not defined`

**解决**：在 `enemy.js` 中也定义完整的 `SpriteAnimator` 类：
```javascript
// enemy.js 中

class SpriteAnimator {
    constructor(image, options) {
        this.image = image;
        this.frameWidth = options.frameWidth || 192;
        this.frameHeight = options.frameHeight || 208;
        this.columns = options.columns || 8;
        this.frameSpeed = options.frameSpeed || 120;
        
        this.currentFrame = 0;
        this.currentRow = 0;
        this.lastUpdate = 0;
        this.animations = {};
        this.currentAnimation = 'idle';
        this.loop = true;
    }
    
    addAnimation(name, config) {
        this.animations[name] = {
            row: config.row,
            startFrame: config.startFrame,
            endFrame: config.endFrame,
            loop: config.loop !== false
        };
    }
    
    play(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.lastUpdate = 0;
            
            if (this.animations[name]) {
                this.currentRow = this.animations[name].row;
            }
        }
    }
    
    update(timestamp) {
        if (!this.animations[this.currentAnimation]) return;
        
        if (timestamp - this.lastUpdate > this.frameSpeed) {
            const anim = this.animations[this.currentAnimation];
            this.currentFrame++;
            
            if (this.currentFrame > anim.endFrame) {
                if (anim.loop) {
                    this.currentFrame = anim.startFrame;
                } else {
                    this.currentFrame = anim.endFrame;
                }
            }
            
            this.lastUpdate = timestamp;
        }
    }
    
    draw(ctx, x, y, scale, flipHorizontal) {
        if (!this.image) return;
        
        ctx.save();
        
        const srcX = this.currentFrame * this.frameWidth;
        const srcY = this.currentRow * this.frameHeight;
        
        if (flipHorizontal) {
            ctx.translate(x + this.frameWidth * scale, y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                srcX, srcY, this.frameWidth, this.frameHeight,
                0, 0, this.frameWidth * scale, this.frameHeight * scale
            );
        } else {
            ctx.drawImage(
                this.image,
                srcX, srcY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * scale, this.frameHeight * scale
            );
        }
        
        ctx.restore();
    }
}

class Enemy {
    // ... Enemy 类代码
}
```

## 完整资源生成到部署流程

### 流程概览

```
1. 生成角色（run/ 目录）
   ├── run/pig-soldier/          # 玩家角色
   │   ├── decoded/              # AI 原始图片
   │   ├── frames/               # 提取的帧
   │   └── final/                # 合成后的 spritesheet.webp
   │
   └── run/monkey-soldier/       # 敌方角色（独立生成！）
       ├── decoded/
       ├── frames/
       └── final/

2. 打包到 assets/
   ├── assets/characters/player/
   │   ├── spritesheet.webp
   │   └── character.json
   │
   └── assets/characters/enemy/
       ├── spritesheet.webp
       └── character.json

3. ⚠️ 生成背景图（必须步骤！）
   ├── assets/backgrounds/
   │   └── game-bg.webp  # 运行 python generate_background.py
   │
   └── 如果不生成，游戏会自动使用程序化星空背景 ✅

4. 可选优化（AI 背景移除）
   - 使用 rembg 库改善图片质量
   - 不影响游戏可玩性
   - 执行时间长，用户决定是否执行

5. 游戏部署
   - 浏览器根据 ASSET_VERSION 决定是否缓存
```

#### 一键生成所有资源

当使用 `img-game-dev` 技能创建新游戏时，AI 会自动生成 `generate_all.py` 脚本：

```bash
# 进入游戏目录
cd your-game-project

# 运行一键生成（跨平台 Python 脚本，支持 Windows/Linux/Mac）
python generate_all.py

# 参数说明：
#   --skip-player  跳过玩家角色生成
#   --skip-enemy   跳过敌方角色生成
#   --skip-bg      跳过背景目录创建
#   --force        强制重新生成（覆盖已有文件）

# 示例：只生成玩家，不生成敌人
python generate_all.py --skip-enemy
```

> 💡 **跨平台支持**：使用 Python 脚本，可在 Windows、Linux、Mac 上运行。

### 关键要点

1. **敌我角色必须分别生成**
   - 使用 `generate_all.py` 一键生成
   - 或分别执行两次生成流程
   - 确保视觉上有明显区别

2. **⚠️ 背景图**
   - 游戏会自动使用程序化星空背景（内置后备）✅
   - 可选：使用 doubao-api 技能生成自定义背景
   - 背景图路径：`assets/backgrounds/game-bg.webp`

3. **资源文件位置**
   - `run/<character>/final/` - 临时的最终产物
   - `assets/characters/<type>/` - 游戏实际加载的位置
   - `assets/backgrounds/` - 背景图位置
   - 使用 `--output-dir` 参数直接打包到正确位置

4. **可选优化步骤**
   - AI 背景移除（`ai_bg_remove_game.py`）
   - 执行时间长，可跳过
   - 不影响游戏可玩性

5. **版本号管理**
   - 更新 `engine.js` 中的 `ASSET_VERSION`
   - 确保浏览器加载最新资源
   - 每次修改资源后记得更新版本号

6. **⚠️ 游戏测试流程（必须执行）**

游戏开发完成后，必须按照以下流程进行自测：

```javascript
// config.js 中统一管理版本号
export const ASSET_VERSION = 'v1.0.0';  // 每次修改资源后更新

// engine.js 中导入使用
import { ASSET_VERSION } from './config.js';

// 在 HTML 中，script 标签加上版本号
// <script type="module" src="js/main.js?v=1.0.0">
```

**编码问题预防**：

游戏代码必须使用 UTF-8 编码，避免中文乱码：

```javascript
// ❌ 错误：Python 默认使用 GBK 编码写入
with open('file.js', 'w') as f:
    f.write(content)

// ✅ 正确：指定 UTF-8 编码
with open('file.js', 'w', encoding='utf-8') as f:
    f.write(content)
```

```html
<!-- HTML 必须声明 UTF-8 -->
<meta charset="UTF-8">
```

**建议**：
- JavaScript 代码中避免使用中文注释，改用英文
- 如需中文显示，在 HTML 中使用 Unicode 转义或外部资源

**测试步骤**：

1. **启动本地服务器**
```bash
cd game-project
python -m http.server 8080
# Windows 下不要用 8080，用其他端口如 3932
python -m http.server 3932
```

2. **访问游戏并检查 Console**
   - 打开浏览器访问 `http://localhost:3932`
   - 按 F12 打开开发者工具
   - 查看 Console 标签页是否有红色错误
   - 常见错误类型：
     - `SyntaxError` - JavaScript 语法错误
     - `TypeError: xxx is not a function` - 方法调用错误
     - `404 Not Found` - 资源路径错误
     - `Failed to load resource` - 资源加载失败

3. **检查清单**
   - [ ] 游戏界面正常显示（不是白屏）
   - [ ] Console 没有红色报错
   - [ ] 点击"开始游戏"后角色显示
   - [ ] 角色可以移动和跳跃
   - [ ] 敌人正常生成和移动
   - [ ] 碰撞检测正常工作

4. **如果发现问题**
   - 修复代码
   - 更新 `ASSET_VERSION` 版本号
   - 刷新浏览器（Ctrl+Shift+R 强制刷新）
   - 再次检查 Console

**避免缓存技巧**：
```javascript
// 访问链接加上时间戳
http://localhost:3932?v=1.0.0&t=1234567890

// 或者在服务器 URL 后加随机参数
window.location.href + '?r=' + Date.now()
```

**版本号命名规范**：
- `v1.0.0` - 初始版本
- `v1.0.1` - 修复小问题
- `v1.1.0` - 添加新功能
- `v2.0.0` - 重大更新

### 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| 敌我角色相同 | 用玩家覆盖了敌人目录 | 分别生成，使用 `generate_all.py` |
| 看不到角色 | spritesheet 路径错误 | 检查 `character.json` 中的 `spritesheetPath` |
| 动画不播放 | 动画名不匹配 | 检查 `animations` 配置中的动画名 |
| 背景黑屏/星空 | 背景图加载失败 | engine.js 提供程序化后备 ✅ |
| 背景图没生成 | 没运行 generate_background.py | 运行脚本或使用程序化背景 ✅ |
| 敌人无限生成 | 缺少 enemiesSpawned 计数 | 代码已修复 ✅ |
| 游戏立即胜利 | 缺少 gameStarted 标志 | 代码已修复 ✅ |
| 敌人在空中 | y 坐标硬编码 50 | 代码已修复 ✅ |
| 敌人不动 | 巡逻速度太低 | 代码已修复 ✅ |
| 看不到敌人精灵 | 异步加载未完成 | 提供程序化绘制后备 ✅ |
| 精灵图 404 | 资源路径错误 | 检查 `assets/characters/` 目录 |
| 精灵只显示一小块 | 硬编码 48x48 而非 192x208 | 从 character.json 读取配置 ✅ |

## 总结

`img-game-dev` 技能提供了一套完整的高质量游戏开发方案：

✅ **AI 资源生成**：专业的角色、背景、材质
✅ **完整质量检查**：render_qa.py 确保资源正确
✅ **模块化架构**：易于维护和扩展
✅ **配置驱动**：character.json 自动加载动画
✅ **性能优化**：确保流畅的游戏体验
✅ **程序化后备**：精灵/背景加载失败时自动使用程序化绘制
✅ **状态管理**：gameStarted 标志确保游戏正确启动
✅ **敌人生成控制**：enemiesSpawned 追踪确保每关敌人数量正确
✅ **程序化后备**：精灵/背景加载失败时自动使用程序化绘制
✅ **动态配置加载**：从 character.json 读取精灵图规格
✅ **版本控制**：ASSET_VERSION + 时间戳避免缓存
✅ **自测流程**：启动服务器 + 检查 Console + 验证功能

---

## 坦克/载具游戏注意事项 ⚠️ 重要

如果开发坦克大战等载具游戏，请参考 `game-character-design` 技能中的**坦克/载具类角色指南**，关键点如下：

### 1. 核心原因

AI 会按照**文字描述**生成图像：
- `tank walk` → AI 理解为"坦克 + 走路" → 生成有腿的坦克 ❌
- `tank rolling` → AI 理解为"履带滚动" → 生成正常坦克 ✅

**结论**：描述**运动方式**，不要写**动作名称**。

### 2. 按角色类型的运动描述

| 角色类型 | ✅ 正确的运动词 | ❌ 错误的词 |
|---------|----------------|-----------|
| 人形角色 | walking, running, jumping | marching（敏感） |
| 坦克/履带载具 | rolling, driving, advancing | walking |
| 轮式车辆 | driving, cruising, drifting | marching |
| 悬浮机器人 | hovering, gliding, floating | walking |
| 飞行器 | flying, soaring, gliding | marching |
| 船/潜艇 | sailing, cruising, diving | marching |

### 3. 敏感词问题

⚠️ 某些单词组合可能是敏感词（涉及政治、国际关系），目前已知：

| 敏感词 | 替代词 |
|--------|--------|
| `march` | rolling, advancing, moving |
| `walk right` | moving right, advancing right |
| `charge` | advancing, rushing |

> 💡 建议使用中性的运动描述词，避免涉及军事、政治的词汇。

### 4. 颜色问题

⚠️ **精灵角色禁止使用绿色主题**（背景图不受影响）！

因为 chroma_key 使用 `#00FF00` 作为透明背景，绿色会被删除。

| ✅ 推荐 | ❌ 避免 |
|--------|--------|
| 蓝色 `#4169E1` | 绿色 `#00FF00` |
| 紫色 `#8A2BE2` | 亮绿色 |
| 橙色 `#FF8C00` | 翠绿色 |
| 红色 `#DC143C` | 黄绿色 |
| 银色 `#C0C0C0` | 浅绿色 |

### 5. 重新生成坦克

如果已经生成了有问题的坦克（如绿色坦克、用了 walk 提示词），需要：

1. 删除旧的 `run/` 和 `assets/characters/` 目录
2. 重新准备角色，使用正确的描述和颜色
3. 参考 `game-character-design` 技能的坦克指南

⚠️ **禁止使用绿色主题**！因为 chroma_key 使用 `#00FF00`（纯绿色）作为透明背景，绿色会被删除。

| ✅ 推荐 | ❌ 避免 |
|--------|--------|
| 蓝色 `#4169E1` | 绿色 `#00FF00` |
| 紫色 `#8A2BE2` | 亮绿色 |
| 橙色 `#FF8C00` | 翠绿色 |
| 红色 `#DC143C` | 黄绿色 |
| 银色 `#C0C0C0` | 浅绿色 |

### 3. 重新生成坦克

如果已经生成了有问题的坦克（如绿色坦克、用了 walk 提示词），需要：

1. 删除旧的 `run/` 和 `assets/characters/` 目录
2. 重新准备角色，使用正确的描述和颜色
3. 参考 `game-character-design` 技能的坦克指南

---

**提示**：结合 `game-character-design`、`doubao-api` 和 `sprite-management` 技能使用，可获得最佳效果。
- `game-character-design`：生成角色精灵图和动画配置
- `doubao-api`：生成背景图、材质图等游戏资源
- `sprite-management`：提供通用精灵动画、资源管理、粒子效果等核心功能
