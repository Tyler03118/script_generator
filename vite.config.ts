import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/pyinfer_tao_pre': {
        target: 'https://tppwork.taobao.com',
        changeOrigin: true,
        secure: false,
        timeout: 600000, // 10分钟超时
        proxyTimeout: 600000, // 10分钟代理超时
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('代理错误:', err.message);
          });
          
          proxy.on('proxyReq', (proxyReq) => {
            console.log('代理请求开始:', proxyReq.method, proxyReq.path);
            // 设置更长的超时时间
            proxyReq.setTimeout(600000); // 10分钟
          });
          
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('代理响应开始:', proxyRes.statusCode, req.url);
            // 设置响应超时
            proxyRes.setTimeout(600000); // 10分钟
          });
        },
      },
      // 添加OSS代理配置以解决CORS问题
      '/oss-proxy': {
        target: 'https://mmc-aigc.oss-cn-zhangjiakou.aliyuncs.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/oss-proxy/, ''), // 使用rewrite替代pathRewrite
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('OSS代理错误:', err.message);
          });
          
          proxy.on('proxyReq', (proxyReq) => {
            console.log('OSS代理请求:', proxyReq.method, proxyReq.path);
          });
          
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('OSS代理响应:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})