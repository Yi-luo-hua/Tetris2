# 🚀 GitHub上传详细指南

## 当前状态
✅ 项目代码已准备完毕  
✅ GitHub仓库已创建：https://github.com/Yi-luo-hua/Tetris2  
✅ 本地Git已配置  

## 📋 推荐方案：使用GitHub Desktop（最简单）

### 1. 下载并安装GitHub Desktop
1. 访问：https://desktop.github.com/
2. 点击 "Download for Windows"
3. 下载完成后，双击安装文件
4. 按照安装向导完成安装

### 2. 登录GitHub账户
1. 打开GitHub Desktop
2. 点击 "Sign in to GitHub.com"
3. 输入你的GitHub用户名：`Yi-luo-hua`
4. 输入你的GitHub密码
5. 完成登录

### 3. 添加本地项目
1. 在GitHub Desktop中，点击菜单 "File" → "Add local repository"
2. 点击 "Choose..." 按钮
3. 导航到你的项目文件夹：`C:\Users\丁家宝\Desktop\code\Tetris2`
4. 选择文件夹，点击 "选择文件夹"
5. 点击 "Add repository"

### 4. 发布到GitHub
1. 在GitHub Desktop界面中，你会看到所有的文件变更
2. 点击左下角的 "Publish repository" 按钮
3. 在弹出的对话框中：
   - Repository name: `Tetris2`
   - Description: `俄罗斯方块游戏项目`
   - **取消勾选** "Keep this code private"（保持公开）
4. 点击 "Publish repository"

### 5. 等待上传完成
- GitHub Desktop会显示上传进度
- 完成后会显示 "Published successfully"

## 📋 备选方案：命令行推送（需要身份验证）

如果你想继续使用命令行，需要先设置身份验证：

### 方法A：使用Personal Access Token
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置Token名称：`Tetris2-Upload`
4. 选择权限：勾选 `repo` (完整仓库访问权限)
5. 点击 "Generate token"
6. **复制生成的token**（只显示一次！）

然后在命令行中：
```powershell
git push -u origin main
# 当提示输入用户名时，输入：Yi-luo-hua
# 当提示输入密码时，输入：刚才复制的token
```

### 方法B：使用SSH密钥（高级用户）
1. 生成SSH密钥
2. 添加到GitHub账户
3. 使用SSH地址推送

## 📋 第五步：启用GitHub Pages

上传完成后：

1. **访问你的仓库**
   - 打开：https://github.com/Yi-luo-hua/Tetris2

2. **进入设置**
   - 点击仓库页面上方的 "Settings" 选项卡

3. **找到Pages设置**
   - 在左侧菜单中找到 "Pages"
   - 点击进入Pages设置页面

4. **配置部署源**
   - 在 "Source" 部分
   - 选择 "GitHub Actions"
   - 点击 "Save"

5. **等待部署**
   - GitHub会自动开始部署
   - 在 "Actions" 选项卡可以查看进度
   - 通常需要2-5分钟

6. **访问你的游戏**
   - 部署完成后，访问：
   - https://yi-luo-hua.github.io/Tetris2/
   - 或者：https://yi-luo-hua.github.io/Tetris2/web/

## 🎯 推荐操作顺序

1. **使用GitHub Desktop上传**（最简单，不需要处理身份验证）
2. **启用GitHub Pages**
3. **等待部署完成**
4. **享受你的在线俄罗斯方块游戏！**

## 📞 需要帮助？

如果遇到问题：
1. GitHub Desktop界面更友好，推荐新手使用
2. 确保网络连接稳定
3. 确保GitHub账户登录正常
4. 如有疑问，可以查看GitHub Desktop的帮助文档

---

**选择最适合你的方法，我们继续下一步！** 🎉 