#include <iostream>
#include <thread>
#include <chrono>
#include "game/TetrisGame.h"

void printBoard(const TetrisGame& game) {
    const auto& board = game.getBoard();
    
    std::cout << "\033[2J\033[H"; // 清屏
    std::cout << "=== 俄罗斯方块 ===" << std::endl;
    std::cout << "分数: " << game.getScore() << " | 等级: " << game.getLevel() 
              << " | 消除行数: " << game.getLinesCleared() << std::endl;
    std::cout << std::endl;
    
    // 打印游戏板
    for (int row = 0; row < TetrisGame::BOARD_HEIGHT; ++row) {
        std::cout << "|";
        for (int col = 0; col < TetrisGame::BOARD_WIDTH; ++col) {
            if (board[row][col] == 0) {
                std::cout << " ";
            } else {
                std::cout << "#";
            }
        }
        std::cout << "|" << std::endl;
    }
    
    // 打印底部边界
    std::cout << "+";
    for (int i = 0; i < TetrisGame::BOARD_WIDTH; ++i) {
        std::cout << "-";
    }
    std::cout << "+" << std::endl;
    
    if (game.isGameOver()) {
        std::cout << "\n游戏结束！按 R 重新开始" << std::endl;
    } else if (game.isPaused()) {
        std::cout << "\n游戏暂停中..." << std::endl;
    }
    
    std::cout << "\n控制说明:" << std::endl;
    std::cout << "A/D - 左右移动 | W - 旋转 | S - 快速下落" << std::endl;
    std::cout << "空格 - 暂停 | R - 重新开始 | Q - 退出" << std::endl;
}

int main() {
    TetrisGame game;
    game.startGame();
    
    std::cout << "俄罗斯方块游戏启动！" << std::endl;
    std::cout << "注意：这是一个简化的控制台版本，完整版请运行Web界面。" << std::endl;
    std::cout << "按任意键开始..." << std::endl;
    std::cin.get();
    
    auto lastTime = std::chrono::steady_clock::now();
    
    while (true) {
        auto currentTime = std::chrono::steady_clock::now();
        double deltaTime = std::chrono::duration<double>(currentTime - lastTime).count();
        lastTime = currentTime;
        
        game.update(deltaTime);
        printBoard(game);
        
        // 简单的延时，实际游戏中应该使用更好的输入处理
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        // 这里应该添加键盘输入处理，但为了简化，我们只是演示游戏逻辑
        // 在Web版本中会有完整的交互功能
    }
    
    return 0;
} 