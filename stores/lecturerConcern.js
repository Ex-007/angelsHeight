import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy, addDoc, documentId} from 'firebase/firestore'


export const useLecturerStore = defineStore('lecturer', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const data = ref([])

    // REPLACE MATRIC
    const replaceMatric = (matric) => {
        return matric.replaceAll("/", "-")
    }

    // SEARCH COURSE
const saveCourse = async(coursesValue, matricc, session, semesterr, studentName, studentLevel, department) => {
    isLoading.value = true
    error.value = null
    console.log(coursesValue, matricc, session, semesterr, studentName)
    
    try {
        const matricNumber = replaceMatric(matricc)
        console.log(matricNumber)

        const { $firebase } = useNuxtApp()
        const db = $firebase.firestore
        
        const coursesObject = {}
        
        coursesValue.forEach(course => {
            coursesObject[course.courseCode] = {
                courseTitle: course.courseTitle,
                courseUnits: course.courseUnit,
                exam: 0,
                test: 0,
                attendance: 0,
                practical: 0,
                total: 0,  
                grade: '',
                registeredAt: new Date(),
            }
        })
        const documentData = {
            ...coursesObject,
            _metadata: {
                matricNumber: matricc,
                session: session,
                semester: semesterr,
                grade: '',
                gradePoint: '',
                totalScore: '',
                totalCourses: coursesValue.length,
                registrationDate: new Date(),
                lastUpdated: new Date(),
                studentName: studentName,
                level: studentLevel,
                department: department
            }
        }
        
        const subcollectionPath = `COURSE_FORM/${matricNumber}/${session}-${semesterr}`
        const studentCourseFormCollection = collection(db, subcollectionPath)

        const docRef = await addDoc(studentCourseFormCollection, documentData)

        console.log('Document written with ID: ', docRef.id)
        console.log('Courses saved:', Object.keys(coursesObject))
        if(!docRef.id){
            return{
                success: false,
                error: 'Uploading Error'
            }
        }

        return {
            success: true,
            documentId: docRef.id,
            coursesRegistered: Object.keys(coursesObject)
        }
    } catch (err) {
        error.value = err.message
        console.log('Error saving course:', err.message)
        return {
            success: false,
            error: err.message
        }
    } finally {
        isLoading.value = false
    }
}

    return{
        isLoading,
        error,
        data,
        saveCourse
    }
})