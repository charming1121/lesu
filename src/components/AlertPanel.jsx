import React from 'react';

const AlertPanel = () => {
  const alerts = [
    {
      id: 1,
      level: 'high',
      time: '10:20',
      content: '易方达基金 密集发布 3 条"黄金ETF"相关内容。',
      color: 'bg-red-500',
    },
    {
      id: 2,
      level: 'medium',
      time: '09:45',
      content: '全网 "中证A500" 关键词热度飙升 150%。',
      color: 'bg-orange-500',
    },
    {
      id: 3,
      level: 'low',
      time: '09:10',
      content: '南方基金 新增 1 个营销活动页面。',
      color: 'bg-blue-500',
    },
  ];

  const getEmoji = (level) => {
    switch (level) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        实时异动监测 <span className="text-xs font-normal text-gray-500">(Live Alerts)</span>
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3">
            {/* 左侧圆点 */}
            <div className={`w-2 h-2 rounded-full ${alert.color} mt-1.5 flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs">{getEmoji(alert.level)}</span>
                <span className="text-xs text-gray-500 font-mono">[{alert.time}]</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{alert.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
