import React from 'react';
import RichMetricCard from './RichMetricCard';
import AlertPanel from './AlertPanel';
import TrendChart from './TrendChart';

const OverviewSection = () => {
  // 图标组件
  const BuildingIcon = () => (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const DocumentIcon = () => (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const ChartIcon = () => (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  // 今日新增素材的折线图数据
  const newMaterialSparkline = [
    { value: 800 },
    { value: 950 },
    { value: 1100 },
    { value: 1050 },
    { value: 1200 },
    { value: 1150 },
    { value: 1204 },
  ];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">核心情报概览</h1>
        <p className="text-sm text-gray-500 mt-1">实时监控基金营销动态</p>
      </div>

      {/* 指标卡片组 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 监控机构数 */}
        <RichMetricCard
          title="监控机构数"
          value="92家"
          icon={<BuildingIcon />}
          subtitle="今日活跃：68家"
        />

        {/* 今日新增素材 */}
        <RichMetricCard
          title="今日新增素材"
          value="1,204条"
          icon={<DocumentIcon />}
          trend={
            <span>
              较昨日 <span className="text-green-500">↑ 12%</span>
            </span>
          }
          sparklineData={newMaterialSparkline}
        />

        {/* 活跃 ETF 主题 */}
        <RichMetricCard
          title="活跃 ETF 主题"
          value="红利低波"
          icon={<ChartIcon />}
          tags={['高股息', '防御', '中证A50']}
        />

        {/* 异动情报面板 */}
        <AlertPanel />
      </div>

      {/* 趋势图表区 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-1 h-4 bg-blue-500 rounded-full mr-3"></div>
          <h2 className="text-lg font-semibold text-gray-900">
            全网 ETF 营销内容趋势
          </h2>
        </div>
        <TrendChart />
      </div>
    </div>
  );
};

export default OverviewSection;
