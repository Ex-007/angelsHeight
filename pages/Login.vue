<template>
    <div>
        <div class="firstHead">
            <h3>Only for Admitted Students</h3>
        </div>

        <div class="errorDiv" v-if="auth.error">
            <h3 class="errorClass">{{ auth.error }}</h3>
        </div>

        <!-- REGISTRATION FOR STUDENT -->
        <div class="page" v-if="registerVisible">
            <h5 v-if="registerE">{{ registerError }}</h5>
            <input type="text" class="contactInput" placeholder="Please input your Firstname" v-model="RegisterDetails.firstname">
            <input type="text" class="contactInput" placeholder="Please input your Lastname" v-model="RegisterDetails.lastname">
            <input type="text" class="contactInput" placeholder="Please input your Middlename" v-model="RegisterDetails.middlename">
            <p v-if="nameError" class="errorClass">{{ nameError }}</p>
            <input type="text" class="contactInput" placeholder="Please input your Phone Number" v-model="RegisterDetails.phone">
            <input type="email" class="contactInput" placeholder="Please input your email" v-model="RegisterDetails.email">
            <p v-if="emailError" class="errorClass">{{ emailError }}</p>
            <input :type="passwordVisible ? 'text' : 'password'" class="contactInput" placeholder="Password" v-model="RegisterDetails.password">
            <p v-if="passwordError" class="errorClass">{{ passwordError }}</p>
            <div class="buttons">
                <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password </button>
                <button @click="registerStudent" :disabled="auth.isLoading">{{auth.isLoading ? 'Registering...' : 'Register'}}</button>
            </div>
            <h3>Already Have an account? <span @click="toggleSign">Sign In</span></h3>
            <h3 @click="forgotP" class="forgotBut">Forgot Password?</h3>
        </div>

        <!-- SIGN IN FOR ADMIN AND STUDENTS -->
        <div class="page" v-if="loginVisible">
            <h5 v-if="loginE">{{ loginError }}</h5>
            <input type="email" class="contactInput" placeholder="Please input your email" v-model="LoginDetails.email">
            <input :type="passwordVisible ? 'text' : 'password'" class="contactInput" placeholder="Password" v-model="LoginDetails.password">
            <div class="buttons">
                <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password </button>
                <button @click="loginUser" :disabled="auth.isLoading">{{ auth.isLoading ? 'signing in...' : 'Sign in' }}</button>
            </div>
            <h3>Don't have an account? <span @click="toggleRegister">Register</span></h3>
        </div>

        <!-- FORGOT PASSWORD -->
        <div class="page" v-if="forgotPass">
            <h5 v-if="loginE">{{ loginError }}</h5>
            <input type="email" class="contactInput" placeholder="Please input your email" v-model="resetEmail">
            <button @click="confirmForgotEmail">Confirm</button>
            <h3 @click="toggleRegister" class="forgotBut">Go back to Sign In</h3>
        </div>

        <!-- <i class="fa fa-user"></i> -->
    </div>
</template>

<script setup>
    import {ref, watch} from 'vue'
    import {useRouter} from 'vue-router'
    import {useStudentStore} from '@/stores/registerStudent'
    const auth = useStudentStore()
    const router = useRouter()
    const resetEmail = ref('')
    const nameError = ref('')
    const passwordError = ref('')
    const emailError = ref('')


    // LOGIN VISIBILITY
    const loginVisible = ref(false)
    const toggleSign = () => {
        registerVisible.value = false
        loginVisible.value = true
        forgotPass.value = false
    }

    // REGISTRATION VISIBILITY
    const registerVisible = ref(true)
    const toggleRegister = () => {
        registerVisible.value = true
        loginVisible.value = false
        forgotPass.value = false
    }

    // FORGOT PASSWORD
    const forgotPass = ref(false)
    const forgotP = () => {
        registerVisible.value = false
        loginVisible.value = false
        forgotPass.value = true
    }

    // REGISTRATION ERROR
    const registerError = ref('')
    const registerE = ref(false)
    const loginError = ref('')
    const loginE = ref(false)

    // AUTHENTICATING THE INPUT
    // const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+){1,2}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,40}$/

    // REGISTRATION DETAILS
    const RegisterDetails = ref({
        middlename : '',
        lastname : '',
        firstname : '',
        phone: '',
        email: '',
        password: ''
    })

    // REGISTRATION FUNCTION
    const registerStudent = async () => {
         // CHECK NAME
        if(RegisterDetails.value.firstname == ''){
            nameError.value = 'Firstname cannot be empty'
            return
        }
        if(RegisterDetails.value.lastname == ''){
            nameError.value = 'Lastname cannot be empty'
            return
        }
        if(RegisterDetails.value.middlename == ''){
            nameError.value = 'Middlename cannot be empty'
            return
        }
        nameError.value = ''
        // CHECK EMAIL
        if(!emailPattern.test(RegisterDetails.value.email)){
            emailError.value = 'Invalid Email Format'
            return
        }
        emailError.value = ''
        // CHECK PASSWORD
        if(!passwordPattern.test(RegisterDetails.value.password)){
            passwordError.value = 'Password must be at least 8 characters long \nmust include an UPPER CASE \na lower case \na special character'
            return
        }
        passwordError.value = ''
        // CHECK WHITE SPACES
        if(RegisterDetails.value.email == '' || RegisterDetails.value.password == '' || RegisterDetails.value.fullname == '' || RegisterDetails.value.phone == ''){
            registerE.value = true
            registerError.value = 'Please Fill all Fields'
            return
        }
        registerE.value = false
        await auth.checkAdmission(RegisterDetails.value)
    }

    // WATCH FOR SIGN IN BY LECTURERS
    watch(() => auth.lecturerRedirect, (newVal) => {
        if (newVal) {
            router.push('/lecturer-direct')
        }
    });

    // WATCH FOR SIGN IN BY STUDENTS
    watch(() => auth.studentRedirect, (newVal) => {
        if (newVal) {

            router.push('/Student-profile')
        }
    });

    // WATCH FOR SIGN IN BY ADMINS
    watch(() => auth.adminRedirect, (newVal) => {
        if (newVal) {

            router.push('/admin-dash')
        }
    });
    // WATCH FOR PASSWORD RESET
    watch(() => auth.canProceed, (newVal) => {
        if (newVal) {

            router.push('/confirm-email')
        }
    });
    // WATCH FOR AUTHENTICATION TO PROCEED TO THE PAGE FOR EMAIL CONFIRMATION
    watch(() => auth.canReset, (newVal) => {
        if (newVal) {
            router.push('/confirm-reset')
        }
    });

    // FUNCTION FOR FORGOT PASSWORD
    const forgotErrorAlert = ref('')
    const confirmForgotEmail = async () => {
        if(resetEmail.value === ''){
            forgotErrorAlert.value = 'Field Cannot be empty'
            return
        }

        auth.resetPassword(resetEmail.value)
    }


    // LOGIN DETAILS
    const LoginDetails = ref({
        email : '',
        password : ''
    })

    // LOGIN FUNCTION
    const loginUser = async () => {
        if(LoginDetails.value.email == '' || LoginDetails.value.password == ''){
            loginE.value = true
            loginError.value = 'Please Fill all Fields'
            return
        }
        loginE.value = false
        await auth.loginUser(LoginDetails.value)
    }




    const passwordVisible = ref(false)
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value
    }
</script>

<style scoped>
    .errorClass{
        color: red;
    }

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
.forgotBut{
    cursor: pointer;
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
span{
    color: white;
    cursor: pointer;
}
h3{
    margin: 5px auto;
    text-align: center;
    text-align-last: center;
    color: white;
}
@media (max-width: 768px){
    span{
    /* background-color: white;
    color: #6897a7;
    padding: 8px;
    border-radius: 15px; */
    color: white;
    cursor: pointer;
}
h3{
    margin: 5px auto;
    text-align: center;
    text-align-last: center;
    display: flex;
    flex-direction: column;
    color: white;
}
}
</style>