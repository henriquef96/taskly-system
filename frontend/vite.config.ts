import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

function githubPagesFallback(): Plugin {
  return {
    name: 'github-pages-fallback',
    writeBundle(options) {
      const outputDirectory = options.dir ?? 'dist'
      copyFileSync(
        resolvePath(outputDirectory, 'index.html'),
        resolvePath(outputDirectory, '404.html'),
      )
    },
  }
}

export default defineConfig({
  base: '/taskly-system/',
  plugins: [react(), tailwindcss(), githubPagesFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
      '/sanctum': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})