<script setup>
import { Carousel, Slide, Pagination } from 'vue3-carousel';
</script>

<template>
  <carousel
    class="homepage-carousel w-full h-fit relative overflow-y-hidden"
    :transition="1000"
    :wrap-around="true"
    :autoplay="7500"
  >
    <slide
      class="w-full"
      style="
        background: url('/assets/slide1bg.png') no-repeat center center fixed;
        background-size: cover;
      "
    >
      <div class="carousel-content w-full">
        <h2
          class="max-w-sm sm:max-w-md lg:max-w-2xl px-4 mx-auto text-xl md:text-3xl lg:text-5xl xl:text-6xl mt-12 leading-6 text-theme-black"
        >
          Affordable, bundled study resources
        </h2>
        <p
          class="max-w-sm sm:max-w-md xl:max-w-2xl mx-auto pointer-none mt-4 md:mt-10 text-sm md:text-lg lg:text-xl xl:text-2xl leading-4 2xs:leading-5 grow"
        >
          Streamline your GCSE and A-level journey with Bindle. Our carefully curated bundles take
          the guesswork out of study resources.
          <strong>Ease and affordability in every bundle</strong>
        </p>
        <div class="grow my-12">
          <router-link
            to="/resources/explore"
            class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded"
            >Shop Now</router-link
          >
        </div>
      </div>
    </slide>
    <slide
      class="w-full"
      style="
        background: url('/assets/slide2bg.png') no-repeat center center fixed;
        background-size: cover;
      "
    >
      <div class="carousel-content w-full">
        <h2
          class="max-w-sm sm:max-w-md xl:max-w-2xl px-4 mx-auto text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-12 leading-6 text-theme-white"
        >
          Smart savings with
          <span style="white-space: nowrap">eco-friendly</span>
          <span style="white-space: nowrap">E-books</span>
        </h2>
        <p
          class="max-w-sm sm:max-w-md xl:max-w-2xl mx-auto pointer-none mt-4 md:mt-10 text-sm md:text-xl leading-4 2xs:leading-5 text-theme-white grow"
        >
          Unlock affordability and sustainability with our e-books. Choose our eco-friendly digital
          options for smart savings.
          <strong>Quality educations that's kind to your wallet and the planet.</strong>
        </p>
        <div class="grow my-12">
          <router-link
            to="/resources/explore"
            class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded-sm"
            >Shop Now</router-link
          >
        </div>
      </div>
    </slide>
    <slide
      class="w-full"
      style="
        background: url('/assets/slide3bg.png') no-repeat center bottom fixed;
        background-size: cover;
        background-blend-mode: overlay;
        background-color: rgba(255, 255, 255, 0.7);
      "
    >
      <div class="carousel-content w-full xl:min-h-[750px]">
        <h2
          class="max-w-sm sm:max-w-md xl:max-w-2xl px-4 xl:px-6 mx-auto text-2xl lg:text-5xl xl:text-7xl mt-12 md:mt-14 lg:mt-24 xl:mt-32 leading-6 text-theme-black"
        >
          Textbooks, Revision Guides & Exam Workbooks
        </h2>
        <p
          class="max-w-sm sm:max-w-md xl:max-w-2xl mx-auto pointer-none mt-4 md:mt-10 text-sm lg:text-2xl leading-4 2xs:leading-5 text-theme-black grow"
        >
          Master a subject with a comprehensive textbook. grasp essentials with a focused revision
          guide, and sharpen skills with dedicated exam workbook.
          <strong>In one place for your success.</strong>
        </p>
        <div class="grow my-12 mb-24">
          <router-link
            to="/resources/explore"
            class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded-sm"
            >Shop Now</router-link
          >
        </div>
      </div>
      <div style="opacity: 0">&nbsp;</div>
    </slide>
    <template #addons>
      <div class="absolute left-0 right-0 bottom-2 lg:bottom-10">
        <pagination />
      </div>
    </template>
  </carousel>
</template>
