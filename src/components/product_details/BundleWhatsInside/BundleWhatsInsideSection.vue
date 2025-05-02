<script setup lang="ts">
import { ref, computed } from 'vue';

import BookCard from '@/components/product_details/BundleWhatsInside/BookCard.vue';
import BookCarousel from '@/components/product_details/BundleWhatsInside/BookCarousel.vue';
import CarouselNav from '@/views/shared/CarouselNav.vue';

import type { Book } from '@/composables/useBindleData';
import { useWindowSize } from '@vueuse/core';

interface Props {
  examboards: string[];
  levels: string[];
  subjects: string[];
  books: Book[];
}
defineProps<Props>();

const bookCarouselRef = ref<{ nextSlide: () => void; prevSlide: () => void } | null>(null);

const { width } = useWindowSize();

const nextSlide = () => bookCarouselRef.value?.nextSlide();
const prevSlide = () => bookCarouselRef.value?.prevSlide();

const itemsToShow = computed(() => {
  if (width.value < 640) {
    return 1;
  } else if (width.value < 1024) {
    return 2;
  } else {
    return 3;
  }
});
</script>

<template>
  <div class="w-full text-center my-8">
    <h2 class="text3xl">What's inside?</h2>
    <div class="max-w-2/3 md:w-1/2 mx-auto my-4">
      Tailored for
      {{ Array.from(new Set(examboards)).join(' / ') }} Exam Board{{
        examboards.length > 0 ? 's' : ''
      }}
      deep dive into {{ Array.from(new Set(levels)).join(' / ') }}
      {{ Array.from(new Set(subjects)).join(' / ') }} to ensure you're well prepared for exam
      success.
    </div>
    <div
      class="md:mx-8 flex flex-col md:flex-row items-center justify-center md:items-start mx-auto gap-4 md:gap-10 border-none border-red-600"
    >
      <template v-if="books.length <= 3">
        <BookCard v-for="book in books" :book="book" :key="book.id" />
      </template>
      <BookCarousel ref="bookCarouselRef" v-else :books="books" :itemsToShow="itemsToShow" />
    </div>
    <CarouselNav v-if="books.length > 3" @prevSlide="prevSlide()" @nextSlide="nextSlide()" />
  </div>
</template>

<style scoped></style>
