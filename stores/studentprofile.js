import{defineStore} from 'pinia'

export const useStudentstoreStore = defineStore('studentStore', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const results = ref([])
    const paymentsIn = ref([])
    const noResults = ref(false)
    const user = ref(null)
    const studentDetails = ref(null)
    const profilepicturee = ref(null)
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
                // console.log(loggedUserData.user.email)
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

    // CALCULATE TOTAL SCORE
    const calculateTotalScore = (assessment, exam, practical, test) => {
        const assessmentScore = Number(assessment || 0)
        const testScore = Number(test || 0)
        const examScore = Number(exam || 0)
        const practicalScore = Number(practical || 0)

        return assessmentScore + testScore + examScore + practicalScore
    }

    // CALCULATE GRADE POINT BASED ON TOTAL SCORE
    const calculateGrade = (totalScore) => {
        if (totalScore >= 75) return {
          grade: 'A',
          gradePoint: 4.0
        };
        if (totalScore >= 70) return {
          grade: 'AB',
          gradePoint: 3.5
        };
        if (totalScore >= 65) return {
          grade: 'B',
          gradePoint: 3.25
        };
        if (totalScore >= 60) return {
          grade: 'BC',
          gradePoint: 3.0
        };
        if (totalScore >= 55) return {
          grade: 'C',
          gradePoint: 2.75
        };
        if (totalScore >= 50) return {
          grade: 'CD',
          gradePoint: 2.5
        };
        if (totalScore >= 45) return {
          grade: 'D',
          gradePoint: 2.25
        };
        if (totalScore >= 40) return {
          grade: 'E',
          gradePoint: 2.0
        };
        return {
          grade: 'F',
          gradePoint: 0.0
        };
      };
    
      // Calculate GPA classification
    const getGPAClassification = (gpa) => {
        const numGPA = parseFloat(gpa);
        if (numGPA >= 3.50) return 'Distinction';
        if (numGPA >= 3.00) return 'Upper credit';
        if (numGPA >= 2.50) return 'Lower credit';
        if (numGPA >= 2.00) return 'Pass';
        return 'Fail';
    };
    // Total credit units
    const totalCreditUnits = computed(() => {
        return results.value.reduce((sum, course) => {
          const creditUnit = Number(course.cu || 1);
          return sum + creditUnit;
        }, 0);
      });

    // Total weighted points
    const totalWeightedPoints = computed(() => {
        return results.value.reduce((sum, course) => {
          const creditUnit = Number(course.cu || 1);
          return sum + (course.gradePoint * creditUnit);
        }, 0);
      });

    // Calculate cumulative GPA
    const cumulativeGPA = computed(() => {
        if (results.value.length === 0) return '0.00';
        return (totalWeightedPoints.value / totalCreditUnits.value).toFixed(2);
    });
  
  // Get GPA classification
  const gpaClassification = computed(() => {
    return getGPAClassification(cumulativeGPA.value);
  });


//   FETCH PROFILE PICTURE FROM FORM
const fetchPicture = async() => {
    isLoading.value = true
    error.value = null
    const fetchEmail = user.value.email
    const client = useSupabaseClient()
    try {
        const {data:imageData, error:imageError} = await client
        .from('studentform')
        .select('passportUrl')
        .eq('email', fetchEmail)
        .single()

        if(imageError) throw imageError
        profilepicturee.value = imageData
    } catch (err) {
        error.value = err.message
        console.log(err.value)
    } finally {
        isLoading.value = false
    }
}




//   Uploading profile picture
// const studentPicture = reactive({
//     passportPicture : '',
//     passportPictureUrl : ''
// })
// function setPassportPhoto(file){
//     studentPicture.passportPicture = file
// }
// UPLOADING THE IMAGE
const uploadFiles = async() => {
    isLoading.value = true
    error.value = null
    const client = useSupabaseClient()

    try {
        const passportPhotoPath = `profile-picture/${Date.now()}-${studentPicture.passportPicture.name}`
        
        // UPLOAD THE PASSPORT
        const {data:passportData, error:passportError} = await client.storage
        .from('studentform')
        .upload(passportPhotoPath, studentPicture.passportPhoto)
        if(passportError) throw passportError


        // GET THE DOWNLOADURL FOR THE FILES
        const passportUrll = client.storage
        .from('studentform')
        .getPublicUrl(passportPhotoPath).data.publicUrl

        // SAVE URLs TO REACTIVE STORE
        studentPicture.passportPictureUrl = passportUrll

        return{passportUrll}

    } catch (err) {
        error.value = err.message
        console.log(err.message)
        throw error
    } finally{
        isLoading.value = false
    }
}
// UPDATING THE BOARD
// const updateImage = async(queryVal) => {
//     isLoading.value = true
//     error.value = null
//     await uploadFiles()
//     const client = useSupabaseClient()
//     try {
//         const {data:updateData, error:updateError} = await client
//         .from('STUDENTDETAILS')
//         .update({
//             profilepicture: studentPicture.passportPictureUrl
//         })
//         .eq('email', queryVal.email)

//             if(updateError) throw updateError
//             updateInfoDataSuccess.value = true
//             return updateData
//     } catch (err) {
//         error.value = err.message
//     } finally{
//         isLoading.value = false
//     }
// }

// FETCH THE STUDENT PAYMENT
    const fetchPayment = async() => {
        isLoading.value = true
        error.value = null
        const ident = user.value.email
        const client = useSupabaseClient()
        try {
            const {data:paymentData, error:paymentError} = await client
            .from('ADMITTEDSTUDENTS')
            .select('payment_info')
            .eq('email', ident)
            .single()
            if(paymentError) throw paymentError
            const paymentHistory = paymentData.payment_info?.payments || []
            paymentsIn.value = paymentHistory
            console.log(paymentHistory)
            return paymentData
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
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
        user,
        gpaClassification,
        profilepicturee,
        fetchPicture,
        fetchPayment,
        paymentsIn


        // setPassportPhoto,
        // updateImage
    }










































})