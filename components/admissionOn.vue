<template>
    <div>
        <div class="images">
            <img src="/img/angelsImage.jpg" class="responsive-image" alt="">
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .images{
        margin: 10px 5px;
    }
    img{
        max-width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
    }
    .responsive-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    @media sreen and (min-width: 768px){
        images{
            width: 100%;
        }
    }
</style>