// 来源：assets/静态数据/话题热度分析_v9.xlsx（异动时间线 + 内容异动KPI）
// 重新生成：python scripts/emit_anomaly_static.py

export const ANOMALY_KPI = {
  surgeTopic: 31,
  newTopic: 2,
  highAlignInstitution: 0,
  viralPosts: 52,
};

export const ANOMALY_TIMELINE = [
  { type: "new", topic: "储能", currentShare: 0.8, previousShare: 0.0, change: null, currentCount: 7, previousCount: 0, firstSeenDays: 5, mainPlatform: "小红书" },
  { type: "new", topic: "银行/保险", currentShare: 0.2, previousShare: 0.0, change: null, currentCount: 2, previousCount: 0, firstSeenDays: 4, mainPlatform: "微信公众号" },
  { type: "surge", topic: "电力/电网", currentShare: 1.0, previousShare: 0.1, change: 900.0, currentCount: 8, previousCount: 1, firstSeenDays: 9, mainPlatform: "微信公众号" },
  { type: "surge", topic: "新能源汽车", currentShare: 0.6, previousShare: 0.1, change: 500.0, currentCount: 5, previousCount: 1, firstSeenDays: 8, mainPlatform: "微信公众号" },
  { type: "surge", topic: "国内政策/产业政策", currentShare: 5.3, previousShare: 1.0, change: 430.0, currentCount: 44, previousCount: 7, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "创业板/科创板", currentShare: 6.7, previousShare: 1.8, change: 272.2, currentCount: 56, previousCount: 12, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "光通信/CPO/光模块", currentShare: 2.5, previousShare: 0.9, change: 177.8, currentCount: 21, previousCount: 6, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "国防军工/航空航天", currentShare: 1.8, previousShare: 0.7, change: 157.1, currentCount: 15, previousCount: 5, firstSeenDays: 10, mainPlatform: "雪球" },
  { type: "surge", topic: "先进制造/工业", currentShare: 1.6, previousShare: 0.7, change: 128.6, currentCount: 13, previousCount: 5, firstSeenDays: 11, mainPlatform: "雪球" },
  { type: "surge", topic: "红利/高股息", currentShare: 3.3, previousShare: 1.6, change: 106.2, currentCount: 28, previousCount: 11, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "人形机器人", currentShare: 0.6, previousShare: 0.3, change: 100.0, currentCount: 5, previousCount: 2, firstSeenDays: 11, mainPlatform: "小红书" },
  { type: "surge", topic: "医药政策", currentShare: 0.2, previousShare: 0.1, change: 100.0, currentCount: 2, previousCount: 1, firstSeenDays: 10, mainPlatform: "微信公众号" },
  { type: "surge", topic: "合规/反洗钱/反诈骗", currentShare: 6.3, previousShare: 3.3, change: 90.9, currentCount: 53, previousCount: 22, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "稳健理财/货币/QDII", currentShare: 1.3, previousShare: 0.7, change: 85.7, currentCount: 11, previousCount: 5, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "AI算力/基础设施", currentShare: 5.0, previousShare: 2.8, change: 78.6, currentCount: 42, previousCount: 19, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "低空经济/商业航天", currentShare: 1.2, previousShare: 0.7, change: 71.4, currentCount: 10, previousCount: 5, firstSeenDays: 10, mainPlatform: "微信公众号" },
  { type: "surge", topic: "农业/猪周期", currentShare: 1.0, previousShare: 0.6, change: 66.7, currentCount: 8, previousCount: 4, firstSeenDays: 11, mainPlatform: "小红书" },
  { type: "surge", topic: "美联储/全球货币", currentShare: 1.0, previousShare: 0.6, change: 66.7, currentCount: 8, previousCount: 4, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "房地产/REITs", currentShare: 1.9, previousShare: 1.2, change: 58.3, currentCount: 16, previousCount: 8, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "光伏/绿电", currentShare: 1.0, previousShare: 0.7, change: 42.9, currentCount: 8, previousCount: 5, firstSeenDays: 11, mainPlatform: "小红书" },
  { type: "surge", topic: "行业研究/赛道逻辑", currentShare: 6.1, previousShare: 4.3, change: 41.9, currentCount: 51, previousCount: 29, firstSeenDays: 12, mainPlatform: "雪球" },
  { type: "surge", topic: "国家安全教育", currentShare: 9.0, previousShare: 6.6, change: 36.4, currentCount: 75, previousCount: 44, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "AI应用/大模型", currentShare: 8.5, previousShare: 6.3, change: 34.9, currentCount: 71, previousCount: 42, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "消费电子", currentShare: 0.4, previousShare: 0.3, change: 33.3, currentCount: 3, previousCount: 2, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "有色金属/稀土", currentShare: 2.4, previousShare: 1.9, change: 26.3, currentCount: 20, previousCount: 13, firstSeenDays: 11, mainPlatform: "雪球" },
  { type: "surge", topic: "主动权益/基金业绩", currentShare: 5.4, previousShare: 4.3, change: 25.6, currentCount: 45, previousCount: 29, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "ESG/可持续投资", currentShare: 1.1, previousShare: 0.9, change: 22.2, currentCount: 9, previousCount: 6, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "锂电池/电池", currentShare: 1.2, previousShare: 1.0, change: 20.0, currentCount: 10, previousCount: 7, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "宽基指数/ETF工具", currentShare: 9.8, previousShare: 8.2, change: 19.5, currentCount: 82, previousCount: 55, firstSeenDays: 12, mainPlatform: "微信公众号" },
  { type: "surge", topic: "品牌运营/社群活动", currentShare: 9.7, previousShare: 8.2, change: 18.3, currentCount: 81, previousCount: 55, firstSeenDays: 12, mainPlatform: "微信公众号" },
  { type: "surge", topic: "大宗商品/原油", currentShare: 2.2, previousShare: 1.9, change: 15.8, currentCount: 18, previousCount: 13, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "创新药/生物医药", currentShare: 3.7, previousShare: 3.3, change: 12.1, currentCount: 31, previousCount: 22, firstSeenDays: 11, mainPlatform: "微信公众号" },
  { type: "surge", topic: "证券/券商", currentShare: 1.1, previousShare: 1.0, change: 10.0, currentCount: 9, previousCount: 7, firstSeenDays: 9, mainPlatform: "微信公众号" }
];
