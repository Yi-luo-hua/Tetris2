// 俄罗斯方块游戏逻辑 (JavaScript版本)

// 方块类型定义
const PieceType = {
    I: 1, O: 2, T: 3, S: 4, Z: 5, J: 6, L: 7
};

// 方块形状定义
const PIECE_SHAPES = {
    [PieceType.I]: [
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
        [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
        [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
        [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
    ],
    [PieceType.O]: [
        [[2,2], [2,2]],
        [[2,2], [2,2]],
        [[2,2], [2,2]],
        [[2,2], [2,2]]
    ],
    [PieceType.T]: [
        [[0,3,0], [3,3,3], [0,0,0]],
        [[0,3,0], [0,3,3], [0,3,0]],
        [[0,0,0], [3,3,3], [0,3,0]],
        [[0,3,0], [3,3,0], [0,3,0]]
    ],
    [PieceType.S]: [
        [[0,4,4], [4,4,0], [0,0,0]],
        [[0,4,0], [0,4,4], [0,0,4]],
        [[0,0,0], [0,4,4], [4,4,0]],
        [[4,0,0], [4,4,0], [0,4,0]]
    ],
    [PieceType.Z]: [
        [[5,5,0], [0,5,5], [0,0,0]],
        [[0,0,5], [0,5,5], [0,5,0]],
        [[0,0,0], [5,5,0], [0,5,5]],
        [[0,5,0], [5,5,0], [5,0,0]]
    ],
    [PieceType.J]: [
        [[6,0,0], [6,6,6], [0,0,0]],
        [[0,6,6], [0,6,0], [0,6,0]],
        [[0,0,0], [6,6,6], [0,0,6]],
        [[0,6,0], [0,6,0], [6,6,0]]
    ],
    [PieceType.L]: [
        [[0,0,7], [7,7,7], [0,0,0]],
        [[0,7,0], [0,7,0], [0,7,7]],
        [[0,0,0], [7,7,7], [7,0,0]],
        [[7,7,0], [0,7,0], [0,7,0]]
    ]
};

// 方块类
class Piece {
    constructor(type) {
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.color = type;
        this.shape = PIECE_SHAPES[type][0];
    }

    // 复制构造函数
    copy() {
        const newPiece = new Piece(this.type);
        newPiece.x = this.x;
        newPiece.y = this.y;
        newPiece.rotation = this.rotation;
        newPiece.updateShape();
        return newPiece;
    }

    // 旋转方块
    rotate() {
        this.rotation = (this.rotation + 1) % 4;
        this.updateShape();
    }

    // 移动方块
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // 设置位置
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // 更新形状
    updateShape() {
        this.shape = PIECE_SHAPES[this.type][this.rotation];
    }

    // 获取方块在游戏板上的实际位置
    getBlockPositions() {
        const positions = [];
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] !== 0) {
                    positions.push({
                        x: this.x + col,
                        y: this.y + row
                    });
                }
            }
        }
        return positions;
    }

    // 获取方块大小
    getSize() {
        return this.shape.length;
    }
}

// 俄罗斯方块游戏类
class TetrisGame {
    constructor() {
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        
        // 初始化游戏板
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
        
        // 游戏状态
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.gameOver = false;
        this.paused = false;
        
        // 方块
        this.currentPiece = null;
        this.nextPiece = null;
        
        // 计时
        this.lastMoveTime = 0;
        this.moveInterval = 1000; // 毫秒
        
        // 事件回调
        this.onScoreUpdate = null;
        this.onGameOver = null;
        this.onLineClear = null;
    }

    // 开始游戏
    startGame() {
        this.resetGame();
        this.spawnNextPiece();
        this.spawnNextPiece();
    }

    // 暂停游戏
    pauseGame() {
        this.paused = !this.paused;
    }

    // 重置游戏
    resetGame() {
        this.clearBoard();
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.gameOver = false;
        this.paused = false;
        this.lastMoveTime = 0;
        this.moveInterval = this.getLevelSpeed();
        this.currentPiece = null;
        this.nextPiece = null;
        
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.level, this.linesCleared);
        }
    }

    // 更新游戏状态
    update(currentTime) {
        if (this.gameOver || this.paused) return;
        
        if (currentTime - this.lastMoveTime >= this.moveInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
                this.clearLines();
                this.spawnNextPiece();
                
                // 检查游戏是否结束
                if (this.currentPiece && !this.isValidPosition(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
                    this.gameOver = true;
                    if (this.onGameOver) {
                        this.onGameOver();
                    }
                }
            }
            this.lastMoveTime = currentTime;
        }
    }

    // 移动方块
    movePiece(dx, dy) {
        if (!this.currentPiece) return false;
        
        const tempPiece = this.currentPiece.copy();
        tempPiece.move(dx, dy);
        
        if (this.isValidPosition(tempPiece, tempPiece.x, tempPiece.y)) {
            this.currentPiece.move(dx, dy);
            return true;
        }
        
        return false;
    }

    // 旋转方块
    rotatePiece() {
        if (!this.currentPiece) return false;
        
        const tempPiece = this.currentPiece.copy();
        tempPiece.rotate();
        
        if (this.isValidPosition(tempPiece, tempPiece.x, tempPiece.y)) {
            this.currentPiece.rotate();
            return true;
        }
        
        return false;
    }

    // 快速下落
    dropPiece() {
        if (!this.currentPiece) return;
        
        while (this.movePiece(0, 1)) {
            // 继续下落直到不能移动
        }
        
        this.placePiece();
        this.clearLines();
        this.spawnNextPiece();
        
        // 检查游戏是否结束
        if (this.currentPiece && !this.isValidPosition(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
            if (this.onGameOver) {
                this.onGameOver();
            }
        }
    }

    // 放置方块
    placePiece() {
        if (!this.currentPiece) return;
        
        const positions = this.currentPiece.getBlockPositions();
        for (const pos of positions) {
            if (pos.y >= 0 && pos.y < this.BOARD_HEIGHT && 
                pos.x >= 0 && pos.x < this.BOARD_WIDTH) {
                this.board[pos.y][pos.x] = this.currentPiece.color;
            }
        }
    }

    // 检查位置是否有效
    isValidPosition(piece, x, y) {
        const positions = piece.getBlockPositions();
        
        for (const pos of positions) {
            const boardX = pos.x;
            const boardY = pos.y;
            
            // 检查边界
            if (boardX < 0 || boardX >= this.BOARD_WIDTH || boardY >= this.BOARD_HEIGHT) {
                return false;
            }
            
            // 允许方块在顶部上方（用于生成新方块）
            if (boardY < 0) {
                continue;
            }
            
            // 检查是否与已有方块冲突
            if (this.board[boardY][boardX] !== 0) {
                return false;
            }
        }
        
        return true;
    }

    // 清除满行
    clearLines() {
        let linesRemoved = 0;
        
        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            let fullLine = true;
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col] === 0) {
                    fullLine = false;
                    break;
                }
            }
            
            if (fullLine) {
                // 移除这一行
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesRemoved++;
                row++; // 重新检查同一行
            }
        }
        
        if (linesRemoved > 0) {
            this.linesCleared += linesRemoved;
            
            // 计分系统
            let lineScore = 0;
            switch (linesRemoved) {
                case 1: lineScore = 100; break;
                case 2: lineScore = 300; break;
                case 3: lineScore = 500; break;
                case 4: lineScore = 800; break; // Tetris!
            }
            this.score += lineScore * this.level;
            
            this.updateLevel();
            
            if (this.onScoreUpdate) {
                this.onScoreUpdate(this.score, this.level, this.linesCleared);
            }
            
            if (this.onLineClear) {
                this.onLineClear(linesRemoved);
            }
        }
    }

    // 更新等级
    updateLevel() {
        const newLevel = Math.floor(this.linesCleared / 10) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
            this.moveInterval = this.getLevelSpeed();
        }
    }

    // 生成随机方块
    generateRandomPiece() {
        const pieceTypes = [PieceType.I, PieceType.O, PieceType.T, PieceType.S, PieceType.Z, PieceType.J, PieceType.L];
        const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        return new Piece(randomType);
    }

    // 生成下一个方块
    spawnNextPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.generateRandomPiece();
        
        if (this.currentPiece) {
            // 将新方块放在顶部中央
            this.currentPiece.setPosition(Math.floor(this.BOARD_WIDTH / 2) - 1, -1);
        }
    }

    // 清空游戏板
    clearBoard() {
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                this.board[row][col] = 0;
            }
        }
    }

    // 获取等级对应的速度
    getLevelSpeed() {
        // 每级速度递增，最快不超过50毫秒
        return Math.max(50, 1000 - (this.level - 1) * 100);
    }

    // 获取幽灵方块位置（预览下落位置）
    getGhostPiece() {
        if (!this.currentPiece) return null;
        
        const ghostPiece = this.currentPiece.copy();
        while (this.isValidPosition(ghostPiece, ghostPiece.x, ghostPiece.y + 1)) {
            ghostPiece.move(0, 1);
        }
        
        return ghostPiece;
    }

    // 获取游戏状态
    getGameState() {
        return {
            board: this.board,
            currentPiece: this.currentPiece,
            nextPiece: this.nextPiece,
            score: this.score,
            level: this.level,
            linesCleared: this.linesCleared,
            gameOver: this.gameOver,
            paused: this.paused
        };
    }
} 