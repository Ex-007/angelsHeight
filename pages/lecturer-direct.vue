<template>
    <div class="dashboard">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class='profileP'>
            <img src='/img/profilepicture.jpeg' alt="Profile Picture" class="profilePicture" />
            <p v-if="tracking">{{tracking}}</p>
        </div>
        <ul>
          <li @click="activeTab = 'home'" :class="{ active: activeTab === 'home' }">🏠 Home</li>
          <!-- <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Course Form</li> -->
          <!-- <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Students</li> -->
          <!-- <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Transaction ID</li> -->
          <!-- <li @click="activeTab = 'admitted'" :class="{ active: activeTab === 'admitted' }">💎 Admitted Students</li> -->
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <!-- Home Section -->
        <section v-if="activeTab === 'home'">
            <div class="homeDetails">
                <h2>Welcome, John!</h2>
                <h2>johndoe@gmail.com</h2>
                <h2>0902323233</h2>
                <p>This is Your student Account</p>
                <h3>Course: Computer Technology</h3>
                <h3>Current Session: 2024/2025</h3>
                <h3>Current Semester: Second</h3>
                <h3>Current Level: HNDII</h3>
                <h3>current CGPA 3.74</h3>
            </div>
        </section>
  
        <!-- Requests Section -->
        <!-- <section v-if="activeTab === 'requests'">
        <div class="courseForm">

            <h2>Course Form</h2>
            <div class="courseYear">
                <h3>Select Year</h3>
                <select>
                  <option>Selecet Year</option>
                  <option>2024/2025</option>
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                  <option>2027/2028</option>
                </select>
            </div>
            <div class="courseYear">
                <h3>Select Semester</h3>
                <select>
                  <option>Selecet Semester</option>
                  <option>First</option>
                  <option>Second</option>
                </select>
            </div>
            <button @click="refreshRequests">Submit</button>
        </div>


        </section> -->
  
        <!-- Profile Section -->
        <!-- <section v-if="activeTab === 'profile'">
          <div class="transactionDet">
            
        </div>

        </section> -->
  
        <!-- TransactionID Section -->
        <!-- <section v-if="activeTab === 'premium'">
            <div class="transactionDet">
            <h3 class="transIdSuccess">{{ transSuccessful.success }}</h3>
            <label for="studentName">Student Name:</label>
            <input type="text" id="studentName" class="contactInput" placeholder="Enter Student's Name" v-model="transacct.name">
            <label for="studentEmail">Student Email:</label>
            <input type="text" id="studentEmail" class="contactInput" placeholder="Enter Student's Email" v-model="transacct.email">
            <label for="transactionId">Transaction ID:</label>
            <input type="text" id="transactionId" class="contactInput" placeholder="Enter Transaction Id" v-model="transacct.identity">
            <h3 class="transIdError">{{ transSuccessful.errorin }}</h3>
            <button @click="saveDetail" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button>
        </div>
        </section> -->
  
        <!-- ADMITTED STUDENTS -->
        <!-- <section v-if="activeTab === 'admitted'">
            <div class="transactionDet">
              <h1>Registered Students</h1>
              <input type="text" class="contactInput" placeholder="Enter Student's Name" v-model="admission.name">
              <input type="text" class="contactInput" placeholder="Enter Student's Email" v-model="admission.email">
              <input type="text" class="contactInput" placeholder="Enter Student's Phone Number" v-model="admission.phone">
              <input type="text" class="contactInput" placeholder="Enter Student's Transaction Id" v-model="admission.identity">
              <h3 class="transIdError">{{ transSuccessful.errorin }}</h3>
              <button @click="saveAdmitted" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button>
              
          </div>
        </section> -->
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';


//   import { useRouter, useRoute } from 'vue-router';
//     import {useAdminStore} from '@/stores/administration'
//     const admin = useAdminStore()
//     const router = useRouter();
//     const route = useRoute()
    
    const activeTab = ref('home');
// TRANSACTION ID SUCCESS UPDATE REFERENCE
//   const transSuccessful = ref({
//     success : '',
//     errorin : ''
//   })
    // TRANSACTION ID REFERENCE
    // const transacct = ref({
    //     name : '',
    //     identity : '',
    //     email : ''
    // })

    // TRANSACTION ID FUNCTION
    // const saveDetail = async() => {
    //     if(transacct.value.id == '' || transacct.value.name == ''){
    //         transSuccessful.value.errorin = 'no field should be empty'
    //         return
    //     }
    //     await admin.transactioDetails(transacct.value)
    //     transSuccessful.value.success = 'Successful'
    //     transacct.value.name = ''
    //     transacct.value.identity = ''
    // }
    
    // SAVING ADNITTES STUDENTS FILE
    // const admittedSuccess = ref({
    //   success : '',
    //   errorin : ''
    // })
    // TRANSACTION ID REFERENCE
    // const admission = ref({
    //     name : '',
    //     identity : '',
    //     email : '',
    //     phone : ''
    // })

    // TRANSACTION ID FUNCTION
    // const saveAdmitted = async() => {
    //     if(admission.value.identity == '' || admission.value.name == '' || admission.value.email == '' || admission.value.phone == ''){
    //       admittedSuccess.value.errorin = 'no field should be empty'
    //         return
    //     }

    //     await admin.admittedStudentss(admission.value)
    //     admittedSuccess.value.success = 'Successful'
    //     admittedSuccess.value.name = ''
    //     admittedSuccess.value.identity = ''
    //     admittedSuccess.value.email = ''
    //     admittedSuccess.value.phone = ''
    // }

    







  
//   const logout = () => {
//     alert("Logging out...");
//   };
  
//   const navigateToRequests = () => {
//     activeTab.value = 'requests';
//   };

//   const tracking = ref('')

















  </script>
  
  <style scoped>
    .homeDetails{
        display: flex;
        flex-direction: column;
        color: white;
        gap: 10px;
    }
    .courseForm, .courseYear{
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
        gap: 10px;
        align-items: center;
    }
    select{
        width: 250px;
        height: 30px;
        border-radius: 30px;
    }
    .transIdSuccess{
        color: rgb(107, 215, 74);
        /* background-color: green;
        padding: 10px; */
    }
    .transIdError{
        color: rgb(202, 6, 6);
        /* background-color: red;
        padding: 10px; */
    }
    h1{
      color:white
    }













  .picInput{
    display: none;
  }
  .dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background: #007bff;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar ul li.active {
    background: white;
    color: #007bff;
    font-weight: bold;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  
  button {
    padding: 8px 15px;
    border: none;
    background: #007bff;
    color: white;
    cursor: pointer;
    margin-top: 10px;
  }
  .buttonsB {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .profileDetails{
    display: flex;
    flex-direction : column;
  }
  input{
    width : 150px;
    height : 30px;
    padding : 5px;
    margin-bottom: 5px;
  }
  textarea{
    resize : none;
    height : 150px;
    padding : 5px
  }
  .profilePicture{
    width : 100px;
    height : 100px;
    border-radius: 50%;
  }
  .profileP{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    flex-direction: column;
  }
  .dashsay{
    display: flex;
    justify-content: cnter;
    align-items: center;
  }

  .picDisplay{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    padding: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  /* for transaction id */
  .transactionDet{
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

    .contactInput{
        width: 300px;
        border-radius: 10px;
        height: 35px;
        border: none;
        outline: none;
        padding: 10px;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
    }

label{
    color: white;
}

  @media (max-width: 768px){
    .dashboard{
        display: flex;
        flex-direction: column;
    }
    .sidebar{
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .homeDetails{
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
  }


  </style>
  



