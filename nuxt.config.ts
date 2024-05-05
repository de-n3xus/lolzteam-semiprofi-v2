// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        '@nuxtjs/color-mode',
        '@nuxt/image',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap',
        '@vueuse/nuxt',
    ],

    colorMode: {
        classSuffix: ''
    },

    shadcn: {
        prefix: 'Ui',
        componentDir: './components/ui'
    },

    css: ['~/assets/css/app.scss'],
})