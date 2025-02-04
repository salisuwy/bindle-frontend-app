<script setup lang="ts">
import { useSlots } from 'vue';
import LayoutHeader from './Header.vue';
import LayoutFooter from './Footer.vue';
import Testimonials from './Testimonials.vue';
import SubscribeForm from './SubscribeForm.vue';

interface Props {
  test: string;
}
defineProps<Props>();

const getVersion = () => {
  return __APP_VERSION__;
};
const slots = useSlots();
const hasSlot = (name: string) => name in slots;
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
