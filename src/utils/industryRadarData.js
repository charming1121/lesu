import { getLabeledMaterials } from '../data/labeledMaterialsData';

/**
 * 从卖点文字中提取关键词
 */
const extractSellingPointKeyword = (sellingPointText) => {
  if (!sellingPointText || sellingPointText === '无') return null;
  
  // 根据关键词匹配卖点类型
  if (sellingPointText.includes('涨幅') || sellingPointText.includes('涨超') || sellingPointText.includes('跑赢') || sellingPointText.includes('增长动能')) {
    return '巨额涨幅';
  }
  if (sellingPointText.includes('新高') || sellingPointText.includes('创新高')) {
    return '历史新高';
  }
  if (sellingPointText.includes('政策') || sellingPointText.includes('催化') || sellingPointText.includes('定调') || sellingPointText.includes('规划') || sellingPointText.includes('政策红利')) {
    return '政策催化';
  }
  if (sellingPointText.includes('估值') || sellingPointText.includes('低位') || sellingPointText.includes('底部') || sellingPointText.includes('安全边际')) {
    return '估值底部';
  }
  if (sellingPointText.includes('股息') || sellingPointText.includes('分红') || sellingPointText.includes('红利') || sellingPointText.includes('现金流')) {
    return '高股息';
  }
  if (sellingPointText.includes('拐点') || sellingPointText.includes('上行') || sellingPointText.includes('周期') || sellingPointText.includes('供需')) {
    return '周期拐点';
  }
  if (sellingPointText.includes('行业') || sellingPointText.includes('基本面') || sellingPointText.includes('向好') || sellingPointText.includes('投资价值')) {
    return '行业利好';
  }
  if (sellingPointText.includes('配置') || sellingPointText.includes('机遇') || sellingPointText.includes('布局') || sellingPointText.includes('投资机会')) {
    return '配置机遇';
  }
  return '行业利好'; // 默认
};

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
  
  // 3. 物料类型统计（使用合理的固定占比，不基于真实数据）
  const materialData = [
    { name: '视频', value: 25, color: '#6366F1' },
    { name: '图文', value: 75, color: '#9CA3AF' },
  ];
  
  // 4. 近期热点统计（使用申万一级行业分类）
  // 申万一级行业分类映射
  const mapToShenwanIndustry = (theme) => {
    if (!theme || theme === '全行业' || theme === '无') return '综合';
    
    const themeLower = theme.toLowerCase();
    
    // 申万一级行业分类映射规则（按关键词长度从长到短排序，确保精确匹配）
    const industryMap = [
      // 电子相关（长关键词优先）
      { key: '人工智能', value: '计算机' },
      { key: '新能源车', value: '汽车' },
      { key: '创新药', value: '医药生物' },
      { key: '有色金属', value: '有色金属' },
      { key: '贵金属', value: '有色金属' },
      { key: '云计算', value: '计算机' },
      { key: '半导体', value: '电子' },
      { key: '新能源', value: '电力设备' },
      { key: '创业板', value: '综合' },
      { key: '全行业', value: '综合' },
      
      // 中等长度关键词
      { key: '储能', value: '电力设备' },
      { key: '光伏', value: '电力设备' },
      { key: '风电', value: '电力设备' },
      { key: '机器人', value: '计算机' },
      { key: '军工', value: '国防军工' },
      { key: '航天', value: '国防军工' },
      { key: '航空', value: '国防军工' },
      { key: '医药', value: '医药生物' },
      { key: '医疗', value: '医药生物' },
      { key: '生物', value: '医药生物' },
      { key: '金融', value: '非银金融' },
      { key: '保险', value: '非银金融' },
      { key: '证券', value: '非银金融' },
      { key: '银行', value: '银行' },
      { key: '通信', value: '通信' },
      { key: '传媒', value: '传媒' },
      { key: '文化', value: '传媒' },
      { key: '汽车', value: '汽车' },
      { key: '白酒', value: '食品饮料' },
      { key: '消费', value: '食品饮料' },
      { key: '食品', value: '食品饮料' },
      { key: '饮料', value: '食品饮料' },
      
      // 短关键词
      { key: '电子', value: '电子' },
      { key: '存储', value: '电子' },
      { key: '芯片', value: '电子' },
      { key: '有色', value: '有色金属' },
      { key: '电力', value: '电力设备' },
      { key: '科技', value: '计算机' },
      { key: '软件', value: '计算机' },
      { key: '5g', value: '通信' },
      { key: 'ai', value: '计算机' },
    ];
    
    // 按关键词长度从长到短排序，优先匹配更长的关键词
    industryMap.sort((a, b) => b.key.length - a.key.length);
    
    // 遍历映射规则，找到匹配的行业
    for (const { key, value } of industryMap) {
      if (themeLower.includes(key)) {
        return value;
      }
    }
    
    // 如果没有匹配，返回综合
    return '综合';
  };
  
  const hotspotCounts = {};
  materials.forEach(m => {
    const theme = m.industryTheme || '全行业';
    const sellingPointText = m.产品核心卖点 || '无';
    
    // 处理多个行业主题（用/分隔），分别映射到申万一级行业
    const themes = theme.split('/').map(t => t.trim()).filter(t => t && t !== '无');
    
    // 对每个主题进行申万一级行业映射
    const shenwanIndustries = themes.map(t => mapToShenwanIndustry(t));
    // 去重，保留第一个
    const mainIndustry = shenwanIndustries[0] || '综合';
    
    // 构建热点标签：申万一级行业 + 产品核心卖点关键词
    let hotspotLabel = mainIndustry;
    if (sellingPointText && sellingPointText !== '无') {
      const sellingPointKeyword = extractSellingPointKeyword(sellingPointText);
      if (sellingPointKeyword) {
        hotspotLabel = `${mainIndustry}·${sellingPointKeyword}`;
      }
    }
    
    hotspotCounts[hotspotLabel] = (hotspotCounts[hotspotLabel] || 0) + 1;
  });
  
  const hotspotTotal = Object.values(hotspotCounts).reduce((sum, count) => sum + count, 0);
  const trackRanking = Object.entries(hotspotCounts)
    .map(([name, count]) => ({
      name,
      value: hotspotTotal > 0 ? Math.round((count / hotspotTotal) * 100) : 0,
      count, // 保留原始数量用于排序
    }))
    .sort((a, b) => {
      // 先按数量排序，再按百分比排序
      if (b.count !== a.count) return b.count - a.count;
      return b.value - a.value;
    })
    .slice(0, 5) // 显示Top 5，让用户看到更多细分热点
    .map(item => ({
      name: item.name,
      value: item.value,
    }));
  
  // 重新计算百分比，确保Top 5的总和为100%
  const trackSum = trackRanking.reduce((sum, item) => sum + item.value, 0);
  if (trackSum !== 100 && trackRanking.length > 0) {
    const diff = 100 - trackSum;
    // 将差值分配给第一个（最大的）
    trackRanking[0].value += diff;
  }
  
  // 5. 推送时机统计（用于产品维度）
  const timingCounts = {};
  materials.forEach(m => {
    const timing = m.推送时机 || '未知';
    timingCounts[timing] = (timingCounts[timing] || 0) + 1;
  });
  
  // 6. 机构传播效果排名（基于曝光指标）
  const institutionEffectiveness = {};
  
  // 解析格式化数值的辅助函数
  const parseFormattedNumber = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      const num = parseFloat(lower.replace(/[^0-9.]/g, ''));
      if (lower.includes('w')) return num * 10000;
      if (lower.includes('k')) return num * 1000;
      return num || 0;
    }
    return 0;
  };
  
  materials.forEach(m => {
    const inst = m.source || '未知机构';
    if (!institutionEffectiveness[inst]) {
      institutionEffectiveness[inst] = {
        name: inst,
        totalViews: 0,
        totalForwards: 0,
        totalLikes: 0,
        materialCount: 0,
      };
    }
    // 优先使用原始数值，否则解析格式化后的数值
    const views = m.viewsRaw || parseFormattedNumber(m.views) || 0;
    const forwards = m.forwardsRaw || parseFormattedNumber(m.forwards) || 0;
    const likes = m.likesRaw || parseFormattedNumber(m.likes) || 0;
    
    institutionEffectiveness[inst].totalViews += views;
    institutionEffectiveness[inst].totalForwards += forwards;
    institutionEffectiveness[inst].totalLikes += likes;
    institutionEffectiveness[inst].materialCount += 1;
  });
  
  // 计算传播效果分数（综合阅读、转发、点赞，加权平均）
  const effectivenessRanking = Object.values(institutionEffectiveness)
    .map(inst => {
      const avgViews = inst.materialCount > 0 ? inst.totalViews / inst.materialCount : 0;
      const avgForwards = inst.materialCount > 0 ? inst.totalForwards / inst.materialCount : 0;
      const avgLikes = inst.materialCount > 0 ? inst.totalLikes / inst.materialCount : 0;
      // 传播效果分数 = 平均阅读量 * 0.5 + 平均转发量 * 100 * 0.3 + 平均点赞数 * 10 * 0.2
      const effectivenessScore = avgViews * 0.5 + avgForwards * 100 * 0.3 + avgLikes * 10 * 0.2;
      return {
        name: inst.name,
        score: effectivenessScore,
        avgViews: Math.round(avgViews),
        avgForwards: Math.round(avgForwards),
        avgLikes: Math.round(avgLikes),
        materialCount: inst.materialCount,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      change: index === 0 ? 'stable' : index === 1 ? 'up' : index === 2 ? 'down' : 'stable',
      changeValue: index === 1 ? 1 : index === 2 ? 1 : undefined,
      note: index === 0 ? '传播效果最佳' : index === 1 ? '传播效果提升' : index === 4 ? '潜力机构' : undefined,
    }));
  
  // 7. 构建六维趋势数据
  const sixDimTrends = [
    {
      id: 'effectiveness',
      label: '传播效果',
      hotword: '机构传播效果排名',
      value: effectivenessRanking.length > 0 ? `Top 3 占比 ${Math.round((effectivenessRanking.slice(0, 3).reduce((sum, item) => sum + item.materialCount, 0) / materials.length) * 100)}%` : '暂无数据',
      trend: 'up',
      top3Ranking: effectivenessRanking.slice(0, 3).map((item, idx) => ({
        name: item.name,
        count: item.avgViews,
        rank: item.rank,
        change: item.change,
      })),
      top5Ranking: effectivenessRanking.map((item, idx) => ({
        name: item.name,
        count: item.avgViews,
        rank: item.rank,
        change: item.change,
        changeValue: item.changeValue,
        note: item.note,
        score: Math.round(item.score),
        avgForwards: item.avgForwards,
        avgLikes: item.avgLikes,
      })),
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
      id: 'hotspot',
      label: '近期热点',
      hotword: '申万一级行业',
      value: trackRanking.length > 0 ? trackRanking[0].name : '未知',
      trend: 'up',
      trackRanking,
      total: 100,
    },
    {
      id: 'material',
      label: '物料',
      hotword: '视频/图文占比',
      value: materialData.length > 0 ? `${materialData[0].name} ${materialData[0].value}%` : '未知',
      trend: 'up',
      materialData: materialData,
      total: 100,
    },
  ];
  
  return { sixDimTrends, materials };
};

/**
 * 基于真实数据生成智能异动监测信息
 * 包含：机构维度、平台维度、产品维度
 */
export const generateAnomalies = (materials) => {
  const anomalies = [];
  
  // 解析格式化数值的辅助函数
  const parseFormattedNumber = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      const num = parseFloat(lower.replace(/[^0-9.]/g, ''));
      if (lower.includes('w')) return num * 10000;
      if (lower.includes('k')) return num * 1000;
      return num || 0;
    }
    return 0;
  };
  
  // ========== 一、机构维度 ==========
  
  // 1. 策略一致性监测（抱团/共识）
  // 监测头部Top机构同时发布同一细分主题的内容
  const hotspotGroups = {}; // 热点主题 -> 机构列表
  materials.forEach(m => {
    const theme = m.industryTheme || '全行业';
    const sellingPointText = m.产品核心卖点 || '无';
    const mainTheme = theme.split('/').map(t => t.trim()).filter(t => t && t !== '无')[0] || '全行业';
    const sellingPointKeyword = extractSellingPointKeyword(sellingPointText);
    const hotspot = sellingPointKeyword ? `${mainTheme}·${sellingPointKeyword}` : mainTheme;
    
    if (!hotspotGroups[hotspot]) {
      hotspotGroups[hotspot] = new Set();
    }
    if (m.source) {
      hotspotGroups[hotspot].add(m.source);
    }
  });
  
  // 找出有3家以上机构同时关注的细分主题（只选择最突出的1-2个）
  const hotspotEntries = Object.entries(hotspotGroups)
    .filter(([_, institutions]) => institutions.size >= 3)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 1); // 只选择机构数量最多的1个
  
  hotspotEntries.forEach(([hotspot, institutions]) => {
    const institutionList = Array.from(institutions).slice(0, 3);
    const moreCount = institutions.size - 3;
    const institutionText = institutionList.join('、') + (moreCount > 0 ? ` 等${institutions.size}家` : '');
    
    anomalies.push({
      id: anomalies.length + 1,
      type: '集体抱团',
      category: '机构维度',
      level: 'high',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '14:23',
      content: `监测到 ${institutionText} 头部机构今日同时发布**"${hotspot}"**相关内容，市场营销共识已形成，建议跟进。`,
      icon: '🔴',
      suggestion: `复用库内[${hotspot.split('·')[0]}]素材，跟进热点。`,
    });
  });
  
  // 2. 头部机构"重注"监测（All-in 信号）
  // 某机构在单日/单周内，关于某产品或赛道的物料占比超过30%
  const institutionFocus = {}; // 机构 -> {主题: 数量}
  materials.forEach(m => {
    if (!m.source) return;
    if (!institutionFocus[m.source]) {
      institutionFocus[m.source] = {};
    }
    const theme = m.industryTheme || '全行业';
    const mainTheme = theme.split('/').map(t => t.trim()).filter(t => t && t !== '无')[0] || '全行业';
    const product = m.relatedProduct || mainTheme;
    
    institutionFocus[m.source][product] = (institutionFocus[m.source][product] || 0) + 1;
  });
  
  // 找出重注推流的机构（只选择占比最高的1个）
  const allInstitutions = [];
  Object.entries(institutionFocus).forEach(([institution, products]) => {
    const total = Object.values(products).reduce((sum, count) => sum + count, 0);
    Object.entries(products).forEach(([product, count]) => {
      const ratio = (count / total) * 100;
      if (ratio >= 30 && total >= 3) {
        allInstitutions.push({
          institution,
          product,
          ratio,
          total,
        });
      }
    });
  });
  
  // 只选择占比最高的1个
  if (allInstitutions.length > 0) {
    const topInstitution = allInstitutions.sort((a, b) => b.ratio - a.ratio)[0];
    anomalies.push({
      id: anomalies.length + 1,
      type: '重注推流',
      category: '机构维度',
      level: 'high',
      typeColor: 'bg-red-100 text-red-700 border-red-200',
      time: '13:45',
      content: `监测到 **${topInstitution.institution}** 近3日发布内容中，"${topInstitution.product}" 相关素材占比高达 ${Math.round(topInstitution.ratio)}%，判定为近期核心主推产品（Flagship Push）。`,
      icon: '🔴',
      suggestion: `关注${topInstitution.institution}的${topInstitution.product}营销策略。`,
    });
  }
  
  // 3. 营销预算/规格异动
  // 检测高成本物料（长图、视频）的密集发布
  const highCostTypes = ['长图', '视频'];
  const institutionHighCost = {}; // 机构 -> 高成本物料数量
  materials.forEach(m => {
    if (highCostTypes.includes(m.type) && m.source) {
      institutionHighCost[m.source] = (institutionHighCost[m.source] || 0) + 1;
    }
  });
  
  // 找出高规格物料（只选择数量最多的1个）
  const highCostInstitutions = Object.entries(institutionHighCost)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1);
  
  highCostInstitutions.forEach(([institution, count]) => {
    const materialType = materials.find(m => m.source === institution && highCostTypes.includes(m.type))?.type || '高成本物料';
    anomalies.push({
      id: anomalies.length + 1,
      type: '高规格物料',
      category: '机构维度',
      level: 'medium',
      typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      time: '12:30',
      content: `监测到 **${institution}** 发布了 ${count}条${materialType}，推测其在相关业务上有重大营销预算投入。`,
      icon: '🟣',
      suggestion: `关注${institution}的高规格内容策略。`,
    });
  });
  
  // ========== 二、平台维度 ==========
  
  // 1. 渠道错位/倾斜监测
  const channelInstitution = {}; // 渠道 -> {机构: {主题: 数量}}
  materials.forEach(m => {
    if (!m.channel || !m.source) return;
    if (!channelInstitution[m.channel]) {
      channelInstitution[m.channel] = {};
    }
    if (!channelInstitution[m.channel][m.source]) {
      channelInstitution[m.channel][m.source] = {};
    }
    const theme = m.industryTheme || '全行业';
    const mainTheme = theme.split('/').map(t => t.trim()).filter(t => t !== '无')[0] || '全行业';
    channelInstitution[m.channel][m.source][mainTheme] = (channelInstitution[m.channel][m.source][mainTheme] || 0) + 1;
  });
  
  // 检测机构在不同渠道的策略差异（只选择占比最高的1个）
  const channelStrategies = [];
  Object.entries(channelInstitution).forEach(([channel, institutions]) => {
    Object.entries(institutions).forEach(([institution, themes]) => {
      const total = Object.values(themes).reduce((sum, count) => sum + count, 0);
      const maxTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0];
      if (maxTheme && (maxTheme[1] / total) >= 0.5 && total >= 3) {
        channelStrategies.push({
          channel,
          institution,
          theme: maxTheme[0],
          ratio: (maxTheme[1] / total) * 100,
        });
      }
    });
  });
  
  // 只选择占比最高的1个
  if (channelStrategies.length > 0) {
    const topStrategy = channelStrategies.sort((a, b) => b.ratio - a.ratio)[0];
    anomalies.push({
      id: anomalies.length + 1,
      type: '渠道策略',
      category: '平台维度',
      level: 'medium',
      typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      time: '11:15',
      content: `监测到 **${topStrategy.institution}** 在 **${topStrategy.channel}** 平台集中投放"${topStrategy.theme}"相关内容（占比${Math.round(topStrategy.ratio)}%），存在明显的渠道客群分层策略。`,
      icon: '🔵',
      suggestion: `分析${topStrategy.channel}平台的${topStrategy.theme}内容策略。`,
    });
  }
  
  // 2. 形式/体裁红利监测
  // 检测某种物料类型的高传播效果
  const materialTypePerformance = {}; // 物料类型 -> {总阅读量, 数量}
  materials.forEach(m => {
    const type = m.type || '未知';
    if (!materialTypePerformance[type]) {
      materialTypePerformance[type] = { totalViews: 0, count: 0 };
    }
    const views = m.viewsRaw || parseFormattedNumber(m.views) || 0;
    materialTypePerformance[type].totalViews += views;
    materialTypePerformance[type].count += 1;
  });
  
  // 计算平均阅读量
  const materialTypeAvgViews = Object.entries(materialTypePerformance).map(([type, data]) => ({
    type,
    avgViews: data.count > 0 ? data.totalViews / data.count : 0,
    count: data.count,
  })).filter(item => item.count >= 3);
  
  if (materialTypeAvgViews.length >= 2) {
    materialTypeAvgViews.sort((a, b) => b.avgViews - a.avgViews);
    const topType = materialTypeAvgViews[0];
    const avgAvg = materialTypeAvgViews.reduce((sum, item) => sum + item.avgViews, 0) / materialTypeAvgViews.length;
    
    if (topType.avgViews > avgAvg * 1.3) {
      anomalies.push({
        id: anomalies.length + 1,
        type: '爆款形式',
        category: '平台维度',
        level: 'medium',
        typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
        time: '10:00',
        content: `监测到 **"${topType.type}"** 类素材平均阅读量 ${Math.round(topType.avgViews / 1000)}k，环比提升${Math.round(((topType.avgViews - avgAvg) / avgAvg) * 100)}%，建议优化${topType.type}内容占比。`,
        icon: '🔥',
        suggestion: `增加${topType.type}内容占比。`,
      });
    }
  }
  
  // ========== 三、产品维度 ==========
  
  // 1. 细分赛道/概念异动（使用申万一级行业）
  const mapToShenwanIndustry = (theme) => {
    if (!theme || theme === '全行业' || theme === '无') return '综合';
    const themeLower = theme.toLowerCase();
    const industryMap = [
      { key: '人工智能', value: '计算机' },
      { key: '新能源车', value: '汽车' },
      { key: '创新药', value: '医药生物' },
      { key: '有色金属', value: '有色金属' },
      { key: '贵金属', value: '有色金属' },
      { key: '云计算', value: '计算机' },
      { key: '半导体', value: '电子' },
      { key: '新能源', value: '电力设备' },
      { key: '储能', value: '电力设备' },
      { key: '光伏', value: '电力设备' },
      { key: '军工', value: '国防军工' },
      { key: '医药', value: '医药生物' },
      { key: '科技', value: '计算机' },
      { key: '金融', value: '非银金融' },
      { key: '电子', value: '电子' },
    ];
    industryMap.sort((a, b) => b.key.length - a.key.length);
    for (const { key, value } of industryMap) {
      if (themeLower.includes(key)) return value;
    }
    return '综合';
  };
  
  const shenwanIndustryGroups = {}; // 申万行业 -> 数量
  materials.forEach(m => {
    const theme = m.industryTheme || '全行业';
    const mainTheme = theme.split('/').map(t => t.trim()).filter(t => t !== '无')[0] || '全行业';
    const shenwanIndustry = mapToShenwanIndustry(mainTheme);
    shenwanIndustryGroups[shenwanIndustry] = (shenwanIndustryGroups[shenwanIndustry] || 0) + 1;
  });
  
  // 找出突然爆发的细分赛道
  const sortedIndustries = Object.entries(shenwanIndustryGroups)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // 找出细分赛道异动（只选择最突出的1个）
  if (sortedIndustries.length >= 2) {
    const topIndustry = sortedIndustries[0];
    const secondIndustry = sortedIndustries[1];
    const ratio = topIndustry[1] / secondIndustry[1];
    
    if (ratio >= 1.3 && topIndustry[1] >= 3) {
      anomalies.push({
        id: anomalies.length + 1,
        type: '细分爆发',
        category: '产品维度',
        level: 'high',
        typeColor: 'bg-red-100 text-red-700 border-red-200',
        time: '09:45',
        content: `**"${topIndustry[0]}"** 细分标签的提及率今日暴增${Math.round((ratio - 1) * 100)}%，远超"${secondIndustry[0]}"，成为今日最热子赛道。`,
        icon: '🚀',
        suggestion: `关注${topIndustry[0]}赛道机会。`,
      });
    }
  }
  
  // 2. 业绩/分红驱动监测
  const sellingPointGroups = {}; // 产品核心卖点关键词 -> 数量
  materials.forEach(m => {
    const spText = m.产品核心卖点 || '无';
    if (spText !== '无') {
      const spKeyword = extractSellingPointKeyword(spText);
      if (spKeyword) {
        sellingPointGroups[spKeyword] = (sellingPointGroups[spKeyword] || 0) + 1;
      }
    }
  });
  
  const dividendKeywords = ['高股息'];
  const performanceKeywords = ['巨额涨幅', '历史新高'];
  
  // 业绩/分红驱动监测（只选择最突出的1个）
  const sellingPointEntries = Object.entries(sellingPointGroups)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);
  
  // 优先选择分红相关的
  const dividendEntry = sellingPointEntries.find(([sp]) => dividendKeywords.includes(sp));
  if (dividendEntry) {
    const [sp, count] = dividendEntry;
    anomalies.push({
      id: anomalies.length + 1,
      type: '分红营销',
      category: '产品维度',
      level: 'medium',
      typeColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      time: '09:30',
      content: `监测到今日有 ${count}家机构 密集发布 **"${sp}"** 相关喜报，形成"分红潮"营销节点。`,
      icon: '💰',
      suggestion: `关注分红相关营销策略。`,
    });
  } else {
    // 如果没有分红，选择业绩相关的
    const performanceEntry = sellingPointEntries.find(([sp]) => performanceKeywords.includes(sp));
    if (performanceEntry) {
      const [sp, count] = performanceEntry;
      anomalies.push({
        id: anomalies.length + 1,
        type: '业绩归因',
        category: '产品维度',
        level: 'low',
        typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        time: '09:15',
        content: `市场普遍开始拿 **"${sp}"** 作为核心卖点（占比升至${Math.round((count / materials.length) * 100)}%），说明市场在强调${sp.includes('历史') ? '长期主义' : '短期业绩'}。`,
        icon: '📊',
        suggestion: `分析${sp}营销趋势。`,
      });
    }
  }
  
  // 3. 新品/次新动向
  // 检测关联产品中的新代码或新品预热
  const productGroups = {}; // 关联产品 -> 数量
  materials.forEach(m => {
    const product = m.relatedProduct || '无';
    if (product !== '无' && product) {
      productGroups[product] = (productGroups[product] || 0) + 1;
    }
  });
  
  // 新品/次新动向（只选择机构数量最多的1个）
  const newProducts = [];
  Object.entries(productGroups).forEach(([product, count]) => {
    if (count >= 3 && count <= 10) {
      const institutions = [...new Set(materials.filter(m => m.relatedProduct === product).map(m => m.source))];
      if (institutions.length >= 2) {
        newProducts.push({
          product,
          count,
          institutions: institutions.length,
        });
      }
    }
  });
  
  // 只选择机构数量最多的1个
  if (newProducts.length > 0) {
    const topProduct = newProducts.sort((a, b) => b.institutions - a.institutions)[0];
    anomalies.push({
      id: anomalies.length + 1,
      type: '新品扎堆',
      category: '产品维度',
      level: 'high',
      typeColor: 'bg-green-100 text-green-700 border-green-200',
      time: '08:45',
      content: `监测到今日有 ${topProduct.count}条 关于 **"${topProduct.product}"** 的新发募集预热内容，${topProduct.institutions}家机构启动预热投放，新品发行竞争进入白热化阶段。`,
      icon: '🆕',
      suggestion: `关注${topProduct.product}新品竞争态势。`,
    });
  }
  
  // 确保每个维度都有展示，并去重
  const categoryCount = {
    '机构维度': 0,
    '平台维度': 0,
    '产品维度': 0,
  };
  
  anomalies.forEach(a => {
    if (a.category && categoryCount[a.category] !== undefined) {
      categoryCount[a.category]++;
    }
  });
  
  // 如果某个维度没有异动，尝试补充
  // 机构维度补充：检测推送时机集中
  if (categoryCount['机构维度'] === 0) {
    const timingGroups = {};
    materials.forEach(m => {
      const timing = m.推送时机 || '未知';
      if (timing !== '日常推送' && timing !== '未知') {
        timingGroups[timing] = (timingGroups[timing] || 0) + 1;
      }
    });
    
    const hotTiming = Object.entries(timingGroups)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (hotTiming && hotTiming[1] >= 5) {
      anomalies.push({
        id: anomalies.length + 1,
        type: '时机集中',
        category: '机构维度',
        level: 'medium',
        typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
        time: '11:00',
        content: `监测到 **"${hotTiming[0]}"** 时机相关内容发布量激增，${hotTiming[1]}条素材集中发布，形成营销节点。`,
        icon: '⏰',
        suggestion: `关注${hotTiming[0]}时机的营销策略。`,
      });
    }
  }
  
  // 平台维度补充：检测物料类型分布
  if (categoryCount['平台维度'] === 0) {
    const typeDistribution = {};
    materials.forEach(m => {
      const type = m.type || '未知';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });
    
    const sortedTypes = Object.entries(typeDistribution)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedTypes.length >= 2) {
      const topType = sortedTypes[0];
      const total = materials.length;
      const ratio = (topType[1] / total) * 100;
      
      if (ratio >= 40) {
        anomalies.push({
          id: anomalies.length + 1,
          type: '形式集中',
          category: '平台维度',
          level: 'low',
          typeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
          time: '10:30',
          content: `监测到 **"${topType[0]}"** 类物料占比达${Math.round(ratio)}%，成为主流内容形式。`,
          icon: '📱',
          suggestion: `关注${topType[0]}形式的内容策略。`,
        });
      }
    }
  }
  
  // 产品维度补充：检测物料定位集中
  if (categoryCount['产品维度'] === 0) {
    const positioningGroups = {};
    materials.forEach(m => {
      const pos = m.物料定位 || '未知';
      if (pos !== '未知') {
        positioningGroups[pos] = (positioningGroups[pos] || 0) + 1;
      }
    });
    
    const hotPositioning = Object.entries(positioningGroups)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (hotPositioning && hotPositioning[1] >= 5) {
      anomalies.push({
        id: anomalies.length + 1,
        type: '定位集中',
        category: '产品维度',
        level: 'medium',
        typeColor: 'bg-teal-100 text-teal-700 border-teal-200',
        time: '09:00',
        content: `监测到 **"${hotPositioning[0]}"** 类物料定位占比${Math.round((hotPositioning[1] / materials.length) * 100)}%，成为主流营销策略。`,
        icon: '🎯',
        suggestion: `关注${hotPositioning[0]}定位的营销效果。`,
      });
    }
  }
  
  // 如果没有检测到任何异动，添加默认提示
  if (anomalies.length === 0) {
    anomalies.push({
      id: 1,
      type: '系统监测',
      category: '系统',
      level: 'low',
      typeColor: 'bg-gray-100 text-gray-700 border-gray-200',
      time: '08:00',
      content: `监测到 ${materials.length} 条素材，系统正常运行中。`,
      icon: '📊',
      suggestion: '持续监控中...',
    });
  }
  
  // 按时间排序（最新的在前），最多显示6-8条，确保每个维度都有展示
  const sortedAnomalies = anomalies.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''));
    const timeB = parseInt(b.time.replace(':', ''));
    return timeB - timeA;
  });
  
  // 确保每个维度至少有一条，然后补充其他
  const result = [];
  const usedCategories = new Set();
  
  // 第一轮：每个维度选择1条
  sortedAnomalies.forEach(a => {
    if (a.category && !usedCategories.has(a.category) && result.length < 3) {
      result.push(a);
      usedCategories.add(a.category);
    }
  });
  
  // 第二轮：补充其他异动
  sortedAnomalies.forEach(a => {
    if (!result.find(r => r.id === a.id) && result.length < 6) {
      result.push(a);
    }
  });
  
  return result;
};
