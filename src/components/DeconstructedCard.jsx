import React, { useState } from 'react';
import { MessageCircle, CreditCard, Instagram } from 'lucide-react';

/**
 * 解构卡片 (Deconstructed Card)
 * 展示解构后的内容资产信息，包括智能标签和复用率
 */
const DeconstructedCard = ({ material, onClick, activeTab = '全部' }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

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
  const imagePath = `${material?.path || ''}${material?.imageId || 1}.jpg`;
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
            className={`w-full h-full object-cover transition-transform duration-200 ${
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

        {/* 智能标签栏 */}
        {(material?.sceneTag || material?.emotionTag || material?.formatTag) && (
          <div className="mb-2 space-y-1.5">
            {/* 场景标 */}
            {material?.sceneTag && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0">场景标：</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                  {material.sceneTag}
                </span>
              </div>
            )}

            {/* 情绪标 */}
            {material?.emotionTag && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0">情绪标：</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-md font-medium">
                  {material.emotionTag}
                </span>
              </div>
            )}

            {/* 形式标 */}
            {material?.formatTag && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0">形式标：</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                  {material.formatTag}
                </span>
              </div>
            )}

            {/* 色板提取 */}
            {material?.colorPalette && material.colorPalette.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0">色板提取：</span>
                <div className="flex items-center gap-1.5">
                  {material.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
            <span className="text-xs font-medium text-gray-700 truncate">{material?.source}</span>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{material?.time}</span>
        </div>
      </div>
    </div>
  );
};

export default DeconstructedCard;
