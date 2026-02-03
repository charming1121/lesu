import React from 'react';

const AlertPanel = () => {
  const alerts = [
    {
      id: 1,
      level: 'high',
      time: '10:20',
      content: '易方达基金 密集发布 3 条"黄金ETF"相关内容。',
      color: 'bg-red-500',
      keywords: ['易方达基金', '黄金ETF'],
    },
    {
      id: 2,
      level: 'medium',
      time: '09:45',
      content: '全网 "中证A500" 关键词热度飙升 150%。',
      color: 'bg-orange-500',
      keywords: ['中证A500'],
    },
    {
      id: 3,
      level: 'low',
      time: '09:10',
      content: '南方基金 新增 1 个营销活动页面。',
      color: 'bg-blue-500',
      keywords: ['南方基金'],
    },
  ];

  // 高亮关键词
  const highlightKeywords = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;
    
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'g');
      highlightedText = highlightedText.replace(
        regex,
        '<span class="font-bold text-blue-700">$1</span>'
      );
    });
    return highlightedText;
  };

  return (
    <div className="bg-slate-50 rounded-xl shadow-inner border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        实时异动监测 <span className="text-xs font-normal text-gray-500">(Live Alerts)</span>
      </h3>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white shadow-sm rounded-md p-2 mb-2 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-2.5">
              {/* 左侧紧急度圆点 - 带呼吸动画 */}
              <div
                className={`w-2 h-2 rounded-full ${alert.color} mt-1.5 flex-shrink-0 animate-pulse`}
              ></div>
              <div className="flex-1 min-w-0">
                {/* 时间戳 */}
                <div className="mb-1.5">
                  <span className="text-xs text-gray-400 font-mono">{alert.time}</span>
                </div>
                {/* 内容 - 关键词高亮 */}
                <p
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(alert.content, alert.keywords),
                  }}
                ></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
