import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = environment.VITE_API_BASE_URL?.trim()

  if (mode === 'production') {
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is required for production builds')
    }

    try {
      const url = new URL(apiBaseUrl)

      if (!['http:', 'https:'].includes(url.protocol) || !url.pathname.endsWith('/api')) {
        throw new Error()
      }
    } catch {
      throw new Error('VITE_API_BASE_URL must be a valid HTTP or HTTPS URL ending in /api')
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

