<script setup>
import slide2bg from '/assets/slide2bg.png';
</script>
<template>
  <div :style="{ backgroundImage: 'url(' + slide2bg + ')', objectFit:'cover' }" class="bg-no-repeat bg-cover w-full h-full object-cover min-h-screen text-left py-20 px-10 lg:px-16 xl:px-20 2xl:px-26 text-theme-white">
      <div class="max-w-8xl flex flex-col mx-auto">
        <div class="grow">&nbsp;</div>
        <p class="lg:hidden text-theme-white text-xs font-semibold">EBOOKS</p>
        <div class="w-full md:w-1/2 max-w-xl md:mr-auto">
          <h2 class="text-2xl md:text-4xl lg:text-5xl mt-4 2xs:mt-2 xs:mt-6 sm:mt-12 md:mt-14 leading-8 text-theme-white">
            Smart savings with eco-friendly E-books and digital products
          </h2>
          <p class="leading-6 mt-6 lg:text-2xl">
            As well as our traditional printed material, Bindle offer a huge collection of study material in E-book form.
            Accessible on all of your devices, our digital resources have the same quality but better for the planet, and your wallet.
          </p>
          <div class="mt-12">
            <router-link to="shop" class="buttonlike cursor-pointer px-12 py-3 rounded-sm" >Shop Now</router-link>
          </div>
        </div>
        <div class="grow">&nbsp;</div>
      </div>
  </div>
</template>