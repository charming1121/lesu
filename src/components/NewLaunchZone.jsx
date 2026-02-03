import React from 'react';
import BattleCard from './BattleCard';

/**
 * 新发基金战报专区 (New Launch Zone)
 * 对应大纲中的"新发基金专区"
 * 展示正在发行期、募集期的 ETF 核心物料
 * 高优先级横向区域
 */
const NewLaunchZone = () => {
  // 新发基金数据（按产品聚合）
  const newLaunchProducts = [
    {
      id: 1,
      name: '易方达中证A500',
      company: '易方达基金',
      stage: '募集冲刺',
      competitorCount: 42,
      sellingPoints: ['核心资产', '龙头', '宽基指数', '长期配置'],
      styleTags: ['#科技蓝', '#赛博朋克风', '#数据可视化'],
      previewMaterials: [
        {
          id: 1,
          title: '中证A500核心资产',
          imagePath: 'assets/etf_new/1.jpg',
        },
        {
          id: 2,
          title: '龙头企业配置',
          imagePath: 'assets/etf_new/2.jpg',
        },
        {
          id: 3,
          title: '宽基指数优势',
          imagePath: 'assets/etf_new/3.jpg',
        },
      ],
    },
    {
      id: 2,
      name: '华夏科创50增强',
      company: '华夏基金',
      stage: '上市首日',
      competitorCount: 38,
      sellingPoints: ['科技创新', '成长性', '增强策略', '科技赛道'],
      styleTags: ['#渐变紫', '#未来感', '#3D渲染'],
      previewMaterials: [
        {
          id: 1,
          title: '科技创新投资',
          imagePath: 'assets/etf_new/2.jpg',
        },
        {
          id: 2,
          title: '成长性资产',
          imagePath: 'assets/etf_new/3.jpg',
        },
        {
          id: 3,
          title: '增强策略优势',
          imagePath: 'assets/etf_new/4.jpg',
        },
      ],
    },
    {
      id: 3,
      name: '南方红利低波ETF',
      company: '南方基金',
      stage: '预热期',
      competitorCount: 35,
      sellingPoints: ['高股息', '低波动', '防御性', '稳健收益'],
      styleTags: ['#暖色调', '#手绘插画', '#温馨风格'],
      previewMaterials: [
        {
          id: 1,
          title: '高股息策略',
          imagePath: 'assets/dividend_low_vol/1.jpg',
        },
        {
          id: 2,
          title: '低波动配置',
          imagePath: 'assets/dividend_low_vol/2.jpg',
        },
        {
          id: 3,
          title: '防御性资产',
          imagePath: 'assets/dividend_low_vol/3.jpg',
        },
      ],
    },
    {
      id: 4,
      name: '广发医药创新ETF',
      company: '广发基金',
      stage: '募集冲刺',
      competitorCount: 28,
      sellingPoints: ['创新药', '医疗器械', '医药赛道', '长期价值'],
      styleTags: ['#医疗蓝', '#简约风', '#图标化'],
      previewMaterials: [
        {
          id: 1,
          title: '创新药投资',
          imagePath: 'assets/sector_industry/1.jpg',
        },
        {
          id: 2,
          title: '医疗器械',
          imagePath: 'assets/sector_industry/2.jpg',
        },
        {
          id: 3,
          title: '医药赛道',
          imagePath: 'assets/sector_industry/3.jpg',
        },
      ],
    },
  ];

  return (
    <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
      {/* 标题区域 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">新发基金战报专区</h2>
          <p className="text-sm text-gray-500 mt-0.5">正在发行期 · 募集期 ETF 核心物料</p>
        </div>
      </div>

      {/* 内容区域 - 横向滚动战役卡片 */}
      <div className="bg-white rounded-lg p-4 relative">
        <div className="flex items-start gap-4 overflow-x-auto scrollbar-hide pb-2">
          {newLaunchProducts.map((product) => (
            <BattleCard key={product.id} product={product} />
          ))}
        </div>
        {/* 右侧淡出遮罩 */}
        <div className="absolute right-4 top-4 bottom-6 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NewLaunchZone;
