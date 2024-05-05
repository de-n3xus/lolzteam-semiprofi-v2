<script setup lang="ts">
import {Copy, Loader2} from 'lucide-vue-next'
import {toast} from "@/components/ui/toast";

const route = useRoute()

const exchange: any = ref({})

const getExchangeData = async () => {
    await $fetch('/api/exchange/' + route.params.id, {
        priority: 'high',
    }).then(async (res) => {
        // @ts-ignore
        exchange.value = res?.data

        if (typeof route?.query?.testSetStatus !== 'undefined') {
            exchange.value.status = route.query.testSetStatus === null ? 0 : +route.query.testSetStatus
        }

    })
}

if (process.client) {
    getExchangeData()
    // setInterval(getExchangeData, 10000)
}

useHead({
    title: `Exchange #${route.params.id} | AmebaChange`,
})

const {$clipboard} = useNuxtApp()

const copyCreds = () => {
    if ($clipboard.copy(exchange.value?.send_creds)) {
        toast({
            description: 'Copied to clipboard',
        })
    }
}

const copyGetCreds = () => {
    if ($clipboard.copy(exchange.value?.get_creds)) {
        toast({
            description: 'Copied to clipboard',
        })
    }
}

const copySendAmount = () => {
    if ($clipboard.copy(exchange.value?.send_value)) {
        toast({
            description: 'Copied to clipboard',
        })
    }
}

const convertSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours}:${minutes}:${remainingSeconds}`
}

const timeToPay = ref('')

if (process.client) {
    setInterval(() => {
        let timeDifference = +(+exchange.value.time_expire - (Date.now() / 1000)).toFixed(0)
        timeToPay.value = convertSeconds(timeDifference)
    }, 1000)
}

</script>

<template>

    <div class="max-w-[1200px] mx-auto rounded-lg flex justify-center items-center flex-col gap-4">
        <UiSkeleton class="w-full h-[72px] rounded-lg" v-if="!exchange?.uniq_id"/>
        <div class="statusBlock font-secondary"
             v-else
             @click="console.log(exchange)"
        >
            <p :class="{ 'text-white': exchange?.status === 1 }">Waiting for a deposit</p>
            <UiSeparator orientation="vertical" class="h-8 hidden 830:block"/>
            <UiSeparator orientation="horizontal" class="max-w-24 830:hidden"/>
            <p :class="{ 'text-white': exchange?.status === 2 }">Waiting for confirmation</p>
            <UiSeparator orientation="vertical" class="h-8 hidden 830:block"/>
            <UiSeparator orientation="horizontal" class="max-w-24 830:hidden"/>
            <p :class="{ 'text-white': exchange?.status === 3 }">Sending funds</p>
        </div>

        <UiSkeleton class="w-full h-[500px] rounded-lg" v-if="!exchange?.uniq_id"/>

        <div class="flex flex-col gap-4 items-center justify-center w-full" v-if="exchange.status === 1">
            <div class="w-full flex flex-col gap-4 flex-nowrap p-8 border border-input rounded-lg">
                <div class="flex justify-center gap-x-6 gap-y-4 flex-wrap 650:flex-nowrap">
                    <div class="grid items-center gap-3.5 relative 650:max-w-[50%] w-full">
                        <UiLabel class="text-white/50">You send:</UiLabel>
                        <div class="fakeInput">
                            {{ exchange?.get_value }}
                            <span class="text-[#00c394] ml-1 font-medium">
                                {{ exchange?.send_name }}
                            </span>
                        </div>
                    </div>

                    <div class="grid items-center gap-3.5 relative 650:max-w-[50%] w-full">
                        <UiLabel class="text-white/50">You receive:</UiLabel>
                        <div class="fakeInput">
                            {{ exchange?.get_value }}
                            <span class="text-[#21a038] ml-1 font-medium">
                                {{ exchange?.get_network }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="grid items-center gap-3.5 relative max-w-full w-full">
                    <UiLabel class="text-white/50">Send the amount to this address ({{ exchange?.send_network }}):</UiLabel>
                    <div class="fakeInput break-words relative text-wrap !pr-[72px]">
                        <p class="break-all">
                            {{ exchange?.send_creds }}
                        </p>
                        <Copy class="absolute top-1/2 -translate-y-1/2 right-4 text-white
                                 hover:scale-110 cursor-pointer hover:text-cyan-400"
                              @click="copyCreds"
                        />
                    </div>
                </div>

                <div class="flex justify-center gap-x-6 gap-y-4 flex-wrap 650:flex-nowrap">
                    <div class="grid items-center gap-3.5 relative 650:max-w-[50%] w-full">
                        <div class="fakeInput relative">
                            {{ exchange?.send_value }}
                            <span class="text-[#00c394] ml-1 font-medium">
                                {{ exchange?.send_name }}
                            </span>

                            <Copy class="absolute top-1/2 -translate-y-1/2 right-4 text-white
                                 hover:scale-110 cursor-pointer hover:text-cyan-400"
                                  @click="copySendAmount"
                            />
                        </div>
                    </div>

                    <div class="grid items-center gap-3.5 relative 650:max-w-[50%] w-full">
                        <div class="fakeInput text-center justify-center">
                            Currency:
                            <span class="text-[#00c394] ml-1 font-medium">
                                {{ exchange?.send_name }} {{ exchange?.send_network }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center gap-x-6 gap-y-4 flex-wrap 830:flex-nowrap">
                    <div class="bg-black/30 p-4 relative text-sm font-medium text-white/50 rounded-lg 830:max-w-[50%] w-full">
                        Send the specified amount to the wallet in one payment.
                        <br/>
                        After the transaction appears on the network, the order will automatically proceed to the next step.

                        <div class="absolute top-1/2 -translate-y-1/2 left-0 h-12 w-[3px] bg-cyan-700 rounded-r-lg"
                             aria-hidden="true"></div>
                    </div>

                    <div
                        class="bg-black/30 p-4 relative text-sm font-medium text-white/50 rounded-lg 830:max-w-[50%] w-full h-fit">
                        If you have any questions, please contact Telegram support. We will be happy to answer and help.

                        <div class="absolute top-1/2 -translate-y-1/2 left-0 h-12 w-[3px] bg-cyan-700 rounded-r-lg"
                             aria-hidden="true"></div>
                    </div>
                </div>

                <div class="grid items-center gap-3.5 relative max-w-full w-full">
                    <UiLabel class="text-white/50">
                        Your banking details (address of receipt {{ exchange?.get_name }} {{ exchange?.get_network }}):
                    </UiLabel>
                    <div class="fakeInput relative">
                        {{ exchange?.get_creds }}
                        <Copy class="absolute top-1/2 -translate-y-1/2 right-4 text-white
                                 hover:scale-110 cursor-pointer hover:text-cyan-400"
                              @click="copyGetCreds"
                        />
                    </div>
                </div>

                <div
                    class="w-full text-center px-4 py-2 text-sm font-medium bg-cyan-400/20 border border-cyan-400/70 rounded-lg">
                    For payment: {{ timeToPay }}
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-4 items-center justify-center w-full" v-if="exchange.status === 2">
            <div class="w-full flex flex-col gap-4 flex-nowrap p-8 border border-input rounded-lg">
                <p class="text-2xl font-medium text-center">
                    We are waiting for payment confirmation...
                </p>

                <Loader2 class="animate-[spin_2.5s_linear_infinite] w-28 h-28 mt-8 mx-auto" />
            </div>
        </div>

        <div class="flex flex-col gap-4 items-center justify-center w-full" v-if="exchange.status === 3">
            <div class="w-full flex flex-col gap-4 flex-nowrap p-8 border border-input rounded-lg">
                <p class="text-2xl font-medium text-center">
                    That's it, the funds have been sent to you!
                </p>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
.statusBlock {
    @apply w-full flex-col 830:flex-row py-8 830:py-0 830:h-[72px] flex justify-center items-center gap-x-8 gap-y-2
    text-xl font-medium text-white/60 border border-input rounded-lg;
}

.fakeInput {
    @apply flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
    file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}
</style>