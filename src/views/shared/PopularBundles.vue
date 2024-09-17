<script setup>
import { computed, onBeforeMount, ref } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import Bundle from "@/views/shared/Bundle.vue";
import { useBindleApiStore } from "@/store/bindle-api.js";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  title: { type: String, default: "Popular Bundles" },
  count: { type: Number, default: 8 },
  level_id: { type: String, default: null },
  subject_id: { type: String, default: null },
  use_carousel: { type: Boolean, default: true },
});

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
      :transition="1000"
      :wrap-around="true"
      :autoplay="6000"
      :items-to-show="itemsToShow"
    >
      <slide
        v-for="(bundle, index) in bundles"
        :key="index"
        class="bg-theme-pale"
      >
        <bundle :bundle="bundle" class="max-w-full" />
      </slide>
      <template #addons>
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
      </template>
    </carousel>
    <div
      v-else
      class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 px-8 max-w-screen-xl mx-auto h-fit"
    >
      <div v-for="(bundle, index) in bundles" :key="index">
        <bundle :bundle="bundle" class="max-w-full" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.carousel__slide {
  border-left: 8px solid white;
  border-right: 8px solid white;
}
</style>
