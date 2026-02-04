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
import { getCompanyLogo, hasCompanyLogo } from '../utils/companyLogo';

/**
 * 素材详情页 (Material Detail Page)
 * 支持视频、图片、文章三种类型的素材分析
 */
const MaterialDetail = ({ material, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [showOcrText, setShowOcrText] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // 获取公司logo路径
  const companyLogo = material?.source ? getCompanyLogo(material.source) : null;
  const showLogo = companyLogo && !logoError && hasCompanyLogo(material?.source);
  
  const handleLogoError = () => {
    setLogoError(true);
  };

  // 页面加载时不需要滚动，因为已经在打开详情页前滚动到正确位置了

  // 根据实际素材数据生成详情数据 - 使用实际标签数据
  const getDetailData = () => {
    if (!material) return null;

    // 根据物料类型确定显示类型
    let displayType = 'image';
    if (material.type === '视频') {
      displayType = 'video';
    } else if (material.type === '长图') {
      displayType = 'longImage';
    } else if (material.type === '海报' || material.type === '封面图' || material.type === '截屏') {
      displayType = 'image';
    } else {
      displayType = 'article';
    }

    // 构建基础数据对象
    const baseData = {
      id: material.id,
      // 基础信息
      title: material.title || '素材标题',
      source: material.source,
      channel: material.channel,
      time: material.time,
      imagePath: material.imagePath || material.path,
      type: material.type, // 物料类型：海报、长图、截屏、封面图等
      relatedProduct: material.relatedProduct,
      industryTheme: material.industryTheme,
      // 策略定位
      物料定位: material.物料定位,
      推送时机: material.推送时机,
      用户人群: material.用户人群,
      // 视觉分析
      视觉风格: material.视觉风格,
      视觉主体: material.视觉主体,
      创新点: material.创新点,
      // 核心卖点
      产品核心卖点: material.产品核心卖点,
      // 合规风险
      complianceRisks: material.complianceRisks || [],
      // 统计数据
      stats: {
        views: material.heat || '0',
        likes: material.interaction || '0',
        reprintCount: material.reuseCount || 0,
        platformDistribution: material.channel ? [{ platform: material.channel, count: 1 }] : [],
      },
    };

    return {
      ...baseData,
      type: displayType, // 使用计算出的显示类型
      // OCR文本（用于图片类型）
      ocrText: material.title || '内容',
      // 合规检测
      compliance: material.complianceRisks && material.complianceRisks.length > 0
        ? material.complianceRisks.map(risk => ({ level: 'red', text: risk }))
        : [{ level: 'green', text: '未检测到合规风险' }],
    };
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
    } else if (detailData.type === 'longImage') {
      // 长图独特的阅读样式：全屏滚动体验
      return (
        <div className="space-y-6">
          {/* 长图全屏阅读器 */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
            {/* 阅读器头部提示 */}
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">长图阅读模式 · 滚动查看完整内容</span>
            </div>
            
            {/* 长图容器 - 垂直滚动 */}
            <div className="max-h-[80vh] overflow-y-auto scroll-smooth">
              <div className="flex flex-col items-center p-4 space-y-4">
                {/* 长图图片 - 显示顶部内容 */}
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm overflow-hidden">
                  <img
                    src={detailData.imagePath}
                    alt={detailData.title}
                    className="w-full h-auto object-top object-contain"
                    style={{ imageRendering: 'high-quality' }}
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
                
                {/* 阅读进度指示器 */}
                <div className="sticky bottom-4 w-full max-w-2xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-md">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>滚动查看完整内容</span>
                    <span className="flex items-center gap-1">
                      <ChevronDown className="w-3 h-3 animate-bounce" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OCR 文本提取 - 可折叠 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowOcrText(!showOcrText)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">OCR 文本提取</h3>
              </div>
              {showOcrText ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showOcrText && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-end mb-3">
                  <button
                    onClick={() => handleCopyText(detailData.ocrText)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
            )}
          </div>
        </div>
      );
    } else if (detailData.type === 'image') {
      // 普通图片查看器（海报、封面图、截屏等）
      return (
        <div className="space-y-6">
          {/* 图片查看器 */}
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center min-h-[400px]">
            {detailData.imagePath ? (
              <img
                src={detailData.imagePath}
                alt={detailData.title || '图片'}
                className="w-full h-auto object-contain max-h-[70vh]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement?.querySelector('.image-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden image-placeholder w-full h-96 items-center justify-center bg-gray-200">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">图片加载失败</p>
              </div>
            </div>
          </div>

          {/* OCR 文本提取 */}
          {detailData.ocrText && (
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
          )}
        </div>
      );
    } else if (detailData.type === 'article') {
      // 文章类型
      return (
        <div className="space-y-6">
          {/* 文章阅读器 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="prose prose-sm max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{detailData.title}</h1>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {detailData.ocrText || detailData.title}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // 默认显示图片
      return (
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg flex items-center justify-center min-h-[400px]">
            {detailData.imagePath ? (
              <img
                src={detailData.imagePath}
                alt={detailData.title || '图片'}
                className="w-full h-auto object-contain max-h-[70vh]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement?.querySelector('.image-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden image-placeholder w-full h-96 items-center justify-center bg-gray-200">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">图片加载失败</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  // 获取合规状态
  const getComplianceStatus = () => {
    if (!detailData.compliance || detailData.compliance.length === 0) {
      return { status: 'green', label: '合规', icon: CheckCircle2 };
    }
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
                  {showLogo ? (
                    <img
                      src={companyLogo}
                      alt={detailData.source || '基金公司'}
                      className="w-6 h-6 object-contain rounded-full bg-white p-0.5"
                      onError={handleLogoError}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  )}
                  <span className="font-medium">{detailData.source}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${channelInfo.bg}`}>
                  <ChannelIcon className={`w-4 h-4 ${channelInfo.color}`} />
                  <span className={channelInfo.color}>{detailData.channel}</span>
                </div>
                <span>{detailData.time || '未知'}</span>
                {detailData.stats && detailData.stats.reprintCount > 0 && (
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

          </div>

          {/* Right Column - Intelligence Analysis */}
          <div className="space-y-4">
            {/* Card 1: 传播数据 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">传播数据</h3>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">浏览量</div>
                  <div className="text-sm font-semibold text-gray-900">{detailData.stats?.views || '0'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">点赞数</div>
                  <div className="text-sm font-semibold text-gray-900">{detailData.stats?.likes || '0'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">转载数</div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {detailData.stats?.reprintCount || 0}
                  </div>
                </div>
              </div>

              {/* Platform Distribution */}
              {detailData.stats?.platformDistribution && detailData.stats.platformDistribution.length > 0 && (
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

            {/* Card 2: 基础信息 */}
            <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">基础信息</h3>
              </div>

              <div className="space-y-2.5">
                {detailData.title && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">标题</div>
                    <div className="text-sm font-medium text-gray-900">{detailData.title}</div>
                  </div>
                )}
                
                {detailData.source && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">发布机构</div>
                    <div className="flex items-center gap-2">
                      {showLogo ? (
                        <img
                          src={companyLogo}
                          alt={detailData.source || '基金公司'}
                          className="w-5 h-5 object-contain rounded-sm"
                          onError={handleLogoError}
                          style={{ maxHeight: '20px' }}
                        />
                      ) : null}
                      <div className="text-sm text-gray-700">{detailData.source}</div>
                    </div>
                  </div>
                )}

                {detailData.channel && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">发布渠道</div>
                    <div className="text-sm text-gray-700">{detailData.channel}</div>
                  </div>
                )}

                {detailData.time && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">发布时间</div>
                    <div className="text-sm text-gray-700">{detailData.time}</div>
                  </div>
                )}

                {detailData.type && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">物料类型</div>
                    <div className="text-sm text-gray-700">{detailData.type}</div>
                  </div>
                )}

                {detailData.relatedProduct && detailData.relatedProduct !== '无' && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">关联产品</div>
                    <div className="text-sm text-gray-700 break-words">{detailData.relatedProduct}</div>
                  </div>
                )}

                {detailData.industryTheme && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">行业主题</div>
                    <div className="text-sm text-gray-700">{detailData.industryTheme}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: 策略定位 */}
            <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">策略定位</h3>
              </div>

              <div className="space-y-2.5">
                {detailData.物料定位 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">物料定位</div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                      {detailData.物料定位}
                    </span>
                  </div>
                )}

                {detailData.推送时机 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">推送时机</div>
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                      {detailData.推送时机}
                    </span>
                  </div>
                )}

                {detailData.用户人群 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">用户人群</div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                      {detailData.用户人群}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: 视觉分析 */}
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">视觉分析</h3>
              </div>

              <div className="space-y-2.5">
                {detailData.视觉风格 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">视觉风格</div>
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                      {detailData.视觉风格}
                    </span>
                  </div>
                )}

                {detailData.视觉主体 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">视觉主体</div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      {detailData.视觉主体}
                    </span>
                  </div>
                )}

                {detailData.创新点 && detailData.创新点 !== '无' && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">创新点</div>
                    <span className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-md text-xs font-medium">
                      {detailData.创新点}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 5: 核心卖点 */}
            {detailData.产品核心卖点 && detailData.产品核心卖点 !== '无' && (
              <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">核心卖点</h3>
                </div>

                <div>
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                    {detailData.产品核心卖点}
                  </span>
                </div>
              </div>
            )}

            {/* Card 6: 360° Risk Monitor */}
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
                    {detailData.compliance && detailData.compliance.length > 0 ? (
                      detailData.compliance.map((risk, idx) => (
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
                      ))
                    ) : (
                      <div className="p-2 rounded text-xs bg-gray-50 text-gray-600 border border-gray-200">
                        暂无合规检测数据
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
