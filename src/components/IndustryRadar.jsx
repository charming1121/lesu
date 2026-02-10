import React, { useState, useEffect } from 'react';
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
import { X } from 'lucide-react';
import { generateIndustryRadarData, generateAnomalies } from '../utils/industryRadarData';

/**
 * 行业情报雷达 (Industry Radar)
 * 对应大纲中的"内容发布趋势"和"异动曲线"
 * 展示趋势对比和异常信号
 */
const IndustryRadar = () => {
  // 机构卡片翻转状态
  const [institutionFlipped, setInstitutionFlipped] = useState(false);
  const [sixDimTrends, setSixDimTrends] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  // 弹窗状态
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // 加载真实数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { sixDimTrends: trends, materials } = await generateIndustryRadarData();
        setSixDimTrends(trends);
        const anomalyData = generateAnomalies(materials);
        setAnomalies(anomalyData);
      } catch (error) {
        console.error('Failed to load industry radar data:', error);
        // 使用默认数据
        setSixDimTrends([]);
        setAnomalies([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 默认六维趋势数据（如果真实数据未加载）
  const defaultSixDimTrends = [
    {
      id: 'effectiveness',
      label: '传播效果',
      hotword: '机构传播效果排名',
      value: 'Top 3 占比 45%',
      trend: 'up',
      top3Ranking: [
        { name: '易方达基金', count: 4200, rank: 1, change: 'stable' },
        { name: '华夏基金', count: 3800, rank: 2, change: 'up' },
        { name: '广发基金', count: 3200, rank: 3, change: 'down' },
      ],
      top5Ranking: [
        { name: '易方达基金', count: 4200, rank: 1, change: 'stable', note: '传播效果最佳' },
        { name: '华夏基金', count: 3800, rank: 2, change: 'up', changeValue: 1, note: '传播效果提升' },
        { name: '广发基金', count: 3200, rank: 3, change: 'down', changeValue: 1 },
        { name: '南方基金', count: 2800, rank: 4, change: 'stable' },
        { name: '富国基金', count: 2500, rank: 5, change: 'up', changeValue: 2, note: '潜力机构' },
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
      id: 'hotspot',
      label: '近期热点',
      hotword: '申万一级行业',
      value: '电力设备·政策催化',
      trend: 'up',
      trackRanking: [
        { name: '电力设备·政策催化', value: 28 },
        { name: '电子·行业利好', value: 22 },
        { name: '有色金属·周期拐点', value: 18 },
        { name: '医药生物·行业利好', value: 16 },
        { name: '计算机·巨额涨幅', value: 16 },
      ],
      // 总和为100%
      total: 100,
    },
    {
      id: 'material',
      label: '物料',
      hotword: '视频/图文占比',
      value: '图文 75%',
      trend: 'up',
      materialData: [
        { name: '视频', value: 25, color: '#6366F1' },
        { name: '图文', value: 75, color: '#9CA3AF' },
      ],
      // 总和为100%
      total: 100,
    },
  ];

  // 默认异动信号数据（如果真实数据未加载）
  const defaultAnomalies = [
    {
      id: 1,
      type: '集体抱团',
      category: '机构维度',
      level: 'high',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '14:23',
      content: '监测到 **易方达、广发、华夏** 等5家头部机构今日同时发布**"电力设备·政策催化"**相关内容，市场营销共识已形成，建议跟进。',
      icon: '🔴',
      suggestion: '复用库内[电力设备]素材，跟进热点。',
    },
    {
      id: 2,
      type: '重注推流',
      category: '机构维度',
      level: 'high',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '13:45',
      content: '监测到 **华夏基金** 近3日发布内容中，"**中证A500**" 相关素材占比高达 60%，判定为近期核心主推产品（Flagship Push）。',
      icon: '🔴',
      suggestion: '关注华夏基金的中证A500营销策略。',
    },
    {
      id: 3,
      type: '渠道策略',
      category: '平台维度',
      level: 'medium',
      typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      time: '12:30',
      content: '监测到 **广发基金** 在 **蚂蚁财富** 平台集中投放"**医药生物**"相关内容（占比80%），存在明显的渠道客群分层策略。',
      icon: '🔵',
      suggestion: '分析蚂蚁财富平台的医药生物内容策略。',
    },
    {
      id: 4,
      type: '细分爆发',
      category: '产品维度',
      level: 'high',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '11:15',
      content: '**"电子"** 细分标签的提及率今日暴增150%，远超"有色金属"，成为今日最热子赛道。',
      icon: '🚀',
      suggestion: '关注电子赛道机会。',
    },
    {
      id: 5,
      type: '新品扎堆',
      category: '产品维度',
      level: 'high',
      typeColor: 'bg-green-100 text-green-700 border-green-200',
      time: '10:00',
      content: '监测到今日有 8条 关于 **"中证A500 ETF"** 的新发募集预热内容，5家机构启动预热投放，新品发行竞争进入白热化阶段。',
      icon: '🆕',
      suggestion: '关注中证A500 ETF新品竞争态势。',
    },
  ];

  // 使用真实数据或默认数据
  const displayTrends = sixDimTrends.length > 0 ? sixDimTrends : defaultSixDimTrends;
  const displayAnomalies = anomalies.length > 0 ? anomalies : defaultAnomalies;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

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
            {displayTrends.map((dim) => (
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
                <div className="mb-3">
                  {dim.id === 'effectiveness' || dim.id === 'institution' ? (
                    // 传播效果和机构：Top 3 大字体，占比小字体
                    <div className="mb-0.5">
                      {dim.value.includes('占比') ? (
                        <>
                          <span className="text-lg font-bold text-gray-800">{dim.value.split('占比')[0]}</span>
                          <span className="text-xs font-normal text-gray-600 ml-1">占比{dim.value.split('占比')[1]}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">{dim.value}</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-gray-800 mb-0.5">
                      {dim.value}
                    </div>
                  )}
                  {dim.valueDesc && (
                    <div className="text-xs text-gray-500">{dim.valueDesc}</div>
                  )}
                </div>

                {/* Bottom: 可视化区域 - 固定高度 h-16 */}
                <div className="h-16 overflow-hidden">
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
                    // 物料：显示所有类型占比（类似渠道的显示方式）
                    <div className="space-y-2">
                      {/* 堆叠进度条 */}
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                        {dim.materialData.map((item, idx) => (
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
                      <div className="flex items-center gap-3 text-[10px] flex-wrap">
                        {dim.materialData.map((item, idx) => (
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
                  ) : dim.id === 'institution' || dim.id === 'effectiveness' ? (
                    // 机构：头部竞争格局（支持滚动和弹窗）
                    <div className="relative h-full">
                      {!institutionFlipped ? (
                        // 正面：Top 3 竞争格局 - 紧凑列表模式
                        <div className="space-y-1.5 max-h-16 overflow-y-auto custom-scrollbar">
                          {dim.top3Ranking && dim.top3Ranking.slice(0, 3).map((item, idx) => {
                            const maxCount = Math.max(...dim.top3Ranking.slice(0, 3).map((d) => d.count));
                            const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
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
                                <span className="w-16 text-right font-bold text-gray-900 text-xs">{item.count >= 1000 ? (item.count / 1000).toFixed(1) + 'k' : item.count} 阅读</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // 背面：完整榜单（带滚动）
                        <div className="space-y-1.5 max-h-16 overflow-y-auto custom-scrollbar">
                          {dim.top5Ranking && dim.top5Ranking.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="font-medium text-gray-700 w-16 truncate">{item.name}</span>
                                <span className="text-gray-500">{item.count >= 1000 ? (item.count / 1000).toFixed(1) + 'k' : item.count} 阅读</span>
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
                        </div>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInstitutionFlipped(!institutionFlipped);
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-800 underline"
                        >
                          {institutionFlipped ? '← 返回' : '查看完整榜单 →'}
                        </button>
                        {dim.top5Ranking && dim.top5Ranking.length > 3 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInstitutionModal(true);
                            }}
                            className="text-[10px] text-blue-600 hover:text-blue-800 underline"
                          >
                            展开详情
                          </button>
                        )}
                      </div>
                    </div>
                  ) : dim.id === 'track' || dim.id === 'hotspot' ? (
                    // 近期热点：Top 5 榜单（支持滚动和弹窗）
                    <div className="space-y-1.5 max-h-16 overflow-y-auto custom-scrollbar">
                      {dim.trackRanking && dim.trackRanking.slice(0, dim.id === 'hotspot' ? 5 : 3).map((item, idx) => (
                        <div key={idx} className="mb-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-gray-700 font-medium truncate flex-1 leading-tight">{item.name}</span>
                            <span className="text-[10px] font-bold text-gray-900 ml-1 flex-shrink-0">{item.value}%</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-blue-400' : 'bg-blue-300'
                              }`}
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      {dim.trackRanking && dim.trackRanking.length > (dim.id === 'hotspot' ? 5 : 3) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTrackModal(true);
                          }}
                          className="mt-1 text-[10px] text-blue-600 hover:text-blue-800 underline w-full text-left"
                        >
                          查看全部热点 ({dim.trackRanking.length}个) →
                        </button>
                      )}
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
            {displayAnomalies.map((anomaly) => {
              // 根据等级确定边框颜色
              const levelBorderColor = 
                anomaly.level === 'high' ? 'border-red-300' :
                anomaly.level === 'medium' ? 'border-yellow-300' :
                'border-blue-300';
              
              // 根据等级确定左侧指示条颜色
              const levelBarColor =
                anomaly.level === 'high' ? 'bg-red-500' :
                anomaly.level === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500';
              
              return (
                <div
                  key={anomaly.id}
                  className={`bg-white rounded-lg p-3 border-l-4 ${levelBorderColor} border-r border-t border-b border-gray-100 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start gap-3">
                    {/* 左侧等级指示条 */}
                    <div className={`w-1 h-full ${levelBarColor} rounded-full flex-shrink-0`}></div>
                    
                    {/* 内容区域 */}
                    <div className="flex-1 min-w-0">
                      {/* 头部：图标 + 类型标签 + 类别 + 时间 */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-base flex-shrink-0">{anomaly.icon}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${anomaly.typeColor}`}
                        >
                          {anomaly.type}
                        </span>
                        {anomaly.category && (
                          <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-50 rounded">
                            {anomaly.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-mono ml-auto">{anomaly.time}</span>
                      </div>
                      
                      {/* 消息内容 */}
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {anomaly.content.split('**').map((part, idx) => 
                          idx % 2 === 1 ? (
                            <strong key={idx} className="font-semibold text-gray-900">{part}</strong>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        )}
                      </p>
                      
                      {/* 建议（如果有） */}
                      {anomaly.suggestion && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-start gap-1.5">
                            <span className="text-xs text-blue-600 font-medium flex-shrink-0">建议：</span>
                            <span className="text-xs text-gray-600">{anomaly.suggestion}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 机构详情弹窗 */}
      {showInstitutionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInstitutionModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">机构传播效果排名详情</h3>
              <button
                onClick={() => setShowInstitutionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {(displayTrends.find(d => d.id === 'effectiveness') || displayTrends.find(d => d.id === 'institution'))?.top5Ranking ? (
                <div className="space-y-3">
                  {(displayTrends.find(d => d.id === 'effectiveness') || displayTrends.find(d => d.id === 'institution')).top5Ranking.map((item, idx) => {
                    const currentDim = displayTrends.find(d => d.id === 'effectiveness') || displayTrends.find(d => d.id === 'institution');
                    const maxCount = Math.max(...currentDim.top5Ranking.map((d) => d.count));
                    const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300', 'bg-blue-200'];
                    return (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${colors[idx] || 'bg-gray-400'}`}>
                              {item.rank}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${
                                item.change === 'up'
                                  ? 'bg-red-100 text-red-700'
                                  : item.change === 'down'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.change === 'up' && <span>↑{item.changeValue || ''}</span>}
                              {item.change === 'down' && <span>↓{item.changeValue || ''}</span>}
                              {item.change === 'stable' && <span>稳定</span>}
                            </span>
                            {item.note && (
                              <span className="text-xs text-gray-500 italic">({item.note})</span>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">{item.count >= 1000 ? (item.count / 1000).toFixed(1) + 'k' : item.count} 阅读</span>
                            {item.avgForwards !== undefined && (
                              <span className="text-xs text-gray-500">转发 {item.avgForwards >= 1000 ? (item.avgForwards / 1000).toFixed(1) + 'k' : item.avgForwards}</span>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[idx] || 'bg-gray-400'} rounded-full transition-all duration-300`}
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">暂无数据</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 赛道详情弹窗 */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTrackModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">近期热点分布详情</h3>
              <button
                onClick={() => setShowTrackModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {displayTrends.find(d => d.id === 'hotspot' || d.id === 'track')?.trackRanking ? (
                <div className="space-y-3">
                  {(displayTrends.find(d => d.id === 'hotspot') || displayTrends.find(d => d.id === 'track')).trackRanking.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                            idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-blue-400' : 'bg-blue-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 flex-shrink-0 ml-2">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-blue-400' : 'bg-blue-300'
                          } rounded-full transition-all duration-300`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">暂无数据</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryRadar;
