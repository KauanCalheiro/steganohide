// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: import.meta.dev ? '/' : '/steganohide/'
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifestFilename: 'site.webmanifest',
    manifest: {
      name: 'Steganohide',
      short_name: 'Steganohide',
      start_url: import.meta.dev ? '/' : '/steganohide/',
      scope: import.meta.dev ? '/' : '/steganohide/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#00DC82',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    includeAssets: [
      'favicon.ico',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'apple-touch-icon.png'
    ],
    workbox: {
      navigateFallback: import.meta.dev ? '/' : '/steganohide/200.html'
    },
    devOptions: {
      enabled: false
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
