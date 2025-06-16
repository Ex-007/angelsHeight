// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/supabase'],
  css: [
    "~/assets/css/global.css",
    'font-awesome/css/font-awesome.min.css',
  ],
  build: {
    transpile: ["font-awesome"]
  },
  supabase:{
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions:{
      login: '/Login',
      callback : '/Confirm',
      exclude: ['/*'],
    },
  },
  runtimeConfig:{
    public:{
      supabase:{
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
      },
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      }
    }
  },
  ssr: true,
  nitro: {
    preset: 'static'
  }
})
