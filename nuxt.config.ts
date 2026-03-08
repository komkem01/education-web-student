// https://nuxt.com/docs/api/configuration/nuxt-config
const devServerHost = process.env.NUXT_DEV_SERVER_HOST || '192.168.1.53'
const devServerPort = Number(process.env.NUXT_DEV_SERVER_PORT || 3001)
const hmrHost = process.env.NUXT_HMR_HOST || '192.168.1.53'
const hmrPort = Number(process.env.NUXT_HMR_PORT || devServerPort)

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-03-08',
  devServer: {
    host: devServerHost,
    port: devServerPort,
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: hmrHost,
        port: hmrPort,
        clientPort: hmrPort,
      },
    },
  },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://192.168.1.53:8080/api/v1',
    },
  },
  typescript: {
    strict: true,
    shim: false,
  },
  pages: true,
})
