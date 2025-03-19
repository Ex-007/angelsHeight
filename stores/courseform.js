import {defineStore} from 'pinia'

export const useCourseStore = defineStore('courseForm', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const courseReturn = ref([])


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
            console.log(formData)
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
        fetchCourse
    }
})