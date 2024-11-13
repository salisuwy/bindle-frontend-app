<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useBindleApiStore } from "@/store/bindle-api.js";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import Book from "@/views/shared/Book.vue";
import { useWindowSize } from "@vueuse/core";
import Bundle from "@/views/shared/Bundle.vue";

const props = defineProps({
  title: { type: String, default: "Popular Products" },
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
const products = ref([]);
onBeforeMount(() => {
  bindleApiStore
    .getPopularBooks(props.count, props.level_id, props.subject_id)
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
  } else  {
    return 3;
  }
  
});
</script>
<template>
  <div class="py-4 max-w-8xl mx-auto grid lg:grid-cols-4" v-if="products.length > 0">
    <section class="">
      <div class="lg:w-[70%] flex flex-col gap-2 lg:gap-5 p-4 lg:px-8">
        <h2 class="text-4xl text-center lg:text-left">{{ props.title }}</h2>
        <p class="text-center lg:text-left">Check out our top best-sellers right now!</p>
      </div>
      
    </section>
    <section class="lg:col-span-3 ">
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
      :items-to-show="itemsToShow"
    > -->
        <slide
          v-for="(product, index) in products"
          :key="index"
          class="bg-theme-white"
        >
          <book :product="product" :showBestSeller="true" />
        </slide>
        <!-- <template #addons>
        <navigation>
          <template #next>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 h-10 w-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          </template>
          <template #prev>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 h-10 w-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          </template>
        </navigation>
      </template> -->
      </carousel>

      <div
        v-if="products && products?.length > 0"
        class="flex flex-row items-start justify-center mx-auto gap-4 md:gap-0 py-4"
      >
        <button @click="prevSlide" class="rounded-none font-extrabold mx-2">
          &#10216;
        </button>
        <button @click="nextSlide" class="rounded-none font-extrabold mx-2">
          &#10217;
        </button>
      </div>

      <div
        v-else
        class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 max-w-screen-xl mx-auto"
      >
        <div
          v-for="(product, index) in products"
          :key="index"
          class="bg-theme-white"
        >
          <book :product="product" />
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
