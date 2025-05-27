# 🚀 GitHub Pages 部署指南

## 快速部署步骤

### 1. 创建GitHub仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称建议使用：`Tetris2` 或 `tetris-game`
4. 设置为 Public（公开）
5. 不要勾选 "Add a README file"（我们已经有了）
6. 点击 "Create repository"

### 2. 推送代码到GitHub

#### 方法一：使用部署脚本（推荐）
1. 双击运行 `deploy.bat`
2. 按提示输入你的GitHub仓库URL
3. 等待脚本完成

#### 方法二：手动命令（如果脚本失败）
在PowerShell中依次运行以下命令：

```powershell
# 添加远程仓库（替换为你的仓库URL）
git remote add origin https://github.com/你的用户名/Tetris2.git

# 重命名分支为main
git branch -M main

# 推送到GitHub
git push -u origin main
```

### 3. 启用GitHub Pages
1. 在GitHub仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"
4. 点击 "Save"

### 4. 等待部署完成
- GitHub Actions会自动开始部署
- 在 "Actions" 选项卡中可以查看部署进度
- 通常需要2-5分钟完成

### 5. 访问你的游戏
部署完成后，可以通过以下地址访问：
- `https://你的用户名.github.io/Tetris2/web/`
- 或者 `https://你的用户名.github.io/Tetris2/docs/`

## 🔧 故障排除

### 问题1：PowerShell不支持 && 语法
**解决方案：** 分别运行命令
```powershell
cd web
python -m http.server 8080
```

### 问题2：Git用户信息未配置
**解决方案：** 配置Git用户信息
```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 问题3：推送失败（需要认证）
**解决方案：** 
1. 使用GitHub Desktop
2. 或者配置SSH密钥
3. 或者使用Personal Access Token

### 问题4：GitHub Pages没有启用
**解决方案：** 
1. 确保仓库是Public
2. 在Settings > Pages中选择正确的源
3. 等待几分钟让更改生效

## 📱 本地测试

在部署前，可以本地测试：

### Windows用户
```powershell
cd web
python -m http.server 8080
```
然后访问 `http://localhost:8080`

### 或者直接双击
双击 `start_game.bat` 文件

## 🎮 游戏特性

✅ **完全响应式** - 支持桌面和移动设备  
✅ **零依赖** - 纯HTML5/CSS3/JavaScript  
✅ **音效系统** - Web Audio API生成的音效  
✅ **多种控制** - 键盘、触摸、虚拟按钮  
✅ **现代化UI** - 科技感设计风格  

## 📞 需要帮助？

如果遇到问题：
1. 检查GitHub Actions的运行日志
2. 确保所有文件都已正确提交
3. 验证GitHub Pages设置
4. 等待几分钟让DNS更新

---

**祝你部署成功！🎉** 