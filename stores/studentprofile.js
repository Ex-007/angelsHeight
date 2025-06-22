import{defineStore} from 'pinia'
import {collection, getDocs, doc, updateDoc, deleteDoc, deleteField, orderBy, addDoc, documentId} from 'firebase/firestore'

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
                    // console.log('not signed in')
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
                // console.log("No user data found:", loggedUserData)
                return null
            }
        } catch (err) {
            // console.error("Error in signinUser:", err)
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
    // const fetchStudentScores = async (resultSelect) => {
    //     isLoading.value = true
    //     error.value = null
    //     const matricValue = studentDetails.value.matricNo
    //     const client = useSupabaseClient()
    //     try {
    //         const { data, error:fetchError } = await client
    //         .from('STUDENTRECORDS')
    //         .select('*')
    //         .eq('matricNo', matricValue)
    //         .eq('semester', resultSelect.semester)
    //         .eq('level', resultSelect.level)
    //         .eq('year', resultSelect.year)

    //         if(fetchError) throw fetchError

    //         if(data && data.length > 0){
    //             results.value = data.map(courseScore => {
    //                 const totalScore = calculateTotalScore( courseScore.assmt, courseScore.exam, courseScore.practical, courseScore.test)
    //                 const {grade, gradePoint} = calculateGrade(totalScore)
    //                 return{
    //                     ...courseScore,
    //                     totalScore,
    //                     grade,
    //                     gradePoint
    //                 }
    //             })
    //         }else{
    //             results.value = []
    //             noResults.value = true
    //         }
    //     } catch (err) {
    //         error.value = err.message
    //     } finally{
    //         isLoading.value = false
    //     }
    // }

        // REPLACE MATRIC
    const replaceMatric = (matric) => {
        return matric.replaceAll("/", "-")
    }


    // FETCH STUDENT SCORES PER SEMESTER
   const fetchStudentScores = async(resultSelect) => {
    isLoading.value = true
    error.value = null
    
    const yearRange = resultSelect.year
    const semester = resultSelect.semester
    const selectedLevel = resultSelect.level
    const matricValue = studentDetails.value.matricNo
    const [previousYear, currentYear] = yearRange.split("/");
    
    try {
        const matricNum = replaceMatric(matricValue)
        let sessionToUse = `${previousYear}-${currentYear}`

        const { $firebase } = useNuxtApp()
        const db = $firebase.firestore

        const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`
        const courseFormCollection = collection(db, subcollectionPath)

        // Get all documents in the subcollection
        const querySnapshot = await getDocs(courseFormCollection)

        if (querySnapshot.empty) {
            results.value = []
            noResults.value = true
            return {
                success: false,
                error: 'No course registration found for this student and session',
                message: 'No course registration found for this student this session',
                courseFound: false,
                courseData: null
            }
        }

        // Collect all courses from documents that match the selected level
        let allCourses = []
        let studentMetadata = null

        querySnapshot.forEach((doc) => {
            const docData = doc.data()
            
            // Extract student metadata if available
            if (docData._metadata) {
                studentMetadata = docData._metadata
                
                // Check if this document's level matches the selected level
                if (docData._metadata.level !== selectedLevel) {
                    // Skip this document if level doesn't match
                    return
                }
            } else {
                // Skip documents without metadata
                return
            }
            
            // Extract all courses from this document (excluding metadata)
            // Only execute this if the level matches
            Object.keys(docData).forEach(key => {
                if (key !== '_metadata') {
                    const courseData = docData[key]
                    
                    // Check if this looks like course data (has expected properties)
                    if (courseData && typeof courseData === 'object') {
                        allCourses.push({
                            courseCode: key,
                            ...courseData,
                            documentId: doc.id,
                            level: docData._metadata.level // Add level info to course data
                        })
                    }
                }
            })
        })

        if (allCourses.length === 0) {
            results.value = []
            noResults.value = true
            return {
                success: false,
                courseFound: false,
                courseData: null,
                message: `No courses found for level ${selectedLevel} in Student's Course Form`
            }
        }

        // Calculate results for all courses (similar to old code logic)
        results.value = allCourses.map(courseScore => {
            const totalScore = calculateTotalScore(
                courseScore.attendance, 
                courseScore.exam, 
                courseScore.practical, 
                courseScore.test
            )
            const {grade, gradePoint} = calculateGrade(totalScore)
            
            return {
                ...courseScore,
                totalScore,
                grade,
                gradePoint,
                // Add session info for consistency
                semester: semester,
                year: yearRange,
                matricNo: matricValue
            }
        })

        // Reset noResults flag since we found courses
        noResults.value = false

        console.log('courseData: ', allCourses)
        console.log('studentInfo: ', studentMetadata)
        console.log('totalCourses: ', allCourses.length)
        console.log('selectedLevel: ', selectedLevel)
        console.log('subcollectionPath: ', subcollectionPath)

        return {
            success: true,
            courseFound: true,
            courseData: allCourses,
            totalCourses: allCourses.length,
            studentInfo: studentMetadata,
            selectedLevel: selectedLevel,
            subcollectionPath: subcollectionPath
        }

    } catch (err) {
        error.value = err.message
        console.log(err.message)
        results.value = []
        
        return {
            success: false,
            error: err.message,
            courseFound: false,
            courseData: null
        }
    } finally {
        isLoading.value = false
    }
}

// FETCH STUDENT'S CUMULATIVE GRADE POINT (CGPA)
const calculateStudentCGPA = async(selectedLevel = null) => {
    isLoading.value = true
    error.value = null
    
    const matricValue = studentDetails.value.matricNo
    
    try {
        const matricNum = replaceMatric(matricValue)
        const { $firebase } = useNuxtApp()
        const db = $firebase.firestore

        const currentYear = new Date().getFullYear()
        const possibleSessions = []
        
        // Generate possible sessions (adjust range as needed)
        for (let year = currentYear - 10; year <= currentYear + 1; year++) {
            const nextYear = year + 1
            const sessionBase = `${year}-${nextYear}`
            possibleSessions.push(`${sessionBase}-First`) // First semester
            possibleSessions.push(`${sessionBase}-Second`) // Second semester
        }

        // console.log(possibleSessions)

        let allCourses = []
        let studentMetadata = null
        let totalQualityPoints = 0
        let totalCreditUnits = 0
        let foundSessions = []

        // Try each possible session-semester combination
        for (const sessionId of possibleSessions) {
            try {
                const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionId}`
                const sessionCollection = collection(db, subcollectionPath)
                const sessionSnapshot = await getDocs(sessionCollection)

                if (!sessionSnapshot.empty) {
                    foundSessions.push(sessionId)
                    
                    // Process each document in this session
                    sessionSnapshot.forEach((doc) => {
                        const docData = doc.data()
                        
                        // Extract student metadata if available
                        if (docData._metadata) {
                            if (selectedLevel && docData._metadata.level !== selectedLevel) {
                                return
                            }
                            studentMetadata = docData._metadata
                        } else {
                            if (selectedLevel) {
                                return
                            }
                        }
                        
                        // Extract all courses from this document
                        Object.keys(docData).forEach(key => {
                            if (key !== '_metadata') {
                                const courseData = docData[key]
                                
                                // Check if this looks like course data
                                if (courseData && typeof courseData === 'object') {
                                    const totalScore = calculateTotalScore(
                                        courseData.attendance, 
                                        courseData.exam, 
                                        courseData.practical, 
                                        courseData.test
                                    )
                                    const {grade, gradePoint} = calculateGrade(totalScore)
                                    
                                    // Extract session and semester from sessionId
                                    const sessionParts = sessionId.split('-')
                                    const session = `${sessionParts[0]}-${sessionParts[1]}`
                                    const semester = sessionParts[2]
                                    
                                    const courseWithCalculations = {
                                        courseCode: key,
                                        ...courseData,
                                        totalScore,
                                        grade,
                                        gradePoint,
                                        session: session,
                                        semester: semester,
                                        sessionId: sessionId,
                                        matricNo: matricValue,
                                        level: docData._metadata ? docData._metadata.level : null,
                                        documentId: doc.id
                                    }
                                    
                                    allCourses.push(courseWithCalculations)
                                    
                                    // Calculate quality points for CGPA
                                    const creditUnit = courseData.courseUnits || courseData.unit || 0
                                    const qualityPoints = gradePoint * creditUnit
                                    
                                    totalQualityPoints += qualityPoints
                                    totalCreditUnits += creditUnit
                                }
                            }
                        })
                    })
                }
            } catch (sessionError) {
                continue
            }
        }

        if (allCourses.length === 0) {
            const levelMessage = selectedLevel ? ` for level ${selectedLevel}` : ''
            return {
                success: false,
                error: `No courses found for this student${levelMessage}`,
                message: `No courses found in student's academic records${levelMessage}`,
                cgpa: 0,
                totalCreditUnits: 0,
                totalCourses: 0,
                courses: [],
                selectedLevel: selectedLevel,
                foundSessions: foundSessions
            }
        }

        // Calculate CGPA
        const cgpa = totalCreditUnits > 0 ? (totalQualityPoints / totalCreditUnits).toFixed(2) : 0

        // Group courses by session and semester for better organization
        const coursesBySession = allCourses.reduce((acc, course) => {
            const sessionKey = `${course.session}-${course.semester}`
            if (!acc[sessionKey]) {
                acc[sessionKey] = []
            }
            acc[sessionKey].push(course)
            return acc
        }, {})

        // Calculate GPA for each session-semester
        const sessionGPAs = Object.keys(coursesBySession).map(sessionKey => {
            const sessionCourses = coursesBySession[sessionKey]
            let sessionQualityPoints = 0
            let sessionCreditUnits = 0
            
            sessionCourses.forEach(course => {
                const creditUnit = course.courseUnits || course.unit || 0
                sessionQualityPoints += course.gradePoint * creditUnit
                sessionCreditUnits += creditUnit
            })
            
            const sessionGPA = sessionCreditUnits > 0 ? (sessionQualityPoints / sessionCreditUnits).toFixed(2) : 0
            console.log('First CGPA display :', cgpa)
            return {
                session: sessionKey,
                gpa: parseFloat(sessionGPA),
                courses: sessionCourses.length,
                creditUnits: sessionCreditUnits
            }
        })
        console.log(cgpa)

        return {
            success: true,
            // cgpa: parseFloat(cgpa),
            cgpa:cgpa,
            totalQualityPoints: totalQualityPoints,
            totalCreditUnits: totalCreditUnits,
            totalCourses: allCourses.length,
            courses: allCourses,
            coursesBySession: coursesBySession,
            sessionGPAs: sessionGPAs,
            studentInfo: studentMetadata,
            selectedLevel: selectedLevel,
            foundSessions: foundSessions,
            academicSummary: {
                totalSessions: Object.keys(coursesBySession).length,
                averageCoursesPerSession: Math.round(allCourses.length / Object.keys(coursesBySession).length),
                highestSessionGPA: sessionGPAs.length > 0 ? Math.max(...sessionGPAs.map(s => s.gpa)) : 0,
                lowestSessionGPA: sessionGPAs.length > 0 ? Math.min(...sessionGPAs.map(s => s.gpa)) : 0
            },
            classification: getCGPAClassification(cgpa)
            // classification: getCGPAClassification(parseFloat(cgpa))
        }

    } catch (err) {
        error.value = err.message
        console.log('CGPA Calculation Error:', err.message)
        
        return {
            success: false,
            error: err.message,
            cgpa: 0,
            totalCreditUnits: 0,
            totalCourses: 0,
            courses: [],
            selectedLevel: selectedLevel
        }
    } finally {
        isLoading.value = false
    }
}

// Alternative approach if you have a way to get actual sessions
const calculateStudentCGPAWithKnownSessions = async(selectedLevel = null, knownSessions = []) => {
    isLoading.value = true
    error.value = null
    
    const matricValue = studentDetails.value.matricNo
    
    try {
        const matricNum = replaceMatric(matricValue)
        const { $firebase } = useNuxtApp()
        const db = $firebase.firestore

        let allCourses = []
        let studentMetadata = null
        let totalQualityPoints = 0
        let totalCreditUnits = 0
        let foundSessions = []

        // Use provided sessions or default ones
        const sessionsToCheck = knownSessions.length > 0 ? knownSessions : [
            '2020-2021-1', '2020-2021-2',
            '2021-2022-1', '2021-2022-2',
            '2022-2023-1', '2022-2023-2',
            '2023-2024-1', '2023-2024-2',
            '2024-2025-1', '2024-2025-2',
            '2025-2026-1', '2025-2026-2'
        ]

        for (const sessionId of sessionsToCheck) {
            try {
                const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionId}`
                const sessionCollection = collection(db, subcollectionPath)
                const sessionSnapshot = await getDocs(sessionCollection)

                if (!sessionSnapshot.empty) {
                    foundSessions.push(sessionId)
                    
                    sessionSnapshot.forEach((doc) => {
                        const docData = doc.data()
                        
                        if (docData._metadata) {
                            if (selectedLevel && docData._metadata.level !== selectedLevel) {
                                return
                            }
                            studentMetadata = docData._metadata
                        } else {
                            if (selectedLevel) {
                                return
                            }
                        }
                        
                        Object.keys(docData).forEach(key => {
                            if (key !== '_metadata') {
                                const courseData = docData[key]
                                
                                if (courseData && typeof courseData === 'object') {
                                    const totalScore = calculateTotalScore(
                                        courseData.attendance, 
                                        courseData.exam, 
                                        courseData.practical, 
                                        courseData.test
                                    )
                                    const {grade, gradePoint} = calculateGrade(totalScore)
                                    
                                    const sessionParts = sessionId.split('-')
                                    const session = `${sessionParts[0]}-${sessionParts[1]}`
                                    const semester = sessionParts[2]
                                    
                                    const courseWithCalculations = {
                                        courseCode: key,
                                        ...courseData,
                                        totalScore,
                                        grade,
                                        gradePoint,
                                        session: session,
                                        semester: semester,
                                        sessionId: sessionId,
                                        matricNo: matricValue,
                                        level: docData._metadata ? docData._metadata.level : null,
                                        documentId: doc.id
                                    }
                                    
                                    allCourses.push(courseWithCalculations)
                                    
                                    const creditUnit = courseData.courseUnits || courseData.unit || 0
                                    const qualityPoints = gradePoint * creditUnit
                                    
                                    totalQualityPoints += qualityPoints
                                    totalCreditUnits += creditUnit
                                }
                            }
                        })
                    })
                }
            } catch (sessionError) {
                continue
            }
        }

        if (allCourses.length === 0) {
            const levelMessage = selectedLevel ? ` for level ${selectedLevel}` : ''
            return {
                success: false,
                error: `No courses found for this student${levelMessage}`,
                message: `No courses found in student's academic records${levelMessage}`,
                cgpa: 0,
                totalCreditUnits: 0,
                totalCourses: 0,
                foundSessions: foundSessions
            }
        }

        const cgpa = totalCreditUnits > 0 ? (totalQualityPoints / totalCreditUnits).toFixed(2) : 0

        return {
            success: true,
            cgpa: parseFloat(cgpa),
            totalQualityPoints: totalQualityPoints,
            totalCreditUnits: totalCreditUnits,
            totalCourses: allCourses.length,
            courses: allCourses,
            studentInfo: studentMetadata,
            selectedLevel: selectedLevel,
            foundSessions: foundSessions
        }

    } catch (err) {
        error.value = err.message
        console.log('CGPA Calculation Error:', err.message)
        
        return {
            success: false,
            error: err.message,
            cgpa: 0,
            foundSessions: []
        }
    } finally {
        isLoading.value = false
    }
}


// Usage examples:
// const result = await calculateStudentCGPA()
// const level200Result = await calculateStudentCGPA('200')
// const withKnownSessions = await calculateStudentCGPAWithKnownSessions('200', ['2023-2024-1', '2023-2024-2'])

// Helper function to get CGPA classification
const getCGPAClassification = (cgpa) => {
    if (cgpa >= 3.50) return "Distinction"
    if (cgpa >= 3.0) return "Upper credit"
    if (cgpa >= 2.50) return "Lower credit"
    if (cgpa >= 2.00) return "Pass"
    return "Fail"
}

// Enhanced function to calculate CGPA for specific level and up to that level
const calculateCGPAUpToLevel = async(targetLevel) => {
    isLoading.value = true
    error.value = null
    
    const matricValue = studentDetails.value.matricNo
    
    try {
        const matricNum = replaceMatric(matricValue)
        const { $firebase } = useNuxtApp()
        const db = $firebase.firestore

        const studentPath = `COURSE_FORM/${matricNum}`
        const studentCollection = collection(db, studentPath)
        const sessionSnapshot = await getDocs(studentCollection)
        
        if (sessionSnapshot.empty) {
            return {
                success: false,
                error: 'No academic records found for this student',
                cgpa: 0,
                totalCreditUnits: 0,
                totalCourses: 0
            }
        }

        let allCourses = []
        let totalQualityPoints = 0
        let totalCreditUnits = 0
        const levelOrder = ['100', '200', '300', '400', '500'] // Adjust based on your level system

        // Get the index of target level to filter courses up to that level
        const targetLevelIndex = levelOrder.indexOf(targetLevel)
        if (targetLevelIndex === -1) {
            throw new Error(`Invalid target level: ${targetLevel}`)
        }

        const levelsToInclude = levelOrder.slice(0, targetLevelIndex + 1)

        for (const sessionDoc of sessionSnapshot.docs) {
            const sessionId = sessionDoc.id
            const docData = sessionDoc.data()
            
            // Check if document has metadata and if its level should be included
            if (docData._metadata && levelsToInclude.includes(docData._metadata.level)) {
                Object.keys(docData).forEach(key => {
                    if (key !== '_metadata') {
                        const courseData = docData[key]
                        
                        if (courseData && typeof courseData === 'object') {
                            const totalScore = calculateTotalScore(
                                courseData.attendance, 
                                courseData.exam, 
                                courseData.practical, 
                                courseData.test
                            )
                            const {grade, gradePoint} = calculateGrade(totalScore)
                            
                            const sessionParts = sessionId.split('-')
                            const session = `${sessionParts[0]}-${sessionParts[1]}`
                            const semester = sessionParts[2]
                            
                            const courseWithCalculations = {
                                courseCode: key,
                                ...courseData,
                                totalScore,
                                grade,
                                gradePoint,
                                session: session,
                                semester: semester,
                                sessionId: sessionId,
                                matricNo: matricValue,
                                level: docData._metadata.level
                            }
                            
                            allCourses.push(courseWithCalculations)
                            
                            const creditUnit = courseData.courseUnits || courseData.unit || 0
                            const qualityPoints = gradePoint * creditUnit
                            
                            totalQualityPoints += qualityPoints
                            totalCreditUnits += creditUnit
                        }
                    }
                })
            }
        }

        const cgpa = totalCreditUnits > 0 ? (totalQualityPoints / totalCreditUnits).toFixed(2) : 0

        return {
            success: true,
            cgpa: parseFloat(cgpa),
            totalQualityPoints: totalQualityPoints,
            totalCreditUnits: totalCreditUnits,
            totalCourses: allCourses.length,
            courses: allCourses,
            targetLevel: targetLevel,
            levelsIncluded: levelsToInclude,
            classification: getCGPAClassification(parseFloat(cgpa))
        }

    } catch (err) {
        error.value = err.message
        console.log('CGPA Calculation Error:', err.message)
        
        return {
            success: false,
            error: err.message,
            cgpa: 0,
            totalCreditUnits: 0,
            totalCourses: 0
        }
    } finally {
        isLoading.value = false
    }
}

// Usage examples:
// Calculate CGPA for all levels
// const allLevelsResult = await calculateStudentCGPA()

// Calculate CGPA for specific level only (e.g., 200 level)
// const specificLevelResult = await calculateStudentCGPA('200')

// Calculate CGPA up to and including specific level (e.g., up to 300 level)
// const upToLevelResult = await calculateCGPAUpToLevel('300')



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
        // console.log(err.value)
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
        // console.log(err.message)
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
            // console.log(paymentHistory)
            return paymentData
        } catch (err) {
            error.value = err.message
            // console.log(err.message)
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
        paymentsIn,
        calculateStudentCGPA


        // setPassportPhoto,
        // updateImage
    }










































})