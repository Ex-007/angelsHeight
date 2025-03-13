<template>
    <div>
        <div class="page">
            <p>
                Register an Account for Admitted Students
            </p>
            <h5>There's an error</h5>
            <input type="email" class="contactInput" placeholder="Please input your email" v-model="registerDetails.email">
            <input :type="passwordVisible ? 'text' : 'password'" class="contactInput" placeholder="Password" v-model="registerDetails.password">
            <div class="buttons">
                <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password </button>
                <button>Register</button>
            </div>
        </div>
        <!-- <i class="fa fa-user"></i> -->
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    const registerDetails = ref({
        email : '',
        password : ''
    })

    const passwordVisible = ref(false)
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value
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