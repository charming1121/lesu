# GitHub Pages 404 错误修复指南

## 问题原因

GitHub Pages 部署时出现 404 错误，通常是因为资源路径不正确。这取决于您的 GitHub Pages 访问地址：

1. **子路径部署**：`https://username.github.io/repo-name/`
   - 需要设置 `base: '/repo-name/'`

2. **根路径部署**：`https://username.github.io/`
   - 使用 `base: './'` 或 `base: '/'`

## 解决方案

### 方案一：如果部署到子路径（推荐）

如果您的访问地址是 `https://username.github.io/repo-name/`，需要设置 base 路径：

1. **修改 vite.config.js**：
   ```javascript
   base: '/your-repo-name/', // 替换为您的实际仓库名称
   ```

2. **或者使用环境变量**（在 GitHub Actions 中设置）：
   - 在 `.github/workflows/deploy.yml` 的 Build 步骤中添加：
   ```yaml
   env:
     VITE_BASE_PATH: /your-repo-name/
   ```

### 方案二：如果部署到根路径

如果您的访问地址是 `https://username.github.io/`（用户名页面），使用：

```javascript
base: '/',
```

### 方案三：使用相对路径（当前配置）

当前已配置为 `base: './'`，这应该适用于大多数情况。

## 重新部署步骤

1. **修改配置后，重新构建和部署**：

```bash
# 如果使用 gh-pages
npm run deploy

# 如果使用 GitHub Actions
git add .
git commit -m "Fix: Update base path configuration"
git push
```

2. **等待部署完成**（通常需要 2-5 分钟）

3. **清除浏览器缓存**后刷新页面

## 如何确定您的 base 路径

1. 查看您的 GitHub Pages 访问地址
2. 如果地址是 `https://username.github.io/repo-name/`，base 应该是 `/repo-name/`
3. 如果地址是 `https://username.github.io/`，base 应该是 `/`

## 快速修复

请告诉我您的 GitHub Pages 访问地址，我可以帮您配置正确的 base 路径。

或者，您可以：
1. 查看 GitHub 仓库的 Settings → Pages 页面
2. 查看显示的访问地址
3. 根据地址格式设置对应的 base 路径
