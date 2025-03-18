import{defineStore} from 'pinia'

export const useStudentstoreStore = defineStore('studentStore', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const results = ref([])
    const noResults = ref(false)
    const user = ref(null)
    const studentDetails = ref(null)
    const isBypass = ref(false)
    const canOut = ref(false)

    // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        isBypass.value = false
        const client = useSupabaseClient()
        // isLoggedIn.value = false

        try {
            const {
                data: loggedUserData,
                error: loggedUserError
            } = await client.auth.getUser()

            if (loggedUserError && !loggedUserData.user) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    console.log('not signed in')
                    isBypass.value = true
                    return null
                }
                isBypass.value = true
                throw loggedUserError
            }

            if (loggedUserData && loggedUserData.user) {
                user.value = loggedUserData.user
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

    // FETCHED THE LOGGED IN STUDENT DETAILS
    const fetchDetails = async() => {
        isLoading.value = true
        error.value = null
        const ident = user.value.id
        const client = useSupabaseClient()
        try {
            const {data:signedStuData, error:signedStuError} = await client
            .from('STUDENTDETAILS')
            .select('*')
            .eq('studentUID', ident)
            .single()
            if(signedStuError) throw signedStuError
            studentDetails.value = signedStuData
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // CALCULATE AND FETCH STUDENTS'S RESULT
    const fetchStudentScores = async (resultSelect) => {
        isLoading.value = true
        error.value = null
        const matricValue = studentDetails.value.matricNo
        const client = useSupabaseClient()
        try {
            const { data, error:fetchError } = await client
            .from('STUDENTRECORDS')
            .select('*')
            .eq('matricNo', matricValue)
            .eq('semester', resultSelect.semester)
            .eq('level', resultSelect.level)
            .eq('year', resultSelect.year)

            if(fetchError) throw fetchError

            if(data && data.length > 0){
                results.value = data.map(courseScore => {
                    const totalScore = calculateTotalScore( courseScore.assmt, courseScore.exam, courseScore.practical, courseScore.test)
                    const {grade, gradePoint} = calculateGrade(totalScore)
                    return{
                        ...courseScore,
                        totalScore,
                        grade,
                        gradePoint
                    }
                })
            }else{
                results.value = []
                noResults.value = true
            }
            console.log(data)
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // Calculate cumulative GPA for displayed courses
    const cumulativeGPA = computed(() => {
        if (results.value.length === 0) return 0

        const totalPoints = results.value.reduce((sum, course) => {
            return sum + (course.gradePoint * (course.cu || 1))
        }, 0)

        const totalCreditUnits = results.value.reduce((sum, course) => {
            return sum + (course.cu || 1)
        }, 0)

        return (totalPoints / totalCreditUnits).toFixed(2)
    })

    // CALCULATE TOTAL SCORE
    const calculateTotalScore = (assessment, exam, practical, test) => {
        const assessmentScore = assessment || 0
        const testScore = test || 0
        const examScore = exam || 0
        const practicalScore = practical || 0

        return assessmentScore + testScore + examScore + practicalScore
    }

    // CALCULATE GRADE POINT BASED ON TOTAL SCORE
    const calculateGrade = (totalScore) => {
        if (totalScore >= 70) return {
            grade: 'A',
            gradePoint: 4.0
        }
        if (totalScore >= 65) return {
            grade: 'AB',
            gradePoint: 3.5
        }
        if (totalScore >= 60) return {
            grade: 'B',
            gradePoint: 3.0
        }
        if (totalScore >= 55) return {
            grade: 'BC',
            gradePoint: 2.75
        }
        if (totalScore >= 50) return {
            grade: 'C',
            gradePoint: 2.5
        }
        if (totalScore >= 45) return {
            grade: 'CD',
            gradePoint: 2.25
        }
        if (totalScore >= 40) return {
            grade: 'D',
            gradePoint: 2.0
        }
        return {
            grade: 'F',
            gradePoint: 0.0
        }
    }


    return{
        cumulativeGPA,
        isLoading,
        error,
        noResults,
        results,
        fetchStudentScores,
        fetchDetails,
        signinUser,
        studentDetails,
        isBypass,
        logOut,
        canOut,
        user
    }










































})