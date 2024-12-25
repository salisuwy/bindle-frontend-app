<template>
    <div class="w-full max-w-full border-b border-theme-gray">
        <layout-header class="max-w-8xl mx-auto"></layout-header>
    </div>
    <main class="w-full">
        <div class="user-profile min-h-96 flex flex-row px-12 py-8 mt-6">
            <div class="profile-sidebar w-auto px-12">
                <h3 class="border-b mb-3 pb-3 text-left">MY ACCOUNT </h3>
                <ul>
                    <li class="pb-4 text-left" :class="{ 'text-teal-500': isTabProfile }"
                        @click.prevent.stop="goToRoute(`/user/${authStore.user.id}`)">
                        My Profile
                    </li>
                    <li class="pb-4 text-left" :class="{ 'text-teal-500': isTabOrders }"
                        @click.prevent.stop="goToRoute(`/user/${authStore.user.id}/orders`)">
                        Orders
                    </li>
                    <!-- <li class="pb-4 text-left" @click.prevent.stop="goToRoute(`/user/${authStore.user.id}/e-books`)">
                        My E-books
                    </li> -->
                    <li class="pb-4 text-left" :class="{ 'text-teal-500': isTabBuddy }"
                        @click.prevent.stop="goToRoute(`/user/${authStore.user.id}/buddy`)">
                        Bindle Buddy
                    </li>
                </ul>
            </div>
            <slot></slot>
        </div>
    </main>
    <div class="w-full max-w-full">
        <layout-footer />
    </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "../../store/useAuthStore";

import LayoutHeader from "./Header.vue"
import LayoutFooter from "./Footer.vue"

const slots = useSlots();

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const goToRoute = (route) => {
    console.log("goToRoute", route);
    router.push(route)
}

const isTabOrders = computed(() => {
    console.log("useRoute", route, route.fullPath.includes('orders'))
    return route.fullPath.includes('orders');
})

const isTabBuddy = computed(() => {
    console.log("useRoute", route, route.fullPath.includes('buddy'))
    return route.fullPath.includes('buddy');
})

const isTabProfile = computed(() => {
    return !isTabOrders.value && !isTabBuddy.value;
}) 
</script>

<style scoped>
.profile-sidebar {
    width: 300px !important;
}
</style>