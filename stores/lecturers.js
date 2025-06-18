import { defineStore } from 'pinia'
import {collection, getDocs, doc, updateDoc, deleteDoc, deleteField, orderBy, addDoc, documentId} from 'firebase/firestore'

export const useLecturersStore = defineStore('lecturers', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const loggedLecturer = ref(null)
    const data = ref([])
    const coursess = ref(null)

        // FETCH THE SIGNED IN USER
    const signinUser = async () => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()
        
        try {
            const { data: loggedUserData, error: loggedUserError } = await client.auth.getUser()
            
            if (loggedUserError) {
                if (loggedUserError.code === 'PGRST116') {
                    error.value = 'No user logged in'
                    isBypass.value = true
                    return null
                }
                throw loggedUserError
            }
    
            if (loggedUserData && loggedUserData.user) {
                loggedLecturer.value = loggedUserData.user.user_metadata
                coursess.value = loggedUserData.user.user_metadata.course
                return loggedUserData.user 
            } else {
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

    // REPLACE MATRIC
    const replaceMatric = (matric) => {
        return matric.replaceAll("/", "-")
    }

    // EXTRACT PREVIOUS AND PRESENT YEAR
    const extractYears = () => {
        const currentYear = new Date().getFullYear()
        const previousYear = currentYear - 1

        return{
            currentYear,
            previousYear
        }
    }

    // SEARCH COURSE
    const searchCourse = async(matricNumber, semester) => {
        isLoading.value = true
        error.value = null
        const courseCode = coursess.value
        
        try {
            const matricNum = replaceMatric(matricNumber)
            // AH/DE/25/2-0049
            // Use provided session or generate current academic year
            const {previousYear, currentYear} = extractYears()
            let sessionToUse = `${previousYear}-${currentYear}`


            const { $firebase } = useNuxtApp()
            const db = $firebase.firestore

            // Reference to the subcollection
            const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`
            const courseFormCollection = collection(db, subcollectionPath)
            
            // Get all documents in the subcollection
            const querySnapshot = await getDocs(courseFormCollection)
            
            if (querySnapshot.empty) {
                return {
                    success: false,
                    error: 'No course registration found for this student and session',
                    message: 'No course registration found for this student this session',
                    courseFound: false,
                    courseData: null
                }
            }

            // Search through documents for the specific course code
            let foundCourse = null
            let documentId = null
            let studentMetadata = null

            querySnapshot.forEach((doc) => {
                const docData = doc.data()
                
                if (docData._metadata) {
                    studentMetadata = docData._metadata
                }
                
                // Check if the course code exists in this document
                if (docData[courseCode]) {
                    foundCourse = {
                        courseCode: courseCode,
                        ...docData[courseCode]
                    }
                    documentId = doc.id
                }
            })

            if (!foundCourse) {
                return {
                    success: false,
                    courseFound: false,
                    courseData: null,
                    message: `Course ${courseCode} not found in Student's Course Form`
                }
            }

            return {
                success: true,
                courseFound: true,
                courseData: foundCourse,
                documentId: documentId,
                studentInfo: studentMetadata,
                subcollectionPath: subcollectionPath
            }

        } catch (err) {
            error.value = err.message
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

    // UPDATE SCORES
    const updateCourseScores = async(matricNumber, scores, semester) => {
        isLoading.value = true
        error.value = null
        const courseCode = coursess.value
        
        try {
            const matricNum = replaceMatric(matricNumber)
            const {previousYear, currentYear} = extractYears()
            let sessionToUse = `${previousYear}-${currentYear}`



            const { $firebase } = useNuxtApp()
            const db = $firebase.firestore

            // Reference to the subcollection
            const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`
            const courseFormCollection = collection(db, subcollectionPath)
            
            // First, find the document containing the course
            const querySnapshot = await getDocs(courseFormCollection)
            
            if (querySnapshot.empty) {
                return {
                    success: false,
                    error: 'No course registration found for this student and session',
                    message: 'No course registration found for this student and session'
                }
            }

            let targetDocId = null
            let courseExists = false

            // Find the document that contains the course code
            querySnapshot.forEach((doc) => {
                const docData = doc.data()
                if (docData[courseCode]) {
                    targetDocId = doc.id
                    courseExists = true
                }
            })

            if (!courseExists) {
                return {
                    success: false,
                    error: `Course ${courseCode} not found in student registration`,
                    message: `Course ${courseCode} not found in student registration`
                }
            }

            // Calculate total score
            const { exam = 0, test = 0, practical = 0, attendance = 0 } = scores
            const total = exam + test + practical + attendance

            // Determine grade based on total score
            const getGrade = (score) => {
                if (score >= 75) return 'A'
                if (score >= 70) return 'AB'
                if (score >= 65) return 'B'
                if (score >= 60) return 'BC'
                if (score >= 55) return 'C'
                if (score >= 50) return 'CD'
                if (score >= 45) return 'D'
                if (score >= 40) return 'E'
                return 'F'
            }

            const grade = getGrade(total)

            // Prepare update data
            const updateData = {
                [`${courseCode}.exam`]: exam,
                [`${courseCode}.test`]: test,
                [`${courseCode}.practical`]: practical,
                [`${courseCode}.attendance`]: attendance,
                [`${courseCode}.total`]: total,
                [`${courseCode}.grade`]: grade,
                [`${courseCode}.lastUpdated`]: new Date(),
                '_metadata.lastUpdated': new Date()
            }

            // Update the document
            const docRef = doc(db, subcollectionPath, targetDocId)
            await updateDoc(docRef, updateData)


            return {
                success: true,
                message: 'Course scores updated successfully.',
                updatedScores: {
                    courseCode,
                    exam,
                    test,
                    practical,
                    attendance,
                    total,
                    grade
                },
                documentId: targetDocId
            }

        } catch (err) {
            error.value = err.message
            return {
                success: false,
                error: err.message,
                message: err.message
            }
        } finally {
            isLoading.value = false
        }
    }

    return{
        isLoading,
        error,
        signinUser,
        data,
        searchCourse,
        updateCourseScores
    }
})