<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import Bundle from '@/views/shared/Bundle.vue';
import { useBindleApiStore } from '@/store/bindle-api.js';
import { useWindowSize } from '@vueuse/core';
import CarouselNav from './CarouselNav.vue';

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

const loaded = ref(false);

const bindleApiStore = useBindleApiStore();
const bundles = ref([]);
onBeforeMount(() => {
  bindleApiStore.getPopularBundles(props.count).then((results) => {
    bundles.value = results;
    loaded.value = true;
  });
});

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
      <!-- <carousel
      v-if="props.use_carousel"
      class="py-2"
      :transition="1000"
      :wrap-around="true"
      :autoplay="6000"
      :items-to-show="itemsToShow"
    ></carousel> -->
      <slide v-for="(bundle, index) in bundles" :key="index" class="bg-theme-pale">
        <bundle :bundle="bundle" class="max-w-full" />
      </slide>
    </carousel>

    <CarouselNav
      v-if="bundles && bundles?.length > 0"
      @prevSlide="prevSlide"
      @nextSlide="nextSlide"
    />

    <!-- <div
      v-else
      class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 px-8 max-w-screen-xl mx-auto h-fit"
    >
      <div v-for="(bundle, index) in bundles" :key="index">
        <bundle :bundle="bundle" class="max-w-full" />
      </div>
    </div> -->
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
