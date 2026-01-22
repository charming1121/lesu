import React, { useState, useMemo } from 'react';
import { allMaterials } from '../data/materialsData';
import MaterialCard from './MaterialCard';
import MaterialModal from './MaterialModal';

const LatestMaterials = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab选项（与素材检索页面一致）
  const tabs = [
    '全部',
    'ETF新发',
    '宽基/指数',
    '行业/赛道',
    '红利低波',
    '业绩/榜单',
    '定投/投教',
  ];

  // 根据activeTab过滤素材
  const filteredMaterials = useMemo(() => {
    if (activeTab === '全部') {
      return allMaterials;
    }
    return allMaterials.filter((material) => material.category === activeTab);
  }, [activeTab]);

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="mt-8">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">最新监控素材</h1>
        <p className="text-sm text-gray-500 mt-1">实时更新的营销素材库</p>
      </div>

      {/* Tab筛选栏 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 素材网格展示 */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMaterials.map((item) => {
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无该分类素材</p>
        </div>
      )}

      {/* 模态框 */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        material={selectedMaterial}
      />
    </div>
  );
};

export default LatestMaterials;
