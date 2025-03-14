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
                    name : transactionDet.name
                }
            ])
            if(checkError) throw checkError
            transSaveSuccess.value = "Uploaded Successfully"
        } catch (err) {
            error.value = err.message
            // console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    


    return{
        isLoading,
        error,
        transactioDetails,
        transSaveSuccess
    }
})