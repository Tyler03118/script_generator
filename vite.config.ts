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
        rewrite: path => path.replace(/^\/pyinfer_tao_pre/, '/pyinfer_tao_pre'),
        secure: false,
      },
    },
  },
})