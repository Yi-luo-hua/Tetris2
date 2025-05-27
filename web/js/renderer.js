// 俄罗斯方块游戏渲染器

class TetrisRenderer {
    constructor(canvas, nextPieceCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nextCanvas = nextPieceCanvas;
        this.nextCtx = nextPieceCanvas.getContext('2d');
        
        // 方块大小
        this.blockSize = canvas.width / 10; // 游戏板宽度为10
        this.nextBlockSize = 20; // 下一个方块预览的方块大小
        
        // 颜色映射
        this.colors = {
            0: 'rgba(255, 255, 255, 0.05)', // 空方块
            1: '#00ffff', // I型 - 青色
            2: '#ffff00', // O型 - 黄色
            3: '#800080', // T型 - 紫色
            4: '#00ff00', // S型 - 绿色
            5: '#ff0000', // Z型 - 红色
            6: '#0000ff', // J型 - 蓝色
            7: '#ffa500', // L型 - 橙色
            ghost: 'rgba(255, 255, 255, 0.2)' // 幽灵方块
        };
        
        // 网格线颜色
        this.gridColor = 'rgba(255, 255, 255, 0.1)';
        
        // 初始化画布
        this.setupCanvas();
    }

    // 设置画布
    setupCanvas() {
        // 设置画布样式
        this.ctx.imageSmoothingEnabled = false;
        this.nextCtx.imageSmoothingEnabled = false;
        
        // 设置字体
        this.ctx.font = '16px Orbitron, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    // 渲染游戏
    render(game) {
        this.clearCanvas();
        this.drawGrid();
        this.drawBoard(game.board);
        
        // 绘制幽灵方块（预览位置）
        const ghostPiece = game.getGhostPiece();
        if (ghostPiece) {
            this.drawPiece(ghostPiece, true);
        }
        
        // 绘制当前方块
        if (game.currentPiece) {
            this.drawPiece(game.currentPiece, false);
        }
        
        // 绘制下一个方块
        this.renderNextPiece(game.nextPiece);
        
        // 如果游戏暂停或结束，绘制覆盖层
        if (game.paused || game.gameOver) {
            this.drawOverlay(game.gameOver);
        }
    }

    // 清空画布
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制网格
    drawGrid() {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let x = 0; x <= 10; x++) {
            const xPos = x * this.blockSize;
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, 0);
            this.ctx.lineTo(xPos, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= 20; y++) {
            const yPos = y * this.blockSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, yPos);
            this.ctx.lineTo(this.canvas.width, yPos);
            this.ctx.stroke();
        }
    }

    // 绘制游戏板
    drawBoard(board) {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] !== 0) {
                    this.drawBlock(col, row, this.colors[board[row][col]], false);
                }
            }
        }
    }

    // 绘制方块
    drawPiece(piece, isGhost = false) {
        const positions = piece.getBlockPositions();
        const color = isGhost ? this.colors.ghost : this.colors[piece.color];
        
        for (const pos of positions) {
            if (pos.y >= 0) { // 只绘制在游戏板内的部分
                this.drawBlock(pos.x, pos.y, color, isGhost);
            }
        }
    }

    // 绘制单个方块
    drawBlock(x, y, color, isGhost = false) {
        const pixelX = x * this.blockSize;
        const pixelY = y * this.blockSize;
        
        // 绘制方块主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, this.blockSize, this.blockSize);
        
        if (!isGhost) {
            // 绘制方块边框和高光效果
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX + 1, pixelY + 1, this.blockSize - 2, this.blockSize - 2);
            
            // 添加内部高光
            const gradient = this.ctx.createLinearGradient(pixelX, pixelY, pixelX + this.blockSize, pixelY + this.blockSize);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(pixelX + 2, pixelY + 2, this.blockSize - 4, this.blockSize - 4);
        }
    }

    // 渲染下一个方块
    renderNextPiece(nextPiece) {
        // 清空下一个方块画布
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        // 绘制背景
        this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!nextPiece) return;
        
        // 计算居中位置
        const shape = nextPiece.shape;
        const shapeWidth = shape[0].length;
        const shapeHeight = shape.length;
        
        const startX = (this.nextCanvas.width - shapeWidth * this.nextBlockSize) / 2;
        const startY = (this.nextCanvas.height - shapeHeight * this.nextBlockSize) / 2;
        
        // 绘制方块
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const x = startX + col * this.nextBlockSize;
                    const y = startY + row * this.nextBlockSize;
                    
                    // 绘制方块主体
                    this.nextCtx.fillStyle = this.colors[nextPiece.color];
                    this.nextCtx.fillRect(x, y, this.nextBlockSize, this.nextBlockSize);
                    
                    // 绘制边框
                    this.nextCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, this.nextBlockSize, this.nextBlockSize);
                    
                    // 添加高光效果
                    const gradient = this.nextCtx.createLinearGradient(x, y, x + this.nextBlockSize, y + this.nextBlockSize);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                    this.nextCtx.fillStyle = gradient;
                    this.nextCtx.fillRect(x + 1, y + 1, this.nextBlockSize - 2, this.nextBlockSize - 2);
                }
            }
        }
    }

    // 绘制覆盖层
    drawOverlay(isGameOver) {
        // 半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 设置文字样式
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Orbitron, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        if (isGameOver) {
            // 游戏结束文字
            this.ctx.fillStyle = '#ff0066';
            this.ctx.fillText('游戏结束', centerX, centerY - 30);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Orbitron, monospace';
            this.ctx.fillText('按 R 重新开始', centerX, centerY + 10);
        } else {
            // 暂停文字
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.fillText('游戏暂停', centerX, centerY - 30);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Orbitron, monospace';
            this.ctx.fillText('按空格键继续', centerX, centerY + 10);
        }
    }
} 