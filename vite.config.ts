import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: process.cwd(),
  resolve: { 
    alias: {
    "@": resolve(__dirname, "./src"), //把 src 的别名设置为 @
}, },
})
