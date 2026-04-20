import React, { useEffect, useMemo, useState } from 'react';
import xiaohongshuLogo from '../../assets/渠道logo/小红书.png';
import antWealthLogo from '../../assets/渠道logo/蚂蚁.png';
import wechatLogo from '../../assets/渠道logo/微信.png';
import xueqiuLogo from '../../assets/渠道logo/雪球.png';
import douyinLogo from '../../assets/渠道logo/抖音.png';
import {
  INSTITUTION_RESOURCE_FOCUS,
  SHELF_EXPOSURE_PRODUCT_LIST,
  ETF_EXPOSURE_COUNT_LIST,
  JOINT_OPERATION_SHELF_LIST,
} from '../data/contentMutationData';
import { ANOMALY_KPI, ANOMALY_TIMELINE } from '../data/contentAnomalyStatic';
import { MULTI_CHANNEL_PRODUCT_HEAT_STATIC } from '../data/multiChannelProductHeatStatic';
import { MARKET_TOPIC_DETAILS, MARKET_TOPIC_HEAT_BY_PLATFORM } from '../data/topicHeatAnalysisStatic';
import { VIRAL_POSTS } from '../data/viralPostsWallStatic';

const PAGE_TABS = ['市场热点', '多维对比', '内容异动'];
const PLATFORM_TABS = ['全平台', '小红书', '蚂蚁财富号', '微信公众号', '雪球'];
const RANKING_LIST_HEIGHT = 'h-[392px]';
const DETAIL_CHANNEL_TABS = PLATFORM_TABS.slice(1);
const HIDDEN_PLATFORMS = new Set(['抖音']);
const INSTITUTION_PAGE_SIZE = 6;
const PRODUCT_PAGE_SIZE = 4;
const MULTI_CHANNEL_PAGE_SIZE = 8;
const BENCHMARK_INSTITUTION = '华夏基金';

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
  全平台: [
    { topic: '黄金概念', count: 1280, growth: 62, share: 48 },
    { topic: 'AI应用', count: 1215, growth: 58, share: 47 },
    { topic: '创新药', count: 1098, growth: 47, share: 44 },
    { topic: 'CPO/光模块', count: 1032, growth: 43, share: 42 },
    { topic: '液冷服务器', count: 944, growth: 39, share: 38 },
    { topic: '红利资产', count: 886, growth: 22, share: 36 },
    { topic: '半导体设备', count: 852, growth: 34, share: 34 },
    { topic: '铜缆高速连接', count: 801, growth: 31, share: 32 },
    { topic: '光纤光缆', count: 766, growth: 28, share: 31 },
    { topic: '消费复苏', count: 642, growth: 17, share: 26 },
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
        { name: '蚂蚁财富号', value: 36 },
        { name: '微信公众号', value: 27 },
        { name: '雪球', value: 21 },
        { name: '抖音', value: 9 },
        { name: '小红书', value: 7 },
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
        { name: '小红书', value: 28 },
        { name: '微信公众号', value: 27 },
        { name: '蚂蚁财富号', value: 18 },
        { name: '抖音', value: 16 },
        { name: '雪球', value: 11 },
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

const CHANNEL_FORMAT_DISTRIBUTION_STATIC = [
  // 来源：assets/静态数据/内容形式分布.xlsx
  // 口径（按表头对齐）：
  // image/video/text => 本周占比（按内容载体聚合到渠道）
  // contentCount => 本周平台总数
  // heatCount => 本周总热度
  // countChange => 数量变化（本周平台总数 - 上周平台总数）
  // heatChange => 热度变化（本周总热度 - 上周总热度）
  { channel: '蚂蚁财富号', image: 100, video: 0, text: 0, bestFormat: '多图', contentCount: 122, heatCount: 308, countChange: '-19', heatChange: '-192' },
  { channel: '微信公众号', image: 100, video: 0, text: 0, bestFormat: '多图', contentCount: 541, heatCount: 8666, countChange: '-28', heatChange: '+714' },
  { channel: '小红书', image: 44.44, video: 34.44, text: 21.11, bestFormat: '多图', contentCount: 90, heatCount: 4864, countChange: '+3', heatChange: '-12240' },
  { channel: '雪球', image: 22.94, video: 0, text: 45.02, bestFormat: '纯文', contentCount: 231, heatCount: 124, countChange: '-1', heatChange: '+25' },
];

const splitShelfDetailTags = (detail) =>
  String(detail ?? '')
    .split(/[，,、;；]/)
    .map((token) => token.trim())
    .filter(Boolean);

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

const formatPercentDisplay = (value) => {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) {
    return '0';
  }

  return Number.isInteger(numeric) ? `${numeric}` : numeric.toFixed(1).replace(/\.0$/, '');
};

const getTopicMetricLabel = (platform) => (platform === '全平台' ? '热度占比' : '渠道渗透率');

const buildMarketTopicDescription = (detail) => {
  if (!detail) {
    return '';
  }

  const rankedPlatforms = DETAIL_CHANNEL_TABS.map((platform) => ({
    platform,
    count: Number(detail.platformBreakdown?.[platform]?.count || 0),
    share: Number(detail.platformBreakdown?.[platform]?.share || 0),
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const dominantPlatform = rankedPlatforms[0];
  const secondaryPlatform = rankedPlatforms[1];
  const institutionCount = detail.institutions?.length || 0;
  const productCount = detail.products?.length || 0;
  const parts = [
    `${detail.topic}近 7 天全平台共监测到 ${detail.totalCount} 条相关内容，占整体话题的 ${formatPercentDisplay(detail.totalShare)}%。`,
  ];

  if (dominantPlatform) {
    let platformSentence = `${dominantPlatform.platform}是当前最主要的承载渠道，内容数为 ${dominantPlatform.count}`;
    if (secondaryPlatform) {
      platformSentence += `，其次是${secondaryPlatform.platform}（${secondaryPlatform.count}条）`;
    }
    platformSentence += '。';
    parts.push(platformSentence);
  }

  if (institutionCount > 0) {
    parts.push(`当前共有 ${institutionCount} 家机构参与该话题，推品记录 ${productCount} 条。`);
  }

  return parts.join('');
};

const buildMarketTopicLifecycle = (detail) => {
  if (!detail) {
    return { progress: 50, stage: '上升期' };
  }

  const totalShare = Number(detail.totalShare || 0);
  const maxPlatformShare = Math.max(
    ...DETAIL_CHANNEL_TABS.map((platform) => Number(detail.platformBreakdown?.[platform]?.share || 0))
  );
  const institutionCount = detail.institutions?.length || 0;

  if (totalShare >= 12 || maxPlatformShare >= 18 || institutionCount >= 20) {
    return { progress: 68, stage: '高峰期' };
  }

  if (totalShare >= 7 || maxPlatformShare >= 10 || institutionCount >= 10) {
    return { progress: 56, stage: '上升期' };
  }

  return { progress: 40, stage: '萌芽期' };
};

const getTopicRankBadgeClass = (index) => {
  if (index === 0) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  if (index === 1) {
    return 'border-slate-300 bg-slate-100 text-slate-700';
  }

  if (index === 2) {
    return 'border-orange-200 bg-orange-50 text-orange-700';
  }

  return 'border-slate-200 bg-white text-slate-500';
};

const paginateItems = (items, currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

const CompactPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = [];
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);
  const normalizedStartPage = Math.max(1, endPage - 2);

  for (let page = normalizedStartPage; page <= endPage; page += 1) {
    visiblePages.push(page);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <div className="text-xs text-slate-500">
        第 <span className="font-semibold text-slate-900">{currentPage}</span> / {totalPages} 页
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            currentPage === 1
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          上一页
        </button>

        <div className="flex items-center gap-1.5">
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 min-w-[32px] rounded-full px-2 text-xs font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

const getFormatValueClass = (value, maxValue) =>
  value === maxValue
    ? 'font-semibold text-slate-900 bg-slate-100'
    : 'text-slate-500';

const parsePercentValue = (value) => Number(String(value || '0').replace('%', '').replace('+', ''));
const parseWanValue = (value) => Number(String(value || '0').replace('万', ''));
const sortArrow = (isActive, direction) => (isActive ? (direction === 'desc' ? '▼' : '▲') : '↕');
const filterVisiblePlatforms = (platforms = []) => platforms.filter((platform) => !HIDDEN_PLATFORMS.has(platform));
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
    institution: BENCHMARK_INSTITUTION,
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
  const [shelfListTab, setShelfListTab] = useState('基金货架');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedProductForCompetitors, setSelectedProductForCompetitors] = useState(null);
  const [competitorSortConfig, setCompetitorSortConfig] = useState({ key: 'monthlyGain', direction: 'desc' });
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState(false);
  const [isMissingTopicModalOpen, setIsMissingTopicModalOpen] = useState(false);
  const [isTopicCompareExpanded, setIsTopicCompareExpanded] = useState(false);
  const [isHighAlignModalOpen, setIsHighAlignModalOpen] = useState(false);
  const [viralWallPlatformTab, setViralWallPlatformTab] = useState('小红书');
  const [institutionPage, setInstitutionPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [multiChannelProductPage, setMultiChannelProductPage] = useState(1);

  const viralPostsVisible = useMemo(
    () => VIRAL_POSTS.filter((p) => !HIDDEN_PLATFORMS.has(p.platform)),
    []
  );
  const viralPlatformTabs = useMemo(() => {
    const order = ['小红书', '蚂蚁财富号', '微信公众号', '雪球'];
    const present = new Set(viralPostsVisible.map((p) => p.platform));
    return order.filter((name) => present.has(name));
  }, [viralPostsVisible]);
  const selectedViralTab =
    viralPlatformTabs.includes(viralWallPlatformTab) ? viralWallPlatformTab : viralPlatformTabs[0] ?? '';
  const viralPostsForWall = useMemo(
    () => viralPostsVisible.filter((p) => p.platform === selectedViralTab),
    [viralPostsVisible, selectedViralTab]
  );

  const topicList = useMemo(
    () => (MARKET_TOPIC_HEAT_BY_PLATFORM[activePlatform] || TOPIC_HEAT_BY_PLATFORM[activePlatform] || []).slice(0, 10),
    [activePlatform]
  );
  const topicListMaxCount = useMemo(
    () => Math.max(...topicList.map((item) => Number(item.count || 0)), 1),
    [topicList]
  );
  const topicListMaxShare = useMemo(
    () => Math.max(...topicList.map((item) => Number(item.share || 0)), 1),
    [topicList]
  );
  const selectedTopicMarketDetail = useMemo(
    () => (selectedTopic ? MARKET_TOPIC_DETAILS[selectedTopic] || null : null),
    [selectedTopic]
  );
  const contentFormatList = useMemo(() => CHANNEL_FORMAT_DISTRIBUTION_STATIC, []);
  const contentProductHotList = useMemo(
    () => {
      const aggregatedMap = new Map();

      Object.values(MARKET_TOPIC_DETAILS).forEach((detail) => {
        (detail.products || []).forEach((product) => {
          const code = String(product.code || '').trim();
          const productName = String(product.product || '').trim();
          const institution = String(product.institution || '').trim();

          if (!productName || productName === institution) {
            return;
          }

          // 以产品代码（有则用）或名称为键，跨机构累加出现次数
          const key = code || productName;
          const count = Number(product.count || 0);
          const ratio = Number(product.ratio || 0);
          const platforms = filterVisiblePlatforms((product.platformMix || []).map((item) => item.name).filter(Boolean));
          const current = aggregatedMap.get(key);

          if (!current) {
            aggregatedMap.set(key, {
              product: productName,
              code,
              institution,
              topic: detail.topic,
              platforms,
              count,
              ratio,
              value: count,
            });
            return;
          }

          current.count += count;
          current.ratio = Math.max(current.ratio, ratio);
          current.platforms = Array.from(new Set([...current.platforms, ...platforms]));

          if (count > current.value) {
            current.value = count;
            current.topic = detail.topic;
            current.institution = institution;
          }
        });
      });

      return [...aggregatedMap.values()]
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          if (b.ratio !== a.ratio) return b.ratio - a.ratio;
          return a.product.localeCompare(b.product, 'zh-CN');
        });
    },
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
  const shelfExposureList = useMemo(() => {
    const shelfTab = shelfListTab === '支付宝货架' ? '基金货架' : shelfListTab;
    const source =
      shelfTab === '联合运营'
        ? JOINT_OPERATION_SHELF_LIST
        : shelfTab === 'ETF曝光位'
          ? ETF_EXPOSURE_COUNT_LIST
          : SHELF_EXPOSURE_PRODUCT_LIST;
    return source.map((item, index) => ({
      ...item,
      tags: splitShelfDetailTags(item.detail),
      rowKey: `${shelfTab}-${index}-${item.name}`,
    }));
  }, [shelfListTab]);

  const multiChannelProductHotListLegacy = useMemo(() => {
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

  const multiChannelProductHotList = useMemo(() => {
    const metricByCode = new Map(
      MULTI_CHANNEL_PRODUCT_HEAT_STATIC.filter((item) => item.code).map((item) => [String(item.code).trim(), item])
    );
    const metricByName = new Map(MULTI_CHANNEL_PRODUCT_HEAT_STATIC.map((item) => [String(item.product || '').trim(), item]));

    const formatWan = (value) => {
      const numeric = Number(value || 0);
      if (!numeric) return '-';
      return numeric >= 10000 ? `${(numeric / 10000).toFixed(1)}万` : `${numeric}`;
    };

    const formatSigned = (value, suffix = '') => {
      const numeric = Number(value || 0);
      if (!numeric) return '-';
      const sign = numeric > 0 ? '+' : '';
      return `${sign}${numeric}${suffix}`;
    };

    const mergedMap = new Map();

    const mergeVisibleProduct = (productName, productCode, institution, sourceLabel, sourceOrder) => {
      const normalizedName = String(productName || '').trim();
      const normalizedCode = productCode && productCode !== '--' ? String(productCode).trim() : '';

      if (!normalizedName) {
        return;
      }

      const matchedMetric = (normalizedCode ? metricByCode.get(normalizedCode) : null) || metricByName.get(normalizedName) || null;
      const key = normalizedCode ? `code:${normalizedCode}` : `name:${normalizedName}`;
      const existing = mergedMap.get(key);

      if (existing) {
        existing.sources = Array.from(new Set([...existing.sources, sourceLabel]));
        existing.sourceOrder = Math.max(existing.sourceOrder, sourceOrder);
        if ((!existing.code || existing.code === '--') && normalizedCode) {
          existing.code = normalizedCode;
        }
        if ((!existing.institution || existing.institution === '--') && institution) {
          existing.institution = institution;
        }
        if (!existing.metricMatched && matchedMetric) {
          existing.metricMatched = true;
          existing.latestWatchlistRaw = Number(matchedMetric.latestWatchlist || 0);
          existing.recentWatchlistRaw = Number(matchedMetric.recentWatchlist || 0);
          existing.holderCountRaw = Number(matchedMetric.holderCount || 0);
          existing.holderWeeklyChangeRaw = Number(matchedMetric.holderWeeklyChange || 0);
          existing.influencerHolderChangeRaw = Number(matchedMetric.influencerHolderChange || 0);
          existing.influencerAmountChangeRaw = Number(matchedMetric.influencerAmountChange || 0);
          existing.avgSipCountRaw = Number(matchedMetric.avgSipCount || 0);
          existing.eastmoneyRankAppearRaw = Number(matchedMetric.eastmoneyRankAppear || 0);
          existing.purchaseCountRaw = Number(matchedMetric.purchaseCount || 0);
        }
        return;
      }

      mergedMap.set(key, {
        product: normalizedName,
        code: normalizedCode || String(matchedMetric?.code || '').trim() || '--',
        institution: institution || matchedMetric?.institution || '--',
        sources: [sourceLabel],
        sourceOrder,
        metricMatched: Boolean(matchedMetric),
        latestWatchlistRaw: Number(matchedMetric?.latestWatchlist || 0),
        recentWatchlistRaw: Number(matchedMetric?.recentWatchlist || 0),
        holderCountRaw: Number(matchedMetric?.holderCount || 0),
        holderWeeklyChangeRaw: Number(matchedMetric?.holderWeeklyChange || 0),
        influencerHolderChangeRaw: Number(matchedMetric?.influencerHolderChange || 0),
        influencerAmountChangeRaw: Number(matchedMetric?.influencerAmountChange || 0),
        avgSipCountRaw: Number(matchedMetric?.avgSipCount || 0),
        eastmoneyRankAppearRaw: Number(matchedMetric?.eastmoneyRankAppear || 0),
        purchaseCountRaw: Number(matchedMetric?.purchaseCount || 0),
      });
    };

    contentProductHotList.forEach((item, index) => {
      mergeVisibleProduct(item.product, item.code, item.institution, '内容推品', 200 - index * 5);
    });

    // 合并全部三个货架列表，不受 tab 限制
    const allShelfItems = [
      ...SHELF_EXPOSURE_PRODUCT_LIST,
      ...ETF_EXPOSURE_COUNT_LIST,
      ...JOINT_OPERATION_SHELF_LIST,
    ];
    allShelfItems.forEach((item, index) => {
      mergeVisibleProduct(item.name, item.code, item.institution, '货架产品', 120 - index * 3);
    });

    return [...mergedMap.values()]
      .sort((a, b) => {
        if (b.latestWatchlistRaw !== a.latestWatchlistRaw) {
          return b.latestWatchlistRaw - a.latestWatchlistRaw;
        }
        if (b.purchaseCountRaw !== a.purchaseCountRaw) {
          return b.purchaseCountRaw - a.purchaseCountRaw;
        }
        if (b.sourceOrder !== a.sourceOrder) {
          return b.sourceOrder - a.sourceOrder;
        }
        return a.product.localeCompare(b.product, 'zh-CN');
      })
      .map((item) => ({
        ...item,
        latestWatchlist: formatWan(item.latestWatchlistRaw),
        recentWatchlist: formatSigned(item.recentWatchlistRaw),
        holderCount: formatWan(item.holderCountRaw),
        holderWeeklyChange: formatSigned(item.holderWeeklyChangeRaw),
        influencerHolderChange: formatSigned(item.influencerHolderChangeRaw),
        influencerAmountChange: formatSigned(item.influencerAmountChangeRaw),
        avgSipCount: item.avgSipCountRaw ? `${item.avgSipCountRaw}` : '-',
        eastmoneyRankAppear: item.eastmoneyRankAppearRaw ? `${item.eastmoneyRankAppearRaw}` : '-',
        purchaseCount: formatWan(item.purchaseCountRaw),
      }));
  }, [contentProductHotList]);
  const paginatedMultiChannelProductHotList = useMemo(
    () => paginateItems(multiChannelProductHotList, multiChannelProductPage, MULTI_CHANNEL_PAGE_SIZE),
    [multiChannelProductHotList, multiChannelProductPage]
  );
  const multiChannelProductTotalPages = useMemo(
    () => Math.max(1, Math.ceil(multiChannelProductHotList.length / MULTI_CHANNEL_PAGE_SIZE)),
    [multiChannelProductHotList]
  );

  useEffect(() => {
    setMultiChannelProductPage((currentPage) => Math.min(currentPage, multiChannelProductTotalPages));
  }, [multiChannelProductTotalPages]);

  const modalProducts = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    if (selectedTopicMarketDetail) {
      return selectedTopicMarketDetail.products || [];
    }

    return TOPIC_PRODUCT_DETAILS[selectedTopic] || [];
  }, [selectedTopic, selectedTopicMarketDetail]);

  const channelHeatList = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    if (selectedTopicMarketDetail) {
      return DETAIL_CHANNEL_TABS.map((platform) => ({
        platform,
        value: Number(selectedTopicMarketDetail.platformBreakdown?.[platform]?.share || 0),
        count: Number(selectedTopicMarketDetail.platformBreakdown?.[platform]?.count || 0),
      }));
    }

    return DETAIL_CHANNEL_TABS.map((platform) => {
      const profileValue = TOPIC_CHANNEL_HEAT_PROFILE[selectedTopic]?.[platform];
      const matched = (TOPIC_HEAT_BY_PLATFORM[platform] || []).find((item) => item.topic === selectedTopic);
      return {
        platform,
        count: Number(matched?.count || 0),
        value:
          profileValue ??
          Math.max(45, Math.min(92, (matched?.share ?? buildFallbackChannelHeat(selectedTopic, platform)) + (matched?.growth ?? 0) * 0.28)),
      };
    });
  }, [selectedTopic, selectedTopicMarketDetail]);

  const institutionShareList = useMemo(() => {
    if (selectedTopicMarketDetail) {
      return selectedTopicMarketDetail.institutions || [];
    }

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
  }, [modalProducts, selectedTopicMarketDetail]);
  const paginatedInstitutionShareList = useMemo(
    () => paginateItems(institutionShareList, institutionPage, INSTITUTION_PAGE_SIZE),
    [institutionShareList, institutionPage]
  );
  const institutionTotalPages = useMemo(
    () => Math.max(1, Math.ceil(institutionShareList.length / INSTITUTION_PAGE_SIZE)),
    [institutionShareList]
  );
  const paginatedModalProducts = useMemo(
    () => paginateItems(modalProducts, productPage, PRODUCT_PAGE_SIZE),
    [modalProducts, productPage]
  );
  const productTotalPages = useMemo(
    () => Math.max(1, Math.ceil(modalProducts.length / PRODUCT_PAGE_SIZE)),
    [modalProducts]
  );

  const topicCurrentStats = useMemo(() => {
    if (!selectedTopic) {
      return null;
    }

    if (selectedTopicMarketDetail) {
      const matched = (MARKET_TOPIC_HEAT_BY_PLATFORM[activePlatform] || []).find((item) => item.topic === selectedTopic);
      if (matched) {
        return matched;
      }

      const platformStats = selectedTopicMarketDetail.platformBreakdown?.[activePlatform];
      return {
        topic: selectedTopic,
        count: activePlatform === '全平台' ? selectedTopicMarketDetail.totalCount : Number(platformStats?.count || 0),
        share: activePlatform === '全平台' ? selectedTopicMarketDetail.totalShare : Number(platformStats?.share || 0),
      };
    }

    return (TOPIC_HEAT_BY_PLATFORM[activePlatform] || []).find((item) => item.topic === selectedTopic) || null;
  }, [activePlatform, selectedTopic, selectedTopicMarketDetail]);

  const topicDescription = useMemo(() => {
    if (!selectedTopic) {
      return '';
    }

    if (selectedTopicMarketDetail) {
      return buildMarketTopicDescription(selectedTopicMarketDetail);
    }

    return (
      TOPIC_SUMMARY[selectedTopic] ||
      `${selectedTopic}相关内容近期维持较高讨论度，机构内容主要围绕主题景气验证、资产配置逻辑与产品承接机会展开。`
    );
  }, [selectedTopic, selectedTopicMarketDetail]);

  const topicLifecycle = useMemo(() => {
    if (!selectedTopic) {
      return { progress: 50, stage: '上升期' };
    }

    if (selectedTopicMarketDetail) {
      return buildMarketTopicLifecycle(selectedTopicMarketDetail);
    }

    return TOPIC_LIFECYCLE[selectedTopic] || { progress: 52, stage: '上升期' };
  }, [selectedTopic, selectedTopicMarketDetail]);

  const benchmarkTopicCounts = useMemo(() => {
    const counts = {};
    Object.entries(MARKET_TOPIC_DETAILS).forEach(([topic, detail]) => {
      const inst = detail.institutions.find((i) => i.institution === BENCHMARK_INSTITUTION);
      if (inst) counts[topic] = inst.count;
    });
    return counts;
  }, []);

  const benchmarkProducts = useMemo(() => {
    const seen = new Map();
    Object.entries(MARKET_TOPIC_DETAILS).forEach(([topic, detail]) => {
      detail.products.forEach((prod) => {
        if (!prod.code || !prod.institution.includes(BENCHMARK_INSTITUTION)) return;
        const key = prod.code;
        if (!seen.has(key) || prod.count > seen.get(key).platformContentCount) {
          const platforms = prod.platformMix.filter((m) => m.value > 0).map((m) => m.name);
          seen.set(key, {
            code: prod.code,
            name: prod.product,
            topic,
            topicHeat: Math.round(detail.totalShare),
            platforms,
            platformContentCount: prod.count,
            contentHeat: Math.min(99, Math.max(30, Math.round(prod.ratio * 5 + prod.count * 3))),
          });
        }
      });
    });
    return [...seen.values()].sort((a, b) => b.platformContentCount - a.platformContentCount).slice(0, 6);
  }, []);

  const topicCompareCards = useMemo(() => {
    // 以华夏基金实际有内容的所有话题为源
    return Object.entries(benchmarkTopicCounts)
      .filter(([, count]) => count > 0)
      .map(([topic, selfCount]) => {
        const detail = MARKET_TOPIC_DETAILS[topic];
        if (!detail) return null;
        // 行业平均 = 话题总内容数 / 参与该话题的机构数
        const institutionCount = detail.institutions.length || 1;
        const industryAverage = Math.round(detail.totalCount / institutionCount);
        // gapRatio > 1 表示我方高于行业平均，< 1 表示尚有差距
        const gapRatio = selfCount / Math.max(industryAverage, 1);
        const level = gapRatio >= 1.5 ? 'blue' : gapRatio >= 0.8 ? 'potential' : 'urgent';
        return { topic, industryAverage, selfCount, gapRatio, level };
      })
      .filter(Boolean)
      .sort((a, b) => b.selfCount - a.selfCount);
  }, [benchmarkTopicCounts]);

  const topicCompareSummary = useMemo(() => {
    const allMarketTopics = Object.keys(MARKET_TOPIC_DETAILS);
    const totalMarketTopics = allMarketTopics.length;
    // 机构有内容的话题数
    const coveredCount = allMarketTopics.filter((topic) => (benchmarkTopicCounts[topic] || 0) > 0).length;
    // 主线相似度 = 机构覆盖话题数 / 市场话题总数
    const mainlineSimilarity = Math.round((coveredCount / Math.max(totalMarketTopics, 1)) * 100);
    // 缺失热点 = 市场话题总数 - 机构有内容的话题数
    const missingHotTopics = totalMarketTopics - coveredCount;

    // 平均偏离：跨所有话题计算 |selfCount - industryAverage| / industryAverage 的均值
    const deviationList = allMarketTopics.map((topic) => {
      const detail = MARKET_TOPIC_DETAILS[topic];
      const institutionCount = detail.institutions.length || 1;
      const industryAverage = detail.totalCount / institutionCount;
      const selfCount = benchmarkTopicCounts[topic] || 0;
      return Math.min(1, Math.abs(industryAverage - selfCount) / Math.max(industryAverage, 1));
    });
    const averageDeviation = Math.round(
      (deviationList.reduce((sum, v) => sum + v, 0) / Math.max(deviationList.length, 1)) * 100
    );

    return { mainlineSimilarity, averageDeviation, missingHotTopics };
  }, [benchmarkTopicCounts]);

  const highAlignInstitutionList = useMemo(() => {
    const allMarketTopics = Object.keys(MARKET_TOPIC_DETAILS);
    const totalMarketTopics = allMarketTopics.length;
    // 聚合每个机构覆盖的话题数
    const instCoverage = {};
    allMarketTopics.forEach((topic) => {
      const detail = MARKET_TOPIC_DETAILS[topic];
      (detail.institutions || []).forEach((inst) => {
        if ((inst.count || 0) > 0) {
          if (!instCoverage[inst.institution]) instCoverage[inst.institution] = { covered: 0, topics: [] };
          instCoverage[inst.institution].covered += 1;
          instCoverage[inst.institution].topics.push({ topic, count: inst.count });
        }
      });
    });
    return Object.entries(instCoverage)
      .map(([institution, { covered, topics }]) => ({
        institution,
        similarity: Math.round((covered / totalMarketTopics) * 100),
        coveredTopics: covered,
        topTopics: topics.sort((a, b) => b.count - a.count).slice(0, 5),
      }))
      .filter((item) => item.similarity > 70)
      .sort((a, b) => b.similarity - a.similarity);
  }, []);

  const missingTopicList = useMemo(() => {
    return Object.entries(MARKET_TOPIC_DETAILS)
      .filter(([topic]) => (benchmarkTopicCounts[topic] || 0) === 0)
      .map(([topic, detail]) => {
        const platformBreakdown = DETAIL_CHANNEL_TABS.map((platform) => ({
          platform,
          count: Number(detail.platformBreakdown?.[platform]?.count || 0),
        }));
        const topInstitutions = [...(detail.institutions || [])]
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        return {
          topic,
          totalCount: detail.totalCount,
          totalShare: detail.totalShare,
          platformBreakdown,
          topInstitutions,
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [benchmarkTopicCounts]);

  const channelCompareMatrixRows = useMemo(
    () => [
      {
        institution: '易方达基金',
        current: 132,
        previous: 97,
        tendency: '微信公众号',
        breakdown: [
          { name: '微信公众号', value: 53, colorClass: 'bg-emerald-500' },
          { name: '雪球', value: 35, colorClass: 'bg-blue-500' },
          { name: '蚂蚁财富号', value: 8, colorClass: 'bg-amber-400' },
          { name: '小红书', value: 5, colorClass: 'bg-pink-500' },
        ],
        totalChange: '+36.1%',
        shiftText: '雪球 +6.0pct',
        shiftPositive: true,
        summary: '仍以微信公众号为主，雪球协同放量，本周132条。',
      },
      {
        institution: '华宝基金',
        current: 115,
        previous: 100,
        tendency: '雪球',
        breakdown: [
          { name: '雪球', value: 76, colorClass: 'bg-blue-500' },
          { name: '微信公众号', value: 24, colorClass: 'bg-emerald-500' },
        ],
        totalChange: '+15.0%',
        shiftText: '微信公众号 +8.3pct',
        shiftPositive: true,
        summary: '内容重心偏向雪球，本周115条，适合热点型与交易型分发。',
      },
      {
        institution: '华夏基金',
        current: 101,
        previous: 82,
        tendency: '微信公众号+雪球',
        breakdown: [
          { name: '微信公众号', value: 44, colorClass: 'bg-emerald-500' },
          { name: '雪球', value: 44, colorClass: 'bg-blue-500' },
          { name: '蚂蚁财富号', value: 10, colorClass: 'bg-amber-400' },
          { name: '小红书', value: 3, colorClass: 'bg-pink-500' },
        ],
        totalChange: '+23.2%',
        shiftText: '雪球 +9.4pct',
        shiftPositive: true,
        summary: '微信公众号与雪球基本并行分发，本周101条，平台结构更均衡。',
      },
      {
        institution: '工银瑞信基金',
        current: 66,
        previous: 41,
        tendency: '微信公众号',
        breakdown: [
          { name: '微信公众号', value: 59, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 23, colorClass: 'bg-amber-400' },
          { name: '雪球', value: 18, colorClass: 'bg-blue-500' },
        ],
        totalChange: '+61.0%',
        shiftText: '微信公众号 -14.1pct',
        shiftPositive: false,
        summary: '主阵地在微信公众号，蚂蚁财富号承担了较强补充分发。',
      },
      {
        institution: '鹏华基金',
        current: 65,
        previous: 30,
        tendency: '雪球+小红书',
        breakdown: [
          { name: '雪球', value: 40, colorClass: 'bg-blue-500' },
          { name: '小红书', value: 32, colorClass: 'bg-pink-500' },
          { name: '微信公众号', value: 25, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 3, colorClass: 'bg-amber-400' },
        ],
        totalChange: '+116.7%',
        shiftText: '雪球 +10.0pct',
        shiftPositive: true,
        summary: '雪球与小红书基本并行分发，本周65条，平台结构更均衡。',
      },
      {
        institution: '富国基金',
        current: 62,
        previous: 44,
        tendency: '微信公众号+雪球',
        breakdown: [
          { name: '微信公众号', value: 37, colorClass: 'bg-emerald-500' },
          { name: '雪球', value: 35, colorClass: 'bg-blue-500' },
          { name: '蚂蚁财富号', value: 19, colorClass: 'bg-amber-400' },
          { name: '小红书', value: 8, colorClass: 'bg-pink-500' },
        ],
        totalChange: '+40.9%',
        shiftText: '雪球 -14.5pct',
        shiftPositive: false,
        summary: '微信公众号与雪球基本并行分发，本周62条，平台结构更均衡。',
      },
      {
        institution: '银华基金',
        current: 52,
        previous: 44,
        tendency: '微信公众号',
        breakdown: [
          { name: '微信公众号', value: 56, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 27, colorClass: 'bg-amber-400' },
          { name: '雪球', value: 10, colorClass: 'bg-blue-500' },
          { name: '小红书', value: 8, colorClass: 'bg-pink-500' },
        ],
        totalChange: '+18.2%',
        shiftText: '蚂蚁财富号 +8.7pct',
        shiftPositive: true,
        summary: '主阵地在微信公众号，蚂蚁财富号承担了较强补充分发。',
      },
      {
        institution: '南方基金',
        current: 51,
        previous: 37,
        tendency: '微信公众号',
        breakdown: [
          { name: '微信公众号', value: 53, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 35, colorClass: 'bg-amber-400' },
          { name: '小红书', value: 12, colorClass: 'bg-pink-500' },
        ],
        totalChange: '+37.8%',
        shiftText: '微信公众号 -11.9pct',
        shiftPositive: false,
        summary: '主阵地在微信公众号，蚂蚁财富号承担了较强补充分发。',
      },
      {
        institution: '国泰基金',
        current: 43,
        previous: 45,
        tendency: '微信公众号+蚂蚁财富号',
        breakdown: [
          { name: '微信公众号', value: 40, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 35, colorClass: 'bg-amber-400' },
          { name: '雪球', value: 16, colorClass: 'bg-blue-500' },
          { name: '小红书', value: 9, colorClass: 'bg-pink-500' },
        ],
        totalChange: '-4.4%',
        shiftText: '蚂蚁财富号 +10.4pct',
        shiftPositive: true,
        summary: '微信公众号与蚂蚁财富号基本并行分发，本周43条，平台结构更均衡。',
      },
      {
        institution: '华安基金',
        current: 42,
        previous: 36,
        tendency: '微信公众号',
        breakdown: [
          { name: '微信公众号', value: 76, colorClass: 'bg-emerald-500' },
          { name: '蚂蚁财富号', value: 12, colorClass: 'bg-amber-400' },
          { name: '小红书', value: 7, colorClass: 'bg-pink-500' },
          { name: '雪球', value: 5, colorClass: 'bg-blue-500' },
        ],
        totalChange: '+16.7%',
        shiftText: '雪球 +4.8pct',
        shiftPositive: true,
        summary: '以微信公众号为核心阵地，本周42条，平台投放较集中。',
      },
    ],
    []
  );

  const contentMutationInstitutionRows = useMemo(
    () =>
      channelCompareMatrixRows.map((item) => ({
        institution: item.institution,
        alignmentScore: '',
        alignedTopics: [],
        action: `本周 ${item.current} 条，上周 ${item.previous} 条；${item.summary}`,
        tendency: item.tendency,
        totalChange: item.totalChange,
        shiftText: item.shiftText,
        shiftPositive: item.shiftPositive,
      })),
    [channelCompareMatrixRows]
  );

  const contentMutationResourceCards = useMemo(() => {
    // 内容推品：name → count
    const contentPushMap = new Map();
    contentProductHotList.forEach((item) => {
      if (!item.product || item.institution === '--') return;
      const key = item.product;
      if (!contentPushMap.has(key)) {
        contentPushMap.set(key, { name: item.product, code: item.code || '--', institution: item.institution, count: item.count });
      }
    });

    // 货架产品：name → sources[]
    const shelfSources = [
      { label: '基金货架', items: SHELF_EXPOSURE_PRODUCT_LIST, tone: 'amber' },
      { label: 'ETF曝光位', items: ETF_EXPOSURE_COUNT_LIST, tone: 'violet' },
      { label: '联合运营', items: JOINT_OPERATION_SHELF_LIST, tone: 'emerald' },
    ];
    const shelfMap = new Map();
    shelfSources.forEach(({ label, items, tone }) => {
      items.forEach((row) => {
        if (!row.name) return;
        if (!shelfMap.has(row.name)) shelfMap.set(row.name, { name: row.name, code: row.code, institution: row.institution, shelfSources: [] });
        const entry = shelfMap.get(row.name);
        if (!entry.shelfSources.find((s) => s.label === label)) {
          entry.shelfSources.push({ label, count: row.count, tone });
        }
      });
    });

    // 重合：同时在内容推品 + 至少一处货架
    const overlapProducts = [];
    const contentOnlyProducts = [];
    const shelfOnlyProducts = [];

    contentPushMap.forEach((prod, name) => {
      if (shelfMap.has(name)) {
        overlapProducts.push({
          name,
          code: prod.code,
          institution: prod.institution,
          contentCount: prod.count,
          shelfSources: shelfMap.get(name).shelfSources,
        });
      } else {
        contentOnlyProducts.push(prod);
      }
    });
    shelfMap.forEach((prod, name) => {
      if (!contentPushMap.has(name)) {
        shelfOnlyProducts.push({ ...prod, contentCount: null });
      }
    });

    // 重合产品按内容数降序
    overlapProducts.sort((a, b) => (b.contentCount || 0) - (a.contentCount || 0));
    contentOnlyProducts.sort((a, b) => (b.count || 0) - (a.count || 0));
    shelfOnlyProducts.sort((a, b) => a.name.localeCompare(b.name));

    return { overlapProducts, contentOnlyProducts, shelfOnlyProducts };
  }, [contentProductHotList]);

  const competitorModalList = useMemo(() => {
    if (!selectedProductForCompetitors) {
      return [];
    }

    const rawProducts = MARKET_TOPIC_DETAILS[selectedProductForCompetitors.topic]?.products || [];
    const topicProducts = rawProducts.map((prod) => {
      const heatScore = Math.min(99, Math.max(20, Math.round(prod.ratio * 5 + prod.count * 3)));
      return {
        ...prod,
        heat: heatScore,
        heatLabel: heatScore >= 80 ? '高热度' : heatScore >= 60 ? '中高热度' : '中热度',
      };
    });
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
          {/* 生成选题计划按钮已隐藏 */}
        </div>
      </section>

      {activeTab === '市场热点' && (
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">话题热度榜</h3>
                  <p className="mt-1 text-xs text-slate-500">市场全量 {Object.keys(MARKET_TOPIC_DETAILS).length} 个话题，展示当前平台 Top 10（全平台 {(MARKET_TOPIC_HEAT_BY_PLATFORM['全平台'] || []).length} 个话题）</p>
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

              <div className={`${RANKING_LIST_HEIGHT} space-y-2.5 overflow-y-auto pr-1`}>
                {topicList.map((item, index) => (
                  <div
                    key={`${activePlatform}-${item.topic}`}
                    className={`rounded-xl border bg-white px-3 py-2.5 transition-shadow hover:shadow-sm ${
                      index < 3 ? 'border-slate-300 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.45)]' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-full border px-1.5 text-[11px] font-semibold ${getTopicRankBadgeClass(index)}`}
                          >
                            {index + 1}
                          </span>
                          <span className="truncate text-sm font-semibold text-slate-900">{item.topic}</span>
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            {getTopicMetricLabel(activePlatform)} {formatPercentDisplay(item.share)}%
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
                            <span className="text-[11px] text-slate-400">内容数量</span>
                            <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
                            <span className="text-[11px] text-slate-400">{getTopicMetricLabel(activePlatform)}</span>
                            <span className="text-sm font-semibold text-slate-900">{formatPercentDisplay(item.share)}%</span>
                          </div>
                        </div>

                        <div className="mt-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>话题强度（相对榜首）</span>
                            <span>内容数 {item.count}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-sky-500"
                              style={{ width: `${Math.max((Number(item.count || 0) / topicListMaxCount) * 100, 8)}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                          {item.growth !== undefined && item.growth !== null && (
                            <div className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-600">
                              近 7 日 +{formatPercentDisplay(item.growth)}%
                            </div>
                          )}

                          {activePlatform !== '全平台' && item.growth === undefined && item.growth !== 0 && (
                            <div className="text-slate-400">
                              当前平台按渗透率与内容数排序展示
                            </div>
                          )}

                          {activePlatform === '全平台' && (
                            <div className="text-slate-400">
                              最高占比 {formatPercentDisplay(topicListMaxShare)}%
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2.5">
                        <div className="rounded-2xl bg-slate-50 px-3 py-1.5 text-right">
                          <div className="text-[11px] text-slate-400">排名强度</div>
                          <div className="mt-0.5 text-base font-semibold text-slate-900">#{index + 1}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTopic(item.topic);
                            setInstitutionPage(1);
                            setProductPage(1);
                          }}
                          className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">内容形式分布</h3>
                </div>
                <div className="shrink-0 text-xs font-medium text-slate-500">近 7 天 · 渠道维度</div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-max min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="w-[260px] min-w-[260px] px-4 py-3 font-medium">渠道</th>
                        <th className="w-[88px] px-2 py-3 font-medium">多图</th>
                        <th className="w-[88px] px-2 py-3 font-medium">视频</th>
                        <th className="w-[88px] px-2 py-3 font-medium">纯文</th>
                        <th className="px-4 py-3 font-medium">最佳形式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentFormatList.map((item) => {
                        const rowMax = Math.max(item.image, item.video, item.text);

                        return (
                        <tr key={item.channel} className="border-t border-slate-200">
                          <td className="w-[260px] min-w-[260px] px-4 py-3 font-semibold text-slate-900">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <span
                                  className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                  title={item.channel}
                                  aria-label={item.channel}
                                >
                                  {PLATFORM_ICON_META[item.channel]?.logo ? (
                                    <img src={PLATFORM_ICON_META[item.channel].logo} alt={item.channel} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-[9px] text-slate-400">-</span>
                                  )}
                                </span>
                                  <span>{item.channel}</span>
                                </span>
                              </div>
                              <div className="whitespace-nowrap text-[13px] font-semibold">
                                <span className="text-slate-500">内容数量 </span>
                                <span className="text-sky-700">{item.contentCount}</span>
                                <span className="text-slate-400"> · </span>
                                <span className="text-slate-500">热度 </span>
                                <span className="text-rose-700">{item.heatCount}</span>
                              </div>
                              <div className="whitespace-nowrap text-[12px] font-medium text-slate-600">
                                较上周数量变化 {item.countChange} · 热度变化 {item.heatChange}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`inline-flex min-w-[46px] justify-center rounded-md px-1.5 py-1 ${getFormatValueClass(item.image, rowMax)}`}>
                              {item.image}%
                            </span>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`inline-flex min-w-[46px] justify-center rounded-md px-1.5 py-1 ${getFormatValueClass(item.video, rowMax)}`}>
                              {item.video}%
                            </span>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`inline-flex min-w-[46px] justify-center rounded-md px-1.5 py-1 ${getFormatValueClass(item.text, rowMax)}`}>
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
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">内容推品列表</div>
                <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">机构推品表</div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {contentProductHotList.map((item) => (
                  <div key={`${item.product}-${item.institution}`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{item.product}</span>
                        <span className="inline-flex items-center gap-1">
                          {filterVisiblePlatforms(item.platforms).map((platform) => {
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
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">{item.count}</div>
                        <div className="text-[11px] text-slate-400">关联内容</div>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>基金代码 {item.code}</span>
                      <span>·</span>
                      <span>{item.institution}</span>
                      <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[11px] text-sky-700">主关联话题 {item.topic}</span>
                      <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[11px] text-rose-700">推品占比 {formatPercentDisplay(item.ratio)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">货架产品列表</div>
                <div className="flex items-center gap-2">
                  {['基金货架', 'ETF曝光位', '联合运营'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setShelfListTab(tab)}
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        shelfListTab === tab || (tab === '基金货架' && shelfListTab === '支付宝货架')
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {shelfExposureList.map((item) => (
                  <div key={item.rowKey} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="inline-flex min-w-0 flex-1 items-baseline gap-2">
                        <span className="text-sm font-medium text-slate-900">{item.name}</span>
                        <span className="shrink-0 font-mono text-xs text-slate-500">{item.code}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                        曝光次数 {item.count}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={`${item.rowKey}-${tag}`}
                          className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.institution}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">多渠道产品热度列表</div>
                <div className="mt-1 text-xs text-slate-500">部分数据为空的原因是平台披露仅以万为单位。</div>
              </div>
              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">内容推品 + 货架并集</div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-[1700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">基金名称</th>
                    <th className="px-4 py-3 font-medium">基金代码</th>
                    <th className="px-4 py-3 font-medium">机构</th>
                    <th className="px-4 py-3 font-medium">当前自选</th>
                    <th className="px-4 py-3 font-medium">周自选人数变化</th>
                    <th className="px-4 py-3 font-medium">当前持有</th>
                    <th className="px-4 py-3 font-medium">周持有人数变化</th>
                    <th className="px-4 py-3 font-medium">周持仓达人数量变化</th>
                    <th className="px-4 py-3 font-medium">周达人实盘金额变化</th>
                    <th className="px-4 py-3 font-medium">周人均定投次数</th>
                    <th className="px-4 py-3 font-medium">周出现在榜单的次数</th>
                    <th className="px-4 py-3 font-medium">当日购买笔数</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMultiChannelProductHotList.map((row, index) => (
                    <tr
                      key={`${row.product}-${row.institution}`}
                      className={`border-t border-slate-200 text-slate-800 transition hover:bg-sky-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div>{row.product}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {row.sources.map((source) => (
                            <span
                              key={`${row.product}-${source}`}
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                                source === '内容推品' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </td>
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

            <CompactPagination
              currentPage={multiChannelProductPage}
              totalPages={multiChannelProductTotalPages}
              onPageChange={setMultiChannelProductPage}
            />
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
              近 7 天 · 全量 {Object.keys(MARKET_TOPIC_DETAILS).length} 个话题 · 市场 vs 华夏基金
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <article className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">主线相似度</div>
              <div className="mt-2 text-4xl font-bold tabular-nums text-slate-900">{topicCompareSummary.mainlineSimilarity}<span className="ml-0.5 text-2xl font-semibold text-slate-500">%</span></div>
            </article>
            <article className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">平均偏离</div>
              <div className="mt-2 text-4xl font-bold tabular-nums text-slate-900">{topicCompareSummary.averageDeviation}<span className="ml-0.5 text-2xl font-semibold text-slate-500">%</span></div>
            </article>
            <article className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">缺失热点</span>
                <button
                  type="button"
                  onClick={() => setIsMissingTopicModalOpen(true)}
                  className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-white"
                >
                  查看
                </button>
              </div>
              <div className="mt-2 text-4xl font-bold tabular-nums text-rose-600">{topicCompareSummary.missingHotTopics}<span className="ml-1 text-sm font-medium text-slate-400">个话题</span></div>
            </article>
          </div>

          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3 px-1">
            {(isTopicCompareExpanded ? topicCompareCards : topicCompareCards.slice(0, 8)).map((item) => {
              const compareMax = Math.max(item.industryAverage, item.selfCount, 1);
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
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopic(item.topic);
                          setInstitutionPage(1);
                          setProductPage(1);
                        }}
                        className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        查看详情
                      </button>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>行业平均</span>
                        <span className="font-medium text-indigo-600">{BENCHMARK_INSTITUTION}</span>
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
            {topicCompareCards.length > 8 && (
              <button
                type="button"
                onClick={() => setIsTopicCompareExpanded((v) => !v)}
                className="flex w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-white"
              >
                <span className="text-lg leading-none">{isTopicCompareExpanded ? '◀' : '▶'}</span>
                <span className="text-center leading-snug">
                  {isTopicCompareExpanded ? '收起' : `展开全部\n${topicCompareCards.length} 个话题`}
                </span>
              </button>
            )}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">渠道对比层</h3>
                <p className="mt-1 text-sm text-slate-500">
                  从机构维度观察近 7 日的平台内容分布、主发渠道结构，以及较上周的平台倾向变化。
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                近 7 天 · 机构平台结构
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">

                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />微信公众号</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />雪球</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />蚂蚁财富号</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-500" />小红书</span>
                </div>
              </div>

              <div className="max-h-[540px] overflow-auto rounded-2xl">
                <table className="w-full table-fixed text-left text-[13px]">
                  <thead className="bg-slate-50 text-[13px] text-slate-600">
                    <tr>
                      <th className="w-[160px] rounded-l-2xl px-4 py-3 font-medium">机构名称</th>
                      <th className="w-[120px] px-4 py-3 font-medium">内容平台倾向</th>
                      <th className="w-[300px] px-4 py-3 font-medium">本周内容分布占比</th>
                      <th className="w-[160px] px-4 py-3 font-medium">相较上周变化</th>
                      <th className="rounded-r-2xl px-4 py-3 font-medium">总结概括</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelCompareMatrixRows.map((item, index) => {
                      const isBenchmark = item.institution === BENCHMARK_INSTITUTION;
                      return (
                      <tr
                        key={item.institution}
                        className={`${index === 0 ? '' : 'border-t border-slate-100'} align-top ${isBenchmark ? 'bg-indigo-50/60' : ''}`}
                      >
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`text-[16px] font-semibold ${isBenchmark ? 'text-indigo-700' : 'text-slate-900'}`}>{item.institution}</div>
                            {isBenchmark && (
                              <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600">我方</span>
                            )}
                          </div>
                          <div className="mt-2 text-[13px] text-slate-500">
                            本周 <span className="font-semibold text-slate-900">{item.current}</span> 条 ｜ 上周 <span className="font-semibold text-slate-700">{item.previous}</span> 条
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-col gap-1.5">
                            {item.tendency.split('+').map((platform) => {
                                const logo = PLATFORM_ICON_META[platform]?.logo;
                                return (
                                  <span
                                    key={`${item.institution}-${platform}-tendency`}
                                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-700"
                                  >
                                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                                      {logo ? (
                                        <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="text-[8px] text-slate-400">-</span>
                                      )}
                                    </span>
                                    <span className="truncate">{platform}</span>
                                  </span>
                                );
                              })}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="w-full">
                            <div className="flex h-5 overflow-hidden rounded-sm bg-slate-100">
                              {item.breakdown.map((part) => (
                                <div
                                  key={`${item.institution}-${part.name}`}
                                  className={part.colorClass}
                                  style={{ width: `${part.value}%` }}
                                  title={`${part.name} ${part.value}%`}
                                />
                              ))}
                            </div>
                            <div className="mt-3 text-[11px] text-slate-500">
                              {item.breakdown.map((part) => `${part.name}${part.value}%`).join(' / ')}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="text-[14px] font-semibold text-slate-900">总量 {item.totalChange}</div>
                          <div className={`mt-2 text-[13px] font-medium ${item.shiftPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {item.shiftText}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-[13px] leading-6 text-slate-600">
                          <div className="break-words">{item.summary}</div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                华夏基金推品 vs 同话题竞品
              </div>
            </div>

            <div className="space-y-3">
              {benchmarkProducts.map((item) => {
                const topicCompetitors = MARKET_TOPIC_DETAILS[item.topic]?.products || [];
                const competitorCount = Math.max(topicCompetitors.length - 1, 0);

                return (
                  <div key={item.code} className="rounded-xl border border-indigo-200 bg-indigo-50/40 shadow-sm">
                    <div className="px-4 py-4">
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1fr_0.9fr_0.8fr_auto]">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                            <span className="text-xs text-slate-500">{item.code}</span>
                            <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600">{BENCHMARK_INSTITUTION}</span>
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
                            {filterVisiblePlatforms(item.platforms).map((platform) => {
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
              <div className="mt-1 text-2xl font-semibold text-rose-700">{ANOMALY_KPI.surgeTopic}</div>
            </article>
            <article className="rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3">
              <div className="text-xs text-sky-700">新出话题数</div>
              <div className="mt-1 text-2xl font-semibold text-sky-700">{ANOMALY_KPI.newTopic}</div>
            </article>
            <article className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-emerald-700">高贴合机构（70+）</div>
                <button
                  type="button"
                  onClick={() => setIsHighAlignModalOpen(true)}
                  className="rounded-full border border-emerald-300 px-2 py-0.5 text-[11px] font-medium text-emerald-600 transition-colors hover:border-emerald-400 hover:bg-emerald-100"
                >
                  查看
                </button>
              </div>
              <div className="mt-1 text-2xl font-semibold text-emerald-700">{highAlignInstitutionList.length}</div>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
              <div className="text-xs text-amber-700">爆款帖子数</div>
              <div className="mt-1 text-2xl font-semibold text-amber-700">{ANOMALY_KPI.viralPosts}</div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">异动时间线（热度暴涨 + 新出话题）</h4>
                <span className="text-xs text-slate-500">按变化强度排序</span>
              </div>
              <div className="max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
                {[...ANOMALY_TIMELINE]
                  .map((item) => ({
                    ...item,
                    countChange: item.previousCount > 0
                      ? Math.round((item.currentCount - item.previousCount) / item.previousCount * 100)
                      : null,
                  }))
                  .sort((a, b) => (b.countChange ?? 0) - (a.countChange ?? 0))
                  .map((item, index) => (
                    <article key={`${item.topic}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${item.type === 'new' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                          {item.type === 'new' ? '新话题' : '暴涨'}
                        </span>
                        <span className="font-medium text-slate-900">{item.topic}</span>
                        <span className="ml-auto text-sm font-semibold text-rose-600">
                          {item.countChange != null ? `+${item.countChange}%` : '首次出现'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">占比 {item.previousShare.toFixed(1)}% → {item.currentShare.toFixed(1)}%</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.type === 'new'
                          ? `首现 ${item.firstSeenDays} 天，主发平台：${item.mainPlatform}`
                          : `近期内容 ${item.currentCount} 条（前期 ${item.previousCount} 条），主发平台：${item.mainPlatform}`}
                      </div>
                    </article>
                  ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">机构跟进与平台倾向矩阵</h4>
                <span className="text-xs text-slate-500">同屏查看“谁在跟”和“去哪发”</span>
              </div>
              <div className="max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
                {contentMutationInstitutionRows.map((item) => {
                  return (
                    <article key={item.institution} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-slate-900">{item.institution}</div>
                        <div className="text-sm font-semibold text-slate-400">贴合分 --</div>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{item.action}</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">倾向平台：{item.tendency}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-slate-600">总量变化：{item.totalChange}</span>
                        <span className={`rounded-full px-2 py-0.5 ${item.shiftPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {item.shiftText}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">资源配置重合分析（内容推品 × 货架产品）</h4>
                <p className="mt-0.5 text-xs text-slate-400">同时出现在内容推品和货架产品中的产品优先高亮展示</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                  重合 {contentMutationResourceCards.overlapProducts.length} 个
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                  仅内容推品 {contentMutationResourceCards.contentOnlyProducts.length} 个
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
                  仅货架 {contentMutationResourceCards.shelfOnlyProducts.length} 个
                </span>
              </div>
            </div>

            {contentMutationResourceCards.overlapProducts.length > 0 ? (
              <>
                <div className="mb-2 text-xs font-medium text-rose-600">● 双端重合产品</div>
                <div className="mb-4 space-y-2">
                  {contentMutationResourceCards.overlapProducts.map((product) => (
                    <div key={product.name} className="rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[13px] font-semibold text-rose-800">{product.name}</span>
                          {product.code && product.code !== '--' && (
                            <span className="ml-2 text-[11px] text-slate-400">{product.code}</span>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                          {1 + product.shelfSources.length} 处资源位
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">
                          内容推品 · {product.contentCount ?? '-'}次
                        </span>
                        {product.shelfSources.map((s) => (
                          <span key={s.label} className={`rounded-full px-2 py-0.5 text-[11px] ${
                            s.tone === 'amber' ? 'bg-amber-50 text-amber-700'
                            : s.tone === 'violet' ? 'bg-violet-50 text-violet-700'
                            : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {s.label}{s.count ? ` · ${s.count}次` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mb-4 rounded-lg border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
                暂无同时出现在内容推品和货架产品中的产品
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-medium text-sky-600">● 仅内容推品（{contentMutationResourceCards.contentOnlyProducts.length} 个）</div>
                <div className="max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
                  {contentMutationResourceCards.contentOnlyProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="truncate text-[13px] text-slate-700">{product.name}</span>
                      <span className="ml-2 shrink-0 text-[11px] text-slate-400">{product.count ?? '-'}次</span>
                    </div>
                  ))}
                  {contentMutationResourceCards.contentOnlyProducts.length === 0 && (
                    <div className="text-xs text-slate-400">暂无数据</div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-slate-500">● 仅货架产品（{contentMutationResourceCards.shelfOnlyProducts.length} 个）</div>
                <div className="max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
                  {contentMutationResourceCards.shelfOnlyProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="truncate text-[13px] text-slate-700">{product.name}</span>
                      <div className="ml-2 flex shrink-0 gap-1">
                        {product.shelfSources.map((s) => (
                          <span key={s.label} className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                            s.tone === 'amber' ? 'bg-amber-50 text-amber-600'
                            : s.tone === 'violet' ? 'bg-violet-50 text-violet-600'
                            : 'bg-emerald-50 text-emerald-600'
                          }`}>{s.label}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {contentMutationResourceCards.shelfOnlyProducts.length === 0 && (
                    <div className="text-xs text-slate-400">暂无数据</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-semibold text-slate-900">爆款内容墙（文章 / 帖子）</h4>
              <span className="text-xs text-slate-500">按平台切换查看；互动量为点赞/分享/评论/收藏合计</span>
            </div>
            {viralPlatformTabs.length > 0 ? (
              <>
                <div className="mb-3 flex flex-wrap gap-2">
                  {viralPlatformTabs.map((tab) => {
                    const count = viralPostsVisible.filter((p) => p.platform === tab).length;
                    const active = selectedViralTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setViralWallPlatformTab(tab)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'border-slate-800 bg-slate-800 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {tab}
                        <span className={`ml-1 ${active ? 'text-slate-200' : 'text-slate-400'}`}>({count})</span>
                      </button>
                    );
                  })}
                </div>
                <div className="max-h-[480px] overflow-y-auto pr-1">
                  {viralPostsForWall.length ? (
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {viralPostsForWall.map((item, vIdx) => {
                        const platformLogo = PLATFORM_ICON_META[item.platform]?.logo;
                        const openUrl = item.url && /^https?:\/\//i.test(item.url) ? item.url : null;
                        return (
                          <article
                            key={item.url || `${item.institution}-${item.title}-${selectedViralTab}-${vIdx}`}
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
                              {openUrl ? (
                                <a
                                  href={openUrl}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900 hover:text-sky-700"
                                >
                                  {item.title}
                                </a>
                              ) : (
                                <div className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900">{item.title}</div>
                              )}
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.tags.map((tag) => (
                                  <span
                                    key={`${item.title}-${tag}-${vIdx}`}
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
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                      当前平台暂无爆款样本
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
                暂无爆款内容数据
              </div>
            )}
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
                      {topicCurrentStats.growth !== undefined && topicCurrentStats.growth !== null && (
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-600">
                          近 7 日 +{formatPercentDisplay(topicCurrentStats.growth)}%
                        </span>
                      )}
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {getTopicMetricLabel(activePlatform)} {formatPercentDisplay(topicCurrentStats.share)}%
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
                  <div className="text-sm font-medium text-slate-500">{selectedTopicMarketDetail ? '渠道渗透率' : '渠道热度'}</div>
                  <div className="text-xs text-slate-400">{selectedTopicMarketDetail ? '各平台渗透率%' : '四个平台热度并列对比'}</div>
                </div>
                <div className="space-y-3">
                  {channelHeatList.map((item) => (
                    <div key={`${selectedTopic}-${item.platform}`} className="flex items-center gap-3">
                      <span
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
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
                      <div className="min-w-[64px] shrink-0 text-xs text-slate-500">{item.platform}</div>
                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-2.5 rounded-full bg-slate-700 transition-all"
                            style={{ width: `${Math.min(item.value, 100)}%` }}
                          />
                        </div>
                        <div className="w-[52px] shrink-0 text-right text-sm font-semibold text-slate-900">
                          {formatPercentDisplay(item.value)}%
                        </div>
                        {selectedTopicMarketDetail && (
                          <div className="w-[52px] shrink-0 text-right text-xs text-slate-400">{item.count} 条</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-500">机构内容占比</div>
                  <div className="text-xs text-slate-400">共 {institutionShareList.length} 家机构，单页展示 {INSTITUTION_PAGE_SIZE} 家</div>
                </div>
                <div className="grid min-h-[240px] grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedInstitutionShareList.map((item) => {
                    return (
                    <div
                      key={`${selectedTopic}-${item.institution}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-700">{item.institution}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white">
                        <div
                          className="h-2.5 rounded-full bg-slate-800"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.primary ? '核心参与机构' : '长尾参与机构'}</span>
                        <span>发布内容约 {item.count}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>

                <CompactPagination
                  currentPage={institutionPage}
                  totalPages={institutionTotalPages}
                  onPageChange={setInstitutionPage}
                />
              </section>

              <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-500">机构推品列表</div>
                  <div className="text-sm text-slate-400">{selectedTopicMarketDetail ? '包含机构推品占比、关联内容数和渠道分布' : '包含机构推品占比、关联内容数、内容热度和渠道分布'}</div>
                </div>

                <div className="mb-4 text-xs text-slate-400">共 {modalProducts.length} 条关联产品，单页展示 {PRODUCT_PAGE_SIZE} 条</div>

                <div className="min-h-[420px] space-y-2.5">
                  {paginatedModalProducts.map((detail) => {
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
                              {detail.code && <span>代码 <span className={`font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.code}</span></span>}
                              {detail.heat !== undefined && detail.heat !== null && <span>热度 <span className={`font-semibold ${isGF ? 'text-emerald-800' : 'text-slate-900'}`}>{detail.heat}</span></span>}
                            </div>
                          </div>
                        </div>
                        {detail.heatLabel && (
                          <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${heatBadgeClass[detail.heatLabel]}`}>
                            {detail.heatLabel}
                          </span>
                        )}
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

                <CompactPagination
                  currentPage={productPage}
                  totalPages={productTotalPages}
                  onPageChange={setProductPage}
                />

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

      {isHighAlignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">高贴合机构详情</h3>
                <div className="mt-1 text-sm text-slate-500">
                  话题覆盖主线相似度 &gt; 70% 的机构，共 {highAlignInstitutionList.length} 家
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHighAlignModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <div className="max-h-[calc(90vh-84px)] overflow-y-auto px-6 py-5 space-y-3">
              {highAlignInstitutionList.map((item) => (
                <div key={item.institution} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{item.institution}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${item.similarity}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-emerald-700">{item.similarity}%</span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">覆盖 {item.coveredTopics} 个话题</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.topTopics.map((t) => (
                      <span key={t.topic} className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                        {t.topic}
                        <span className="text-slate-400">{t.count}条</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMissingTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">缺失热点明细</h3>
                <div className="mt-1 text-sm text-slate-500">
                  华夏基金尚未涉及的市场热点话题，共 {missingTopicList.length} 个
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMissingTopicModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <div className="max-h-[calc(90vh-84px)] overflow-y-auto px-6 py-5 space-y-3">
              {missingTopicList.map((item) => (
                <div key={item.topic} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{item.topic}</span>
                      <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-600">未覆盖</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>全平台内容数 <span className="font-semibold text-slate-800">{item.totalCount}</span></span>
                      <span>热度占比 <span className="font-semibold text-slate-800">{formatPercentDisplay(item.totalShare)}%</span></span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    {item.platformBreakdown.filter((p) => p.count > 0).map((p) => {
                      const logo = PLATFORM_ICON_META[p.platform]?.logo;
                      return (
                        <span key={p.platform} className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs">
                          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                            {logo ? <img src={logo} alt={p.platform} className="h-full w-full object-cover" /> : <span className="text-[8px] text-slate-400">-</span>}
                          </span>
                          <span className="text-slate-600">{p.platform}</span>
                          <span className="font-semibold text-slate-800">{p.count}</span>
                        </span>
                      );
                    })}
                  </div>
                  {item.topInstitutions.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">已入局：</span>
                      {item.topInstitutions.map((inst) => (
                        <span key={inst.institution} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                          {inst.institution}
                          <span className="text-slate-400">{inst.count}条</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCenterInsight;
