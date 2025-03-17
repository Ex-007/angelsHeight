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
          <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Results</li>
          <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Students</li>
          <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Transaction ID</li>
          <li @click="activeTab = 'registered'" :class="{ active: activeTab === 'registered' }">💎 Registered Students</li>
          <li @click="activeTab = 'admitted'" :class="{ active: activeTab === 'admitted' }">💎 Admitted Students</li>
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <section v-if="activeTab === 'home'">
            <div class="homeDetails">
                <h2>Welcome, {{adminData.name }}!!!</h2>
                <h2>Email: {{ adminData.email }}</h2>
                <h2>Phone: {{ adminData.phone }}</h2>
                <h2>Role: {{ adminData.role }}</h2>
            </div>
        </section>
  
        <!-- Requests Section -->
        <section v-if="activeTab === 'requests'">
        <div class="courseForm">
            <h2>Enter Student's Result</h2>
            <div class="searchStudent">
              <input type="text" class="contactInput" placeholder="Enter Matric No">
            </div>
            <button @click="searchResult">Search</button>

            <div class="fetchedStudentProfile">
              <div class="control firstSide">

                <label for="courseCode">Course Code : </label>
                <input type="text" id="courseCode" placeholder="Enter Course Code">
  
                <label for="cc">CC : </label>
                <input type="number" id="cc" placeholder="Enter CC">
  
                <label for="cu">CU : </label>
                <input type="number" id="cu" placeholder="Enter CU">
  
                <label for="test">Test : </label>
                <input type="number" id="test" placeholder="Enter Test Score">
              </div>

              <div class="control secondSide">

                <label for="prct">PRCT : </label>
                <input type="number" id="prct" placeholder="Enter Prct">
  
                <label for="assmt">Assessment : </label>
                <input type="number" id="assmt" placeholder="Enter Assessment">
  
                <label for="exam">Exam : </label>
                <input type="number" id="exam" placeholder="Enter Exam Score">
  
                <label for="total">Course Code : </label>
                <input type="number" id="total" placeholder="Enter Total">
              </div>

            </div>
            <button @click="updateResult">Update</button>
        </div>


        </section>
  
        <!-- Profile Section -->
        <section v-if="activeTab === 'profile'">
          <div class="transactionDet">
            <!-- <h3 class="transIdSuccess">{{ transSuccessful.success }}</h3> -->
            <!-- <label for="studentName">Student Name:</label>
            <input type="text" id="studentName" class="contactInput" placeholder="Enter Student's Name">
            <label for="studentEmail">Student Email:</label>
            <input type="text" id="studentEmail" class="contactInput" placeholder="Enter Student's Email">
            <label for="studentPhone">Student Phone Number:</label>
            <input type="text" id="studentPhone" class="contactInput" placeholder="Enter Student's Email">
            <label for="transactionId">Transaction ID:</label>
            <input type="text" id="transactionId" class="contactInput" placeholder="Enter Transaction Id">
            <h3 class="transIdError">{{ transSuccessful.errorin }}</h3>
            <button @click="saveAdmitted" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button> -->
        </div>

        </section>
  
        <!-- TransactionID Section -->
        <section v-if="activeTab === 'premium'">
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
        </section>
  
        <!-- ADMITTED STUDENTS -->
        <section v-if="activeTab === 'admitted'">
            <div class="transactionDet">
              <h1>Admitted Students</h1>
              <input type="text" class="contactInput" placeholder="Enter Student's Name" v-model="admission.name">
              <input type="text" class="contactInput" placeholder="Enter Student's Email" v-model="admission.email">
              <input type="text" class="contactInput" placeholder="Enter Student's Phone Number" v-model="admission.phone">
              <input type="text" class="contactInput" placeholder="Enter Student's Transaction Id" v-model="admission.identity">
              <h3 class="transIdError">{{ transSuccessful.errorin }}</h3>
              <button @click="saveAdmitted" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button>
              
          </div>
        </section>
  
        <!-- REGISTERED STUDENTS -->
        <section v-if="activeTab === 'registered'">
            <div class="newly">
              <!-- <h1>Registered Students</h1> -->
              <div class="left listFormStudents">
                <ul>
                  <li
                  v-for="users in admin.formStudents" :key="users.id"
                  @click="fetchMainForm(users.id)"
                  class="user-item"
                  :class="{active:admin.selectedUser?.id === users.id}">
                  <span>{{ users.surname + " " + users.firstname + " " + users.middlename }}</span>
                  <small>{{ new Date(users.created_at).toLocaleDateString() }}</small>
                </li>
                </ul>
              </div>
              <div class="right user-details" v-if="admin.selectedUser">
                <ul>
                  <div class="imagePassport">
                    <img :src="admin.selectedUser.passportUrl" alt="The Student's Passport">
                  </div>
                  <h3>Personal Information</h3>
                  <li>Surname:{{ admin.selectedUser.surname }}</li>
                  <li>Firstname:{{ admin.selectedUser.firstname }}</li>
                  <li>Middlename:{{ admin.selectedUser.middlename }}</li>
                  <li>Date of Birth:{{ admin.selectedUser.dateOfBirth }}</li>
                  <li>Gender:{{ admin.selectedUser.gender }}</li>
                  <li>Religion:{{ admin.selectedUser.religion }}</li>
                  <li>Local Gvmt:{{ admin.selectedUser.localGovernment }}</li>
                  <li>Home Address:{{ admin.selectedUser.homeAddress }}</li>
                  <li>Guardian Name:{{ admin.selectedUser.guardian }}</li>
                  <li>Permanend Addr:{{ admin.selectedUser.permanentAddress }}</li>
                  <li>Secondary School:{{ admin.selectedUser.secondarySchool }}</li>
                  <li>Extra Curricula:{{ admin.selectedUser.extraCurricula }}</li>
                  <li>Disability:{{ admin.selectedUser.disability }}</li>
                  <li>Disability Cause:{{ admin.selectedUser.disableContent }}</li>
                  <li>Phone Number:{{ admin.selectedUser.phone }}</li>
                  <li>Payment ID:{{ admin.selectedUser.paymentId }}</li>
                  <h3>EMERGENCY CONTACTS</h3>
                  <li>Fullname:{{ admin.selectedUser.E_fullname }}</li>
                  <li>Address:{{ admin.selectedUser.E_address }}</li>
                  <li>Phone Number:{{ admin.selectedUser.E_phone }}</li>
                  <li>Email:{{ admin.selectedUser.E_email }}</li>
                  <h3>ENROLLED PROGRAM</h3>
                  <li>First Choice:{{ admin.selectedUser.firstChoice }}</li>
                  <li>Second Choice:{{ admin.selectedUser.secondChoice }}</li>
                  <li>School Attended:{{ admin.selectedUser.schoolAttended }}</li>
                  <li>Result Awarded:{{ admin.selectedUser.resultAwarded }}</li>
                  <div class="imagePassport">
                    <img :src="admin.selectedUser.certificateUrl" alt="The Student's Passport">
                  </div>
                  <h3>SPONSOR</h3>
                  <li>Fullname:{{ admin.selectedUser.S_fullname }}</li>
                  <li>Address:{{ admin.selectedUser.S_address }}</li>
                  <li>Phone Number:{{ admin.selectedUser.S_phone }}</li>
                  <li>Relationship :{{ admin.selectedUser.S_relationship }}</li>
                </ul>
              </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';


  import { useRouter, useRoute } from 'vue-router';
    import {useAdminStore} from '@/stores/administration'
import auth from '~/middleware/auth';
    const admin = useAdminStore()
    const router = useRouter();
    const route = useRoute()
    

    // ROUTE GUARD
    definePageMeta({
      middleware: [auth]
    })
    // const activeTab = ref('requests');
    const activeTab = ref('home');
// TRANSACTION ID SUCCESS UPDATE REFERENCE
  const transSuccessful = ref({
    success : '',
    errorin : ''
  })
    // TRANSACTION ID REFERENCE
    const transacct = ref({
        name : '',
        identity : '',
        email : ''
    })

    // TRANSACTION ID FUNCTION
    const saveDetail = async() => {
        if(transacct.value.id == '' || transacct.value.name == ''){
            transSuccessful.value.errorin = 'no field should be empty'
            return
        }
        
        await admin.transactioDetails(transacct.value)
        transSuccessful.value.success = 'Successful'
        transacct.value.name = ''
        transacct.value.identity = ''
    }
    
    // SAVING ADNITTES STUDENTS FILE
    const admittedSuccess = ref({
      success : '',
      errorin : ''
    })

    // TRANSACTION ID REFERENCE
    const admission = ref({
        name : '',
        identity : '',
        email : '',
        phone : ''
    })

    // TRANSACTION ID FUNCTION
    const saveAdmitted = async() => {
        if(admission.value.identity == '' || admission.value.name == '' || admission.value.email == '' || admission.value.phone == ''){
          admittedSuccess.value.errorin = 'no field should be empty'
            return
        }

        await admin.admittedStudentss(admission.value)
        admittedSuccess.value.success = 'Successful'
        admittedSuccess.value.name = ''
        admittedSuccess.value.identity = ''
        admittedSuccess.value.email = ''
        admittedSuccess.value.phone = ''
    }

    // WATCH FOR THE LOGOUT
    watch(() => admin.canOut, (newVal) => {
      if (newVal) {
          router.push('/')
      }
    });

    // WATCH BYPASS BY NOT LOGGED IN USERS
    watch(() => admin.isBypass, (newVal) => {
      if (newVal) {
          router.push('/login')
      }
    });

  // FUNCTION TO LOGOUT
  const logout = () => {
    admin.logOut()
  };

  const tracking = ref('')

// FETCH INDIVIDUAL FORM REGISTERED STUDENTS
const fetchMainForm = async (formId) => {
  if(formId === null || formId === undefined) return
  admin.selectUser(formId)
}

// FIXING USER DATA
const adminData = ref({
  name: '',
  email: '',
  phone: '',
  role : ''
})

// ASSIGN ADMIN DETAILS
const fixDetails = async () => {
  adminData.value.name =  admin.loggedAdmin.Fullname
  adminData.value.email =  admin.loggedAdmin.email
  adminData.value.phone =  admin.loggedAdmin.Phone
  adminData.value.role =  admin.loggedAdmin.role
}

// SEARCH A STUDENT TO UPLOAD THE RESULT
const searchResult = () => {
  alert('Searching Student in progress...')
}

// SEARCH A STUDENT TO UPLOAD THE RESULT
const updateResult = () => {
  alert('Updating...')
}






  onMounted(async () => {
    await admin.signinUser()
    await admin.fetchRegistered()
    await fixDetails()
  })

  </script>
  
  <style scoped>
  .fetchedStudentProfile{
    display: flex;
    gap: 10px;
  }
  .control{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .control input{
    border-radius: 20px;
    padding: 10px;
    font-size: 17px;
    border: none;
  }
  .courseForm button{
    width: 200px;
    border-radius: 10px;
  }
  .newly {
    display: flex;
    height: calc(100vh - 500px); 
    max-height: 800px; 
    overflow: none; 
    margin-bottom: 30px;
  }


.left {
  flex: 0 0 40%; 
  overflow-y: auto; 
  border-right: 1px solid #ddd;
  padding-right: 5px;
  height: 100%; 
  scrollbar-width: thin;
  -ms-overflow-style: none;
}

.right {
  flex: 0 0 60%; 
  overflow-y: auto; 
  padding-left: 5px;
  height: 100%; 
  scrollbar-width: thin;
  -ms-overflow-style: none;
}
.left::-webkit-scrollbar, .right::-webkit-scrollbar {
  display: none;
}
.left, .right {
  -ms-overflow-style: none; 
  scrollbar-width: none;  
}
/* For the list items */
.listFormStudents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  color: white;
}

.user-item.active {
  background-color: #0c3084;
  color: white;
}

/* For the user details */
.user-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-details li {
  padding: 8px 0;
  /* border-bottom: 1px solid #eee; */
  font-size: 19px;
  color: white;
}

.imagePassport {
  text-align: center;
  margin: 15px 0;
}

.imagePassport img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.user-details h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  color: rgb(173, 18, 18);
  text-align: center;
  font-size: 25px;
}


  li{
    list-style-type: none;
    margin: 2.5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 2px;
    text-align: center;
    text-align-last: center;
    cursor: pointer;
  }

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
  

