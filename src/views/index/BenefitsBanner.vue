<script setup>
import WalletIcon from "@/components/icons/WalletIcon.vue";
import SignpostIcon from "@/components/icons/SignpostIcon.vue";
import DiamondIcon from "@/components/icons/DiamondIcon.vue";
</script>
<template>
    <div class="bg-theme-lightteal">
        <div class="w-full max-w-8xl mx-auto flex flex-col md:flex-row bg-theme-lightteal py-12 gap-6">
            <div class="sm:grow">
                <div class="rounded-full bg-theme-blue inline-block p-2">
                    <wallet-icon class="mx-auto text-theme-white" />
                </div>
                <p class="text-xl font-semibold">Cost-effective</p>
                <p class="w-60 mx-auto mt-2">Save money with our cost effective revision bundles</p>
            </div>
            <div class="sm:grow">
                <div class="rounded-full bg-theme-orange inline-block p-2">
                    <signpost-icon class="mx-auto text-theme-white" />
                </div>
                <p class="text-xl font-semibold">Convenient</p>
                <p class="w-60 mx-auto mt-2">Resources that are easy to find, easy to buy and easy to use.</p>
            </div>
            <div class="sm:grow">
                <div class="rounded-full bg-theme-purple inline-block p-2">
                    <diamond-icon class="mx-auto text-theme-white" />
                </div>
                <p class="text-xl font-semibold">Crystal Clear</p>
                <p class="w-60 mx-auto mt-2">Subject, level and exam board specific products, relevant to you</p>
            </div>
        </div>
    </div>
</template>