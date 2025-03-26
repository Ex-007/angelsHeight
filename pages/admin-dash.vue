<template>
    <div class="dashboard">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class='profileP'>
          <img :src="adminData.profilePicture || '/img/profilepicture.jpeg'" alt="Profile Picture" class="profilePicture" />
            <p v-if="tracking">{{tracking}}</p>
        </div>
        <ul>
          <li @click="activeTab = 'home'" :class="{ active: activeTab === 'home' }">🏠 Home</li>
          <li @click="activeTab = 'courses'" :class="{ active: activeTab === 'courses' }">🏠 Courses</li>
          <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Results</li>
          <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Students</li>
          <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Transaction ID</li>
          <li @click="activeTab = 'registered'" :class="{ active: activeTab === 'registered' }">💎 Registered Students</li>
          <li @click="activeTab = 'admitted'" :class="{ active: activeTab === 'admitted' }">💎 Admit a Students</li>
          <li @click="activeTab = 'Ladmitted'" :class="{ active: activeTab === 'Ladmitted' }">💎List Admitted Students</li>
          <li @click="activeTab = 'payments'" :class="{ active: activeTab === 'payments' }">💴 Update Payment</li>
          <li @click="activeTab = 'paymentsCheck'" :class="{ active: activeTab === 'paymentsCheck' }">💴 Check Payment</li>
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
                <label for="passport"><i class="fa fa-file" style="font-size: 40px; cursor: pointer;"></i></label>
                <input type="file" id="passport" style="display: none;" @change="handlePassportPhoto" accept="image/*" required>
                <div v-if="passportPreviewUrl" class="preview">
                    <img :src="passportPreviewUrl" alt="Passport Preview" width="100" />
                    <h3>{{ photoUploaded }}</h3>
                </div>
                <button @click="uploaderr">upload image</button>
            </div>
        </section>

        <!-- Entering courses -->
        <section v-if="activeTab === 'courses'">
          <div class="transactionDet">
              <h1>COURSE INPUT</h1>
              <h4 v-if="admittedSuc">{{ transSuccessful.success }}</h4>
              <input type="text" class="contactInput" placeholder="Enter Course Code" v-model="courseLists.code">
              <input type="text" class="contactInput" placeholder="Enter Course Title" v-model="courseLists.title">
              <input type="number" class="contactInput" placeholder="Enter Course Unit" v-model="courseLists.units">
              <h3 class="transIdError">{{ alert.message }}</h3>
              <button @click="saveCourse" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button> 
          </div>d
        </section>
  
        <!-- Result Section -->
        <section v-if="activeTab === 'requests'">
        <div class="courseForm">
            <h2>Enter Student's Result</h2>
            <div class="searchStudent">
              <input type="text" class="contactInput" placeholder="Enter Matric No" v-model="studentMatric">
            </div>
            <button @click="searchResult">Search</button>
            <div class="availableStudent">
              <h3 v-if="admin.searchDataa" class="matricName">{{ searchResults.lastname + ' ' + searchResults.firstname + ' ' + searchResults.middlename }}</h3>
            </div>

            <div class="fetchedStudentProfile">
              <div class="control firstSide">

                <label for="matricc">Matric No : </label>
                <input type="text" id="matricc" class="contactInput" placeholder="Matric No" v-model="scoreDet.matricNo">
  
                <label for="semester">Semester</label>
                <select id="semester" class="contactInput" v-model="scoreDet.semester">
                  <option>First</option>
                  <option>Second</option>
                </select>
  
                <label for="level">Level</label>
                <select id="level" class="contactInput" v-model="scoreDet.level">
                  <option>Year I</option>
                  <option>Year II</option>
                  <option>Year III</option>
                  <option>NDI</option>
                  <option>NDII</option>
                  <option>HNDI</option>
                  <option>HNDII</option>
                </select>
  
                <label for="year">Year</label>
                <select id="year" class="contactInput" v-model="scoreDet.year">
                  <option>2024/2025</option>
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                  <option>2027/2028</option>
                </select>
  
                
              </div>

              <div class="control firstSide">

                <label for="courseCode">Course Title : </label>
                <input type="text" class="contactInput" id="courseCode" placeholder="Course Code" v-model="scoreDet.courseCode">
  
                <label for="cc">Course Code : </label>
                <input type="text" class="contactInput" id="cc" placeholder="CC" v-model="scoreDet.cc">
  
                <label for="cu">CU : </label>
                <input type="number" class="contactInput" id="cu" placeholder="CU" v-model="scoreDet.cu">
  
                <label for="test">Test : </label>
                <input type="number" class="contactInput" id="test" placeholder="Test Score" v-model="scoreDet.test">
              </div>

              <div class="control secondSide">

                <label for="prct">PRCT : </label>
                <input type="number" class="contactInput" id="prct" placeholder="Prct" v-model="scoreDet.practical">
  
                <label for="assmt">Assessment : </label>
                <input type="number" class="contactInput" id="assmt" placeholder="Assessment" v-model="scoreDet.assmt">
  
                <label for="exam">Exam : </label>
                <input type="number" class="contactInput" id="exam" placeholder="Exam" v-model="scoreDet.exam">
  
                <label for="total">Total : </label>
                <input type="number" class="contactInput" id="total" placeholder="Total" v-model="scoreDet.total">
              </div>

            </div>
            <input type="text" class="contactInput" placeholder="Student's Name" v-model="scoreDet.name">
            <h4 v-if="uploadSuccess" class="transIdSuccess">{{ upSuccMsg }}</h4>
            <h4 v-if="uploadError" class="transIdError">{{ upErrMsg }}</h4>
            <button @click="updateResult">{{admin.isLoading ? 'Uploading' : 'Upload'}}</button>
        </div>


        </section>
  
        <!-- UPDATE STUDENTS PROFILE -->
        <section v-if="activeTab === 'profile'">
          <div class="transactionDet">
            <h3>UPDATE STUDENT DETAILS</h3>
            <div class="innerDetails">
              <label for="stEmail">Student Email</label>
              <input type="text" id="stEmail" class="contactInput" placeholder="Student Email" v-model="updateStudentInfo.email">

              <label for="stMatric">Student Matric</label>
              <input type="text" id="stMatric" class="contactInput" placeholder="Student Matric" v-model="updateStudentInfo.matricNo">

              <label for="stLast">Student Lastname</label>
              <input type="text" id="stLast" class="contactInput" placeholder="Student Lastname" v-model="updateStudentInfo.lastname" readonly>

              <label for="stFirst">Student Firstname</label>
              <input type="text" id="stFirst" class="contactInput" placeholder="Student Firstname" v-model="updateStudentInfo.firstname" readonly>

              <label for="stMiddle">Student Middlename</label>
              <input type="text" id="transactt" class="contactInput" placeholder="Student Middlename" v-model="updateStudentInfo.middlename" readonly>


              <label for="transactt">Student Transaction ID</label>
              <input type="text" id="transactt" class="contactInput" placeholder="Student Transaction Id" v-model="updateStudentInfo.transactionId" readonly>

              <label for="phoneNum">Student Phone Number</label>
              <input type="text" id="phoneNum" class="contactInput" placeholder="Student Phone Number" v-model="updateStudentInfo.phone" readonly>

              <label for="stDept">Student Department</label>
              <select id="stDept" class="contactInput" v-model="updateStudentInfo.department">
                <option>Environmental Health Technology</option>
                <option>Community Health Extension Worker (CHEW) Junior</option>
                <option>Community Health Extension Worker (CHEW) Senior</option>
                <option>Dental Therapy</option>
                <option>Pharmacy Technician</option>
                <option>Opticianry Dispensary</option>
                <option>Public Health Technology</option>
                <option>Health Assistant Medical</option>
                <option>Health Technician</option>
                <option>Computer Science Technology</option>
                <option>Nutrition and Dietetics</option>
                <option>Medical Laboratory Technician</option>
                <option>Orthopedic Plaster Card</option>
              </select>

              <label for="stFac">Student Faculty</label>
              <select id="stFac" class="contactInput" v-model="updateStudentInfo.faculty">
                <option>Environmental Science</option>
                <option>Engineering</option>
                <option>Science</option>
                <option>Medicine</option>
              </select>
            </div>

            <h3 v-if="updateDentt.error">{{ updateDentt.message }}</h3>
            <h3 v-if="updateDentt.success">{{ updateDentt.message }}</h3>
            <div class="buttons">
              <button @click="fetchStudentUpd">{{ admin.isFetching ? 'Fetching...' : 'Fetch' }}</button>
              <button @click="updateStudenInfo">{{ admin.isUpdating ? 'Updating...' : 'Update' }}</button>
            </div>
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
              <h4 v-if="admittedSuc">{{ transSuccessful.success }}</h4>
              <input type="text" class="contactInput" placeholder="Student's Firstname" v-model="admission.firstname">
              <input type="text" class="contactInput" placeholder="Student's Middlename" v-model="admission.middlename">
              <input type="text" class="contactInput" placeholder="Student's Lastname" v-model="admission.lastname">
              <input type="text" class="contactInput" placeholder="Faculty" v-model="admission.faculty">
              <label for="department">Department</label>
              <select id="department" class="contactInput" v-model="admission.department">
                  <option>Environmental Health Technology</option>
                  <option>Community Health Extension Worker (CHEW) Junior</option>
                  <option>Community Health Extension Worker (CHEW) Senior</option>
                  <option>Dental Therapy</option>
                  <option>Pharmacy Technician</option>
                  <option>Opticianry Dispensar</option>
                  <option>Public Health Technology</option>
                  <option>Health Assistant Medical</option>
                  <option>Health Technician</option>
                  <option>Computer Science Technology</option>
                  <option>Nutrition and Dietetics</option>
                  <option>Medical Laboratory Technician</option>
                  <option>Orthopedic Plaster Card</option>
              </select>
              <input type="text" class="contactInput" placeholder="Enter Student's Matric" v-model="admission.matricNo">
              <input type="text" class="contactInput" placeholder="Enter Student's Email" v-model="admission.email">
              <input type="text" class="contactInput" placeholder="Enter Student's Phone Number" v-model="admission.phone">
              <input type="text" class="contactInput" placeholder="Enter Student's Transaction Id" v-model="admission.identity">
              <h3 class="transIdError">{{ transSuccessful.errorin }}</h3>
              <button @click="saveAdmitted" :disabled="admin.isLoading">{{ admin.isLoading ? 'Saving...' : 'Save' }}</button>
              
          </div>
        </section>

        <!-- LIST ADMITTED STUDENTS -->
        <section v-if="activeTab === 'Ladmitted'">
            <div class="newlyll">
              <h1>Admitted Students List</h1>
              
            <!-- <button @click="printOut" disabled>Print</button> -->
              <div class="newlyl">
                
                <table class="heightinh" id="printable-section">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Date</th>
                  <th>Lastname</th>
                  <th>Firstname</th>
                  <th>Middlename</th>
                  <th>Department</th>
                  <th>Faculty</th>
                  <th>Email</th>
                  <th>Matric No</th>
                  <th>Payment Id</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(admisttedd, index) in admin.allAdmitted" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ formatDate(admisttedd.created_at) }}</td>
                  <td>{{ admisttedd.lastname }}</td>
                  <td>{{ admisttedd.firstname }}</td>
                  <td>{{ admisttedd.middlename }}</td>
                  <td>{{ admisttedd.department }}</td>
                  <td>{{ admisttedd.faculty }}</td>
                  <td>{{ admisttedd.email }}</td>
                  <td>{{ admisttedd.matricNo }}</td>
                  <td>{{ admisttedd.pay_identity }}</td>
                  <td>{{ admisttedd.phone }}</td>
                </tr>
              </tbody>
            </table>
              </div>
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
                  <li>Surname: {{ admin.selectedUser.surname }}</li>
                  <li>Firstname: {{ admin.selectedUser.firstname }}</li>
                  <li>Middlename: {{ admin.selectedUser.middlename }}</li>
                  <li>Date of Birth: {{ admin.selectedUser.dateOfBirth }}</li>
                  <li>Gender: {{ admin.selectedUser.gender }}</li>
                  <li>Religion: {{ admin.selectedUser.religion }}</li>
                  <li>Local Gvmt: {{ admin.selectedUser.localGovernment }}</li>
                  <li>Home Address: {{ admin.selectedUser.homeAddress }}</li>
                  <li>Guardian Name: {{ admin.selectedUser.guardianName }}</li>
                  <li>Permanend Addr: {{ admin.selectedUser.permanentAddress }}</li>
                  <li>Secondary School: {{ admin.selectedUser.secondarySchool }}</li>
                  <li>Extra Curricula: {{ admin.selectedUser.extraCurricula }}</li>
                  <li>Disability: {{ admin.selectedUser.disability }}</li>
                  <li>Disability Cause: {{ admin.selectedUser.disableContent }}</li>
                  <li>Phone Number: {{ admin.selectedUser.phone }}</li>
                  <li>Email: {{ admin.selectedUser.email }}</li>
                  <li>Payment ID: {{ admin.selectedUser.paymentId }}</li>
                  <h3>EMERGENCY CONTACTS</h3>
                  <li>Fullname: {{ admin.selectedUser.E_fullname }}</li>
                  <li>Address: {{ admin.selectedUser.E_address }}</li>
                  <li>Phone Number: {{ admin.selectedUser.E_phone }}</li>
                  <li>Email: {{ admin.selectedUser.E_email }}</li>
                  <h3>ENROLLED PROGRAM</h3>
                  <li>First Choice: {{ admin.selectedUser.firstChoice }}</li>
                  <li>Second Choice: {{ admin.selectedUser.secondChoice }}</li>
                  <li>School Attended: {{ admin.selectedUser.schoolAttended }}</li>
                  <li>Result Awarded: {{ admin.selectedUser.resultAwarded }}</li>
                  <div class="imagePassport">
                    <img :src="admin.selectedUser.certificateUrl" alt="The Student's Passport">
                  </div>
                  <h3>SPONSOR</h3>
                  <li>Fullname: {{ admin.selectedUser.S_fullname }}</li>
                  <li>Address: {{ admin.selectedUser.S_address }}</li>
                  <li>Phone Number: {{ admin.selectedUser.S_phone }}</li>
                  <li>Relationship: {{ admin.selectedUser.S_relationship }}</li>
                </ul>
              </div>
          </div>
        </section>
  
        <!-- PAYMENT UPDATE -->
        <section v-if="activeTab === 'payments'">
          <div class="transactionDet">
            <h3>UPDATE STUDENT PAYMENTS</h3>
            <div class="innerDetails">
              <label for="stEmail">Student Email</label>
              <input type="text" id="stEmail" class="contactInput" placeholder="Student Email" v-model="payment.email">

              <label for="stMatric">Student Matric</label>
              <input type="text" id="stMatric" class="contactInput" placeholder="Student Matric" v-model="payment.matricNo">

              <label for="stLast">Student Lastname</label>
              <input type="text" id="stLast" class="contactInput" placeholder="Student Lastname" v-model="payment.lastname" readonly>

              <label for="stFirst">Student Firstname</label>
              <input type="text" id="stFirst" class="contactInput" placeholder="Student Firstname" v-model="payment.firstname" readonly>

              <label for="stMiddle">Student Middlename</label>
              <input type="text" id="transactt" class="contactInput" placeholder="Student Middlename" v-model="payment.middlename" readonly>


              <label for="transactt">Student Transaction ID</label>
              <input type="text" id="transactt" class="contactInput" placeholder="Student Transaction Id" v-model="payment.transactionId" readonly>

              <label for="phoneNum">Student Phone Number</label>
              <input type="text" id="phoneNum" class="contactInput" placeholder="Student Phone Number" v-model="payment.phone" readonly>

              <label for="paymentRecierve">Payment Receiver</label>
              <input type="text" id="paymentRecierve" class="contactInput" placeholder="Recieved By:" v-model="payment.receiver">

              <label for="paymentMade">Payment For:</label>
              <input type="text" id="paymentMade" class="contactInput" placeholder="Payment Made" v-model="payment.paymentMade">

              <label for="amountPaid">Amount Paid</label>
              <input type="number" id="amountPaid" class="contactInput" placeholder="Amount Paid" v-model="payment.amountPaid">


            <h3 v-if="updatePay.error">{{ updatePay.message }}</h3>
            <h3 v-if="updatePay.success">{{ updatePay.message }}</h3>
            <div class="buttons">
              <button @click="fetchStudentPay">{{ admin.isFetching ? 'Fetching...' : 'Fetch' }}</button>
              <button @click="updateStudenPay">{{ admin.isUpdating ? 'Updating...' : 'Update' }}</button>
            </div>
        </div>
      </div>
        </section>
  
        <!-- PAYMENT CHECK -->
        <section v-if="activeTab === 'paymentsCheck'">
          <div class="transactionDet">
            <h3>CHECK STUDENT PAYMENTS</h3>
            <div class="innerDetails">
              <label for="saEmail">Student Email</label>
              <input type="text" id="saEmail" class="contactInput" placeholder="Student Email" v-model="check">
              <table class="payment-table" v-if="admin.paymentsIn.length > 0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount Paid</th>
                <th>Payment Made</th>
                <th>Received By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payment, index) in admin.paymentsIn" :key="index">
                <td>{{ formatDate(payment.timestamp) }}</td>
                <td>{{ formatCurrency(payment.amountPaid) }}</td>
                <td>{{ payment.paymentMade }}</td>
                <td>{{ payment.receivedBy }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Total</td>
                <td>{{ formatCurrency(calculateTotal(admin.paymentsIn)) }}</td>
              </tr>
            </tfoot>
          </table>

            <div class="buttons">
              <button @click="fetchPayments">{{ admin.isLoading ? 'checking...' : 'Check' }}</button>
            </div>
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

// FORMAT DATE
const formatDate = (dateString) => {
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4059734699.
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

// calculate total
const calculateTotal = (payments) => {
  return payments.reduce((total, payment) => {
    return total + parseFloat(payment.amountPaid || 0 );
  }, 0);
}

      const check = ref('')
      const fetchPayments = async () => {
        if(check.value == ''){
          alert('Enter Email')
          return
        }
        await admin.checkPayments(check.value)
      }

      // Handle passport uploads
      const passportPreviewUrl = ref('')
      const handlePassportPhoto = (event) => {
      const file = event.target.files[0]
      if (file) {
          admin.setPassportPhoto(file)
          passportPreviewUrl.value = URL.createObjectURL(file)
      }
  }

  // UPLOAD IMAGE
  const uploaderr = () => {
    admin.uploadAdminImage()
  }

    // const activeTab = ref('Ladmitted');
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
        firstname : '',
        identity : '',
        email : '',
        lastname : '',
        middlename : '',
        faculty : '',
        department : '',
        matricNo : '',
        phone : '',
    })
    const admittedSuc = ref(false)

    // ADMITTED STUDENTS
    const saveAdmitted = async() => {
      if(admission.value.identity == '' || admission.value.firstname == '' || admission.value.lastname == '' || admission.value.middlename == '' || admission.value.email == '' || admission.value.phone == ''){
        transSuccessful.value.errorin = 'no field should be empty'
            return
        }
        transSuccessful.value.errorin = ''
        await admin.admittedStudentss(admission.value)
        // admittedSuc.value = true
        transSuccessful.value.errorin = 'Successful'
        admission.value.firstname = ''
        admission.value.lastname = ''
        admission.value.middlename = ''
        admission.value.identity = ''
        admission.value.email = ''
        admission.value.phone = ''
        admission.value.department = ''
        admission.value.faculty = ''
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
    // WATCH UPDATE SUCCESS
    watch(() => admin.updateInfoDataSuccess, (newVal) => {
      if (newVal) {
        updateDentt.success = true
        updateDentt.message = 'Update Successful'
      }
    });

    // WATCH PHOTO SUCCESS
    const photoUploaded = ref('')
    watch(() => admin.imageUploaded, (newVal) => {
      if (newVal) {
        photoUploaded.value = 'Update Successful'
        passportPreviewUrl.value = ''
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
  role : '',
  profilePicture : ''
})

// ASSIGN ADMIN DETAILS
const fixDetails = async () => {
  adminData.value.name =  admin.loggedAdmin.Fullname
  adminData.value.email =  admin.loggedAdmin.email
  adminData.value.phone =  admin.loggedAdmin.Phone
  adminData.value.role =  admin.loggedAdmin.role
  adminData.value.profilePicture =  admin.loggedAdmin.displayPicture
}


// SEARCH A STUDENT
const studentMatric = ref('')
// SEARCH A STUDENT TO UPLOAD THE RESULT
const searchResult = async () => {
  if(studentMatric.value == ''){
    alert('Enter Matric No')
    return
  }
  await admin.searchAdmitted(studentMatric.value)
  attachValue()
}

const searchResults = ref({
  firstname : '',
  lastname : '',
  middlename : ''
})
const attachValue = () => {
  searchResults.value.firstname = admin.searchDataa.firstname
  searchResults.value.lastname = admin.searchDataa.lastname
  searchResults.value.middlename = admin.searchDataa.middlename
}


// EXAM INPUT DETAILS
const scoreDet = ref({
  matricNo: '',
  semester: '',
  level: '',
  year: '',
  courseCode: '',
  cc : '',
  cu: '',
  test: '',
  practical: '',
  assmt: '',
  exam: '',
  total:'',
  name: ''
})

const uploadError = ref(false)
const uploadSuccess = ref(false)
const upErrMsg = ref('')
const upSuccMsg = ref('')
// UPLOAD STUDENT'S RESULT
const updateResult = async () => {
  uploadSuccess.value = false
  uploadError.value = false
  if(scoreDet.value.matricNo == '' || scoreDet.value.semester == ''  || scoreDet.value.assmt == '' || scoreDet.value.cc == ''  || scoreDet.value.courseCode == '' || scoreDet.value.cu == '' || scoreDet.value.exam == '' || scoreDet.value.level == '' || scoreDet.value.name == '' || scoreDet.value.practical == '' || scoreDet.value.test == '' || scoreDet.value.total == '' || scoreDet.value.year == ''){
    uploadError.value = true
    upErrMsg.value = 'No field should be left empty'
    return
  }
  uploadError.value = false
  await admin.uploadResult(scoreDet.value)
  uploadSuccess.value = true
  upSuccMsg.value = 'Uploade successful'
  clearResult()
}

const clearResult = () => {
  scoreDet.value.courseCode = ''
  scoreDet.value.total = ''
  scoreDet.value.exam = ''
  scoreDet.value.assmt = ''
  scoreDet.value.cu = ''
  scoreDet.value.cc = ''
  scoreDet.value.practical = ''
  scoreDet.value.test = ''
}

// STUDENT INFORMATION UPDATE
const updateStudentInfo = ref ({
  matricNo: '',
  email: '',
  lastname: '',
  firstname: '',
  middlename: '',
  department: '',
  faculty: '',
  transactionId: '',
  phone: ''
})

// FETCH INFO
const fetchStudentUpd = async () => {
  if(updateStudentInfo.value.email === ''){
    alert('search field cannot be empty')
    return
  }
  await admin.fetchStudentForUpdate(updateStudentInfo.value)
  await updateInformation()
}
// POPULATE UI WITH FETCHED INFO
const updateInformation = async() => {
  updateStudentInfo.value.email = admin.updateSearch.email
  updateStudentInfo.value.matricNo = admin.updateSearch.matricNo
  updateStudentInfo.value.lastname = admin.updateSearch.lastname
  updateStudentInfo.value.firstname = admin.updateSearch.firstname
  updateStudentInfo.value.middlename = admin.updateSearch.middlename
  updateStudentInfo.value.department = admin.updateSearch.department
  updateStudentInfo.value.faculty = admin.updateSearch.faculty
  updateStudentInfo.value.transactionId = admin.updateSearch.pay_identity
  updateStudentInfo.value.phone = admin.updateSearch.phone
}

// ERROR AND SUCCESS
const updateDentt = ref({
  message: '',
  error: false,
  success: false
})
// UPDATE FETCHED INFO
const updateStudenInfo = async() => {
  await admin.updateMatFacDep(updateStudentInfo.value)
  updateDentt.value.success = true
  updateDentt.value.message = 'Updated Successfully'
  clearUpdate()
}
// CLEAR UPDATE
const clearUpdate = () => {
  updateStudentInfo.value.email = ''
  updateStudentInfo.value.matricNo = ''
  updateStudentInfo.value.lastname = ''
  updateStudentInfo.value.firstname = ''
  updateStudentInfo.value.middlename = ''
  updateStudentInfo.value.department = ''
  updateStudentInfo.value.faculty = ''
  updateStudentInfo.value.phone = ''
  updateStudentInfo.value.transactionId = ''
}

// UPDATE PAYMENT
const payment = ref({
  email: '',
  matricNo: '',
  lastname: '',
  firstname: '',
  middlename: '',
  transactionId: '',
  phone: '',
  amountPaid: '',
  paymentMade: '',
  receiver: ''
})

const updatePay = ref({
  message: '',
  error: false,
  success: false
})

const fetchStudentPay = async () => {
  if(payment.value.email === ''){
    updatePay.value.error = true
    updatePay.value.message = 'No field should be empty'
    return
  }
  updatePay.value.error = true 
  await admin.fetchStudentForUpdate(payment.value)
  await updatePayInfo()
}

// POPULATE PAYMENT UI WITH FETCHED INFO
const updatePayInfo = async() => {
  payment.value.email = admin.updateSearch.email
  payment.value.matricNo = admin.updateSearch.matricNo
  payment.value.lastname = admin.updateSearch.lastname
  payment.value.firstname = admin.updateSearch.firstname
  payment.value.middlename = admin.updateSearch.middlename
  payment.value.department = admin.updateSearch.department
  payment.value.faculty = admin.updateSearch.faculty
  payment.value.transactionId = admin.updateSearch.pay_identity
  payment.value.phone = admin.updateSearch.phone
}

const updateStudenPay = async () => {
  if(payment.value.email === '' || payment.value.amountPaid === '' || payment.value.paymentMade === '' || payment.receiver == ''){
    updatePay.value.error = true
    updatePay.value.message = 'No field should be empty'
    return
  }
  updatePay.value.error = false
  await admin.updatePayment(payment.value)
  updatePay.value.success = true
  updatePay.value.message = 'successfully saved'
  payment.value.amountPaid = ''
  payment.value.paymentMade = ''
}









// INPUTTING 
const courseLists = ref({
  code: '',
  title: '',
  units: ''
})

const alert = ref({
  message: '',
  error: false,
  success: false
})

const saveCourse = async () => {
  if(courseLists.value.code == '' || courseLists.value.title == ''){
    alert.value.error = true
    alert.value.message = 'No field should be empty'
    return
  }
  alert.value.error = false
  await admin.coursesList(courseLists.value)
  alert.value.success = true
  alert.value.message = 'Uploaded Successfully'
  clearCourse()
}

const clearCourse = () => {
  courseLists.value.code = ''
  courseLists.value.title = ''
  courseLists.value.units = ''
}

// PRINTING SECTION
const printOut = () => {
  const printContent = document.getElementById('printable-section').innerHTML
  const printWindow = window.open('', '_blank', 'width=800,height=600')

  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Course Registration Form</title>
        <style>
          /* Reset all styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          /* Basic styling */
          body {
            font-family: Arial, sans-serif;
            background-color: white;
            color: black;
            padding: 20px;
            line-height: 1.5;
          }
            .sleekness{
              text-align:center;
            }
            .headerWithDet{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            .numberes{
                display: flex;
                gap: 10px;
            }
            .newlyl{
              width: 100%;
              max-height: 900px;
              overflow-y: auto;
            }
                .payment-table{
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .payment-table th, .payment-table td{
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
              border: 1px solid #9b6161;
              color: rgb(250, 250, 250);
            }
              @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .payment-table {
                width: 100%;
                font-size: 0.8em;
              }

          
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
    <div class="headerWithDet">
        <h1>ANGELS HEIGHT</h1>
        <p>...Healthcare Training Per Excellence is Our Concern</p>
        <div class="numberes">
            <p>09032327228</p>
            <p>08107812435</p>
        </div>
        <h2>Course Registration Form</h2>
    </div>
        ${printContent}
      </body>
      </html>
    `)
    
    // Close the document and trigger print
    printWindow.document.close()
    
    // Wait for content to load
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
}



  onMounted(async () => {
    await admin.signinUser()
    await admin.fetchRegistered()
    await admin.fetchAdmittedStudents()
    await fixDetails()
  })

  definePageMeta({
  hideFooter: true
})
  </script>
  
  <style scoped>


  .newlyl {
    width: 90%;
    max-height: 800px;
    overflow: scroll; 
    max-width: 1200px;
    display: block;
    position: relative;
}
  .newlyll {
    width: 100%;
    max-height: 850px;
    overflow: scroll; 
    max-width: 100%;
    /* display: block;
    position: relative; */
}



.heightinh {
    width: 100%; 
    min-width: 1200px; 
    border-collapse: collapse;
    color: white;
}

.heightinh th,
.heightinh td {
    border: 1px solid #ddd;
    padding: 8px;
    white-space: nowrap; 
}

.heightinh thead th {
    position: sticky;
    top: 0;
    background-color: #000000;
    z-index: 1;
}

/* Explicit Scrollbar Styling */
.newlyl::-webkit-scrollbar {
    width: 12px; 
    height: 12px; 
    display: block !important; 
}

.newlyl::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.newlyl::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    border: 3px solid #f1f1f1;
}

.newlyl::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Explicit scrollbar for Firefox */
.newlyl {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .newlyl {
        max-height: 500px;
    }
    
    .heightinh {
        min-width: 800px;
    }
}





















  /* .newlyl{
    max-height: 850px;
    overflow-y: auto;
    overflow-x: auto;
    max-width: 100%;
    white-space: nowrap;
  }

  .newlyl::-webkit-scrollbar{
  display: none;
}

@media (min-width: 768px) {
  .newlyl {
    max-height: 300px;
    max-width: 300px;
  }
}

.newlyl{
  -ms-overflow-style: none; 
  scrollbar-width: none;  
} */
      .payment-table{
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .payment-table th, .payment-table td{
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    border: 1px solid #9b6161;
    color: rgb(250, 250, 250);
  }

  .payment-table tr:nth-child(even){
    background-color: #473333;
  }
  .matricName{
    background-color: green;
    color: white;
    font-size: 23px;
    padding: 10px;
  }
  h3{
    color: white;
  }
  .innerDetails{
    display: flex;
    flex-direction: column;
  }
  .buttons{
    display: flex;
    gap: 10px;
  }
  .availableStudent{
    border-bottom: 4px solid blue;
  }
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
    width: 100px;
  }
  .control select{
    width: 100px;
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
  

