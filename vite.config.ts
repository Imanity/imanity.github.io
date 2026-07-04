import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@imanity\/tabi-gallery$/,
        replacement: fileURLToPath(
          new URL('../tabi-gallery/src/index.ts', import.meta.url),
        ),
      },
      {
        find: /^@imanity\/tabi-gallery\/style\.css$/,
        replacement: fileURLToPath(
          new URL('../tabi-gallery/src/styles/tabi-gallery.css', import.meta.url),
        ),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
})
