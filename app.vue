<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

useHead({
    link: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/img/logo.svg'
        }
    ],
    htmlAttrs: {
        lang: 'en'
    }
})

useSeoMeta({
    description: 'AmebaChange is the coolest script exchange in short, made for the semi-pro prefix on LolzTeam',
    ogTitle: 'AmebaChange',
    ogDescription: 'AmebaChange is the coolest script exchange in short, made for the semi-pro prefix on LolzTeam',
    ogImage: '/img/logo.svg',
    ogUrl: 'https://amebachange.n3xus.fun/',
    twitterTitle: 'AmebaChange',
    twitterDescription: 'AmebaChange is the coolest script exchange in short, made for the semi-pro prefix on LolzTeam',
    twitterImage: '/img/logo.svg',
    twitterCard: 'summary'
})
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>

    <Toaster/>
</template>
