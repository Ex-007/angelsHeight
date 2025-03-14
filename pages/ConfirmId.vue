<template>
    <div>
        <div class="page">
            <p>
                Note: Confirm Your Form Purchase.
            </p>
            <h5 v-if="noInput">{{ errorMessage }}</h5>
            <input type="text" class="contactInput" placeholder="Please input your payment ID" v-model="paymentId">
            <button @click="confirmPay" :disabled="idStore.isLoading">{{ idStore.isLoading ? 'Confirming...' : 'Confirm Payment' }}</button>
        </div>
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    import { useRouter } from 'vue-router'
    import {useConfirmIdStore} from '@/stores/confirmId'
    const idStore = useConfirmIdStore()
    const router = useRouter()

    const errorMessage = ref('')
    const noInput = ref(false)
    const paymentId = ref('') 

    // FUNCTION TO CHECK IF THE ID EXISTS, IF YES, NAVIGATE TO THE REGISTRATION PAGE  
    const confirmPay = async () => {
        if(paymentId.value == ''){
            noInput.value = true
            errorMessage.value = 'Field Cannot be Empty'
            return
        }
        noInput.value = false
        await idStore.checkId(paymentId.value)
        if(!idStore.incoming){
            noInput.value = true
            errorMessage.value = 'Transaction ID not found'
            return
        }
        alert('Welcome ', idStore.incoming.name)
    }
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
}
button{
    width: 150px;
    background-color: white;
    color: rgb(84, 8, 112);
    padding: 10px;
    border-radius: 20px;
    cursor: pointer;
}
</style>