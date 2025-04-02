// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
 
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "vuetify-nuxt-module"],
  fonts: { families: [{ name: "literata", provider: "google" }] },
  css: ["~/assets/scss/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    },
  },
});
