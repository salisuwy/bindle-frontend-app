<script setup>
import { ref, computed } from 'vue';
import BookV2 from '@/views/shared/BookV2.vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import { useWindowSize } from '@vueuse/core';
import CarouselNav from './CarouselNav.vue';

import { usePopularBooks } from '@/composables/useBindleData';

const props = defineProps({
  title: { type: String, default: 'Featured Products' },
  count: { type: Number, default: 8 },
  level_id: { type: String, default: null },
  subject_id: { type: String, default: null },
});

const carouselRef = ref();
const currentSlide = ref(0);

const nextSlide = () => carouselRef.value.next();
const prevSlide = () => carouselRef.value.prev();

const { books } = usePopularBooks(props.count);

const { width } = useWindowSize();

const itemsToShow = computed(() => {
  if (width.value < 640) {
    return 1;
  } else if (width.value < 1024) {
    return 2;
  } else if (width.value < 1280) {
    return 3;
  } else {
    return 4;
  }
});
</script>
<template>
  <div class="py-4" v-if="books.length > 0">
    <h2 class="text-4xl my-4">{{ props.title }}</h2>
    <carousel
      class="py-2"
      ref="carouselRef"
      v-model="currentSlide"
      :wrap-around="true"
      :items-to-show="itemsToShow"
    >
      <slide v-for="book in books" :key="book.id" class="bg-theme-white">
        <BookV2 :product="book" />
      </slide>
    </carousel>

    <CarouselNav v-if="books.length > 3" @prevSlide="prevSlide" @nextSlide="nextSlide" />
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
