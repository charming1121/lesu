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
            {/* 模块一：机构营销产品部署 (Institutional Deployment Monitor) */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">机构营销产品部署</h4>
                <p className="mt-1 text-xs text-gray-500">
                  一眼看清头部竞品每天在推哪只具体产品、处于什么阶段、投入多少兵力。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] text-gray-500">筛选：</span>
                {[
                  { key: 'all', label: '全部' },
                  { key: 'new', label: '新发产品' },
                  { key: '持营', label: '持营产品' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDeployFilter(opt.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      deployFilter === opt.key
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {(() => {
                const timeTicks = ['T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'T+0', 'T+3'];
                const stageConfig = {
                  预热期: { color: 'bg-blue-500', border: 'border-blue-600', label: '🔵 预热期' },
                  爆发期: { color: 'bg-red-500', border: 'border-red-600', label: '🔴 爆发期' },
                  持盈期: { color: 'bg-emerald-500', border: 'border-emerald-600', label: '🟢 持盈期' },
                  防御期: { color: 'bg-slate-500', border: 'border-slate-600', label: '🛡️ 防御期' },
                };
                const ganttBars = [
                  { institution: '易方达', product: '易方达中证A500ETF', dayStart: 2, dayEnd: 6, stage: '爆发期', intensity: 12, isNew: true, tags: '低费率促销 + 龙头效应', channels: '蚂蚁(60%)+天天(40%)' },
                  { institution: '易方达', product: '易方达科技龙头C', dayStart: 0, dayEnd: 3, stage: '持盈期', intensity: 2, isNew: false, tags: '业绩展示', channels: '蚂蚁(80%)' },
                  { institution: '广发', product: '广发中证A500ETF', dayStart: 1, dayEnd: 7, stage: '爆发期', intensity: 15, isNew: true, tags: '费率战 + 规模优势', channels: '蚂蚁(55%)+微信(45%)' },
                  { institution: '广发', product: '广发半导体精选C', dayStart: 4, dayEnd: 7, stage: '持盈期', intensity: 3, isNew: false, tags: '净值曲线', channels: '天天(70%)' },
                  { institution: '华夏', product: '华夏红利低波ETF', dayStart: 0, dayEnd: 7, stage: '持盈期', intensity: 5, isNew: false, tags: '分红战报 + 抗跌', channels: '蚂蚁(50%)+微信(50%)' },
                  { institution: '华夏', product: '华夏中证机器人ETF', dayStart: 5, dayEnd: 8, stage: '预热期', intensity: 4, isNew: true, tags: '获批通告', channels: '渠道预通知' },
                  { institution: '富国', product: '富国短债A', dayStart: 0, dayEnd: 7, stage: '防御期', intensity: 2, isNew: false, tags: '稳健替代', channels: '微信(60%)' },
                  { institution: '南方', product: '南方中证TMT', dayStart: 3, dayEnd: 7, stage: '持盈期', intensity: 4, isNew: false, tags: '科技主题', channels: '蚂蚁(40%)+抖音(60%)' },
                ];
                const filteredBars = deployFilter === 'all' ? ganttBars : deployFilter === 'new' ? ganttBars.filter((b) => b.isNew) : ganttBars.filter((b) => !b.isNew);
                const institutions = [...new Set(filteredBars.map((b) => b.institution))];
                const totalDays = timeTicks.length;
                const dayWidth = 28;
                return (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto overflow-y-auto max-h-[320px]">
                      <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                        <div className="w-32 flex-shrink-0 border-r border-slate-200 py-1.5 text-[10px] font-semibold text-gray-500 text-center">机构 · 产品</div>
                        <div className="flex" style={{ minWidth: totalDays * dayWidth }}>
                          {timeTicks.map((t) => (
                            <div key={t} className="flex-shrink-0 py-1.5 text-[10px] text-gray-500 text-center border-r border-slate-100" style={{ width: dayWidth }}>{t}</div>
                          ))}
                        </div>
                      </div>
                      {institutions.map((inst) => {
                        const bars = filteredBars.filter((b) => b.institution === inst);
                        return (
                          <div key={inst} className="border-b border-slate-100 last:border-b-0">
                            {bars.map((bar, idx) => {
                              const stage = stageConfig[bar.stage] || stageConfig.持盈期;
                              const intensityNorm = Math.min(1, bar.intensity / 15);
                              const opacityClass = intensityNorm > 0.6 ? 'opacity-100' : intensityNorm > 0.3 ? 'opacity-80' : 'opacity-60';
                              return (
                                <div key={`${bar.product}-${idx}`} className="flex items-stretch relative h-7 group">
                                  {idx === 0 && (
                                    <div className="w-32 flex-shrink-0 border-r border-slate-200 bg-slate-50/80 flex items-center px-2 text-[10px] font-medium text-gray-700" style={{ height: bars.length * 28 }}>{inst}</div>
                                  )}
                                  {idx > 0 && <div className="w-32 flex-shrink-0 border-r border-slate-200 bg-slate-50/50" />}
                                  <div className="flex-1 relative" style={{ minWidth: totalDays * dayWidth }}>
                                    <div
                                      className={`absolute top-1 h-5 rounded ${stage.color} border ${stage.border} ${opacityClass} hover:ring-2 hover:ring-offset-1 hover:ring-slate-400 cursor-pointer transition-all flex items-center justify-center`}
                                      style={{ left: `${(bar.dayStart / (totalDays - 1)) * 100}%`, width: `${Math.max(8, ((bar.dayEnd - bar.dayStart + 1) / (totalDays - 1)) * 100)}%`, minWidth: 48 }}
                                      title={`${bar.product} | ${bar.stage} | 当日物料约 ${bar.intensity} 条`}
                                    >
                                      <span className="text-[9px] font-semibold text-white truncate px-1">{bar.product.replace(inst, '').replace(/^[·\s]+/, '') || bar.product.slice(0, 8)}</span>
                                    </div>
                                    <div className="absolute left-0 right-0 top-full z-20 hidden group-hover:block mt-0.5">
                                      <div className="bg-slate-800 text-white text-[10px] rounded-lg px-2 py-1.5 shadow-lg border border-slate-600 max-w-xs">
                                        <div className="font-semibold text-white">{bar.product}</div>
                                        <div className="text-slate-300 mt-0.5">标签：{bar.tags}</div>
                                        <div className="text-slate-400">渠道：{bar.channels}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {bars.length === 0 && (
                              <div className="flex h-7 items-center">
                                <div className="w-32 flex-shrink-0 border-r border-slate-200 bg-slate-50 px-2 text-[10px] text-gray-500">{inst}</div>
                                <div className="flex-1 text-[10px] text-gray-400 italic">暂无数据</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 px-2 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px]">
                      {Object.entries(stageConfig).map(([k, v]) => (
                        <span key={k} className="flex items-center gap-1">
                          <span className={`w-3 h-3 rounded ${v.color} border ${v.border}`} />
                          <span className="text-gray-600">{v.label}</span>
                        </span>
                      ))}
                      <span className="text-gray-400 ml-2">条深浅 = 当日物料数量（深=饱和式，浅=日常维护）</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 模块二：全市场赛道营销流向 (Market Concept Flow) */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">全市场赛道营销流向</h4>
                <p className="mt-1 text-xs text-gray-500">
                  高颗粒度板块热力图 · 鼠标悬浮至板块显示主力推手详情。
                </p>
              </div>
              <div className="relative rounded-xl border border-slate-100 bg-slate-50/30 p-3">
                <div className="text-[11px] text-gray-500 pb-2 border-b border-slate-100 mb-2">
                  板块热力图 · 面积=物料总量，色相=板块，色深=体量
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={[
                        {
                          name: 'TMT',
                          value: 520,
                          trend: 0.35,
                          category: 'tmt',
                          children: [
                            { name: 'CPO光模块', value: 128, trend: 0.52, id: 'cpo', category: 'tmt' },
                            { name: '人形机器人', value: 95, trend: 0.48, id: 'robot', category: 'tmt' },
                            { name: 'AI应用', value: 142, trend: 0.41, id: 'ai_app', category: 'tmt' },
                            { name: '信创', value: 88, trend: 0.12, id: 'xinchuang', category: 'tmt' },
                          ],
                        },
                        {
                          name: '制造',
                          value: 380,
                          trend: 0.22,
                          category: 'manufacturing',
                          children: [
                            { name: '固态电池', value: 98, trend: 0.38, id: 'solid_battery', category: 'manufacturing' },
                            { name: '低空经济', value: 112, trend: 0.55, id: 'low_air', category: 'manufacturing' },
                            { name: '轨交设备', value: 76, trend: 0.18, id: 'rail', category: 'manufacturing' },
                          ],
                        },
                        {
                          name: '策略',
                          value: 410,
                          trend: 0.15,
                          category: 'strategy',
                          children: [
                            { name: '红利低波', value: 165, trend: 0.28, id: 'dividend', category: 'strategy' },
                            { name: '高股息', value: 132, trend: 0.22, id: 'high_div', category: 'strategy' },
                            { name: '微盘股', value: 88, trend: -0.05, id: 'micro', category: 'strategy' },
                          ],
                        },
                      ]}
                      dataKey="value"
                      aspectRatio={4 / 3}
                      stroke="none"
                      content={(props) => {
                        const { x, y, width, height, name, value, trend, id, category } = props;
                        if (width < 36 || height < 28) return null;
                        const isLeaf = typeof id === 'string';
                        const cat = category ?? (name === 'TMT' ? 'tmt' : name === '制造' ? 'manufacturing' : name === '策略' ? 'strategy' : (['cpo','robot','ai_app','xinchuang'].includes(id) ? 'tmt' : ['solid_battery','low_air','rail'].includes(id) ? 'manufacturing' : 'strategy'));
                        const v = value != null ? Number(value) : 0;
                        const tier = v >= 140 ? 4 : v >= 110 ? 3 : v >= 90 ? 2 : 1;
                        const palettes = {
                          tmt: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6'],
                          manufacturing: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981'],
                          strategy: ['#ede9fe', '#c4b5fd', '#a78bfa', '#8b5cf6'],
                        };
                        const parentFills = { tmt: '#93c5fd', manufacturing: '#6ee7b7', strategy: '#c4b5fd' };
                        const fill = isLeaf ? (palettes[cat] || palettes.tmt)[Math.min(tier - 1, 3)] : (parentFills[cat] || parentFills.tmt);
                        const trendUp = trend != null && trend >= 0;
                        const trendPct = trend != null ? (trend * 100).toFixed(0) : '';
                        const pad = 14;
                        const isCompact = isLeaf && height < 44;
                        const handleMouseEnter = (e) => {
                          if (isLeaf && id) {
                            if (hoverLeaveRef.current) clearTimeout(hoverLeaveRef.current);
                            setHoveredConceptId(id);
                            setTooltipPos({ x: e.clientX, y: e.clientY });
                          }
                        };
                        const handleMouseLeave = () => {
                          hoverLeaveRef.current = setTimeout(() => setHoveredConceptId(null), 100);
                        };
                        return (
                          <g className="treemap-block" style={{ cursor: isLeaf ? 'pointer' : 'default' }}>
                            <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} fill={fill} />
                            {isLeaf ? (
                              <>
                                {isCompact ? (
                                  <>
                                    <text x={x + width / 2} y={y + height / 3} fill="#000000" fontSize={13} fontWeight={600} textAnchor="middle">
                                      {name}
                                    </text>
                                    {trendPct !== '' && (
                                      <text x={x + width / 2} y={y + height - 8} fill={trendUp ? '#dc2626' : '#16a34a'} fontSize={10} fontWeight={600} textAnchor="middle">
                                        {trendUp ? '+' : ''}{trendPct}%
                                      </text>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <text x={x + width / 2} y={y + height / 3} fill="#000000" fontSize={16} fontWeight={600} textAnchor="middle">
                                      {name}
                                    </text>
                                    <text x={x + width / 2} y={y + height - pad - 4} textAnchor="middle" fontSize={12} fontWeight={500}>
                                      <tspan fill="#334155">{value} 篇</tspan>
                                      {trendPct !== '' && (
                                        <tspan fill={trendUp ? '#dc2626' : '#16a34a'} fontWeight={600}>  {trendUp ? '+' : ''}{trendPct}% {trendUp ? '↑' : '↓'}</tspan>
                                      )}
                                    </text>
                                  </>
                                )}
                              </>
                            ) : (
                              <text
                                x={x + width / 2}
                                y={y + height / 3}
                                fill="#000000"
                                fontSize={17}
                                fontWeight={600}
                                textAnchor="middle"
                              >
                                {name}
                              </text>
                            )}
                            {isLeaf && (
                              <rect
                                x={x + 1}
                                y={y + 1}
                                width={width - 2}
                                height={height - 2}
                                fill="transparent"
                                style={{ pointerEvents: 'all' }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                              />
                            )}
                          </g>
                        );
                      }}
                    />
                  </ResponsiveContainer>
                </div>
                {/* 悬浮窗：主力推手详情（Portal 到 body，避免父级 transform 导致定位错误） */}
                {hoveredConceptId && typeof document !== 'undefined' && createPortal(
                  <div
                    className="fixed z-[9999] min-w-[220px] max-w-[300px] rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                    style={(() => {
                      const W = 300, H = 220, offset = 12;
                      const w = window.innerWidth;
                      const h = window.innerHeight;
                      let left = tooltipPos.x + offset;
                      let top = tooltipPos.y + offset;
                      if (left + W > w) left = tooltipPos.x - W - offset;
                      if (top + H > h) top = tooltipPos.y - H - offset;
                      left = Math.max(8, Math.min(left, w - W - 8));
                      top = Math.max(8, Math.min(top, h - H - 8));
                      return { left, top };
                    })()}
                    onMouseEnter={() => { if (hoverLeaveRef.current) clearTimeout(hoverLeaveRef.current); }}
                    onMouseLeave={() => setHoveredConceptId(null)}
                  >
                    {(() => {
                      const listByConcept = {
                        cpo: [
                          { org: '招商基金', product: '招商中证云计算与大数据ETF', sell: '短期业绩亮眼 (近1月+15%)', sample: '#' },
                        ],
                        robot: [
                          { org: '华夏基金', product: '华夏中证机器人ETF', sell: '获批主题预热', sample: '#' },
                        ],
                        ai_app: [
                          { org: '易方达基金', product: '易方达人工智能主题', sell: 'AI应用落地叙事', sample: '#' },
                        ],
                        dividend: [
                          { org: '华夏基金', product: '华夏红利低波ETF', sell: '分红战报 + 抗跌', sample: '#' },
                          { org: '南方基金', product: '南方红利低波', sell: '高股息配置', sample: '#' },
                        ],
                        low_air: [
                          { org: '广发基金', product: '广发中证低空经济', sell: '政策+订单双驱动', sample: '#' },
                        ],
                      };
                      const list = listByConcept[hoveredConceptId] || [];
                      const conceptName = { cpo: 'CPO光模块', robot: '人形机器人', ai_app: 'AI应用', dividend: '红利低波', low_air: '低空经济', high_div: '高股息', micro: '微盘股', solid_battery: '固态电池', rail: '轨交设备', xinchuang: '信创' }[hoveredConceptId] || hoveredConceptId;
                      return (
                        <>
                          <div className="text-xs font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-1.5">主力推手 · {conceptName}</div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {list.length > 0 ? list.map((row, i) => (
                              <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-[11px]">
                                <div className="font-semibold text-gray-900">推手机构：{row.org}</div>
                                <div className="text-gray-700 mt-0.5">关联产品：{row.product}</div>
                                <div className="text-slate-600 mt-0.5">核心卖点：{row.sell}</div>
                                <a href={row.sample} className="inline-block mt-1 text-blue-600 hover:underline">物料样本 →</a>
                              </div>
                            )) : (
                              <div className="text-[11px] text-slate-500 py-2">暂无推手数据</div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>,
                  document.body
                )}
              </div>
            </div>

            {/* 模块三：渠道流量地图（宏观 SOV + 微观战术矩阵） */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">渠道流量地图</h4>
                <p className="mt-1 text-xs text-gray-500">
                  从宏观看声量占有率（SOV），微观看竞品在各渠道的战术形式与流量热度。
                </p>
              </div>

              {/* 宏观层：渠道声量占有率 SOV（横向堆叠柱状图） */}
              <div className="mb-4">
                <div className="text-[11px] font-medium text-gray-700 mb-2">渠道声量占有率 Share of Voice</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { channel: '蚂蚁财富', 易方达: 30, 广发: 25, 华夏: 20, 其他: 25 },
                        { channel: '微信公众号', 易方达: 28, 广发: 22, 华夏: 18, 其他: 32 },
                        { channel: '抖音', 易方达: 35, 广发: 30, 华夏: 15, 其他: 20 },
                        { channel: '小红书', 易方达: 18, 广发: 15, 华夏: 12, 其他: 55 },
                      ]}
                      margin={{ top: 4, right: 8, bottom: 4, left: 72 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                      <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#94A3B8' }} />
                      <YAxis type="category" dataKey="channel" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={68} />
                      <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ fontSize: 11 }} />
                      <Bar dataKey="易方达" stackId="sov" fill="#ef4444" name="易方达" />
                      <Bar dataKey="广发" stackId="sov" fill="#3b82f6" name="广发" />
                      <Bar dataKey="华夏" stackId="sov" fill="#eab308" name="华夏" />
                      <Bar dataKey="其他" stackId="sov" fill="#94a3b8" name="其他" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> 易方达</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> 广发</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> 华夏</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> 其他</span>
                </div>
              </div>

              {/* 微观层：竞品战术矩阵 */}
              <div>
                <div className="text-[11px] font-medium text-gray-700 mb-2">竞品战术矩阵 Competitor Tactics Matrix</div>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                  <table className="w-full border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                        <th className="text-left py-2 px-2 font-semibold text-slate-700 bg-slate-50/80 w-20 first:rounded-tl-lg border-r border-slate-200">机构 \ 渠道</th>
                        <th className="text-center py-2 px-2 font-semibold text-slate-700 min-w-[100px] border-r border-slate-200">蚂蚁财富</th>
                        <th className="text-center py-2 px-2 font-semibold text-slate-700 min-w-[100px] border-r border-slate-200">微信公众号</th>
                        <th className="text-center py-2 px-2 font-semibold text-slate-700 min-w-[100px] border-r border-slate-200">抖音</th>
                        <th className="text-center py-2 px-2 font-semibold text-slate-700 min-w-[100px] last:rounded-tr-lg">小红书</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: '易方达', cells: [
                          { content: '🔥 业绩榜单 (红榜)', heat: 'high' },
                          { content: '📄 深度研报 (长文)', heat: 'mid' },
                          { content: '📹 经理口播 (真人)', heat: 'high' },
                          { content: '—', heat: 'empty' },
                        ]},
                        { name: '广发', cells: [
                          { content: '📜 一图看懂 (长图)', heat: 'mid' },
                          { content: '📄 热点解读 (长文)', heat: 'mid' },
                          { content: '🎬 剧情短片 (投教)', heat: 'high' },
                          { content: '🖼️ 存钱计划 (海报)', heat: 'mid' },
                        ]},
                        { name: '华夏', cells: [
                          { content: '📜 ETF新发海报', heat: 'high' },
                          { content: '📄 红利低波战报', heat: 'mid' },
                          { content: '📹 机器人主题口播', heat: 'high' },
                          { content: '🖼️ 定投日历', heat: 'mid' },
                        ]},
                        { name: '南方', cells: [
                          { content: '📄 TMT赛道周报', heat: 'mid' },
                          { content: '📹 科技主题短视频', heat: 'high' },
                          { content: '🔴 直播路演', heat: 'high' },
                          { content: '📜 指数一图流', heat: 'mid' },
                        ]},
                        { name: '富国', cells: [
                          { content: '📄 短债稳健文案', heat: 'mid' },
                          { content: '📹 投教动画', heat: 'mid' },
                          { content: '—', heat: 'empty' },
                          { content: '🖼️ 稳健替代海报', heat: 'low' },
                        ]},
                        { name: '嘉实', cells: [
                          { content: '📜 宽基指数长图', heat: 'high' },
                          { content: '📄 基金经理观点', heat: 'mid' },
                          { content: '📹 市场解读视频', heat: 'mid' },
                          { content: '🖼️ 定投计划', heat: 'mid' },
                        ]},
                        { name: '汇添富', cells: [
                          { content: '🔥 收益榜单', heat: 'high' },
                          { content: '📄 消费主题研报', heat: 'mid' },
                          { content: '📹 经理访谈', heat: 'high' },
                          { content: '🖼️ 理财科普漫画', heat: 'mid' },
                        ]},
                        { name: '中欧', cells: [
                          { content: '📹 直播切片 (短视频)', heat: 'high' },
                          { content: '👩‍⚕️ 葛兰来信 (软文)', heat: 'mid' },
                          { content: '—', heat: 'empty' },
                          { content: '🖼️ 医疗科普 (漫画)', heat: 'mid' },
                        ]},
                        { name: '我司', isUs: true, cells: [
                          { content: '📄 市场复盘 (低流)', heat: 'low' },
                          { content: '📄 周报 (低流)', heat: 'low' },
                          { content: '📹 MG动画 (低流)', heat: 'low' },
                          { content: '—', heat: 'empty' },
                        ]},
                      ].map((row, rowIdx) => (
                        <tr key={row.name} className={`border-b border-slate-100 last:border-b-0 ${row.isUs ? 'bg-amber-50/60' : rowIdx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'} hover:bg-slate-50/60 transition-colors`}>
                          <td className="py-1.5 px-2 font-medium text-gray-800 whitespace-nowrap border-r border-slate-100">{row.isUs ? '【我司】' : row.name}</td>
                          {row.cells.map((cell, idx) => (
                            <td
                              key={idx}
                              className={`py-1.5 px-2 text-center align-top border-r border-slate-100 last:border-r-0 ${cell.heat === 'high' ? 'bg-red-50 text-red-900' : cell.heat === 'mid' ? 'bg-amber-50/80 text-amber-900' : cell.heat === 'low' ? 'bg-slate-100 text-slate-600' : 'bg-slate-50/50 text-slate-400'}`}
                            >
                              {cell.content}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-[9px] text-gray-500">
                  <span>图例：📹 视频</span>
                  <span>📜 长图</span>
                  <span>📄 文章</span>
                  <span>🔴 直播</span>
                  <span>🖼️ 海报</span>
                  <span className="ml-2">颜色深浅 = 流量热度</span>
                </div>
              </div>
            </div>

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
