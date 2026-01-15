// ./vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { URL, fileURLToPath } from 'node:url'
import path from 'path'

// ✅ ESM-compatible __dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('cropper-'),
        },
      },
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // Use import.meta.url to get the path in ES Modules
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'tz-cropperjs',
      fileName: (format) => `tz-cropperjs.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
