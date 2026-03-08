// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-03-08',
  nitro: {
    compatibilityDate: '2026-03-08',
    routeRules: {
      '/favicon.ico': { redirect: '/favicon-monogram.svg?v=20260308' },
    },
  },
  devtools: { enabled: false },
  telemetry: false,
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-monogram.svg?v=20260308' },
        { rel: 'shortcut icon', href: '/favicon-monogram.svg?v=20260308' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1',
    },
  },
  typescript: {
    strict: true,
    shim: false,
  },
  pages: true,
})
