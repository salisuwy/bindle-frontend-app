<template>
    <div class="minimal-layout">
        <div class="header border-b">
            <router-link to="/">
                <bindle-logo />
            </router-link>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import BindleLogo from "@/views/shared/BindleLogo.vue";
</script>

<style scoped>
.minimal-layout {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
    background: linear-gradient(113.52deg, #e5f3f1 0%, #f8f9f9 100%);
}

.header {
    text-align: center;
    padding: 1.5rem 0 1.5rem 2rem;
}
</style>
