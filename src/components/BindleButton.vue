<script setup lang="ts">
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

interface Props {
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  type: 'primary' | 'secondary';
}

defineProps<Props>();
</script>

<template>
  <button
    @click.prevent
    class="flex justify-center items-center px-3.5 py-2.5 text-sm font-semibold rounded-sm max-md:px-5"
    :class="{
      'w-full': block,
      'w-fit': !block,
      'text-white bg-teal-500': type == 'primary',
      'border-teal-500 bg-white text-teal-500': type == 'secondary',
    }"
    :disabled="loading"
  >
    <SpinnerIcon v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
    <span v-if="!loading"> <slot></slot> </span>
  </button>
</template>

<style scoped></style>
