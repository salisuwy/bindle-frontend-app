<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBindleApiStore } from '@/store/bindle-api.js';
import BundleV2 from '@/views/shared/BundleV2.vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import { useWindowSize } from '@vueuse/core';
import CarouselNav from './CarouselNav.vue';

const route = useRoute();

const bindleApiStore = useBindleApiStore();
const popularBundles = ref([]);
const levelName = ref(null);
const levelFilter = ref(null);

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
});

const carouselRef = ref();
const currentSlide = ref(0);

const nextSlide = () => carouselRef.value.next();
const prevSlide = () => carouselRef.value.prev();

onMounted(async () => {
  await bindleApiStore.getLevels();
  await bindleApiStore.getBundles();
  const level = bindleApiStore.getLevelBySlug(route.name);
  levelFilter.value = route.name === 'generic-level' ? route.params.level : level.slug;
  levelName.value = level.name;
  popularBundles.value = await bindleApiStore.getPopularBundles(6, null, levelFilter.value);
});

const getPopularBundles = computed(() => {
  return popularBundles.value.length > 0 ? popularBundles.value : Object.assign(new Array(5), null);
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
  <div class="recommended-bundles max-w-8xl mx-auto mt-6 md:mt-10" v-if="popularBundles.length > 0">
    <h2 class="mb-3 md:mb-6">Recommended {{ levelName }} Bundles</h2>
    <carousel
      class="py-2"
      ref="carouselRef"
      v-model="currentSlide"
      :wrap-around="true"
      :items-to-show="itemsToShow"
    >
      <slide v-for="(bundle, idx) in getPopularBundles" :key="idx">
        <BundleV2 :bundle="bundle" class="max-w-full" />
      </slide>
    </carousel>

    <CarouselNav
      v-if="getPopularBundles && getPopularBundles?.length > 0"
      @prevSlide="prevSlide"
      @nextSlide="nextSlide"
    />
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
