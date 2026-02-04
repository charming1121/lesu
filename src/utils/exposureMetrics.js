/**
 * 根据素材丰富度生成曝光相关指标
 * 丰富度基于：标签数量、物料类型、创新点、视觉风格等
 */

/**
 * 计算素材丰富度分数（0-100）
 */
export const calculateRichnessScore = (material) => {
  let score = 0;
  
  // 基础分：物料类型
  const typeScores = {
    '长图': 30,
    '视频': 25,
    '海报': 15,
    '封面图': 10,
    '截屏': 5,
  };
  score += typeScores[material.type] || 10;
  
  // 标签丰富度（每个有效标签+5分）
  const tags = [
    material.物料定位,
    material.推送时机,
    material.用户人群,
    material.视觉风格,
    material.视觉主体,
    material.创新点,
    material.产品核心卖点,
    material.行业主题,
  ].filter(tag => tag && tag !== '无');
  score += tags.length * 5;
  
  // 创新点加分
  if (material.创新点 && material.创新点 !== '无') {
    const innovationScores = {
      '数据可视化': 15,
      'AI生成视觉': 20,
      '互动玩法': 15,
      '福利激励': 10,
      '图表解析': 10,
      '热点拆解': 12,
    };
    score += innovationScores[material.创新点] || 5;
  }
  
  // 视觉风格加分
  if (material.视觉风格) {
    const styleScores = {
      '科技风': 8,
      '渐变科技风': 10,
      '数据可视化风': 12,
      '卡通IP风': 8,
      '金色质感风': 6,
      '红色喜庆风': 5,
      '简约金融风': 4,
      '喜庆国风': 5,
    };
    score += styleScores[material.视觉风格] || 3;
  }
  
  // 物料定位加分
  if (material.物料定位) {
    const positioningScores = {
      '热点解读': 12,
      '行情分析': 10,
      '投资建议': 10,
      '产品宣传': 8,
      '活动营销': 6,
      '投资者教育': 5,
    };
    score += positioningScores[material.物料定位] || 3;
  }
  
  return Math.min(score, 100); // 最高100分
};

/**
 * 根据丰富度分数生成曝光指标
 * 参考范围：
 * - 阅读量：500-50000（普通500-5000，优质5000-50000）
 * - 转发量：阅读量的1%-5%
 * - 点赞数：阅读量的1%-3%
 * - 收藏数：阅读量的0.5%-2%
 */
export const generateExposureMetrics = (material) => {
  const richnessScore = calculateRichnessScore(material);
  
  // 基础阅读量范围：500-5000
  // 根据丰富度分数线性扩展到：500-50000
  const baseViews = 500 + (richnessScore / 100) * 4500; // 500-5000
  const premiumViews = 5000 + (richnessScore / 100) * 45000; // 5000-50000
  
  // 使用对数分布，让数据更真实（大部分在低端，少数在高端）
  const randomFactor = Math.random();
  let views;
  if (randomFactor < 0.7) {
    // 70%的素材在基础范围
    views = baseViews + (Math.random() - 0.5) * baseViews * 0.3;
  } else if (randomFactor < 0.95) {
    // 25%的素材在中等范围
    views = baseViews + (Math.random() * (premiumViews - baseViews) * 0.5);
  } else {
    // 5%的素材在高端范围
    views = premiumViews * 0.5 + Math.random() * premiumViews * 0.5;
  }
  
  views = Math.round(views);
  
  // 转发量：阅读量的1%-5%（根据丰富度调整）
  const forwardRate = 0.01 + (richnessScore / 100) * 0.04; // 1%-5%
  const forwards = Math.round(views * forwardRate * (0.8 + Math.random() * 0.4)); // ±20%波动
  
  // 点赞数：阅读量的1%-3%
  const likeRate = 0.01 + (richnessScore / 100) * 0.02; // 1%-3%
  const likes = Math.round(views * likeRate * (0.8 + Math.random() * 0.4));
  
  // 收藏数：阅读量的0.5%-2%
  const collectRate = 0.005 + (richnessScore / 100) * 0.015; // 0.5%-2%
  const collects = Math.round(views * collectRate * (0.8 + Math.random() * 0.4));
  
  // 评论数：转发量的10%-30%
  const comments = Math.round(forwards * (0.1 + Math.random() * 0.2));
  
  // 格式化数字显示
  const formatNumber = (num) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  return {
    views: formatNumber(views),
    viewsRaw: views,
    forwards: formatNumber(forwards),
    forwardsRaw: forwards,
    likes: formatNumber(likes),
    likesRaw: likes,
    collects: formatNumber(collects),
    collectsRaw: collects,
    comments: formatNumber(comments),
    commentsRaw: comments,
    richnessScore: Math.round(richnessScore),
  };
};
