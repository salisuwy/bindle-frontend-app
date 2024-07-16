<script setup>
import {useBindleApiStore} from "@/store/bindle-api.js";
import PageNotFound from "@/views/PageNotFound.vue";

import { useQueryClient } from "@tanstack/vue-query";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { useLocalStorage } from "@vueuse/core";
import uniqid from "uniqid";
import { fetchItems } from "./components/helpers/server";

const bindleApiStore = useBindleApiStore();


let anonId = useLocalStorage("anonid", uniqid() + "-" + uniqid());
const queryClient = useQueryClient();
queryClient.prefetchQuery({
  queryKey: ["cartItems"],
  queryFn: fetchItems,
});
queryClient.setQueryData("uniqid", anonId.value);

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
