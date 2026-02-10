# 项目架构分析文档

## 📋 项目概述

**项目名称**: 乐素 LeSu - 基金营销情报监控系统  
**项目类型**: 单页应用 (SPA)  
**主要功能**: 基金营销素材监控、检索、分析和可视化

---

## 🛠️ 技术栈

### 核心框架
- **React 18.2.0** - UI框架，使用函数组件和Hooks
- **React DOM 18.2.0** - React渲染库

### 构建工具
- **Vite 5.0.8** - 现代化构建工具，提供快速开发体验
  - 配置了GitHub Pages部署路径 (`base: '/lesu/'`)
  - 支持热模块替换 (HMR)
  - 生产环境代码优化和打包

### 样式方案
- **Tailwind CSS 3.4.0** - 实用优先的CSS框架
  - 响应式设计
  - 自定义主题配置
- **PostCSS 8.4.32** - CSS后处理器
- **Autoprefixer 10.4.16** - 自动添加浏览器前缀

### UI组件库
- **Lucide React 0.294.0** - 图标库
  - 提供丰富的SVG图标组件
  - 轻量级、可定制

### 数据可视化
- **Recharts 2.10.3** - React图表库
  - 支持多种图表类型（折线图、柱状图、饼图、面积图等）
  - 响应式设计
  - 用于行业雷达、趋势分析等可视化

### 开发工具
- **@vitejs/plugin-react 4.2.1** - Vite的React插件
- **TypeScript类型定义** - 提供类型提示（@types/react, @types/react-dom）
- **gh-pages 6.3.0** - GitHub Pages部署工具

---

## 📁 项目结构

```
乐素/
├── assets/                    # 静态资源目录
│   ├── images/               # 素材图片（华夏基金、广发基金、易方达基金）
│   ├── logo/                 # 公司Logo（华夏基金.png、广发基金.png、易方达基金.png）
│   └── 产品标签.json         # 素材标签数据（核心数据源）
│
├── src/
│   ├── components/           # React组件目录
│   │   ├── Layout.jsx        # 布局组件（Sidebar + Header + Main）
│   │   ├── Sidebar.jsx       # 侧边栏导航
│   │   ├── Header.jsx        # 顶部导航栏
│   │   │
│   │   ├── IndustryRadar.jsx        # 行业情报雷达（六维趋势看板 + 异动监测）
│   │   ├── NewLaunchZone.jsx        # 新发基金战报专区
│   │   ├── CompetitiveIntelligenceFeed.jsx  # 全网竞品情报流（主列表页）
│   │   │
│   │   ├── AIMaterialSearch.jsx     # AI素材检索（NLP搜索）
│   │   ├── MaterialSearch.jsx       # 素材搜索（旧版，可能已弃用）
│   │   │
│   │   ├── MaterialDetail.jsx       # 素材详情页（完整分析视图）
│   │   ├── MaterialModal.jsx        # 素材模态框（快速预览）
│   │   ├── DeconstructedCard.jsx    # 解构卡片（列表项展示）
│   │   ├── MaterialCard.jsx         # 素材卡片（通用卡片组件）
│   │   │
│   │   ├── Pagination.jsx           # 分页组件
│   │   ├── AlertPanel.jsx           # 警报面板
│   │   ├── MetricCard.jsx           # 指标卡片
│   │   ├── RichMetricCard.jsx       # 富文本指标卡片
│   │   ├── TrendChart.jsx           # 趋势图表
│   │   ├── BattleCard.jsx            # 战报卡片
│   │   ├── HorizontalScroll.jsx    # 横向滚动组件
│   │   ├── MaterialSection.jsx      # 素材区块
│   │   ├── LatestMaterials.jsx     # 最新素材
│   │   ├── OverviewSection.jsx      # 概览区块
│   │   ├── AssetCardSkeleton.jsx    # 骨架屏加载组件
│   │   └── NewLaunchZone.jsx        # 新发基金专区
│   │
│   ├── data/                 # 数据层
│   │   ├── labeledMaterialsData.js  # 标签数据加载和转换（核心数据模块）
│   │   ├── materialsData.js         # 旧版素材数据（可能已弃用）
│   │   └── 产品标签.json            # JSON数据源（与assets中的相同）
│   │
│   ├── utils/                # 工具函数
│   │   ├── companyLogo.js           # 公司Logo路径管理
│   │   ├── exposureMetrics.js       # 曝光指标生成（阅读量、转发量、点赞数等）
│   │   ├── industryRadarData.js    # 行业雷达数据生成（六维趋势、异动监测）
│   │   └── nlpQuery.js              # NLP查询处理（关键词提取、素材搜索）
│   │
│   ├── App.jsx               # 根组件（路由和页面切换）
│   ├── main.jsx              # 应用入口文件
│   └── index.css             # 全局样式
│
├── index.html                # HTML入口文件
├── vite.config.js            # Vite配置文件
├── tailwind.config.js        # Tailwind CSS配置
├── postcss.config.js         # PostCSS配置
├── package.json              # 项目依赖和脚本
└── copy-assets.cjs           # 构建后资源复制脚本
```

---

## 🏗️ 架构设计

### 1. 应用架构模式

**单页应用 (SPA)**
- 使用React状态管理页面路由（`currentPage`）
- 无传统路由库（React Router），使用组件级状态切换
- 两个主要页面：
  - `monitoring` - 全网监控页面
  - `material` - 素材检索页面

### 2. 组件架构层次

#### **布局层 (Layout Layer)**
```
Layout
├── Sidebar (固定左侧导航)
├── Header (固定顶部导航)
└── Main Content (动态内容区域)
```

#### **页面层 (Page Layer)**
- `IndustryRadar` - 行业情报雷达
- `NewLaunchZone` - 新发基金战报专区
- `CompetitiveIntelligenceFeed` - 全网竞品情报流
- `AIMaterialSearch` - AI素材检索

#### **功能组件层 (Feature Component Layer)**
- `MaterialDetail` - 详情页（支持视频、长图、普通图片、文章）
- `DeconstructedCard` - 列表卡片（展示标签、曝光指标、公司Logo）
- `Pagination` - 分页控制
- `MaterialModal` - 快速预览模态框

#### **基础组件层 (Base Component Layer)**
- `MaterialCard` - 通用素材卡片
- `MetricCard` - 指标卡片
- `TrendChart` - 图表组件
- `AlertPanel` - 警报面板

### 3. 数据流架构

```
数据源 (产品标签.json)
    ↓
labeledMaterialsData.js (数据加载和转换)
    ↓
getLabeledMaterials() (统一数据接口)
    ↓
组件层 (使用数据)
    ├── CompetitiveIntelligenceFeed (列表展示)
    ├── AIMaterialSearch (搜索和过滤)
    ├── IndustryRadar (数据聚合和可视化)
    └── MaterialDetail (详情展示)
```

**数据转换流程**:
1. `loadLabeledData()` - 异步加载JSON文件（支持多路径fallback）
2. `transformLabeledData()` - 转换原始数据为标准格式
3. `generateExposureMetrics()` - 生成曝光指标（基于素材丰富度）
4. 返回标准化的素材对象数组

### 4. 状态管理

**本地状态管理 (Local State)**
- 使用React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`)
- 无全局状态管理库（Redux/Zustand）
- 组件间通信通过props传递

**主要状态**:
- `currentPage` - 当前页面（App.jsx）
- `activeTab` - 当前筛选Tab（CompetitiveIntelligenceFeed）
- `selectedMaterial` - 选中的素材（详情页）
- `labeledMaterials` - 素材数据列表
- `loading` - 加载状态

### 5. 样式架构

**Tailwind CSS 实用优先**
- 无全局CSS类定义（除index.css基础样式）
- 组件内联样式类
- 响应式设计（sm, md, lg, xl断点）
- 自定义滚动条样式（custom-scrollbar）

**设计系统**:
- 主色调：蓝色系（blue-500, blue-600）
- 辅助色：绿色（成功）、红色（警告）、橙色（提示）
- 间距系统：Tailwind默认间距（4px基准）
- 圆角：rounded-lg, rounded-xl, rounded-full

---

## 🔧 核心功能模块

### 1. 数据加载模块 (`labeledMaterialsData.js`)

**功能**:
- 异步加载`产品标签.json`
- 多路径fallback机制（开发/生产环境适配）
- 数据转换和标准化
- 集成曝光指标生成

**关键函数**:
- `loadLabeledData()` - 加载JSON数据
- `transformLabeledData()` - 数据转换
- `getLabeledMaterials()` - 统一数据接口

### 2. NLP搜索模块 (`nlpQuery.js`)

**功能**:
- 自然语言查询解析
- 关键词提取和映射
- 多维度字段匹配（视觉风格、物料定位、推送时机等）
- 全文搜索

**关键词映射表**:
- `visualStyleMap` - 视觉风格映射
- `materialPositioningMap` - 物料定位映射
- `pushTimingMap` - 推送时机映射
- `sellingPointMap` - 核心卖点映射
- `materialTypeMap` - 物料类型映射
- `industryThemeMap` - 行业主题映射

**搜索策略**:
1. 优先匹配字段特定关键词（如"科技风" → 视觉风格）
2. 提取通用关键词进行全文搜索
3. 字段筛选结果优先于通用关键词结果

### 3. 曝光指标模块 (`exposureMetrics.js`)

**功能**:
- 基于素材丰富度计算曝光指标
- 模拟真实的阅读、转发、点赞、收藏数据
- 使用对数分布模拟真实场景（少数爆款，多数普通）

**指标计算**:
- `calculateRichnessScore()` - 计算素材丰富度分数（0-100）
- `generateExposureMetrics()` - 生成曝光指标对象

**丰富度因子**:
- 物料类型权重
- 标签数量
- 创新点
- 视觉风格
- 物料定位

### 4. 行业雷达数据模块 (`industryRadarData.js`)

**功能**:
- 从素材数据聚合行业趋势
- 生成六维趋势数据（机构排名、渠道分布、物料类型分布等）
- 生成异动监测事件

**数据聚合**:
- `generateIndustryRadarData()` - 生成雷达数据
- `generateAnomalies()` - 生成异动事件

### 5. 公司Logo管理 (`companyLogo.js`)

**功能**:
- 统一管理公司Logo路径
- 支持多环境路径（开发/生产）
- Logo存在性检查

**支持的公司**:
- 华夏基金
- 广发基金
- 易方达基金

---

## 🎨 组件使用模式

### 1. 列表展示模式

**CompetitiveIntelligenceFeed** (主列表页)
```jsx
- 使用 DeconstructedCard 展示每个素材
- 支持多维度筛选（物料定位、推送时机、视觉风格等）
- 自定义排序（长图优先 + 公司多样性）
- 分页展示（每页12个）
```

### 2. 详情展示模式

**MaterialDetail** (详情页)
```jsx
- 根据物料类型渲染不同视图：
  - 视频 → 视频播放器 + AI脚本提取
  - 长图 → 全屏滚动阅读模式
  - 普通图片 → 标准图片查看器 + OCR文本
  - 文章 → 文章阅读器
- 右侧信息面板：传播数据、基础信息、策略定位、视觉分析、核心卖点、风险监控
```

### 3. 搜索模式

**AIMaterialSearch** (AI搜索)
```jsx
- NLP查询输入
- 关键词提取和映射
- 搜索结果使用 DeconstructedCard 展示
- 搜索历史下拉提示（点击输入框时显示）
```

### 4. 数据可视化模式

**IndustryRadar** (行业雷达)
```jsx
- 使用 Recharts 组件：
  - AreaChart - 趋势曲线
  - LineChart - 折线图
  - BarChart - 柱状图
  - PieChart - 饼图
- 六维趋势看板（机构、渠道、物料类型、行业主题、推送时机、时间趋势）
- 异动监测中心（事件列表）
```

---

## 📊 数据模型

### 素材对象结构 (Material Object)

```javascript
{
  // 基础信息
  id: number,                    // 唯一ID
  title: string,                 // 标题
  source: string,                // 发布机构（华夏基金、广发基金、易方达基金）
  channel: string,               // 发布渠道（公众号、蚂蚁财富号、小红书）
  type: string,                  // 物料类型（海报、长图、截屏、封面图）
  relatedProduct: string,        // 关联产品
  industryTheme: string,         // 行业主题
  
  // 策略定位
  物料定位: string,              // 产品宣传、投资者教育、活动营销等
  推送时机: string,              // 日常推送、行业估值低位等
  用户人群: string,              // 普通投资者、高净值客群
  
  // 视觉分析
  视觉风格: string,              // 科技风、喜庆国风等
  视觉主体: string,              // 卡通IP、人物等
  创新点: string,                // 数据可视化、AI生成视觉等
  
  // 核心卖点
  产品核心卖点: string,          // 巨额涨幅、历史新高等
  
  // 图片路径
  imagePath: string,             // 图片URL路径
  path: string,                  // 兼容字段
  
  // 曝光指标（由 exposureMetrics.js 生成）
  views: number,                 // 阅读量
  forwards: number,              // 转发量
  likes: number,                 // 点赞数
  collects: number,              // 收藏数
  comments: number,              // 评论数
  
  // 兼容字段
  heat: number,                  // 热度（兼容views）
  interaction: number,           // 互动数（兼容likes）
  reuseCount: number,            // 复用次数
  
  // 决策场景（用于Tab过滤）
  decisionScenario: string,      // 持营动作、高热爆款
  
  // 合规风险
  complianceRisks: string[],     // 合规风险列表
}
```

---

## 🚀 构建和部署

### 开发环境
```bash
npm run dev        # 启动开发服务器（Vite，端口5173）
```

### 生产构建
```bash
npm run build      # 构建生产版本 + 复制assets资源
npm run preview    # 预览生产构建
```

### 部署
```bash
npm run deploy     # 构建并部署到GitHub Pages
```

**部署配置**:
- Base路径: `/lesu/`
- 静态资源目录: `assets/`
- GitHub Pages URL: `https://charming1121.github.io/lesu/`

---

## 🔍 关键技术特性

### 1. 响应式设计
- Tailwind CSS响应式类（sm, md, lg, xl）
- 移动端适配（viewport meta标签）
- 弹性布局（Flexbox, Grid）

### 2. 性能优化
- React.memo（组件记忆化，如需要）
- useMemo（计算属性缓存）
- 图片懒加载（onError处理）
- 分页加载（减少DOM节点）

### 3. 错误处理
- 图片加载失败fallback
- Logo加载失败fallback
- JSON数据加载失败处理
- 多路径fallback机制

### 4. 用户体验
- 加载状态显示（skeleton screens）
- 平滑过渡动画（transition）
- 悬停效果（hover states）
- 模态框和详情页切换

### 5. 数据驱动
- 动态筛选选项（从数据中提取）
- 实时数据聚合（行业雷达）
- 模拟数据生成（曝光指标、异动事件）

---

## 📝 总结

这是一个**现代化的React单页应用**，采用：

✅ **技术栈**: React + Vite + Tailwind CSS + Recharts  
✅ **架构模式**: 组件化、模块化、数据驱动  
✅ **设计理念**: 实用优先、响应式、用户友好  
✅ **核心功能**: 素材监控、检索、分析、可视化  
✅ **数据源**: JSON文件（产品标签.json）  
✅ **部署方式**: GitHub Pages静态部署  

项目结构清晰，组件职责明确，数据流简单直接，适合快速迭代和维护。
