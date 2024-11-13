<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useBindleApiStore } from "@/store/bindle-api.js";
import Book from "@/views/shared/Book.vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  title: { type: String, default: "Featured Products" },
  count: { type: Number, default: 8 },
  level_id: { type: String, default: null },
  subject_id: { type: String, default: null },
});

const carouselRef = ref();
const currentSlide = ref(0);

const nextSlide = () => carouselRef.value.next();
const prevSlide = () => carouselRef.value.prev();

const loaded = ref(false);

const bindleApiStore = useBindleApiStore();
const products = ref([]);
onBeforeMount(() => {
  bindleApiStore
    .getFeaturedBooks(props.count, props.level_id, props.subject_id)
    .then((results) => {
      products.value = results;
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
  <div class="py-4" v-if="products.length > 0">
    <h2 class="text-4xl my-4">{{ props.title }}</h2>
    <carousel
      class="py-2"
      ref="carouselRef"
      v-model="currentSlide"
      :wrap-around="true"
      :items-to-show="itemsToShow"
    >
      <slide
        v-for="(product, index) in products"
        :key="index"
        class="bg-theme-white"
      >
        <book :product="product" />
      </slide>
    </carousel>
    <div
      class="flex flex-row items-start justify-center mx-auto gap-4 md:gap-0 py-4"
      v-if="products && products?.length > 3"
    >
      <button
        @click="prevSlide"
        class="rounded-none font-extrabold mx-2 hover:bg-teal-400"
      >
        &#10216;
      </button>
      <button
        @click="nextSlide"
        class="rounded-none font-extrabold mx-2 hover:bg-teal-400"
      >
        &#10217;
      </button>
    </div>
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
