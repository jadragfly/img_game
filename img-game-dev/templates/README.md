# Simple Game Dev - 游戏模板

这是 `simple-game-dev` 技能的游戏模板，提供了完整的 HTML5 游戏开发基础代码。

## 文件结构

```
templates/game-engine/
├── index.html          # 游戏主页面
├── css/
│   └── style.css       # 游戏样式
└── js/
    ├── main.js        # 游戏主入口
    ├── engine.js      # 游戏引擎基类
    ├── character.js   # 角色系统
    ├── collision.js   # 碰撞检测和平台
    └── ui.js          # UI 管理
```

## 快速开始

1. 复制整个 `templates/game-engine` 文件夹到你的项目目录
2. 根据你的游戏需求修改代码
3. 打开 `index.html` 即可运行

## 核心模块说明

### 1. engine.js - 游戏引擎

提供游戏循环、实体管理、调试模式等基础功能。

```javascript
const game = new GameEngine('gameCanvas', {
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB'
});

game.addEntity(entity);
game.start();
```

### 2. character.js - 角色系统

- **Character**: 基础角色类
- **Player**: 玩家角色，支持键盘控制
- **Enemy**: 敌人角色，支持 AI 巡逻

```javascript
const player = new Player({
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
```

### 3. collision.js - 碰撞和平台

- **CollisionManager**: 碰撞检测工具
- **Platform**: 平台类，支持静态和移动平台
- **Collectible**: 可收集物品

```javascript
const platform = new Platform({
    x: 200,
    y: 450,
    width: 150,
    height: 20,
    type: 'moving',
    moveRange: 100
});

const coin = new Collectible({
    x: 250,
    y: 400,
    type: 'coin',
    value: 10
});
```

### 4. ui.js - UI 管理

提供分数显示、生命条、游戏结束界面等 UI 组件。

```javascript
const ui = new UIManager();
ui.init('ui-layer');

const scoreDisplay = ui.createScoreDisplay(10, 10);
scoreDisplay.update(100);

ui.showGameOverScreen(1000);
```

## 调试模式

在开发过程中，可以开启调试模式查看详细信息：

```javascript
window.DEBUG_MODE = true;
```

开启后会显示：
- FPS 帧率
- 实体数量
- 玩家位置
- 碰撞检测信息
- 按键输入

## 自定义游戏

### 修改游戏尺寸

编辑 `engine.js` 构造函数参数：

```javascript
super('gameCanvas', {
    width: 1024,    // 宽度
    height: 768,    // 高度
    backgroundColor: '#2E2E2E'  // 背景色
});
```

### 添加新角色

1. 继承 `Character` 类
2. 实现 `update()` 和 `render()` 方法
3. 使用 `game.addEntity()` 添加到游戏

```javascript
class Boss extends Character {
    constructor(config) {
        super(config);
        this.health = 100;
    }
    
    update(deltaTime) {
        // Boss AI 逻辑
    }
    
    render(ctx) {
        // Boss 渲染
    }
}

const boss = new Boss({ x: 600, y: 200 });
game.addEntity(boss);
```

### 添加新关卡

修改 `main.js` 中的 `loadLevel()` 方法，定义新的关卡数据：

```javascript
loadLevel() {
    const levelData = {
        platforms: [...],
        collectibles: [...],
        enemies: [...]
    };
    
    // 创建关卡元素
}
```

## 示例游戏

模板包含一个完整的平台跳跃游戏示例，包括：

- ✅ 玩家控制（移动、跳跃）
- ✅ 平台系统（静态、移动平台）
- ✅ 敌人巡逻 AI
- ✅ 金币收集
- ✅ 碰撞检测
- ✅ UI 显示（分数、生命）
- ✅ 暂停功能
- ✅ 游戏结束界面

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 性能优化建议

1. **控制实体数量**：避免同时存在过多实体
2. **优化精灵图**：使用合适的图片尺寸
3. **使用对象池**：重复创建/销毁的对象使用对象池
4. **减少 drawcall**：合并相同纹理的渲染

## 扩展功能

### 添加音效

```javascript
const audio = new Audio('sound.mp3');
audio.play();
```

### 添加触摸控制

```javascript
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    // 处理触摸事件
});
```

### 添加粒子效果

```javascript
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1.0;
    }
    
    update(deltaTime) {
        this.life -= 0.02;
    }
    
    render(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, 5, 5);
    }
}
```

## 许可

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
