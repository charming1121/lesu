// 构建后复制 assets 文件夹到 dist 目录的脚本
const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(__dirname, 'dist', 'assets');

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcAssetsDir)) {
  copyDir(srcAssetsDir, distAssetsDir);
  console.log('✅ Assets 文件夹已复制到 dist 目录');
} else {
  console.log('⚠️ Assets 文件夹不存在');
}
