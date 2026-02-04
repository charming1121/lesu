// 从产品标签.json加载并转换数据
// 使用动态导入，因为JSON文件在assets目录
import { generateExposureMetrics } from '../utils/exposureMetrics.js';

let labeledData = [];

// 动态加载JSON数据的函数
export const loadLabeledData = async () => {
  if (labeledData.length > 0) {
    return labeledData; // 已经加载过，直接返回
  }
  
  try {
    // 尝试不同的路径（开发环境和生产环境）
    const paths = [
      '/lesu/assets/产品标签.json', // 生产环境
      '/assets/产品标签.json', // 开发环境
      './assets/产品标签.json', // 相对路径
    ];
    
    let response = null;
    for (const path of paths) {
      try {
        response = await fetch(path);
        if (response.ok) {
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (response && response.ok) {
      labeledData = await response.json();
    } else {
      console.warn('Failed to load 产品标签.json, using empty array');
      labeledData = [];
    }
  } catch (error) {
    console.error('Error loading 产品标签.json:', error);
    labeledData = [];
  }
  
  return labeledData;
};

/**
 * 将JSON标签数据转换为组件所需格式
 */
export const transformLabeledData = () => {
  return labeledData.map((item, index) => {
    // 根据物料定位判断决策场景
    const getDecisionScenario = (物料定位) => {
      if (物料定位 === '产品宣传' || 物料定位 === '活动营销') {
        return '持营动作';
      }
      // 可以根据需要添加合规风险判断逻辑
      // 这里暂时不设置合规风险，因为JSON中没有明确标记
      if (物料定位 === '热点解读' || 物料定位 === '行情分析') {
        return '高热爆款';
      }
      return '持营动作'; // 默认
    };

    // 根据发布渠道获取channel标识
    const getChannel = (发布渠道) => {
      if (发布渠道.includes('微信') || 发布渠道 === '微信生态') {
        return '公众号';
      }
      if (发布渠道.includes('蚂蚁') || 发布渠道 === '第三方销售平台') {
        return '蚂蚁财富号';
      }
      if (发布渠道.includes('小红书') || 发布渠道 === '自媒体平台') {
        return '小红书';
      }
      return '公众号'; // 默认
    };

    // 生成唯一ID
    const id = index + 1;

    // 构建图片路径（根据base路径调整）
    // 在生产环境中，base是/lesu/，所以路径应该是/lesu/assets/images/文件名
    // 在开发环境中，Vite会自动处理base路径
    const imagePath = `/lesu/assets/images/${item.文件名}`;

    // 构建基础素材对象
    const baseMaterial = {
      id,
      // 基础信息
      title: item.标题,
      source: item.发布机构,
      channel: getChannel(item.发布渠道),
      time: item.发布时间 === '未知' ? '未知' : item.发布时间,
      type: item.物料类型,
      relatedProduct: item.关联产品,
      industryTheme: item.行业主题,
      // 策略定位
      物料定位: item.物料定位,
      推送时机: item.推送时机,
      用户人群: item.用户人群,
      // 视觉分析
      视觉风格: item.视觉风格,
      视觉主体: item.视觉主体,
      创新点: item.创新点,
      // 核心卖点
      产品核心卖点: item.产品核心卖点,
      // 图片路径
      path: imagePath,
      imagePath: imagePath, // 兼容旧字段
      // 决策场景（用于Tab过滤）
      decisionScenario: getDecisionScenario(item.物料定位),
      // 兼容旧字段（如果没有则使用默认值）
      category: item.行业主题 || '全行业',
      // 复用旧标签字段映射到新标签
      sceneTag: item.物料定位,
      emotionTag: item.推送时机,
      formatTag: item.物料类型,
      reuseCount: 0,
      // 合规风险（暂时为空，后续可以根据需要添加）
      complianceRisks: [],
    };

    // 生成曝光指标
    const exposureMetrics = generateExposureMetrics(baseMaterial);

    return {
      ...baseMaterial,
      // 曝光指标
      ...exposureMetrics,
      // 兼容旧字段
      heat: exposureMetrics.views,
      interaction: exposureMetrics.likes,
    };
  });
};

// 导出转换后的数据函数（组件中使用）
export const getLabeledMaterials = async () => {
  const data = await loadLabeledData();
  return transformLabeledData();
};

// 同步获取数据（如果已加载）
export const getLabeledMaterialsSync = () => {
  if (labeledData.length === 0) {
    return [];
  }
  return transformLabeledData();
};
