import React, { useMemo, useState } from 'react';
import xiaohongshuLogo from '../../assets/渠道logo/小红书.png';
import antWealthLogo from '../../assets/渠道logo/蚂蚁.png';
import wechatLogo from '../../assets/渠道logo/微信.png';
import xueqiuLogo from '../../assets/渠道logo/雪球.png';
import douyinLogo from '../../assets/渠道logo/抖音.png';
import {
  TOPIC_SURGE_ALERTS,
  NEW_EMERGING_TOPICS,
  INSTITUTION_ALIGNMENT_CHANGES,
  PLATFORM_INSTITUTION_SHIFTS,
  INSTITUTION_RESOURCE_FOCUS,
  VIRAL_POSTS,
} from '../data/contentMutationData';

const PAGE_TABS = ['市场热点', '多维对比', '内容异动'];
const PLATFORM_TABS = ['全平台', '小红书', '蚂蚁财富号', '微信公众号', '雪球', '抖音'];
const RANKING_LIST_HEIGHT = 'h-[392px]';
const DETAIL_CHANNEL_TABS = PLATFORM_TABS.slice(1);

const TOPIC_SUMMARY = {
  黄金概念: '受避险情绪与资产配置需求共振影响，黄金相关内容持续走强，讨论集中在ETF配置、美元利率与大宗商品联动。',
  AI应用: 'AI应用方向延续高关注，内容重点从模型概念逐步转向算力落地、云计算受益链和终端商业化场景。',
  创新药: '创新药热度主要来自政策改善预期与估值修复，机构内容围绕产品管线、CXO链条和医药反弹节奏展开。',
  'CPO/光模块': 'CPO/光模块话题热度由算力基础设施需求带动，内容聚焦景气验证、订单兑现和光通信设备投资机会。',
};

const TOPIC_CHANNEL_HEAT_PROFILE = {
  黄金概念: { 微信公众号: 78, 蚂蚁财富号: 82, 雪球: 88, 小红书: 54, 抖音: 61 },
  AI应用: { 微信公众号: 74, 蚂蚁财富号: 57, 雪球: 63, 小红书: 86, 抖音: 92 },
  创新药: { 微信公众号: 81, 蚂蚁财富号: 66, 雪球: 69, 小红书: 72, 抖音: 64 },
  'CPO/光模块': { 微信公众号: 84, 蚂蚁财富号: 55, 雪球: 71, 小红书: 68, 抖音: 77 },
  液冷服务器: { 微信公众号: 79, 蚂蚁财富号: 52, 雪球: 58, 小红书: 63, 抖音: 83 },
  红利资产: { 微信公众号: 70, 蚂蚁财富号: 86, 雪球: 82, 小红书: 49, 抖音: 42 },
  半导体设备: { 微信公众号: 76, 蚂蚁财富号: 59, 雪球: 73, 小红书: 66, 抖音: 74 },
  铜缆高速连接: { 微信公众号: 72, 蚂蚁财富号: 48, 雪球: 57, 小红书: 62, 抖音: 79 },
  光纤光缆: { 微信公众号: 80, 蚂蚁财富号: 56, 雪球: 64, 小红书: 59, 抖音: 71 },
  消费复苏: { 微信公众号: 67, 蚂蚁财富号: 62, 雪球: 54, 小红书: 76, 抖音: 81 },
};

const TOPIC_LIFECYCLE = {
  黄金概念: { progress: 68, stage: '高峰期' },
  AI应用: { progress: 61, stage: '高峰期' },
  创新药: { progress: 54, stage: '上升期' },
  'CPO/光模块': { progress: 57, stage: '上升期' },
  液冷服务器: { progress: 49, stage: '上升期' },
  红利资产: { progress: 72, stage: '分化期' },
  半导体设备: { progress: 58, stage: '上升期' },
  铜缆高速连接: { progress: 44, stage: '萌芽期' },
  光纤光缆: { progress: 64, stage: '高峰期' },
  消费复苏: { progress: 39, stage: '复苏期' },
};

const OWN_TOPIC_CONTENT_COUNTS = {
  黄金概念: 86,
  AI应用: 142,
  创新药: 118,
  'CPO/光模块': 96,
  液冷服务器: 61,
  红利资产: 73,
  半导体设备: 68,
  铜缆高速连接: 36,
  光纤光缆: 42,
  消费复苏: 57,
};

const OWN_CHANNEL_COMPARE = [
  { platform: '小红书', current: 136, previous: 112, trend: '内容加码，种草表达更明显' },
  { platform: '蚂蚁财富号', current: 158, previous: 171, trend: '投教稳定，但本周略有收缩' },
  { platform: '微信公众号', current: 184, previous: 149, trend: '图文回补明显，成为本周主阵地' },
  { platform: '雪球', current: 97, previous: 105, trend: '讨论延续，但观点类内容略减少' },
  { platform: '抖音', current: 172, previous: 121, trend: '视频产能提升，增量最明显' },
];

const OWN_PRODUCT_PERFORMANCE = [
  {
    code: '518800',
    name: '广发黄金ETF',
    topic: '黄金概念',
    topicHeat: 48,
    platforms: ['蚂蚁财富号', '微信公众号', '雪球'],
    platformContentCount: 152,
    contentHeat: 92,
  },
  {
    code: '159863',
    name: '广发人工智能ETF',
    topic: 'AI应用',
    topicHeat: 47,
    platforms: ['抖音', '小红书', '微信公众号'],
    platformContentCount: 194,
    contentHeat: 95,
  },
  {
    code: '516120',
    name: '广发创新药ETF',
    topic: '创新药',
    topicHeat: 44,
    platforms: ['微信公众号', '小红书', '蚂蚁财富号'],
    platformContentCount: 191,
    contentHeat: 94,
  },
  {
    code: '560880',
    name: '广发通信设备ETF',
    topic: 'CPO/光模块',
    topicHeat: 42,
    platforms: ['微信公众号', '抖音', '小红书'],
    platformContentCount: 171,
    contentHeat: 88,
  },
  {
    code: '018112',
    name: '广发算力先锋混合',
    topic: '液冷服务器',
    topicHeat: 38,
    platforms: ['微信公众号', '抖音', '蚂蚁财富号'],
    platformContentCount: 126,
    contentHeat: 79,
  },
];

const WEEKLY_TOPIC_PLAN = {
  period: '4月14日-4月18日',
  owner: '招商基金 · 基于内容机会分析生成',
  marketSummary:
    '关税冲击余震未平，避险情绪持续，黄金叙事仍在高位。A股科技板块分化加剧，市场从“主题想象”转向“业绩验证”逻辑。建议围绕“黄金防守+科技弹性”双主线安排本周选题。',
  totalTopics: 5,
  coveredLayouts: 3,
  plans: [
    {
      rank: 1,
      topic: '黄金',
      tags: ['多图', '本周一发'],
      title: '行业在说“黄金涨”，我们说“你该有多少黄金”',
      publishDay: '周一',
      why: '行业本周黄金相关内容高位延续，但资产配置视角仍有缺口，用户更关心“我该怎么配”。',
      spec: ['首发小红书，同步微信', '多图6-8张，数据图为主', '封面：数字 + 问句结构', '末尾引导：互动问题'],
      angles: [
        { title: '角度A·配置比例计算器型', detail: '用“100-年龄×0.8”类简单公式，引导用户评估黄金仓位。', suggestion: '互动率高，可引导评论区晒配比' },
        { title: '角度B·反向思维型', detail: '以“现在入场还来得及吗”切入，拆解上涨后续可能路径。', suggestion: '争议性强，评论停留时间更长' },
        { title: '角度C·产品映射型', detail: '直接关联广发黄金ETF，讲清“哪类资金适合哪类黄金产品”。', suggestion: '与账户场景联动，承接更顺滑' },
      ],
      avoid: '“黄金再创新高”“现在买入还不晚”等同质化标题，用户审美疲劳明显。',
    },
    {
      rank: 2,
      topic: '固收+',
      tags: ['多图', '本周发，抢先布局'],
      title: '市场震荡期，固收+为什么能“守住回撤”',
      publishDay: '周二',
      why: '权益波动仍高，用户风险偏好下移，稳健策略内容转化效率更好。',
      spec: ['微信公众号首发', '图文长文+一页总结图', '封面：策略场景化问题', '结尾：组合模板下载'],
      angles: [
        { title: '角度A·回撤对比型', detail: '对比不同策略近三个月回撤，强调“体验差异”。', suggestion: '适合做收藏型内容' },
        { title: '角度B·现金流规划型', detail: '把固收+嵌入教育金/养老金场景。', suggestion: '私聊咨询率更高' },
      ],
      avoid: '纯收益率排名式内容，容易触发同质竞争。',
    },
  ],
};

const TOPIC_HEAT_BY_PLATFORM = {
  鍏ㄥ钩鍙? [
    { topic: '榛勯噾姒傚康', count: 1280, growth: 62, share: 48 },
    { topic: 'AI搴旂敤', count: 1215, growth: 58, share: 47 },
    { topic: '鍒涙柊鑽?, count: 1098, growth: 47, share: 44 },
    { topic: 'CPO/鍏夋ā鍧?, count: 1032, growth: 43, share: 42 },
    { topic: '娑插喎鏈嶅姟鍣?, count: 944, growth: 39, share: 38 },
    { topic: '绾㈠埄璧勪骇', count: 886, growth: 22, share: 36 },
    { topic: '鍗婂浣撹澶?, count: 852, growth: 34, share: 34 },
    { topic: '閾滅紗楂橀€熻繛鎺?, count: 801, growth: 31, share: 32 },
    { topic: '鍏夌氦鍏夌紗', count: 766, growth: 28, share: 31 },
    { topic: '娑堣垂澶嶈嫃', count: 642, growth: 17, share: 26 },
  ],
  小红书: [
    { topic: 'AI应用', count: 486, growth: 71, share: 49 },
    { topic: '创新药', count: 452, growth: 55, share: 46 },
    { topic: '黄金概念', count: 429, growth: 49, share: 43 },
    { topic: 'CPO/光模块', count: 403, growth: 46, share: 41 },
    { topic: '液冷服务器', count: 366, growth: 42, share: 37 },
    { topic: '半导体设备', count: 341, growth: 33, share: 35 },
    { topic: '消费复苏', count: 332, growth: 29, share: 34 },
    { topic: '机器人', count: 318, growth: 27, share: 32 },
    { topic: '光纤光缆', count: 295, growth: 24, share: 30 },
    { topic: '出海链', count: 244, growth: 18, share: 25 },
  ],
  蚂蚁财富号: [
    { topic: '黄金概念', count: 388, growth: 44, share: 48 },
    { topic: '红利资产', count: 367, growth: 26, share: 45 },
    { topic: '创新药', count: 341, growth: 32, share: 42 },
    { topic: 'AI应用', count: 325, growth: 28, share: 39 },
    { topic: '半导体设备', count: 294, growth: 24, share: 36 },
    { topic: '消费复苏', count: 271, growth: 19, share: 34 },
    { topic: '银行', count: 258, growth: 14, share: 32 },
    { topic: '中证红利50指数', count: 237, growth: 16, share: 29 },
    { topic: '中证创新药产业指数', count: 229, growth: 21, share: 28 },
    { topic: '有色金属', count: 213, growth: 18, share: 26 },
  ],
  微信公众号: [
    { topic: 'AI应用', count: 522, growth: 53, share: 49 },
    { topic: 'CPO/光模块', count: 487, growth: 48, share: 46 },
    { topic: '液冷服务器', count: 455, growth: 41, share: 43 },
    { topic: '黄金概念', count: 432, growth: 35, share: 41 },
    { topic: '创新药', count: 396, growth: 29, share: 37 },
    { topic: '半导体设备', count: 378, growth: 33, share: 36 },
    { topic: '光纤光缆', count: 361, growth: 31, share: 34 },
    { topic: '铜缆高速连接', count: 346, growth: 26, share: 33 },
    { topic: '机器人', count: 286, growth: 19, share: 27 },
    { topic: '消费电子', count: 249, growth: 16, share: 24 },
  ],
  雪球: [
    { topic: '黄金概念', count: 364, growth: 39, share: 47 },
    { topic: '红利资产', count: 339, growth: 24, share: 44 },
    { topic: '半导体设备', count: 312, growth: 28, share: 41 },
    { topic: 'AI应用', count: 301, growth: 25, share: 38 },
    { topic: '有色金属', count: 284, growth: 21, share: 36 },
    { topic: '创新药', count: 263, growth: 22, share: 34 },
    { topic: 'CPO/光模块', count: 251, growth: 23, share: 32 },
    { topic: '银行', count: 238, growth: 11, share: 29 },
    { topic: '中证通信设备主题指数', count: 214, growth: 18, share: 26 },
    { topic: '中证内地黄金主题指数', count: 205, growth: 17, share: 25 },
  ],
  抖音: [
    { topic: 'AI应用', count: 562, growth: 66, share: 50 },
    { topic: '黄金概念', count: 503, growth: 58, share: 46 },
    { topic: '创新药', count: 447, growth: 46, share: 43 },
    { topic: '消费复苏', count: 396, growth: 34, share: 38 },
    { topic: '机器人', count: 372, growth: 31, share: 36 },
    { topic: 'CPO/光模块', count: 351, growth: 29, share: 34 },
    { topic: '液冷服务器', count: 318, growth: 27, share: 31 },
    { topic: '半导体设备', count: 304, growth: 24, share: 29 },
    { topic: '光纤光缆', count: 279, growth: 21, share: 26 },
    { topic: '国企改革', count: 246, growth: 16, share: 23 },
  ],
};

const TOPIC_PRODUCT_DETAILS = {
  黄金概念: [
    {
      institution: '广发基金',
      product: '广发黄金ETF',
      ratio: 32,
      count: 176,
      heat: 95,
      heatLabel: '高热度',
      platformMix: [
        { name: '铓傝殎璐㈠瘜鍙?, value: 36 },
        { name: '寰俊鍏紬鍙?, value: 27 },
        { name: '闆悆', value: 21 },
        { name: '鎶栭煶', value: 9 },
        { name: '灏忕孩涔?, value: 7 },
      ],
    },
    {
      institution: '华夏基金',
      product: '华夏中证黄金ETF',
      ratio: 26,
      count: 148,
      heat: 88,
      heatLabel: '高热度',
      platformMix: [
        { name: '蚂蚁财富号', value: 30 },
        { name: '抖音', value: 20 },
        { name: '雪球', value: 23 },
        { name: '微信公众号', value: 18 },
        { name: '小红书', value: 9 },
      ],
    },
    {
      institution: '博时基金',
      product: '博时黄金ETF联接',
      ratio: 18,
      count: 102,
      heat: 76,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 22 },
        { name: '蚂蚁财富号', value: 29 },
        { name: '小红书', value: 14 },
        { name: '雪球', value: 24 },
        { name: '抖音', value: 11 },
      ],
    },
  ],
  AI应用: [
    {
      institution: '广发基金',
      product: '广发人工智能ETF',
      ratio: 34,
      count: 212,
      heat: 96,
      heatLabel: '高热度',
      platformMix: [
        { name: '抖音', value: 37 },
        { name: '小红书', value: 28 },
        { name: '微信公众号', value: 18 },
        { name: '雪球', value: 10 },
        { name: '蚂蚁财富号', value: 7 },
      ],
    },
    {
      institution: '易方达基金',
      product: '易方达人工智能ETF',
      ratio: 27,
      count: 171,
      heat: 90,
      heatLabel: '高热度',
      platformMix: [
        { name: '微信公众号', value: 25 },
        { name: '抖音', value: 30 },
        { name: '小红书', value: 23 },
        { name: '雪球', value: 13 },
        { name: '蚂蚁财富号', value: 9 },
      ],
    },
    {
      institution: '华夏基金',
      product: '华夏数字经济混合',
      ratio: 19,
      count: 119,
      heat: 81,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 30 },
        { name: '抖音', value: 24 },
        { name: '小红书', value: 20 },
        { name: '蚂蚁财富号', value: 14 },
        { name: '雪球', value: 12 },
      ],
    },
  ],
  创新药: [
    {
      institution: '广发基金',
      product: '广发创新药ETF',
      ratio: 41,
      count: 191,
      heat: 94,
      heatLabel: '高热度',
      platformMix: [
        { name: '微信公众号', value: 31 },
        { name: '小红书', value: 24 },
        { name: '蚂蚁财富号', value: 19 },
        { name: '抖音', value: 16 },
        { name: '雪球', value: 10 },
      ],
    },
    {
      institution: '汇添富基金',
      product: '汇添富创新药混合',
      ratio: 32,
      count: 164,
      heat: 86,
      heatLabel: '中高热度',
      platformMix: [
        { name: '灏忕孩涔?, value: 28 },
        { name: '寰俊鍏紬鍙?, value: 27 },
        { name: '铓傝殎璐㈠瘜鍙?, value: 18 },
        { name: '鎶栭煶', value: 16 },
        { name: '闆悆', value: 11 },
      ],
    },
    {
      institution: '富国基金',
      product: '富国医药成长30股票',
      ratio: 21,
      count: 93,
      heat: 73,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 25 },
        { name: '小红书', value: 23 },
        { name: '蚂蚁财富号', value: 21 },
        { name: '雪球', value: 17 },
        { name: '抖音', value: 14 },
      ],
    },
  ],
  'CPO/光模块': [
    {
      institution: '广发基金',
      product: '广发通信设备ETF',
      ratio: 31,
      count: 186,
      heat: 91,
      heatLabel: '高热度',
      platformMix: [
        { name: '微信公众号', value: 33 },
        { name: '抖音', value: 25 },
        { name: '小红书', value: 17 },
        { name: '雪球', value: 14 },
        { name: '蚂蚁财富号', value: 11 },
      ],
    },
    {
      institution: '嘉实基金',
      product: '嘉实中证通信设备ETF',
      ratio: 24,
      count: 153,
      heat: 85,
      heatLabel: '高热度',
      platformMix: [
        { name: '微信公众号', value: 34 },
        { name: '抖音', value: 24 },
        { name: '小红书', value: 18 },
        { name: '雪球', value: 14 },
        { name: '蚂蚁财富号', value: 10 },
      ],
    },
    {
      institution: '易方达基金',
      product: '易方达云计算ETF',
      ratio: 19,
      count: 117,
      heat: 79,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 29 },
        { name: '雪球', value: 22 },
        { name: '抖音', value: 21 },
        { name: '小红书', value: 17 },
        { name: '蚂蚁财富号', value: 11 },
      ],
    },
  ],
  液冷服务器: [
    {
      institution: '广发基金',
      product: '广发算力先锋混合',
      ratio: 29,
      count: 128,
      heat: 82,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 34 },
        { name: '抖音', value: 28 },
        { name: '蚂蚁财富号', value: 18 },
        { name: '小红书', value: 12 },
        { name: '雪球', value: 8 },
      ],
    },
    {
      institution: '华夏基金',
      product: '华夏液冷算力混合',
      ratio: 23,
      count: 102,
      heat: 74,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 32 },
        { name: '抖音', value: 24 },
        { name: '小红书', value: 16 },
        { name: '蚂蚁财富号', value: 18 },
        { name: '雪球', value: 10 },
      ],
    },
    {
      institution: '易方达基金',
      product: '易方达算力基础设施ETF',
      ratio: 16,
      count: 84,
      heat: 68,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 30 },
        { name: '抖音', value: 27 },
        { name: '小红书', value: 14 },
        { name: '蚂蚁财富号', value: 16 },
        { name: '雪球', value: 13 },
      ],
    },
  ],
  红利资产: [
    {
      institution: '广发基金',
      product: '广发红利低波ETF',
      ratio: 33,
      count: 146,
      heat: 88,
      heatLabel: '高热度',
      platformMix: [
        { name: '蚂蚁财富号', value: 36 },
        { name: '雪球', value: 28 },
        { name: '微信公众号', value: 22 },
        { name: '小红书', value: 8 },
        { name: '抖音', value: 6 },
      ],
    },
    {
      institution: '华泰柏瑞基金',
      product: '华泰柏瑞红利ETF',
      ratio: 26,
      count: 121,
      heat: 80,
      heatLabel: '中高热度',
      platformMix: [
        { name: '蚂蚁财富号', value: 34 },
        { name: '雪球', value: 29 },
        { name: '微信公众号', value: 20 },
        { name: '小红书', value: 9 },
        { name: '抖音', value: 8 },
      ],
    },
    {
      institution: '南方基金',
      product: '南方中证红利ETF',
      ratio: 18,
      count: 92,
      heat: 72,
      heatLabel: '中高热度',
      platformMix: [
        { name: '蚂蚁财富号', value: 33 },
        { name: '雪球', value: 27 },
        { name: '微信公众号', value: 24 },
        { name: '小红书', value: 9 },
        { name: '抖音', value: 7 },
      ],
    },
  ],
  半导体设备: [
    {
      institution: '广发基金',
      product: '广发半导体设备ETF',
      ratio: 30,
      count: 134,
      heat: 84,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 30 },
        { name: '抖音', value: 24 },
        { name: '雪球', value: 20 },
        { name: '小红书', value: 16 },
        { name: '蚂蚁财富号', value: 10 },
      ],
    },
    {
      institution: '国泰基金',
      product: '国泰半导体芯片ETF',
      ratio: 24,
      count: 118,
      heat: 78,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 31 },
        { name: '抖音', value: 21 },
        { name: '雪球', value: 24 },
        { name: '小红书', value: 14 },
        { name: '蚂蚁财富号', value: 10 },
      ],
    },
    {
      institution: '华夏基金',
      product: '华夏半导体龙头混合',
      ratio: 17,
      count: 89,
      heat: 69,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 29 },
        { name: '抖音', value: 19 },
        { name: '雪球', value: 23 },
        { name: '小红书', value: 17 },
        { name: '蚂蚁财富号', value: 12 },
      ],
    },
  ],
  铜缆高速连接: [
    {
      institution: '广发基金',
      product: '广发高速连接主题ETF',
      ratio: 28,
      count: 107,
      heat: 76,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 31 },
        { name: '抖音', value: 28 },
        { name: '小红书', value: 17 },
        { name: '雪球', value: 14 },
        { name: '蚂蚁财富号', value: 10 },
      ],
    },
    {
      institution: '嘉实基金',
      product: '嘉实铜缆连接设备ETF',
      ratio: 21,
      count: 88,
      heat: 69,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 33 },
        { name: '抖音', value: 24 },
        { name: '小红书', value: 16 },
        { name: '雪球', value: 15 },
        { name: '蚂蚁财富号', value: 12 },
      ],
    },
    {
      institution: '易方达基金',
      product: '易方达高速互联产业混合',
      ratio: 15,
      count: 71,
      heat: 63,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 28 },
        { name: '抖音', value: 26 },
        { name: '小红书', value: 18 },
        { name: '蚂蚁财富号', value: 14 },
        { name: '雪球', value: 14 },
      ],
    },
  ],
  光纤光缆: [
    {
      institution: '广发基金',
      product: '广发光通信ETF',
      ratio: 31,
      count: 121,
      heat: 83,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 34 },
        { name: '抖音', value: 23 },
        { name: '雪球', value: 19 },
        { name: '小红书', value: 14 },
        { name: '蚂蚁财富号', value: 10 },
      ],
    },
    {
      institution: '华夏基金',
      product: '华夏光通信产业ETF',
      ratio: 22,
      count: 96,
      heat: 75,
      heatLabel: '中高热度',
      platformMix: [
        { name: '微信公众号', value: 31 },
        { name: '抖音', value: 22 },
        { name: '雪球', value: 21 },
        { name: '小红书', value: 15 },
        { name: '蚂蚁财富号', value: 11 },
      ],
    },
    {
      institution: '南方基金',
      product: '南方光纤光缆主题混合',
      ratio: 16,
      count: 77,
      heat: 67,
      heatLabel: '中热度',
      platformMix: [
        { name: '微信公众号', value: 29 },
        { name: '抖音', value: 20 },
        { name: '雪球', value: 22 },
        { name: '小红书', value: 16 },
        { name: '蚂蚁财富号', value: 13 },
      ],
    },
  ],
  消费复苏: [
    {
      institution: '广发基金',
      product: '广发消费复苏混合',
      ratio: 30,
      count: 143,
      heat: 86,
      heatLabel: '高热度',
      platformMix: [
        { name: '抖音', value: 34 },
        { name: '小红书', value: 28 },
        { name: '微信公众号', value: 19 },
        { name: '蚂蚁财富号', value: 11 },
        { name: '雪球', value: 8 },
      ],
    },
    {
      institution: '易方达基金',
      product: '易方达新消费成长混合',
      ratio: 24,
      count: 117,
      heat: 78,
      heatLabel: '中高热度',
      platformMix: [
        { name: '抖音', value: 31 },
        { name: '小红书', value: 24 },
        { name: '微信公众号', value: 22 },
        { name: '蚂蚁财富号', value: 13 },
        { name: '雪球', value: 10 },
      ],
    },
    {
      institution: '富国基金',
      product: '富国消费精选30股票',
      ratio: 18,
      count: 88,
      heat: 70,
      heatLabel: '中高热度',
      platformMix: [
        { name: '抖音', value: 27 },
        { name: '小红书', value: 23 },
        { name: '微信公众号', value: 24 },
        { name: '蚂蚁财富号', value: 14 },
        { name: '雪球', value: 12 },
      ],
    },
  ],
};

const CONTENT_FORMAT_DISTRIBUTION = {
  全平台: [
    { topic: '黄金概念', image: 62, video: 28, text: 10, bestFormat: '多图' },
    { topic: 'AI应用', image: 31, video: 56, text: 13, bestFormat: '视频' },
    { topic: '创新药', image: 54, video: 18, text: 28, bestFormat: '多图' },
    { topic: 'CPO/光模块', image: 38, video: 44, text: 18, bestFormat: '视频' },
    { topic: '液冷服务器', image: 42, video: 36, text: 22, bestFormat: '多图' },
  ],
  小红书: [
    { topic: 'AI应用', image: 44, video: 43, text: 13, bestFormat: '多图' },
    { topic: '创新药', image: 58, video: 16, text: 26, bestFormat: '多图' },
    { topic: '黄金概念', image: 63, video: 23, text: 14, bestFormat: '多图' },
    { topic: 'CPO/光模块', image: 35, video: 49, text: 16, bestFormat: '视频' },
    { topic: '液冷服务器', image: 47, video: 31, text: 22, bestFormat: '多图' },
  ],
  蚂蚁财富号: [
    { topic: '黄金概念', image: 21, video: 12, text: 67, bestFormat: '纯文' },
    { topic: '红利资产', image: 28, video: 9, text: 63, bestFormat: '纯文' },
    { topic: '创新药', image: 34, video: 14, text: 52, bestFormat: '纯文' },
    { topic: 'AI应用', image: 25, video: 17, text: 58, bestFormat: '纯文' },
    { topic: '半导体设备', image: 29, video: 18, text: 53, bestFormat: '纯文' },
  ],
  微信公众号: [
    { topic: 'AI应用', image: 36, video: 18, text: 46, bestFormat: '纯文' },
    { topic: 'CPO/光模块', image: 33, video: 21, text: 46, bestFormat: '纯文' },
    { topic: '液冷服务器', image: 41, video: 14, text: 45, bestFormat: '纯文' },
    { topic: '黄金概念', image: 48, video: 9, text: 43, bestFormat: '多图' },
    { topic: '创新药', image: 39, video: 12, text: 49, bestFormat: '纯文' },
  ],
  雪球: [
    { topic: '黄金概念', image: 18, video: 8, text: 74, bestFormat: '纯文' },
    { topic: '红利资产', image: 24, video: 7, text: 69, bestFormat: '纯文' },
    { topic: '半导体设备', image: 27, video: 15, text: 58, bestFormat: '纯文' },
    { topic: 'AI应用', image: 22, video: 19, text: 59, bestFormat: '纯文' },
    { topic: '有色金属', image: 26, video: 11, text: 63, bestFormat: '纯文' },
  ],
  抖音: [
    { topic: 'AI应用', image: 19, video: 68, text: 13, bestFormat: '视频' },
    { topic: '黄金概念', image: 24, video: 61, text: 15, bestFormat: '视频' },
    { topic: '创新药', image: 28, video: 54, text: 18, bestFormat: '视频' },
    { topic: '消费复苏', image: 32, video: 49, text: 19, bestFormat: '视频' },
    { topic: '机器人', image: 26, video: 58, text: 16, bestFormat: '视频' },
  ],
};

const formatBadgeClass = {
  多图: 'bg-emerald-100 text-emerald-700',
  视频: 'bg-blue-100 text-blue-700',
  纯文: 'bg-amber-100 text-amber-700',
};

const heatBadgeClass = {
  高热度: 'bg-rose-100 text-rose-700',
  中高热度: 'bg-orange-100 text-orange-700',
  中热度: 'bg-slate-100 text-slate-700',
};

const channelHeatLabel = (value) => {
  if (value >= 85) return '高热';
  if (value >= 70) return '较高';
  if (value >= 55) return '中热';
  return '一般';
};

const buildFallbackFormatDistribution = (topic, index) => {
  const seed = topic.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + index * 17;
  const image = 24 + (seed % 28);
  const video = 18 + ((seed * 3) % 34);
  const text = Math.max(8, 100 - image - video);

  const maxValue = Math.max(image, video, text);
  const bestFormat = maxValue === image ? '多图' : maxValue === video ? '视频' : '纯文';

  return {
    topic,
    image,
    video,
    text,
    bestFormat,
  };
};

const getFormatValueClass = (value, maxValue) =>
  value === maxValue
    ? 'font-semibold text-slate-900 bg-slate-100'
    : 'text-slate-500';

const parsePercentValue = (value) => Number(String(value || '0').replace('%', '').replace('+', ''));
const parseWanValue = (value) => Number(String(value || '0').replace('万', ''));
const sortArrow = (isActive, direction) => (isActive ? (direction === 'desc' ? '▼' : '▲') : '↕');
const PLATFORM_ICON_META = {
  小红书: { logo: xiaohongshuLogo },
  蚂蚁财富号: { logo: antWealthLogo },
  微信公众号: { logo: wechatLogo },
  雪球: { logo: xueqiuLogo },
  抖音: { logo: douyinLogo },
};

const buildCompetitorOverview = (detail, index) => {
  const seed =
    detail.product.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) +
    detail.institution.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) +
    index * 29;
  const productCode = String(100000 + ((seed * 97) % 900000)).padStart(6, '0');
  const monthlyGainValue = 4.2 + detail.heat / 24 + ((seed % 11) * 0.18);
  const latestWatchlistValue = 5 + detail.count / 22 + ((seed % 8) * 0.35);
  const watchlistChangeValue = 2.8 + detail.ratio / 9 + ((seed % 10) * 0.22);
  const holdersValue = latestWatchlistValue * (2.45 + ((seed % 4) * 0.12));
  const purchaseCountValue = latestWatchlistValue * (0.78 + ((seed % 5) * 0.06));

  return {
    ...detail,
    code: productCode,
    monthlyGain: `+${monthlyGainValue.toFixed(1)}%`,
    latestWatchlist: `${latestWatchlistValue.toFixed(1)}万`,
    watchlistChange: `+${watchlistChangeValue.toFixed(1)}%`,
    holders: `${holdersValue.toFixed(1)}万`,
    purchaseCount: `${purchaseCountValue.toFixed(1)}万`,
  };
};

const buildOwnProductOverview = (product) => {
  const platformCount = Math.max(product.platforms.length, 1);
  const averageShare = Math.floor(100 / platformCount);
  const remainder = 100 - averageShare * platformCount;
  const platformMix = product.platforms.map((platform, index) => ({
    name: platform,
    value: index === 0 ? averageShare + remainder : averageShare,
  }));
  const monthlyGainValue = 4.8 + product.topicHeat * 0.08;
  const latestWatchlistValue = 4.6 + product.platformContentCount / 24;
  const watchlistChangeValue = 3.2 + product.topicHeat * 0.11;
  const holdersValue = latestWatchlistValue * 2.7;
  const purchaseCountValue = latestWatchlistValue * 0.92;
  const heatLabel = product.contentHeat >= 85 ? '高热度' : product.contentHeat >= 70 ? '中高热度' : '中热度';

  return {
    product: product.name,
    institution: '广发基金',
    ratio: 33,
    count: product.platformContentCount,
    heat: product.contentHeat,
    heatLabel,
    platformMix,
    code: product.code,
    monthlyGain: `+${monthlyGainValue.toFixed(1)}%`,
    latestWatchlist: `${latestWatchlistValue.toFixed(1)}万`,
    watchlistChange: `+${watchlistChangeValue.toFixed(1)}%`,
    holders: `${holdersValue.toFixed(1)}万`,
    purchaseCount: `${purchaseCountValue.toFixed(1)}万`,
    isOwn: true,
  };
};

const buildFallbackChannelHeat = (topic, platform) => {
  const topicSeed = topic.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const platformSeed = platform.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = 52 + ((topicSeed + platformSeed) % 33);
  return Math.min(93, Math.max(46, base));
};

const ContentCenterInsight = () => {
  const [activeTab, setActiveTab] = useState('市场热点');
  const [activePlatform, setActivePlatform] = useState('全平台');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedProductForCompetitors, setSelectedProductForCompetitors] = useState(null);
  const [competitorSortConfig, setCompetitorSortConfig] = useState({ key: 'monthlyGain', direction: 'desc' });
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState(false);

  const topicList = useMemo(() => TOPIC_HEAT_BY_PLATFORM[activePlatform] || [], [activePlatform]);
  const contentFormatList = useMemo(
    () =>
      topicList.map((topicItem, index) => {
        const matchedItem = (CONTENT_FORMAT_DISTRIBUTION[activePlatform] || []).find(
          (formatItem) => formatItem.topic === topicItem.topic
        );

        return matchedItem || buildFallbackFormatDistribution(topicItem.topic, index);
      }),
    [activePlatform, topicList]
  );
  const contentProductHotList = useMemo(
    () =>
      INSTITUTION_RESOURCE_FOCUS.map((item) => {
        const mainPushProduct = item.mainPush?.product || item.contentPush?.[0] || '--';
        const mainPushCode = item.mainPush?.code || '--';
        const investment = item.mainPush?.investment || 20;
        const mainPushPlatforms = item.mainPush?.platforms || ['微信公众号'];
        return {
          product: mainPushProduct,
          code: mainPushCode,
          institution: item.institution,
          platforms: mainPushPlatforms,
          value: investment,
          change: Math.max(6, Math.round(investment * 0.45)),
        };
      })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
    []
  );
  const shelfProductHotList = useMemo(() => {
    const mainPushMetaMap = new Map(
      INSTITUTION_RESOURCE_FOCUS.map((item) => [item.mainPush?.product, { code: item.mainPush?.code }])
    );

    return INSTITUTION_RESOURCE_FOCUS.flatMap((item) => {
      const records = item.antShelfRecords?.length
        ? item.antShelfRecords
        : (item.antShelf || []).map((product, index) => ({
            product,
            shelfNames: (item.antShelfSlots || []).slice(index, index + 2).length
              ? (item.antShelfSlots || []).slice(index, index + 2)
              : ['稳健榜单'],
          }));

      return records.map((record, index) => ({
        product: record.product,
        code: mainPushMetaMap.get(record.product)?.code || '--',
        institution: item.institution,
        platforms: ['蚂蚁财富号'],
        shelfNames: record.shelfNames || ['稳健榜单'],
        value: 65 + records.length * 6 - index * 4,
        growth: 8 + (item.institution.length % 6) + index * 2,
      }));
    })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, []);

  const multiChannelProductHotList = useMemo(() => {
    const rows = INSTITUTION_RESOURCE_FOCUS.map((item) => {
      const product = item.mainPush?.product || item.contentPush?.[0] || '--';
      const code = item.mainPush?.code || '--';
      const platforms = item.mainPush?.platforms || [];
      const investment = item.mainPush?.investment || 20;
      const contentCount = item.contentPush?.length || 1;
      const shelfCount = item.antShelfRecords?.length || item.antShelf?.length || 1;
      const latestWatchlistValue = 3.6 + investment * 0.22 + platforms.length * 0.35;
      const recentWatchlistValue = latestWatchlistValue * (0.48 + contentCount * 0.06);
      const holderValue = latestWatchlistValue * (2.3 + shelfCount * 0.08);
      const holderWeeklyChangeValue = Math.max(1.2, investment * 0.18 + shelfCount * 0.24);
      const influencerHolderChangeValue = Math.max(0.8, investment * 0.11 + platforms.length * 0.22);
      const influencerAmountChangeValue = Math.max(90, investment * 18 + shelfCount * 26);
      const avgSipCountValue = Math.max(1.2, 1.4 + platforms.length * 0.25 + investment * 0.03);
      const eastmoneyRankAppearValue = Math.max(1, Math.round(investment / 7 + platforms.length * 0.6));
      const purchaseCountValue = latestWatchlistValue * (0.84 + contentCount * 0.05);
      return {
        product,
        code,
        institution: item.institution,
        channelCount: platforms.length,
        value: investment,
        latestWatchlist: `${latestWatchlistValue.toFixed(1)}万`,
        recentWatchlist: `${recentWatchlistValue.toFixed(1)}万`,
        holderCount: `${holderValue.toFixed(1)}万`,
        holderWeeklyChange: `+${holderWeeklyChangeValue.toFixed(1)}%`,
        influencerHolderChange: `+${influencerHolderChangeValue.toFixed(1)}%`,
        influencerAmountChange: `+${influencerAmountChangeValue.toFixed(0)}万`,
        avgSipCount: `${avgSipCountValue.toFixed(1)}次`,
        eastmoneyRankAppear: `${eastmoneyRankAppearValue}次`,
        purchaseCount: `${purchaseCountValue.toFixed(1)}万`,
      };
    });
    const multi = rows.filter((r) => r.channelCount >= 2).sort((a, b) => b.value - a.value);
    const source = multi.length ? multi : [...rows].sort((a, b) => b.value - a.value);
    return source.map((item) => ({ ...item }));
  }, []);

  const modalProducts = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }
    return TOPIC_PRODUCT_DETAILS[selectedTopic] || [];
  }, [selectedTopic]);

  const channelHeatList = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    return DETAIL_CHANNEL_TABS.map((platform) => {
      const profileValue = TOPIC_CHANNEL_HEAT_PROFILE[selectedTopic]?.[platform];
      const matched = (TOPIC_HEAT_BY_PLATFORM[platform] || []).find((item) => item.topic === selectedTopic);
      return {
        platform,
        value:
          profileValue ??
          Math.max(45, Math.min(92, (matched?.share ?? buildFallbackChannelHeat(selectedTopic, platform)) + (matched?.growth ?? 0) * 0.28)),
      };
    });
  }, [selectedTopic]);

  const institutionShareList = useMemo(() => {
    if (!modalProducts.length) {
      return [];
    }

    const existingTotal = modalProducts.reduce((sum, item) => sum + item.ratio, 0);
    const targetCoverage = 100;
    const remaining = Math.max(0, targetCoverage - existingTotal);
    const reserveInstitutions = [
      '富国基金',
      '南方基金',
      '嘉实基金',
      '华泰柏瑞基金',
      '国泰基金',
      '汇添富基金',
      '广发基金',
      '易方达基金',
      '博时基金',
      '招商基金',
    ].filter((name) => !modalProducts.some((item) => item.institution === name));

    const baseList = modalProducts.map((item) => ({
      institution: item.institution,
      value: item.ratio,
      count: item.count,
      primary: true,
    }));

    if (remaining <= 0) {
      return baseList.sort((a, b) => b.value - a.value);
    }

    const parts = Math.min(8, reserveInstitutions.length);
    const weights = [38, 24, 15, 9, 6, 4, 3, 1].slice(0, parts);
    const weightTotal = weights.reduce((sum, value) => sum + value, 0);

    const generatedList = reserveInstitutions.slice(0, parts).map((institution, index) => {
      const rawValue = Math.max(1, Math.round((remaining * weights[index]) / weightTotal));
      return {
        institution,
        value: rawValue,
        count: 8 + rawValue * 3 + (parts - index),
        primary: false,
      };
    });

    const generatedSum = generatedList.reduce((sum, item) => sum + item.value, 0);
    const diff = remaining - generatedSum;
    if (generatedList[0] && diff !== 0) {
      generatedList[0].value += diff;
      generatedList[0].count += diff * 3;
    }

    return [...baseList, ...generatedList].sort((a, b) => b.value - a.value);
  }, [modalProducts]);

  const topicCurrentStats = useMemo(() => {
    if (!selectedTopic) {
      return null;
    }

    return (TOPIC_HEAT_BY_PLATFORM[activePlatform] || []).find((item) => item.topic === selectedTopic) || null;
  }, [activePlatform, selectedTopic]);

  const topicDescription = useMemo(() => {
    if (!selectedTopic) {
      return '';
    }

    return (
      TOPIC_SUMMARY[selectedTopic] ||
      `${selectedTopic}相关内容近期维持较高讨论度，机构内容主要围绕主题景气验证、资产配置逻辑与产品承接机会展开。`
    );
  }, [selectedTopic]);

  const topicLifecycle = useMemo(() => {
    if (!selectedTopic) {
      return { progress: 50, stage: '上升期' };
    }

    return TOPIC_LIFECYCLE[selectedTopic] || { progress: 52, stage: '上升期' };
  }, [selectedTopic]);

  const topicCompareCards = useMemo(() => {
    const marketTopTopics = TOPIC_HEAT_BY_PLATFORM['全平台'] || [];

    return marketTopTopics
      .map((item) => {
        const platformCounts = DETAIL_CHANNEL_TABS.map((platform) => {
          const matched = (TOPIC_HEAT_BY_PLATFORM[platform] || []).find((topicItem) => topicItem.topic === item.topic);
          return matched?.count || 0;
        });

        const industryAverage = Math.round(
          platformCounts.reduce((sum, value) => sum + value, 0) / DETAIL_CHANNEL_TABS.length
        );
        const selfCount = OWN_TOPIC_CONTENT_COUNTS[item.topic] || 0;
        const gapRatio = industryAverage / Math.max(selfCount, 1);
        const level = gapRatio >= 8 ? 'urgent' : gapRatio >= 4 ? 'potential' : 'blue';

        return {
          topic: item.topic,
          industryAverage,
          selfCount,
          growth: item.growth,
          gapRatio,
          level,
        };
      })
      .sort((a, b) => b.gapRatio - a.gapRatio)
      .slice(0, 8);
  }, []);

  const topicCompareSummary = useMemo(() => {
    const marketTopTopics = (TOPIC_HEAT_BY_PLATFORM['全平台'] || []).slice(0, 8).map((item) => item.topic);
    const ownTopTopics = Object.entries(OWN_TOPIC_CONTENT_COUNTS)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic]) => topic);
    const overlapCount = marketTopTopics.filter((topic) => ownTopTopics.includes(topic)).length;
    const mainlineSimilarity = Math.round((overlapCount / Math.max(marketTopTopics.length, 1)) * 100);

    const fullCompareList = (TOPIC_HEAT_BY_PLATFORM['全平台'] || []).map((item) => {
      const platformCounts = DETAIL_CHANNEL_TABS.map((platform) => {
        const matched = (TOPIC_HEAT_BY_PLATFORM[platform] || []).find((topicItem) => topicItem.topic === item.topic);
        return matched?.count || 0;
      });
      const industryAverage = Math.round(platformCounts.reduce((sum, value) => sum + value, 0) / DETAIL_CHANNEL_TABS.length);
      const selfCount = OWN_TOPIC_CONTENT_COUNTS[item.topic] || 0;
      const deviation = Math.abs(industryAverage - selfCount) / Math.max(industryAverage, 1);
      return { topic: item.topic, industryAverage, selfCount, deviation };
    });

    const averageDeviation = Math.round(
      (fullCompareList.reduce((sum, item) => sum + item.deviation, 0) / Math.max(fullCompareList.length, 1)) * 100
    );
    const missingHotTopics = fullCompareList.filter((item) => item.selfCount <= item.industryAverage * 0.2).length;

    return {
      mainlineSimilarity,
      averageDeviation,
      missingHotTopics,
    };
  }, []);

  const channelCompareCards = useMemo(() => {
    const ranked = [...OWN_CHANNEL_COMPARE].sort((a, b) => b.current - a.current);
    const topPlatforms = ranked.slice(0, 2).map((item) => item.platform);
    const maxCurrent = Math.max(...ranked.map((item) => item.current), 1);

    return OWN_CHANNEL_COMPARE.map((item) => {
      const diff = item.current - item.previous;
      return {
        ...item,
        diff,
        maxCurrent,
        isTop: topPlatforms.includes(item.platform),
      };
    });
  }, []);

  const competitorModalList = useMemo(() => {
    if (!selectedProductForCompetitors) {
      return [];
    }

    const topicProducts = TOPIC_PRODUCT_DETAILS[selectedProductForCompetitors.topic] || [];
    const mappedList = topicProducts.map((detail, index) => ({
      ...buildCompetitorOverview(detail, index),
      isOwn: detail.product === selectedProductForCompetitors.name,
    }));
    const hasOwnProduct = mappedList.some((item) => item.isOwn);

    if (hasOwnProduct) {
      return mappedList;
    }

    return [buildOwnProductOverview(selectedProductForCompetitors), ...mappedList];
  }, [selectedProductForCompetitors]);

  const sortedCompetitorModalList = useMemo(() => {
    const list = [...competitorModalList];
    const directionFactor = competitorSortConfig.direction === 'desc' ? -1 : 1;
    const getValueByKey = (item, key) => {
      if (key === 'latestWatchlist' || key === 'holders' || key === 'purchaseCount') return parseWanValue(item[key]);
      if (key === 'monthlyGain' || key === 'watchlistChange') return parsePercentValue(item[key]);
      return Number(item[key] || 0);
    };

    return list.sort((a, b) => {
      const valueA = getValueByKey(a, competitorSortConfig.key);
      const valueB = getValueByKey(b, competitorSortConfig.key);
      if (valueA === valueB) return 0;
      return valueA > valueB ? directionFactor : -directionFactor;
    });
  }, [competitorModalList, competitorSortConfig]);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">


        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
          </div>
          {(activeTab === '市场热点' || activeTab === '多维对比' || activeTab === '内容异动') && (
            <button
              type="button"
              onClick={() => setIsWeeklyPlanModalOpen(true)}
              className="rounded-full border border-slate-800 bg-slate-800 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              生成本周选题计划
            </button>
          )}
        </div>
      </section>

      {activeTab === '市场热点' && (
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">话题热度榜</h3>
                  <p className="mt-1 text-xs text-slate-500">展示前 10 个话题的内容数量，并支持弹窗查看当前平台下的话题详情</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {PLATFORM_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActivePlatform(tab);
                      setSelectedTopic(null);
                    }}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      activePlatform === tab
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className={`${RANKING_LIST_HEIGHT} space-y-3 overflow-y-auto pr-1`}>
                {topicList.map((item, index) => (
                  <div key={`${activePlatform}-${item.topic}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-semibold text-slate-600">
                            {index + 1}
                          </span>
                          <span className="truncate text-sm font-semibold text-slate-900">{item.topic}</span>
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                            热度占比 {item.share}%
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>内容数量：{item.count}</span>
                          <span>近 7 日：+{item.growth}%</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopic(item.topic);
                        }}
                        className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">内容形式分布</h3>
                  <p className="mt-1 text-xs text-slate-500">根据左侧平台 tab 联动，展示近 7 日各话题的素材类型占比</p>
                </div>
                <div className="shrink-0 text-xs font-medium text-slate-500">近 7 天 · {activePlatform}</div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white">
                <div className="h-[392px] overflow-y-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">话题</th>
                        <th className="px-4 py-3 font-medium">多图</th>
                        <th className="px-4 py-3 font-medium">视频</th>
                        <th className="px-4 py-3 font-medium">纯文</th>
                        <th className="px-4 py-3 font-medium">最佳形式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentFormatList.map((item) => {
                        const rowMax = Math.max(item.image, item.video, item.text);

                        return (
                        <tr key={`${activePlatform}-${item.topic}`} className="border-t border-slate-200">
                          <td className="px-4 py-3 font-semibold text-slate-900">{item.topic}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex min-w-[54px] justify-center rounded-md px-2 py-1 ${getFormatValueClass(item.image, rowMax)}`}>
                              {item.image}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex min-w-[54px] justify-center rounded-md px-2 py-1 ${getFormatValueClass(item.video, rowMax)}`}>
                              {item.video}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex min-w-[54px] justify-center rounded-md px-2 py-1 ${getFormatValueClass(item.text, rowMax)}`}>
                              {item.text}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                formatBadgeClass[item.bestFormat]
                              }`}
                            >
                              {item.bestFormat}
                            </span>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">内容推品列表</div>
                <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">主推视图</div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {contentProductHotList.map((item) => (
                  <div key={`${item.product}-${item.institution}`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{item.product}</span>
                        <span className="inline-flex items-center gap-1">
                          {item.platforms.map((platform) => {
                            const logo = PLATFORM_ICON_META[platform]?.logo;
                            return (
                              <span
                                key={`${item.product}-${platform}`}
                                className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                title={platform}
                                aria-label={platform}
                              >
                                {logo ? (
                                  <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[9px] text-slate-400">-</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      </span>
                      <span className="text-sm text-rose-600">+{item.change}%</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>基金代码 {item.code}</span>
                      <span>·</span>
                      <span>{item.institution}</span>
                      <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[11px] text-rose-700">机构主推</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">货架产品列表</div>
                <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">曝光量视角</div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {shelfProductHotList.map((item) => (
                  <div key={`${item.product}-${item.institution}-shelf`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{item.product}</span>
                        <span className="inline-flex items-center gap-1">
                          {item.platforms.map((platform) => {
                            const logo = PLATFORM_ICON_META[platform]?.logo;
                            return (
                              <span
                                key={`${item.product}-${platform}-shelf`}
                                className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                title={platform}
                                aria-label={platform}
                              >
                                {logo ? (
                                  <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[9px] text-slate-400">-</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      </span>
                      <span className="inline-flex flex-wrap justify-end gap-1">
                        {item.shelfNames.map((shelfName) => (
                          <span
                            key={`${item.product}-${shelfName}`}
                            className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700"
                          >
                            {shelfName}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>基金代码 {item.code}</span>
                      <span>·</span>
                      <span>{item.institution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">多渠道产品热度列表</div>
              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">主推 · 多平台</div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-[1700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">产品名称</th>
                    <th className="px-4 py-3 font-medium">代码</th>
                    <th className="px-4 py-3 font-medium">机构</th>
                    <th className="px-4 py-3 font-medium">加自选人数</th>
                    <th className="px-4 py-3 font-medium">近7日加自选人数</th>
                    <th className="px-4 py-3 font-medium">持有人数</th>
                    <th className="px-4 py-3 font-medium">近七日持有人数变化</th>
                    <th className="px-4 py-3 font-medium">持仓达人人数变化</th>
                    <th className="px-4 py-3 font-medium">达人实盘金额变化</th>
                    <th className="px-4 py-3 font-medium">人均定投次数</th>
                    <th className="px-4 py-3 font-medium">天天风向标榜单出现次数</th>
                    <th className="px-4 py-3 font-medium">购买笔数</th>
                  </tr>
                </thead>
                <tbody>
                  {multiChannelProductHotList.map((row, index) => (
                    <tr
                      key={`${row.product}-${row.institution}`}
                      className={`border-t border-slate-200 text-slate-800 transition hover:bg-sky-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{row.product}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.code}</td>
                      <td className="px-4 py-3 text-slate-700">{row.institution}</td>
                      <td className="px-4 py-3 text-slate-700">{row.latestWatchlist}</td>
                      <td className="px-4 py-3 text-slate-700">{row.recentWatchlist}</td>
                      <td className="px-4 py-3 text-slate-700">{row.holderCount}</td>
                      <td className="px-4 py-3 text-rose-600">{row.holderWeeklyChange}</td>
                      <td className="px-4 py-3 text-rose-600">{row.influencerHolderChange}</td>
                      <td className="px-4 py-3 text-rose-600">{row.influencerAmountChange}</td>
                      <td className="px-4 py-3 text-slate-700">{row.avgSipCount}</td>
                      <td className="px-4 py-3 text-slate-700">{row.eastmoneyRankAppear}</td>
                      <td className="px-4 py-3 text-slate-700">{row.purchaseCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      )}

      {activeTab === '多维对比' && (
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">话题对比层</h3>
              <p className="mt-1 text-sm text-slate-500">
                对比自家与整个市场的话题同频度，优先筛出缺失热点与投入不足的热点。
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              近 7 天 · 市场 vs 你们
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">主线相似度</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{topicCompareSummary.mainlineSimilarity}%</div>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">平均偏离</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{topicCompareSummary.averageDeviation}%</div>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">缺失热点</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{topicCompareSummary.missingHotTopics}</div>
            </article>
          </div>

          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3 px-1">
            {topicCompareCards.map((item) => {
              const compareMax = Math.max(item.industryAverage, 1);
              const accentClass =
                item.level === 'urgent'
                  ? 'before:bg-rose-500'
                  : item.level === 'potential'
                    ? 'before:bg-amber-500'
                    : 'before:bg-blue-500';

              return (
                <article
                  key={item.topic}
                  className={`relative w-[280px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm before:absolute before:inset-y-0 before:left-0 before:w-1 md:w-[300px] lg:w-[calc((100vw-140px)/4)] lg:max-w-[320px] ${accentClass}`}
                >
                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-slate-900">{item.topic}</h4>
                          <div className="text-sm text-slate-600">
                            新增{' '}
                            <span className={item.growth >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
                              {item.growth >= 0 ? '+' : ''}{item.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopic(item.topic);
                        }}
                        className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        查看详情
                      </button>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>行业平均</span>
                        <span>自家内容</span>
                      </div>
                      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div className="flex justify-end">
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div
                              className="ml-auto h-2.5 rounded-full bg-slate-500"
                              style={{ width: `${(item.industryAverage / compareMax) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">VS</div>
                        <div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div
                              className="h-2.5 rounded-full bg-rose-500"
                              style={{ width: `${(item.selfCount / compareMax) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[11px] text-slate-500">
                        <div className="text-right">{item.industryAverage}</div>
                        <div />
                        <div>{item.selfCount}</div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">渠道对比层</h3>
                <p className="mt-1 text-sm text-slate-500">
                  对比自家机构在五个平台近 7 日的总内容分布，并观察较上周的转变倾向与产出差异。
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                近 7 天 · 自家渠道分布
              </div>
            </div>

            <div className="-mx-1 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-3 px-1">
                {channelCompareCards.map((item) => {
                  const diffText = item.diff >= 0 ? `较上周 +${item.diff}` : `较上周 ${item.diff}`;
                  const cardClass = item.isTop
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white';
                  const barClass = item.isTop ? 'bg-slate-900' : 'bg-slate-400';

                  return (
                    <article
                      key={item.platform}
                      className={`w-[220px] shrink-0 rounded-xl border p-4 shadow-sm ${cardClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-semibold text-slate-900">{item.platform}</h4>
                        {item.isTop && (
                          <span className="inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
                            TOP
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex items-end justify-between gap-2">
                          <div className="text-2xl font-semibold text-slate-900">{item.current}</div>
                          <div className="text-xs text-slate-500">篇 / 近7日</div>
                        </div>
                        <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                          <div
                            className={`h-2.5 rounded-full ${barClass}`}
                            style={{ width: `${(item.current / item.maxCurrent) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <div>{diffText}</div>
                        <div>{item.trend}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">推品对比层</h3>
                <p className="mt-1 text-sm text-slate-500">
                  展示自家推品列表，并支持展开同话题竞品，比较产品热度、话题承接和用户关注变化。
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                自家推品 vs 同话题竞品
              </div>
            </div>

            <div className="space-y-3">
              {OWN_PRODUCT_PERFORMANCE.map((item) => {
                const topicCompetitors = TOPIC_PRODUCT_DETAILS[item.topic] || [];
                const competitorCount = Math.max(topicCompetitors.length - 1, 0);

                return (
                  <div key={item.code} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="px-4 py-4">
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1fr_0.9fr_0.8fr_auto]">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                            <span className="text-xs text-slate-500">{item.code}</span>
                          </div>
                          <div className="mt-1 text-sm text-slate-600">相关话题：{item.topic}</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="text-xs text-slate-400">话题热度</div>
                          <div className="mt-1 font-medium text-slate-900">{item.topicHeat}%</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="text-xs text-slate-400">推品平台</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {item.platforms.map((platform) => {
                              const meta = PLATFORM_ICON_META[platform];
                              const logo = meta?.logo;

                              return (
                                <span
                                  key={`${item.code}-${platform}`}
                                  className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                  title={platform}
                                  aria-label={platform}
                                >
                                  {logo ? (
                                    <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] text-slate-400">-</span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="text-xs text-slate-400">平台内容数量</div>
                          <div className="mt-1 font-medium text-slate-900">{item.platformContentCount}</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="text-xs text-slate-400">相关内容热度</div>
                          <div className="mt-1 font-medium text-slate-900">{item.contentHeat}</div>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="text-xs text-slate-400">竞品数量</div>
                          <div className="mt-1 font-medium text-slate-900">{competitorCount}</div>
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setCompetitorSortConfig({ key: 'monthlyGain', direction: 'desc' });
                              setSelectedProductForCompetitors(item);
                            }}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            查看竞品
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === '内容异动' && (
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">内容异动总览</h3>
              <p className="mt-1 text-sm text-slate-500">
                聚焦热度突变、新话题涌现、机构跟进速度与推品资源倾斜方向。
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              近 7 天 · 异动追踪
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <article className="rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3">
              <div className="text-xs text-rose-700">暴涨话题数</div>
              <div className="mt-1 text-2xl font-semibold text-rose-700">{TOPIC_SURGE_ALERTS.length}</div>
            </article>
            <article className="rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3">
              <div className="text-xs text-sky-700">新出话题数</div>
              <div className="mt-1 text-2xl font-semibold text-sky-700">{NEW_EMERGING_TOPICS.length}</div>
            </article>
            <article className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <div className="text-xs text-emerald-700">高贴合机构（80+）</div>
              <div className="mt-1 text-2xl font-semibold text-emerald-700">
                {INSTITUTION_ALIGNMENT_CHANGES.filter((item) => item.alignmentScore >= 80).length}
              </div>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
              <div className="text-xs text-amber-700">爆款帖子数</div>
              <div className="mt-1 text-2xl font-semibold text-amber-700">{VIRAL_POSTS.length}</div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">异动时间线（热度暴涨 + 新出话题）</h4>
                <span className="text-xs text-slate-500">按变化强度排序</span>
              </div>
              <div className="max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
                {[...TOPIC_SURGE_ALERTS, ...NEW_EMERGING_TOPICS.map((item) => ({
                  topic: item.topic,
                  change: item.growth,
                  currentShare: item.share,
                  previousShare: Math.max(item.share - 2.4, 0),
                  reason: `首现 ${item.firstSeenDays} 天，主发平台：${item.platforms.join(' / ')}`,
                  isNew: true,
                }))]
                  .sort((a, b) => b.change - a.change)
                  .map((item, index) => (
                    <article key={`${item.topic}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${item.isNew ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                          {item.isNew ? '新话题' : '暴涨'}
                        </span>
                        <span className="font-medium text-slate-900">{item.topic}</span>
                        <span className="ml-auto text-sm font-semibold text-rose-600">+{item.change}%</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">占比 {item.previousShare.toFixed(1)}% → {item.currentShare}%</div>
                      <div className="mt-1 text-xs text-slate-500">{item.reason}</div>
                    </article>
                  ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">机构跟进与平台倾向矩阵</h4>
                <span className="text-xs text-slate-500">同屏查看“谁在跟”和“去哪发”</span>
              </div>
              <div className="space-y-2.5">
                {INSTITUTION_ALIGNMENT_CHANGES.map((item) => {
                  const shift = PLATFORM_INSTITUTION_SHIFTS.find((platformItem) => platformItem.increased.includes(item.institution));
                  return (
                    <article key={item.institution} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-slate-900">{item.institution}</div>
                        <div className="text-sm font-semibold text-slate-900">贴合分 {item.alignmentScore}</div>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{item.action}</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                        {item.alignedTopics.map((topic) => (
                          <span key={`${item.institution}-${topic}`} className="rounded-full bg-white px-2 py-0.5 text-slate-600">{topic}</span>
                        ))}
                        {shift && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">倾向平台：{shift.platform}</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">机构资源配置（内容推品 + 支付宝货架位）</h4>
              <span className="text-xs text-slate-500">本周新推已标注；单屏展示 6 张，可横向滑动查看更多</span>
            </div>
            <div className="-mx-1 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-3 px-1">
                {INSTITUTION_RESOURCE_FOCUS.map((item) => {
                  const isGF = item.institution === '广发基金';
                  const weeklyNewProduct = item.mainPush?.product || item.contentPush?.[0];
                  return (
                    <article
                      key={item.institution}
                      className={`w-[calc((100vw-140px)/4)] min-w-[345px] max-w-[390px] shrink-0 rounded-xl border p-3 shadow-sm ${isGF ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50/70'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className={`font-medium ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{item.institution}</div>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${isGF ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500'}`}>
                          资源主推
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-start gap-2">
                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <div className="text-[11px] font-medium text-slate-500">内容推品</div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {item.contentPush.map((product) => (
                              <span
                                key={`${item.institution}-content-${product}`}
                                className={`rounded-full px-2 py-0.5 text-[11px] ${
                                  product === weeklyNewProduct
                                    ? 'border border-rose-200 bg-rose-50 text-rose-700'
                                    : 'bg-sky-50 text-sky-700'
                                }`}
                              >
                                {product}
                                {product === weeklyNewProduct ? ' · 本周新推' : ''}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-8 text-slate-400">+</div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <div className="text-[11px] font-medium text-slate-500">支付宝货架位</div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {item.antShelf.map((product) => (
                              <span
                                key={`${item.institution}-shelf-${product}`}
                                className={`rounded-full px-2 py-0.5 text-[11px] ${
                                  product === weeklyNewProduct
                                    ? 'border border-rose-200 bg-rose-50 text-rose-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {product}
                                {product === weeklyNewProduct ? ' · 本周新推' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">爆款内容墙（文章 / 帖子）</h4>
              <span className="text-xs text-slate-500">按互动量筛选</span>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {VIRAL_POSTS.map((item) => {
                const platformLogo = PLATFORM_ICON_META[item.platform]?.logo;
                return (
                  <article
                    key={`${item.title}-${item.platform}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm"
                  >
                    <div className="border-b border-slate-100 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                            title={item.platform}
                            aria-label={item.platform}
                          >
                            {platformLogo ? (
                              <img src={platformLogo} alt={item.platform} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-400">-</span>
                            )}
                          </span>
                          <span className="truncate text-xs text-slate-500">{item.institution}</span>
                        </div>
                        <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                          互动 {item.interactions}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-3">
                      <div className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900">{item.title}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={`${item.title}-${tag}`}
                            className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      )}

      {selectedTopic && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 px-4 py-8">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <div className="text-xs font-medium text-slate-500">近 7 天 · {activePlatform}</div>
                <p className="mt-1 text-sm text-slate-500">从话题、渠道、机构、产品四个层次拆解该主题的内容热度结构。</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
              >
                关闭
              </button>
            </div>

            <div className="max-h-[calc(88vh-88px)] overflow-y-auto px-6 py-5">
              <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="text-sm font-medium text-slate-500">话题名称</div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h4 className="text-2xl font-semibold text-slate-900">{selectedTopic}</h4>
                  {topicCurrentStats && (
                    <>
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        内容数量 {topicCurrentStats.count}
                      </span>
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-600">
                        近 7 日 +{topicCurrentStats.growth}%
                      </span>
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        热度占比 {topicCurrentStats.share}%
                      </span>
                    </>
                  )}
                </div>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-500">话题说明</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{topicDescription}</p>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-500">话题生命周期</div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {topicLifecycle.stage}
                  </span>
                </div>
                <div className="px-1">
                  <div className="relative">
                    <div className="h-3 rounded-full bg-sky-100" />
                    <div
                      className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-white bg-rose-500 shadow"
                      style={{ left: `calc(${topicLifecycle.progress}% - 10px)` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-5 text-center text-sm text-slate-500">
                    <span>萌芽</span>
                    <span>上升</span>
                    <span>高峰</span>
                    <span>分化</span>
                    <span>衰退</span>
                  </div>
                </div>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-500">渠道热度</div>
                  <div className="text-xs text-slate-400">五个平台热度并列对比</div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                  {channelHeatList.map((item) => (
                    <div key={`${selectedTopic}-${item.platform}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                          title={item.platform}
                          aria-label={item.platform}
                        >
                          {PLATFORM_ICON_META[item.platform]?.logo ? (
                            <img
                              src={PLATFORM_ICON_META[item.platform].logo}
                              alt={item.platform}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">{channelHeatLabel(item.value)}</span>
                      </div>
                      <div className="mt-2 text-right text-lg font-semibold text-slate-900">
                        {item.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 text-sm font-medium text-slate-500">机构内容占比</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {institutionShareList.map((item) => {
                    const isGF = item.institution === '广发基金';
                    return (
                    <div
                      key={`${selectedTopic}-${item.institution}`}
                      className={`rounded-xl border p-3 ${isGF ? 'border-emerald-300 bg-emerald-50/70' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${isGF ? 'text-emerald-700' : 'text-slate-700'}`}>{item.institution}</span>
                        <span className={`text-sm font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{item.value}%</span>
                      </div>
                      <div className={`h-2.5 rounded-full ${isGF ? 'bg-emerald-100' : 'bg-white'}`}>
                        <div
                          className={`h-2.5 rounded-full ${isGF ? 'bg-emerald-600' : 'bg-slate-800'}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <div className={`mt-2 flex items-center justify-between text-[11px] ${isGF ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <span>{item.primary ? '核心参与机构' : '长尾参与机构'}</span>
                        <span>发布内容约 {item.count}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-500">机构推品列表</div>
                  <div className="text-sm text-slate-400">包含机构推品占比、关联内容数、内容热度和渠道分布</div>
                </div>

                <div className="space-y-2.5">
                  {modalProducts.map((detail) => {
                    const isGF = detail.institution === '广发基金';
                    return (
                    <div
                      key={`${selectedTopic}-${detail.institution}-${detail.product}`}
                      className={`rounded-lg border px-3 py-3 ${isGF ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-slate-50/60'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <div className={`truncate text-sm font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.product}</div>
                              <div className={`shrink-0 text-sm ${isGF ? 'text-emerald-700' : 'text-slate-500'}`}>{detail.institution}</div>
                            </div>
                            <div className={`inline-flex items-center gap-3 text-sm ${isGF ? 'text-emerald-700' : 'text-slate-500'}`}>
                              <span>机构推品资源占比 <span className={`font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.ratio}%</span></span>
                              <span>关联内容数 <span className={`font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.count}</span></span>
                              <span>热度 <span className={`font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.heat}</span></span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${heatBadgeClass[detail.heatLabel]}`}>
                          {detail.heatLabel}
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <div className="rounded-md bg-white px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 text-sm font-medium text-slate-500">渠道分布</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-200">
                            {detail.platformMix.map((platform, index) => {
                              const segmentClass = [
                                'bg-[#1f2937]',
                                'bg-[#475569]',
                                'bg-[#64748b]',
                                'bg-[#94a3b8]',
                                'bg-[#cbd5e1]',
                              ][index % 5];

                              return (
                                <div
                                  key={`${detail.product}-${platform.name}`}
                                  className={`${segmentClass} h-full`}
                                  style={{ width: `${platform.value}%` }}
                                  title={`${platform.name} ${platform.value}%`}
                                />
                              );
                            })}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-slate-500">
                            {detail.platformMix.map((platform, index) => {
                              const dotClass = [
                                'bg-[#1f2937]',
                                'bg-[#475569]',
                                'bg-[#64748b]',
                                'bg-[#94a3b8]',
                                'bg-[#cbd5e1]',
                              ][index % 5];

                              return (
                                <span key={`${detail.product}-${platform.name}-legend`} className="inline-flex items-center gap-1">
                                  <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                                  <span>{platform.name} {platform.value}%</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {modalProducts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    当前话题暂未配置更细的机构与产品明细。
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {selectedProductForCompetitors && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 px-4 py-8">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <div className="text-xs font-medium text-slate-500">推品表现层 · 同话题竞品</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{selectedProductForCompetitors.topic}话题竞品列表</h3>
                <p className="mt-1 text-sm text-slate-500">
                  围绕 {selectedProductForCompetitors.name}，展示同话题竞品及对应整体数据。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductForCompetitors(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
              >
                关闭
              </button>
            </div>

            <div className="max-h-[calc(88vh-88px)] overflow-y-auto px-6 py-5">

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-[1400px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="sticky left-0 z-20 min-w-[220px] whitespace-nowrap bg-slate-50 px-4 py-3 font-medium">产品名称</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">代码</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">机构名称</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">机构推品资源占比</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">关联内容数</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">内容热度</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorSortConfig((prev) => ({
                              key: 'monthlyGain',
                              direction: prev.key === 'monthlyGain' && prev.direction === 'desc' ? 'asc' : 'desc',
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-700"
                        >
                          <span>近一月涨幅</span>
                          <span>{sortArrow(competitorSortConfig.key === 'monthlyGain', competitorSortConfig.direction)}</span>
                        </button>
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorSortConfig((prev) => ({
                              key: 'latestWatchlist',
                              direction: prev.key === 'latestWatchlist' && prev.direction === 'desc' ? 'asc' : 'desc',
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-700"
                        >
                          <span>最新加自选人数</span>
                          <span>{sortArrow(competitorSortConfig.key === 'latestWatchlist', competitorSortConfig.direction)}</span>
                        </button>
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorSortConfig((prev) => ({
                              key: 'watchlistChange',
                              direction: prev.key === 'watchlistChange' && prev.direction === 'desc' ? 'asc' : 'desc',
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-700"
                        >
                          <span>近一月加自选人数变化</span>
                          <span>{sortArrow(competitorSortConfig.key === 'watchlistChange', competitorSortConfig.direction)}</span>
                        </button>
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorSortConfig((prev) => ({
                              key: 'holders',
                              direction: prev.key === 'holders' && prev.direction === 'desc' ? 'asc' : 'desc',
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-700"
                        >
                          <span>持有人数</span>
                          <span>{sortArrow(competitorSortConfig.key === 'holders', competitorSortConfig.direction)}</span>
                        </button>
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorSortConfig((prev) => ({
                              key: 'purchaseCount',
                              direction: prev.key === 'purchaseCount' && prev.direction === 'desc' ? 'asc' : 'desc',
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-slate-700"
                        >
                          <span>购买笔数</span>
                          <span>{sortArrow(competitorSortConfig.key === 'purchaseCount', competitorSortConfig.direction)}</span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCompetitorModalList.map((detail) => (
                      <tr key={`${selectedProductForCompetitors.code}-${detail.institution}-${detail.product}`} className="border-t border-slate-200">
                        <td className="sticky left-0 z-10 min-w-[220px] whitespace-nowrap bg-white px-4 py-3 font-medium text-slate-900">
                          <span className="inline-flex items-center gap-2">
                            <span>{detail.product}</span>
                            {detail.isOwn && (
                              <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                自家推品
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.code}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.institution}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.ratio}%</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.count}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${heatBadgeClass[detail.heatLabel]}`}>
                            {detail.heat}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.monthlyGain}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.latestWatchlist}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.watchlistChange}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.holders}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{detail.purchaseCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedCompetitorModalList.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  当前话题暂未配置竞品整体数据。
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isWeeklyPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">本周选题计划</h3>
                <div className="mt-1 text-sm text-slate-500">{WEEKLY_TOPIC_PLAN.period} · {WEEKLY_TOPIC_PLAN.owner}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsWeeklyPlanModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
              >
                关闭
              </button>
            </div>

            <div className="max-h-[calc(90vh-84px)] overflow-y-auto px-6 py-5">
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  <span className="font-medium text-slate-900">本周市场背景：</span>{WEEKLY_TOPIC_PLAN.marketSummary}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  <div>本周选题数 <span className="ml-1 text-xl font-semibold text-slate-900">{WEEKLY_TOPIC_PLAN.totalTopics}</span></div>
                  <div className="mt-1">渠道布局 <span className="ml-1 text-xl font-semibold text-emerald-700">{WEEKLY_TOPIC_PLAN.coveredLayouts}</span></div>
                </div>
              </div>

              <div className="space-y-4">
                {WEEKLY_TOPIC_PLAN.plans.map((plan) => (
                  <article key={`${plan.rank}-${plan.topic}`} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-rose-100 px-2 text-xs font-semibold text-rose-700">
                          {plan.rank}
                        </span>
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{plan.topic}</span>
                        {plan.tags.map((tag) => (
                          <span key={`${plan.topic}-${tag}`} className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {tag}
                          </span>
                        ))}
                        <h4 className="ml-1 text-lg font-semibold text-slate-900">{plan.title}</h4>
                        <span className="ml-auto text-sm text-slate-500">{plan.publishDay}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-2">
                      <div className="rounded-lg bg-slate-50/80 px-3 py-3">
                        <div className="text-sm font-semibold text-slate-900">为什么做这个</div>
                        <p className="mt-1.5 text-sm leading-6 text-slate-700">{plan.why}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50/80 px-3 py-3">
                        <div className="text-sm font-semibold text-slate-900">平台 · 形式 · 规格</div>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-slate-700">
                          {plan.spec.map((specLine) => (
                            <li key={`${plan.topic}-${specLine}`}>{specLine}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="mb-2 text-sm font-medium text-slate-600">三个差异化角度（选一）</div>
                      <div className="space-y-2">
                        {plan.angles.map((angle) => (
                          <div key={`${plan.topic}-${angle.title}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                            <div className="text-sm font-semibold text-slate-900">{angle.title}</div>
                            <div className="mt-1 text-sm text-slate-700">{angle.detail}</div>
                            <div className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">{angle.suggestion}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                        避开这些：{plan.avoid}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCenterInsight;
