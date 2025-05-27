#include "TetrisGame.h"
#include <chrono>
#include <algorithm>

TetrisGame::TetrisGame() 
    : board(BOARD_HEIGHT, std::vector<int>(BOARD_WIDTH, 0)),
      score(0), level(1), linesCleared(0), gameOver(false), paused(false),
      rng(std::chrono::steady_clock::now().time_since_epoch().count()),
      pieceDist(1, 7), lastMoveTime(0), moveInterval(1.0) {
}

TetrisGame::~TetrisGame() {
}

void TetrisGame::startGame() {
    resetGame();
    spawnNextPiece();
    spawnNextPiece();
}

void TetrisGame::pauseGame() {
    paused = !paused;
}

void TetrisGame::resetGame() {
    clearBoard();
    score = 0;
    level = 1;
    linesCleared = 0;
    gameOver = false;
    paused = false;
    lastMoveTime = 0;
    moveInterval = getLevelSpeed();
    currentPiece.reset();
    nextPiece.reset();
}

void TetrisGame::update(double deltaTime) {
    if (gameOver || paused) return;
    
    lastMoveTime += deltaTime;
    
    if (lastMoveTime >= moveInterval) {
        if (!movePiece(0, 1)) {
            placePiece();
            clearLines();
            spawnNextPiece();
            
            // 检查游戏是否结束
            if (currentPiece && !isValidPosition(*currentPiece, currentPiece->getX(), currentPiece->getY())) {
                gameOver = true;
            }
        }
        lastMoveTime = 0;
    }
}

bool TetrisGame::movePiece(int dx, int dy) {
    if (!currentPiece) return false;
    
    // 创建临时方块测试移动
    Piece tempPiece(*currentPiece);
    tempPiece.move(dx, dy);
    
    if (isValidPosition(tempPiece, tempPiece.getX(), tempPiece.getY())) {
        currentPiece->move(dx, dy);
        return true;
    }
    
    return false;
}

bool TetrisGame::rotatePiece() {
    if (!currentPiece) return false;
    
    // 创建临时方块测试旋转
    Piece tempPiece(*currentPiece);
    tempPiece.rotate();
    
    if (isValidPosition(tempPiece, tempPiece.getX(), tempPiece.getY())) {
        currentPiece->rotate();
        return true;
    }
    
    return false;
}

void TetrisGame::dropPiece() {
    if (!currentPiece) return;
    
    while (movePiece(0, 1)) {
        // 继续下落直到不能移动
    }
    
    placePiece();
    clearLines();
    spawnNextPiece();
    
    // 检查游戏是否结束
    if (currentPiece && !isValidPosition(*currentPiece, currentPiece->getX(), currentPiece->getY())) {
        gameOver = true;
    }
}

void TetrisGame::placePiece() {
    if (!currentPiece) return;
    
    auto positions = currentPiece->getBlockPositions();
    for (const auto& pos : positions) {
        if (pos.second >= 0 && pos.second < BOARD_HEIGHT && 
            pos.first >= 0 && pos.first < BOARD_WIDTH) {
            board[pos.second][pos.first] = currentPiece->getColor();
        }
    }
}

bool TetrisGame::isValidPosition(const Piece& piece, int x, int y) const {
    auto positions = piece.getBlockPositions();
    
    for (const auto& pos : positions) {
        int boardX = pos.first;
        int boardY = pos.second;
        
        // 检查边界
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return false;
        }
        
        // 允许方块在顶部上方（用于生成新方块）
        if (boardY < 0) {
            continue;
        }
        
        // 检查是否与已有方块冲突
        if (board[boardY][boardX] != 0) {
            return false;
        }
    }
    
    return true;
}

void TetrisGame::clearLines() {
    int linesRemoved = 0;
    
    for (int row = BOARD_HEIGHT - 1; row >= 0; --row) {
        bool fullLine = true;
        for (int col = 0; col < BOARD_WIDTH; ++col) {
            if (board[row][col] == 0) {
                fullLine = false;
                break;
            }
        }
        
        if (fullLine) {
            // 移除这一行
            board.erase(board.begin() + row);
            board.insert(board.begin(), std::vector<int>(BOARD_WIDTH, 0));
            linesRemoved++;
            row++; // 重新检查同一行
        }
    }
    
    if (linesRemoved > 0) {
        linesCleared += linesRemoved;
        
        // 计分系统
        int lineScore = 0;
        switch (linesRemoved) {
            case 1: lineScore = 100; break;
            case 2: lineScore = 300; break;
            case 3: lineScore = 500; break;
            case 4: lineScore = 800; break; // Tetris!
        }
        score += lineScore * level;
        
        updateLevel();
    }
}

int TetrisGame::checkLines() {
    int fullLines = 0;
    for (int row = 0; row < BOARD_HEIGHT; ++row) {
        bool fullLine = true;
        for (int col = 0; col < BOARD_WIDTH; ++col) {
            if (board[row][col] == 0) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) fullLines++;
    }
    return fullLines;
}

void TetrisGame::updateLevel() {
    int newLevel = (linesCleared / 10) + 1;
    if (newLevel != level) {
        level = newLevel;
        moveInterval = getLevelSpeed();
    }
}

std::unique_ptr<Piece> TetrisGame::generateRandomPiece() {
    int pieceNum = pieceDist(rng);
    return std::make_unique<Piece>(static_cast<PieceType>(pieceNum));
}

void TetrisGame::spawnNextPiece() {
    currentPiece = std::move(nextPiece);
    nextPiece = generateRandomPiece();
    
    if (currentPiece) {
        // 将新方块放在顶部中央
        currentPiece->setPosition(BOARD_WIDTH / 2 - 1, -1);
    }
}

void TetrisGame::clearBoard() {
    for (auto& row : board) {
        std::fill(row.begin(), row.end(), 0);
    }
}

double TetrisGame::getLevelSpeed() const {
    // 每级速度递增，最快不超过0.05秒
    return std::max(0.05, 1.0 - (level - 1) * 0.1);
} 