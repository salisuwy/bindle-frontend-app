<script setup>
import { useBindleApiStore } from '@/store/bindle-api.js';
import PageNotFound from '@/views/PageNotFound.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { event } from 'vue-gtag';

event('Salisu - Trigger Event', { method: 'Google' });

const bindleApiStore = useBindleApiStore();
</script>
<template>
  <page-not-found v-if="bindleApiStore.routingFailed" />
  <router-view v-else></router-view>

  <VueQueryDevtools />
</template>

<style scoped>
@import '@/style.css';
@import '@/font-awesome.css';
</style>
