import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const base = process.env.BASE || '/';
const outDir = process.env.OUT_DIR || 'dist';
// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  build: {
    outDir: outDir
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
