// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt', '@vueuse/nuxt'],
  ui: {
    icons: ['carbon'],
  },
  colorMode: {
    preference: 'light',
  },
});
