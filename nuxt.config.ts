/// <reference types="@vite-pwa/nuxt" />

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    app: {
        baseURL: '/steganohide/',
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'mobile-web-app-capable', content: 'yes' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/steganohide/favicon.ico' }
            ]
        }
    },

    ui: {
        theme: {
            defaultVariants: {
                size: 'xl',
            },
        },
    },

    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@vite-pwa/nuxt',
        '@nuxtjs/i18n'
    ],

    i18n: {
        defaultLocale: 'en',
        strategy: 'no_prefix',
        locales: [
            { code: 'pt_br', file: 'pt_br.json', },
            { code: 'en', file: 'en.json', },
        ],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            fallbackLocale: 'en'
        }
    },

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
        injectManifest: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        devOptions: {
            enabled: true
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
