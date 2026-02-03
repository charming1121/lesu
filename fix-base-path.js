// 修复 GitHub Pages base 路径的辅助脚本
// 使用方法：node fix-base-path.js <your-repo-name>
// 如果不提供仓库名称，将使用相对路径 './'

const fs = require('fs');
const path = require('path');

const repoName = process.argv[2];

const viteConfigPath = path.join(__dirname, 'vite.config.js');
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

if (repoName) {
  // 如果提供了仓库名称，设置为子路径
  const basePath = `base: '/${repoName}/',`;
  viteConfig = viteConfig.replace(/base:\s*['"].*['"],/, basePath);
  console.log(`✅ 已设置 base 路径为: /${repoName}/`);
} else {
  // 否则使用相对路径
  const basePath = `base: './',`;
  viteConfig = viteConfig.replace(/base:\s*['"].*['"],/, basePath);
  console.log(`✅ 已设置 base 路径为: ./ (相对路径)`);
}

fs.writeFileSync(viteConfigPath, viteConfig);
console.log('✅ vite.config.js 已更新');
