// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-03-08',
  nitro: {
    compatibilityDate: '2026-03-08',
  },
  devtools: { enabled: true },
  typescript: {
    strict: true,
    shim: false,
  },
  pages: true,
})
