#include "Piece.h"
#include <algorithm>

Piece::Piece(PieceType pieceType) : type(pieceType), x(0), y(0), rotation(0) {
    color = static_cast<int>(pieceType);
    initializeShape();
}

Piece::Piece(const Piece& other) 
    : type(other.type), shape(other.shape), x(other.x), y(other.y), 
      rotation(other.rotation), color(other.color) {
}

Piece::~Piece() {
}

void Piece::initializeShape() {
    auto rotations = getShapeRotations(type);
    if (!rotations.empty()) {
        shape = rotations[0];
    }
}

void Piece::rotate() {
    rotation = (rotation + 1) % 4;
    updateShapeFromRotation();
}

void Piece::updateShapeFromRotation() {
    auto rotations = getShapeRotations(type);
    if (rotation < rotations.size()) {
        shape = rotations[rotation];
    }
}

void Piece::move(int dx, int dy) {
    x += dx;
    y += dy;
}

void Piece::setPosition(int newX, int newY) {
    x = newX;
    y = newY;
}

std::vector<std::pair<int, int>> Piece::getBlockPositions() const {
    std::vector<std::pair<int, int>> positions;
    
    for (int row = 0; row < shape.size(); ++row) {
        for (int col = 0; col < shape[row].size(); ++col) {
            if (shape[row][col] != 0) {
                positions.push_back({x + col, y + row});
            }
        }
    }
    
    return positions;
}

std::vector<std::vector<std::vector<int>>> Piece::getShapeRotations(PieceType type) {
    switch (type) {
        case PieceType::I: // 直线型
            return {
                {{0,0,0,0}, {1,1,1,1}, {0,0,0,0}, {0,0,0,0}},
                {{0,0,1,0}, {0,0,1,0}, {0,0,1,0}, {0,0,1,0}},
                {{0,0,0,0}, {0,0,0,0}, {1,1,1,1}, {0,0,0,0}},
                {{0,1,0,0}, {0,1,0,0}, {0,1,0,0}, {0,1,0,0}}
            };
            
        case PieceType::O: // 正方形
            return {
                {{2,2}, {2,2}},
                {{2,2}, {2,2}},
                {{2,2}, {2,2}},
                {{2,2}, {2,2}}
            };
            
        case PieceType::T: // T型
            return {
                {{0,3,0}, {3,3,3}, {0,0,0}},
                {{0,3,0}, {0,3,3}, {0,3,0}},
                {{0,0,0}, {3,3,3}, {0,3,0}},
                {{0,3,0}, {3,3,0}, {0,3,0}}
            };
            
        case PieceType::S: // S型
            return {
                {{0,4,4}, {4,4,0}, {0,0,0}},
                {{0,4,0}, {0,4,4}, {0,0,4}},
                {{0,0,0}, {0,4,4}, {4,4,0}},
                {{4,0,0}, {4,4,0}, {0,4,0}}
            };
            
        case PieceType::Z: // Z型
            return {
                {{5,5,0}, {0,5,5}, {0,0,0}},
                {{0,0,5}, {0,5,5}, {0,5,0}},
                {{0,0,0}, {5,5,0}, {0,5,5}},
                {{0,5,0}, {5,5,0}, {5,0,0}}
            };
            
        case PieceType::J: // J型
            return {
                {{6,0,0}, {6,6,6}, {0,0,0}},
                {{0,6,6}, {0,6,0}, {0,6,0}},
                {{0,0,0}, {6,6,6}, {0,0,6}},
                {{0,6,0}, {0,6,0}, {6,6,0}}
            };
            
        case PieceType::L: // L型
            return {
                {{0,0,7}, {7,7,7}, {0,0,0}},
                {{0,7,0}, {0,7,0}, {0,7,7}},
                {{0,0,0}, {7,7,7}, {7,0,0}},
                {{7,7,0}, {0,7,0}, {0,7,0}}
            };
    }
    
    return {};
} 