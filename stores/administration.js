import {defineStore} from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const transSaveSuccess = ref(null)

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

    


    return{
        isLoading,
        error,
        transactioDetails,
        transSaveSuccess,
        admittedStudentss
    }
})