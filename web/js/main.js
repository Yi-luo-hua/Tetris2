// 俄罗斯方块游戏主程序

class TetrisApp {
    constructor() {
        this.game = null;
        this.renderer = null;
        this.inputHandler = null;
        this.audioManager = null;
        this.soundHandler = null;
        this.virtualController = null;
        
        this.isRunning = false;
        this.lastTime = 0;
        
        this.initializeGame();
        this.setupUI();
        this.startGameLoop();
    }

    // 初始化游戏
    initializeGame() {
        // 获取画布元素
        const gameCanvas = document.getElementById('gameCanvas');
        const nextPieceCanvas = document.getElementById('nextPieceCanvas');
        
        if (!gameCanvas || !nextPieceCanvas) {
            console.error('Canvas elements not found!');
            return;
        }

        // 创建游戏实例
        this.game = new TetrisGame();
        
        // 创建渲染器
        this.renderer = new TetrisRenderer(gameCanvas, nextPieceCanvas);
        
        // 创建音频管理器
        this.audioManager = new AudioManager();
        
        // 创建输入处理器
        this.inputHandler = new InputHandler(this.game);
        
        // 创建虚拟控制器（移动端）
        this.virtualController = new VirtualController(this.game);
        
        // 设置游戏事件回调
        this.setupGameCallbacks();
        
        // 启动游戏
        this.game.startGame();
        this.isRunning = true;
        
        console.log('俄罗斯方块游戏初始化完成！');
    }

    // 设置游戏回调
    setupGameCallbacks() {
        // 分数更新回调
        this.game.onScoreUpdate = (score, level, lines) => {
            this.updateUI(score, level, lines);
        };

        // 游戏结束回调
        this.game.onGameOver = () => {
            this.showGameOverOverlay();
        };

        // 消除行回调
        this.game.onLineClear = (linesCount) => {
            // 音效已在 SoundEffectHandler 中处理
        };

        // 创建音效处理器
        this.soundHandler = new SoundEffectHandler(this.audioManager, this.game);
    }

    // 设置UI事件
    setupUI() {
        // 暂停按钮
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }

        // 重新开始按钮
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.restartGame();
            });
        }

        // 覆盖层重新开始按钮
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartGame();
            });
        }

        // 音效切换按钮
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        // 初始化UI显示
        this.updateUI(0, 1, 0);
    }

    // 更新UI显示
    updateUI(score, level, lines) {
        const scoreElement = document.getElementById('score');
        const levelElement = document.getElementById('level');
        const linesElement = document.getElementById('lines');

        if (scoreElement) scoreElement.textContent = score.toLocaleString();
        if (levelElement) levelElement.textContent = level;
        if (linesElement) linesElement.textContent = lines;
    }

    // 显示游戏结束覆盖层
    showGameOverOverlay() {
        const overlay = document.getElementById('gameOverlay');
        const overlayTitle = document.getElementById('overlayTitle');
        const overlayMessage = document.getElementById('overlayMessage');

        if (overlay) {
            overlay.classList.add('show');
        }
        
        if (overlayTitle) {
            overlayTitle.textContent = '游戏结束';
        }
        
        if (overlayMessage) {
            overlayMessage.textContent = `最终分数: ${this.game.score.toLocaleString()}`;
        }
    }

    // 隐藏覆盖层
    hideOverlay() {
        const overlay = document.getElementById('gameOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    // 切换暂停状态
    togglePause() {
        if (this.game.gameOver) return;
        
        this.game.pauseGame();
        
        const overlay = document.getElementById('gameOverlay');
        const overlayTitle = document.getElementById('overlayTitle');
        const overlayMessage = document.getElementById('overlayMessage');

        if (this.game.paused) {
            if (overlay) overlay.classList.add('show');
            if (overlayTitle) overlayTitle.textContent = '游戏暂停';
            if (overlayMessage) overlayMessage.textContent = '按空格键或点击按钮继续';
        } else {
            this.hideOverlay();
        }
    }

    // 重新开始游戏
    restartGame() {
        this.game.startGame();
        this.hideOverlay();
        
        if (this.soundHandler) {
            this.soundHandler.reset();
        }
        
        // 重新启动背景音乐
        if (this.audioManager && !this.audioManager.isMuted()) {
            this.audioManager.startBackgroundMusic();
        }
    }

    // 切换音效
    toggleMute() {
        if (!this.audioManager) return;
        
        const isMuted = this.audioManager.toggleMute();
        const muteBtn = document.getElementById('muteBtn');
        
        if (muteBtn) {
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            muteBtn.title = isMuted ? '开启音效' : '关闭音效';
        }

        if (isMuted) {
            this.audioManager.stopBackgroundMusic();
        } else {
            this.audioManager.startBackgroundMusic();
        }
    }

    // 游戏主循环
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 更新游戏状态
        this.game.update(currentTime);
        
        // 更新输入
        this.inputHandler.update();
        
        // 渲染游戏
        this.renderer.render(this.game);

        // 继续循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // 启动游戏循环
    startGameLoop() {
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // 停止游戏
    stop() {
        this.isRunning = false;
        
        if (this.audioManager) {
            this.audioManager.destroy();
        }
    }

    // 调整窗口大小
    resize() {
        if (this.renderer) {
            this.renderer.resize();
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('正在初始化俄罗斯方块游戏...');
    
    // 创建游戏应用实例
    window.tetrisApp = new TetrisApp();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (window.tetrisApp) {
            window.tetrisApp.resize();
        }
    });
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        if (window.tetrisApp) {
            window.tetrisApp.stop();
        }
    });
    
    console.log('俄罗斯方块游戏启动成功！');
    console.log('控制说明:');
    console.log('- 方向键或WASD: 移动和旋转方块');
    console.log('- 空格键: 暂停/继续游戏');
    console.log('- R键: 重新开始游戏');
    console.log('- Q键: 快速下落');
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('游戏运行错误:', e.error);
});

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise错误:', e.reason);
}); 