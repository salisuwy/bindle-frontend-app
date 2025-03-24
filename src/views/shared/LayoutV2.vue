<script setup lang="ts">
//import LayoutHeader from './Header.vue';
import LayoutHeaderV2 from './HeaderV2.vue';
import LayoutFooter from './Footer.vue';
import Testimonials from './Testimonials.vue';
import SubscribeForm from './SubscribeForm.vue';
</script>

<template>
  <div class="w-full max-w-full border-b border-theme-gray">
    <LayoutHeaderV2 class="max-w-8xl mx-auto"></LayoutHeaderV2>
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
