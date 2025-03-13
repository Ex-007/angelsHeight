<template>
    <div>
        
        <div class="overall">
            <div class="firstTop">
                <img src="/img/angelLogo.png" alt="The logo image" width="60px">
                <h1>ANGELSHEIGHT</h1>
            </div>

            <div class="secondTop">
                <ul class="classical">
                    <li><nuxt-link to="/">Home</nuxt-link></li>
                </ul>
            </div>
        </div>

    </div>
</template>



<script setup>
    
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.overall{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}
.firstTop{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: white;
}
ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
}
li{
    list-style-type: none;
    border: 1px solid white;
    padding: 3px;
    background-color: #007bff;
    border-radius: 5px;
}
li:hover{
    background: white;
}
a{
    color: rgb(154, 230, 179);
    text-decoration: none;
    font-size: 20px;

}
</style>