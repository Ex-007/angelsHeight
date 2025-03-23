import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userData = ref(null)
    const canProceed = ref(false)
    const canLecture = ref(false)

    // REGISTER ADMIN
    const registerNewAdmin = async(RegisterDetails) => {
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
                        profilePicutre: '',
                        role: "admin"
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
   
    // REGISTER LECTURER
    const registerLecturer = async(lecturerDetails) => {
        isLoading.value = true
        error.value = null
        canLecture.value = false
        const client = useSupabaseClient()
        try {
            const {data, error:lecturerError} = await client.auth.signUp({
                email : lecturerDetails.email,
                password : lecturerDetails.password,
                options:{
                    emailRedirectTo: `${window.location.origin}/Confirm`,
                    data:{
                        Fullname: lecturerDetails.fullname,
                        Phone: lecturerDetails.phone,
                        role: "lecturer"
                    }
                }
            })

            if(lecturerError) throw lecturerError
            userData.value = data.user
            canLecture.value = true
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }
   



    return{
        isLoading,
        error,
        registerNewAdmin,
        canProceed,
        registerLecturer,
        canLecture

    }
})