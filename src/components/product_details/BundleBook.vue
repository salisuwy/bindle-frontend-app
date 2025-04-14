<script setup lang="ts">
import { onMounted, toRef } from 'vue';

import { useBookDetails } from '@/composables/useBindleData';
import type { Book } from '@/composables/useBindleData';

interface Props {
  book: Book;
  ebookSelected: boolean;
}
const props = defineProps<Props>();

const {
  productUrl,
  price,
  resourceTypes,
  ebookSelected: innerEbookSelected,
} = useBookDetails(toRef(props, 'book'));

onMounted(() => {
  innerEbookSelected.value = props.ebookSelected;
});
</script>
<template>
  <div class="flex flex-row my-6 items-stretch">
    <div>
      <img :src="props.book.image_url || ''" alt="book image" class="max-h-32" />
    </div>
    <div class="flex flex-col flex-grow px-4 py-4">
      <div class="flex-grow flex items-center text-theme-darkgray2">
        1 x {{ resourceTypes?.map((t) => t.name).join(', ') }}
      </div>
      <div class="flex-grow flex items-center" v-if="productUrl">
        <router-link :to="productUrl" class="underline">{{ book.title }}</router-link>
      </div>
    </div>
    <div class="flex flex-col flex-grow px-4 py-4">
      <div class="flex-grow flex items-center">£{{ price }}</div>
    </div>
  </div>
</template>
