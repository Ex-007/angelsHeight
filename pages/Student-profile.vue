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
          <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Make Request</li>
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
                <h2>09023232332</h2>
                <p>This is Your student Account</p>
                <h3>Course: Computer Technology</h3>
                <h3>Current Session: 2024/2025</h3>
                <h3>Current Semester: Second</h3>
                <h3>Current Level: HNDII</h3>
                <h3>current CGPA 3.74</h3>
            </div>
        </section>
  
        <!-- Requests Section -->
        <section v-if="activeTab === 'requests'">
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


        </section>
  
        <!-- Profile Section -->
        <section v-if="activeTab === 'profile'">
          <h2>Profile Settings</h2>
          <h3> johndoe@gmail.com </h3>
          <p>Update your personal and service details.</p>

        </section>
  
        <!-- Premium Section -->
        <section v-if="activeTab === 'premium'">
          <h3>Make Requests</h3>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';


  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute()

  const getVerified = () => {
    router.push('/Verification')
  }

      // ROUTE GUARD
    definePageMeta({
      middleware: [auth]
    })
  
  const activeTab = ref('home');
  
  const logout = () => {
    alert("Logging out...");
  };
  
  const navigateToRequests = () => {
    activeTab.value = 'requests';
  };
  
  const refreshRequests = () => {
    alert("Refreshing service requests...");
  };
  
  const upgradeToPremium = () => {
    router.push('/Premium');
  };

  const tracking = ref('')

















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
  