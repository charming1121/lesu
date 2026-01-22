# 乐素 LeSu - 基金营销情报监控系统

基于 React + Tailwind CSS 构建的基金营销情报监控系统。

## 技术栈

- React 18
- Vite
- Tailwind CSS
- PostCSS

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # 侧边栏组件
│   │   ├── Header.jsx       # 顶部导航组件
│   │   └── Layout.jsx       # 布局组件
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML 入口
├── package.json
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
└── vite.config.js           # Vite 配置
```

## 设计说明

- **配色方案**：背景使用 `bg-slate-50`，主色调为蓝色系（`blue-500`, `blue-50`）
- **侧边栏**：固定左侧，宽度 240px，白色背景，带阴影
- **导航菜单**：选中状态使用 `bg-blue-50` 和 `text-blue-600`，左侧蓝色竖线指示
- **组件样式**：圆角 `rounded-xl`，阴影 `shadow-sm`
