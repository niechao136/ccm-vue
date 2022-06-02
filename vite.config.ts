import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import VitePluginCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export default ({ mode }) => defineConfig({
  plugins: [
    createVuePlugin(),
    VitePluginCompression(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/local/': {
        target: loadEnv(mode, process.cwd()).VITE_API_URL,
        secure: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/local\//, '')
      }
    }
  }
})
