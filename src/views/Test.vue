<script setup>
import {computed, onMounted, ref} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import Accordion from "@/components/Accordion.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";

const bindleApiStore = useBindleApiStore()
</script>
<template>
    <div class="bg-theme-white py-10 relative">
        <div class="mx-auto max-w-xl w-full px-6 text-left mb-16">
            <accordion content-class="text-sm text-theme-darkgray2 mt-2" title-class="linklike" indicator-class="float-right" open>
                <template #title><h3 class="inline-block text-2xl">Shipping and returns</h3></template>
                <template #indicator><chevron-icon down class="inline-block" /></template>
                <div>
                    Good news, everyone! There's a report on TV with some very bad news! This opera's as lousy as it is brilliant! Your lyrics lack subtlety. You can't just have your characters announce how they feel. That makes me feel angry!
                    Soothe us with sweet lies. Anyhoo, your net-suits will allow you to experience Fry's worm infested bowels as if you were actually wriggling through them. Professor, make a woman out of me. I haven't felt much of anything since my guinea pig died.
                    And from now on you're all named Bender Jr. I was having the most wonderful dream. Except you were there, and you were there, and you were there! But I know you in the future. I cleaned your poop. Yeah, lots of people did.
                </div>
            </accordion>
        </div>
    </div>
</template>