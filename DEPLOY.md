# GitHub Pages 部署指南

## ⚠️ 重要：先启用 GitHub Pages

在运行 GitHub Actions 之前，**必须先手动启用 GitHub Pages**：

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 点击 **Save** 保存设置

## 方法一：使用 GitHub Actions（推荐）

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库（例如：`lesu-fund-monitoring`）
2. 不要勾选 "Initialize this repository with a README"

### 2. 初始化 Git 并推送代码

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages（必须！）

**重要：这一步必须在推送代码后立即完成**

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 点击 **Save** 保存设置

### 4. 自动部署

- 如果已经启用了 GitHub Pages，推送代码后会自动触发部署
- 如果还没启用，先完成步骤3，然后重新推送一次代码或手动触发工作流
- 部署完成后，访问地址为：`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 方法二：使用简化版工作流（如果方法一失败）

如果遇到 "Setup Pages" 错误，可以使用简化版工作流：

1. 删除 `.github/workflows/deploy.yml`
2. 将 `.github/workflows/deploy-simple.yml` 重命名为 `deploy.yml`
3. 重新推送代码

或者直接使用 `gh-pages` 包手动部署（见方法三）

## 方法二：手动部署

### 1. 构建项目

```bash
npm run build
```

### 2. 部署 dist 文件夹

将 `dist` 文件夹的内容部署到 GitHub Pages：

- 使用 `gh-pages` 分支
- 或使用 GitHub Desktop
- 或手动上传到 GitHub Pages

### 3. 使用 gh-pages 包（可选）

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 在 package.json 中添加脚本
"deploy": "npm run build && gh-pages -d dist"

# 部署
npm run deploy
```

## 注意事项

1. **仓库名称**：如果仓库名称不是根路径，需要在 `vite.config.js` 中设置 `base` 路径
2. **图片路径**：确保图片路径使用相对路径或正确的 base 路径
3. **首次部署**：可能需要几分钟时间才能生效
4. **更新部署**：每次推送代码到 main 分支会自动触发部署

## 访问地址

部署成功后，访问地址格式：
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

例如：
```
https://yourusername.github.io/lesu-fund-monitoring/
```
