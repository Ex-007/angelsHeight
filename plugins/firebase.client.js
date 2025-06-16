import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    
    if (process.client) {
      const firebaseConfig = config.public.firebase
      const app = initializeApp(firebaseConfig)
      
      const firestore = getFirestore(app)
      
      nuxtApp.provide('firebase', { app, firestore })
    }
  })