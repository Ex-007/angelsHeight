import {defineStore} from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const transSaveSuccess = ref(null)
    const canOut = ref(false)
    const formStudents = ref([])
    const selectedUser = ref(null)
    const isLoggedIn = ref(false)
    const loggedAdmin = ref(null)
    const isBypass = ref(false)


    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        isBypass.value = false
        const client = useSupabaseClient()
        isLoggedIn.value = false
        
        try {
            const { data: loggedUserData, error: loggedUserError } = await client.auth.getUser()
            
            if (loggedUserError) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    console.log('not signed in')
                    isBypass.value = true
                    return null
                }
                throw loggedUserError
            }
    
            if (loggedUserData && loggedUserData.user) {
                loggedAdmin.value = loggedUserData.user.user_metadata
                isLoggedIn.value = true 
                // console.log("User data:", loggedUserData.user.user_metadata)
                return loggedUserData.user 
            } else {
                console.log("No user data found:", loggedUserData)
                return null
            }
        } catch (err) {
            console.error("Error in signinUser:", err)
            error.value = err.message
            return null 
        } finally {
            isLoading.value = false 
        }
    }

    // SAVE TRANSACTION ID TO THE CLOUD
    const transactioDetails = async (transactionDet) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data, error:checkError} = await client
            .from('TRANSACTIONID')
            .insert([
                {
                    pay_identity : transactionDet.identity,
                    name : transactionDet.name,
                    email : transactionDet.email
                }
            ])
            if(checkError) throw checkError
            transSaveSuccess.value = "Uploaded Successfully"
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // SAVE ADMITTED STUDENTS TO THE CLOUD
    const admittedStudentss = async (admission) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data, error:adminError} = await client
            .from('ADMITTEDSTUDENTS')
            .insert([
                {
                    pay_identity : admission.identity,
                    name : admission.name,
                    email : admission.email,
                    phone: admission.phone
                }
            ])
            if(adminError) throw adminError
            transSaveSuccess.value = "Uploaded Successfully"
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // SIGNOUT 
    const logOut = async () => {
        isLoading.value = true
        error.value = null
        canOut.value = false
        const client = useSupabaseClient()
        try {
            const {data:signoutData, error:signoutError} = await client.auth.signOut()
            if(signoutError) throw signoutError
            canOut.value = true
        } catch (err) {
            error.value = err.message
        }
    }

    // FETCH NEWLY REGISTERED STUDENTS
    const fetchRegistered = async() => {
        isLoading.value = false
        error.value = null
        const client = useSupabaseClient()
        try {
            const {data:fetchData, error:fetchError} = await client
            .from('studentform')
            .select('id, firstname, middlename, surname, created_at')
            .order('created_at', {
                ascending: false
            })

            if(fetchError) throw fetchError
            formStudents.value = fetchData
        } catch (err) {
            error.value = err.message
        }
    }

    //SEARCH SELECTED USERS
     const selectUser = async(userId) => {
        const client = useSupabaseClient()
        try {
            
            if(selectedUser.value && selectedUser.value?.id === 'userId'){
                selectedUser.value = null
                return
            }
            const {data:formData, error:formError} = await client
            .from('studentform')
            .select('*')
            .eq('id', userId)
            .single()

            if(formError) throw formError
            selectedUser.value = formData

        } catch (err) {
            error.value = err.message
        }
     }






























    return{
        isLoading,
        error,
        transactioDetails,
        transSaveSuccess,
        admittedStudentss,
        canOut,
        logOut,
        fetchRegistered,
        formStudents,
        selectUser,
        selectedUser,
        signinUser,
        isBypass,
        loggedAdmin
    }
})