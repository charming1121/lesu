import React from 'react';

const MaterialModal = ({ isOpen, onClose, material }) => {
  if (!isOpen || !material) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    // 模拟下载功能
    const link = document.createElement('a');
    link.href = material.imagePath;
    link.download = `${material.source}_${material.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* 半透明模糊遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* 模态框内容 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 左侧：大图 */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 md:p-6 overflow-hidden min-h-[300px] md:min-h-0">
          <div className="relative w-full h-full max-h-[60vh] md:max-h-[90vh] flex items-center justify-center">
            <img
              src={material.imagePath}
              alt={material.source}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = e.target.nextElementSibling;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-full h-full items-center justify-center bg-gray-200 rounded-lg">
              <svg
                className="w-24 h-24 text-gray-400"
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
        </div>

        {/* 右侧：情报分析面板 */}
        <div className="w-full md:w-96 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">情报分析</h2>

          {/* 来源渠道 */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">来源渠道</div>
                <div className="text-base font-medium text-gray-900">
                  {material.channel || '公众号'}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1 ml-11">
              {material.source} · {material.time}
            </div>
          </div>

          {/* 营销标签 */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">营销标签</div>
            <div className="flex flex-wrap gap-2">
              {material.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 文案摘要 */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">文案摘要</div>
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {material.summary || '暂无摘要信息'}
            </div>
          </div>

          {/* 一键下载按钮 */}
          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            一键下载
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
