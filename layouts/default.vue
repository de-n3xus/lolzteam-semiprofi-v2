<script setup lang="ts">
import { Icon } from '@iconify/vue'

const colorMode = useColorMode()
colorMode.preference = 'dark'
</script>

<template>

    <header class="w-full py-4 bg-black/50">
        <div class="max-w-[calc(1200px+2rem)] px-4 mx-auto flex justify-between items-center gap-4">
            <div class="hidden 350:block sm:w-[128px]">
                <NuxtLink to="/" class="w-fit flex justify-start">
                    <NuxtImg src="/img/logo.svg"
                             alt="AmebaChange"
                             class="w-[32px] h-[32px]"
                    />
                </NuxtLink>
            </div>

            <nav class="desktop__nav">
                <NuxtLink to="/">
                    Home
                </NuxtLink>

                <NuxtLink to="/rules">
                    Rules
                </NuxtLink>

                <NuxtLink to="/#faq" class="notShowActive">
                    FAQ
                </NuxtLink>
            </nav>

            <div class="sm:w-[128px] flex justify-end">
                <UiButton as-child>
                    <NuxtLink to="https://t.me/whatnexus" target="_blank" class="w-fit">
                        Support
                    </NuxtLink>
                </UiButton>
            </div>
        </div>
    </header>

    <main class="max-w-[calc(1200px+2rem)] px-4 mx-auto my-8">
        <slot/>
    </main>

    <footer class="mt-12 mb-8 text-center w-full text-sm text-white/50">
        &copy; {{ new Date().getFullYear() === 2024 ? '2024' : '2024-' + new Date().getFullYear() }}, all rights reserved.
    </footer>

</template>

<style scoped>

</style>