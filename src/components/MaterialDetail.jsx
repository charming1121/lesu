import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Play,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MessageCircle, CreditCard, Instagram } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis } from 'recharts';

/**
 * 素材详情页 (Material Detail Page)
 * 支持视频、图片、文章三种类型的素材分析
 */
const MaterialDetail = ({ material, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [showVersionDiff, setShowVersionDiff] = useState(false);

  // 页面加载时不需要滚动，因为已经在打开详情页前滚动到正确位置了

  // 模拟详情数据（根据素材类型动态生成）
  const getDetailData = () => {
    if (!material) return null;

    const baseData = {
      id: material.id,
      title: material.title || material.summary?.substring(0, 30) || '素材标题',
      source: material.source,
      channel: material.channel,
      time: material.time,
      imagePath: `${material.path}${material.imageId}.jpg`,
      heat: material.heat,
      interaction: material.interaction,
    };

    // 根据类型生成不同的详情数据
    if (material.type === '视频') {
      return {
        ...baseData,
        type: 'video',
        script: `[00:00-00:15] 大家好，欢迎来到易方达基金的直播间。今天我们要聊的是红利低波ETF的投资策略。

[00:15-00:30] 在当前市场环境下，高股息、低波动的资产配置越来越受到投资者关注。我们的红利低波ETF聚焦于那些具有稳定分红能力的优质企业。

[00:30-00:45] 从历史数据来看，这类策略在震荡市中表现相对稳健，能够为投资者提供相对稳定的收益来源。

[00:45-01:00] 当然，投资有风险，我们也要提醒大家，过往业绩不代表未来表现，请理性投资。`,
        compliance: [
          { level: 'yellow', text: '提及历史业绩但未明确标注时间区间' },
          { level: 'green', text: '已包含风险提示' },
        ],
        analysis: '该视频通过"震荡市"、"稳健"等关键词触发了用户的防御性投资需求。视觉上使用数据图表增强了可信度，符合当前市场情绪。',
        relatedFund: {
          name: '易方达中证红利低波动ETF',
          code: '515450',
          performance: '+5.2%',
          trend: 'up',
          navChange: -4.2, // 净值变化百分比
          navRisk: 'high', // 风险等级
        },
        sentiment: ['稳健', '防御', '高股息', '长期配置', '低波动'],
        // 新增字段
        lifecycle: {
          stage: 'growth', // launch, growth, maturity, decline
          stageLabel: '增长期',
          progress: 35, // 0-100
          lifecycleData: [
            { day: 0, value: 10 },
            { day: 1, value: 25 },
            { day: 2, value: 45 },
            { day: 3, value: 65 },
            { day: 4, value: 75 },
            { day: 5, value: 80 },
            { day: 6, value: 75 },
            { day: 7, value: 70 },
          ],
        },
        structuredTags: {
          timing: ['市场反弹', '政策支持', '季度末'],
          innovation: ['数据可视化', 'MG动画', '交互式图表'],
          positioning: ['投资者教育', '产品推广', '品牌建设'],
        },
        marketingHook: '通过"震荡市"场景设定，触发用户的防御性投资需求，结合数据可视化增强可信度。',
        stats: {
          views: '12.5w',
          likes: '3.2k',
          reprintCount: 5,
          platformDistribution: [
            { platform: '微信', count: 3 },
            { platform: '支付宝', count: 2 },
          ],
        },
        versionHistory: {
          hasChanges: true,
          lastEdit: '2天前',
          changes: [
            { date: '2天前', change: '修改了"稳定收益"表述为"相对稳定收益"' },
            { date: '5天前', change: '添加了风险提示段落' },
          ],
        },
      };
    } else if (material.type === '长图') {
      return {
        ...baseData,
        type: 'image',
        ocrText: `易方达中证A500指数ETF

核心资产新选择

中证A500指数覆盖A股核心资产，精选500只优质股票，具有以下特点：

1. 行业分布均衡
   覆盖31个申万一级行业，避免单一行业风险

2. 市值分布合理
   大中小盘均衡配置，捕捉不同市场风格

3. 流动性优异
   成分股日均成交额超过10亿元

投资建议：适合长期配置，建议采用定投策略。`,
        compliance: [
          { level: 'red', text: '使用"核心资产"等绝对化表述' },
          { level: 'yellow', text: '未明确标注"投资有风险"字样' },
        ],
        analysis: '长图通过数据可视化（行业分布、市值分布）增强了说服力。使用"核心资产"等词汇容易引起用户共鸣，但存在合规风险。',
        relatedFund: {
          name: '易方达中证A500ETF',
          code: '515500',
          performance: '+3.8%',
          trend: 'up',
          navChange: -2.1,
          navRisk: 'medium',
        },
        sentiment: ['核心资产', '均衡配置', '长期投资', '定投'],
        lifecycle: {
          stage: 'maturity',
          stageLabel: '成熟期',
          progress: 65,
          lifecycleData: [
            { day: 0, value: 5 },
            { day: 1, value: 15 },
            { day: 2, value: 30 },
            { day: 3, value: 50 },
            { day: 4, value: 70 },
            { day: 5, value: 75 },
            { day: 6, value: 72 },
            { day: 7, value: 68 },
          ],
        },
        structuredTags: {
          timing: ['新发期', '市场回暖'],
          innovation: ['信息图表', '数据可视化'],
          positioning: ['产品推广', '品牌曝光'],
        },
        marketingHook: '通过"核心资产"定位和详细的数据可视化，建立产品权威性，吸引追求稳健配置的投资者。',
        stats: {
          views: '8.3w',
          likes: '1.8k',
          reprintCount: 3,
          platformDistribution: [
            { platform: '微信', count: 2 },
            { platform: '支付宝', count: 1 },
          ],
        },
        versionHistory: {
          hasChanges: false,
          lastEdit: null,
          changes: [],
        },
      };
    } else {
      return {
        ...baseData,
        type: 'article',
        content: `# 震荡市如何配置红利低波ETF

本周红利指数回调，易方达推出红利低波ETF，聚焦高分红优质企业，适合稳健型投资者长期配置。

## 为什么选择红利策略？

在当前市场环境下，高股息、低波动的资产配置越来越受到投资者关注。我们的红利低波ETF聚焦于那些具有稳定分红能力的优质企业。

从历史数据来看，这类策略在震荡市中表现相对稳健，能够为投资者提供相对稳定的收益来源。

## 投资建议

建议采用定投策略，分批建仓，降低市场波动风险。同时要注意，投资有风险，过往业绩不代表未来表现。`,
        compliance: [
          { level: 'red', text: '使用"保证收益"暗示性表述' },
          { level: 'red', text: '收益率引用未备注时间区间' },
          { level: 'yellow', text: '风险提示位置不够醒目' },
        ],
        analysis: '文章通过"震荡市"、"稳健"等关键词触发了用户的防御性投资需求。结构清晰，但存在多处合规风险点。',
        relatedFund: {
          name: '易方达中证红利低波动ETF',
          code: '515450',
          performance: '+5.2%',
          trend: 'up',
          navChange: -4.2,
          navRisk: 'high',
        },
        sentiment: ['稳健', '防御', '高股息', '长期配置'],
        lifecycle: {
          stage: 'decline',
          stageLabel: '衰退期',
          progress: 85,
          lifecycleData: [
            { day: 0, value: 20 },
            { day: 1, value: 40 },
            { day: 2, value: 60 },
            { day: 3, value: 75 },
            { day: 4, value: 80 },
            { day: 5, value: 70 },
            { day: 6, value: 55 },
            { day: 7, value: 45 },
          ],
        },
        structuredTags: {
          timing: ['市场回调', '政策调整'],
          innovation: ['文字推文', '结构化内容'],
          positioning: ['投资者教育', '策略解读'],
        },
        marketingHook: '通过"震荡市"场景设定和"稳健"关键词，精准触达防御性投资需求，但合规风险较高。',
        stats: {
          views: '5.6w',
          likes: '892',
          reprintCount: 2,
          platformDistribution: [
            { platform: '微信', count: 2 },
          ],
        },
        versionHistory: {
          hasChanges: true,
          lastEdit: '1天前',
          changes: [
            { date: '1天前', change: '删除了"保证收益"表述' },
            { date: '3天前', change: '添加了风险提示' },
          ],
        },
      };
    }
  };

  const detailData = getDetailData();
  if (!detailData) return null;

  // 获取渠道图标
  const getChannelIcon = (channel) => {
    switch (channel) {
      case '公众号':
      case '微信':
        return { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' };
      case '蚂蚁财富号':
      case '支付宝':
        return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' };
      case '小红书':
        return { icon: Instagram, color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { icon: MessageCircle, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const channelInfo = getChannelIcon(detailData.channel);
  const ChannelIcon = channelInfo.icon;

  // 复制链接
  const handleCopyLink = () => {
    const link = `${window.location.origin}/material/${detailData.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 复制文本
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 渲染左侧内容
  const renderLeftContent = () => {
    if (detailData.type === 'video') {
      return (
        <div className="space-y-6">
          {/* 视频播放器 */}
          <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-white text-center">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-sm opacity-60">视频播放器占位</p>
              <p className="text-xs opacity-40 mt-1">{detailData.imagePath}</p>
            </div>
          </div>

          {/* AI 脚本提取 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI 脚本提取</h3>
              <button
                onClick={() => handleCopyText(detailData.script)}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                复制全文
              </button>
            </div>
            <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {detailData.script}
              </pre>
            </div>
          </div>
        </div>
      );
    } else if (detailData.type === 'image') {
      return (
        <div className="space-y-6">
          {/* 图片查看器 */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={detailData.imagePath}
              alt={detailData.title}
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = e.target.nextElementSibling;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-96 items-center justify-center bg-gray-200">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          </div>

          {/* OCR 文本提取 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">OCR 文本提取</h3>
              <button
                onClick={() => handleCopyText(detailData.ocrText)}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                复制全文
              </button>
            </div>
            <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {detailData.ocrText}
              </pre>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          {/* 文章阅读器 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: detailData.content
                  .split('\n')
                  .map((line) => {
                    // 标记合规风险词
                    const riskWords = ['保证收益', '稳定收益', '核心资产'];
                    let processedLine = line;
                    riskWords.forEach((word) => {
                      if (processedLine.includes(word)) {
                        processedLine = processedLine.replace(
                          new RegExp(word, 'g'),
                          `<span class="bg-red-100 text-red-700 px-1 rounded underline decoration-red-500">${word}</span>`
                        );
                      }
                    });
                    return processedLine;
                  })
                  .map((line) => {
                    // 处理 Markdown 标题
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-2xl font-bold text-gray-900 mb-4">${line.substring(2)}</h1>`;
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-xl font-semibold text-gray-900 mb-3 mt-6">${line.substring(3)}</h2>`;
                    }
                    if (line.trim() === '') {
                      return '<br />';
                    }
                    return `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`;
                  })
                  .join(''),
              }}
            />
          </div>
        </div>
      );
    }
  };

  // 获取合规状态
  const getComplianceStatus = () => {
    const redCount = detailData.compliance.filter((c) => c.level === 'red').length;
    const yellowCount = detailData.compliance.filter((c) => c.level === 'yellow').length;

    if (redCount > 0) return { status: 'red', label: '高风险', icon: XCircle };
    if (yellowCount > 0) return { status: 'yellow', label: '需注意', icon: AlertCircle };
    return { status: 'green', label: '合规', icon: CheckCircle2 };
  };

  const complianceStatus = getComplianceStatus();
  const StatusIcon = complianceStatus.icon;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header - Sticky Top */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Left: Back Button */}
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Center: Title & Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate mb-1">
                {detailData.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <span className="font-medium">{detailData.source}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${channelInfo.bg}`}>
                  <ChannelIcon className={`w-4 h-4 ${channelInfo.color}`} />
                  <span className={channelInfo.color}>{detailData.channel}</span>
                </div>
                <span>{detailData.time}</span>
                {detailData.stats.reprintCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">转载 {detailData.stats.reprintCount} 次</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                下载源文件
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                {copied ? '已复制' : '复制链接'}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI 生成相似
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Two Columns */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6">
          {/* Left Column - Content Consumption */}
          <div className="space-y-6">
            {renderLeftContent()}

            {/* Version Diff Viewer */}
            {detailData.versionHistory.hasChanges && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => setShowVersionDiff(!showVersionDiff)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span>版本差异对比</span>
                    <span className="text-xs text-gray-500">({detailData.versionHistory.changes.length} 次修改)</span>
                  </div>
                  {showVersionDiff ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showVersionDiff && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                    {detailData.versionHistory.changes.map((change, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-md p-3">
                        <div className="text-xs text-gray-500 mb-1">{change.date}</div>
                        <div className="text-sm text-gray-700">{change.change}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Intelligence Analysis */}
          <div className="space-y-4">
            {/* Card 1: Status & Lifecycle */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">传播生命周期</h3>
                <span
                  className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                    detailData.lifecycle.stage === 'growth'
                      ? 'bg-green-100 text-green-700'
                      : detailData.lifecycle.stage === 'maturity'
                      ? 'bg-blue-100 text-blue-700'
                      : detailData.lifecycle.stage === 'decline'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {detailData.lifecycle.stageLabel}
                </span>
              </div>
              
              {/* Lifecycle Chart */}
              <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={detailData.lifecycle.lifecycleData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="lifecycleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#lifecycleGradient)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">浏览量</div>
                  <div className="text-sm font-semibold text-gray-900">{detailData.stats.views}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">点赞数</div>
                  <div className="text-sm font-semibold text-gray-900">{detailData.stats.likes}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">转载数</div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {detailData.stats.reprintCount}
                  </div>
                </div>
              </div>

              {/* Platform Distribution */}
              {detailData.stats.platformDistribution.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">平台分布</div>
                  <div className="flex flex-wrap gap-2">
                    {detailData.stats.platformDistribution.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded text-xs">
                        {item.platform} {item.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Structured Analysis */}
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">结构化分析</h3>
              </div>

              {/* Structured Tags */}
              <div className="space-y-3 mb-4">
                {detailData.structuredTags.timing && detailData.structuredTags.timing.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      时机维度
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detailData.structuredTags.timing.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {detailData.structuredTags.innovation && detailData.structuredTags.innovation.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      创新维度
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detailData.structuredTags.innovation.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {detailData.structuredTags.positioning && detailData.structuredTags.positioning.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      定位维度
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detailData.structuredTags.positioning.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Marketing Hook */}
              <div className="pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1.5">营销钩子</div>
                <p className="text-sm text-gray-700 leading-relaxed">{detailData.marketingHook}</p>
              </div>
            </div>

            {/* Card 3: 360° Risk Monitor */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <StatusIcon
                  className={`w-5 h-5 ${
                    complianceStatus.status === 'red'
                      ? 'text-red-600'
                      : complianceStatus.status === 'yellow'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                />
                <h3 className="font-semibold text-gray-900">360° 风险监控</h3>
                <span
                  className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                    complianceStatus.status === 'red'
                      ? 'bg-red-100 text-red-700'
                      : complianceStatus.status === 'yellow'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {complianceStatus.label}
                </span>
              </div>

              <div className="space-y-3">
                {/* Compliance Check */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">合规检测</div>
                  <div className="space-y-1.5">
                    {detailData.compliance.map((risk, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-xs ${
                          risk.level === 'red'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : risk.level === 'yellow'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}
                      >
                        {risk.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Risk */}
                {detailData.relatedFund.navChange && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">资产波动风险</div>
                    <div
                      className={`p-2 rounded text-xs border ${
                        detailData.relatedFund.navRisk === 'high'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : detailData.relatedFund.navRisk === 'medium'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {detailData.relatedFund.navChange < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        <span>
                          关联ETF ({detailData.relatedFund.code}) 本周净值{' '}
                          {detailData.relatedFund.navChange > 0 ? '上涨' : '下跌'}{' '}
                          {Math.abs(detailData.relatedFund.navChange)}% -{' '}
                          {detailData.relatedFund.navRisk === 'high'
                            ? '高风险'
                            : detailData.relatedFund.navRisk === 'medium'
                            ? '中等风险'
                            : '低风险'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Version History */}
                {detailData.versionHistory.hasChanges && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      版本历史
                    </div>
                    <div className="p-2 rounded text-xs bg-gray-50 text-gray-700 border border-gray-200">
                      <div className="font-medium mb-1">最后编辑：{detailData.versionHistory.lastEdit}</div>
                      <div className="space-y-1">
                        {detailData.versionHistory.changes.map((change, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-gray-500">{change.date}:</span> {change.change}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Related Fund */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">关联基金</h3>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{detailData.relatedFund.name}</div>
                <div className="text-sm text-gray-500">代码：{detailData.relatedFund.code}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">近一月收益：</span>
                  <span
                    className={`text-sm font-semibold ${
                      detailData.relatedFund.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {detailData.relatedFund.performance}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 5: User Sentiment */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">用户情感</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {detailData.sentiment.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
