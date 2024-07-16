<script setup>
import {useBindleApiStore} from "@/store/bindle-api.js";
import PageNotFound from "@/views/PageNotFound.vue";
const bindleApiStore = useBindleApiStore();
</script>
<template>
  <page-not-found v-if="bindleApiStore.routingFailed" />
  <router-view v-else></router-view>
</template>

<style scoped>
@import '@/style.css';
@import '@/font-awesome.css';
</style>
