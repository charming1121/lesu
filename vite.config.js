import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base 路径配置
  // 访问地址：https://charming1121.github.io/lesu/
  base: '/lesu/',
  server: {
    host: true, // 允许局域网访问
    port: 5173, // 默认端口，可以修改
  },
  build: {
    // 确保资源路径正确
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 确保资源文件名包含hash，避免缓存问题
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
