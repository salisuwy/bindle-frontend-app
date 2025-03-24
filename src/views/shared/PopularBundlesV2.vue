<script setup>
import { computed, ref } from 'vue';

import { Carousel, Slide } from 'vue3-carousel';
import BundleV2 from '@/views/shared/BundleV2.vue';
import { useWindowSize } from '@vueuse/core';
import CarouselNav from './CarouselNav.vue';

import { usePopularBundles } from '@/composables/useBindleData';

const props = defineProps({
  title: { type: String, default: 'Popular Bundles' },
  count: { type: Number, default: 8 },
  level_id: { type: String, default: null },
  subject_id: { type: String, default: null },
  use_carousel: { type: Boolean, default: true },
});

const carouselRef = ref();
const currentSlide = ref(0);

const nextSlide = () => carouselRef.value.next();
const prevSlide = () => carouselRef.value.prev();

const { bundles } = usePopularBundles(props.count);

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
  <div class="py-4 max-w-8xl mx-auto" v-if="bundles.length > 0">
    <h2 class="text-4xl my-4 max-w-8xl mx-auto">{{ props.title }}</h2>
    <carousel
      v-if="props.use_carousel"
      class="py-2"
      ref="carouselRef"
      v-model="currentSlide"
      :wrap-around="true"
      :items-to-show="itemsToShow"
    >
      <slide v-for="bundle in bundles" :key="bundle.id" class="bg-theme-pale">
        <BundleV2 :bundle="bundle" class="max-w-full" />
      </slide>
    </carousel>

    <CarouselNav @prevSlide="prevSlide" @nextSlide="nextSlide" />
  </div>
</template>

<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
