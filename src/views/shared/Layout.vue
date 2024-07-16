<script setup lang="ts">
import {useSlots} from "vue";
import LayoutHeader from "./Header.vue"
import LayoutFooter from "./Footer.vue"
import Testimonials from "./Testimonials.vue";
import SubscribeForm from "./SubscribeForm.vue";

const getVersion = () => {
  // @ts-ignore
  return __APP_VERSION__ // set by vite.config.ts
}
const slots = useSlots();
const hasSlot = (name) => (name in slots);
</script>
<template>
  <div class="w-full max-w-full border-b border-theme-gray">
    <layout-header class="max-w-8xl mx-auto"></layout-header>
  </div>
  <main class="w-full">
      <slot></slot>
  </main>
  <div class="w-full max-w-full">
    <testimonials />
    <subscribe-form />
    <layout-footer />
  </div>
</template>
