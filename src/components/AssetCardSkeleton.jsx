import React from 'react';

const AssetCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* 图片骨架 */}
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-[12px] mb-3"></div>
      
      {/* 文字骨架 */}
      <div className="px-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default AssetCardSkeleton;
