<template>
    <div>
        <div class="page">
            <h2>Form Submitted. You will be Notified on your email soon!</h2>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
    .page{
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

    h2{
        color: white;
        text-align: center;
        text-align-last: center;
        text-align-last: center;
    }

@media (max-width: 768px){
    h2{
        color: white;
        text-align: center;
        text-align-last: center;
        font-size: 17px;
        text-align-last: center;
    }
}
</style>