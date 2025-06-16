<template>
    <div>
        <div class="firstStep">
            <img src="/img/profilePicture.jpeg" alt="The profile picture">
            <div class="otherDetails">
                <h3>Name: John Doe</h3>
                <h3>Email: JohnDoe@gmail.com</h3>
                <h3>Course: EEC113</h3>
            </div>
        </div>

        <hr>

        <div class="welcomeLine">
            <h3>Welcome, John Doe!!!</h3>
        </div>

        <hr>

        <div class="searchLine">
            <input type="text" placeholder="Enter Student's Matric" v-model="matriccc">
            <button @click="searchThrough" :disabled="lecturerStore.isLoading">{{ lecturerStore.isLoading ? 'Searching...' : 'Search'}}</button>
        </div>

        <!-- SEARCH FOUND -->
        <div class="searchFound" v-if="showDetails">
            <h3>{{ studentDetails.fullname }}</h3>
            <h3>{{ studentDetails.matriculationNumber }}</h3>
            <h3>{{ studentDetails.session }}, {{ studentDetails.semester }} Semester</h3>
            <div class="otherCourseDetails">
                <div class="labelAndInput">
                    <label for="Exam">Exam:</label>
                    <input type="number" id="Exam" placeholder="Exam Score" v-model="studentDetails.exam">
                </div>
                <div class="labelAndInput">
                    <label for="test">Test:</label>
                    <input type="number" id="test" placeholder="Test Score" v-model="studentDetails.test">
                </div>
                <div class="labelAndInput">
                    <label for="practical">Practical:</label>
                    <input type="number" id="practical" placeholder="Practical Score" v-model="studentDetails.practical">
                </div>
                <div class="labelAndInput">
                    <label for="attendance">Attendance:</label>
                    <input type="number" id="attendance" placeholder="Attendance Score" v-model="studentDetails.attendance">
                </div>
            </div>
            <p v-if="updateProb.error">{{ updateProb.message }}</p>
            <button @click="updateScores" :disabled="lecturerStore.isLoading"> {{ lecturerStore.isLoading ? 'Updating...' : 'Update' }}</button>
        </div>

        <!-- SEARCH NOT FOUND -->
         <div class="notFound" v-else-if="noDetail">
            <h3>{{ errorMessage }}</h3>
         </div>

        <!-- SUCCESSFULLY UPDATED -->
         <div class="notFound" v-else-if="updateSuccess">
            <h3>{{ successMessage }}</h3>
            <button @click="goBack">Back</button>
         </div>

         <!-- ALWAYS SHOW -->
          <div class="displayy" v-else>
            <img src="/img/angelLogo.png" alt="">
          </div>
    </div>
</template>

<script setup>
    import {useLecturersStore} from '@/stores/lecturers'
    const lecturerStore = useLecturersStore()

    const showDetails = ref(false)
    const noDetail = ref(false)
    const errorMessage = ref('')
    const updateSuccess = ref(false)
    const successMessage = ref('')
    const updateProb = ref({
        error: false,
        message: ''
    })

    const matriccc = ref('')
    const courseCode = ref('CMH224')

    const studentDetails = ref({
        fullname: '',
        attendance: '',
        exam: '',
        test: '',
        practical: '',
        total: '',
        documentId: '',
        semester: '',
        session: '',
        matriculationNumber: ''
    })

    // SEARCH THE COURSE
    const searchThrough = async() => {
        noDetail.value = false
        showDetails.value = false
        if(matriccc.value == ''){
            console.log('No Matric Number Found')
            return
        }

        const response = await lecturerStore.searchCourse(matriccc.value, courseCode.value)
        if(!response.success){
            noDetail.value = true
            errorMessage.value = response.message
            console.log(response.message)
            return
        }

        showDetails.value = true
        console.log(response)
        console.log(response.documentId)

        studentDetails.value.attendance = response.courseData.attendance
        studentDetails.value.exam = response.courseData.exam
        studentDetails.value.test = response.courseData.test
        studentDetails.value.practical = response.courseData.practical
        studentDetails.value.total = studentDetails.value.attendance + studentDetails.value.test + studentDetails.value.practical + studentDetails.value.exam
        studentDetails.value.documentId = response.documentId
        studentDetails.value.semester = response.studentInfo.semester
        studentDetails.value.session = response.studentInfo.session
        studentDetails.value.matriculationNumber = response.studentInfo.matricNumber
        studentDetails.value.fullname = response.studentInfo.matricNumber
        studentDetails.value.fullname = response.studentInfo.studentName
    }

    // UPDATE THE COURSE DATA
    const updateScores = async() => {
        updateSuccess.value = false
        successMessage.value = ''

        if(studentDetails.value.exam < 0 || studentDetails.value.test < 0 || studentDetails.value.practical < 0 || studentDetails.value.attendance < 0 ){
            updateProb.value.error = true
            updateProb.value.message = 'No values should be lesser than 0'
            return
        }

        if(studentDetails.value.exam > 60 || studentDetails.value.test > 20 || studentDetails.value.attendance > 20){
            updateProb.value.error = true
            updateProb.value.message = 'Please check the values'
            return
        }

        const matricNumber = studentDetails.value.matriculationNumber
        const courseCodee = courseCode.value

        const response = await lecturerStore.updateCourseScores(matricNumber, courseCodee, studentDetails.value)
        if(!response.success){
            updateProb.value.error = true
            updateProb.value.message = response.message
            return
        }

        matriccc.value = ''
        showDetails.value = false
        updateSuccess.value = true
        successMessage.value = response.message
        console.log(response)
    }

    const goBack = () => {
        updateSuccess.value = false
    }

// CMH224
// CMH227


// AH/DE/25/2-0049

onMounted(() => {
    lecturerStore.signinUser()
})
</script>

<style scoped>
.firstStep{
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;
    gap: 5px;
    padding: 7px;
    color: white;
}
.firstStep img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
.welcomeLine{
    text-align: center;
    padding: 10px;
    color: white;
    font-weight: 900;
    font-size: 20px;
}
.searchLine{
    padding: 10px 2px;
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 5px;
}

input, button{
    height: 35px;
    border: none;
    border-radius: 10px;
    padding: 0 5px;
    font-size: 18px;
}
button:hover{
    background-color: green;
    color: white;
}

.labelAndInput{
    display: grid;
    text-align: center;
    grid-template-columns: 1fr 2fr;
    padding: 2px;
}
.searchFound{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    color: white;
}
.searchFound h3{
    font-weight: bolder;
    font-size: 23px;
}

.notFound{
    text-align: center;
    color: red;
    background-color: white;
    padding: 5px;
}

.displayy{
    display: flex;
    justify-content: center;
}
</style>