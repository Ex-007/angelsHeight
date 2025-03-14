import {defineStore} from 'pinia'
import { useRouter } from 'vue-router'

export const useStudentStore = defineStore('studentauth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userData = ref(null)
    const canProceed = ref(false)

    // REGISTER STUDENTS
    const registration = async(RegisterDetails) => {
        console.log(RegisterDetails)
        isLoading.value = true
        error.value = null
        canProceed.value = false
        const client = useSupabaseClient()
        try {
            const {data, error:signUpError} = await client.auth.signUp({
                email : RegisterDetails.email,
                password : RegisterDetails.password,
                options:{
                    emailRedirectTo: `${window.location.origin}/Confirm`,
                    data:{
                        Fullname: RegisterDetails.fullname,
                        Phone: RegisterDetails.phone,
                        Email: RegisterDetails.email,
                        role:'user'
                    }
                }
            })
            if(signUpError) throw signUpError
            userData.value = data.user
            canProceed.value = true
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // LOGIN ADMIN OR STUDENT
    const loginUser = async(loginDetails) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        const router = useRouter()
        
        try {
            const {data, error:signInError} = await client.auth.signInWithPassword({
                email: loginDetails.email,
                password: loginDetails.password
            })
            if(signInError) throw signInError
            // Set user data in store
            userData.value = data.user
            // Check the user's role for redirection
            const userRole = data.user.user_metadata.role
            if(userRole === 'admin') {
                router.push('/admin-dash')
            } else {
                router.push('/Student-profile')
            }
            
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally {
            isLoading.value = false
        }
    }
   



    return{
        isLoading,
        error,
        registration,
        canProceed,
        loginUser
    }
})