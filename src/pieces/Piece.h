#ifndef PIECE_H
#define PIECE_H

#include <vector>

enum class PieceType {
    I = 1,  // 直线型
    O = 2,  // 正方形
    T = 3,  // T型
    S = 4,  // S型
    Z = 5,  // Z型
    J = 6,  // J型
    L = 7   // L型
};

class Piece {
private:
    PieceType type;
    std::vector<std::vector<int>> shape;
    int x, y;  // 位置坐标
    int rotation;  // 旋转状态 (0-3)
    int color;  // 颜色编号

public:
    Piece(PieceType pieceType);
    Piece(const Piece& other);
    ~Piece();
    
    // 基本操作
    void rotate();
    void move(int dx, int dy);
    void setPosition(int newX, int newY);
    
    // 获取信息
    PieceType getType() const { return type; }
    const std::vector<std::vector<int>>& getShape() const { return shape; }
    int getX() const { return x; }
    int getY() const { return y; }
    int getRotation() const { return rotation; }
    int getColor() const { return color; }
    int getSize() const { return shape.size(); }
    
    // 获取方块在游戏板上的实际位置
    std::vector<std::pair<int, int>> getBlockPositions() const;
    
    // 静态方法：获取特定类型方块的初始形状
    static std::vector<std::vector<std::vector<int>>> getShapeRotations(PieceType type);
    
private:
    void initializeShape();
    void updateShapeFromRotation();
};

#endif 