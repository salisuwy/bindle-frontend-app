<script setup lang="ts">
import { ref } from 'vue';

import { Carousel, Slide, Navigation } from 'vue3-carousel';

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
    <slide v-for="book in books" :key="book.id" class="i">
      <div class="border-none border-blue-600 grow mx-6">
        <div class="w-full h-auto md:h-[330px] lg:h-[400px] xl:h-[580px]">
          <img
            :src="book.image_url"
            alt="book image"
            class="w-full h-full object-cover object-center"
          />
        </div>
        <div class="mt-5">
          <div class="text-theme-navyblue">
            {{ getBookTypes(0).join('/') }}
          </div>
          <div class="mb-4 text-2xl">{{ book.title }}</div>
          <router-link v-if="book.url" :to="book.url" class="text-theme-teal"
            >View Product</router-link
          >
        </div>
      </div>
    </slide>
  </Carousel>
</template>

<style scoped></style>
