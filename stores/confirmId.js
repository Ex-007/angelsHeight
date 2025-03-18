import {defineStore} from 'pinia'

export const useConfirmIdStore = defineStore('confirmStore', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const incoming = ref(null)
    const noTransactionId = ref(false)
    const alreadyRegistered = ref(false)
    const canProceed = ref(false)


    // CHECK THE TRANSACTON IDENTITY
    const checkId = async (paymentId) => {
        isLoading.value = true
        error.value = null
        alreadyRegistered.value = false
        noTransactionId.value = false
        const client = useSupabaseClient()

        try {
            const {data:checkData, error:checkError} = await client
            .from('TRANSACTIONID')
            .select('*')
            .eq('pay_identity', paymentId)
            .single()
            
            if(checkError){
                if (checkError.code === 'PGRST116') {
                    error.value = 'You\'re not admitted yet'
                    noTransactionId.value = true
                    isLoading.value = false
                    return
                }
                throw checkError
            }
            incoming.value = checkData
            await checkReg(paymentId)
        } catch (err) {
            error.value = err.message
        } finally{
            isLoading.value = false
        }
    }

    // CHECK REGISTRATION STORE IF STUDENT ALREADY REGISTERED
    const checkReg = async (paymentId) => {
        isLoading.value = true
        error.value = false
        canProceed.value = false
        alreadyRegistered.value = false
        const client = useSupabaseClient()
        try {
            const {data:emailData, error:emailError} = await client
            .from('studentform')
            .select('*')
            .eq('paymentId', paymentId)
            .single()

            if(emailError){
                if (emailError.code === 'PGRST116') {
                    canProceed.value = true
                    return
                }
                throw emailError
            }
            alreadyRegistered.value = true
        } catch (err) {
            error.value = err.message
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }


    return{
        isLoading,
        error,
        incoming,
        checkId,
        canProceed,
        noTransactionId,
        alreadyRegistered
    }
})