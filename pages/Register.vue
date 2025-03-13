<template>
    <div>
        <div class="page">
            <p>
                Note: This Page is for Students who has paid the form fee and seeking admission.
            </p>
            <!-- <h5>There's an error</h5> -->
            <div class="stepA">
                <h1>Personal Information</h1>
                
                <!-- SURNAME -->
                <label for="surnanme">Surname:</label>
                <input type="text" id="surname" class="contactInput">
    
                <!-- FIRSTNAME -->
                <label for="firstname">Firstname:</label>
                <input type="text" id="firstname" class="contactInput">
    
                <!-- MIDDLENAME -->
                <label for="middlename">Middlename:</label>
                <input type="text" id="middlename" class="contactInput">
    
                <!-- DATE OF BIRTH -->
                <label for="dateOfBirth">Date of Birth:</label>
                <input type="date" id="dateOfBirth" class="contactInput">
    
                <!-- GENDER -->
                <label for="gender">Gender:</label>
                <select id="gender" class="contactInput">
                    <option>Male</option>
                    <option>Female</option>
                </select>
    
                <!-- RELIGION -->
                <label for="religion">Religion:</label>
                <select id="religion" class="contactInput">
                    <option>Christian</option>
                    <option>Muslim</option>
                    <option>Others</option>
                </select>
    
                <!-- LGV -->
                <label for="lgvt">Local Government:</label>
                <input type="text" id="lgvt" class="contactInput">
    
                <!-- CURRENT HOME ADDRESS -->
                <label for="homeAddress">Current Home Address:</label>
                <input type="text" id="homeAddress" class="contactInput">
    
                <!-- PARENT OR GUARDIAN NAME -->
                <label for="parentG">Parent or Guardian Name:</label>
                <input type="text" id="parentG" class="contactInput">
    
                <!-- ADDREDD -->
                <label for="pAdd">Permanent Address:</label>
                <input type="text" id="pAdd" class="contactInput">
    
                <!-- SEC.SCHOOL -->
                <label for="secschool">Secondary School Attended:</label>
                <input type="text" id="secschool" class="contactInput">
    
                <!-- EXTRA CURRICULA ACTIVITIES -->
                <label for="extracurriculla">Extra Curricula activities:</label>
                <input type="text" id="extracurriculla" class="contactInput">
    
                <!-- Disabilities -->
                <label for="disa">Physical Disabilities?</label>
                <select id="disa" class="contactInput">
                    <option>No</option>
                    <option>Yes</option>
                </select>
    
                <!-- IF YES -->
                <label for="disab">If Yes, State the Nature:</label>
                <input type="text" id="disab" class="contactInput">
    
                <!-- PHONE NUMBER -->
                <label for="phone">Phone Number:</label>
                <input type="text" id="phone" class="contactInput">
    
                <!-- Email -->
                <label for="emaill">Email:</label>
                <input type="email" id="emaill" class="contactInput">
    
                <!-- EMERGENCY CONTACTS -->
                 <div class="stepA emergencyy">
                    <h1>Person to be Notified during Emergency</h1>

                    <!-- FIRSTNAME -->
                    <label for="fullname">Fullname:</label>
                    <input type="text" id="fullname" class="contactInput">
                 </div>
              </div>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            <div class="buttons">
                <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password </button>
                <button>Sign in</button>
            </div>
        </div>
        <!-- <i class="fa fa-user"></i> -->
    </div>
</template>

<script setup>
    import {ref} from 'vue'











    const LoginDetails = ref({
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
.stepA{
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: center;
}
label{
    color: white;
}
h1{
    color: white;
    text-align: center;
}
</style>