// 俄罗斯方块输入处理器

class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.lastKeyTime = {};
        this.keyRepeatDelay = 150; // 按键重复延迟（毫秒）
        this.keyRepeatInterval = 50; // 按键重复间隔（毫秒）
        
        this.setupKeyboardEvents();
        this.setupTouchEvents();
    }

    // 设置键盘事件
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });

        // 防止某些按键的默认行为
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    // 处理按键按下
    handleKeyDown(e) {
        const key = e.code;
        const currentTime = Date.now();
        
        // 检查是否是新按键或重复按键
        if (!this.keys[key]) {
            this.keys[key] = true;
            this.lastKeyTime[key] = currentTime;
            this.processKeyAction(key);
        } else {
            // 处理按键重复
            const timeSinceLastAction = currentTime - this.lastKeyTime[key];
            if (timeSinceLastAction >= this.keyRepeatDelay) {
                if ((timeSinceLastAction - this.keyRepeatDelay) % this.keyRepeatInterval < 20) {
                    this.processKeyAction(key);
                }
            }
        }
    }

    // 处理按键释放
    handleKeyUp(e) {
        const key = e.code;
        this.keys[key] = false;
        delete this.lastKeyTime[key];
    }

    // 处理按键动作
    processKeyAction(key) {
        if (this.game.gameOver) {
            // 游戏结束时只允许重新开始
            if (key === 'KeyR') {
                this.game.startGame();
            }
            return;
        }

        switch (key) {
            case 'ArrowLeft':
            case 'KeyA':
                this.game.movePiece(-1, 0);
                break;
                
            case 'ArrowRight':
            case 'KeyD':
                this.game.movePiece(1, 0);
                break;
                
            case 'ArrowDown':
            case 'KeyS':
                this.game.movePiece(0, 1);
                break;
                
            case 'ArrowUp':
            case 'KeyW':
                this.game.rotatePiece();
                break;
                
            case 'Space':
                if (!this.keys['Space']) { // 防止空格键重复触发
                    this.game.pauseGame();
                }
                break;
                
            case 'KeyR':
                this.game.startGame();
                break;
                
            case 'KeyQ':
                this.game.dropPiece();
                break;
        }
    }

    // 设置触摸事件（移动端支持）
    setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            const touchEndTime = Date.now();
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;
            
            // 判断手势类型
            if (deltaTime < 200) { // 快速点击
                if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
                    // 点击 - 旋转
                    this.game.rotatePiece();
                }
            } else if (deltaTime < 500) { // 滑动
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // 水平滑动
                    if (deltaX > 30) {
                        this.game.movePiece(1, 0); // 右移
                    } else if (deltaX < -30) {
                        this.game.movePiece(-1, 0); // 左移
                    }
                } else {
                    // 垂直滑动
                    if (deltaY > 30) {
                        this.game.movePiece(0, 1); // 下移
                    } else if (deltaY < -30) {
                        this.game.rotatePiece(); // 上滑旋转
                    }
                }
            } else {
                // 长按 - 快速下落
                this.game.dropPiece();
            }
        });

        // 防止触摸时的默认行为
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
    }

    // 更新输入状态（在游戏循环中调用）
    update() {
        // 处理持续按键
        const currentTime = Date.now();
        
        for (const key in this.keys) {
            if (this.keys[key] && this.lastKeyTime[key]) {
                const timeSincePress = currentTime - this.lastKeyTime[key];
                
                // 处理持续按下的移动键
                if ((key === 'ArrowLeft' || key === 'KeyA' || 
                     key === 'ArrowRight' || key === 'KeyD' ||
                     key === 'ArrowDown' || key === 'KeyS') && 
                    timeSincePress >= this.keyRepeatDelay) {
                    
                    const repeatTime = timeSincePress - this.keyRepeatDelay;
                    if (repeatTime % this.keyRepeatInterval < 16) { // 约60fps
                        this.processKeyAction(key);
                    }
                }
            }
        }
    }

    // 检查按键是否被按下
    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    // 重置输入状态
    reset() {
        this.keys = {};
        this.lastKeyTime = {};
    }

    // 设置按键重复参数
    setKeyRepeat(delay, interval) {
        this.keyRepeatDelay = delay;
        this.keyRepeatInterval = interval;
    }
}

// 虚拟按钮控制器（用于移动端）
class VirtualController {
    constructor(game) {
        this.game = game;
        this.createVirtualButtons();
    }

    createVirtualButtons() {
        // 检查是否是移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) return;

        // 创建虚拟控制器容器
        const controller = document.createElement('div');
        controller.className = 'virtual-controller';
        controller.innerHTML = `
            <div class="virtual-dpad">
                <button class="virtual-btn" data-action="rotate">↻</button>
                <div class="virtual-row">
                    <button class="virtual-btn" data-action="left">←</button>
                    <button class="virtual-btn" data-action="down">↓</button>
                    <button class="virtual-btn" data-action="right">→</button>
                </div>
            </div>
            <div class="virtual-actions">
                <button class="virtual-btn" data-action="drop">DROP</button>
                <button class="virtual-btn" data-action="pause">PAUSE</button>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .virtual-controller {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 20px;
                z-index: 1000;
            }
            
            .virtual-dpad {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .virtual-row {
                display: flex;
                gap: 5px;
            }
            
            .virtual-actions {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .virtual-btn {
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                font-family: 'Orbitron', monospace;
                font-size: 12px;
                cursor: pointer;
                user-select: none;
                backdrop-filter: blur(10px);
                transition: all 0.2s ease;
            }
            
            .virtual-btn:active {
                background: rgba(0, 212, 255, 0.3);
                transform: scale(0.95);
            }
            
            @media (max-width: 480px) {
                .virtual-controller {
                    bottom: 10px;
                }
                
                .virtual-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(controller);

        // 绑定事件
        controller.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const action = e.target.dataset.action;
            if (action) {
                this.handleVirtualButton(action);
            }
        });

        controller.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.target.dataset.action;
            if (action) {
                this.handleVirtualButton(action);
            }
        });
    }

    handleVirtualButton(action) {
        switch (action) {
            case 'left':
                this.game.movePiece(-1, 0);
                break;
            case 'right':
                this.game.movePiece(1, 0);
                break;
            case 'down':
                this.game.movePiece(0, 1);
                break;
            case 'rotate':
                this.game.rotatePiece();
                break;
            case 'drop':
                this.game.dropPiece();
                break;
            case 'pause':
                this.game.pauseGame();
                break;
        }
    }
} 