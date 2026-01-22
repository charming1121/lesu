import React from 'react';

const MetricCard = ({ title, value, icon, isWarning = false }) => {
  return (
    <div
      className={`
        flex items-center p-5 rounded-xl shadow-sm border border-gray-100
        ${isWarning ? 'bg-red-50 border-red-100' : 'bg-white'}
        transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center mr-4
          ${isWarning ? 'bg-red-100' : 'bg-blue-50'}
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div
          className={`
            text-2xl font-bold mb-1
            ${isWarning ? 'text-red-600' : 'text-gray-900'}
          `}
        >
          {value}
        </div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
};

export default MetricCard;
