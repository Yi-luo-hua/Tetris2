@echo off
echo ========================================
echo 俄罗斯方块游戏 - GitHub部署脚本
echo ========================================
echo.

echo 请确保你已经：
echo 1. 在GitHub上创建了仓库
echo 2. 配置了Git用户信息
echo.

set /p repo_url="请输入GitHub仓库URL (例如: https://github.com/username/Tetris2.git): "

if "%repo_url%"=="" (
    echo 错误：仓库URL不能为空
    pause
    exit /b 1
)

echo.
echo 正在初始化Git仓库...
git init

echo 添加所有文件...
git add .

echo 创建初始提交...
git commit -m "Initial commit: 俄罗斯方块游戏完整项目"

echo 添加远程仓库...
git remote add origin %repo_url%

echo 推送到GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 请按照以下步骤启用GitHub Pages：
echo 1. 访问你的GitHub仓库
echo 2. 点击 Settings 选项卡
echo 3. 滚动到 Pages 部分
echo 4. 在 Source 下选择 "GitHub Actions"
echo 5. 等待几分钟让Actions完成部署
echo.
echo 部署完成后，你的游戏将在以下地址可用：
echo https://your-username.github.io/Tetris2/web/
echo.
echo 注意：请将 'your-username' 替换为你的GitHub用户名
echo.

pause 