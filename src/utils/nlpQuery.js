/**
 * 简单的NLP查询关键词提取和映射
 * 从自然语言查询中提取关键词，并映射到素材的各个字段
 */

/**
 * 视觉风格关键词映射
 */
const visualStyleMap = {
  '科技风格': '科技风', // 优先匹配更长的
  '科技风': '科技风',
  '科技': '科技风',
  '喜庆国风': '喜庆国风',
  '国风': '喜庆国风',
  '简约金融风': '简约金融风',
  '简约': '简约金融风',
  '金融风': '简约金融风',
  '数据可视化风': '数据可视化风',
  '数据可视化': '数据可视化风',
  '可视化': '数据可视化风',
  '卡通IP风': '卡通IP风',
  '卡通': '卡通IP风',
  'IP风': '卡通IP风',
  '红色喜庆风': '红色喜庆风',
  '红色': '红色喜庆风',
  '喜庆': '红色喜庆风',
  '金色质感风': '金色质感风',
  '金色': '金色质感风',
  '质感': '金色质感风',
  '渐变科技风': '渐变科技风',
  '渐变': '渐变科技风',
};

/**
 * 物料定位关键词映射
 */
const materialPositioningMap = {
  '产品宣传': '产品宣传',
  '宣传': '产品宣传',
  '推广': '产品宣传',
  '投资者教育': '投资者教育',
  '教育': '投资者教育',
  '活动营销': '活动营销',
  '活动': '活动营销',
  '营销': '活动营销',
  '热点解读': '热点解读',
  '热点': '热点解读',
  '解读': '热点解读',
  '行情分析': '行情分析',
  '行情': '行情分析',
  '分析': '行情分析',
  '投资建议': '投资建议',
  '建议': '投资建议',
};

/**
 * 推送时机关键词映射
 */
const pushTimingMap = {
  '日常推送': '日常推送',
  '日常': '日常推送',
  '行业估值低位': '行业估值低位',
  '估值低位': '行业估值低位',
  '低位': '行业估值低位',
  '行业政策利好': '行业政策利好',
  '政策利好': '行业政策利好',
  '利好': '行业政策利好',
  '市场热度提升': '市场热度提升',
  '热度提升': '市场热度提升',
  '宏观政策转向': '宏观政策转向',
  '政策转向': '宏观政策转向',
  '板块异动': '板块异动',
  '异动': '板块异动',
  '节假日营销': '节假日营销',
  '节假日': '节假日营销',
  '经济数据发布': '经济数据发布',
  '数据发布': '经济数据发布',
};

/**
 * 产品核心卖点关键词映射
 */
const sellingPointMap = {
  '巨额涨幅': '巨额涨幅',
  '涨幅': '巨额涨幅',
  '历史新高': '历史新高',
  '新高': '历史新高',
  '政策催化': '政策催化',
  '催化': '政策催化',
  '估值底部': '估值底部',
  '底部': '估值底部',
  '高股息': '高股息',
  '股息': '高股息',
  '周期拐点': '周期拐点',
  '拐点': '周期拐点',
  '行业利好': '行业利好',
  '配置机遇': '配置机遇',
  '机遇': '配置机遇',
};

/**
 * 物料类型关键词映射
 */
const materialTypeMap = {
  '长图': '长图',
  '海报': '海报',
  '封面图': '封面图',
  '截屏': '截屏',
  '视频': '视频',
};

/**
 * 行业主题关键词映射（部分常见行业）
 */
const industryThemeMap = {
  '科技': '科技',
  '半导体': '半导体',
  '新能源': '新能源',
  '储能': '储能',
  '医药': '医药',
  '医疗': '医药',
  '创新药': '创新药',
  '金融': '金融',
  '红利': '金融/红利',
  '消费': '消费',
  '白酒': '白酒',
  '有色金属': '有色金属',
  '有色': '有色金属',
  '军工': '军工',
  '光伏': '新能源/光伏',
};

/**
 * 从查询文本中提取关键词并映射到素材字段
 */
export const extractKeywords = (queryText) => {
  const lowerQuery = queryText.toLowerCase();
  const normalizedQuery = queryText;
  
  const extracted = {
    visualStyle: null,
    materialPositioning: null,
    pushTiming: null,
    sellingPoint: null,
    materialType: null,
    industryTheme: null,
    keywords: [],
  };
  
  // 提取视觉风格（优先匹配更长的关键词，避免误匹配）
  const visualStyleKeys = Object.keys(visualStyleMap).sort((a, b) => b.length - a.length);
  for (const key of visualStyleKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.visualStyle = visualStyleMap[key];
      console.log(`[NLP] 匹配视觉风格: "${key}" -> "${visualStyleMap[key]}"`);
      break;
    }
  }
  
  // 提取物料定位（优先匹配更长的关键词）
  const positioningKeys = Object.keys(materialPositioningMap).sort((a, b) => b.length - a.length);
  for (const key of positioningKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.materialPositioning = materialPositioningMap[key];
      break;
    }
  }
  
  // 提取推送时机（优先匹配更长的关键词）
  const timingKeys = Object.keys(pushTimingMap).sort((a, b) => b.length - a.length);
  for (const key of timingKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.pushTiming = pushTimingMap[key];
      break;
    }
  }
  
  // 提取产品核心卖点（优先匹配更长的关键词）
  const sellingPointKeys = Object.keys(sellingPointMap).sort((a, b) => b.length - a.length);
  for (const key of sellingPointKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.sellingPoint = sellingPointMap[key];
      break;
    }
  }
  
  // 提取物料类型（优先匹配更长的关键词）
  const materialTypeKeys = Object.keys(materialTypeMap).sort((a, b) => b.length - a.length);
  for (const key of materialTypeKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.materialType = materialTypeMap[key];
      break;
    }
  }
  
  // 提取行业主题（优先匹配更长的关键词）
  const industryKeys = Object.keys(industryThemeMap).sort((a, b) => b.length - a.length);
  for (const key of industryKeys) {
    if (normalizedQuery.includes(key) || lowerQuery.includes(key.toLowerCase())) {
      extracted.industryTheme = industryThemeMap[key];
      break;
    }
  }
  
  // 提取其他关键词（用于全文搜索）
  // 如果已经提取到具体字段，仍然可以提取关键词作为补充
  const stopWords = ['的', '了', '是', '在', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '相关', '素材', '我要', '搜', '查找', '找', '风格', '相关素材'];
  
  // 移除已匹配的关键词，避免重复
  let queryForKeywords = normalizedQuery;
  if (extracted.visualStyle) {
    // 找到所有匹配的关键词并移除
    for (const key of Object.keys(visualStyleMap)) {
      if (visualStyleMap[key] === extracted.visualStyle) {
        queryForKeywords = queryForKeywords.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
      }
    }
  }
  
  const words = queryForKeywords
    .replace(/[，。！？、；：]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.includes(word));
  
  extracted.keywords = words.slice(0, 5);
  console.log(`[NLP] 提取的关键词:`, extracted);
  
  return extracted;
};

/**
 * 根据提取的关键词搜索素材
 */
export const searchMaterials = (materials, extractedKeywords) => {
  if (!materials || materials.length === 0) {
    return [];
  }
  
  let results = [...materials];
  
  // 检查是否有任何筛选条件
  const hasSpecificFilter = extractedKeywords.visualStyle || 
      extractedKeywords.materialPositioning || 
      extractedKeywords.pushTiming || 
      extractedKeywords.sellingPoint || 
      extractedKeywords.materialType || 
      extractedKeywords.industryTheme;
  
  // 视觉风格筛选
  if (extractedKeywords.visualStyle) {
    const beforeCount = results.length;
    results = results.filter(m => {
      const match = m.视觉风格 === extractedKeywords.visualStyle;
      if (!match && beforeCount < 10) {
        console.log(`[搜索] 素材 ${m.id} 视觉风格不匹配: "${m.视觉风格}" !== "${extractedKeywords.visualStyle}"`);
      }
      return match;
    });
    console.log(`[搜索] 视觉风格筛选: ${beforeCount} -> ${results.length} (筛选条件: ${extractedKeywords.visualStyle})`);
  }
  
  // 物料定位筛选
  if (extractedKeywords.materialPositioning) {
    results = results.filter(m => m.物料定位 === extractedKeywords.materialPositioning);
  }
  
  // 推送时机筛选
  if (extractedKeywords.pushTiming) {
    results = results.filter(m => m.推送时机 === extractedKeywords.pushTiming);
  }
  
  // 产品核心卖点筛选
  if (extractedKeywords.sellingPoint) {
    results = results.filter(m => m.产品核心卖点 === extractedKeywords.sellingPoint);
  }
  
  // 物料类型筛选
  if (extractedKeywords.materialType) {
    results = results.filter(m => m.type === extractedKeywords.materialType);
  }
  
  // 行业主题筛选（支持部分匹配）
  if (extractedKeywords.industryTheme) {
    results = results.filter(m => {
      if (!m.industryTheme) return false;
      const theme = m.industryTheme.toString();
      return theme.includes(extractedKeywords.industryTheme) ||
             extractedKeywords.industryTheme.includes(theme);
    });
  }
  
  // 关键词全文搜索（作为补充或主要搜索方式）
  // 如果已经有具体的字段筛选条件，且筛选结果不为空，就不需要再进行关键词搜索取交集
  if (extractedKeywords.keywords && extractedKeywords.keywords.length > 0) {
    const keywordResults = materials.filter(m => {
      const searchText = [
        m.title,
        m.source,
        m.industryTheme,
        m.relatedProduct,
        m.物料定位,
        m.推送时机,
        m.视觉风格,
        m.产品核心卖点,
      ].filter(Boolean).map(s => String(s)).join(' ').toLowerCase();
      
      return extractedKeywords.keywords.some(keyword => {
        const keywordLower = String(keyword).toLowerCase();
        return searchText.includes(keywordLower);
      });
    });
    
    console.log(`[搜索] 关键词搜索找到 ${keywordResults.length} 条结果`);
    
    if (hasSpecificFilter) {
      // 如果已经有具体的字段筛选条件
      if (results.length > 0) {
        // 如果字段筛选有结果，直接返回字段筛选结果（不需要取交集）
        // 因为字段筛选更精确，关键词搜索可能因为停用词等问题导致结果为空
        console.log(`[搜索] 已有字段筛选结果 ${results.length} 条，直接返回字段筛选结果`);
      } else {
        // 如果字段筛选没有结果，尝试使用关键词搜索
        console.log(`[搜索] 字段筛选无结果，使用关键词搜索`);
        results = keywordResults;
      }
    } else {
      // 只使用关键词搜索
      results = keywordResults;
    }
  }
  
  // 如果没有任何筛选条件且没有关键词，返回所有素材
  if (!hasSpecificFilter && (!extractedKeywords.keywords || extractedKeywords.keywords.length === 0)) {
    console.log('[搜索] 无筛选条件，返回所有素材');
    return materials;
  }
  
  console.log(`[搜索] 最终返回 ${results.length} 条结果`);
  return results;
};
