import React, { useState, useEffect, useMemo } from 'react';
import { Search, SearchX } from 'lucide-react';
import MaterialCard from './MaterialCard';
import MaterialModal from './MaterialModal';
import Pagination from './Pagination';
import AssetCardSkeleton from './AssetCardSkeleton';
import { allMaterials } from '../data/materialsData';

const MaterialSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    platform: '全部',
    contentType: '全部',
    theme: '全部',
  });

  // 筛选选项
  const filterOptions = {
    platform: ['全部', '微信公众号', '蚂蚁财富号', '天天基金', '小红书'],
    contentType: ['全部', '推文', '长图', '短视频', '直播'],
    theme: ['全部', 'ETF新发', '宽基/指数', '行业/赛道', '红利低波', '业绩/榜单', '定投/投教'],
  };

  // 内容形式映射（筛选选项 -> 数据中的type字段）
  const contentTypeMap = {
    '推文': '推文',
    '长图': '长图',
    '短视频': '视频', // 数据中type是"视频"，但筛选选项是"短视频"
    '直播': '直播',
  };

  // 过滤和搜索逻辑
  const filteredResults = useMemo(() => {
    let results = [...allMaterials];

    // 关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      results = results.filter((item) => {
        return (
          item.source.toLowerCase().includes(keyword) ||
          item.summary.toLowerCase().includes(keyword) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          item.category.toLowerCase().includes(keyword)
        );
      });
    }

    // 平台筛选
    if (filters.platform !== '全部') {
      results = results.filter((item) => {
        if (filters.platform === '微信公众号') {
          return item.channel === '公众号';
        }
        // 其他平台暂时匹配channel字段
        return item.channel && item.channel.includes(filters.platform);
      });
    }

    // 内容形式筛选
    if (filters.contentType !== '全部') {
      const mappedType = contentTypeMap[filters.contentType] || filters.contentType;
      results = results.filter((item) => item.type === mappedType);
    }

    // 营销主题筛选
    if (filters.theme !== '全部') {
      results = results.filter((item) => item.category === filters.theme);
    }

    return results;
  }, [searchKeyword, filters]);

  const itemsPerPage = 12;
  const totalResults = filteredResults.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);
  const hasResults = totalResults > 0;

  // 模拟加载过程
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 模拟300ms的加载时间
    return () => clearTimeout(timer);
  }, [searchKeyword, filters, currentPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // 重置到第一页
  };

  const handleSearch = () => {
    setCurrentPage(1); // 重置到第一页
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setFilters({
      platform: '全部',
      contentType: '全部',
      theme: '全部',
    });
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 滚动到筛选区域顶部
      const filterArea = document.querySelector('[data-filter-area]');
      if (filterArea) {
        filterArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full">
      {/* 顶部筛选控制区 */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10" data-filter-area>
        <div className="p-6 space-y-6">
          {/* 核心搜索栏 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入关键词，如：红利 ETF、定投、易方达..."
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              搜索
            </button>
          </div>

          {/* 多维筛选区 */}
          <div className="space-y-4">
            {/* 发布平台 */}
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 font-medium pt-2 min-w-[80px]">
                发布平台：
              </div>
              <div className="flex flex-wrap gap-3 flex-1">
                {filterOptions.platform.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('platform', option)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${
                        filters.platform === option
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 内容形式 */}
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 font-medium pt-2 min-w-[80px]">
                内容形式：
              </div>
              <div className="flex flex-wrap gap-3 flex-1">
                {filterOptions.contentType.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('contentType', option)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${
                        filters.contentType === option
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 营销主题 */}
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 font-medium pt-2 min-w-[80px]">
                营销主题：
              </div>
              <div className="flex flex-wrap gap-3 flex-1">
                {filterOptions.theme.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('theme', option)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${
                        filters.theme === option
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 结果统计栏 */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              共找到 <span className="text-blue-600 font-semibold">{totalResults.toLocaleString()}</span> 条相关素材
            </p>
          </div>
        )}

        {/* 加载状态 - 骨架屏 */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <AssetCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <SearchX className="w-24 h-24 text-gray-300" />
            </div>
            <p className="text-lg text-gray-600 mb-2">未找到相关素材，换个关键词试试？</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              清空所有筛选
            </button>
          </div>
        )}

        {/* 有结果 - 网格布局 */}
        {!isLoading && hasResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentResults.map((item) => {
                const material = {
                  ...item,
                  imagePath: `${item.path}${item.imageId}.jpg`,
                };
                return (
                  <MaterialCard
                    key={item.id}
                    imagePath={material.imagePath}
                    source={item.source}
                    time={item.time}
                    material={material}
                    onClick={handleMaterialClick}
                    className="w-full"
                  />
                );
              })}
            </div>

            {/* 分页器 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* 模态框 */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        material={selectedMaterial}
      />
    </div>
  );
};

export default MaterialSearch;
