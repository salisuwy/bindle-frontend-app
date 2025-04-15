<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { event } from 'vue-gtag';

//import { useBooks, useBundles } from '@/composables/useBindleData';

event('Salisu - Trigger Event', { method: 'Google' });

//useBooks();
//useBundles();
</script>
<template>
  <RouterView></RouterView>
  <VueQueryDevtools />
</template>

<style scoped></style>
