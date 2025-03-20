import {defineStore} from 'pinia'

export const useStudentStore = defineStore('studentauth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userData = ref(null)
    const canProceed = ref(false)
    const incoming = ref(null)
    const adminRedirect = ref(false)
    const lecturerRedirect = ref(false)
    const studentRedirect = ref(false)
    const canReset = ref(false)

    // CHECK IF THE REGISTERER IS AN ADMITTED STUDENT BEFORE REGISTRATION
    const checkAdmission = async (RegisterDetails) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data: queryData, error: queryError} = await client
            .from('ADMITTEDSTUDENTS')
            .select('*')
            .eq('email', RegisterDetails.email)
            .single()

            // CHECK IF THE REGISTERER EXISTS IN THE ADMITTED STUDENTS PAGE
            if (queryError) {
                if (queryError.code === 'PGRST116') {
                    error.value = 'You\'re not admitted yet'
                    isLoading.value = false
                    return
                }
                throw queryError
            }

            incoming.value = queryData
            // IF THE EMAIL IS FOUND, REGISTER THE STUDENT
            await registration(RegisterDetails)
            canProceed.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // REGISTER STUDENTS
    const registration = async(RegisterDetails) => {
        console.log(RegisterDetails)
        isLoading.value = true
        error.value = null
        canProceed.value = false
        const client = useSupabaseClient()
        try {
            const {data:authData, error:signUpError} = await client.auth.signUp({
                email : RegisterDetails.email,
                password : RegisterDetails.password,
                options:{
                    emailRedirectTo: `${window.location.origin}/Confirm`,
                    data:{
                        Phone: RegisterDetails.phone,
                        Email: RegisterDetails.email,
                        role:'student'
                    }
                }
            })
            if(signUpError) throw signUpError
            const regID = authData.user.id
            userData.value = authData.user
        //    await  saveOtherDetails(regID, RegisterDetails)
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // FUNCTION TO SAVE OTHER DETAILS TO THE DATABASE
    // const saveOtherDetails = async (regID, RegisterDetails) => {
    //     isLoading.value = true
    //     error.value = null
    //     const client = useSupabaseClient()
    //     try {
    //         const {data:otherDetailsData, error:otherDetailsError} = await client
    //         .from('STUDENTDETAILS')
    //         .insert([
    //             {
    //                 matricNo : null,
    //                 studentUID : regID,
    //                 email : RegisterDetails.email,
    //                 lastname : RegisterDetails.lastname,
    //                 firstname : RegisterDetails.firstname,
    //                 middlename : RegisterDetails.middlename,
    //                 faculty : null,
    //                 department : null
    //             }
    //         ])
    //         if(otherDetailsError) throw otherDetailsError
    //     } catch (err) {
    //         error.value = err.message
    //     } finally{
    //         isLoading.value = false
    //     }
    // }

    // LOGIN ADMIN OR STUDENT
    const loginUser = async(loginDetails) => {
        isLoading.value = true
        error.value = null
        adminRedirect.value = false
        studentRedirect.value = false
        lecturerRedirect.value = false
        const client = useSupabaseClient()
        
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
            console.log(userRole)

            if(userRole === 'admin') {
                adminRedirect.value = true
                studentRedirect.value = false
                lecturerRedirect.value = false
            } else if(userRole === 'lecturer') {
                lecturerRedirect.value = true
                adminRedirect.value = false
                studentRedirect.value = false
            }else{
                studentRedirect.value = true
                adminRedirect.value = false
                lecturerRedirect.value = false
            }
            
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    // RESET PASSWORD
    const resetPassword = async (resetEmail) => {
        isLoading.value = true
        error.value = null
        canReset.value = false
        const client = useSupabaseClient()
        try {
            const {data:resetData, error:resetError} = await client.auth.resetPasswordForEmail(resetEmail)
            if(resetError) throw resetError
            canReset.value = true
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    return{
        isLoading,
        error,
        checkAdmission,
        canProceed,
        loginUser,
        studentRedirect,
        lecturerRedirect,
        adminRedirect,
        resetPassword,
        canReset
    }
})