<script setup lang="ts">
import {computed} from 'vue'
import { toast } from '@/components/ui/toast'
import {ArrowRight, Plus, Minus} from 'lucide-vue-next'

const rates = ref(),
    sendMethod = ref(),
    sendCurrency = ref(),
    sendNetwork = ref(),

    receiveMethod = ref(),
    receiveCurrency = ref(),
    receiveNetwork = ref(),

    sendAmount = ref(0.00),
    receiveAmount = ref(0.00),
    receiveAddress = ref()
;

const globalDeniedCurrencies = ['SBPRUB'],
    sendDeniedCurrencies = ['SBERRUB', 'TCSBRUB', 'CARDRUB', 'SBPRUB', 'P24UAH', 'MONOBUAH']

const props = defineProps<{
    sendValue: string | number | undefined,
    receiveValue: string | number | undefined
}>()


const sendModel = computed<string | undefined>({
    get: () => {
        return JSON.stringify(props.sendValue)
    },
    set: (value) => {
        sendMethod.value = value
        sendCurrency.value = value?.split('_')[0]
        sendNetwork.value = value?.split('_')[1]
        return
    },
})

const receiveModel = computed<string | undefined>({
    get: () => {
        return JSON.stringify(props.receiveValue)
    },
    set: (value) => {
        receiveMethod.value = value
        receiveCurrency.value = value?.split('_')[0]
        receiveNetwork.value = value?.split('_')[1]
        calculateReceiveAmount()
        return
    }
})

const getRates = async () => {
    await $fetch('/api/rates', {
        priority: 'high',
    }).then(async (res) => {
        rates.value = res
    })
}

if (process.client) {
    getRates()
    // setInterval(getRates, 10000)
}

const submitForm = async () => {
    let requestData = {
        send: {
            currency: sendCurrency.value,
            network: sendNetwork.value,
            amount: sendAmount.value,
        },
        receive: {
            currency: receiveCurrency.value,
            network: receiveNetwork.value,
            address: receiveAddress.value,
            amount: receiveAmount.value
        }
    }

    try {
        const responseData = await $fetch('/api/exchange', {
            method: 'POST',
            body: JSON.stringify(requestData),
        })

        // @ts-ignore
        if (responseData?.data.order_id === undefined) {
            toast({
                description: 'Internal server error',
                variant: 'destructive',
                duration: 5000
            })
        } else {
            // @ts-ignore
            navigateTo('/exchange/' + responseData?.data?.order_id)
        }
    } catch (err: any) {
        toast({
            description: err?.data?.error === undefined ? err?.data?.message : err?.data?.error,
            variant: 'destructive',
            duration: 5000
        })
    }
}

const validateSendInput = async ($event: any) => {
    sendAmount.value = await $event.target.value.replace(/[^0-9.]/g, "")
    calculateReceiveAmount()
}

const calculateReceiveAmount = () => {
    let receiveVal = +sendAmount.value * rates.value?.data?.currencies?.[sendCurrency.value]?.to?.[receiveCurrency.value]
    receiveAmount.value = isNaN(receiveVal) ? 0 : receiveVal
}

const faq = {
    courseWithFee: ref(false),
    aboutAML: ref(false),
    referral: ref(false),
    isAutomated: ref(false)
}

useHead({
    title: `AmebaChange`,
})

</script>

<template>
    <section class="hero">
        <h1 class="thisTitle">
            Fast and Anonymously crypto exchange
        </h1>
    </section>

    <section class="exchange">
        <UiForm @submit="submitForm" class="flex flex-col gap-4">
            <div class="flex flex-col 920:flex-row justify-center 920:justify-between items-center gap-4 flex-nowrap">
                <div class="flex flex-col gap-3 920:max-w-[50%] w-full">
                    <div class="flex justify-start gap-0 w-full items-end">
                        <div class="grid items-center gap-3.5 relative w-full">
                            <UiFormField v-slot="{ componentField }" name="sendAmount">
                                <UiFormItem>
                                    <UiLabel for="exchange-send" class="text-white/50">You send</UiLabel>
                                    <UiFormControl>
                                        <UiInput id="exchange-send" type="text" placeholder="00.00"
                                                 class="rounded-r-none" v-bind="componentField"
                                                 v-model="sendAmount" @keyup="validateSendInput($event)" @keydown="validateSendInput($event)"
                                                 autocomplete="no"
                                        />
                                    </UiFormControl>
                                </UiFormItem>
                            </UiFormField>
                        </div>

                        <UiFormField v-bind="{ sendModel }" name="sendMethod">
                            <UiSelect v-model="sendModel">
                                <UiSelectTrigger class="max-w-[320px] w-full rounded-l-none !ring-0">
                                    <UiSelectValue placeholder="Select a currency"/>
                                </UiSelectTrigger>
                                <UiSelectContent class="!max-h-[500px]">
                                    <template v-for="(currency, index) in rates?.data?.currencies">
                                        <template
                                            v-if="!globalDeniedCurrencies.includes(index.toString()) && !sendDeniedCurrencies.includes(index.toString())"
                                            v-for="(network, networkIndex) in currency?.withdraw_networks"
                                        >
                                            <UiSelectItem :value="index.toString() + '_' + networkIndex.toString()">
                                                <span class="flex justify-start gap-2 items-center 450:min-w-[200px]">
                                                    <img
                                                        :src="`https://yellowchanger.com/img/crypto/${index.toString().toLowerCase()}.svg`"
                                                        class="max-w-[20px]"
                                                        :alt="currency?.name + ' ' + networkIndex.toString()"
                                                    />

                                                    <span>
                                                        {{ currency?.name }} {{ networkIndex.toString() }}
                                                    </span>
                                                </span>
                                            </UiSelectItem>
                                        </template>
                                    </template>
                                </UiSelectContent>
                            </UiSelect>
                        </UiFormField>
                    </div>

                    <div class="mt-0 min-h-[20px]">
                        <p v-if="sendMethod !== undefined && sendMethod !== null"
                           class="text-sm text-white/50"
                        >
                            Min: {{ rates?.data?.currencies?.[sendCurrency]?.min_withdraw?.[sendNetwork] }}
                            {{ sendCurrency }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-3 920:max-w-[50%] w-full mt-[3px]">
                    <div class="flex justify-start gap-0 w-full items-end">
                        <div class="grid items-center gap-3.5 relative w-full">
                            <UiLabel class="text-white/50">You receive</UiLabel>
                            <div
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-r-none">
                                {{ receiveAmount }}
                            </div>
                        </div>

                        <UiFormField v-bind="{ receiveModel }" name="receiveMethod">
                            <UiSelect v-model="receiveModel">
                                <UiSelectTrigger class="w-auto 450:max-w-[320px] 450:w-full rounded-l-none !ring-0">
                                    <UiSelectValue placeholder="Select a currency"/>
                                </UiSelectTrigger>
                                <UiSelectContent class="!max-h-[500px]">
                                    <template v-for="(currency, index) in rates?.data?.currencies">
                                        <template v-if="!globalDeniedCurrencies.includes(index.toString())"
                                                  v-for="(network, networkIndex) in currency?.withdraw_networks"
                                        >
                                            <UiSelectItem :value="index.toString() + '_' + networkIndex.toString()">
                                                <span class="flex justify-start gap-2 items-center 450:min-w-[200px]">
                                                    <img
                                                        :src="`https://yellowchanger.com/img/crypto/${index.toString().toLowerCase()}.svg`"
                                                        class="max-w-[20px]"
                                                        :alt="currency?.name"
                                                    />

                                                    <span>
                                                        {{ currency?.name }} {{ networkIndex.toString() }}
                                                    </span>
                                                </span>
                                            </UiSelectItem>
                                        </template>
                                    </template>
                                </UiSelectContent>
                            </UiSelect>
                        </UiFormField>
                    </div>

                    <div class="mt-0 min-h-[20px]"></div>
                </div>
            </div>

            <UiInput type="text" placeholder="Your receive address" v-model="receiveAddress" />

            <div class="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center gap-4">
                <div class="flex justify-start gap-4">
                    <div class="px-3 py-2 text-sm font-medium border-2 border-input rounded-lg">
                        Avg exchange time - <span class="text-cyan-400">5 min</span>
                    </div>

                    <div class="px-3 py-2 text-sm font-medium border-2 border-input rounded-lg">
                        Fee - <span class="text-cyan-400">1%</span>
                    </div>
                </div>

                <UiButton type="submit" variant="default" class="bg-cyan-600 text-white hover:text-black w-full sm:w-auto">
                    <ArrowRight class="mr-2 h-5 w-5" />
                    Start the exchange
                </UiButton>
            </div>
        </UiForm>
    </section>

    <section class="faq" id="faq">
        <div class="flex flex-col 450:flex-row text-center 450:text-left 450:justify-between gap-4">
            <div class="flex flex-col gap-2">
                <h2 class="text-2xl font-semibold">
                    Frequently asked questions
                </h2>
                <p class="text-sm text-white/50">
                    Any other questions? Contact our support team, they will be happy to help you.
                </p>
            </div>

            <UiButton as-child variant="secondary">
                <NuxtLink to="https://t.me/whatnexus" target="_blank" class="w-full 450:w-fit px-8">
                    Support
                </NuxtLink>
            </UiButton>
        </div>

        <div class="flex flex-col gap-4">
            <TransitionGroup>
                <div class="flex flex-col gap-0">
                    <div class="w-full px-5 py-4 text-sm 450:text-lg font-medium border-2 border-input bg-background rounded-lg flex justify-between gap-4 text-white/90 cursor-pointer"
                         :class="{ 'rounded-b-none': faq.courseWithFee.value }"
                         @click="faq.courseWithFee.value = !faq.courseWithFee.value"
                    >
                        <span class="select-none">
                            Is the course already indicated with a commission?
                        </span>
                        <span class="flex justify-center items-center">
                            <Plus v-if="!faq.courseWithFee.value" />
                            <Minus v-else />
                        </span>
                    </div>
                    <Transition
                        enter-active-class="duration-100 ease-out"
                        enter-from-class="transform opacity-0 origin-top"
                        enter-to-class="opacity-100"
                        leave-active-class="duration-100 ease-in-out"
                        leave-from-class="opacity-100"
                        leave-to-class="transform opacity-0"
                    >
                        <div class="w-full px-5 py-4 text-sm font-medium border-2 border-input bg-background rounded-lg rounded-t-none border-t-0 flex justify-between gap-4 text-white/70"
                             v-if="faq.courseWithFee.value"
                        >
                            Yes, the course is already indicated taking into account our commission.
                        </div>
                    </Transition>
                </div>
            </TransitionGroup>
            <TransitionGroup>
                <div class="flex flex-col gap-0">
                    <div class="w-full px-5 py-4 text-sm 450:text-lg font-medium border-2 border-input bg-background rounded-lg flex justify-between gap-4 text-white/90 cursor-pointer"
                         :class="{ 'rounded-b-none': faq.aboutAML.value }"
                         @click="faq.aboutAML.value = !faq.aboutAML.value"
                    >
                        <span class="select-none">
                            With what AML do you send cryptocurrency?
                        </span>
                        <span class="flex justify-center items-center">
                            <Plus v-if="!faq.aboutAML.value" />
                            <Minus v-else />
                        </span>
                    </div>
                    <Transition
                        enter-active-class="duration-100 ease-out"
                        enter-from-class="transform opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="duration-100 ease-in-out"
                        leave-from-class="opacity-100"
                        leave-to-class="transform opacity-0"
                    >
                        <div class="w-full px-5 py-4 text-sm font-medium border-2 border-input bg-background rounded-lg rounded-t-none border-t-0 flex justify-between gap-4 text-white/70"
                             v-if="faq.aboutAML.value"
                        >
                            We ship completely clean funds. You can immediately make a deposit on the exchange.
                        </div>
                    </Transition>
                </div>
            </TransitionGroup>
            <TransitionGroup>
                <div class="flex flex-col gap-0">
                    <div class="w-full px-5 py-4 text-sm 450:text-lg font-medium border-2 border-input bg-background rounded-lg flex justify-between gap-4 text-white/90 cursor-pointer"
                         :class="{ 'rounded-b-none': faq.referral.value }"
                         @click="faq.referral.value = !faq.referral.value"
                    >
                        <span class="select-none">
                            How do I get a percentage of other people's transactions?
                        </span>
                        <span class="flex justify-center items-center">
                            <Plus v-if="!faq.referral.value" />
                            <Minus v-else />
                        </span>
                    </div>
                    <Transition
                        enter-active-class="duration-100 ease-out"
                        enter-from-class="transform opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="duration-100 ease-in-out"
                        leave-from-class="opacity-100"
                        leave-to-class="transform opacity-0"
                    >
                        <div class="w-full px-5 py-4 text-sm font-medium border-2 border-input bg-background rounded-lg rounded-t-none border-t-0 flex justify-between gap-4 text-white/70"
                             v-if="faq.referral.value"
                        >
                            We have a referral system, when exchanging your link, you will receive a percentage of the transaction. You can get this link in your personal account.
                        </div>
                    </Transition>
                </div>
            </TransitionGroup>
            <TransitionGroup>
                <div class="flex flex-col gap-0">
                    <div class="w-full px-5 py-4 text-sm 450:text-lg font-medium border-2 border-input bg-background rounded-lg flex justify-between gap-4 text-white/90 cursor-pointer"
                         :class="{ 'rounded-b-none': faq.isAutomated.value }"
                         @click="faq.isAutomated.value = !faq.isAutomated.value"
                    >
                        <span class="select-none">
                            Does the exchange happen automatically?
                        </span>
                        <span class="flex justify-center items-center">
                            <Plus v-if="!faq.isAutomated.value" />
                            <Minus v-else />
                        </span>
                    </div>
                    <Transition
                        enter-active-class="duration-100 ease-out"
                        enter-from-class="transform opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="duration-100 ease-in-out"
                        leave-from-class="opacity-100"
                        leave-to-class="transform opacity-0"
                    >
                        <div class="w-full px-5 py-4 text-sm font-medium border-2 border-input bg-background rounded-lg rounded-t-none border-t-0 flex justify-between gap-4 text-white/70"
                             v-if="faq.isAutomated.value"
                        >
                            Yes, our exchanger is fully automatic in all directions, but we also have support for manual exchange.
                        </div>
                    </Transition>
                </div>
            </TransitionGroup>
        </div>
    </section>
</template>

<style scoped lang="scss">

.hero {
    @apply max-w-[900px] mx-auto my-24;

    .thisTitle {
        @apply text-4xl sm:text-6xl md:text-7xl font-semibold leading-tight text-center;
    }
}

.exchange {
    @apply w-full bg-black/5 backdrop-blur-xl relative border border-white/5 rounded-xl p-4 sm:p-12 1232:p-20 z-[2];

    &:after {
        content: "";
        @apply max-w-[300px] max-h-[150px] w-full h-full bg-cyan-400/20 blur-3xl -z-[1] absolute top-1/2 -translate-y-1/2 right-12;
    }

    &:before {
        content: "";
        @apply max-w-[300px] max-h-[150px] w-full h-full bg-white/10 blur-3xl -z-[1] absolute top-1/2 -translate-y-1/2 left-0 450:left-24;
    }
}

.faq {
    @apply flex flex-col gap-4 my-24;
}

</style>
