@echo off
echo 正在启动俄罗斯方块游戏...
echo.
echo 游戏将在浏览器中运行
echo 服务器地址: http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务器
echo.

cd web
python -m http.server 8080

pause 