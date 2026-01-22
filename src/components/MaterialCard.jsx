import React, { useState } from 'react';

const MaterialCard = ({ imagePath, source, time, material, onClick, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onClick && material) {
      onClick(material);
    }
  };

  // 根据内容类型获取标签样式
  const getTagStyle = (type) => {
    switch (type) {
      case '推文':
        return 'bg-green-100 text-green-700';
      case '长图':
        return 'bg-blue-100 text-blue-700';
      case '视频':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 如果传入了 className 且包含 w-full，则使用自适应宽度，否则使用固定宽度
  const widthClass = className.includes('w-full') ? '' : 'w-64';
  
  return (
    <div className={`flex-shrink-0 ${widthClass} group cursor-pointer ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
        onClick={handleClick}
      >
        {/* 内容类型标签 - 左上角 */}
        {material?.type && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 ${getTagStyle(material.type)} text-xs font-medium rounded-md`}>
            {material.type}
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

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
          {/* 查看详情图标 */}
          <div className="mb-16">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>

          {/* 热度数据 - 底部浮现 */}
          {material?.heat && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center text-white text-xs font-medium">
                <span className="mr-1">🔥</span>
                <span>热度 {material.heat}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部信息 - 换行显示 */}
      <div className="px-1">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {source}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {time}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
