import React from 'react';

const Header = ({ currentPage }) => {
  const getPageTitle = () => {
    if (currentPage === 'multidim') return '多维数据看板';
    if (currentPage === 'content-center-insight') return '内容中心洞察';
    if (currentPage === 'operations-insight') return '运营洞察';
    return '首页';
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-white shadow-sm z-20 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500">首页</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">{getPageTitle()}</span>
      </div>
    </header>
  );
};

export default Header;
