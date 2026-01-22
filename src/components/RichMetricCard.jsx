import React from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const RichMetricCard = ({
  title,
  value,
  icon,
  trend,
  sparklineData,
  subtitle,
  tags,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500 mb-2">{title}</div>

        {/* 趋势信息 */}
        {trend && (
          <div className="text-xs text-gray-600 mb-3">
            {trend}
          </div>
        )}

        {/* 副标题 */}
        {subtitle && (
          <div className="text-xs text-gray-500 mb-2">{subtitle}</div>
        )}

        {/* 关联词标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 微型折线图 */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-3 h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  fill={`url(#sparkline-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichMetricCard;
