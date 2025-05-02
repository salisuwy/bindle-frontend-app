<script setup lang="ts">
import { toRef } from 'vue';
import { useBookDetails } from '@/composables/useBindleData';
import type { Book } from '@/composables/useBindleData';

interface Props {
  book: Book;
}
const props = defineProps<Props>();

const { resourceTypes, productUrl } = useBookDetails(toRef(props, 'book'));
</script>

<template>
  <div class="w-full h-auto md:h-[330px] lg:h-[400px] xl:h-[580px]">
    <img
      :src="book.image_url || ''"
      alt="book image"
      class="w-full h-full object-cover object-center"
    />
  </div>
  <div class="mt-5">
    <div class="text-theme-navyblue">
      {{ resourceTypes?.map((t) => t.name).join('/') }}
    </div>
    <div class="mb-4 text-2xl">{{ book.title }}</div>
    <router-link v-if="productUrl" :to="productUrl" class="text-theme-teal"
      >View Product</router-link
    >
  </div>
</template>

<style scoped></style>
