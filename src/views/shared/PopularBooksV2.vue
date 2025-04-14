<script setup lang="ts">
import { ref, computed } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import BookV2 from '@/views/shared/BookV2.vue';
import { useWindowSize } from '@vueuse/core';
import CarouselNav from './CarouselNav.vue';

import { usePopularBooks } from '@/composables/useBindleData';

const props = defineProps({
  title: { type: String, default: 'Popular Products' },
  count: { type: Number, default: 8 },
  level_id: { type: String, default: null },
  subject_id: { type: String, default: null },
  use_carousel: { type: Boolean, default: true },
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
  } else {
    return 3;
  }
});
</script>
<template>
  <div class="py-4 max-w-8xl mx-auto grid lg:grid-cols-4" v-if="books.length > 0">
    <section class="">
      <div class="lg:w-[70%] flex flex-col gap-2 lg:gap-5 p-4 lg:px-8">
        <h2 class="text-4xl text-center lg:text-left">{{ props.title }}</h2>
        <p class="text-center lg:text-left">Check out our top best-sellers right now!</p>
      </div>
    </section>
    <section class="lg:col-span-3">
      <carousel
        v-if="props.use_carousel"
        class="py-2"
        ref="carouselRef"
        v-model="currentSlide"
        :wrap-around="true"
        :items-to-show="itemsToShow"
      >
        <slide v-for="book in books" :key="book.id" class="bg-theme-white">
          <BookV2 :product="book" :showBestSeller="true" />
        </slide>
      </carousel>

      <CarouselNav @prevSlide="prevSlide" @nextSlide="nextSlide" />
    </section>
  </div>
</template>

<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
