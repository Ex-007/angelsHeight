<template>
    <div>
        <div class="heading">
            <h1>Available Courses</h1>
        </div>

        <div class="coursesUl">
            <div class="woven left">
                <ul>
                    <li>Environmental Health Technology</li>
                    <li>Community Health Extension Worker (CHEW) Junior</li>
                    <li>Community Health Extension Worker (CHEW) Senior</li>
                    <li>Dental Therapy</li>
                    <li>Pharmacy Technician</li>
                    <li>Opticianry Dispensary</li>
                </ul>
            </div>
            <div class="woven right">
                <ul>
                    <li>Public Health Technology</li>
                    <li>Health Assistant Medical</li>
                    <li>Health Technician</li>
                    <li>Computer Science Technology</li>
                    <li>Nutrition and Dietetics</li>
                    <li>Medical Laboratory Technician</li>
                    <li>Orthopedic Plaster Card</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>

    .heading{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        background-color: white;
        color: rgb(84, 8, 112);
        padding: 10px;
        border-radius: 20px;
        margin: 10px auto;
        width: 60%;
    }
    .coursesUl{
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    li{
        list-style-type: none;
        padding: 5px 0;
        color: white;
    }
    @media (max-width: 768px){
        .coursesUl{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 auto;
        }
        .woven{
            margin: 0 auto;
        }
        h1{
            font-size: 20px;
        }
    }
    
</style>