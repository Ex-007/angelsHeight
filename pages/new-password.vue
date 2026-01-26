// pages/reset-password.vue or similar
<template>
  <div class="overall">
    <h2>Set New Password</h2>
    <form @submit.prevent="updatePassword">
      <input 
        v-model="newPassword" 
        type="password" 
        placeholder="New Password"
        required
      />
      <input 
        v-model="confirmPassword" 
        type="password" 
        placeholder="Confirm Password"
        required
      />


        

    <button type="submit" class="primary-btn" :disabled="authReset.isLoading">
    <template v-if="authReset.isLoading">
        <div class="spinner"></div>
    </template>
    <template v-else> Update </template>
    </button>

      <!-- <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Updating...' : 'Update Password' }}
      </button> -->
    </form>
  </div>
</template>

<script setup>

import {useStudentStore} from '@/stores/registerStudent'
const authReset = useStudentStore()
const router = useRouter()

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref(null)
const success = ref(false)

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords don't match"
    return
  }
  
  if (newPassword.value.length < 6) {
    error.value = "Password must be at least 6 characters"
    return
  }
  
  const resetResponse = await authReset.updatePassword(newPassword.value)

  if(!resetResponse?.success){
    console.log('Updating password error', resetResponse?.message)
    return
  }

  console.log('Password reset successfully')

  router.push('/Login')
}
</script>


<style scoped>
    .overall{
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-direction: column;
    }

    h2{
        color: white;
    }

    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
    }

    input{
        width: 250px;
        height: 40px;
        padding: 7px;
        border-radius: 10px;
        border: none;
    }

    button{
        width: 180px;
        height: 40px;
        padding: 7px;
        border-radius: 10px;
        border: none;
        color: white;
        background: rgb(132, 25, 132);
    }

    .primary-btn{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    
.spinner {
  width: 30px;
  height: 30px;
  border: 5px solid rgb(84, 8, 112);
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>