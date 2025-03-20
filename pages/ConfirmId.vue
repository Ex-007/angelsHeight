<template>
    <div>
        <div class="page">
            <div class="payMake">
                <h3>Please Contact The School's management for Payment process</h3>
                <p>You can reach them on <a href="tel:09032327228">09032327228</a> or <a href="tel:08107812435">08107812435</a></p>
                <p>For Enquiries <a href="mailto:info@angelsheight.org">info@angelsheight.org</a></p>
            </div>
            <p>
                Note: Confirm Your Form Purchase if you've already made payment.
            </p>
            <h5 v-if="noInput">{{ errorMessage }}</h5>
            <h5 class="successful" v-if="successfully">Welcome {{ successMessage }}, waiting for redirect...</h5>
            <input type="text" class="contactInput" placeholder="Please input your payment ID" v-model="paymentId">
            <button @click="confirmPay" :disabled="idStore.isLoading">{{ idStore.isLoading ? 'Confirming...' : 'Confirm Payment' }}</button>
        </div>
    </div>
</template>

<script setup>
    import {ref, watch} from 'vue'
    import { useRouter } from 'vue-router'
    import {useConfirmIdStore} from '@/stores/confirmId'
    const idStore = useConfirmIdStore()
    const router = useRouter()

    const errorMessage = ref('')
    const successMessage = ref('')
    const noInput = ref(false)
    const successfully = ref(false)
    const paymentId = ref('') 

    // SEO METADATA
    const seoData = ref({
        title: 'Angels Height College of Health Technology | Accredited Health Courses | Join Us',
        description : 'Angels Height college of health technology offers top rated courses like Environmental Health Technology, Community Health Extension Worker (CHEW) Junior, Community Health Extension Worker (CHEW) Senior, Dental Therapy, Pharmacy Technician, Opticianry Dispensary, Public Health Technology, Health Assistant Medical, Health Technician, Computer Science Technology, Nutrition and Dietetics, Medical Laboratory Technician, Orthopedic Plaster Card. Join us for a rewarding career in healthcare.',
        url : 'https://angelsheight.org',
        image : '/img/angelsImage.jpg',
        siteName : 'Angels Height College of Health Technology',
        type : 'website',
        twitterHandle : '@angelsheight',
        keywords : 'Environmental Health Technology, Community Health Extension Worker (CHEW) Junior, Community Health Extension Worker (CHEW) Senior, Dental Therapy, Pharmacy Technician, Opticianry Dispensary, Public Health Technology, Health Assistant Medical, Health Technician, Computer Science Technology, Nutrition and Dietetics, Medical Laboratory Technician, Orthopedic Plaster Card, best health technology college in Nigeria'
    })

    useHead(() => ({
        title : seoData.value.title,
        meta: [
            {
                name: 'description',
                content: seoData.value.description
            },
            {
                name: 'keywords',
                content: seoData.value.keywords
            },
            {
                property: 'og:title',
                content: seoData.value.title
            },
            {
                property: 'og:description',
                content: seoData.value.description
            },
            {
                property: 'og:url',
                content: seoData.value.url
            },
            {
                property: 'og:image',
                content: seoData.value.image
            },
            {
                property: 'og:type',
                content: seoData.value.type
            },
            {
                property: 'og:site_name',
                content: seoData.value.siteName
            },
            {
                name : 'twitter:title',
                content: seoData.value.title
            },
            {
                name : 'twitter:description',
                content: seoData.value.description
            },
            {
                name : 'twitter:image',
                content: seoData.value.image
            },
            {
                name : 'twitter:card',
                content: 'summary_large_image'
            },
            {
                name : 'twitter:site',
                content: seoData.value.twitterHandle
            },
        ],
        link : [{rel: 'canonical', href: seoData.value.url}]
    }))

    // FUNCTION TO CHECK IF THE ID EXISTS, IF YES, NAVIGATE TO THE REGISTRATION PAGE  
    const confirmPay = async () => {
        if(paymentId.value == ''){
            noInput.value = true
            errorMessage.value = 'Field Cannot be Empty'
            return
        }
        noInput.value = false
        await idStore.checkId(paymentId.value)
        // if(!idStore.incoming){
        //     noInput.value = true
        //     errorMessage.value = 'Transaction ID not found'
        //     return
        // }
        // successfully.value = true
        // successMessage.value = idStore.incoming?.name
        // setTimeout(() => {
        //     router.push('/Register')
        // }, 2000);
    }

    // WATCH FOR REQUIREMENTS MET
    watch(() => idStore.canProceed, (newVal) => {
        if (newVal) {
            successfully.value = true
            successMessage.value = idStore.incoming?.name
            setTimeout(() => {
                router.push(`/Form/${paymentId.value}`)
            }, 2000);
        }
    });

    // NO TRANSACTION ID FOUND
    watch(() => idStore.noTransactionId, (newVal) => {
        if (newVal) {
            noInput.value = true
            errorMessage.value = 'Transaction ID not found'
        }
    });

    // ALREADY REGISTERED
    watch(() => idStore.alreadyRegistered, (newVal) => {
        if (newVal) {
            noInput.value = true
            errorMessage.value = 'You have already Registered'
        }
    });

    // abc123def456
</script>

<style scoped>
    .page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        background-color: #6897a7;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(26, 49, 195);
    }
.page p{
    text-align: center;
    color: white;
    font-size: 25;
}
.contactInput{
    width: 300px;
    border-radius: 10px;
    height: 35px;
    border: none;
    outline: none;
    padding: 10px;
    box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
}
.buttons{
    display: flex;
}
h5{
    font-size: 20px;
    color: rgba(179, 20, 20, 0.996);
    text-align: center;
}
h3{
    text-align: center;
    text-align-last: center;
}
button{
    width: 150px;
    background-color: white;
    color: rgb(84, 8, 112);
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
}
.successful{
    color: rgb(50, 217, 50);
    text-align: center;
}
.payMake{
    background-color: red;
    color: white;
    padding: 10px;
    border-radius: 20px;
}
a{
    color: white;
}

@media (max-width: 768px){
    h5{
        font-size: 17px;
        text-align-last: center;
    }
}
</style>