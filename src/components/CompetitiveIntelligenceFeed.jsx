import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getLabeledMaterials } from '../data/labeledMaterialsData';
import DeconstructedCard from './DeconstructedCard';
import MaterialModal from './MaterialModal';
import MaterialDetail from './MaterialDetail';
import Pagination from './Pagination';

/**
 * 全网竞品情报流 (Competitive Intelligence Feed)
 * 对应大纲中的"内容素材检索"
 * 海量素材的流式展示，带有"解构后的标签"
 */
const CompetitiveIntelligenceFeed = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [filterType, setFilterType] = useState('物料定位'); // 默认筛选类型
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [labeledMaterials, setLabeledMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 每页显示12个
  const feedRef = useRef(null);

  // 加载标签数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const materials = await getLabeledMaterials();
        setLabeledMaterials(materials);
      } catch (error) {
        console.error('Failed to load labeled materials:', error);
        setLabeledMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 定义所有筛选维度和选项（严格按照用户提供的分类）
  const filterOptions = {
    '发布机构': [], // 动态获取
    '发布渠道': [], // 动态获取
    '物料类型': [], // 动态获取
    '行业主题': [], // 动态获取
    '物料定位': ['全部', '产品宣传', '投资者教育', '活动营销', '热点解读', '行情分析', '投资建议'],
    '推送时机': ['全部', '日常推送', '行业估值低位', '行业政策利好', '市场热度提升', '宏观政策转向', '板块异动', '节假日营销', '经济数据发布'],
    '视觉风格': ['全部', '科技风', '喜庆国风', '简约金融风', '数据可视化风', '卡通IP风', '红色喜庆风', '金色质感风', '渐变科技风'],
    '视觉主体': ['全部', '卡通IP', '人物', '动物', '产品或物体', '自然环境', '其他'],
    '创新点': ['全部', '数据可视化', 'AI生成视觉', '互动玩法', '福利激励', '图表解析', '热点拆解'],
    '产品核心卖点': ['全部', '巨额涨幅', '历史新高', '政策催化', '估值底部', '高股息', '周期拐点', '行业利好', '配置机遇'],
    '用户人群': ['全部', '普通投资者', '高净值客群'],
  };
  
  // 获取动态筛选选项（从数据中提取）
  const dynamicFilterOptions = useMemo(() => {
    if (loading || labeledMaterials.length === 0) {
      return {
        '发布机构': [],
        '发布渠道': [],
        '物料类型': [],
        '行业主题': [],
      };
    }
    
    return {
      '发布机构': [...new Set(labeledMaterials.map(m => m.source).filter(Boolean))].sort(),
      '发布渠道': [...new Set(labeledMaterials.map(m => m.channel).filter(Boolean))].sort(),
      '物料类型': [...new Set(labeledMaterials.map(m => m.type).filter(Boolean))].sort(),
      '行业主题': [...new Set(labeledMaterials.map(m => m.industryTheme).filter(Boolean))].sort(),
    };
  }, [labeledMaterials, loading]);

  // 根据筛选条件过滤素材
  const filteredMaterials = useMemo(() => {
    if (loading || labeledMaterials.length === 0) {
      return [];
    }
    
    let filtered = [...labeledMaterials];
    
    // 根据筛选类型进行过滤
    if (activeTab !== '全部') {
      filtered = filtered.filter((material) => {
        switch (filterType) {
          case '发布机构':
            return material.source === activeTab;
          case '发布渠道':
            return material.channel === activeTab;
          case '物料类型':
            return material.type === activeTab;
          case '行业主题':
            // 行业主题可能是多个，用斜杠分隔，需要检查是否包含
            return material.industryTheme === activeTab || 
                   (material.industryTheme && material.industryTheme.includes(activeTab));
          case '物料定位':
            return material.物料定位 === activeTab;
          case '推送时机':
            return material.推送时机 === activeTab;
          case '视觉风格':
            return material.视觉风格 === activeTab;
          case '视觉主体':
            return material.视觉主体 === activeTab;
          case '创新点':
            // 如果数据中创新点为"无"，不应该匹配任何具体的筛选选项
            if (material.创新点 === '无' || !material.创新点) {
              return false;
            }
            return material.创新点 === activeTab;
          case '产品核心卖点':
            // 如果数据中产品核心卖点为"无"，不应该匹配任何具体的筛选选项
            if (material.产品核心卖点 === '无' || !material.产品核心卖点) {
              return false;
            }
            return material.产品核心卖点 === activeTab;
          case '用户人群':
            return material.用户人群 === activeTab;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [activeTab, filterType, labeledMaterials, loading]);
  
  // 获取当前筛选类型的所有选项
  const getCurrentFilterOptions = () => {
    // 如果是动态筛选选项，从数据中获取
    if (['发布机构', '发布渠道', '物料类型', '行业主题'].includes(filterType)) {
      return ['全部', ...dynamicFilterOptions[filterType]];
    }
    // 否则使用预定义的选项
    return filterOptions[filterType] || ['全部'];
  };

  // 分页计算
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMaterials.slice(startIndex, endIndex);
  }, [filteredMaterials, currentPage, itemsPerPage]);

  // 切换Tab或筛选类型时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
    setActiveTab('全部'); // 切换筛选类型时重置Tab
  }, [filterType]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleMaterialClick = (material) => {
    // 先滚动到"全网竞品情报流"区域顶部
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 延迟设置详情页，确保滚动完成
    setTimeout(() => {
      setSelectedMaterial(material);
      setShowDetail(true);
    }, 300);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedMaterial(null);
    
    // 延迟滚动，确保组件已经渲染
    setTimeout(() => {
      if (feedRef.current) {
        feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  // 如果显示详情页，直接渲染详情组件
  if (showDetail && selectedMaterial) {
    return <MaterialDetail material={selectedMaterial} onBack={handleBackToList} />;
  }

  return (
    <div ref={feedRef} className="bg-slate-50 rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题区域 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">全网竞品情报流</h2>
          <p className="text-sm text-gray-500 mt-0.5">内容素材检索 · 解构标签</p>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-lg p-4">
        {/* 筛选Tab区域 */}
        <div className="mb-4 pb-4 border-b border-gray-100 space-y-3">
          {/* 筛选类型切换 - 基础信息 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0">基础信息：</span>
            {['发布机构', '发布渠道', '物料类型', '行业主题'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* 筛选类型切换 - 策略定位 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0">策略定位：</span>
            {['物料定位', '推送时机', '用户人群'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* 筛选类型切换 - 视觉分析 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0">视觉分析：</span>
            {['视觉风格', '视觉主体', '创新点'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* 筛选类型切换 - 核心卖点 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0">核心卖点：</span>
            {['产品核心卖点'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* 当前筛选类型的选项 Tab */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium w-20 flex-shrink-0">{filterType}：</span>
            {getCurrentFilterOptions().map((option) => (
              <button
                key={option}
                onClick={() => setActiveTab(option)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeTab === option
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {/* 结果统计 */}
          <div className="text-xs text-gray-500">
            共找到 <span className="text-blue-600 font-semibold">{filteredMaterials.length}</span> 条相关素材
            {totalPages > 1 && (
              <span className="ml-2">
                · 第 <span className="text-blue-600 font-semibold">{currentPage}</span> / {totalPages} 页
              </span>
            )}
          </div>
        </div>

        {/* 素材网格 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">加载中...</div>
          </div>
        ) : paginatedMaterials.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedMaterials.map((material) => (
                <DeconstructedCard
                  key={material.id}
                  material={material}
                  onClick={handleMaterialClick}
                  activeTab={activeTab}
                />
              ))}
            </div>
            {/* 分页器 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">未找到相关素材</div>
          </div>
        )}
      </div>

      {/* 素材详情模态框 */}
      {isModalOpen && selectedMaterial && (
        <MaterialModal material={selectedMaterial} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CompetitiveIntelligenceFeed;
