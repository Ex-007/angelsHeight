import {defineStore} from 'pinia'

export const useConfirmIdStore = defineStore('confirmStore', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const incoming = ref(null)


    // CHECK THE TRANSACTON IDENTITY
    const checkId = async (paymentId) => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()

        try {
            const {data, error:checkError} = await client
            .from('TRANSACTIONID')
            .select('*')
            .eq('pay_identity', paymentId)
            .single()

            if(checkError) throw checkError
            console.log(data)
            incoming.value = data
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }


    return{
        isLoading,
        error,
        incoming,
        checkId
    }
})