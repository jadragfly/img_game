# 问题清单与解决方案

本文档记录 `game-character-design` 和 `img-game-dev` 技能中遇到的所有问题及其解决方案。

---

## 一、game-character-design 技能问题

### 问题1：remove_black_border.py 脚本过于激进

**问题描述**：去黑框脚本会移除任何超过 30 像素的暗色列/行，导致角色边缘像素也被移除，使角色变得"面目全非"。

**原因**：脚本使用最小长度阈值来检测线条，但没有区分"真正的边框线条"和"角色边缘的正常暗色像素"。

**解决方案**：
1. **移除自动去黑框步骤**：不再在默认流程中使用 `remove_black_border.py`
2. **提供可选的 AI 背景移除**：使用 rembg 库的 `remove_all_lines.ps1` 或 `ai_bg_remove_frames.py`
3. **更新文档说明**：明确告知用户去黑框是可选步骤，不影响游戏可玩性

**涉及文件**：
- `scripts/remove_black_border.py` - 不再在默认流程中使用
- `scripts/remove_all_lines.ps1` - 可选的线条移除（更智能）
- `scripts/ai_bg_remove_frames.py` - 可选的 AI 背景移除
- `scripts/ai_bg_remove_game.py` - 可选的 AI 背景移除（直接处理 assets 目录）

---

## 二、img-game-dev 技能问题

### 问题2：敌我角色使用相同素材

**问题描述**：游戏中敌人和玩家使用相同的 spritesheet，视觉上没有区别。

**原因**：
1. 只生成了玩家角色，没有生成敌方角色
2. 后来用玩家角色覆盖了 `assets/characters/enemy/` 目录
3. 技能文档虽然说明了需要分别生成，但没有提供一键执行的脚本

**解决方案**：
1. **新增 `generate_all.py` 脚本**：一键生成玩家和敌方角色
2. **更新文档**：添加"一键生成所有角色"章节
3. **明确流程**：说明 `run/` 目录到 `assets/characters/` 的打包流程

**使用示例**：
```bash
cd D:\impotent\skills\make_game\game-character-design\scripts

python generate_all.py \
  --player "Pig Soldier" \
  --player-desc "A brave pig soldier in green military uniform" \
  --enemy "Monkey Soldier" \
  --enemy-desc "A fierce monkey soldier in red uniform" \
  --output-dir ./run
```

---

### 问题3：游戏角色大小不一致（flipX 问题）

**问题描述**：角色向左和向右时显示的大小不一致。

**原因**：`enemy.js` 和 `player.js` 中的 `draw()` 方法使用 `facingRight` 来决定是否翻转，但由于动画系统已经提供了 `walk-right` 和 `walk-left` 两个独立动画，导致逻辑冲突。

**解决方案**：
```javascript
// 修复后的 draw 方法
draw(ctx) {
    ctx.save();
    if (this.animator) {
        // 只在动画与移动方向不匹配时翻转
        const flipX = (this.currentAnimation === 'walk-right' && this.vx < 0) ||
                      (this.currentAnimation === 'walk-left' && this.vx > 0);
        this.animator.draw(ctx, this.x, this.y, this.scale, flipX);
    }
}
```

---

### 问题4：敌人向左走时显示向右的图片

**问题描述**：敌人向左移动时，动画仍是 `walk-right`，需要镜像。

**原因**：`updateAnimation()` 使用 `facingRight` 决定动画名，而不是 `vx`（实际移动方向）。

**解决方案**：
```javascript
updateAnimation() {
    if (!this.animator) return;

    let animName = 'idle';

    if (this.dead) {
        animName = 'death';
    } else if (this.state === 'attack') {
        animName = 'attack';
    } else if (Math.abs(this.vx) > 0.5) {
        // 使用 vx 决定动画名，而不是 facingRight
        animName = this.vx > 0 ? 'walk-right' : 'walk-left';
    }

    this.animator.play(animName);
}
```

---

### 问题5：游戏在点击"开始游戏"前就后台运行

**问题描述**：玩家被看不见的敌人击杀，"加载中..."一直显示。

**原因**：`init()` 中直接设置 `gameState = 'playing'` 并启动游戏循环。

**解决方案**：
```javascript
// 分离 init() 和 startGame()
async init() {
    // 只加载资源
    this.gameState = 'loading';
}

// 点击按钮后才开始
startGame() {
    this.gameState = 'playing';
    this.engine.start();
    this.gameLoop();
}
```

---

### 问题6：敌人巡逻 AI 卡死

**问题描述**：敌人站在屏幕右侧不动，或者只在很小的范围内移动。

**原因**：`facingRight` 始终朝向玩家，所以巡逻方向始终是玩家方向。

**解决方案**：新增独立的 `patrolDir` 属性：
```javascript
this.patrolDir = 1;  // 独立的巡逻方向

case 'patrol':
    // 使用 patrolDir 移动，不受 facingRight 影响
    this.vx = this.speed * this.patrolDir;

    if (Math.abs(this.x - this.startX) > this.patrolRange) {
        this.patrolDir *= -1;  // 反转巡逻方向
    }
    break;
```

---

### 问题7：敌人出生点与子弹边界重合

**问题描述**：子弹打不到刚出生的敌人。

**原因**：敌人生成在 `x = width + 50`，子弹在 `x >= width + 50` 被销毁。

**解决方案**：
```javascript
// 敌人生成位置改为可见区域
const x = this.engine.width * 0.7 + Math.random() * this.engine.width * 0.25;

// 子弹销毁边界扩大
return bullet.x > -50 && bullet.x < this.engine.width + 200;
```

---

### 问题8：白色/蓝色/灰色背景未处理

**问题描述**：部分帧有白色、蓝色或灰色背景，chroma_key.py 只处理绿色。

**原因**：AI 生成的图片背景颜色不统一。

**解决方案**：更新 `chroma_key.py` 添加多背景检测：
```python
# 白色背景检测
elif pv > 0.85 and ps < 0.15:
    pixels[x, y] = (r, g, b, 0)

# 蓝色背景检测
elif hue_diff <= 0.15 and ps >= 0.4 and pv >= 0.5:
    pixels[x, y] = (r, g, b, 0)

# 灰色背景检测
elif pv > 0.4 and pv < 0.75 and ps < 0.1:
    pixels[x, y] = (r, g, b, 0)
```

---

### 问题9：浏览器缓存问题

**问题描述**：更新 spritesheet 后浏览器仍加载旧图片。

**原因**：ES Module 会被缓存。

**解决方案**：统一版本号方案：
```javascript
// engine.js
const ASSET_VERSION = 'v=20250625';

// 加载资源时添加版本号
function loadImageWithVersion(src) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${ASSET_VERSION}`;
}

// 更新所有 import
import { SpriteAnimator } from '../lib/sprite-system.js?v=20250625';
```

---

## 三、流程说明

### 角色生成到游戏部署的完整流程

```
1. 生成角色
   run/pig-soldier/decoded/      # AI 原始图片
   run/pig-soldier/frames/       # 提取的帧
   run/pig-soldier/final/        # 合成后的 spritesheet.webp

2. 打包到 assets
   assets/characters/player/      # 玩家角色
   assets/characters/enemy/       # 敌方角色（独立生成！）

3. 可选：AI 背景移除
   - 使用 rembg 库改善图片质量
   - 不影响游戏可玩性
   - 执行时间长，用户决定是否执行

4. 游戏加载
   - 浏览器根据 ASSET_VERSION 决定是否缓存
```

### 敌我角色必须分别生成

**错误做法**：
- 只生成玩家角色
- 用玩家角色覆盖敌人目录

**正确做法**：
- 使用 `generate_all.py` 同时生成玩家和敌方
- 或分别执行两次生成流程，使用不同的描述
- 确保视觉上有明显区别（不同物种、颜色、服装等）

---

## 四、可选优化步骤

### AI 背景移除（可选）

使用 rembg 库移除背景，改善图片质量：
```bash
# 单角色处理
python ai_bg_remove_game.py

# 处理特定角色
python ai_bg_remove_frames.py
```

**注意**：这是可选步骤，不影响游戏可玩性。如果执行时间过长或遇到问题可以跳过。

### 线条移除（谨慎使用）

```bash
# 分析线条
powershell -ExecutionPolicy Bypass -File "scripts\analyze_lines.ps1"

# 移除线条（可能影响角色边缘）
powershell -ExecutionPolicy Bypass -File "scripts\remove_lines.ps1"
```

**注意**：线条移除脚本可能影响角色质量，建议仅在有明显瑕疵时使用。

---

## 五、问题优先级

| 优先级 | 问题 | 影响 |
|--------|------|------|
| 🔴 必须 | 敌我角色分别生成 | 游戏可玩性 |
| 🔴 必须 | 游戏点击后才开始 | 用户体验 |
| 🔴 必须 | 敌人巡逻AI正常 | 游戏可玩性 |
| 🔴 必须 | 敌人能被击杀 | 游戏可玩性 |
| 🟡 推荐 | 浏览器缓存刷新 | 开发效率 |
| 🟡 推荐 | 多背景色处理 | 图片质量 |
| 🟢 可选 | AI 背景移除 | 图片美观 |
| 🟢 可选 | 线条移除 | 图片美观 |
