<template>
<section class="hero">
        <div class="overlay"></div>
        <div class="hero-content">
            <h1>ANGELSHEIGHT</h1>
            <p>
                College of Health Technology <br> <span class="spanning"> In affiliation with Kwara State College of Health Technology </span>
            </p>
            <div class="hero-buttons">
                <button class="primary-btn" @click='userPage'>Sign in</button>
                <button class="secondary-btn" @click="accountPage">Join Us</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// sign in page
const userPage =  () => {
    router.push('/Login')
}

// REgister page
const accountPage =  () => {
    router.push('/ConfirmId')
}



</script>

<style scoped>
     .hero {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    background: url('/public/img/hero.webp') center/cover no-repeat;
    color: white;
    text-align: center;
    padding: 20px;
    overflow: hidden;
    z-index: 1;
}
    .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 1;
}
    .hero-content {
    position: relative;
    max-width: 600px;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1s ease-out forwards;
    z-index: 2;
}
    h1{
        font-size: 2.9rem;
        margin-bottom: 10px;
        animation: fadeIn 1.5s ease-in-out;
    }
    p{
        font-size: 2.5rem;
        margin-bottom: 10px;
        animation: fadeIn 2s ease-in-out;
    }
    .hero-buttons{
        display: flex;
        justify-content: center;
        gap: 15px;
    }
    .primary-btn, .secondary-btn{
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease-in-out;
    }
    .primary-btn{
        background-color: #007bff;
        color: white;
    }
    .secondary-btn{
        background-color: transparent;
        color: white;
        border: 2px solid white;
    }
    .primary-btn:hover{
        background-color: #0056b3;
    }
    .secondary-btn:hover{
        background-color: white;
        color: #007bff;
    }
    .hero{
        background-attachment: fixed;
    }
    .spanning{
        font-size: 19px;
    }

    @keyframes fadeInUp{
        to{
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn{
        0% {opacity: 0;}
        100% {opacity: 1;}
    }

    @media (max-width: 768px){
        h1{
        font-size: 2rem;
        margin-bottom: 10px;
        animation: fadeIn 1.5s ease-in-out;
    }
    p{
        font-size: 1.5rem;
        margin-bottom: 10px;
        animation: fadeIn 2s ease-in-out;
    }
    }
</style>