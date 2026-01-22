import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 允许局域网访问
    port: 5173, // 默认端口，可以修改
  },
  // 如果部署到GitHub Pages的子路径，取消下面的注释并设置base路径
  // base: '/your-repo-name/',
})
