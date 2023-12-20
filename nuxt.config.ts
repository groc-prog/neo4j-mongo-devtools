// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    '@': __dirname,
  },
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],
  ui: {
    icons: ['carbon'],
  },
});
