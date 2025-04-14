<script setup lang="ts">
import BookCardContent from './BookCardContent.vue';

import type { Book } from '@/composables/useBindleData';

interface Props {
  book: Book;
}
defineProps<Props>();
</script>

<template>
  <div class="w-1/2 md:w-4/12 flex flex-col">
    <BookCardContent :book="book" />
  </div>
</template>

<style scoped></style>
