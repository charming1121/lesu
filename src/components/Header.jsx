import React from 'react';

const Header = ({ currentPage }) => {
  const getPageTitle = () => {
    const pageTitles = {
      monitoring: '全网监控',
      material: '素材检索',
      compliance: '合规检测',
      settings: '账号设置',
    };
    return pageTitles[currentPage] || '首页';
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-white shadow-sm z-20 flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500">首页</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">{getPageTitle()}</span>
      </div>

      {/* Right side: Date filter and User avatar */}
      <div className="flex items-center space-x-4">
        {/* Date Filter */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-blue-600 font-medium">2024-01-15</span>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-sm">
          <span className="text-white text-sm font-medium">用</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
