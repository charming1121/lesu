import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Treemap,
} from 'recharts';
import { X } from 'lucide-react';
import { generateIndustryRadarData, generateAnomalies } from '../utils/industryRadarData';
import { ANOMALY_CARDS } from '../data/anomalyCards';

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
  const [activeSectorId, setActiveSectorId] = useState('ai');
  // 维度一：新发/持营筛选
  const [deployFilter, setDeployFilter] = useState('all'); // 'all' | 'new' | '持营'
  // 维度二：悬浮显示详情（概念 id + 鼠标位置）
  const [hoveredConceptId, setHoveredConceptId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const hoverLeaveRef = useRef(null);
  // 异动监测中心：维度筛选，默认机构战术异动
  const [anomalyDimFilter, setAnomalyDimFilter] = useState('机构战术异动');
  // 市场赛道热力图 → 战略时间轴：左侧选中赛道，默认 AI
  const [activeMarketSector, setActiveMarketSector] = useState('ai');
  // 热力图维度筛选：赛道 / 行业 / 主题 / 指数
  const [heatmapDimension, setHeatmapDimension] = useState('赛道');
  // 素材结构曲线展示模式：百分比 / 绝对值
  const [stackMode, setStackMode] = useState('percent'); // 'percent' | 'absolute'
  // 渠道素材分布：按机构 or 按平台
  const [materialDistMode, setMaterialDistMode] = useState('platform'); // 'platform' | 'institution'
  // 渠道曝光堆叠曲线：百分比 / 绝对值
  const [channelStackMode, setChannelStackMode] = useState('percent'); // 'percent' | 'absolute'

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

      {/* 内容区域：六维看板 + 异动监测中心 分段展示 */}
      <div className="space-y-6">
        {/* 模块一：六维趋势看板（整块） */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">六维趋势看板</h3>
              <p className="text-xs text-gray-500 mt-1">
                从机构战术、赛道供需、渠道流量到创意与情绪，系统拆解当前营销战场。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 模块一+二：赛道热力图 + 素材结构曲线 + 竞品战略时间轴（第二行） */}
            <div className="md:col-span-2 flex flex-col gap-4 bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 overflow-hidden">
              {/* 第一行：左热力图 + 右素材结构百分比堆叠曲线 */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left: 市场赛道热力图（全局筛选） */}
                <div className="w-full md:w-[30%] flex-shrink-0 flex flex-col md:border-r border-slate-100 md:pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] text-gray-500">维度：</span>
                  {['赛道', '行业', '主题', '指数'].map((dim) => (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => setHeatmapDimension(dim)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        heatmapDimension === dim ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {dim}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-gray-500 mb-1">点击块选择 · 面积=体量 色深=热度</div>
                <div className="h-[280px] min-h-[280px]">
                  <ResponsiveContainer width="100%" height={280}>
                    <Treemap
                      isAnimationActive={false}
                      data={(() => {
                        const byDimension = {
                          // 投资方向（截图列表示例）：使用 value 近似对应产品数量
                          赛道: {
                            name: 'sectors',
                            children: [
                              { name: '科技行业', value: 260, growth: 0.45, id: 'ai', category: 'tmt' },
                              { name: '有色金属', value: 79, growth: 0.22, id: 'nonferrous', category: 'manufacturing' },
                              { name: '石油石化', value: 14, growth: 0.08, id: 'petro', category: 'manufacturing' },
                              { name: '稀土永磁', value: 79, growth: 0.38, id: 'rare_earth', category: 'strategy' },
                              { name: '油气', value: 14, growth: 0.12, id: 'oil', category: 'manufacturing' },
                              { name: '黄金', value: 54, growth: 0.25, id: 'gold', category: 'strategy' },
                              { name: '化工', value: 19, growth: 0.18, id: 'chemical', category: 'manufacturing' },
                              { name: '稀有金属', value: 12, growth: 0.20, id: 'rare_metal', category: 'manufacturing' },
                              { name: '纳斯达克', value: 55, growth: 0.30, id: 'nasdaq', category: 'strategy' },
                              { name: '恒生科技', value: 74, growth: 0.35, id: 'hstech', category: 'tmt' },
                            ],
                          },
                          // 行业维度（截图三行业列表）
                          行业: {
                            name: 'industry',
                            children: [
                              { name: '传媒', value: 260, growth: 0.22, id: 'media', category: 'tmt' },
                              { name: '电力设备', value: 310, growth: 0.30, id: 'power', category: 'manufacturing' },
                              { name: '电子', value: 420, growth: 0.38, id: 'electronics', category: 'tmt' },
                              { name: '房地产', value: 180, growth: -0.05, id: 'real_estate', category: 'strategy' },
                              { name: '纺织服饰', value: 120, growth: 0.10, id: 'textile', category: 'manufacturing' },
                              { name: '非银金融', value: 260, growth: 0.18, id: 'nonbank', category: 'strategy' },
                              { name: '公用事业', value: 140, growth: 0.08, id: 'utility', category: 'manufacturing' },
                              { name: '国防军工', value: 200, growth: 0.28, id: 'defense', category: 'manufacturing' },
                              { name: '钢铁', value: 90, growth: 0.12, id: 'steel', category: 'manufacturing' },
                              { name: '环保', value: 110, growth: 0.20, id: 'green', category: 'manufacturing' },
                              { name: '交通运输', value: 150, growth: 0.15, id: 'transport', category: 'strategy' },
                              { name: '基础化工', value: 130, growth: 0.18, id: 'basic_chem', category: 'manufacturing' },
                            ],
                          },
                          // 主题基金（截图二主题列表）
                          主题: {
                            name: 'theme',
                            children: [
                              { name: '融资融券', value: 232, growth: 0.20, id: 'margin', category: 'strategy' },
                              { name: '2025中报预增', value: 175, growth: 0.32, id: 'mid_report', category: 'strategy' },
                              { name: '芯片概念', value: 445, growth: 0.40, id: 'chip', category: 'tmt' },
                              { name: '新能源汽车', value: 339, growth: 0.35, id: 'ev', category: 'manufacturing' },
                              { name: '5G', value: 216, growth: 0.28, id: '5g', category: 'tmt' },
                              { name: '国企改革', value: 362, growth: 0.22, id: 'soe_reform', category: 'strategy' },
                              { name: '数据中心', value: 275, growth: 0.30, id: 'datacenter', category: 'tmt' },
                              { name: '华为概念', value: 283, growth: 0.33, id: 'huawei', category: 'tmt' },
                              { name: '西部大开发', value: 47, growth: 0.18, id: 'west_dev', category: 'strategy' },
                              { name: '机器人概念', value: 270, growth: 0.36, id: 'robot_theme', category: 'tmt' },
                            ],
                          },
                          指数: {
                            name: 'index',
                            children: [
                              { name: '华证龙头红利50指数', value: 180, growth: 0.32, id: 'dividend', category: 'strategy' },
                              { name: '国证龙头家电指数', value: 210, growth: 0.28, id: 'home_appliance', category: 'manufacturing' },
                              { name: '中证高端装备指数', value: 190, growth: 0.30, id: 'high_equip', category: 'manufacturing' },
                              { name: '中证新能源汽车产业指数', value: 220, growth: 0.35, id: 'ev_index', category: 'tmt' },
                              { name: '中证高股息优选指数', value: 200, growth: 0.26, id: 'high_div_index', category: 'strategy' },
                              { name: '中证全指集成电路全收益指数', value: 240, growth: 0.40, id: 'chip_index', category: 'tmt' },
                              { name: '中证长江环保主题指数', value: 160, growth: 0.24, id: 'env_index', category: 'manufacturing' },
                              { name: '中证金融科技主题指数', value: 230, growth: 0.38, id: 'fintech_index', category: 'tmt' },
                              { name: '国证香港金融科技指数', value: 150, growth: 0.22, id: 'hk_fintech', category: 'strategy' },
                              { name: '道琼斯美国精选石油和燃气生产者指数', value: 140, growth: 0.18, id: 'us_oilgas', category: 'manufacturing' },
                            ],
                          },
                        };
                        return [byDimension[heatmapDimension] || byDimension.赛道];
                      })()}
                      dataKey="value"
                      aspectRatio={3 / 4}
                      stroke="none"
                      content={(props) => {
                        const { x, y, width, height, name, value, growth, id, category } = props;
                        if (width < 30 || height < 24) return null;
                        const isLeaf = typeof id === 'string';
                        if (!isLeaf) return null;
                        const cat = category || 'tmt';
                        const palettes = {
                          tmt: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6'],
                          manufacturing: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981'],
                          strategy: ['#ede9fe', '#c4b5fd', '#a78bfa', '#8b5cf6'],
                        };
                        const v = value != null ? Number(value) : 0;
                        const tier = v >= 300 ? 4 : v >= 200 ? 3 : v >= 120 ? 2 : 1;
                        const fill = (palettes[cat] || palettes.tmt)[Math.min(tier - 1, 3)];
                        const pct =
                          typeof growth === 'number'
                            ? `${growth >= 0 ? '+' : ''}${(growth * 100).toFixed(1)}%`
                            : null;
                        const selected = activeMarketSector === id;
                        return (
                          <g style={{ cursor: 'pointer' }} onClick={() => setActiveMarketSector(id)}>
                            <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} fill={fill} stroke={selected ? '#1e40af' : 'transparent'} strokeWidth={selected ? 3 : 0} rx={4} />
                            <text
                              x={x + width / 2}
                              y={y + height / 2 - 4}
                              fill="#0f172a"
                              fontSize={12}
                              fontWeight={600}
                              textAnchor="middle"
                            >
                              {name}
                            </text>
                            <text
                              x={x + width / 2}
                              y={y + height / 2 + 10}
                              fontSize={11}
                              fontWeight={500}
                              textAnchor="middle"
                            >
                              <tspan fill="#334155">{value} 篇</tspan>
                              {pct && (
                                <tspan
                                  fill={growth >= 0 ? '#b91c1c' : '#15803d'}
                                  fontWeight={600}
                                >
                                  {'  '}
                                  {pct}
                                </tspan>
                              )}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </ResponsiveContainer>
                </div>
                </div>

                {/* Right: 素材结构曲线（时间 X 维度，支持百分比/绝对值） */}
                <div className="w-full md:w-[70%] flex-shrink-0 flex flex-col">
                  {(() => {
                    // 使用热力图的静态 value 作为基准数据
                    const baseMap = {
                      赛道: [
                        { name: '科技行业', value: 260 },
                        { name: '有色金属', value: 79 },
                        { name: '石油石化', value: 14 },
                        { name: '稀土永磁', value: 79 },
                        { name: '油气', value: 14 },
                        { name: '黄金', value: 54 },
                        { name: '化工', value: 19 },
                        { name: '稀有金属', value: 12 },
                        { name: '纳斯达克', value: 55 },
                        { name: '恒生科技', value: 74 },
                      ],
                      行业: [
                        { name: '传媒', value: 260 },
                        { name: '电力设备', value: 310 },
                        { name: '电子', value: 420 },
                        { name: '房地产', value: 180 },
                        { name: '纺织服饰', value: 120 },
                        { name: '非银金融', value: 260 },
                        { name: '公用事业', value: 140 },
                        { name: '国防军工', value: 200 },
                        { name: '钢铁', value: 90 },
                        { name: '环保', value: 110 },
                        { name: '交通运输', value: 150 },
                        { name: '基础化工', value: 130 },
                      ],
                      主题: [
                        { name: '融资融券', value: 232 },
                        { name: '2025中报预增', value: 175 },
                        { name: '芯片概念', value: 445 },
                        { name: '新能源汽车', value: 339 },
                        { name: '5G', value: 216 },
                        { name: '国企改革', value: 362 },
                        { name: '数据中心', value: 275 },
                        { name: '华为概念', value: 283 },
                        { name: '西部大开发', value: 47 },
                        { name: '机器人概念', value: 270 },
                      ],
                      指数: [
                        { name: '华证龙头红利50指数', value: 180 },
                        { name: '国证龙头家电指数', value: 210 },
                        { name: '中证高端装备指数', value: 190 },
                        { name: '中证新能源汽车产业指数', value: 220 },
                        { name: '中证高股息优选指数', value: 200 },
                        { name: '中证全指集成电路全收益指数', value: 240 },
                        { name: '中证长江环保主题指数', value: 160 },
                        { name: '中证金融科技主题指数', value: 230 },
                        { name: '国证香港金融科技指数', value: 150 },
                        { name: '道琼斯美国精选石油和燃气生产者指数', value: 140 },
                      ],
                    };
                    const baseChildren = baseMap[heatmapDimension] || baseMap.赛道;
                    const series = baseChildren.map((c) => c.name);
                    const days = ['T-14', 'T-12', 'T-10', 'T-8', 'T-6', 'T-4', 'T-2', 'T-0'];
                    const multipliers = [0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.1, 1.15];
                    const data = days.map((day, idx) => {
                      const m = multipliers[idx] ?? 1;
                      const row = { day };
                      baseChildren.forEach((child) => {
                        row[child.name] = child.value * m;
                      });
                      return row;
                    });
                    const colors = ['#0ea5e9', '#22c55e', '#f97316', '#6366f1', '#ec4899', '#0f766e', '#f59e0b', '#8b5cf6', '#14b8a6', '#9ca3af'];
                    const isPercent = stackMode === 'percent';
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-gray-700">
                            素材结构{isPercent ? '占比' : '绝对值'} · 近15天（{heatmapDimension} 维度）
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
                              <button
                                type="button"
                                onClick={() => setStackMode('percent')}
                                className={`px-2 py-0.5 text-[11px] rounded-full ${
                                  isPercent ? 'bg-slate-800 text-white' : 'text-slate-600'
                                }`}
                              >
                                百分比
                              </button>
                              <button
                                type="button"
                                onClick={() => setStackMode('absolute')}
                                className={`px-2 py-0.5 text-[11px] rounded-full ${
                                  !isPercent ? 'bg-slate-800 text-white' : 'text-slate-600'
                                }`}
                              >
                                绝对值
                              </button>
                            </div>
                            <div className="text-[11px] text-gray-400 hidden sm:block">
                              横轴=时间 · 纵轴={isPercent ? '素材占比（100% 堆叠）' : '素材数量（篇）'}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={data}
                              stackOffset={isPercent ? 'expand' : undefined}
                              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#CBD5F5' }} />
                              {isPercent ? (
                                <YAxis
                                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                                  tick={{ fontSize: 10 }}
                                  tickLine={false}
                                  axisLine={false}
                                />
                              ) : (
                                <YAxis
                                  tickFormatter={(v) => Math.round(v)}
                                  tick={{ fontSize: 10 }}
                                  tickLine={false}
                                  axisLine={false}
                                />
                              )}
                              <Tooltip
                                formatter={(value, name) =>
                                  isPercent
                                    ? [`${Math.round(Number(value) * 100)}%`, String(name)]
                                    : [`${Math.round(Number(value))} 篇`, String(name)]
                                }
                                labelFormatter={(label) => `日期 ${label}`}
                                contentStyle={{ fontSize: 11 }}
                              />
                              {series.map((key, idx) => (
                                <Area
                                  key={key}
                                  type="monotone"
                                  dataKey={key}
                                  stackId="share"
                                  stroke={colors[idx % colors.length]}
                                  fill={colors[idx % colors.length]}
                                  fillOpacity={0.85}
                                />
                              ))}
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-gray-500">
                          {series.map((key, idx) => (
                            <span key={key} className="inline-flex items-center gap-1 mr-1">
                              <span
                                className="w-2.5 h-2.5 rounded-sm"
                                style={{ backgroundColor: colors[idx % colors.length] }}
                              />
                              <span>{key}</span>
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 第二行：竞品战略时间轴（按选中赛道下钻，整行横向铺满） */}
              <div className="flex-1 min-w-0 flex flex-col pt-2 border-t border-slate-100">
                {(() => {
                  // 所有热力图 id 对应的中文展示名（赛道/行业/主题/指数）
                  const sectorNames = {
                    ai: '科技行业', nonferrous: '有色金属', petro: '石油石化', rare_earth: '稀土永磁', oil: '油气', chemical: '化工', gold: '黄金', rare_metal: '稀有金属', nasdaq: '纳斯达克', hstech: '恒生科技',
                    media: '传媒', power: '电力设备', electronics: '电子', real_estate: '房地产', textile: '纺织服饰', nonbank: '非银金融', utility: '公用事业', defense: '国防军工', steel: '钢铁', green: '环保', transport: '交通运输', basic_chem: '基础化工',
                    margin: '融资融券', mid_report: '2025中报预增', chip: '芯片概念', ev: '新能源汽车', '5g': '5G', soe_reform: '国企改革', datacenter: '数据中心', huawei: '华为概念', west_dev: '西部大开发', robot_theme: '机器人概念',
                    dividend: '华证龙头红利50指数', home_appliance: '国证龙头家电指数', high_equip: '中证高端装备指数', ev_index: '中证新能源汽车产业指数', high_div_index: '中证高股息优选指数', chip_index: '中证全指集成电路指数', env_index: '中证长江环保主题指数', fintech_index: '中证金融科技主题指数', hk_fintech: '国证香港金融科技指数', us_oilgas: '道琼斯美国石油燃气指数',
                  };
                  const sectorLabel = sectorNames[activeMarketSector] || activeMarketSector;
                  const tagToStage = (tags) => {
                    if (!tags || !tags.length) return '持盈期';
                    const t = tags.join('').toLowerCase();
                    if (/募集|新发冲刺|爆发/.test(t)) return '爆发期';
                    if (/预热|获批/.test(t)) return '预热期';
                    if (/市场安抚|防御/.test(t)) return '防御期';
                    return '持盈期';
                  };
                  const stageConfig = {
                    预热期: { color: '#3b82f6', label: '预热期' },
                    爆发期: { color: '#ef4444', label: '爆发期' },
                    持盈期: { color: '#10b981', label: '持盈期' },
                    防御期: { color: '#64748b', label: '防御期' },
                  };
                  // 每个赛道/行业/主题/指数 id 对应真实机构与该方向下的基金产品（15天窗口）
                  const timelineBySector = {
                    // === 赛道 ===
                    ai: [
                      { institution: '易方达', product: '易方达中证A500ETF', startDay: 1, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 18 },
                      { institution: '易方达', product: '易方达科技龙头C', startDay: 9, endDay: 14, tags: ['业绩展示'], platforms: ['ant'], materialCount: 9 },
                      { institution: '广发', product: '广发科技先锋', startDay: 3, endDay: 10, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 15 },
                      { institution: '华夏', product: '华夏中证机器人ETF', startDay: 5, endDay: 12, tags: ['获批通告'], platforms: ['ant'], materialCount: 7 },
                      { institution: '南方', product: '南方中证TMT', startDay: 7, endDay: 14, tags: ['持盈'], platforms: ['wechat'], materialCount: 6 },
                      { institution: '富国', product: '富国科技创新', startDay: 2, endDay: 6, tags: ['预热'], platforms: ['ant'], materialCount: 5 },
                      { institution: '嘉实', product: '嘉实智能汽车', startDay: 4, endDay: 9, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '汇添富', product: '汇添富成长先锋', startDay: 0, endDay: 4, tags: ['预热'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '中欧', product: '中欧人工智能', startDay: 6, endDay: 13, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '我司', product: '我司AI混合', startDay: 8, endDay: 14, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                    ],
                    nonferrous: [
                      { institution: '南方', product: '南方中证申万有色金属ETF', startDay: 0, endDay: 7, tags: ['净值曲线'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '华夏', product: '华夏中证细分有色ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '广发', product: '广发有色金属ETF', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '易方达', product: '易方达资源行业', startDay: 3, endDay: 10, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '嘉实', product: '嘉实稀土产业', startDay: 6, endDay: 11, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                      { institution: '富国', product: '富国有色金属', startDay: 8, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '我司', product: '我司有色周期', startDay: 9, endDay: 14, tags: ['业绩展示'], platforms: ['ant'], materialCount: 4 },
                    ],
                    petro: [
                      { institution: '华宝', product: '华宝油气ETF', startDay: 1, endDay: 8, tags: ['净值曲线'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '广发', product: '广发道琼斯石油', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '易方达', product: '易方达原油', startDay: 0, endDay: 5, tags: ['业绩展示'], platforms: ['ant'], materialCount: 4 },
                      { institution: '南方', product: '南方原油', startDay: 6, endDay: 13, tags: ['持盈'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '嘉实', product: '嘉实原油', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                      { institution: '我司', product: '我司油气配置', startDay: 10, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 3 },
                    ],
                    rare_earth: [
                      { institution: '华泰柏瑞', product: '华泰柏瑞稀土ETF', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 14 },
                      { institution: '嘉实', product: '嘉实稀土产业', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '广发', product: '广发稀土永磁', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '南方', product: '南方稀土主题', startDay: 2, endDay: 7, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司稀土精选', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    oil: [
                      { institution: '华宝', product: '华宝油气ETF', startDay: 1, endDay: 9, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 11 },
                      { institution: '广发', product: '广发道琼斯石油', startDay: 4, endDay: 12, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '易方达', product: '易方达原油', startDay: 0, endDay: 5, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                      { institution: '南方', product: '南方原油', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司油气QDII', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    chemical: [
                      { institution: '富国', product: '富国中证化工ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '华宝', product: '华宝化工ETF', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发基础化工', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '易方达', product: '易方达化工行业', startDay: 7, endDay: 14, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司化工周期', startDay: 10, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    gold: [
                      { institution: '易方达', product: '易方达黄金ETF', startDay: 1, endDay: 9, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 13 },
                      { institution: '博时', product: '博时黄金ETF', startDay: 4, endDay: 12, tags: ['业绩展示'], platforms: ['ant'], materialCount: 9 },
                      { institution: '富国', product: '富国黄金主题', startDay: 0, endDay: 5, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                      { institution: '嘉实', product: '嘉实黄金配置', startDay: 7, endDay: 13, tags: ['持盈'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '中欧', product: '中欧黄金优选', startDay: 3, endDay: 10, tags: ['净值曲线'], platforms: ['ant'], materialCount: 6 },
                      { institution: '我司', product: '我司贵金属配置', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    rare_metal: [
                      { institution: '南方', product: '南方中证申万有色金属ETF', startDay: 0, endDay: 7, tags: ['净值曲线'], platforms: ['ant', 'wechat'], materialCount: 9 },
                      { institution: '华夏', product: '华夏中证细分有色ETF', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发稀有金属', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '嘉实', product: '嘉实稀土产业', startDay: 6, endDay: 11, tags: ['预热'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '我司', product: '我司稀有金属', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 3 },
                    ],
                    nasdaq: [
                      { institution: '广发', product: '广发纳斯达克100ETF', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 16 },
                      { institution: '华夏', product: '华夏纳斯达克100ETF', startDay: 2, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 10 },
                      { institution: '易方达', product: '易方达纳斯达克100', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '国泰', product: '国泰纳斯达克100', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 6 },
                      { institution: '南方', product: '南方纳斯达克', startDay: 5, endDay: 12, tags: ['分红战报'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司纳指联接', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    hstech: [
                      { institution: '华夏', product: '华夏恒生科技ETF', startDay: 1, endDay: 9, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 14 },
                      { institution: '易方达', product: '易方达恒生科技ETF', startDay: 3, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 9 },
                      { institution: '广发', product: '广发恒生科技', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '大成', product: '大成恒生科技', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '华泰柏瑞', product: '华泰柏瑞恒生科技', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司恒生科技', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    // === 行业 ===
                    media: [
                      { institution: '广发', product: '广发中证传媒ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 11 },
                      { institution: '鹏华', product: '鹏华传媒ETF', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '华夏', product: '华夏中证传媒', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方传媒主题', startDay: 6, endDay: 13, tags: ['预热'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司传媒精选', startDay: 8, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    power: [
                      { institution: '易方达', product: '易方达中证新能源', startDay: 1, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 15 },
                      { institution: '广发', product: '广发中证电力设备ETF', startDay: 3, endDay: 10, tags: ['募集启动'], platforms: ['ant'], materialCount: 10 },
                      { institution: '华夏', product: '华夏中证新能源ETF', startDay: 5, endDay: 12, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '南方', product: '南方新能源', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['wechat'], materialCount: 6 },
                      { institution: '富国', product: '富国中证电力设备', startDay: 7, endDay: 14, tags: ['净值曲线'], platforms: ['ant'], materialCount: 7 },
                      { institution: '汇添富', product: '汇添富新能源', startDay: 4, endDay: 11, tags: ['分红战报'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司电力设备', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    electronics: [
                      { institution: '华夏', product: '华夏国证芯片ETF', startDay: 2, endDay: 9, tags: ['爆发'], platforms: ['ant', 'wechat'], materialCount: 14 },
                      { institution: '广发', product: '广发半导体精选C', startDay: 4, endDay: 12, tags: ['分红战报'], platforms: ['ant'], materialCount: 9 },
                      { institution: '易方达', product: '易方达芯片ETF', startDay: 1, endDay: 6, tags: ['预热'], platforms: ['ant'], materialCount: 6 },
                      { institution: '富国', product: '富国半导体龙头', startDay: 7, endDay: 14, tags: ['业绩展示'], platforms: ['wechat'], materialCount: 7 },
                      { institution: '汇添富', product: '汇添富电子ETF', startDay: 3, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '南方', product: '南方中证电子', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司电子指数', startDay: 8, endDay: 14, tags: ['获批通告'], platforms: ['ant'], materialCount: 4 },
                    ],
                    real_estate: [
                      { institution: '南方', product: '南方中证全指房地产ETF', startDay: 0, endDay: 8, tags: ['持盈'], platforms: ['ant', 'wechat'], materialCount: 9 },
                      { institution: '华夏', product: '华夏中证房地产', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '鹏华', product: '鹏华地产ETF', startDay: 5, endDay: 12, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '招商', product: '招商房地产', startDay: 2, endDay: 7, tags: ['市场安抚'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '我司', product: '我司地产配置', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 3 },
                    ],
                    textile: [
                      { institution: '广发', product: '广发中证纺织服饰', startDay: 2, endDay: 8, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '富国', product: '富国纺织服饰', startDay: 4, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '华夏', product: '华夏纺织制造', startDay: 6, endDay: 12, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '我司', product: '我司纺织主题', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    nonbank: [
                      { institution: '易方达', product: '易方达中证保险', startDay: 1, endDay: 8, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '华夏', product: '华夏中证券商ETF', startDay: 3, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '南方', product: '南方非银金融', startDay: 5, endDay: 12, tags: ['净值曲线'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发证券保险', startDay: 0, endDay: 6, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '富国', product: '富国证券分级', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司非银配置', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    utility: [
                      { institution: '广发', product: '广发中证公用事业', startDay: 2, endDay: 9, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '华夏', product: '华夏公用事业', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '南方', product: '南方公用事业', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '富国', product: '富国公用事业', startDay: 7, endDay: 14, tags: ['分红战报'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司公用事业', startDay: 10, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    defense: [
                      { institution: '广发', product: '广发中证军工ETF', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '华夏', product: '华夏国防军工ETF', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '易方达', product: '易方达国防军工', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '富国', product: '富国军工主题', startDay: 2, endDay: 7, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '南方', product: '南方军工', startDay: 6, endDay: 13, tags: ['获批通告'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司国防军工', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    steel: [
                      { institution: '国泰', product: '国泰钢铁ETF', startDay: 1, endDay: 8, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '鹏华', product: '鹏华钢铁', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '华夏', product: '华夏中证钢铁', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '广发', product: '广发钢铁', startDay: 6, endDay: 13, tags: ['分红战报'], platforms: ['ant'], materialCount: 4 },
                      { institution: '我司', product: '我司钢铁周期', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    green: [
                      { institution: '华夏', product: '华夏中证长江环保ETF', startDay: 2, endDay: 9, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '广发', product: '广发环保ETF', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '易方达', product: '易方达环保主题', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '富国', product: '富国环保产业', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司环保主题', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    transport: [
                      { institution: '华夏', product: '华夏中证运输ETF', startDay: 1, endDay: 8, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '南方', product: '南方交通运输', startDay: 3, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发交运', startDay: 0, endDay: 5, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '富国', product: '富国交通运输', startDay: 6, endDay: 13, tags: ['分红战报'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司交运配置', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    basic_chem: [
                      { institution: '富国', product: '富国中证化工ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 9 },
                      { institution: '华宝', product: '华宝基础化工', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发基础化工', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '易方达', product: '易方达化工行业', startDay: 7, endDay: 14, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司基础化工', startDay: 10, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    // === 主题 ===
                    margin: [
                      { institution: '华夏', product: '华夏融资融券ETF', startDay: 1, endDay: 8, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '易方达', product: '易方达两融主题', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '广发', product: '广发两融策略', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方融资融券', startDay: 6, endDay: 13, tags: ['预热'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '我司', product: '我司两融增强', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    mid_report: [
                      { institution: '广发', product: '广发中报预增策略', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '华夏', product: '华夏业绩预增', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '易方达', product: '易方达预增主题', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '南方', product: '南方中报行情', startDay: 2, endDay: 7, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司预增精选', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    chip: [
                      { institution: '华夏', product: '华夏国证芯片ETF', startDay: 2, endDay: 9, tags: ['爆发'], platforms: ['ant', 'wechat'], materialCount: 16 },
                      { institution: '广发', product: '广发半导体精选C', startDay: 4, endDay: 12, tags: ['分红战报'], platforms: ['ant'], materialCount: 11 },
                      { institution: '易方达', product: '易方达芯片ETF', startDay: 1, endDay: 6, tags: ['预热'], platforms: ['ant'], materialCount: 6 },
                      { institution: '富国', product: '富国半导体龙头', startDay: 7, endDay: 14, tags: ['业绩展示'], platforms: ['wechat'], materialCount: 8 },
                      { institution: '汇添富', product: '汇添富芯片ETF', startDay: 3, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '我司', product: '我司芯片指数', startDay: 8, endDay: 14, tags: ['获批通告'], platforms: ['ant'], materialCount: 5 },
                    ],
                    ev: [
                      { institution: '华夏', product: '华夏中证新能源车ETF', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 15 },
                      { institution: '广发', product: '广发新能源车', startDay: 3, endDay: 10, tags: ['募集启动'], platforms: ['ant'], materialCount: 10 },
                      { institution: '易方达', product: '易方达新能源', startDay: 5, endDay: 12, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '汇添富', product: '汇添富新能源车', startDay: 2, endDay: 7, tags: ['持盈'], platforms: ['wechat'], materialCount: 6 },
                      { institution: '南方', product: '南方新能源车', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['ant'], materialCount: 6 },
                      { institution: '富国', product: '富国智能汽车', startDay: 7, endDay: 14, tags: ['分红战报'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司新能源车', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    '5g': [
                      { institution: '华夏', product: '华夏5G通信ETF', startDay: 1, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '银华', product: '银华5G通信', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '国泰', product: '国泰5G ETF', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '广发', product: '广发5G主题', startDay: 6, endDay: 13, tags: ['预热'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司5G通信', startDay: 8, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    soe_reform: [
                      { institution: '华夏', product: '华夏国企改革ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 11 },
                      { institution: '易方达', product: '易方达国企改革', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '南方', product: '南方国企改革', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '广发', product: '广发国企改革', startDay: 6, endDay: 13, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司国企改革', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    datacenter: [
                      { institution: '华夏', product: '华夏中证数据中心ETF', startDay: 1, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '易方达', product: '易方达云计算', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '广发', product: '广发数据中心', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方云计算ETF', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司数据中心', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    huawei: [
                      { institution: '华夏', product: '华夏华为概念ETF', startDay: 0, endDay: 8, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 14 },
                      { institution: '广发', product: '广发华为产业链', startDay: 3, endDay: 10, tags: ['业绩展示'], platforms: ['ant'], materialCount: 9 },
                      { institution: '易方达', product: '易方达华为主题', startDay: 5, endDay: 12, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '汇添富', product: '汇添富华为概念', startDay: 2, endDay: 7, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司华为产业链', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    west_dev: [
                      { institution: '广发', product: '广发西部大开发', startDay: 2, endDay: 8, tags: ['业绩展示'], platforms: ['ant'], materialCount: 6 },
                      { institution: '华夏', product: '华夏西部主题', startDay: 4, endDay: 10, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方西部基建', startDay: 0, endDay: 5, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '我司', product: '我司西部开发', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    robot_theme: [
                      { institution: '华夏', product: '华夏中证机器人ETF', startDay: 1, endDay: 9, tags: ['获批通告'], platforms: ['ant', 'wechat'], materialCount: 13 },
                      { institution: '易方达', product: '易方达机器人', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '广发', product: '广发机器人主题', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '南方', product: '南方机器人ETF', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '富国', product: '富国智能机器人', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司机器人混合', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                    ],
                    // === 指数 ===
                    dividend: [
                      { institution: '华夏', product: '华夏红利低波ETF', startDay: 0, endDay: 10, tags: ['分红战报'], platforms: ['ant', 'wechat'], materialCount: 16 },
                      { institution: '南方', product: '南方红利低波', startDay: 3, endDay: 12, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 10 },
                      { institution: '易方达', product: '易方达红利混合', startDay: 5, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 9 },
                      { institution: '富国', product: '富国红利精选', startDay: 2, endDay: 7, tags: ['预热'], platforms: ['ant'], materialCount: 5 },
                      { institution: '嘉实', product: '嘉实红利机会', startDay: 6, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '汇添富', product: '汇添富高股息', startDay: 1, endDay: 6, tags: ['持盈'], platforms: ['wechat'], materialCount: 4 },
                      { institution: '中欧', product: '中欧红利策略', startDay: 4, endDay: 9, tags: ['分红战报'], platforms: ['ant'], materialCount: 6 },
                      { institution: '广发', product: '广发红利增强', startDay: 8, endDay: 14, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '我司', product: '我司红利策略', startDay: 9, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                    ],
                    home_appliance: [
                      { institution: '华夏', product: '华夏国证龙头家电ETF', startDay: 2, endDay: 9, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '广发', product: '广发家电ETF', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 7 },
                      { institution: '易方达', product: '易方达家电行业', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方家电主题', startDay: 6, endDay: 13, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司龙头家电', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    high_equip: [
                      { institution: '华夏', product: '华夏中证高端装备ETF', startDay: 1, endDay: 9, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 12 },
                      { institution: '广发', product: '广发高端装备', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '易方达', product: '易方达高端制造', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '富国', product: '富国高端装备', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 6 },
                      { institution: '我司', product: '我司高端装备', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    ev_index: [
                      { institution: '华夏', product: '华夏中证新能源车ETF', startDay: 0, endDay: 8, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 14 },
                      { institution: '广发', product: '广发新能源汽车产业', startDay: 3, endDay: 10, tags: ['募集启动'], platforms: ['ant'], materialCount: 9 },
                      { institution: '易方达', product: '易方达新能源车指数', startDay: 5, endDay: 12, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '汇添富', product: '汇添富新能源车ETF', startDay: 2, endDay: 7, tags: ['持盈'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司新能源车指数', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    high_div_index: [
                      { institution: '华夏', product: '华夏高股息ETF', startDay: 1, endDay: 8, tags: ['分红战报'], platforms: ['ant', 'wechat'], materialCount: 11 },
                      { institution: '南方', product: '南方高股息优选', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 8 },
                      { institution: '易方达', product: '易方达高股息', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '富国', product: '富国高股息策略', startDay: 6, endDay: 13, tags: ['业绩展示'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司高股息指数', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    chip_index: [
                      { institution: '华夏', product: '华夏国证芯片ETF', startDay: 2, endDay: 9, tags: ['爆发'], platforms: ['ant', 'wechat'], materialCount: 15 },
                      { institution: '广发', product: '广发中证全指集成电路', startDay: 4, endDay: 12, tags: ['分红战报'], platforms: ['ant'], materialCount: 10 },
                      { institution: '易方达', product: '易方达芯片ETF', startDay: 1, endDay: 6, tags: ['预热'], platforms: ['ant'], materialCount: 6 },
                      { institution: '富国', product: '富国半导体龙头', startDay: 7, endDay: 14, tags: ['业绩展示'], platforms: ['wechat'], materialCount: 7 },
                      { institution: '我司', product: '我司集成电路指数', startDay: 8, endDay: 14, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                    ],
                    env_index: [
                      { institution: '华夏', product: '华夏中证长江环保ETF', startDay: 2, endDay: 9, tags: ['募集启动'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '广发', product: '广发环保主题', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '易方达', product: '易方达环保指数', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '富国', product: '富国环保产业', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司长江环保', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    fintech_index: [
                      { institution: '华夏', product: '华夏中证金融科技ETF', startDay: 1, endDay: 9, tags: ['新发冲刺'], platforms: ['ant', 'wechat'], materialCount: 13 },
                      { institution: '易方达', product: '易方达金融科技', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 8 },
                      { institution: '广发', product: '广发金融科技', startDay: 0, endDay: 6, tags: ['持盈'], platforms: ['ant'], materialCount: 5 },
                      { institution: '南方', product: '南方金融科技ETF', startDay: 6, endDay: 13, tags: ['净值曲线'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司金融科技', startDay: 8, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 4 },
                    ],
                    hk_fintech: [
                      { institution: '华夏', product: '华夏香港金融科技ETF', startDay: 2, endDay: 8, tags: ['业绩展示'], platforms: ['ant', 'wechat'], materialCount: 9 },
                      { institution: '广发', product: '广发国证香港金融科技', startDay: 4, endDay: 11, tags: ['持盈'], platforms: ['ant'], materialCount: 6 },
                      { institution: '易方达', product: '易方达港股金融科技', startDay: 0, endDay: 6, tags: ['净值曲线'], platforms: ['ant'], materialCount: 5 },
                      { institution: '我司', product: '我司港股金融科技', startDay: 7, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                    us_oilgas: [
                      { institution: '华宝', product: '华宝标普油气', startDay: 1, endDay: 9, tags: ['净值曲线'], platforms: ['ant', 'wechat'], materialCount: 10 },
                      { institution: '广发', product: '广发道琼斯美国石油', startDay: 4, endDay: 11, tags: ['业绩展示'], platforms: ['ant'], materialCount: 7 },
                      { institution: '易方达', product: '易方达原油', startDay: 0, endDay: 5, tags: ['持盈'], platforms: ['ant'], materialCount: 4 },
                      { institution: '南方', product: '南方原油', startDay: 6, endDay: 13, tags: ['分红战报'], platforms: ['wechat'], materialCount: 5 },
                      { institution: '我司', product: '我司美国油气', startDay: 9, endDay: 14, tags: ['预热'], platforms: ['ant'], materialCount: 3 },
                    ],
                  };
                  const baseKey = activeMarketSector;
                  const campaigns = (timelineBySector[baseKey] || []).map((c) => ({
                    ...c,
                    stage: tagToStage(c.tags),
                  }));
                  const institutions = [...new Set(campaigns.map((c) => c.institution))].sort((a, b) =>
                    a === '我司' ? 1 : b === '我司' ? -1 : a.localeCompare(b)
                  );
                  const totalDays = 15;
                  const rowHeight = 56;
                  const platformIcons = { ant: '🐜', wechat: '💬', douyin: '📕' };
                  const platformNames = { ant: '蚂蚁财富', wechat: '微信公众号', douyin: '小红书' };

                  const formatDayLabel = (dayIndex) => {
                    const d = Math.max(0, Math.min(totalDays - 1, Number(dayIndex) || 0));
                    return `T-${totalDays - 1 - d}`;
                  };

                  const gridTemplate = { gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` };

                  return (
                    <>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        战略时间轴：{sectorLabel} · 近15天
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">左侧机构固定，右侧时间轴按天均分 · 色深=热度</p>

                      <div className="flex w-full h-full border border-slate-200 rounded-lg bg-slate-50/50 overflow-hidden">
                        {/* 左侧机构列（固定） */}
                        <div className="w-32 md:w-40 flex-shrink-0 bg-slate-50 border-r border-slate-200">
                          {/* 表头占位，与日期行高度一致 */}
                          <div className="h-9 border-b border-slate-200" />
                          {institutions.map((inst) => (
                            <div
                              key={inst}
                              className={`flex items-center justify-center border-b border-slate-100 text-xs font-semibold ${
                                inst === '我司' ? 'bg-yellow-50 text-amber-900' : 'bg-white text-gray-800'
                              }`}
                              style={{ height: rowHeight }}
                            >
                              {inst === '我司' ? '【我司】' : inst}
                            </div>
                          ))}
                        </div>

                        {/* 右侧时间轴（可横向滚动） */}
                        <div className="flex-1 overflow-x-auto">
                          <div className="min-w-full">
                            {/* 日期表头 */}
                            <div
                              className="grid border-b border-slate-200 bg-slate-100/80 text-xs text-gray-600 font-medium"
                              style={gridTemplate}
                            >
                              {Array.from({ length: totalDays }, (_, i) => (
                                <div key={i} className="h-9 flex items-center justify-center border-r border-slate-200">
                                  T-{totalDays - 1 - i}
                                </div>
                              ))}
                            </div>

                            {/* 数据行 */}
                            {institutions.map((inst) => {
                              const rowCampaigns = campaigns.filter((c) => c.institution === inst);
                              return (
                                <div
                                  key={inst}
                                  className={`grid border-b border-slate-100 ${
                                    inst === '我司' ? 'bg-yellow-50/60' : 'bg-white'
                                  }`}
                                  style={{ ...gridTemplate, height: rowHeight }}
                                >
                                  {rowCampaigns.map((node, idx) => {
                                    const start = Math.max(0, node.startDay ?? 0);
                                    const end = Math.min(totalDays - 1, node.endDay ?? node.startDay ?? 0);
                                    const heatScore = (node.materialCount || 0) * (node.platforms?.length || 1);
                                    const tier = heatScore >= 20 ? 3 : heatScore >= 10 ? 2 : 1;
                                    const heatColors = ['#bfdbfe', '#60a5fa', '#1d4ed8'];
                                    const color = heatColors[tier - 1];
                                    const durationDays = end - start + 1;
                                    const sExposureDays = Math.max(1, Math.round(durationDays * 0.4));
                                    const rangeLabel = `${formatDayLabel(start)} ~ ${formatDayLabel(end)}`;
                                    const platformText = (node.platforms || [])
                                      .map((p) => `${platformIcons[p] || ''}${platformNames[p] || p}`)
                                      .join(' / ');
                                    const shortName =
                                      node.product.replace(node.institution, '').replace(/^[·\s]+/, '') ||
                                      node.product.slice(0, 10);
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-center px-1"
                                        style={{
                                          gridColumnStart: start + 1,
                                          gridColumnEnd: end + 2,
                                        }}
                                        title={`${node.product}
机构：${node.institution}
平台：${platformText}
时间区间：${rangeLabel}（共 ${durationDays} 天）
S级曝光位：约 ${sExposureDays} 天
标签：${(node.tags || []).join('、')}
物料数：${node.materialCount} 篇`}
                                      >
                                        <div
                                          className="w-full rounded-full border text-xs font-semibold text-center py-1 truncate shadow-sm"
                                          style={{ backgroundColor: color, borderColor: color, color: '#fff' }}
                                        >
                                          {shortName}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}

                            {institutions.length === 0 && (
                              <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
                                该赛道暂无竞品推广数据
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 px-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-[#bfdbfe]" /> 低热度（少量物料+单一平台）
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-[#60a5fa]" /> 中热度（适中物料+多平台）
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-[#1d4ed8]" /> 高热度（大量物料+多平台）
                        </span>
                          <span className="text-gray-500 ml-2">
                          条长=投放时长 · 颜色深浅=热度 · 🐜蚂蚁 💬微信 📕小红书
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 模块三：渠道流量地图（素材分布） */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">渠道流量地图</h4>
                <p className="mt-1 text-xs text-gray-500">
                  看清素材在平台 / 机构之间的分布结构，支持按机构或按平台查看占比。
                </p>
              </div>

              {/* 素材分布：可切换机构 / 平台（横向堆叠柱状图） */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-medium text-gray-700">
                    素材分布 · 物料数量占比
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setMaterialDistMode('platform')}
                      className={`px-2 py-0.5 text-[11px] rounded-full ${
                        materialDistMode === 'platform' ? 'bg-slate-800 text-white' : 'text-slate-600'
                      }`}
                    >
                      按平台
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialDistMode('institution')}
                      className={`px-2 py-0.5 text-[11px] rounded-full ${
                        materialDistMode === 'institution' ? 'bg-slate-800 text-white' : 'text-slate-600'
                      }`}
                    >
                      按机构
                    </button>
                  </div>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    {(() => {
                      const platformData = [
                        { name: '蚂蚁财富', 易方达: 30, 广发: 25, 华夏: 20, 其他: 25 },
                        { name: '微信公众号', 易方达: 28, 广发: 22, 华夏: 18, 其他: 32 },
                        { name: '小红书', 易方达: 35, 广发: 30, 华夏: 15, 其他: 20 },
                      ];
                      const institutionData = [
                        { name: '易方达', 蚂蚁财富: 32, 微信公众号: 28, 小红书: 40 },
                        { name: '广发', 蚂蚁财富: 30, 微信公众号: 22, 小红书: 35 },
                        { name: '华夏', 蚂蚁财富: 20, 微信公众号: 18, 小红书: 25 },
                        { name: '其他', 蚂蚁财富: 18, 微信公众号: 32, 小红书: 20 },
                      ];
                      const isPlatform = materialDistMode === 'platform';
                      const data = isPlatform ? platformData : institutionData;
                      const xKeys = isPlatform ? ['易方达', '广发', '华夏', '其他'] : ['蚂蚁财富', '微信公众号', '小红书'];
                      const colors = ['#ef4444', '#3b82f6', '#eab308', '#94a3b8'];
                      return (
                        <BarChart layout="vertical" data={data} margin={{ top: 4, right: 8, bottom: 4, left: 72 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            unit="%"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#94A3B8' }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={72}
                          />
                          <Tooltip formatter={(v, name) => [`${v}%`, String(name)]} contentStyle={{ fontSize: 11 }} />
                          {xKeys.map((key, idx) => (
                            <Bar key={key} dataKey={key} stackId="dist" fill={colors[idx]} name={key} />
                          ))}
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
                  {materialDistMode === 'platform' ? (
                    <>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> 易方达</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> 广发</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> 华夏</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> 其他</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> 蚂蚁财富</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> 微信公众号</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> 小红书</span>
                    </>
                  )}
                </div>
              </div>

              {/* 曝光堆叠曲线：机构维度 · 时间 X 曝光次数 */}
              <div>
                <div className="flex items-center justify-between mb-2 mt-1">
                  <div className="text-[11px] font-medium text-gray-700">
                    渠道曝光趋势 · 机构堆叠
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setChannelStackMode('percent')}
                      className={`px-2 py-0.5 text-[11px] rounded-full ${
                        channelStackMode === 'percent' ? 'bg-slate-800 text-white' : 'text-slate-600'
                      }`}
                    >
                      百分比
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannelStackMode('absolute')}
                      className={`px-2 py-0.5 text-[11px] rounded-full ${
                        channelStackMode === 'absolute' ? 'bg-slate-800 text-white' : 'text-slate-600'
                      }`}
                    >
                      绝对值
                    </button>
                  </div>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    {(() => {
                      const days = ['T-14', 'T-12', 'T-10', 'T-8', 'T-6', 'T-4', 'T-2', 'T-0'];
                      const data = [
                        { day: 'T-14', 易方达: 3200, 广发: 2600, 华夏: 2100, 其他: 1800 },
                        { day: 'T-12', 易方达: 3400, 广发: 2700, 华夏: 2200, 其他: 1700 },
                        { day: 'T-10', 易方达: 3600, 广发: 2900, 华夏: 2300, 其他: 1800 },
                        { day: 'T-8', 易方达: 3800, 广发: 3000, 华夏: 2400, 其他: 1900 },
                        { day: 'T-6', 易方达: 4000, 广发: 3100, 华夏: 2500, 其他: 2000 },
                        { day: 'T-4', 易方达: 4200, 广发: 3200, 华夏: 2600, 其他: 2100 },
                        { day: 'T-2', 易方达: 4300, 广发: 3300, 华夏: 2700, 其他: 2200 },
                        { day: 'T-0', 易方达: 4500, 广发: 3400, 华夏: 2800, 其他: 2300 },
                      ];
                      const colors = ['#ef4444', '#3b82f6', '#eab308', '#9ca3af'];
                      const isPercent = channelStackMode === 'percent';
                      return (
                        <AreaChart
                          data={data}
                          stackOffset={isPercent ? 'expand' : undefined}
                          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#CBD5F5' }}
                          />
                          {isPercent ? (
                            <YAxis
                              tickFormatter={(v) => `${Math.round(v * 100)}%`}
                              tick={{ fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                          ) : (
                            <YAxis
                              tickFormatter={(v) => `${Math.round(v / 100) / 10}万`}
                              tick={{ fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                          )}
                          <Tooltip
                            formatter={(value, name) =>
                              isPercent
                                ? [`${Math.round(Number(value) * 100)}%`, String(name)]
                                : [`${Math.round(Number(value)).toLocaleString()} 次`, String(name)]
                            }
                            labelFormatter={(label) => `日期 ${label}`}
                            contentStyle={{ fontSize: 11 }}
                          />
                          {['易方达', '广发', '华夏', '其他'].map((key, idx) => (
                            <Area
                              key={key}
                              type="monotone"
                              dataKey={key}
                              stackId="expo"
                              stroke={colors[idx]}
                              fill={colors[idx]}
                              fillOpacity={0.9}
                            />
                          ))}
                        </AreaChart>
                      );
                    })()}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {false && (
              <>

            {/* 模块四：供需机会缺口（平台流量趋势 · 高胜率 Alpha 模型） */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900">供需机会缺口</h4>
                <p className="mt-1 text-xs text-gray-500">
                  平台流量趋势 → 标签组合推荐
                </p>
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">平台流量趋势</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { name: '蚂蚁财富', icon: '🐜', iconBg: 'bg-blue-50', rising: { label: '短视频', share: 25, trend: [8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 22, 25] }, falling: { label: '长文', share: -15, trend: [35, 33, 30, 28, 26, 24, 22, 20, 19, 18, 17, 15] }, hotTopic: 'A500' },
                      { name: '微信公众号', icon: '💬', iconBg: 'bg-green-50', rising: { label: '图文+视频', share: 12, trend: [5, 5, 6, 6, 7, 8, 9, 10, 11, 11, 12, 12] }, falling: { label: '纯文字', share: -8, trend: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 15] }, hotTopic: '红利低波' },
                      { name: '小红书', icon: '📕', iconBg: 'bg-red-50', rising: { label: '真人口播', share: 32, trend: [10, 12, 14, 16, 18, 20, 24, 28, 30, 31, 32, 32] }, falling: { label: 'MG动画', share: -18, trend: [22, 20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3] }, hotTopic: '半导体' },
                    ].map((platform) => (
                      <div key={platform.name} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-8 h-8 rounded-lg ${platform.iconBg} flex items-center justify-center text-base`}>{platform.icon}</span>
                          <span className="text-xs font-semibold text-gray-900">{platform.name}</span>
                          <span className="ml-auto px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">🔥 {platform.hotTopic}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-emerald-600 font-medium">📈 {platform.rising.label} ↗{platform.rising.share}%</span>
                            <svg width="48" height="14" viewBox="0 0 48 14" className="opacity-70">
                              {platform.rising.trend.map((v, i) => {
                                const max = Math.max(...platform.rising.trend);
                                const min = Math.min(...platform.rising.trend);
                                const h = max === min ? 6 : Math.round(((v - min) / (max - min)) * 10) + 2;
                                return <rect key={i} x={i * 4} y={14 - h} width="3" height={h} rx="1" fill="#10b981" />;
                              })}
                            </svg>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-rose-600 font-medium">📉 {platform.falling.label} ↘{Math.abs(platform.falling.share)}%</span>
                            <svg width="48" height="14" viewBox="0 0 48 14" className="opacity-70">
                              {platform.falling.trend.map((v, i) => {
                                const max = Math.max(...platform.falling.trend);
                                const min = Math.min(...platform.falling.trend);
                                const h = max === min ? 6 : Math.round(((v - min) / (max - min)) * 10) + 2;
                                return <rect key={i} x={i * 4} y={14 - h} width="3" height={h} rx="1" fill="#f43f5e" />;
                              })}
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">高胜率 Alpha 模型 · 制胜公式</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { modelName: '蚂蚁财富 · 短债杀手', tags: ['蚂蚁财富', '长图', '理财存钱', '极简风'], supply: 18, demand: 85, roiBadge: '高转化', roiClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', reason: '理财存钱需求旺盛，竞品多用复杂长文，极简长图是蓝海。', action: '使用模板' },
                      { modelName: '小红书 · 半导体情绪流', tags: ['小红书', '真人口播', '半导体', '快节奏'], supply: 25, demand: 78, roiBadge: '高流量', roiClass: 'bg-amber-50 text-amber-700 border-amber-200', reason: '半导体话题情绪高、传播快，真人口播完播率优于MG动画。', action: '查看脚本' },
                      { modelName: '微信 · 红利低波深度', tags: ['微信公众号', '图文+视频', '红利低波', '稳健叙事'], supply: 22, demand: 72, roiBadge: '高留存', roiClass: 'bg-sky-50 text-sky-700 border-sky-200', reason: '高净值用户偏好深度内容，图文+视频组合提升信任感。', action: '使用模板' },
                    ].map((model, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-900">{model.modelName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${model.roiClass}`}>{model.roiBadge}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          {model.tags.map((t, i) => (
                            <React.Fragment key={i}>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">{t}</span>
                              {i < model.tags.length - 1 && <span className="text-slate-400 text-[10px]">+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                            <span>供给 {model.supply}%</span>
                            <span>需求 {model.demand}%</span>
                          </div>
                          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-slate-200" style={{ width: `${model.supply}%` }} />
                            <div className="bg-emerald-400 flex-1" />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-2 leading-snug">{model.reason}</p>
                        <button className="w-full py-1.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                          {model.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 模块五：创意吸睛密码（标签组合统计） */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-3">
                <h4 className="text-base font-semibold text-gray-900">创意吸睛密码</h4>
                <p className="mt-1 text-sm text-gray-500">
                  视觉风格趋势监控 · 高胜率标签组合统计
                </p>
              </div>
              <div className="space-y-4">
                {/* Section 1: 视觉风格趋势监控 */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">视觉风格趋势 · 近30天</div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                          <th className="text-left py-2.5 px-3 font-semibold text-slate-700 w-24 first:rounded-tl-lg">风格</th>
                          <th className="text-right py-2.5 px-3 font-semibold text-slate-700 w-16">Avg CTR</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-slate-700 w-24">趋势</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-slate-700 w-20 last:rounded-tr-lg">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: '科技/数字风', ctr: '4.2%', trend: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6], status: '上升中', statusKey: 'up', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                          { name: '国潮风', ctr: '3.8%', trend: [8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4, 3], status: '疲劳', statusKey: 'fatigue', statusClass: 'bg-rose-50 text-rose-700 border-rose-200' },
                          { name: '极简风', ctr: '3.5%', trend: [3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5], status: '上升中', statusKey: 'up', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                          { name: '温馨/插画', ctr: '3.1%', trend: [4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 4], status: '平稳', statusKey: 'stable', statusClass: 'bg-slate-50 text-slate-600 border-slate-200' },
                          { name: '大字报风', ctr: '2.9%', trend: [5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3], status: '疲劳', statusKey: 'fatigue', statusClass: 'bg-rose-50 text-rose-700 border-rose-200' },
                        ].map((row, rowIdx) => {
                          const max = Math.max(...row.trend);
                          const min = Math.min(...row.trend);
                          return (
                            <tr key={row.name} className={`border-b border-slate-100 last:border-b-0 ${rowIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-blue-50/40 transition-colors`}>
                              <td className="py-2.5 px-3 font-medium text-gray-800">{row.name}</td>
                              <td className="py-2.5 px-3 text-right font-semibold text-gray-900 tabular-nums">{row.ctr}</td>
                              <td className="py-2.5 px-3">
                                <svg width="72" height="14" viewBox="0 0 72 14" className="mx-auto">
                                  {row.trend.map((v, idx) => {
                                    const h = max === min ? 6 : Math.round(((v - min) / (max - min)) * 10) + 2;
                                    const x = idx * 6;
                                    const y = 14 - h;
                                    const fill = row.statusKey === 'fatigue' ? '#f43f5e' : row.statusKey === 'up' ? '#10b981' : '#64748b';
                                    return <rect key={idx} x={x} y={y} width="4" height={h} rx="1" fill={fill} />;
                                  })}
                                </svg>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${row.statusClass}`}>{row.status}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 2: 高胜率标签组合 Top 5 */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">高胜率标签组合 Top 5</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { tags: ['大字报/极简', '红色系', '核心数据放大'], ctr: 12.3, sample: 128, accent: 'border-l-4 border-l-amber-500' },
                      { tags: ['温馨/插画', 'IP形象', '定投曲线'], ctr: 15.2, sample: 96, accent: 'border-l-4 border-l-emerald-500' },
                      { tags: ['科技风', '蓝色系', '芯片/电路板'], ctr: 9.8, sample: 87, accent: 'border-l-4 border-l-blue-500' },
                      { tags: ['国潮风', '金色系', '龙头榜单'], ctr: 8.5, sample: 64, accent: 'border-l-4 border-l-amber-400' },
                      { tags: ['极简风', '黑白灰', '净值曲线'], ctr: 7.9, sample: 112, accent: 'border-l-4 border-l-slate-400' },
                    ].map((combo, idx) => (
                      <div key={idx} className={`rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ${combo.accent}`}>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                          {combo.tags.map((t, i) => (
                            <React.Fragment key={i}>
                              <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium shadow-sm">{t}</span>
                              {i < combo.tags.length - 1 && <span className="text-slate-400 font-normal text-[10px]">+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="font-semibold text-gray-900">→ CTR {combo.ctr}%</span>
                          <span className="text-slate-500 text-[11px]">样本量 {combo.sample}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

              </>
            )}

            {/* 模块六：高赞神评雷达（小红书 / 蚂蚁财富） */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900">高赞神评雷达</h4>
                <p className="mt-1 text-xs text-gray-500">
                  小红书 · 蚂蚁财富 · 高影响力用户评论
                </p>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                {[
                  {
                    emotion: '😡 [投诉/锁定期]',
                    emotionClass: 'bg-rose-50 text-rose-700 border-rose-200',
                    likes: 1234,
                    comment: '买的时候根本没说是三年锁定期！急用钱取不出来，这不是坑人吗？',
                    institution: '广发基金',
                    product: '广发稳健增长A',
                    platform: 'xiaohongshu',
                    platformLabel: '小红书',
                    time: '2小时前',
                  },
                  {
                    emotion: '🤑 [FOMO/追涨]',
                    emotionClass: 'bg-amber-50 text-amber-700 border-amber-200',
                    likes: 892,
                    comment: '现在还能买吗？求代码！再不买就踏空了！',
                    institution: '华夏基金',
                    product: '华夏中证A500ETF',
                    platform: 'ant',
                    platformLabel: '蚂蚁财富',
                    time: '5小时前',
                  },
                  {
                    emotion: '😨 [恐慌/回撤]',
                    emotionClass: 'bg-slate-100 text-slate-700 border-slate-200',
                    likes: 567,
                    comment: '天天发近1月涨多少，我一买就回撤，能不能讲点长期的？',
                    institution: '易方达基金',
                    product: '易方达蓝筹精选',
                    platform: 'xiaohongshu',
                    platformLabel: '小红书',
                    time: '1天前',
                  },
                  {
                    emotion: '😤 [投诉/费率]',
                    emotionClass: 'bg-rose-50 text-rose-700 border-rose-200',
                    likes: 445,
                    comment: '申购费1.5%也太贵了吧，别的平台都打一折，你们凭什么？',
                    institution: '富国基金',
                    product: '富国天惠成长',
                    platform: 'ant',
                    platformLabel: '蚂蚁财富',
                    time: '3小时前',
                  },
                  {
                    emotion: '🤔 [观望/犹豫]',
                    emotionClass: 'bg-sky-50 text-sky-700 border-sky-200',
                    likes: 312,
                    comment: '定投了一年还是绿的，要不要割？有没有懂的人说说。',
                    institution: '南方基金',
                    product: '南方中证500ETF',
                    platform: 'xiaohongshu',
                    platformLabel: '小红书',
                    time: '6小时前',
                  },
                ].map((card, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-b border-slate-100">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${card.emotionClass}`}>
                        {card.emotion}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">❤️ {card.likes.toLocaleString()}</span>
                    </div>
                    <div className="px-3 py-3">
                      <p className="text-sm text-gray-900 leading-relaxed">&quot;{card.comment}&quot;</p>
                    </div>
                    <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      <span><span className="text-slate-500">机构</span> {card.institution}</span>
                      <span><span className="text-slate-500">产品</span> {card.product}</span>
                      <span className="flex items-center gap-1">
                        {card.platform === 'xiaohongshu' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px]">📕 {card.platformLabel}</span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px]">🐜 {card.platformLabel}</span>
                        )}
                        <span className="text-slate-400">{card.time}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 模块二：异动监测中心（单独一块，作战雷达横向卡片流） */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-700">异动监测中心 · 作战雷达</h3>
              <span className="text-xs text-gray-400">
                共 {ANOMALY_CARDS.filter((a) => anomalyDimFilter === '全部' || a.dim === anomalyDimFilter).length} 条智能预警信号
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-gray-500">异动维度：</span>
              {['机构战术异动', '赛道风向异动', '渠道生态异动', '创意审美异动', '舆情与供需异动', '全部'].map((dim) => (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setAnomalyDimFilter(dim)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    anomalyDimFilter === dim
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {dim}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto py-1 custom-scrollbar">
            {ANOMALY_CARDS.filter((a) => anomalyDimFilter === '全部' || a.dim === anomalyDimFilter).map((a) => {
              const levelStyles = {
                red: { border: 'border-red-300', dot: 'bg-red-300', tag: 'bg-red-50 text-red-600 border-red-100', gm: 'bg-red-50 border-red-100 text-red-700' },
                orange: { border: 'border-orange-300', dot: 'bg-orange-300', tag: 'bg-orange-50 text-orange-600 border-orange-100', gm: 'bg-orange-50 border-orange-100 text-orange-700' },
                blue: { border: 'border-blue-300', dot: 'bg-blue-300', tag: 'bg-blue-50 text-blue-600 border-blue-100', gm: 'bg-blue-50 border-blue-100 text-blue-700' },
                purple: { border: 'border-purple-300', dot: 'bg-purple-300', tag: 'bg-purple-50 text-purple-600 border-purple-100', gm: 'bg-purple-50 border-purple-100 text-purple-700' },
                green: { border: 'border-emerald-300', dot: 'bg-emerald-300', tag: 'bg-emerald-50 text-emerald-600 border-emerald-100', gm: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
              };
              const s = levelStyles[a.level] || levelStyles.blue;
              const emoji = { red: '🔴', orange: '🟠', blue: '🔵', purple: '🟣', green: '🟢' }[a.level] || '🔵';
              return (
                <div key={a.id} className={`min-w-[350px] max-w-sm bg-white rounded-lg shadow-sm border-t-4 ${s.border} p-3 flex flex-col hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${s.tag}`}>
                        {emoji} [{a.tag}] {a.sub}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-600">{a.dim}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed mb-3">
                    <span className="font-medium text-gray-800">触发条件：</span>
                    {a.trigger}
                  </p>
                  <div className={`mt-auto rounded-md px-2.5 py-2 text-[11px] border ${s.gm}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs">⚡</span>
                      <span className="font-semibold">异动建议</span>
                    </div>
                    <p className="leading-snug">{a.gm}</p>
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
              {(() => {
                const currentDim = displayTrends.find(d => d.id === 'effectiveness') || displayTrends.find(d => d.id === 'institution');
                const title = currentDim?.id === 'institution' ? '机构活跃度排名详情' : '机构传播效果排名详情';
                return <h3 className="text-lg font-semibold text-gray-900">{title}</h3>;
              })()}
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
                    // 机构排名显示素材数量，传播效果排名显示阅读量
                    const unit = currentDim.id === 'institution' ? '条' : '阅读';
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
                            <span className="text-sm font-bold text-gray-900">{item.count >= 1000 ? (item.count / 1000).toFixed(1) + 'k' : item.count} {unit}</span>
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
