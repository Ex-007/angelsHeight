<!-- pages/confirm.vue -->
<template>
    <div class="confirmation-container">
      <div v-if="loading">
        <p>Verifying your email...</p>
      </div>
      <div v-else-if="error">
        <!-- <h2>Verification Failed</h2> -->
        <h2>Verified</h2>
        <!-- <p>{{ error }}</p> -->
        <h3>Please Login to continue</h3>
        <NuxtLink to="/login">Return to login</NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import{useRoute, useRouter} from 'vue-router'

  const client = useSupabaseClient()
  const loading = ref(true)
  const error = ref(null)
  const router = useRouter()
  const route = useRoute()
  
  onMounted(async () => {
  try {
    const code = route.query.code
    if (!code) {
      throw new Error('No confirmation code found in URL')
    }
    
    // Exchange the confirmation code for a session
    const { error: verifyError } = await client.auth.verifyOtp({
      token_hash: code,
      type: 'email'
    })
    
    if (verifyError) throw verifyError
    
    // Check if the user exists and is confirmed
    const { data: { user }, error: userError } = await client.auth.getUser()
    
    if (userError) throw userError
    
    if (user) {
      router.push('/admin-dash')
    } else {
      throw new Error('Email verification unsuccessful')
    }

   

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// http://localhost:3000/Confirm?code=b3bca032-5c6f-4ae0-9b06-0be4bd0454f7


  </script>
  
  <style scoped>
  .confirmation-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
  }
  h3{
    color:white;
    text-align:center;
  }
  a{
    text-decoration: none;
    color: rgb(60, 60, 222);
  }
  </style>