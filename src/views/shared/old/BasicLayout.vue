<script setup lang="ts">
import { useSlots } from 'vue';
import LayoutHeader from './Header.vue';
import LayoutFooter from './Footer.vue';

const slots = useSlots();
</script>
<template>
  <div class="w-full max-w-full border-b border-theme-gray">
    <layout-header class="max-w-8xl mx-auto"></layout-header>
  </div>
  <main class="w-full">
    <slot></slot>
  </main>
  <div class="w-full max-w-full">
    <layout-footer />
  </div>
</template>
