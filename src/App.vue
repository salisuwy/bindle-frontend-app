<script setup>
import { useBindleApiStore } from '@/store/bindle-api.js';
import PageNotFound from '@/views/PageNotFound.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { event } from 'vue-gtag';

import { useBooks, useBundles } from '@/composables/useBindleData';

event('Salisu - Trigger Event', { method: 'Google' });

const bindleApiStore = useBindleApiStore();
useBooks();
useBundles();
</script>
<template>
  <page-not-found v-if="bindleApiStore.routingFailed" />
  <router-view v-else></router-view>

  <VueQueryDevtools />
</template>

<style scoped></style>
