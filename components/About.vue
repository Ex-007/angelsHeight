<template>
    <div>
        <div class="headed">

            <h1>About Us</h1>
        </div>
        <p>
            AngelsHeight College of Health Technology is affiliated with the Kwara State College of Health Technology.
        </p>
        <p>
            Our students are exposed to the state-of-the-art teaching techniques, free wifi service for effective and rapid learning, and facilities with competent lecturers with years of experiences.
        </p>
        <div class="location">
            <h3>We are located at Ofiki Olasedidun Road, Ayete, Ibarapa North, Oyo State, Nigeria</h3>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    div{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: white;
        gap: 10px;
        margin-top: 20px;
    }
    p{
        text-align: center;
        font-size: 20px;
    }
    .headed{
        background-color: white;
        color: rgb(84, 8, 112);
        padding: 10px;
        border-radius: 20px;
    }
    .location{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(136, 52, 136);
        padding: 10px;
    }
    h3{
        text-align: center;
        text-align-last: center;
    }
    @media (max-width: 768px){
        h1{
            font-size: 20px;
        }
    }
</style>