<script setup lang="ts">
interface Props {
  padRight?: boolean;
}
defineProps<Props>();
</script>

<template>
  <div class="flex gap-5 text-base tracking-tighter leading-6 max-md:flex-wrap">
    <slot></slot>
    <div v-if="padRight" class="max-md:hidden flex-1"></div>
  </div>
</template>
