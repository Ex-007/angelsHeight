<template>
    <div>
        <Hero />
        <About />
        <AdmissionOn />
        <Programs />
        <WhyChoose />
        <LUpdate />
    </div>
</template>

<script setup>
    import {useRoute} from 'vue-router'
    import {ref} from 'vue'
    const router = useRoute()

    const seoData = ref({
        title: 'Angels Height College of Health Technology | Accredited Health Courses',
        description : 'Angels Height college of health technology offers top rated courses like Environmental Health Technology, Community Health Extension Worker (CHEW) Junior, Community Health Extension Worker (CHEW) Senior, Dental Therapy, Pharmacy Technician, Opticianry Dispensary, Public Health Technology, Health Assistant Medical, Health Technician, Computer Science Technology, Nutrition and Dietetics, Medical Laboratory Technician, Orthopedic Plaster Card. Join us for a rewarding career in healthcare.',
        url : 'https://angelsheight.org',
        image : '/img/angelsImage.jpg',
        siteName : 'Angels Height College of Health Technology',
        type : 'website',
        twitterHandle : '@angelsheight',
        keywords : 'Environmental Health Technology, Community Health Extension Worker (CHEW) Junior, Community Health Extension Worker (CHEW) Senior, Dental Therapy, Pharmacy Technician, Opticianry Dispensary, Public Health Technology, Health Assistant Medical, Health Technician, Computer Science Technology, Nutrition and Dietetics, Medical Laboratory Technician, Orthopedic Plaster Card, best health technology college in Nigeria'
    })

    useHead(() => ({
        title : seoData.value.title,
        meta: [
            {
                name: 'description',
                content: seoData.value.description
            },
            {
                name: 'keywords',
                content: seoData.value.keywords
            },
            {
                property: 'og:title',
                content: seoData.value.title
            },
            {
                property: 'og:description',
                content: seoData.value.description
            },
            {
                property: 'og:url',
                content: seoData.value.url
            },
            {
                property: 'og:image',
                content: seoData.value.image
            },
            {
                property: 'og:type',
                content: seoData.value.type
            },
            {
                property: 'og:site_name',
                content: seoData.value.siteName
            },
            {
                name : 'twitter:title',
                content: seoData.value.title
            },
            {
                name : 'twitter:description',
                content: seoData.value.description
            },
            {
                name : 'twitter:image',
                content: seoData.value.image
            },
            {
                name : 'twitter:card',
                content: 'summary_large_image'
            },
            {
                name : 'twitter:site',
                content: seoData.value.twitterHandle
            },
        ],
        link : [{rel: 'canonical', href: seoData.value.url}]
    }))

</script>

<style scoped>
    h1 {
        color: red;
    }
</style>