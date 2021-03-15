import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      manifest: {
        short_name: 'WebMIDICon',
        name: 'WebMIDICon',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        display: 'standalone',
        theme_color: '#090807',
        background_color: '#353433',
      },
    }),
  ],
})
