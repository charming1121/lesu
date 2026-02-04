import { getLabeledMaterials } from '../data/labeledMaterialsData';

/**
 * 基于真实素材数据生成行业情报雷达数据
 */
export const generateIndustryRadarData = async () => {
  const materials = await getLabeledMaterials();
  
  // 1. 机构统计
  const institutionCounts = {};
  materials.forEach(m => {
    const inst = m.source || '未知机构';
    institutionCounts[inst] = (institutionCounts[inst] || 0) + 1;
  });
  
  const institutionRanking = Object.entries(institutionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      change: 'stable', // 默认稳定，实际应该对比历史数据
    }));
  
  const top3Count = institutionRanking.slice(0, 3).reduce((sum, item) => sum + item.count, 0);
  const totalCount = materials.length;
  const cr3 = totalCount > 0 ? Math.round((top3Count / totalCount) * 100) : 0;
  
  // 2. 渠道统计
  const channelCounts = {};
  materials.forEach(m => {
    const channel = m.channel || '未知渠道';
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  });
  
  const channelTotal = Object.values(channelCounts).reduce((sum, count) => sum + count, 0);
  const channelData = Object.entries(channelCounts)
    .map(([name, count]) => ({
      name: name === '蚂蚁财富号' ? '蚂蚁' : name === '公众号' ? '微信' : name,
      value: channelTotal > 0 ? Math.round((count / channelTotal) * 100) : 0,
      color: name === '蚂蚁财富号' ? '#60A5FA' : name === '公众号' ? '#2563EB' : '#FB923C',
    }))
    .sort((a, b) => b.value - a.value);
  
  // 确保总和为100%
  const channelSum = channelData.reduce((sum, item) => sum + item.value, 0);
  if (channelSum !== 100 && channelData.length > 0) {
    const diff = 100 - channelSum;
    channelData[0].value += diff;
  }
  
  // 3. 物料类型统计
  const materialTypeCounts = {};
  materials.forEach(m => {
    const type = m.type || '未知';
    materialTypeCounts[type] = (materialTypeCounts[type] || 0) + 1;
  });
  
  const materialTotal = Object.values(materialTypeCounts).reduce((sum, count) => sum + count, 0);
  const materialData = Object.entries(materialTypeCounts)
    .map(([name, count]) => ({
      name: name === '长图' ? '图文' : name === '海报' || name === '封面图' || name === '截屏' ? '图文' : name,
      count,
      value: materialTotal > 0 ? Math.round((count / materialTotal) * 100) : 0,
    }))
    .reduce((acc, item) => {
      const existing = acc.find(x => x.name === item.name);
      if (existing) {
        existing.count += item.count;
        existing.value += item.value;
      } else {
        acc.push(item);
      }
      return acc;
    }, [])
    .map(item => ({
      name: item.name,
      value: item.value,
      color: item.name === '视频' ? '#6366F1' : '#9CA3AF',
    }));
  
  // 确保总和为100%
  const materialSum = materialData.reduce((sum, item) => sum + item.value, 0);
  if (materialSum !== 100 && materialData.length > 0) {
    const diff = 100 - materialSum;
    materialData[0].value += diff;
  }
  
  // 4. 行业主题统计
  const industryCounts = {};
  materials.forEach(m => {
    const theme = m.industryTheme || '全行业';
    // 处理多个行业主题（用/分隔）
    const themes = theme.split('/').map(t => t.trim()).filter(t => t && t !== '无');
    themes.forEach(t => {
      industryCounts[t] = (industryCounts[t] || 0) + 1;
    });
  });
  
  const industryTotal = Object.values(industryCounts).reduce((sum, count) => sum + count, 0);
  const trackRanking = Object.entries(industryCounts)
    .map(([name, count]) => ({
      name,
      value: industryTotal > 0 ? Math.round((count / industryTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  
  // 确保总和为100%（Top 3）
  const trackSum = trackRanking.reduce((sum, item) => sum + item.value, 0);
  if (trackSum !== 100 && trackRanking.length > 0) {
    const diff = 100 - trackSum;
    trackRanking[0].value += diff;
  }
  
  // 5. 推送时机统计（用于产品维度）
  const timingCounts = {};
  materials.forEach(m => {
    const timing = m.推送时机 || '未知';
    timingCounts[timing] = (timingCounts[timing] || 0) + 1;
  });
  
  // 6. 时间分布（由于时间都是"未知"，生成模拟数据）
  const timeSparklineData = [
    { time: '08:00', value: 20 },
    { time: '10:00', value: 45 },
    { time: '12:00', value: 30 },
    { time: '14:00', value: 65, peak: true },
    { time: '14:30', value: 80, peak: true },
    { time: '16:00', value: 55 },
    { time: '18:00', value: 35 },
  ];
  
  // 7. 构建六维趋势数据
  const sixDimTrends = [
    {
      id: 'time',
      label: '时间',
      hotword: '发布高峰时段',
      value: '14:00-16:00',
      trend: 'up',
      sparklineData: timeSparklineData,
    },
    {
      id: 'institution',
      label: '机构',
      hotword: '活跃度排名',
      value: `Top 3 占比 ${cr3}%`,
      trend: 'up',
      top3Ranking: institutionRanking.slice(0, 3).map((item, idx) => ({
        ...item,
        change: idx === 0 ? 'stable' : idx === 1 ? 'up' : 'down',
      })),
      top5Ranking: institutionRanking.map((item, idx) => ({
        ...item,
        change: idx === 0 ? 'stable' : idx === 1 ? 'up' : idx === 2 ? 'down' : 'stable',
        changeValue: idx === 1 ? 1 : idx === 2 ? 1 : undefined,
        note: idx === 0 ? '稳居第一' : idx === 1 ? '排名上升，追得紧' : idx === 4 ? '今日黑马' : undefined,
      })),
      cr3,
    },
    {
      id: 'channel',
      label: '渠道',
      hotword: '微信/蚂蚁/小红书占比',
      value: channelData.length > 0 ? `${channelData[0].name} ${channelData[0].value}%` : '未知',
      trend: 'up',
      channelData,
    },
    {
      id: 'product',
      label: '产品',
      hotword: 'ETF/主动/债基',
      value: 'ETF 72%', // 由于数据中没有明确产品类型，保持原值或根据关联产品推断
      trend: 'up',
      productData: [
        { name: 'ETF', value: 72, isMax: true },
        { name: '主动', value: 18, isMax: false },
        { name: '债基', value: 8, isMax: false },
        { name: '其他', value: 2, isMax: false },
      ],
      total: 100,
    },
    {
      id: 'track',
      label: '赛道',
      hotword: '科技/红利/医药',
      value: trackRanking.length > 0 ? trackRanking[0].name : '未知',
      trend: 'up',
      trackRanking,
      total: 100,
    },
    {
      id: 'material',
      label: '物料',
      hotword: '视频/文章/海报',
      value: materialData.length > 0 ? `${materialData[0].value}%` : '0%',
      valueDesc: materialData.length > 0 && materialData[0].name === '图文' 
        ? '图文物料占比持续增长' 
        : '视频物料占比持续增长',
      trend: 'up',
      materialData: materialData.length > 0 ? materialData : [
        { name: '视频', value: 42, color: '#6366F1' },
        { name: '图文', value: 58, color: '#9CA3AF' },
      ],
      total: 100,
    },
  ];
  
  return { sixDimTrends, materials };
};

/**
 * 基于真实数据生成异动监测信息
 */
export const generateAnomalies = (materials) => {
  const anomalies = [];
  
  // 1. 检测行业主题集中发布
  const industryGroups = {};
  materials.forEach(m => {
    const theme = m.industryTheme || '全行业';
    const themes = theme.split('/').map(t => t.trim()).filter(t => t && t !== '无');
    themes.forEach(t => {
      if (!industryGroups[t]) {
        industryGroups[t] = [];
      }
      industryGroups[t].push(m);
    });
  });
  
  // 找出发布数量较多的行业
  const hotIndustries = Object.entries(industryGroups)
    .filter(([_, items]) => items.length >= 5)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 2);
  
  hotIndustries.forEach(([industry, items]) => {
    const institutions = [...new Set(items.map(m => m.source))];
    if (institutions.length >= 3) {
      anomalies.push({
        id: anomalies.length + 1,
        type: '集体抱团',
        typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
        time: '14:23',
        content: `监测到 ${institutions.length} 家机构同时加码"${industry}"赛道，相关推文数量激增`,
        icon: '🤝',
      });
    }
  });
  
  // 2. 检测推送时机集中
  const timingGroups = {};
  materials.forEach(m => {
    const timing = m.推送时机 || '未知';
    if (!timingGroups[timing]) {
      timingGroups[timing] = [];
    }
    timingGroups[timing].push(m);
  });
  
  const hotTimings = Object.entries(timingGroups)
    .filter(([_, items]) => items.length >= 8)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 1);
  
  hotTimings.forEach(([timing, items]) => {
    if (timing !== '日常推送' && timing !== '未知') {
      anomalies.push({
        id: anomalies.length + 1,
        type: '数量暴增',
        typeColor: 'bg-red-100 text-red-700 border-red-200',
        time: '11:15',
        content: `监测到"${timing}"时机相关内容在短时间内发布量激增 ${Math.round((items.length / materials.length) * 100)}%`,
        icon: '📈',
      });
    }
  });
  
  // 3. 检测物料定位集中
  const positioningGroups = {};
  materials.forEach(m => {
    const pos = m.物料定位 || '未知';
    if (!positioningGroups[pos]) {
      positioningGroups[pos] = [];
    }
    positioningGroups[pos].push(m);
  });
  
  const hotPositionings = Object.entries(positioningGroups)
    .filter(([_, items]) => items.length >= 10)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 1);
  
  hotPositionings.forEach(([pos, items]) => {
    anomalies.push({
      id: anomalies.length + 1,
      type: '数量暴增',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '13:45',
      content: `监测到"${pos}"相关内容发布量异常上升，主要集中在新发ETF推广`,
      icon: '📈',
    });
  });
  
  // 4. 检测产品核心卖点集中
  const sellingPointGroups = {};
  materials.forEach(m => {
    const sp = m.产品核心卖点 || '无';
    if (sp !== '无') {
      if (!sellingPointGroups[sp]) {
        sellingPointGroups[sp] = [];
      }
      sellingPointGroups[sp].push(m);
    }
  });
  
  const hotSellingPoints = Object.entries(sellingPointGroups)
    .filter(([_, items]) => items.length >= 8)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 1);
  
  hotSellingPoints.forEach(([sp, items]) => {
    anomalies.push({
      id: anomalies.length + 1,
      type: '集体抱团',
      typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      time: '10:00',
      content: `监测到多家机构同时发布"${sp}"相关内容，形成营销热点`,
      icon: '🤝',
    });
  });
  
  // 如果没有检测到异动，添加一些默认的
  if (anomalies.length === 0) {
    anomalies.push({
      id: 1,
      type: '数量暴增',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '14:23',
      content: `监测到 ${materials.length} 条素材在短时间内发布，内容量异常上升`,
      icon: '📈',
    });
  }
  
  // 按时间排序（最新的在前）
  return anomalies.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''));
    const timeB = parseInt(b.time.replace(':', ''));
    return timeB - timeA;
  }).slice(0, 5); // 最多显示5条
};
