import React, { useState } from 'react';
import { MessageCircle, CreditCard, Instagram, Eye, Share2, Heart, Bookmark, MessageSquare } from 'lucide-react';
import { getCompanyLogo, hasCompanyLogo } from '../utils/companyLogo';

/**
 * 解构卡片 (Deconstructed Card)
 * 展示解构后的内容资产信息，包括智能标签和复用率
 */
const DeconstructedCard = ({ material, onClick, activeTab = '全部' }) => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };
  
  // 获取公司logo路径
  const companyLogo = material?.source ? getCompanyLogo(material.source) : null;
  const showLogo = companyLogo && !logoError && hasCompanyLogo(material?.source);

  const handleClick = () => {
    if (onClick && material) {
      onClick(material);
    }
  };

  // 获取渠道图标和颜色
  const getChannelIcon = (channel) => {
    switch (channel) {
      case '公众号':
      case '微信':
        return {
          icon: MessageCircle,
          color: 'bg-green-500',
        };
      case '蚂蚁财富号':
      case '支付宝':
        return {
          icon: CreditCard,
          color: 'bg-blue-500',
        };
      case '小红书':
        return {
          icon: Instagram,
          color: 'bg-red-500',
        };
      default:
        return {
          icon: MessageCircle,
          color: 'bg-gray-500',
        };
    }
  };

  const channelInfo = getChannelIcon(material?.channel || '公众号');
  const ChannelIcon = channelInfo.icon;
  // 优先使用 imagePath，如果没有则使用 path + imageId
  const imagePath = material?.imagePath || `${material?.path || ''}${material?.imageId || 1}.jpg`;
  const isComplianceView = activeTab === '合规风险';

  return (
    <div
      className={`bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
        isComplianceView ? 'border-red-200' : 'border-gray-200'
      }`}
      onClick={handleClick}
    >
      {/* 图片区域 */}
      <div className={`relative aspect-[3/4] bg-gray-100 overflow-hidden ${
        isComplianceView ? 'brightness-50 blur-sm' : ''
      }`}>
        {/* 类型标签 - 左上角 */}
        {material?.type && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
            {material.type}
          </div>
        )}

        {/* 渠道图标 - 右上角 */}
        {material?.channel && (
          <div className={`absolute top-2 right-2 z-10 w-6 h-6 ${channelInfo.color} rounded-full flex items-center justify-center shadow-md`}>
            <ChannelIcon className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        {/* 复用率指标 - 右下角 */}
        {material?.reuseCount !== undefined && material.reuseCount > 0 && (
          <div className="absolute bottom-2 right-2 z-10 px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-md shadow-lg">
            全网复用：{material.reuseCount}次
          </div>
        )}

        {/* 图片或占位图 */}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <img
            src={imagePath}
            alt={material?.title || material?.source}
            className={`w-full h-full transition-transform duration-200 ${
              // 长图使用 object-top 显示顶部内容，其他使用 object-cover
              material?.type === '长图' ? 'object-top object-cover' : 'object-cover'
            } ${
              isComplianceView ? '' : 'group-hover:scale-105'
            }`}
            onError={handleImageError}
          />
        )}

        {/* 合规风险警示框 - 仅在合规风险视图显示 */}
        {isComplianceView && material?.complianceRisks && material.complianceRisks.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-red-600/95 backdrop-blur-sm border-2 border-red-500 rounded-lg p-3 mx-4 shadow-xl">
              <div className="space-y-1.5">
                {material.complianceRisks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2 text-white text-xs font-medium">
                    <span className="text-red-200">⚠️</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 解构信息区域 */}
      <div className="p-3">
        {/* 标题 */}
        {material?.title && (
          <div className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {material.title}
          </div>
        )}

        {/* 核心标签展示 - 精简版 */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {/* 平台标签 - 固定显示 */}
          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-md font-medium">
            蚂蚁财富
          </span>

          {/* 物料定位 - 核心标签 */}
          {material?.物料定位 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
              {material.物料定位}
            </span>
          )}

          {/* 产品核心卖点 - 核心标签（排除"无"） */}
          {material?.产品核心卖点 && material.产品核心卖点 !== '无' && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-medium">
              {material.产品核心卖点}
            </span>
          )}

          {/* 行业主题 - 核心标签 */}
          {material?.industryTheme && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
              {material.industryTheme}
            </span>
          )}
        </div>

        {/* 曝光指标 */}
        {(material?.views || material?.forwards || material?.likes) && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2.5 text-xs text-gray-600 flex-wrap">
              {material.views && (
                <div className="flex items-center gap-1" title="阅读量">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-medium text-gray-700">{material.views}</span>
                </div>
              )}
              {material.forwards && (
                <div className="flex items-center gap-1" title="转发量">
                  <Share2 className="w-3.5 h-3.5 text-green-500" />
                  <span className="font-medium text-gray-700">{material.forwards}</span>
                </div>
              )}
              {material.likes && (
                <div className="flex items-center gap-1" title="点赞数">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="font-medium text-gray-700">{material.likes}</span>
                </div>
              )}
              {material.collects && (
                <div className="flex items-center gap-1" title="收藏数">
                  <Bookmark className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-700">{material.collects}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {showLogo ? (
              <img
                src={companyLogo}
                alt={material?.source || '基金公司'}
                className="w-4 h-4 object-contain flex-shrink-0 rounded-sm"
                onError={handleLogoError}
                style={{ maxHeight: '16px' }}
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
            )}
            <span className="text-xs font-medium text-gray-700 truncate">{material?.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeconstructedCard;
