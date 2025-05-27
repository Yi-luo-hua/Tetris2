# 俄罗斯方块游戏 (Tetris Game)

## 项目简介
这是一个使用C++实现核心逻辑，结合现代化Web前端的俄罗斯方块游戏。

## 功能特性
- ✅ 经典俄罗斯方块游戏玩法
- ✅ 7种不同形状的方块（I、O、T、S、Z、J、L）
- ✅ 方块旋转、移动、快速下落
- ✅ 行消除和计分系统
- ✅ 等级递增和速度加快
- ✅ 现代化的用户界面
- ✅ 响应式设计

## 技术栈
- **后端**: C++ (游戏逻辑)
- **前端**: HTML5 + CSS3 + JavaScript
- **图形**: Canvas API
- **构建**: 支持多平台编译

## 项目结构
```
Tetris2/
├── src/                    # C++源代码
│   ├── game/              # 游戏核心逻辑
│   ├── pieces/            # 方块定义
│   └── utils/             # 工具类
├── web/                   # Web前端
│   ├── index.html         # 主页面
│   ├── css/              # 样式文件
│   ├── js/               # JavaScript逻辑
│   └── assets/           # 资源文件
├── build/                 # 编译输出
└── docs/                  # 文档
```

## 如何运行

### 在线体验
🎮 **[点击这里在线游玩](https://your-username.github.io/Tetris2/web/)**

### 本地运行
#### 方法一：使用批处理文件（Windows）
1. 双击运行 `start_game.bat`
2. 浏览器会自动打开游戏页面

#### 方法二：手动启动
1. 在项目根目录打开终端
2. 运行：`cd web && python -m http.server 8080`
3. 在浏览器中打开：`http://localhost:8080`

#### 方法三：编译C++版本（可选）
1. 安装g++编译器
2. 编译：`g++ -std=c++14 src/main.cpp src/game/TetrisGame.cpp src/pieces/Piece.cpp -o build/tetris`
3. 运行：`./build/tetris`（控制台版本）

## 游戏控制
- **A/D 或 ←/→**: 左右移动
- **S 或 ↓**: 快速下落
- **W 或 ↑**: 旋转方块
- **空格**: 暂停/继续
- **R**: 重新开始

## 部署到GitHub Pages

### 自动部署
1. Fork或克隆此仓库到你的GitHub账户
2. 在GitHub仓库设置中启用Pages功能
3. 选择"GitHub Actions"作为部署源
4. 推送代码到main分支，GitHub Actions会自动部署

### 手动部署步骤
```bash
# 1. 克隆仓库
git clone https://github.com/your-username/Tetris2.git
cd Tetris2

# 2. 初始化Git（如果需要）
git init
git add .
git commit -m "Initial commit: 俄罗斯方块游戏"

# 3. 添加远程仓库
git remote add origin https://github.com/your-username/Tetris2.git

# 4. 推送到GitHub
git branch -M main
git push -u origin main
```

### 访问部署的游戏
部署完成后，可以通过以下地址访问：
- `https://your-username.github.io/Tetris2/web/`
- 或者 `https://your-username.github.io/Tetris2/docs/`（会自动重定向）

## 技术特点
- 🎯 **双重实现**：C++核心逻辑 + JavaScript前端
- 🎨 **现代化UI**：使用CSS3和Canvas API
- 📱 **响应式设计**：支持桌面和移动设备
- 🎵 **音效系统**：Web Audio API生成的8位风格音效
- 🎮 **多种控制方式**：键盘、触摸、虚拟按钮
- ⚡ **高性能渲染**：60FPS流畅游戏体验
- 🌐 **零依赖部署**：纯静态文件，可部署到任何Web服务器

## 开发者
- 课程作业项目
- 使用现代化技术栈实现经典游戏
- 开源项目，欢迎贡献代码 