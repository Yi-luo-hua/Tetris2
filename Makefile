# 俄罗斯方块游戏 Makefile

CXX = g++
CXXFLAGS = -std=c++14 -Wall -Wextra -O2
SRCDIR = src
BUILDDIR = build
WEBDIR = web

# 源文件
SOURCES = $(SRCDIR)/main.cpp \
          $(SRCDIR)/game/TetrisGame.cpp \
          $(SRCDIR)/pieces/Piece.cpp

# 目标文件
OBJECTS = $(SOURCES:$(SRCDIR)/%.cpp=$(BUILDDIR)/%.o)

# 可执行文件
TARGET = $(BUILDDIR)/tetris

# 默认目标
all: $(TARGET)

# 编译可执行文件
$(TARGET): $(OBJECTS) | $(BUILDDIR)
	$(CXX) $(OBJECTS) -o $@

# 编译目标文件
$(BUILDDIR)/%.o: $(SRCDIR)/%.cpp | $(BUILDDIR)
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# 创建构建目录
$(BUILDDIR):
	mkdir -p $(BUILDDIR)
	mkdir -p $(BUILDDIR)/game
	mkdir -p $(BUILDDIR)/pieces

# 运行游戏
run: $(TARGET)
	./$(TARGET)

# 启动Web服务器
serve:
	@echo "启动Web服务器..."
	@if command -v python3 >/dev/null 2>&1; then \
		cd $(WEBDIR) && python3 -m http.server 8080; \
	elif command -v python >/dev/null 2>&1; then \
		cd $(WEBDIR) && python -m SimpleHTTPServer 8080; \
	else \
		echo "错误: 需要安装Python来启动Web服务器"; \
		echo "请手动在web目录中启动HTTP服务器"; \
	fi

# 清理
clean:
	rm -rf $(BUILDDIR)

# 重新构建
rebuild: clean all

# 安装依赖（如果需要）
install-deps:
	@echo "检查编译环境..."
	@which $(CXX) || (echo "错误: 需要安装g++编译器" && exit 1)
	@echo "编译环境检查完成"

# 帮助信息
help:
	@echo "俄罗斯方块游戏构建系统"
	@echo ""
	@echo "可用目标:"
	@echo "  all          - 编译游戏"
	@echo "  run          - 编译并运行控制台版本"
	@echo "  serve        - 启动Web服务器运行完整版"
	@echo "  clean        - 清理构建文件"
	@echo "  rebuild      - 重新构建"
	@echo "  install-deps - 检查编译环境"
	@echo "  help         - 显示此帮助信息"

.PHONY: all run serve clean rebuild install-deps help 