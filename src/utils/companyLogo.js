/**
 * 获取基金公司logo路径
 * @param {string} companyName - 基金公司名称
 * @returns {string} logo路径
 */
export const getCompanyLogo = (companyName) => {
  if (!companyName) return null;
  
  // 映射公司名称到logo文件名
  const logoMap = {
    '华夏基金': '华夏基金.png',
    '广发基金': '广发基金.png',
    '易方达基金': '易方达基金.png',
  };
  
  const logoFileName = logoMap[companyName];
  if (!logoFileName) return null;
  
  // 返回logo路径（支持开发和生产环境）
  const paths = [
    `/lesu/assets/logo/${logoFileName}`, // 生产环境
    `/assets/logo/${logoFileName}`, // 开发环境
    `./assets/logo/${logoFileName}`, // 相对路径
  ];
  
  // 返回第一个路径，让浏览器处理加载
  return paths[0];
};

/**
 * 检查logo是否存在（用于fallback）
 */
export const hasCompanyLogo = (companyName) => {
  if (!companyName) return false;
  const logoMap = {
    '华夏基金': true,
    '广发基金': true,
    '易方达基金': true,
  };
  return logoMap[companyName] || false;
};
