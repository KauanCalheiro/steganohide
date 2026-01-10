/// <reference types="@vite-pwa/nuxt" />

import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        baseURL: '/steganohide/',
        head: {
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
