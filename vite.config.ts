import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) =>{
  const currentDir = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, currentDir, 'VITE_')
  const timestamp = +new Date()
  return {
    plugins: [vue()],
    base: env.VITE_APP_BASE_PATH || '/',
    
    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    
    // 服务器配置
    server: {
      port: 3000,
      open: false,
      host: '0.0.0.0', // 允许外部访问
      cors: true // 启用CORS
      // 注释掉代理配置，直接使用外部API
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //     secure: false
      //   }
      // }
    },
    
    // 构建配置
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: `assets/js/[name]-[hash].${timestamp}.js`,
          entryFileNames: `assets/js/[name]-[hash].${timestamp}.js`,
          assetFileNames: `assets/[ext]/[name]-[hash].${timestamp}.[ext]`
        }
      }
    },
    
    // CSS配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        // 在生产模式下，让CSS和JS资源使用CDN地址
        // 在production和preview模式下都使用CDN前缀
        if (mode === 'production') {
          // 对于JS和CSS文件，使用CDN前缀
          if (filename.includes('.js') || filename.includes('.css')) {
            return env.VITE_CDN_PREFIX + filename.replace(/^\//, '')
          }
        }
        // 其他文件保持默认行为
        return { relative: true }
      },
    },
  }
})