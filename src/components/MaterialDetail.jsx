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
  Award,
} from 'lucide-react';
import { MessageCircle, CreditCard, Instagram } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { getCompanyLogo, hasCompanyLogo } from '../utils/companyLogo';
import { getLabeledMaterials } from '../data/labeledMaterialsData';

/**
 * 素材详情页 (Material Detail Page)
 * 支持视频、图片、文章三种类型的素材分析
 */
const MaterialDetail = ({ material, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [showOcrText, setShowOcrText] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [sameTrackRanking, setSameTrackRanking] = useState(null);
  
  // 获取公司logo路径
  const companyLogo = material?.source ? getCompanyLogo(material.source) : null;
  const showLogo = companyLogo && !logoError && hasCompanyLogo(material?.source);
  
  const handleLogoError = () => {
    setLogoError(true);
  };

  // 计算同类赛道排名
  useEffect(() => {
    const calculateSameTrackRanking = async () => {
      if (!material) return;
      
      try {
        const allMaterials = await getLabeledMaterials();
        
        // 解析格式化数值的辅助函数
        const parseFormattedNumber = (value) => {
          if (!value) return 0;
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const lower = value.toLowerCase();
            const num = parseFloat(lower.replace(/[^0-9.]/g, ''));
            if (lower.includes('w')) return num * 10000;
            if (lower.includes('k')) return num * 1000;
            return num || 0;
          }
          return 0;
        };
        
        // 辅助函数：检查两个行业主题是否相似（匹配其中几个关键词即可）
        const isSimilarIndustry = (theme1, theme2) => {
          if (!theme1 || !theme2) return false;
          if (theme1 === theme2) return true;
          
          // 将行业主题按/分割成关键词数组
          const keywords1 = theme1.split('/').map(k => k.trim()).filter(k => k);
          const keywords2 = theme2.split('/').map(k => k.trim()).filter(k => k);
          
          // 如果任一主题为空，返回false
          if (keywords1.length === 0 || keywords2.length === 0) return false;
          
          // 计算匹配的关键词数量
          const matchedKeywords = keywords1.filter(k1 => 
            keywords2.some(k2 => k2.includes(k1) || k1.includes(k2))
          );
          
          // 如果匹配的关键词数量 >= 最小匹配数（至少1个，或者原主题关键词的50%），则认为相似
          const minMatchCount = Math.max(1, Math.ceil(keywords1.length * 0.5));
          return matchedKeywords.length >= minMatchCount;
        };
        
        // 辅助函数：检查物料类型是否相似
        const isSimilarType = (type1, type2) => {
          if (!type1 || !type2) return false;
          if (type1 === type2) return true;
          
          // 对于相似的类型进行分组
          const typeGroups = {
            '图片类': ['海报', '封面图', '截屏', '长图'],
            '视频类': ['视频'],
            '文章类': ['文章', '长文']
          };
          
          // 检查是否属于同一类型组
          for (const [group, types] of Object.entries(typeGroups)) {
            if (types.includes(type1) && types.includes(type2)) {
              return true;
            }
          }
          
          return false;
        };
        
        // 筛选同类素材：相似行业主题和相似物料类型
        const sameTrackMaterials = allMaterials.filter(m => {
          const similarIndustry = isSimilarIndustry(m.industryTheme, material.industryTheme);
          const similarType = isSimilarType(m.type, material.type);
          return similarIndustry && similarType && m.id !== material.id;
        });
        
        // 如果同类素材太少，放宽条件：只按行业主题相似度筛选
        let filteredMaterials = sameTrackMaterials;
        if (sameTrackMaterials.length < 3) {
          filteredMaterials = allMaterials.filter(m => {
            const similarIndustry = isSimilarIndustry(m.industryTheme, material.industryTheme);
            return similarIndustry && m.id !== material.id;
          });
        }
        
        // 计算传播力分数（综合阅读、转发、点赞）
        const materialsWithScore = filteredMaterials.map(m => {
          const views = m.viewsRaw || parseFormattedNumber(m.views) || 0;
          const forwards = m.forwardsRaw || parseFormattedNumber(m.forwards) || 0;
          const likes = m.likesRaw || parseFormattedNumber(m.likes) || 0;
          const score = views * 0.5 + forwards * 100 * 0.3 + likes * 10 * 0.2;
          return { ...m, score };
        });
        
        // 当前素材的传播力分数
        const currentViews = material.viewsRaw || parseFormattedNumber(material.views) || 0;
        const currentForwards = material.forwardsRaw || parseFormattedNumber(material.forwards) || 0;
        const currentLikes = material.likesRaw || parseFormattedNumber(material.likes) || 0;
        const currentScore = currentViews * 0.5 + currentForwards * 100 * 0.3 + currentLikes * 10 * 0.2;
        
        // 排序并找到排名
        materialsWithScore.sort((a, b) => b.score - a.score);
        
        // 找到当前素材的排名（插入当前素材后排序）
        const allMaterialsWithCurrent = [...materialsWithScore, { ...material, score: currentScore }];
        allMaterialsWithCurrent.sort((a, b) => b.score - a.score);
        const rank = allMaterialsWithCurrent.findIndex(m => m.id === material.id) + 1;
        const total = allMaterialsWithCurrent.length;
        
        setSameTrackRanking({
          rank,
          total,
          trackName: material.industryTheme || '同类赛道',
          materialType: material.type || '同类物料',
        });
      } catch (error) {
        console.error('Failed to calculate same track ranking:', error);
      }
    };
    
    calculateSameTrackRanking();
  }, [material]);

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

              {/* 同类赛道排名 */}
              {sameTrackRanking && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <div className="text-xs text-gray-500">同类赛道排名</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold ${
                        sameTrackRanking.rank === 1 
                          ? 'text-yellow-600' 
                          : sameTrackRanking.rank <= 3 
                          ? 'text-orange-600' 
                          : 'text-gray-700'
                      }`}>
                        #{sameTrackRanking.rank}
                      </span>
                      <span className="text-xs text-gray-500">/ {sameTrackRanking.total}</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          sameTrackRanking.rank === 1 
                            ? 'bg-yellow-500' 
                            : sameTrackRanking.rank <= 3 
                            ? 'bg-orange-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${((sameTrackRanking.total - sameTrackRanking.rank + 1) / sameTrackRanking.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sameTrackRanking.trackName} · {sameTrackRanking.materialType}
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

                {material?.type && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">物料类型</div>
                    <div className="text-sm text-gray-700">{material.type}</div>
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

                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {detailData.产品核心卖点}
                  </p>
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
