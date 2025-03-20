import {defineStore} from 'pinia'

export const useFormStore = defineStore ('form', () => {

    // SETTING REACTIVE STATE
    const studentData = reactive({
        // SECTION A
        passportPhoto: null,
        passportUrl: '',
        surname : '',
        firstname: '',
        middlename: '',
        dateOfBirth: '',
        gender: '',
        religion: '',
        localGovernment: '',
        homeAddress: '',
        guardian: '',
        permanentAddress: '',
        secondarySchool: '',
        extraCurricula: '',
        disability: '',
        disableContent: '',
        phone: '',
        email: '',
        paymentId: '',

        // EMERGENCY CONTACTS
        E_fullname: '',
        E_address: '',
        E_phone: '',
        E_email: '',

        // PROGRAM TO ENROLL
        firstChoice: '',
        secondChoice: '',
        schoolAttended: '',
        resultAwarded: '',
        certificate: null,
        certificateUrl: '',

        // SPONSOR
        S_fullname: '',
        S_address: '',
        S_phone: '',
        S_relationship: ''
    })

    const isLoading = ref(false)
    const error = ref(null)
    const alreadyRegistered = ref(false)
    const canProceed = ref(false)
    const noTransactionId = ref(false)

    // SETTING THE FILES
    // FOR PASSPORT
    function setPassportPhoto(file){
        studentData.passportPhoto = file
    }
    // FOR CERTIFICATE
    function setCertificate(file){
        studentData.certificate = file
    }

    // UPLOADING THE FILES
    const uploadFiles = async() => {
        isLoading.value = true
        error.value = null
        const client = useSupabaseClient()

        try {
            const passportPhotoPath = `student-photos/${Date.now()}-${studentData.passportPhoto.name}`
            const certificatePath = `student-certificates/${Date.now()}-${studentData.certificate.name}`
            
            // UPLOAD THE PASSPORT
            const {data:passportData, error:passportError} = await client.storage
            .from('studentform')
            .upload(passportPhotoPath, studentData.passportPhoto)
            if(passportError) throw passportError

            // UPLOAD THE CERTIFICATE
            const {data:certificateData, error:certificateError} = await client.storage
            .from('studentform')
            .upload(certificatePath, studentData.certificate)
            if(certificateError) throw certificateError

            // GET THE DOWNLOADURL FOR THE FILES
            // PASSPORT
            const passportUrll = client.storage
            .from('studentform')
            .getPublicUrl(passportPhotoPath).data.publicUrl
            // CERTIFICATE
            const certificateUrll = client.storage
            .from('studentform')
            .getPublicUrl(certificatePath).data.publicUrl

            // SAVE URLs TO REACTIVE STORE
            studentData.passportUrl = passportUrll
            studentData.certificateUrl = certificateUrll

            return{passportUrll, certificateUrll}

        } catch (err) {
            error.value = err.message
            console.log(err.message)
            throw error
        } finally{
            isLoading.value = false
        }
    }

    // CHECK TO AVOID IF THE TRANSACTION ID ALREADY EXISTS TRULY AND RETURN IF IT DOES
 // CHECK THE TRANSACTON IDENTITY
 const checkId = async () => {
    isLoading.value = true
    error.value = null
    alreadyRegistered.value = false
    noTransactionId.value = false
    const client = useSupabaseClient()

    try {
        const {data:checkData, error:checkError} = await client
        .from('TRANSACTIONID')
        .select('*')
        .eq('pay_identity', studentData.paymentId)
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
        await checkReg()
    } catch (err) {
        error.value = err.message
    } finally{
        isLoading.value = false
    }
}

// CHECK REGISTRATION STORE IF STUDENT ALREADY REGISTERED
const checkReg = async () => {
    isLoading.value = true
    error.value = false
    // canProceed.value = false
    alreadyRegistered.value = false
    const client = useSupabaseClient()
    try {
        const {data:emailData, error:emailError} = await client
        .from('studentform')
        .select('*')
        .eq('paymentId', studentData.paymentId)
        .single()


        if(emailError){
            if (emailError.code === 'PGRST116') {
                await registerStudent()
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


    // REGISTER THE STUDENT
    const registerStudent = async () => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        const client = useSupabaseClient()
        try {
            // UPLOADING THE FILES
            await uploadFiles()

            // UPLOADING THE OTHER DETAILS
            const {data:saveDate, error:saveError} = await client
            .from('studentform')
            .insert({
                passportUrl: studentData.passportUrl,
                surname: studentData.surname,
                firstname: studentData.firstname,
                middlename: studentData.middlename,
                dateOfBirth: studentData.dateOfBirth,
                gender: studentData.gender,
                religion: studentData.religion,
                localGovernment: studentData.localGovernment,
                homeAddress: studentData.homeAddress,
                guardianName: studentData.guardian,
                permanentAddress: studentData.permanentAddress,
                secondarySchool: studentData.secondarySchool,
                extraCurricula: studentData.extraCurricula,
                disability: studentData.disability,
                disableContent: studentData.disableContent,
                phone: studentData.phone,
                email: studentData.email,
                paymentId: studentData.paymentId,
                E_fullname: studentData.E_fullname,
                E_address: studentData.E_address,
                E_phone: studentData.E_phone,
                E_email: studentData.E_email,
                firstChoice: studentData.firstChoice,
                secondChoice: studentData.secondChoice,
                schoolAttended: studentData.schoolAttended,
                resultAwarded: studentData.resultAwarded,
                certificateUrl: studentData.certificateUrl,
                S_fullname: studentData.S_fullname,
                S_address: studentData.S_address,
                S_phone: studentData.S_phone,
                S_relationship: studentData.S_relationship,
            })
            .select()

            if(saveError) throw saveError
            canProceed.value = true
            return saveDate
        } catch (err) {
            error.value = err.message
            console.log(err.message)
            throw error
        } finally{
            isLoading.value = false
        }
    }

    return{
        studentData,
        isLoading,
        error,
        setPassportPhoto,
        setCertificate,
        uploadFiles,
        registerStudent,
        alreadyRegistered,
        noTransactionId,
        checkId,
        canProceed
    }



})