<script setup lang="ts">
import { ref } from 'vue';

import { Carousel, Slide } from 'vue3-carousel';
import BookCardContent from './BookCardContent.vue';

import type { Book } from '@/composables/useBindleData';

interface Props {
  books: Book[];
  itemsToShow: number;
}
defineProps<Props>();

const carouselRef = ref();
const currentSlide = ref(0);

const nextSlide = () => carouselRef.value.next();
const prevSlide = () => carouselRef.value.prev();

defineExpose({
  nextSlide,
  prevSlide,
});
</script>

<template>
  <Carousel ref="carouselRef" v-model="currentSlide" class="" :items-to-show="itemsToShow">
    <Slide v-for="book in books" :key="book.id" class="i">
      <div class="border-none border-blue-600 grow mx-6">
        <BookCardContent :book="book" />
      </div>
    </Slide>
  </Carousel>
</template>

<style scoped>
.carousel__slide {
  align-items: start;
}

@media (max-width: 500px) {
  .carousel {
    width: 100%;
  }
}
</style>
