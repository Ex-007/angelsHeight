import {defineStore} from 'pinia'

export const useCourseStore = defineStore('courseForm', () => {
    const isLoading = ref(false)
    const isBypass = ref(false)
    const error = ref(null)
    const courseReturn = ref([])
    const user = ref(null)
    const studentDetails = ref(null)

    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        isBypass.value = false
        const client = useSupabaseClient()
        try {
            const {
                data: loggedUserData,
                error: loggedUserError
            } = await client.auth.getUser()

            if (loggedUserError && !loggedUserData.user) {
                isBypass.value = true
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    return null
                }
                isBypass.value = true
                throw loggedUserError
            }

            if (loggedUserData && loggedUserData.user) {
                user.value = loggedUserData.user
                await fetchDetails()
                return loggedUserData.user
            } else {
                console.log("No user data found:", loggedUserData)
                return null
            }
        } catch (err) {
            isBypass.value = true
            error.value = err.message
            return null
        } finally {
            isLoading.value = false
        }
    }
    
    // FETCHED THE LOGGED IN STUDENT DETAILS
    const fetchDetails = async() => {
        isLoading.value = true
        error.value = null
        const ident = user.value.email
        const client = useSupabaseClient()
        try {
            const {data:signedStuData, error:signedStuError} = await client
            .from('ADMITTEDSTUDENTS')
            .select('*')
            .eq('email', ident)
            .single()
            if(signedStuError) throw signedStuError
            studentDetails.value = signedStuData
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }


    // FETCH THE COURSES FROM CLOUD
    const fetchCourse = async () => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:formData, error:formError} = await client
            .from('COURSELIST')
            .select('*')

            if(formError) throw formError
            courseReturn.value = formData
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }



    return{
        isLoading,
        error,
        courseReturn,
        fetchCourse,
        signinUser,
        fetchDetails,
        isBypass,
        studentDetails
    }
})