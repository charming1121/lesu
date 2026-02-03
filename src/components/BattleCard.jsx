import React from 'react';

/**
 * 战役卡片 (Battle Card)
 * 展示单个新发基金的竞品投放情况
 */
const BattleCard = ({ product }) => {
  // 获取阶段徽章样式
  const getStageBadge = (stage) => {
    switch (stage) {
      case '预热期':
        return {
          label: '预热期',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
      case '募集冲刺':
        return {
          label: '募集冲刺',
          className: 'bg-red-100 text-red-700 border-red-200',
          icon: '🔥',
        };
      case '上市首日':
        return {
          label: '上市首日',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        };
      default:
        return {
          label: stage || '预热期',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const stageBadge = getStageBadge(product.stage);

  const handleCompetitorClick = (e) => {
    e.stopPropagation();
    // TODO: 跳转到竞品物料清单页面
    console.log(`查看 ${product.name} 的 ${product.competitorCount} 条竞品物料`);
  };

  return (
    <div className="flex-shrink-0 w-[320px] bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* 产品名和阶段徽章 */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900 flex-1">{product.name}</h3>
          {/* 阶段徽章 */}
          {product.stage && (
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-md border flex items-center gap-1 whitespace-nowrap ${stageBadge.className}`}
            >
              {stageBadge.icon && <span>{stageBadge.icon}</span>}
              {stageBadge.label}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{product.company}</p>
      </div>

      {/* 竞品投放数 - 可点击 */}
      <div className="mb-3 p-2 bg-blue-50 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 font-medium">📊 竞品投放数</span>
          <button
            onClick={handleCompetitorClick}
            className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors cursor-pointer"
          >
            {product.competitorCount} 条竞品物料
          </button>
        </div>
      </div>

      {/* 核心卖点词 */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1.5">核心卖点词：</div>
        <div className="flex flex-wrap gap-1.5">
          {product.sellingPoints.map((point, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
            >
              {point}
            </span>
          ))}
        </div>
      </div>

      {/* 风格标签 */}
      {product.styleTags && product.styleTags.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-gray-400 mb-1">视觉风格：</div>
          <div className="flex flex-wrap gap-1">
            {product.styleTags.map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 最新物料预览 */}
      <div>
        <div className="text-xs text-gray-500 mb-2">最新物料预览：</div>
        <div className="flex gap-2">
          {product.previewMaterials.map((material, index) => (
            <div
              key={index}
              className="flex-1 aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer"
            >
              <img
                src={material.imagePath}
                alt={material.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-gray-200">
                <svg
                  className="w-8 h-8 text-gray-400"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleCard;
