import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';

const TrendChart = () => {
  // 模拟最近7天的多维度数据
  const data = [
    { date: '01-09', 推文: 120, 视频: 80, 活动页: 120 },
    { date: '01-10', 推文: 180, 视频: 100, 活动页: 170 },
    { date: '01-11', 推文: 150, 视频: 90, 活动页: 140 },
    { date: '01-12', 推文: 220, 视频: 120, 活动页: 180 },
    { date: '01-13', 推文: 200, 视频: 110, 活动页: 170 },
    { date: '01-14', 推文: 280, 视频: 150, 活动页: 220 },
    { date: '01-15', 推文: 320, 视频: 180, 活动页: 220 },
  ];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color推文" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color视频" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color活动页" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => value}
          />
          <Area
            type="monotone"
            dataKey="活动页"
            stackId="1"
            stroke="#93C5FD"
            strokeWidth={2}
            fill="url(#color活动页)"
          />
          <Area
            type="monotone"
            dataKey="视频"
            stackId="1"
            stroke="#60A5FA"
            strokeWidth={2}
            fill="url(#color视频)"
          />
          <Area
            type="monotone"
            dataKey="推文"
            stackId="1"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#color推文)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
