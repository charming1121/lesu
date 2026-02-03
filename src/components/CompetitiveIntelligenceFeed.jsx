import React, { useState, useMemo, useRef, useEffect } from 'react';
import { allMaterials } from '../data/materialsData';
import DeconstructedCard from './DeconstructedCard';
import MaterialModal from './MaterialModal';
import MaterialDetail from './MaterialDetail';

/**
 * 全网竞品情报流 (Competitive Intelligence Feed)
 * 对应大纲中的"内容素材检索"
 * 海量素材的流式展示，带有"解构后的标签"
 */
const CompetitiveIntelligenceFeed = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const feedRef = useRef(null);

  // 决策场景分类
  const decisionScenarios = ['全部', '持营动作', '合规风险', '高热爆款'];

  // 根据决策场景过滤素材
  const filteredMaterials = useMemo(() => {
    if (activeTab === '全部') {
      return allMaterials;
    }
    return allMaterials.filter((material) => {
      switch (activeTab) {
        case '持营动作':
          return material.decisionScenario === '持营动作';
        case '合规风险':
          return material.decisionScenario === '合规风险';
        case '高热爆款':
          return material.decisionScenario === '高热爆款';
        default:
          return true;
      }
    });
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
        {/* 决策场景 Tab */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">决策场景：</span>
            {decisionScenarios.map((scenario) => (
              <button
                key={scenario}
                onClick={() => setActiveTab(scenario)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeTab === scenario
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {scenario}
              </button>
            ))}
          </div>
          {/* 结果统计 */}
          <div className="mt-3 text-xs text-gray-500">
            共找到 <span className="text-blue-600 font-semibold">{filteredMaterials.length}</span> 条相关素材
          </div>
        </div>

        {/* 素材网格 */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMaterials.map((material) => (
              <DeconstructedCard
                key={material.id}
                material={material}
                onClick={handleMaterialClick}
                activeTab={activeTab}
              />
            ))}
          </div>
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
