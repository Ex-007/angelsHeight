<template>
    <div class="course-selection-container">
    <div class="headerWithDet">
      <div class="nameAndLogo">
        <img src="/img/angelLogo.png" alt="The logo image" width="60px">
        <div class="namee">
          <h1>ANGELS HEIGHT COLLEGE OF HEALTH TECHNOLOGY</h1>
          <p>...Healthcare Training Per Excellence is Our Concern</p>
        </div>
      </div>
        
        
        
        <div class="numberes">
            <p>09032327228</p>
            <p>08107812435</p>
        </div>
        <h2>Course Registration Form</h2>
    </div>

      
      <!-- Search and Select Courses -->
      <div class="search-section">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search for courses..." 
            @input="filterCourses"
          />
        </div>
        
        <div v-if="filteredCourses.length > 0" class="course-dropdown">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id" 
            class="course-option"
            @click="addCourse(course)"
          >
            {{ course.code }} - {{ course.title }} ({{ course.units }} units)
          </div>
        </div>
      </div>
      
      <!-- Selected Courses Table -->
      <div id="printable-section">
        <div class="student-info">
          <h3 class="sleekness">Student Information</h3>
          <div class="student-details">
            <p><strong>Name:</strong> {{ studentDetail.lastname + ' ' + studentDetail.middlename + ' ' + studentDetail.firstname }}</p>
            <p><strong>Matric No:</strong> {{ studentDetail.matric }}</p>
            <p><strong>Department:</strong> {{ studentDetail.department }}</p>
            <p><strong>Level:</strong> {{ formYear }}</p>
            <p><strong>Semester:</strong> {{ formSemester }}</p>
            <p><strong>Year:</strong> {{ formLevel }}</p>
          </div>
        </div>
        
        <div class="selected-courses">
          <h3 class="sleekness">Selected Courses</h3>
          <table v-if="selectedCourses.length > 0">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Units</th>
                <th class="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in selectedCourses" :key="course.id">
                <td>{{ index + 1 }}</td>
                <td>{{ course.code }}</td>
                <td>{{ course.title }}</td>
                <td>{{ course.units }}</td>
                <td class="no-print">
                  <button @click="removeCourse(index)" class="remove-btn">Remove</button>
                </td>
              </tr>
              <tr class="total-row">
                <td colspan="3"><strong>Total Units</strong></td>
                <td><strong>{{ totalUnits }}</strong></td>
                <td class="no-print"></td>
              </tr>
            </tbody>
          </table>
          <p v-else>No courses selected yet.</p>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <p>Student's Signature: ________________________</p>
            <br><br>
            <p>Date: ________________________</p>
          </div>
          <div class="signature-box">
            <p>Advisor's Signature: ________________________</p>
            <br><br>
            <p>Date: ________________________</p>
          </div>
        </div>
      </div>
      
      <div class="errorClass">
        <p v-if="processData.error">{{ processData.message }}</p>
      </div>
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="printForm" class="print-btn"> {{ courseStore.isLoading ? 'Processing...' : 'Process'}}</button>
        <button @click="resetForm" class="reset-btn">Reset</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { definePageMeta } from '#imports'
  import {useCourseStore} from '@/stores/courseform'
  const coursess = useCourseStore()
  import {useLecturerStore} from '@/stores/lecturerConcern'
  const courseStore = useLecturerStore()
  import{useRouter, useRoute} from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const params = route.params.params || []
  const [formSemester, formLevel, formYear] = params
  
  // Define this page as a special layout (optional)
  definePageMeta({
    layout: false
  })

  
  // Reactive state
  const searchQuery = ref('')
  const filteredCourses = ref([])
  const selectedCourses = ref([])
  
  // Computed property for total units
  const totalUnits = computed(() => {
    return selectedCourses.value.reduce((total, course) => total + course.units, 0)
  })
  
  // Filter courses based on search query
  const filterCourses = () => {
    if (searchQuery.value.trim() === '') {
      filteredCourses.value = []
      return
    }
    
    const query = searchQuery.value.toLowerCase()
    filteredCourses.value = allCourses.value.filter(course => {
      return course.code.toLowerCase().includes(query) || 
             course.title.toLowerCase().includes(query)
    })
  }
  
  // Add a course to selected courses
  const addCourse = (course) => {
    // Check if course is already selected
    const isAlreadySelected = selectedCourses.value.some(c => c.id === course.id)
    if (!isAlreadySelected) {
      selectedCourses.value.push(course)
      searchQuery.value = ''
      filteredCourses.value = []
    }
  }
  
  // Remove a course from selected courses
  const removeCourse = (index) => {
    selectedCourses.value.splice(index, 1)
  }

  const processData = ref({
    error: false,
    message: ''
  })

  // PREPARE COURSE DATA
  const preparedCourseData = () => {
    return selectedCourses.value.map(course => ({
      courseCode: course.code,
      courseTitle: course.title,
      courseUnit: course.units
    }))
  }

  const printForm = async() => {
    processData.value.error = false
    processData.value.message = ''
    if(selectedCourses.value.length === 0){
      console.log('Please Select a course')
      return
    }
    const matricc = studentDetail.value.matric
    const session = formLevel
    const semesterr = formSemester
    const studentLevel = formYear
    const coursesValue = preparedCourseData()
    const department = studentDetail.value.department
    const studentName = studentDetail.value.lastname + " " + studentDetail.value.firstname + " " + studentDetail.value.middlename

    console.log(coursesValue, matricc, session, semesterr)
    const response = await courseStore.saveCourse(coursesValue, matricc, session, semesterr, studentName, studentLevel, department)

    if(!response.success){
      processData.value.error = true
      processData.value.message = 'Error Processing Course Form'
      setTimeout(() => {
        processData.value.error = false
        processData.value.message = ''
      }, 3000);
      console.log('Error Processing Course Form')
      return
    }

    processData.value.error = false
    processData.value.message = ''
    console.log('done')
    await printFormm()
  }
  
  // Print the form using a new window with clean styles
  const printFormm = async () => {
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
              .nameAndLogo{
                display: flex;
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
          
          h2 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          h3 {
            font-size: 18px;
            margin: 15px 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f2f2f2;
          }
          
          .total-row {
            font-weight: bold;
          }
          
          .student-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }
          
          .signature-box {
            width: 45%;
          }
          
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
    <div class="headerWithDet">
      <div class="nameAndLogo">
        <img src="/img/angelLogo.png" alt="The logo image" width="60px">
        <div class="namee">
          <h1>ANGELS HEIGHT</h1>
          <p>...Healthcare Training Per Excellence is Our Concern</p>
        </div>
      </div>
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
    
    printWindow.document.close()
    
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }
  
  // Reset the form
  const resetForm = () => {
    selectedCourses.value = []
    searchQuery.value = ''
    filteredCourses.value = []
  }
  
  // Fetch courses from API
  const allCourses = ref([])
  const fetchCourses = async () => {
    try {
      allCourses.value = coursess.courseReturn
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }
  
  // WATCH BYPASS BY NOT LOGGED IN USERS
  watch(() => coursess.isBypass, (newVal) => {
    if (newVal) {
        router.push('/login')
    }
  });

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
    studentDetail.value.matric = coursess.studentDetails.matricNo
    studentDetail.value.email = coursess.studentDetails.email
    studentDetail.value.lastname = coursess.studentDetails.lastname
    studentDetail.value.firstname = coursess.studentDetails.firstname
    studentDetail.value.middlename = coursess.studentDetails.middlename
    studentDetail.value.faculty = coursess.studentDetails.faculty
    studentDetail.value.department = coursess.studentDetails.department
  }

  // Lifecycle hook
  onMounted(async () => {
    await coursess.signinUser()
    await attachDetails()
    await coursess.fetchCourse()
    await fetchCourses()
  })
  </script>
  
  <style scoped>
  .errorClass{
    text-align: center;
    background-color: red;
    color: white;
  }
  .sleekness{
    text-align: center;
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


  .course-selection-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .search-section {
    position: relative;
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .course-dropdown {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-top: none;
    z-index: 100;
  }
  
  .course-option {
    padding: 10px;
    cursor: pointer;
  }
  
  .course-option:hover {
    background-color: #f0f0f0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .total-row {
    font-weight: bold;
    background-color: #f9f9f9;
  }
  
  .remove-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .print-btn, .reset-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .print-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .reset-btn {
    background-color: #f44336;
    color: white;
  }
  
  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
  
  .signature-box {
    width: 45%;
  }
  
  .student-info {
    margin-bottom: 20px;
  }
  
  .student-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .nameAndLogo{
    display: flex;
  }
  </style>