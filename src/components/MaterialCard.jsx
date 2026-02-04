import React, { useState } from 'react';
import { MessageCircle, CreditCard, Instagram } from 'lucide-react';
import { getCompanyLogo, hasCompanyLogo } from '../utils/companyLogo';

const MaterialCard = ({ imagePath, source, time, material, onClick, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };
  
  // 获取公司logo路径
  const companyLogo = source ? getCompanyLogo(source) : null;
  const showLogo = companyLogo && !logoError && hasCompanyLogo(source);

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
          bgColor: 'bg-green-50',
        };
      case '蚂蚁财富号':
      case '支付宝':
        return {
          icon: CreditCard,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
        };
      case '小红书':
        return {
          icon: Instagram,
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          icon: MessageCircle,
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
        };
    }
  };

  // 生成标题（从 summary 提取前15个字符）
  const getTitle = () => {
    if (material?.title) return material.title;
    if (material?.summary) {
      return material.summary.length > 15
        ? material.summary.substring(0, 15) + '...'
        : material.summary;
    }
    return '';
  };

  // 获取互动数据（如果没有则使用默认值）
  const getInteraction = () => {
    return material?.interaction || '503';
  };

  const channelInfo = getChannelIcon(material?.channel || '公众号');
  const ChannelIcon = channelInfo.icon;
  const widthClass = className.includes('w-full') ? '' : 'w-64';

  return (
    <div className={`flex-shrink-0 ${widthClass} group cursor-pointer ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
        onClick={handleClick}
      >
        {/* 内容类型标签 - 左上角，半透明黑底白字 */}
        {material?.type && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
            {material.type}
          </div>
        )}

        {/* 渠道图标 - 右上角 */}
        {material?.channel && (
          <div className={`absolute top-3 right-3 z-10 w-7 h-7 ${channelInfo.color} rounded-full flex items-center justify-center shadow-md`}>
            <ChannelIcon className="w-4 h-4 text-white" />
          </div>
        )}

        {/* 图片或占位图 */}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
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
            alt={source}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}

        {/* 悬停遮罩 - 显示"查看内容逻辑"按钮 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg text-sm font-medium text-gray-900 hover:bg-white transition-all duration-200 hover:scale-105"
          >
            查看内容逻辑
          </button>
        </div>
      </div>

      {/* 底部信息区 */}
      <div className="px-1">
        {/* 标题/摘要 */}
        {getTitle() && (
          <div className="text-sm font-medium text-gray-800 truncate mb-2">
            {getTitle()}
          </div>
        )}

        {/* 厂商行 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {showLogo ? (
              <img
                src={companyLogo}
                alt={source || '基金公司'}
                className="w-5 h-5 object-contain flex-shrink-0 rounded-sm"
                onError={handleLogoError}
                style={{ maxHeight: '20px' }}
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
            )}
            <span className="text-xs font-bold text-gray-900 truncate">{source}</span>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{time}</span>
        </div>

        {/* 数据行 */}
        <div className="bg-gray-50 rounded-md px-2 py-1.5 flex items-center gap-3 text-xs text-gray-600">
          {material?.heat && (
            <span className="flex items-center gap-1">
              <span>🔥</span>
              <span>热度 {material.heat}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>👍</span>
            <span>互动 {getInteraction()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
