import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ ones) for proxy config
  const env = loadEnv(mode, process.cwd(), '')

  const backendOrigin = env.VITE_BACKEND_ORIGIN
  const backendPath   = env.VITE_BACKEND_PATH

  if (!backendOrigin) throw new Error('Missing VITE_BACKEND_ORIGIN in .env')
  if (!backendPath)   throw new Error('Missing VITE_BACKEND_PATH in .env')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        [`${backendPath}/api`]: {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
        [`${backendPath}/uploads`]: {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
