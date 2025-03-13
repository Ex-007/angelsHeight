import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const userValue = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const canProceed = ref(false)

        
    return {

    }
})