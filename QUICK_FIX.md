# 快速修复 GitHub Pages 404 错误

## 🔍 第一步：确认您的 GitHub Pages 地址

请查看您的 GitHub Pages 访问地址：

1. 打开 GitHub 仓库
2. 进入 Settings → Pages
3. 查看显示的访问地址

## 🔧 第二步：根据地址类型修改配置

### 情况 A：子路径部署
**地址格式**：`https://username.github.io/repo-name/`

**修改 `vite.config.js`**：
```javascript
base: '/repo-name/', // 替换 repo-name 为您的实际仓库名称
```

### 情况 B：根路径部署
**地址格式**：`https://username.github.io/`

**修改 `vite.config.js`**：
```javascript
base: '/',
```

### 情况 C：不确定（使用相对路径）
**当前配置**（应该可以工作）：
```javascript
base: './',
```

## 🚀 第三步：重新部署

### 如果使用 gh-pages：
```bash
npm run build
npm run deploy
```

### 如果使用 GitHub Actions：
```bash
git add .
git commit -m "Fix: Update base path"
git push
```

## ⚠️ 重要提示

1. **清除浏览器缓存**：按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新
2. **等待部署完成**：GitHub Pages 部署通常需要 2-5 分钟
3. **检查构建产物**：确保 `dist/index.html` 中的资源路径正确

## 📝 示例

假设您的仓库名称是 `lesu-fund-monitoring`，访问地址是：
`https://yourusername.github.io/lesu-fund-monitoring/`

那么 `vite.config.js` 应该设置为：
```javascript
base: '/lesu-fund-monitoring/',
```

---

**如果问题仍然存在，请告诉我您的 GitHub Pages 访问地址，我会帮您配置！**
