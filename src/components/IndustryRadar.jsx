import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';

/**
 * 行业情报雷达 (Industry Radar)
 * 对应大纲中的"内容发布趋势"和"异动曲线"
 * 展示趋势对比和异常信号
 */
const IndustryRadar = () => {
  // 机构卡片翻转状态
  const [institutionFlipped, setInstitutionFlipped] = useState(false);

  // 六维趋势数据
  const sixDimTrends = [
    {
      id: 'time',
      label: '时间',
      hotword: '发布高峰时段',
      value: '14:00-16:00',
      trend: 'up',
      sparklineData: [
        { time: '08:00', value: 45 },
        { time: '10:00', value: 82, peak: true },
        { time: '12:00', value: 48 },
        { time: '14:00', value: 61 },
        { time: '14:30', value: 95, peak: true },
        { time: '16:00', value: 75 },
        { time: '18:00', value: 52 },
      ],
    },
    {
      id: 'institution',
      label: '机构',
      hotword: '活跃度排名',
      value: 'Top 3 占比 45%',
      trend: 'up',
      // Top 3 竞争格局
      top3Ranking: [
        { name: '易方达基金', count: 124, rank: 1, change: 'stable' },
        { name: '华夏基金', count: 108, rank: 2, change: 'up' },
        { name: '南方基金', count: 92, rank: 3, change: 'down' },
      ],
      // Top 5 完整榜单（背面）
      top5Ranking: [
        { name: '易方达基金', count: 124, rank: 1, change: 'stable', note: '稳居第一' },
        { name: '华夏基金', count: 108, rank: 2, change: 'up', changeValue: 1, note: '排名上升，追得紧' },
        { name: '南方基金', count: 92, rank: 3, change: 'down', changeValue: 1 },
        { name: '广发基金', count: 85, rank: 4, change: 'stable' },
        { name: '富国基金', count: 70, rank: 5, change: 'up', changeValue: 2, note: '今日黑马' },
      ],
      cr3: 45, // Top 3 集中度
    },
    {
      id: 'channel',
      label: '渠道',
      hotword: '微信/蚂蚁/小红书占比',
      value: '小红书 12%',
      trend: 'up',
      channelData: [
        { name: '微信', value: 68, color: '#2563EB' },
        { name: '蚂蚁', value: 20, color: '#60A5FA' },
        { name: '小红书', value: 12, color: '#FB923C' },
      ],
    },
    {
      id: 'product',
      label: '产品',
      hotword: 'ETF/主动/债基',
      value: 'ETF 72%',
      trend: 'up',
      productData: [
        { name: 'ETF', value: 72, isMax: true },
        { name: '主动', value: 18, isMax: false },
        { name: '债基', value: 8, isMax: false },
        { name: '其他', value: 2, isMax: false },
      ],
      // 确保总和为100%
      total: 100,
    },
    {
      id: 'track',
      label: '赛道',
      hotword: '科技/红利/医药',
      value: '红利低波',
      trend: 'up',
      trackRanking: [
        { name: '红利低波', value: 55 },
        { name: '科技成长', value: 30 },
        { name: '创新药', value: 15 },
      ],
      // 总和为100%
      total: 100,
    },
    {
      id: 'material',
      label: '物料',
      hotword: '视频/文章/海报',
      value: '42%',
      valueDesc: '视频物料占比持续增长',
      trend: 'up',
      materialData: [
        { name: '视频', value: 42, color: '#6366F1' },
        { name: '图文', value: 58, color: '#9CA3AF' },
      ],
      // 总和为100%
      total: 100,
    },
  ];

  // 异动信号数据
  const anomalies = [
    {
      id: 1,
      type: '数量暴增',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '14:23',
      content: '监测到 14:00-15:00 时段内容量异常上升 180%，主要集中在新发ETF推广',
      icon: '📈',
    },
    {
      id: 2,
      type: '集体抱团',
      typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      time: '13:45',
      content: '监测到 5 家机构同时加码"红利低波"赛道，相关推文数量激增',
      icon: '🤝',
    },
    {
      id: 3,
      type: '撤回/下架',
      typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      time: '12:30',
      content: '⚠️ 监测到 5 家机构同时下架"微盘股"相关推文，疑似政策避雷信号',
      icon: '⚠️',
    },
    {
      id: 4,
      type: '数量暴增',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '11:15',
      content: '监测到"中证A500"关键词在1小时内提及量暴增 250%',
      icon: '📈',
    },
    {
      id: 5,
      type: '集体抱团',
      typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      time: '10:00',
      content: '监测到 8 家机构同时发布"定投策略"相关内容，形成营销热点',
      icon: '🤝',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* 标题区域 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">行业情报雷达</h2>
          <p className="text-sm text-gray-500 mt-0.5">内容发布趋势 · 异动曲线</p>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-[6.5fr_3.5fr] gap-6">
        {/* 左侧：六维趋势看板 */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">六维趋势看板</h3>
          <div className="grid grid-cols-2 gap-4">
            {sixDimTrends.map((dim) => (
              <div
                key={dim.id}
                className="bg-white rounded-lg p-3 border border-gray-100 hover:shadow-sm transition-shadow overflow-hidden"
              >
                {/* Top: 标题 + 趋势箭头 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    {dim.label}
                  </span>
                  <span
                    className={`text-[10px] ${
                      dim.trend === 'up'
                        ? 'text-green-600'
                        : dim.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {dim.trend === 'up' ? '↑' : dim.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>

                {/* Middle: 核心数据 */}
                {dim.id !== 'material' && (
                  <div className="mb-3">
                    <div className="text-lg font-bold text-gray-800 mb-0.5">
                      {dim.value}
                    </div>
                    {dim.valueDesc && (
                      <div className="text-xs text-gray-500">{dim.valueDesc}</div>
                    )}
                  </div>
                )}

                {/* Bottom: 可视化区域 - 固定高度 h-16 */}
                <div className="h-16">
                  {dim.id === 'channel' ? (
                    // 渠道：单行堆叠进度条
                    <div className="space-y-2">
                      {/* 堆叠进度条 */}
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                        {dim.channelData.map((item, idx) => (
                          <div
                            key={idx}
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${item.value}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* 图例 */}
                      <div className="flex items-center gap-3 text-[10px]">
                        {dim.channelData.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-medium text-gray-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : dim.id === 'material' ? (
                    // 物料：左右布局
                    <div className="flex items-center h-full">
                      {/* 左侧：文字信息 (60%) */}
                      <div className="flex-1 pr-2">
                        <div className="text-lg font-bold text-indigo-600 mb-0.5">
                          {dim.value}
                        </div>
                        <div className="text-xs text-gray-500 leading-tight">
                          {dim.valueDesc}
                        </div>
                      </div>
                      {/* 右侧：环形图 (40%) */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={dim.materialData}
                              cx="50%"
                              cy="50%"
                              innerRadius={12}
                              outerRadius={20}
                              dataKey="value"
                              startAngle={90}
                              endAngle={-270}
                            >
                              {dim.materialData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : dim.id === 'product' ? (
                    // 产品：迷你柱状图
                    <div className="h-16 flex items-end justify-between gap-1.5">
                      {dim.productData.map((item, idx) => {
                        const maxValue = Math.max(...dim.productData.map((d) => d.value));
                        const heightPercent = (item.value / maxValue) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                            <div
                              className={`w-full min-h-[4px] rounded-t transition-all duration-300 ${
                                item.isMax ? 'bg-blue-600' : 'bg-blue-100'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                            <div className="text-[8px] text-gray-500 mt-1 whitespace-nowrap">{item.name}</div>
                            <div className="text-[8px] font-medium text-gray-700">{item.value}%</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : dim.id === 'institution' ? (
                    // 机构：头部竞争格局（支持翻转）
                    <div className="relative h-full">
                      {!institutionFlipped ? (
                        // 正面：Top 3 竞争格局 - 紧凑列表模式
                        <div className="space-y-1.5">
                          {dim.top3Ranking.map((item, idx) => {
                            const maxCount = Math.max(...dim.top3Ranking.map((d) => d.count));
                            const width = (item.count / maxCount) * 100;
                            const colors = ['bg-blue-600', 'bg-blue-400', 'bg-blue-300'];
                            return (
                              <div key={idx} className="flex items-center text-xs mb-2">
                                <span className="w-20 truncate text-gray-700 font-medium">{item.name}</span>
                                <div className="flex-1 mx-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${colors[idx]} rounded-full transition-all duration-300`}
                                    style={{ width: `${width}%` }}
                                  ></div>
                                </div>
                                <span className="w-12 text-right font-bold text-gray-900">{item.count}条</span>
                              </div>
                            );
                          })}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInstitutionFlipped(true);
                            }}
                            className="mt-1 text-[10px] text-blue-600 hover:text-blue-800 underline"
                          >
                            查看完整榜单 →
                          </button>
                        </div>
                      ) : (
                        // 背面：Top 5 完整榜单
                        <div className="space-y-1.5">
                          {dim.top5Ranking.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="font-medium text-gray-700 w-16 truncate">{item.name}</span>
                                <span className="text-gray-500">{item.count}条</span>
                                <span
                                  className={`text-[10px] font-medium ${
                                    item.change === 'up'
                                      ? 'text-red-600'
                                      : item.change === 'down'
                                      ? 'text-green-600'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {item.change === 'up' && (
                                    <span>↑{item.changeValue || ''}</span>
                                  )}
                                  {item.change === 'down' && (
                                    <span>↓{item.changeValue || ''}</span>
                                  )}
                                  {item.change === 'stable' && <span>-</span>}
                                </span>
                                {item.note && (
                                  <span className="text-[10px] text-gray-400 italic">({item.note})</span>
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInstitutionFlipped(false);
                            }}
                            className="mt-2 text-[10px] text-blue-600 hover:text-blue-800 underline"
                          >
                            ← 返回竞争格局
                          </button>
                        </div>
                      )}
                    </div>
                  ) : dim.id === 'track' ? (
                    // 赛道：Top 3 榜单
                    <div className="space-y-2">
                      {dim.trackRanking.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                            <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : dim.id === 'time' ? (
                    // 时间：带峰值点的折线图
                    <div className="h-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dim.sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                          <defs>
                            <linearGradient id={`sparkline-${dim.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={1.5}
                            fill={`url(#sparkline-${dim.id})`}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      {/* 峰值点标注 */}
                      {dim.sparklineData
                        .map((d, idx) => {
                          if (d.peak) {
                            const position = ((idx + 0.5) / dim.sparklineData.length) * 100;
                            return (
                              <div
                                key={idx}
                                className="absolute -top-3 text-[8px] text-blue-600 font-medium whitespace-nowrap"
                                style={{
                                  left: `${position}%`,
                                  transform: 'translateX(-50%)',
                                }}
                              >
                                {d.time}
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  ) : dim.sparklineData ? (
                    // 其他维度：普通折线图
                    <div className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dim.sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                          <defs>
                            <linearGradient id={`sparkline-${dim.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={1.5}
                            fill={`url(#sparkline-${dim.id})`}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：异动监测中心 */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">异动监测中心</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="bg-white rounded-lg p-3 border border-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-2">
                  {/* 图标 */}
                  <span className="text-lg flex-shrink-0">{anomaly.icon}</span>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 类型标签和时间 */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded border ${anomaly.typeColor}`}
                      >
                        {anomaly.type}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{anomaly.time}</span>
                    </div>
                    
                    {/* 消息内容 */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {anomaly.content}
                      {anomaly.type === '撤回/下架' && (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: 跳转到失效内容库
                            console.log('查看失效内容库');
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          查看失效内容库 &gt;
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryRadar;
