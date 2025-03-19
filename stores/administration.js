import {defineStore} from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const transSaveSuccess = ref(null)
    const resultUploadData = ref(null)
    const canOut = ref(false)
    const formStudents = ref([])
    const selectedUser = ref(null)
    const isLoggedIn = ref(false)
    const loggedAdmin = ref(null)
    const isBypass = ref(false)
    const updateInfoDataSuccess = ref(false)
    const searchDataa = ref(null)
    const updateSearch = ref(null)
    const isUpdating = ref(false)
    const isFetching = ref(false)


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

    //  UPLOAD STUDENT'S RESULT
    const uploadResult = async (studentDet) => {
        isLoading.value = true
        error.value = false
        const client = useSupabaseClient()
        try {
            const {data:resultUploadData, error:resultUploadError} = await client
            .from('STUDENTRECORDS')
            .insert([
                {
                    name: studentDet.name,
                    assmt: studentDet.assmt,
                    cc: studentDet.cc,
                    coursecode: studentDet.courseCode,
                    cu: studentDet.cu,
                    exam: studentDet.exam,
                    level: studentDet.level,
                    matricNo: studentDet.matricNo,
                    practical: studentDet.practical,
                    semester: studentDet.semester,
                    test: studentDet.test,
                    total: studentDet.total,
                    year: studentDet.year
                }
            ])
            if(resultUploadError) throw resultUploadError
            resultUploadData.value = 'Successfully Uploaded'
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // SEARCH FOR STUDENT ADMISSION BEFORE UPLOADING RESULT
    const searchAdmitted = async (studentMatric) => {
        isLoading.value = true
        error.value = false
        const client = useSupabaseClient()
        try {
            const {data:searchData, error:searchError} = await client
            .from('STUDENTDETAILS')
            .select('*')
            .eq('matricNo', studentMatric)
            .single()

            if(searchError){
                if (searchError.code === 'PGRST116') {
                    return
                }
                throw searchError
            }
            searchDataa.value = searchData
            return searchData
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    // FETCH STUDENT DETAILS IN STUDENTS DETAILS FOR UPLOADING PURPOSE
    const fetchStudentForUpdate = async (queryVal) => {
        isFetching.value = true
        error.value = false
        const client = useSupabaseClient()
        try {
            const {data:searchStuData, error:searchStuError} = await client
            .from('STUDENTDETAILS')
            .select('*')
            .eq('email', queryVal.email)
            .single()

            if(searchStuError){
                if (searchStuError.code === 'PGRST116') {
                    error.value = 'No user Found'
                    return
                }
                throw searchStuError
            }
            updateSearch.value = searchStuData
        } catch (err) {
            error.value = err.message
        } finally {
            isFetching.value = false
        }
    }

    // UPDATE THE FETCHED INFO INCLUDING MATRIC NO, FACULTY, DEPARTMENT
    const updateMatFacDep = async (queryVal) => {
        isUpdating.value = true
        error.value = null
        updateInfoDataSuccess.value = false
        const client = useSupabaseClient()
        try {
            const {data:updateInfoData, error:updateInfoError} = await client
            .from('STUDENTDETAILS')
            .update({
                matricNo: queryVal.matricNo,
                faculty: queryVal.faculty,
                department: queryVal.department
            })
            .eq('email', queryVal.email)

            if(updateInfoError) throw updateInfoError
            updateInfoDataSuccess.value = true
            return updateInfoData
        } catch (err) {
            error.value = err.message
            return null
        } finally{
            isUpdating.value = false
        }
    }

    // INPUT COURSES
    const coursesList = async (courseLists) => {
        isLoading.value = true
        error.value = false
        const client = useSupabaseClient()
        try {
            const {data:courseUpData, error:courseUpError} = await client
            .from('COURSELIST')
            .insert([
                {
                    code: courseLists.code,
                    title: courseLists.title,
                    units: courseLists.units,
                }
            ])
            if(courseUpError) throw courseUpError
            resultUploadData.value = 'Successfully Uploaded'
            console.log('successful', courseUpData)
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }


// AH/ME/25/1-0024



























    return{
        isLoading,
        isFetching,
        isUpdating,
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
        loggedAdmin,
        resultUploadData,
        uploadResult,
        searchAdmitted,
        searchDataa,
        updateSearch,
        fetchStudentForUpdate,
        updateMatFacDep,
        updateInfoDataSuccess,
        coursesList
    }
})