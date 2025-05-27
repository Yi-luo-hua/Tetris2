#ifndef TETRIS_GAME_H
#define TETRIS_GAME_H

#include <vector>
#include <memory>
#include <random>
#include "../pieces/Piece.h"

class TetrisGame {
public:
    static const int BOARD_WIDTH = 10;
    static const int BOARD_HEIGHT = 20;
    static const int PREVIEW_SIZE = 4;

private:
    // 游戏板状态 (0=空, 1-7=不同颜色的方块)
    std::vector<std::vector<int>> board;
    
    // 当前方块和下一个方块
    std::unique_ptr<Piece> currentPiece;
    std::unique_ptr<Piece> nextPiece;
    
    // 游戏状态
    int score;
    int level;
    int linesCleared;
    bool gameOver;
    bool paused;
    
    // 随机数生成器
    std::mt19937 rng;
    std::uniform_int_distribution<int> pieceDist;
    
    // 游戏计时
    double lastMoveTime;
    double moveInterval;

public:
    TetrisGame();
    ~TetrisGame();
    
    // 游戏控制
    void startGame();
    void pauseGame();
    void resetGame();
    void update(double deltaTime);
    
    // 方块操作
    bool movePiece(int dx, int dy);
    bool rotatePiece();
    void dropPiece();
    void placePiece();
    
    // 游戏逻辑
    bool isValidPosition(const Piece& piece, int x, int y) const;
    void clearLines();
    int checkLines();
    void updateLevel();
    
    // 获取游戏状态
    const std::vector<std::vector<int>>& getBoard() const { return board; }
    const Piece* getCurrentPiece() const { return currentPiece.get(); }
    const Piece* getNextPiece() const { return nextPiece.get(); }
    int getScore() const { return score; }
    int getLevel() const { return level; }
    int getLinesCleared() const { return linesCleared; }
    bool isGameOver() const { return gameOver; }
    bool isPaused() const { return paused; }
    
    // 生成新方块
    std::unique_ptr<Piece> generateRandomPiece();
    void spawnNextPiece();
    
    // 工具函数
    void clearBoard();
    double getLevelSpeed() const;
};

#endif 