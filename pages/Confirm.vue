<template>
    <div>
        <div class="page">
            <p>
                Note: Confirm Your Form Purchase.
            </p>
            <h5>There's an error</h5>
            <input type="email" class="contactInput" placeholder="Please input your payment ID" v-model="paymentId">
            <button @click="confirmPay">Confirm Payment</button>
        </div>
    </div>
</template>

<script setup>
    import {ref} from 'vue'


    const paymentId = ref('')   
    const confirmPay = () => {
        console.log(paymentId.value)
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