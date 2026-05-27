# 游戏项目模板

本目录包含使用 `img-game-dev` 技能生成的游戏项目模板。

## 目录结构

```
templates/
├── game-engine/           # 游戏引擎模板
│   ├── index.html        # 游戏主页面
│   ├── css/
│   │   └── style.css    # 样式文件
│   └── js/
│       ├── engine.js     # 游戏引擎核心
│       ├── main.js       # 游戏主逻辑
│       ├── character.js  # 角色基类
│       ├── collision.js  # 碰撞检测
│       └── ui.js         # UI管理
│
└── README.md            # 本文件
```

## 使用方法

当使用 `img-game-dev` 技能创建新游戏时，AI 会从这个目录复制模板文件到新项目。

## 资源生成脚本

### generate_all.py

跨平台资源生成脚本，用于生成游戏角色精灵和背景。

**位置**：项目根目录（AI 生成项目时会自动创建）

**功能**：
- 生成玩家角色精灵（调用 game-character-design 技能）
- 生成敌方角色精灵
- 创建背景目录

**使用方法**：
```bash
cd your-game-project
python generate_all.py

# 参数选项
python generate_all.py --skip-player  # 跳过玩家
python generate_all.py --skip-enemy   # 跳过敌人
python generate_all.py --force        # 强制重新生成
```

**前提条件**：
1. 设置环境变量（如果需要 AI 生图）：
   ```bash
   export DOUBAO_API_KEY="your-api-key"
   ```

2. 安装 Python 依赖：
   ```bash
   pip install -r requirements.txt
   ```

## 自定义项目

生成项目后，可以修改以下文件来定制游戏：

- `index.html` - 游戏 HTML 结构
- `css/style.css` - 游戏样式
- `js/main.js` - 游戏主逻辑
- `js/engine.js` - 游戏引擎
- `assets/` - 游戏资源（精灵图、背景等）

## 版本控制

更新 `js/engine.js` 中的 `ASSET_VERSION` 可以强制浏览器重新加载资源：
```javascript
const ASSET_VERSION = 'v=2025062601';
```
