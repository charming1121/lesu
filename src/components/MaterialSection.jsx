import React from 'react';
import MaterialCard from './MaterialCard';

const MaterialSection = ({ group, onMaterialClick }) => {
  return (
    <div className="mb-8">
      {/* Section 标题 */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-5 bg-blue-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>
      </div>

      {/* 横向滚动容器 - 带右侧淡出遮罩 */}
      <div className="relative">
        <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
          {group.items.map((item) => {
            const material = {
              ...item,
              imagePath: `${group.path}${item.id}.jpg`,
            };
            return (
              <MaterialCard
                key={item.id}
                imagePath={material.imagePath}
                source={item.source}
                time={item.time}
                material={material}
                onClick={onMaterialClick}
              />
            );
          })}
        </div>
        {/* 右侧淡出遮罩 */}
        <div className="absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default MaterialSection;
