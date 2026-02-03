# 图片资源列表

本文档列出了"新发基金战报专区"和"全网竞品情报流"使用的所有图片链接，按照展示顺序排列。

## 一、新发基金战报专区 (NewLaunchZone)

**数据来源**: `src/components/NewLaunchZone.jsx` 中的 `newLaunchProducts` 数组

**展示方式**: 横向滚动，每个产品卡片显示3张预览图

### 产品1: 易方达中证A500
- **展示顺序**: 第1个产品卡片
- **图片列表**:
  1. `assets/etf_new/1.jpg` - 中证A500核心资产
  2. `assets/etf_new/2.jpg` - 龙头企业配置
  3. `assets/etf_new/3.jpg` - 宽基指数优势

### 产品2: 华夏科创50增强
- **展示顺序**: 第2个产品卡片
- **图片列表**:
  1. `assets/etf_new/2.jpg` - 科技创新投资
  2. `assets/etf_new/3.jpg` - 成长性资产
  3. `assets/etf_new/4.jpg` - 增强策略优势

### 产品3: 南方红利低波ETF
- **展示顺序**: 第3个产品卡片
- **图片列表**:
  1. `assets/dividend_low_vol/1.jpg` - 高股息策略
  2. `assets/dividend_low_vol/2.jpg` - 低波动配置
  3. `assets/dividend_low_vol/3.jpg` - 防御性资产

### 产品4: 广发医药创新ETF
- **展示顺序**: 第4个产品卡片
- **图片列表**:
  1. `assets/sector_industry/1.jpg` - 创新药投资
  2. `assets/sector_industry/2.jpg` - 医疗器械
  3. `assets/sector_industry/3.jpg` - 医药赛道

**新发基金战报专区总计需要**: 12张图片

---

## 二、全网竞品情报流 (CompetitiveIntelligenceFeed)

**数据来源**: `src/data/materialsData.js` 中的 `allMaterials` 数组

**筛选逻辑**:
- 默认显示: `activeTab === '全部'` → 显示所有素材
- 持营动作: `material.decisionScenario === '持营动作'`
- 合规风险: `material.decisionScenario === '合规风险'`
- 高热爆款: `material.decisionScenario === '高热爆款'`

**图片路径规则**: `{material.path}{material.imageId}.jpg`

### 按展示顺序（默认"全部"Tab）:

#### 1. ETF新发分类 (4个素材)
1. `assets/etf_new/1.jpg` - ID: 1, 易方达基金, 长图
2. `assets/etf_new/2.jpg` - ID: 2, 华夏基金, 推文
3. `assets/etf_new/3.jpg` - ID: 3, 南方基金, 视频
4. `assets/etf_new/4.jpg` - ID: 4, 广发基金, 长图

#### 2. 宽基/指数分类 (2个素材)
5. `assets/broad_index/1.jpg` - ID: 5, 博时基金, 推文
6. `assets/broad_index/2.jpg` - ID: 6, 嘉实基金, 长图

#### 3. 行业/赛道分类 (2个素材)
7. `assets/sector_industry/1.jpg` - ID: 7, 汇添富基金, 视频
8. `assets/sector_industry/2.jpg` - ID: 8, 富国基金, 推文

#### 4. 红利低波分类 (2个素材)
9. `assets/dividend_low_vol/1.jpg` - ID: 9, 中欧基金, 长图
10. `assets/dividend_low_vol/2.jpg` - ID: 10, 景顺长城, 推文

#### 5. 业绩/榜单分类 (4个素材)
11. `assets/rank_list/1.jpg` - ID: 11, 工银瑞信, 视频
12. `assets/rank_list/2.jpg` - ID: 12, 建信基金, 长图
13. `assets/rank_list/3.jpg` - ID: 13, 招商基金, 推文
14. `assets/rank_list/4.jpg` - ID: 14, 鹏华基金, 长图

#### 6. 定投/投教分类 (2个素材)
15. `assets/invest_edu/3.jpg` - ID: 15, 国泰基金, 视频
16. `assets/invest_edu/4.jpg` - ID: 16, 华安基金, 推文

#### 7. 合规风险分类 (1个素材)
17. `assets/invest_edu/1.jpg` - ID: 17, 某基金公司, 推文

**全网竞品情报流总计需要**: 17张图片

---

## 三、文件夹结构汇总

根据以上分析，需要在 `assets/` 目录下创建以下文件夹和图片：

```
assets/
├── etf_new/
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
├── broad_index/
│   ├── 1.jpg
│   └── 2.jpg
├── sector_industry/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
├── dividend_low_vol/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
├── rank_list/
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
└── invest_edu/
    ├── 1.jpg
    ├── 3.jpg
    └── 4.jpg
```

**注意**: `invest_edu/2.jpg` 在代码中未使用，但建议保留以备后续使用。

---

## 四、筛选逻辑详解

### 全网竞品情报流的筛选逻辑

**代码位置**: `src/components/CompetitiveIntelligenceFeed.jsx`

```javascript
// 根据决策场景过滤素材
const filteredMaterials = useMemo(() => {
  if (activeTab === '全部') {
    return allMaterials; // 显示所有17个素材
  }
  return allMaterials.filter((material) => {
    switch (activeTab) {
      case '持营动作':
        return material.decisionScenario === '持营动作';
        // 筛选结果: ID 1, 4, 6, 8, 9, 10, 12, 14, 15, 16 (共10个)
      case '合规风险':
        return material.decisionScenario === '合规风险';
        // 筛选结果: ID 5, 17 (共2个)
      case '高热爆款':
        return material.decisionScenario === '高热爆款';
        // 筛选结果: ID 2, 3, 7, 11, 13 (共5个)
      default:
        return true;
    }
  });
}, [activeTab]);
```

### 各Tab对应的素材ID列表

**持营动作** (10个素材):
- ID: 1, 4, 6, 8, 9, 10, 12, 14, 15, 16
- 图片路径: 
  - `assets/etf_new/1.jpg`, `assets/etf_new/4.jpg`
  - `assets/broad_index/2.jpg`
  - `assets/sector_industry/2.jpg`
  - `assets/dividend_low_vol/1.jpg`, `assets/dividend_low_vol/2.jpg`
  - `assets/rank_list/2.jpg`, `assets/rank_list/4.jpg`
  - `assets/invest_edu/3.jpg`, `assets/invest_edu/4.jpg`

**合规风险** (2个素材):
- ID: 5, 17
- 图片路径:
  - `assets/broad_index/1.jpg`
  - `assets/invest_edu/1.jpg`

**高热爆款** (5个素材):
- ID: 2, 3, 7, 11, 13
- 图片路径:
  - `assets/etf_new/2.jpg`, `assets/etf_new/3.jpg`
  - `assets/sector_industry/1.jpg`
  - `assets/rank_list/1.jpg`, `assets/rank_list/3.jpg`

---

## 五、完整图片列表（按展示顺序）

### 新发基金战报专区 (12张)
1. `assets/etf_new/1.jpg`
2. `assets/etf_new/2.jpg`
3. `assets/etf_new/3.jpg`
4. `assets/etf_new/2.jpg` (重复使用)
5. `assets/etf_new/3.jpg` (重复使用)
6. `assets/etf_new/4.jpg`
7. `assets/dividend_low_vol/1.jpg`
8. `assets/dividend_low_vol/2.jpg`
9. `assets/dividend_low_vol/3.jpg`
10. `assets/sector_industry/1.jpg`
11. `assets/sector_industry/2.jpg`
12. `assets/sector_industry/3.jpg`

### 全网竞品情报流 - 全部Tab (17张)
1. `assets/etf_new/1.jpg` (ID: 1)
2. `assets/etf_new/2.jpg` (ID: 2)
3. `assets/etf_new/3.jpg` (ID: 3)
4. `assets/etf_new/4.jpg` (ID: 4)
5. `assets/broad_index/1.jpg` (ID: 5)
6. `assets/broad_index/2.jpg` (ID: 6)
7. `assets/sector_industry/1.jpg` (ID: 7)
8. `assets/sector_industry/2.jpg` (ID: 8)
9. `assets/dividend_low_vol/1.jpg` (ID: 9)
10. `assets/dividend_low_vol/2.jpg` (ID: 10)
11. `assets/rank_list/1.jpg` (ID: 11)
12. `assets/rank_list/2.jpg` (ID: 12)
13. `assets/rank_list/3.jpg` (ID: 13)
14. `assets/rank_list/4.jpg` (ID: 14)
15. `assets/invest_edu/3.jpg` (ID: 15)
16. `assets/invest_edu/4.jpg` (ID: 16)
17. `assets/invest_edu/1.jpg` (ID: 17)

---

## 六、注意事项

1. **路径格式**: 所有图片路径都是相对于项目根目录的，实际使用时会在 `dist/assets/` 目录下
2. **图片命名**: 严格按照 `{数字}.jpg` 格式命名
3. **图片尺寸**: 建议使用 3:4 或 9:16 的竖版比例（长图模式）
4. **重复使用**: 新发基金战报专区会重复使用部分图片（如 `etf_new/2.jpg` 和 `etf_new/3.jpg`）
5. **筛选影响**: 切换Tab时，显示的图片数量会变化，但图片路径不变
