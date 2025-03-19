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
        <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Course Form</li>
        <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Profile</li>
        <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Check Result</li>
        <li @click="logout">🚪 Logout</li>
      </ul>
    </aside>

    <!-- Main Content Area -->
    <main class="content">
      <!-- Home Section -->
      <section v-if="activeTab === 'home'">
        <div class="homeDetails">
          <ul>
            <li>Lastname: {{ studentDetail.lastname }}</li>
            <li>Firstname: {{ studentDetail.firstname }}</li>
            <li>middlename: {{ studentDetail.middlename }}</li>
            <li>Email: {{ studentDetail.email }}</li>
            <li>Matric No: {{ studentDetail.matric }}</li>
            <li>Department: {{ studentDetail.department }}</li>
            <li>Faculty: {{ studentDetail.faculty }}</li>
          </ul>
        </div>
      </section>

      <!-- Requests Section -->
      <section v-if="activeTab === 'requests'">
        <div class="courseForm">

          <h2>Course Form</h2>
          <div class="courseYear">
            <h3>Select Year</h3>
            <select v-model="courseFormField.year">
            <option>2024-2025</option>
            <option>2025-2026</option>
            <option>2026-2027</option>
            <option>2027-2028</option>
            <option>2028-2029</option>
            <option>2029-2030</option>
            </select>
          </div>
          <div class="courseYear">
            <h3>Select Semester</h3>
            <select v-model="courseFormField.semester">
              <option>First</option>
              <option>Second</option>
            </select>
          </div>
          <div class="courseYear">
            <h3>Select level</h3>
            <select v-model="courseFormField.level">
              <option>NDI</option>
              <option>NDII</option>
              <option>HNDI</option>
              <option>HNDII</option>
            </select>
          </div>
          <h4 v-if="errorrM" class="resultError">{{ errorM }}</h4>
          <button @click="fillForm">Submit</button>
        </div>


      </section>

      <!-- Profile Section -->
      <section v-if="activeTab === 'profile'">
        <h2>Profile Settings</h2>
        <h3> johndoe@gmail.com </h3>
        <p>Update your personal and service details.</p>

      </section>

      <!-- Premium Section -->
      <section v-if="activeTab === 'premium'">
        <h3 class="checkHead">CHECK RESULT</h3>
        <h3 class="checkHead">{{ studentDetail.matric }}</h3>
        <div class="resultVariable">


          <label for="semester">Semester</label>
          <select id="semester" v-model="resultSelect.semester">
            <option>First</option>
            <option>Second</option>
          </select>

          <label for="level">Level</label>
          <select id="level" v-model="resultSelect.level">
            <option>NDI</option>
            <option>NDII</option>
            <option>HNDI</option>
            <option>HNDII</option>
          </select>

          <label for="year">Year</label>
          <select id="year" v-model="resultSelect.year">
            <option>2024/2025</option>
            <option>2025/2026</option>
            <option>2026/2027</option>
            <option>2027/2028</option>
            <option>2028/2029</option>
            <option>2029/2030</option>
          </select>
          <h4 v-if="errorrM" class="resultError">{{ errorM }}</h4>
          <button @click="checkResult">Check</button>
        </div>

        <div v-if="student.isLoading" class="loading">Loading records...</div>

        <div v-if="student.noResults && !student.isLoading" class="no-results">No matching records found</div>

        <div class="resultTable" v-if="student.results.length > 0">
          <div class="summary-card">
            <h3 class='semesterHead'>Semester Summary</h3>
            <div class="summary-stats">
              <div class="stat">
                <div class="stat-value">{{ student.results.length }}</div>
                <div class="stat-label">Courses</div>
              </div>
              <div class="stat">
                <div class="stat-value">{{ student.cumulativeGPA }}</div>
                <div class="stat-label">GPA</div>
              </div>
              <div class="stat">
                <div class="stat-value">{{ student.gpaClassification }}</div>
                <div class="stat-label">GRADE</div>
              </div>
            </div>
          </div>

          <table class="results-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>CC</th>
                <th>Test</th>
                <th>Prct</th>
                <th>Assmt</th>
                <th>Exam</th>
                <th>CU</th>
                <th>Total</th>
                <th>GP</th>
                <th>QP</th>
                <th>LG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(incomingg, index) in student.results" :key="index">
                <td>{{ incomingg.coursecode }}</td>
                <td>{{ incomingg.cc }}</td>
                <td>{{ incomingg.test }}</td>
                <td>{{ incomingg.practical }}</td>
                <td>{{ incomingg.assmt }}</td>
                <td>{{ incomingg.exam }}</td>
                <td>{{ incomingg.cu }}</td>
                <td>{{ incomingg.total }}</td>
                <td>{{ incomingg.gradePoint.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>
    </main>
  </div>
</template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import{useStudentstoreStore} from '@/stores/studentprofile'
  const student = useStudentstoreStore()
  const router = useRouter();
  const route = useRoute()

      // ROUTE GUARD
    // definePageMeta({
    //   middleware: [auth]
    // })

  // WATCH BYPASS BY NOT LOGGED IN USERS
  watch(() => student.isBypass, (newVal) => {
    if (newVal) {
        router.push('/login')
    }
  });

    // FUNCTION TO LOGOUT
  const logout = () => {
    student.logOut()
  };

    // WATCH FOR THE LOGOUT
  watch(() => student.canOut, (newVal) => {
    if (newVal) {
        router.push('/')
    }
  });
  
  // const activeTab = ref('premium');
  const activeTab = ref('home');


  const tracking = ref('')

  // STUDENT DETAILS
  const studentDetail = ref({
    matric : '',
    email : '',
    firstname : '',
    lastname : '',
    middlename : '',
    faculty : '',
    department : ''

  })

  // ATTACHED FETCHED DETAILS
  const attachDetails = async () => {
    // console.log(student.studentDetails)
    studentDetail.value.matric = student.studentDetails.matricNo
    studentDetail.value.email = student.studentDetails.email
    studentDetail.value.lastname = student.studentDetails.lastname
    studentDetail.value.firstname = student.studentDetails.firstname
    studentDetail.value.middlename = student.studentDetails.middlename
    studentDetail.value.faculty = student.studentDetails.faculty
    studentDetail.value.department = student.studentDetails.department
  }






  // RESULT SECTION
  const errorrM = ref(false)
  const errorM = ref('')
  // RESULT SELECTIONS
  const resultSelect = ref({
    semester: '',
    level: '',
    year: '',
    matricNo: ''
  })


// CHECK RESULT
const checkResult = async () => {
  if(resultSelect.value.level == '' || resultSelect.value.level == '' || resultSelect.value.year == ''){
    errorrM.value = true
    errorM.value = 'Please Select Year, Semester and Level...'
    return
  }
  // let matricInf = studentDetail.value.matric

  await student.fetchStudentScores(resultSelect.value)
}

//Course Form Development
const courseFormField = ref({
  semester: '',
  year: '',
  level: ''
})

const fillForm = () => {
  if(courseFormField.value.level == '' || courseFormField.value.level == '' || courseFormField.value.year == ''){
    errorrM.value = true
    errorM.value = 'Please Select Year, Semester and Level...'
    return
  }
  errorrM.value = false

  const formSemester = courseFormField.value.semester
  const formYear = courseFormField.value.year
  const formLevel = courseFormField.value.level

  router.push(`CourseForm/${formSemester}/${formYear}/${formLevel}`)

}











  onMounted(async () => {
    await student.signinUser()
    await student.fetchDetails()
    // console.log(student.user.id)
    await attachDetails()
  })



  </script>
  
  <style scoped>
    .homeDetails{
        display: flex;
        flex-direction: column;
        color: white;
        gap: 10px;
    }
    .homeDetails ul li{
      list-style-type: none;
      font-size: 20px;
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
        padding: 5px;
        border: none;
    }
    .resultVariable{
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: white;
    }
    .resultVariable button{
      border-radius: 20px;
    }
    .checkHead{
      text-align: center;
      color: white;
    }
    .resultError{
      color: red;
      margin: 5px 0;
    }

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.results-table th, .results-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.results-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

td{
  color: white;
}
.summary-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #4a6bff;
}

.stat-label {
  font-size: 14px;
  color: #666;
}
.semesterHead{
  text-align: center;
  font-size: 18px;
}
.loading, .no-results {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #e10808;
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
  