import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

const DIMENSIONS = ['赛道', '板块', '行业', '主题', '指数'];

const HEATMAP_BY_DIMENSION = {
  赛道: [
    { id: 'cpo', name: 'CPO/光模块', value: 96, growth: 0.41 },
    { id: 'fiber', name: '光纤光缆', value: 89, growth: 0.38 },
    { id: 'liquid', name: '液冷服务器', value: 82, growth: 0.33 },
    { id: 'semi', name: '半导体设备', value: 78, growth: 0.29 },
    { id: 'ai_app', name: 'AI应用', value: 74, growth: 0.24 },
    { id: 'drug', name: '创新药', value: 69, growth: 0.22 },
    { id: 'oil', name: '油气开采', value: 44, growth: -0.18 },
    { id: 'chem', name: '基础化工', value: 51, growth: 0.16 },
  ],
  板块: [
    { id: 'ai', name: '人工智能', value: 128, growth: 0.37 },
    { id: 'dividend', name: '红利资产', value: 94, growth: 0.13 },
    { id: 'semi_sector', name: '半导体', value: 118, growth: 0.31 },
    { id: 'drug_sector', name: '创新药', value: 86, growth: 0.21 },
    { id: 'gold_sector', name: '黄金资源', value: 81, growth: 0.19 },
    { id: 'consumption', name: '消费复苏', value: 57, growth: 0.09 },
  ],
  行业: [
    { id: 'electronics', name: '电子', value: 117, growth: 0.28 },
    { id: 'communication', name: '通信', value: 101, growth: 0.25 },
    { id: 'medicine', name: '医药生物', value: 84, growth: 0.22 },
    { id: 'nonferrous', name: '有色金属', value: 72, growth: 0.18 },
    { id: 'bank', name: '银行', value: 48, growth: -0.03 },
    { id: 'real_estate', name: '房地产', value: 27, growth: -0.12 },
  ],
  主题: [
    { id: 'compute', name: '算力租赁', value: 92, growth: 0.35 },
    { id: 'copper', name: '铜缆高速连接', value: 86, growth: 0.32 },
    { id: 'optical', name: '光通信', value: 81, growth: 0.3 },
    { id: 'cooling', name: '液冷', value: 77, growth: 0.27 },
    { id: 'robot', name: '机器人', value: 48, growth: 0.08 },
    { id: 'gold_theme', name: '黄金概念', value: 54, growth: 0.18 },
  ],
  指数: [
    { id: 'comm_index', name: '中证通信设备主题指数', value: 93, growth: 0.38 },
    { id: 'semi_index', name: '中证全指半导体产品与设备指数', value: 88, growth: 0.32 },
    { id: 'cloud_index', name: '中证沪港深云计算产业指数', value: 77, growth: 0.29 },
    { id: 'drug_index', name: '中证创新药产业指数', value: 74, growth: 0.24 },
    { id: 'gold_index', name: '中证内地黄金主题指数', value: 64, growth: 0.2 },
    { id: 'oil_index', name: '中证石油天然气指数', value: 36, growth: -0.2 },
  ],
};

const ALIGNMENT_BY_DIMENSION = {
  '\u8d5b\u9053': [
    { label: 'AI\u5e94\u7528', marketShare: 18, selfShare: 11 },
    { label: '\u534a\u5bfc\u4f53\u8bbe\u5907', marketShare: 15, selfShare: 13 },
    { label: 'CPO/\u5149\u6a21\u5757', marketShare: 14, selfShare: 17 },
    { label: '\u6db2\u51b7\u670d\u52a1\u5668', marketShare: 11, selfShare: 10 },
    { label: '\u5149\u7ea4\u5149\u7f06', marketShare: 10, selfShare: 8 },
    { label: '\u521b\u65b0\u836f', marketShare: 8, selfShare: 14 },
  ],
  '\u677f\u5757': [
    { label: '\u4eba\u5de5\u667a\u80fd', marketShare: 22, selfShare: 17 },
    { label: '\u534a\u5bfc\u4f53', marketShare: 18, selfShare: 14 },
    { label: '\u7ea2\u5229\u8d44\u4ea7', marketShare: 13, selfShare: 19 },
    { label: '\u521b\u65b0\u836f', marketShare: 12, selfShare: 16 },
    { label: '\u9ec4\u91d1\u8d44\u6e90', marketShare: 10, selfShare: 13 },
    { label: '\u6d88\u8d39\u590d\u82cf', marketShare: 7, selfShare: 6 },
  ],
  '\u884c\u4e1a': [
    { label: '\u7535\u5b50', marketShare: 24, selfShare: 18 },
    { label: '\u901a\u4fe1', marketShare: 19, selfShare: 16 },
    { label: '\u533b\u836f\u751f\u7269', marketShare: 14, selfShare: 20 },
    { label: '\u6709\u8272\u91d1\u5c5e', marketShare: 11, selfShare: 13 },
    { label: '\u94f6\u884c', marketShare: 8, selfShare: 11 },
    { label: '\u623f\u5730\u4ea7', marketShare: 4, selfShare: 3 },
  ],
  '\u4e3b\u9898': [
    { label: '\u7b97\u529b\u79df\u8d41', marketShare: 19, selfShare: 12 },
    { label: '\u94dc\u7f06\u9ad8\u901f\u8fde\u63a5', marketShare: 17, selfShare: 13 },
    { label: '\u5149\u901a\u4fe1', marketShare: 15, selfShare: 12 },
    { label: '\u6db2\u51b7', marketShare: 13, selfShare: 11 },
    { label: '\u673a\u5668\u4eba', marketShare: 9, selfShare: 7 },
    { label: '\u9ec4\u91d1\u6982\u5ff5', marketShare: 8, selfShare: 13 },
  ],
  '\u6307\u6570': [
    { label: '\u4e2d\u8bc1\u901a\u4fe1\u8bbe\u5907\u4e3b\u9898\u6307\u6570', marketShare: 18, selfShare: 13 },
    { label: '\u4e2d\u8bc1\u5168\u6307\u534a\u5bfc\u4f53\u4ea7\u54c1\u4e0e\u8bbe\u5907\u6307\u6570', marketShare: 17, selfShare: 14 },
    { label: '\u4e2d\u8bc1\u6caa\u6e2f\u6df1\u4e91\u8ba1\u7b97\u4ea7\u4e1a\u6307\u6570', marketShare: 14, selfShare: 10 },
    { label: '\u4e2d\u8bc1\u521b\u65b0\u836f\u4ea7\u4e1a\u6307\u6570', marketShare: 11, selfShare: 16 },
    { label: '\u4e2d\u8bc1\u5185\u5730\u9ec4\u91d1\u4e3b\u9898\u6307\u6570', marketShare: 9, selfShare: 12 },
    { label: '\u4e2d\u8bc1\u77f3\u6cb9\u5929\u7136\u6c14\u6307\u6570', marketShare: 5, selfShare: 4 },
  ],
};

const CHANNEL_DISTRIBUTION = [
  { institution: '华夏基金', shortInstitution: '华夏基金', 蚂蚁财富: 32, 微信公众号: 28, 小红书: 16, 雪球: 14, 其他: 10 },
  { institution: '易方达基金', shortInstitution: '易方达', 蚂蚁财富: 26, 微信公众号: 34, 小红书: 12, 雪球: 18, 其他: 10 },
  { institution: '广发基金', shortInstitution: '广发基金', 蚂蚁财富: 24, 微信公众号: 31, 小红书: 18, 雪球: 15, 其他: 12 },
  { institution: '富国基金', shortInstitution: '富国基金', 蚂蚁财富: 29, 微信公众号: 27, 小红书: 14, 雪球: 19, 其他: 11 },
  { institution: '南方基金', shortInstitution: '南方基金', 蚂蚁财富: 22, 微信公众号: 36, 小红书: 11, 雪球: 21, 其他: 10 },
  { institution: '嘉实基金', shortInstitution: '嘉实基金', 蚂蚁财富: 30, 微信公众号: 25, 小红书: 17, 雪球: 16, 其他: 12 },
  { institution: '汇添富基金', shortInstitution: '汇添富', 蚂蚁财富: 27, 微信公众号: 28, 小红书: 19, 雪球: 15, 其他: 11 },
  { institution: '博时基金', shortInstitution: '博时基金', 蚂蚁财富: 21, 微信公众号: 33, 小红书: 15, 雪球: 19, 其他: 12 },
];

const CHANNEL_BUBBLE_BY_DIMENSION = {
  赛道: {
    items: ['AI应用', '半导体设备', 'CPO/光模块', '液冷服务器', '光纤光缆', '创新药', '红利资产', '黄金资源'],
    channels: {
      微信公众号: [
        { name: 'AI应用', pct: 18 },
        { name: '半导体设备', pct: 14 },
        { name: 'CPO/光模块', pct: 12 },
        { name: '液冷服务器', pct: 10 },
        { name: '光纤光缆', pct: 8 },
        { name: '创新药', pct: 7 },
        { name: '红利资产', pct: 6 },
        { name: '黄金资源', pct: 5 },
        { name: '其他', pct: 20 },
      ],
      蚂蚁财富: [
        { name: '红利资产', pct: 16 },
        { name: '黄金资源', pct: 14 },
        { name: 'AI应用', pct: 11 },
        { name: '半导体设备', pct: 10 },
        { name: '创新药', pct: 9 },
        { name: 'CPO/光模块', pct: 8 },
        { name: '光纤光缆', pct: 7 },
        { name: '液冷服务器', pct: 5 },
        { name: '其他', pct: 20 },
      ],
      小红书: [
        { name: 'AI应用', pct: 15 },
        { name: '创新药', pct: 13 },
        { name: 'CPO/光模块', pct: 12 },
        { name: '液冷服务器', pct: 10 },
        { name: '半导体设备', pct: 9 },
        { name: '光纤光缆', pct: 8 },
        { name: '黄金资源', pct: 7 },
        { name: '红利资产', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      雪球: [
        { name: '红利资产', pct: 15 },
        { name: '半导体设备', pct: 13 },
        { name: '黄金资源', pct: 12 },
        { name: 'AI应用', pct: 10 },
        { name: 'CPO/光模块', pct: 9 },
        { name: '创新药', pct: 8 },
        { name: '光纤光缆', pct: 7 },
        { name: '液冷服务器', pct: 6 },
        { name: '其他', pct: 20 },
      ],
    },
  },
  板块: {
    items: ['人工智能', '半导体', '红利资产', '创新药', '黄金资源', '消费复苏', '先进制造', '出海链'],
    channels: {
      微信公众号: [
        { name: '人工智能', pct: 17 },
        { name: '半导体', pct: 14 },
        { name: '创新药', pct: 11 },
        { name: '先进制造', pct: 10 },
        { name: '出海链', pct: 8 },
        { name: '红利资产', pct: 7 },
        { name: '黄金资源', pct: 7 },
        { name: '消费复苏', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      蚂蚁财富: [
        { name: '红利资产', pct: 18 },
        { name: '黄金资源', pct: 15 },
        { name: '人工智能', pct: 10 },
        { name: '半导体', pct: 9 },
        { name: '创新药', pct: 8 },
        { name: '消费复苏', pct: 7 },
        { name: '先进制造', pct: 7 },
        { name: '出海链', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      小红书: [
        { name: '人工智能', pct: 16 },
        { name: '创新药', pct: 13 },
        { name: '消费复苏', pct: 11 },
        { name: '半导体', pct: 10 },
        { name: '出海链', pct: 9 },
        { name: '先进制造', pct: 8 },
        { name: '黄金资源', pct: 7 },
        { name: '红利资产', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      雪球: [
        { name: '红利资产', pct: 16 },
        { name: '黄金资源', pct: 13 },
        { name: '半导体', pct: 12 },
        { name: '人工智能', pct: 10 },
        { name: '出海链', pct: 9 },
        { name: '先进制造', pct: 8 },
        { name: '创新药', pct: 7 },
        { name: '消费复苏', pct: 5 },
        { name: '其他', pct: 20 },
      ],
    },
  },
  行业: {
    items: ['电子', '通信', '医药生物', '有色金属', '银行', '机械设备', '汽车', '食品饮料'],
    channels: {
      微信公众号: [
        { name: '电子', pct: 16 },
        { name: '通信', pct: 14 },
        { name: '医药生物', pct: 12 },
        { name: '机械设备', pct: 10 },
        { name: '汽车', pct: 8 },
        { name: '有色金属', pct: 7 },
        { name: '银行', pct: 7 },
        { name: '食品饮料', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      蚂蚁财富: [
        { name: '银行', pct: 16 },
        { name: '有色金属', pct: 13 },
        { name: '医药生物', pct: 11 },
        { name: '电子', pct: 10 },
        { name: '食品饮料', pct: 9 },
        { name: '通信', pct: 8 },
        { name: '机械设备', pct: 7 },
        { name: '汽车', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      小红书: [
        { name: '医药生物', pct: 15 },
        { name: '电子', pct: 13 },
        { name: '食品饮料', pct: 11 },
        { name: '汽车', pct: 10 },
        { name: '通信', pct: 9 },
        { name: '机械设备', pct: 8 },
        { name: '有色金属', pct: 7 },
        { name: '银行', pct: 7 },
        { name: '其他', pct: 20 },
      ],
      雪球: [
        { name: '银行', pct: 15 },
        { name: '有色金属', pct: 13 },
        { name: '电子', pct: 12 },
        { name: '通信', pct: 10 },
        { name: '医药生物', pct: 9 },
        { name: '机械设备', pct: 8 },
        { name: '汽车', pct: 7 },
        { name: '食品饮料', pct: 6 },
        { name: '其他', pct: 20 },
      ],
    },
  },
  主题: {
    items: ['算力租赁', '铜缆高速连接', '光通信', '液冷', '机器人', '黄金概念', '并购重组', '国企改革'],
    channels: {
      微信公众号: [
        { name: '算力租赁', pct: 17 },
        { name: '铜缆高速连接', pct: 13 },
        { name: '光通信', pct: 12 },
        { name: '液冷', pct: 10 },
        { name: '机器人', pct: 9 },
        { name: '并购重组', pct: 7 },
        { name: '国企改革', pct: 6 },
        { name: '黄金概念', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      蚂蚁财富: [
        { name: '黄金概念', pct: 16 },
        { name: '国企改革', pct: 13 },
        { name: '算力租赁', pct: 11 },
        { name: '并购重组', pct: 10 },
        { name: '光通信', pct: 9 },
        { name: '铜缆高速连接', pct: 8 },
        { name: '液冷', pct: 7 },
        { name: '机器人', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      小红书: [
        { name: '算力租赁', pct: 15 },
        { name: '机器人', pct: 13 },
        { name: '液冷', pct: 11 },
        { name: '光通信', pct: 10 },
        { name: '黄金概念', pct: 9 },
        { name: '铜缆高速连接', pct: 8 },
        { name: '并购重组', pct: 7 },
        { name: '国企改革', pct: 7 },
        { name: '其他', pct: 20 },
      ],
      雪球: [
        { name: '黄金概念', pct: 15 },
        { name: '国企改革', pct: 12 },
        { name: '算力租赁', pct: 11 },
        { name: '铜缆高速连接', pct: 10 },
        { name: '光通信', pct: 9 },
        { name: '液冷', pct: 8 },
        { name: '并购重组', pct: 8 },
        { name: '机器人', pct: 7 },
        { name: '其他', pct: 20 },
      ],
    },
  },
  指数: {
    items: ['中证通信设备主题指数', '中证全指半导体产品与设备指数', '中证沪港深云计算产业指数', '中证创新药产业指数', '中证内地黄金主题指数', '中证红利50指数', '中证消费电子主题指数', '中证高端装备指数'],
    channels: {
      微信公众号: [
        { name: '中证通信设备主题指数', pct: 16 },
        { name: '中证全指半导体产品与设备指数', pct: 14 },
        { name: '中证沪港深云计算产业指数', pct: 12 },
        { name: '中证创新药产业指数', pct: 10 },
        { name: '中证高端装备指数', pct: 8 },
        { name: '中证消费电子主题指数', pct: 7 },
        { name: '中证红利50指数', pct: 7 },
        { name: '中证内地黄金主题指数', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      蚂蚁财富: [
        { name: '中证红利50指数', pct: 16 },
        { name: '中证内地黄金主题指数', pct: 14 },
        { name: '中证创新药产业指数', pct: 11 },
        { name: '中证通信设备主题指数', pct: 10 },
        { name: '中证全指半导体产品与设备指数', pct: 9 },
        { name: '中证消费电子主题指数', pct: 8 },
        { name: '中证高端装备指数', pct: 6 },
        { name: '中证沪港深云计算产业指数', pct: 6 },
        { name: '其他', pct: 20 },
      ],
      小红书: [
        { name: '中证创新药产业指数', pct: 15 },
        { name: '中证沪港深云计算产业指数', pct: 13 },
        { name: '中证通信设备主题指数', pct: 11 },
        { name: '中证消费电子主题指数', pct: 10 },
        { name: '中证全指半导体产品与设备指数', pct: 9 },
        { name: '中证高端装备指数', pct: 8 },
        { name: '中证内地黄金主题指数', pct: 7 },
        { name: '中证红利50指数', pct: 7 },
        { name: '其他', pct: 20 },
      ],
      雪球: [
        { name: '中证红利50指数', pct: 15 },
        { name: '中证内地黄金主题指数', pct: 13 },
        { name: '中证全指半导体产品与设备指数', pct: 12 },
        { name: '中证通信设备主题指数', pct: 10 },
        { name: '中证创新药产业指数', pct: 9 },
        { name: '中证高端装备指数', pct: 8 },
        { name: '中证消费电子主题指数', pct: 7 },
        { name: '中证沪港深云计算产业指数', pct: 6 },
        { name: '其他', pct: 20 },
      ],
    },
  },
};

const TRACK_FOCUS_BY_DIMENSION = {
  '\u8d5b\u9053': [
    { institution: '\u534e\u590f\u57fa\u91d1', total: 126, tracks: [{ name: 'AI\u5e94\u7528', count: 28, pct: 22 }, { name: '\u5149\u7ea4\u5149\u7f06', count: 24, pct: 19 }, { name: '\u521b\u65b0\u836f', count: 17, pct: 13 }] },
    { institution: '\u6613\u65b9\u8fbe\u57fa\u91d1', total: 138, tracks: [{ name: 'AI\u5e94\u7528', count: 38, pct: 28 }, { name: '\u534a\u5bfc\u4f53\u8bbe\u5907', count: 29, pct: 21 }, { name: 'CPO/\u5149\u6a21\u5757', count: 19, pct: 14 }] },
    { institution: '\u5e7f\u53d1\u57fa\u91d1', total: 114, tracks: [{ name: '\u521b\u65b0\u836f', count: 25, pct: 22 }, { name: 'AI\u5e94\u7528', count: 23, pct: 20 }, { name: '\u6db2\u51b7\u670d\u52a1\u5668', count: 18, pct: 16 }] },
    { institution: '\u5bcc\u56fd\u57fa\u91d1', total: 102, tracks: [{ name: '\u5149\u7ea4\u5149\u7f06', count: 20, pct: 20 }, { name: '\u521b\u65b0\u836f', count: 18, pct: 18 }, { name: '\u534a\u5bfc\u4f53\u8bbe\u5907', count: 14, pct: 14 }] },
  ],
  '\u677f\u5757': [
    { institution: '\u534e\u590f\u57fa\u91d1', total: 126, tracks: [{ name: '\u7ea2\u5229\u8d44\u4ea7', count: 34, pct: 27 }, { name: '\u4eba\u5de5\u667a\u80fd', count: 26, pct: 21 }, { name: '\u521b\u65b0\u836f', count: 18, pct: 14 }] },
    { institution: '\u6613\u65b9\u8fbe\u57fa\u91d1', total: 138, tracks: [{ name: '\u4eba\u5de5\u667a\u80fd', count: 36, pct: 26 }, { name: '\u534a\u5bfc\u4f53', count: 31, pct: 22 }, { name: '\u9ec4\u91d1\u8d44\u6e90', count: 18, pct: 13 }] },
    { institution: '\u5e7f\u53d1\u57fa\u91d1', total: 114, tracks: [{ name: '\u521b\u65b0\u836f', count: 26, pct: 23 }, { name: '\u7ea2\u5229\u8d44\u4ea7', count: 21, pct: 18 }, { name: '\u4eba\u5de5\u667a\u80fd', count: 19, pct: 17 }] },
    { institution: '\u5bcc\u56fd\u57fa\u91d1', total: 102, tracks: [{ name: '\u9ec4\u91d1\u8d44\u6e90', count: 22, pct: 22 }, { name: '\u7ea2\u5229\u8d44\u4ea7', count: 20, pct: 20 }, { name: '\u534a\u5bfc\u4f53', count: 15, pct: 15 }] },
  ],
  '\u884c\u4e1a': [
    { institution: '\u534e\u590f\u57fa\u91d1', total: 126, tracks: [{ name: '\u94f6\u884c', count: 29, pct: 23 }, { name: '\u7535\u5b50', count: 24, pct: 19 }, { name: '\u533b\u836f\u751f\u7269', count: 17, pct: 13 }] },
    { institution: '\u6613\u65b9\u8fbe\u57fa\u91d1', total: 138, tracks: [{ name: '\u7535\u5b50', count: 34, pct: 25 }, { name: '\u901a\u4fe1', count: 27, pct: 20 }, { name: '\u6709\u8272\u91d1\u5c5e', count: 19, pct: 14 }] },
    { institution: '\u5e7f\u53d1\u57fa\u91d1', total: 114, tracks: [{ name: '\u533b\u836f\u751f\u7269', count: 28, pct: 25 }, { name: '\u7535\u5b50', count: 20, pct: 18 }, { name: '\u901a\u4fe1', count: 18, pct: 16 }] },
    { institution: '\u5bcc\u56fd\u57fa\u91d1', total: 102, tracks: [{ name: '\u6709\u8272\u91d1\u5c5e', count: 21, pct: 21 }, { name: '\u94f6\u884c', count: 18, pct: 18 }, { name: '\u7535\u5b50', count: 16, pct: 16 }] },
  ],
  '\u4e3b\u9898': [
    { institution: '\u534e\u590f\u57fa\u91d1', total: 126, tracks: [{ name: '\u7b97\u529b\u79df\u8d41', count: 25, pct: 20 }, { name: '\u9ec4\u91d1\u6982\u5ff5', count: 21, pct: 17 }, { name: '\u673a\u5668\u4eba', count: 18, pct: 14 }] },
    { institution: '\u6613\u65b9\u8fbe\u57fa\u91d1', total: 138, tracks: [{ name: '\u7b97\u529b\u79df\u8d41', count: 32, pct: 23 }, { name: '\u94dc\u7f06\u9ad8\u901f\u8fde\u63a5', count: 28, pct: 20 }, { name: '\u5149\u901a\u4fe1', count: 19, pct: 14 }] },
    { institution: '\u5e7f\u53d1\u57fa\u91d1', total: 114, tracks: [{ name: '\u9ec4\u91d1\u6982\u5ff5', count: 24, pct: 21 }, { name: '\u6db2\u51b7', count: 19, pct: 17 }, { name: '\u673a\u5668\u4eba', count: 16, pct: 14 }] },
    { institution: '\u5bcc\u56fd\u57fa\u91d1', total: 102, tracks: [{ name: '\u9ec4\u91d1\u6982\u5ff5', count: 21, pct: 21 }, { name: '\u5149\u901a\u4fe1', count: 17, pct: 17 }, { name: '\u7b97\u529b\u79df\u8d41', count: 16, pct: 16 }] },
  ],
  '\u6307\u6570': [
    { institution: '\u534e\u590f\u57fa\u91d1', total: 126, tracks: [{ name: '\u4e2d\u8bc1\u5185\u5730\u9ec4\u91d1\u4e3b\u9898\u6307\u6570', count: 26, pct: 21 }, { name: '\u4e2d\u8bc1\u521b\u65b0\u836f\u4ea7\u4e1a\u6307\u6570', count: 23, pct: 18 }, { name: '\u4e2d\u8bc1\u901a\u4fe1\u8bbe\u5907\u4e3b\u9898\u6307\u6570', count: 17, pct: 13 }] },
    { institution: '\u6613\u65b9\u8fbe\u57fa\u91d1', total: 138, tracks: [{ name: '\u4e2d\u8bc1\u901a\u4fe1\u8bbe\u5907\u4e3b\u9898\u6307\u6570', count: 33, pct: 24 }, { name: '\u4e2d\u8bc1\u5168\u6307\u534a\u5bfc\u4f53\u4ea7\u54c1\u4e0e\u8bbe\u5907\u6307\u6570', count: 29, pct: 21 }, { name: '\u4e2d\u8bc1\u6caa\u6e2f\u6df1\u4e91\u8ba1\u7b97\u4ea7\u4e1a\u6307\u6570', count: 18, pct: 13 }] },
    { institution: '\u5e7f\u53d1\u57fa\u91d1', total: 114, tracks: [{ name: '\u4e2d\u8bc1\u521b\u65b0\u836f\u4ea7\u4e1a\u6307\u6570', count: 27, pct: 24 }, { name: '\u4e2d\u8bc1\u5185\u5730\u9ec4\u91d1\u4e3b\u9898\u6307\u6570', count: 18, pct: 16 }, { name: '\u4e2d\u8bc1\u901a\u4fe1\u8bbe\u5907\u4e3b\u9898\u6307\u6570', count: 15, pct: 13 }] },
    { institution: '\u5bcc\u56fd\u57fa\u91d1', total: 102, tracks: [{ name: '\u4e2d\u8bc1\u5185\u5730\u9ec4\u91d1\u4e3b\u9898\u6307\u6570', count: 20, pct: 20 }, { name: '\u4e2d\u8bc1\u521b\u65b0\u836f\u4ea7\u4e1a\u6307\u6570', count: 17, pct: 17 }, { name: '\u4e2d\u8bc1\u5168\u6307\u534a\u5bfc\u4f53\u4ea7\u54c1\u4e0e\u8bbe\u5907\u6307\u6570', count: 15, pct: 15 }] },
  ],
};

const RETRO_EVENTS = [
  {
    id: 'ai_hardware',
    label: 'AI硬件链',
    dimension: '赛道',
    rise: '+214%',
    trigger: '算力扩容预期 + 光模块/液冷同步发酵',
    notes: [
      { title: '热点启动点', value: '03-22 09:45', detail: '算力、CPO、液冷三条支线同时放量' },
      { title: '我司较优跟进窗', value: '启动后 6-12 小时', detail: '次日早盘追踪，点击率与转化率同步走强' },
      { title: '当前复盘结论', value: '应提高主线响应速度', detail: '主升浪初期我司内容密度仍偏低' },
    ],
    scatterTitle: '赛道时序散点密度图',
    scatterSubtitle: 'AI硬件链近30日复盘',
    scatterLabel: '赛道：AI硬件链',
    scatterData: [
      { institution: '华夏基金', day: 3, score: 58, size: 100, type: '长图' },
      { institution: '华夏基金', day: 11, score: 76, size: 168, type: '视频' },
      { institution: '华夏基金', day: 19, score: 69, size: 142, type: '图文' },
      { institution: '易方达基金', day: 5, score: 63, size: 122, type: '视频' },
      { institution: '易方达基金', day: 15, score: 88, size: 220, type: '视频' },
      { institution: '易方达基金', day: 23, score: 72, size: 156, type: '长图' },
      { institution: '广发基金', day: 7, score: 56, size: 102, type: '图文' },
      { institution: '广发基金', day: 17, score: 79, size: 170, type: '视频' },
      { institution: '广发基金', day: 24, score: 67, size: 138, type: '图文' },
      { institution: '富国基金', day: 4, score: 48, size: 84, type: '图文' },
      { institution: '富国基金', day: 16, score: 74, size: 154, type: '长图' },
      { institution: '富国基金', day: 25, score: 65, size: 132, type: '图文' },
      { institution: '南方基金', day: 9, score: 61, size: 118, type: '图文' },
      { institution: '南方基金', day: 18, score: 82, size: 182, type: '视频' },
      { institution: '南方基金', day: 26, score: 73, size: 158, type: '长图' },
      { institution: '嘉实基金', day: 6, score: 54, size: 96, type: '图文' },
      { institution: '嘉实基金', day: 14, score: 77, size: 166, type: '长图' },
      { institution: '嘉实基金', day: 22, score: 70, size: 148, type: '视频' },
      { institution: '汇添富基金', day: 8, score: 57, size: 106, type: '图文' },
      { institution: '汇添富基金', day: 16, score: 78, size: 168, type: '视频' },
      { institution: '汇添富基金', day: 27, score: 68, size: 144, type: '长图' },
      { institution: '博时基金', day: 10, score: 59, size: 110, type: '长图' },
      { institution: '博时基金', day: 18, score: 75, size: 160, type: '视频' },
      { institution: '博时基金', day: 28, score: 66, size: 136, type: '图文' },
    ],
    burstDay: 15,
    deviationData: [
      { track: 'CPO/光模块', diff: -6.1 },
      { track: '液冷服务器', diff: -4.3 },
      { track: '光纤光缆', diff: -3.8 },
      { track: 'AI应用', diff: -2.2 },
      { track: '创新药', diff: 4.9 },
      { track: '红利资产', diff: 5.6 },
    ],
    timeline: [
      { date: '03-14', market: 10, self: 6 },
      { date: '03-18', market: 16, self: 9 },
      { date: '03-22', market: 28, self: 14 },
      { date: '03-26', market: 41, self: 22 },
      { date: '03-30', market: 55, self: 31 },
      { date: '04-04', market: 47, self: 28 },
      { date: '04-08', market: 36, self: 24 },
    ],
  },
  {
    id: 'innovation_drug',
    label: '创新药',
    dimension: '板块',
    rise: '+149%',
    trigger: '政策催化 + 临床数据催化叠加',
    notes: [
      { title: '热点启动点', value: '03-20 14:10', detail: '创新药板块热度在午后快速抬升' },
      { title: '我司较优跟进窗', value: '启动后 12-24 小时', detail: '次日深度内容表现优于追涨快讯' },
      { title: '当前复盘结论', value: '适合深度化而非高频化', detail: '用户更偏好机制解析与产品映射' },
    ],
    scatterTitle: '板块时序散点密度图',
    scatterSubtitle: '创新药近30日复盘',
    scatterLabel: '板块：创新药',
    scatterData: [
      { institution: '华夏基金', day: 4, score: 50, size: 88, type: '图文' },
      { institution: '华夏基金', day: 14, score: 71, size: 146, type: '长图' },
      { institution: '华夏基金', day: 24, score: 68, size: 140, type: '视频' },
      { institution: '易方达基金', day: 8, score: 62, size: 120, type: '视频' },
      { institution: '易方达基金', day: 18, score: 82, size: 190, type: '长图' },
      { institution: '易方达基金', day: 27, score: 74, size: 156, type: '视频' },
      { institution: '广发基金', day: 7, score: 57, size: 104, type: '图文' },
      { institution: '广发基金', day: 19, score: 76, size: 164, type: '视频' },
      { institution: '广发基金', day: 26, score: 70, size: 148, type: '图文' },
      { institution: '富国基金', day: 10, score: 60, size: 114, type: '图文' },
      { institution: '富国基金', day: 21, score: 75, size: 160, type: '长图' },
      { institution: '富国基金', day: 28, score: 69, size: 144, type: '图文' },
      { institution: '南方基金', day: 12, score: 64, size: 126, type: '图文' },
      { institution: '南方基金', day: 20, score: 80, size: 182, type: '视频' },
      { institution: '南方基金', day: 29, score: 73, size: 154, type: '长图' },
      { institution: '嘉实基金', day: 9, score: 59, size: 108, type: '图文' },
      { institution: '嘉实基金', day: 17, score: 78, size: 170, type: '长图' },
      { institution: '嘉实基金', day: 25, score: 72, size: 150, type: '视频' },
      { institution: '汇添富基金', day: 11, score: 61, size: 116, type: '图文' },
      { institution: '汇添富基金', day: 19, score: 77, size: 166, type: '视频' },
      { institution: '汇添富基金', day: 30, score: 71, size: 148, type: '长图' },
      { institution: '博时基金', day: 13, score: 63, size: 120, type: '长图' },
      { institution: '博时基金', day: 22, score: 79, size: 172, type: '视频' },
      { institution: '博时基金', day: 30, score: 70, size: 146, type: '图文' },
    ],
    burstDay: 18,
    deviationData: [
      { track: '创新药', diff: 6.7 },
      { track: '医药生物', diff: 4.8 },
      { track: 'AI应用', diff: -3.1 },
      { track: '半导体设备', diff: -2.6 },
      { track: '红利资产', diff: 2.4 },
      { track: '黄金资源', diff: -1.4 },
    ],
    timeline: [
      { date: '03-10', market: 7, self: 5 },
      { date: '03-15', market: 12, self: 8 },
      { date: '03-20', market: 24, self: 14 },
      { date: '03-25', market: 33, self: 22 },
      { date: '03-30', market: 42, self: 29 },
      { date: '04-04', market: 38, self: 27 },
      { date: '04-08', market: 30, self: 24 },
    ],
  },
  {
    id: 'gold',
    label: '黄金概念',
    dimension: '主题',
    rise: '+168%',
    trigger: '避险情绪升温 + 金价突破',
    notes: [
      { title: '热点启动点', value: '03-18 10:20', detail: '贵金属与黄金股热度同步抬升' },
      { title: '我司较优跟进窗', value: '启动后 8-16 小时', detail: '次日午后跟进，转化效率更高' },
      { title: '当前复盘结论', value: '保持跟踪，避免追高', detail: '更适合事件驱动节奏，不宜连续重仓' },
    ],
    scatterTitle: '主题时序散点密度图',
    scatterSubtitle: '黄金概念近30日复盘',
    scatterLabel: '主题：黄金概念',
    scatterData: [
      { institution: '华夏基金', day: 4, score: 52, size: 90, type: '图文' },
      { institution: '华夏基金', day: 12, score: 72, size: 148, type: '长图' },
      { institution: '华夏基金', day: 21, score: 68, size: 140, type: '视频' },
      { institution: '易方达基金', day: 7, score: 60, size: 118, type: '视频' },
      { institution: '易方达基金', day: 16, score: 85, size: 210, type: '视频' },
      { institution: '易方达基金', day: 24, score: 74, size: 156, type: '长图' },
      { institution: '广发基金', day: 10, score: 65, size: 126, type: '图文' },
      { institution: '广发基金', day: 20, score: 79, size: 170, type: '视频' },
      { institution: '广发基金', day: 27, score: 70, size: 146, type: '图文' },
      { institution: '富国基金', day: 6, score: 48, size: 80, type: '图文' },
      { institution: '富国基金', day: 18, score: 71, size: 150, type: '长图' },
      { institution: '富国基金', day: 25, score: 66, size: 134, type: '图文' },
      { institution: '南方基金', day: 14, score: 64, size: 125, type: '图文' },
      { institution: '南方基金', day: 24, score: 83, size: 190, type: '视频' },
      { institution: '南方基金', day: 29, score: 72, size: 152, type: '长图' },
      { institution: '嘉实基金', day: 9, score: 58, size: 108, type: '图文' },
      { institution: '嘉实基金', day: 17, score: 76, size: 162, type: '长图' },
      { institution: '嘉实基金', day: 26, score: 69, size: 144, type: '视频' },
      { institution: '汇添富基金', day: 11, score: 61, size: 116, type: '图文' },
      { institution: '汇添富基金', day: 19, score: 78, size: 168, type: '视频' },
      { institution: '汇添富基金', day: 28, score: 70, size: 148, type: '长图' },
      { institution: '博时基金', day: 13, score: 63, size: 120, type: '长图' },
      { institution: '博时基金', day: 22, score: 80, size: 174, type: '视频' },
      { institution: '博时基金', day: 30, score: 71, size: 150, type: '图文' },
    ],
    burstDay: 16,
    deviationData: [
      { track: '黄金概念', diff: 6.2 },
      { track: '有色金属', diff: 3.8 },
      { track: '红利资产', diff: 2.9 },
      { track: 'AI应用', diff: -4.7 },
      { track: '半导体设备', diff: -3.5 },
      { track: '创新药', diff: -2.4 },
    ],
    timeline: [
      { date: '03-12', market: 8, self: 6 },
      { date: '03-16', market: 13, self: 8 },
      { date: '03-20', market: 21, self: 14 },
      { date: '03-24', market: 34, self: 19 },
      { date: '03-28', market: 46, self: 27 },
      { date: '04-02', market: 39, self: 24 },
      { date: '04-08', market: 31, self: 20 },
    ],
  },
];

const CHANNEL_COLORS = ['#6b8fd6', '#7eb8a6', '#d8a29b', '#9a8fc8', '#a7b0ba'];

function shortLabel(label, max = 9) {
  const text = String(label || '');
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function buildInstitutionProducts(institution, tracks = []) {
  const suffixMap = {
    华夏基金: ['混合A', 'ETF联接A', '精选A'],
    易方达基金: ['ETF', '混合A', '联接A'],
    广发基金: ['混合A', '精选A', 'ETF联接A'],
    富国基金: ['ETF', '混合A', '精选A'],
  };

  return tracks.map((track, index) => {
    const suffix = suffixMap[institution]?.[index] || ['混合A', 'ETF', '联接A'][index] || '混合A';
    return `${institution.replace('基金', '')}${track.name}${suffix}`;
  });
}

function buildInstitutionChannels(total) {
  return [
    { platform: '微信公众号', count: Math.round(total * 0.34) },
    { platform: '蚂蚁财富', count: Math.round(total * 0.28) },
    { platform: '小红书', count: Math.round(total * 0.21) },
    { platform: '雪球', count: Math.round(total * 0.17) },
  ];
}

function scatterColor(type) {
  if (type === '视频') return '#ef4444';
  if (type === '长图') return '#2563eb';
  return '#0ea5e9';
}

const MultiDimDashboard = () => {
  const [activeDim, setActiveDim] = useState('赛道');
  const [channelMatrixDim, setChannelMatrixDim] = useState('赛道');
  const [selectedRetroEvent, setSelectedRetroEvent] = useState('ai_hardware');
  const [detailCard, setDetailCard] = useState('');

  const windData = HEATMAP_BY_DIMENSION[activeDim];

  const alignmentData = useMemo(
    () =>
      (ALIGNMENT_BY_DIMENSION[activeDim] || []).map((item) => ({
        ...item,
        shortLabel: shortLabel(item.label, 10),
      })),
    [activeDim]
  );

  const trackFocusData = useMemo(
    () =>
      (TRACK_FOCUS_BY_DIMENSION[activeDim] || []).map((row) => ({
        ...row,
        products: buildInstitutionProducts(row.institution, row.tracks),
        channels: buildInstitutionChannels(row.total),
      })),
    [activeDim]
  );

  const channelMatrixScatterData = useMemo(() => {
    const config = CHANNEL_BUBBLE_BY_DIMENSION[channelMatrixDim];
    if (!config) return [];

    return Object.entries(config.channels).flatMap(([channel, items]) => {
      let cumulative = 0;

      return items.flatMap((item, index) => {
        if (item.name === '其他' || cumulative >= 80) return [];
        cumulative += item.pct;

        return {
          channel,
          item: item.name,
          pct: item.pct,
          cumulative: Math.min(cumulative, 80),
          rank: index + 1,
          size: 120 + item.pct * 22,
        };
      });
    });
  }, [channelMatrixDim]);

  const channelMatrixItems = useMemo(
    () => CHANNEL_BUBBLE_BY_DIMENSION[channelMatrixDim]?.items || [],
    [channelMatrixDim]
  );

  const currentRetroEvent = useMemo(
    () => RETRO_EVENTS.find((item) => item.id === selectedRetroEvent) || RETRO_EVENTS[0],
    [selectedRetroEvent]
  );

  const overlapScore = Math.round(
    alignmentData.reduce((sum, item) => sum + Math.min(item.marketShare, item.selfShare), 0)
  );
  const avgGap = (
    alignmentData.reduce((sum, item) => sum + Math.abs(item.marketShare - item.selfShare), 0) /
    alignmentData.length
  ).toFixed(1);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">市场情报雷达</h2>
            <p className="mt-1 text-sm text-gray-500">维度热度、同频偏离与主线风向综合观察</p>
          </div>
          <div className="text-right text-xs text-gray-400">口径：近七日编撰数据</div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">维度：</span>
          {DIMENSIONS.map((dim) => (
            <button
              key={dim}
              type="button"
              onClick={() => setActiveDim(dim)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                activeDim === dim
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white text-gray-600 hover:bg-slate-50'
              }`}
            >
              {dim}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-stretch">
          <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">1. 极速大盘风向标</div>
              <div className="text-xs text-gray-500">热力词条（涨跌箭头）</div>
            </div>

            <div className="text-xs text-gray-600">宣发基调偏“顺势推产品/冲量”</div>

            <div className="mt-3 grid flex-1 grid-cols-1 gap-2.5 md:grid-cols-2">
              {windData.map((item) => {
                const up = item.growth >= 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-3 ${
                      up ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className={`text-xl font-bold leading-tight ${up ? 'text-red-700' : 'text-green-700'}`}>
                      {item.name}
                    </div>
                    <div className={`mt-1.5 text-base font-semibold ${up ? 'text-red-700' : 'text-green-700'}`}>
                      {item.growth > 0 ? '+' : ''}
                      {Math.round(item.growth * 100)}% {up ? '↑' : '↓'}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      相关内容数：{item.value} · 近七日变化：{item.growth > 0 ? '+' : ''}
                      {(item.growth * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">2. 主线同频占比</div>
              <div className="text-xs text-gray-500">份额差值视图</div>
            </div>

            <div className="text-xs text-gray-600">主线相似度：{overlapScore}% · 主线一致，但我司在创新药与红利方向更重</div>

            <div className="mt-3 flex flex-1 flex-col rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">主线相似度</div>
                  <div className="text-lg font-semibold text-slate-900">{overlapScore}%</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">平均偏离</div>
                  <div className="text-lg font-semibold text-slate-900">{avgGap} 个百分点</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-[11px] text-slate-500">缺失热点</div>
                  <div className="text-sm font-semibold text-slate-900">AI应用 / 光纤光缆</div>
                </div>
              </div>

              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alignmentData} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 30]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="shortLabel" width={126} interval={0} />
                    <Tooltip
                      formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
                      labelFormatter={(_, payload) => `题材：${payload?.[0]?.payload?.label || ''}`}
                    />
                    <Legend />
                    <Bar name="市场占比" dataKey="marketShare" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    <Bar name="我司占比" dataKey="selfShare" fill="#16a34a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-xs text-slate-500">过配方向：创新药 / 红利资产</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">3. 竞对重仓矩阵</div>
            <div className="text-xs text-gray-500">随当前维度联动变化，突出各机构第一重仓方向</div>
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {trackFocusData.map((row) => (
              <div
                key={row.institution}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      {row.institution}
                      <span className="ml-1 text-sm font-normal text-slate-500">
                        （{row.products?.[0] || '主推产品'}）
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">相关内容数：{row.total}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                      主推方向：{row.tracks[0]?.name || '暂无'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailCard(detailCard === row.institution ? '' : row.institution)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      {detailCard === row.institution ? '收起' : '详情'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {row.tracks.map((track, index) => (
                    <div
                      key={`${row.institution}-${track.name}`}
                      className={`rounded-lg border px-3 py-2 ${
                        index === 0 ? 'border-rose-200 bg-rose-50/70' : 'border-slate-200 bg-slate-50/70'
                      }`}
                      title={`${track.name}：${track.count}条，占比 ${track.pct}%`}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-[11px] font-semibold ${
                              index === 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{track.name}</span>
                        </div>
                        <div className="text-xs text-slate-500">{track.count} 条 / {track.pct}%</div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-amber-500' : 'bg-sky-500'}`}
                          style={{ width: `${track.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {detailCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4" onClick={() => setDetailCard('')}>
            <div
              className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{detailCard}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {activeDim}维度下的主推基金与渠道内容分布
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailCard('')}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50"
                >
                  关闭
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 px-6 py-5 lg:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-slate-500">主推基金列表</div>
                  <div className="mt-3 space-y-2">
                    {(trackFocusData.find((item) => item.institution === detailCard)?.products || []).map((product, index) => (
                      <div key={`${detailCard}-${product}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        {index + 1}. {product}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500">发布平台与内容数量</div>
                  <div className="mt-3 space-y-2">
                    {(trackFocusData.find((item) => item.institution === detailCard)?.channels || []).map((channel) => (
                      <div key={`${detailCard}-${channel.platform}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span>{channel.platform}</span>
                          <span>{channel.count} 条</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">竞对透视与渠道阵地拆解</h2>
            <p className="mt-1 text-sm text-gray-500">机构 × 赛道 × 渠道 · 运营模式扫描 · 结构透视</p>
          </div>
          <div className="text-right text-xs text-gray-400">样本机构：8 家</div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">1. 内容发布渠道分配图</div>
              <div className="text-xs text-gray-500">横向堆叠条形图（机构内容发布渠道占比）</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div style={{ width: '100%', height: Math.max(380, CHANNEL_DISTRIBUTION.length * 36) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CHANNEL_DISTRIBUTION}
                    layout="vertical"
                    margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
                    barCategoryGap={10}
                    barGap={1}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="shortInstitution" width={96} tick={{ fontSize: 11 }} interval={0} />
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      labelFormatter={(_, payload) => `机构：${payload?.[0]?.payload?.institution || ''}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="蚂蚁财富" stackId="a" fill={CHANNEL_COLORS[0]} />
                    <Bar dataKey="微信公众号" stackId="a" fill={CHANNEL_COLORS[1]} />
                    <Bar dataKey="小红书" stackId="a" fill={CHANNEL_COLORS[2]} />
                    <Bar dataKey="雪球" stackId="a" fill={CHANNEL_COLORS[3]} />
                    <Bar dataKey="其他" stackId="a" fill={CHANNEL_COLORS[4]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 text-xs leading-6 text-gray-500">
              观察：易方达和南方更偏微信公众号，华夏与嘉实在蚂蚁财富的渠道权重更高，广发与汇添富对小红书更积极。
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">2. 渠道内容集中度气泡矩阵</div>
              <div className="text-xs text-gray-500">按各渠道内容累计覆盖 80% 的核心项展示分布</div>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              {DIMENSIONS.map((dim) => (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setChannelMatrixDim(dim)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    channelMatrixDim === dim
                      ? 'border-slate-800 bg-slate-800 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dim}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div style={{ width: '100%', height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 12, bottom: 36, left: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="category"
                      dataKey="item"
                      name={channelMatrixDim}
                      ticks={channelMatrixItems}
                      allowDuplicatedCategory={false}
                      tick={{ fontSize: 11 }}
                      interval={0}
                      height={60}
                    />
                    <YAxis
                      type="category"
                      dataKey="channel"
                      name="渠道"
                      width={92}
                      allowDuplicatedCategory={false}
                      tick={{ fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="size" range={[180, 1100]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name, props) => {
                        if (name === 'size') return null;
                        return [`${props?.payload?.pct || 0}%`, '内容占比'];
                      }}
                      labelFormatter={(_, payload) => {
                        const row = payload?.[0]?.payload;
                        return row ? `${row.channel} × ${row.item}` : '';
                      }}
                    />
                    <Scatter data={channelMatrixScatterData} fill="#7c9dcf">
                      {channelMatrixScatterData.map((entry) => (
                        <Cell
                          key={`${entry.channel}-${entry.item}`}
                          fill={entry.pct >= 15 ? '#5b7fd1' : entry.pct >= 10 ? '#89a6dd' : '#c7d6eb'}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">战术后验与时机复盘</h2>
            <p className="mt-1 text-sm text-gray-500">事件起爆、竞争响应与策略偏离回看</p>
          </div>
          <div className="text-right text-xs text-gray-400">复盘窗口：近 30 天</div>
        </div>

        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">0. 近30日热度提升事件选择</div>
            <div className="text-xs text-gray-500">先选事件，再进入复盘</div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {RETRO_EVENTS.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedRetroEvent(event.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  currentRetroEvent.id === event.id
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-xs ${currentRetroEvent.id === event.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {event.dimension}
                    </div>
                    <div className="mt-1 text-base font-semibold">{event.label}</div>
                  </div>
                  <div className={`text-sm font-semibold ${currentRetroEvent.id === event.id ? 'text-emerald-300' : 'text-rose-600'}`}>
                    {event.rise}
                  </div>
                </div>
                <div className={`mt-2 text-xs leading-5 ${currentRetroEvent.id === event.id ? 'text-slate-200' : 'text-slate-500'}`}>
                  {event.trigger}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {currentRetroEvent.notes.map((note) => (
            <div key={note.title} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">{note.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{note.value}</div>
              <div className="mt-1 text-xs text-slate-500">{note.detail}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">1. {currentRetroEvent.scatterTitle}</div>
              <div className="text-xs text-gray-500">{currentRetroEvent.scatterSubtitle}</div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-2">
              <div style={{ width: '100%', height: 460 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 16, bottom: 16, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="day"
                      domain={[1, 30]}
                      ticks={[1, 5, 10, 15, 20, 25, 30]}
                      tickFormatter={(value) => `D${value}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="institution"
                      width={90}
                      allowDuplicatedCategory={false}
                    />
                    <ZAxis dataKey="size" range={[60, 240]} />
                    <Tooltip
                      formatter={(value, name, props) => {
                        if (name === 'size') return [props?.payload?.size || 0, '热度值'];
                        return [value, name];
                      }}
                      labelFormatter={() => currentRetroEvent.scatterLabel}
                    />
                    <ReferenceLine
                      x={currentRetroEvent.burstDay}
                      stroke="#ef4444"
                      strokeDasharray="6 6"
                      label={{ value: '热度起爆点', position: 'top', fill: '#ef4444', fontSize: 11 }}
                    />
                    <Scatter
                      data={currentRetroEvent.scatterData}
                      shape={(props) => {
                        const { cx, cy, size, payload } = props;
                        if (cx == null || cy == null) return null;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={Math.max(4, Math.sqrt((size || 60) / 10))}
                            fill={scatterColor(payload?.type)}
                            fillOpacity={0.68}
                            stroke="rgba(15,23,42,0.18)"
                          />
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
                视频
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#2563eb' }} />
                长图
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#0ea5e9' }} />
                图文
              </span>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
};

export default MultiDimDashboard;
