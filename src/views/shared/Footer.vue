<script setup>
import BindleLogo from '@/views/shared/BindleLogo.vue';
const currentYear = new Date().getFullYear();
</script>
<template>
  <div class="bg-theme-darkblue flex flex-col items-center justify-center py-14 gap-4">
    <div
      class="flex flex-col lg:grid lg:grid-cols-5 w-full px-6 max-w-18xl overflow-hidden max-w-8xl mx-auto"
    >
      <div class="flex flex-col lg:grid-start-1 lg:col-span-3 lg:text-left">
        <bindle-logo class="mx-auto lg:ml-0"></bindle-logo>
        <p class="text-theme-gray3 my-6">
          Bindle Resources Ltd, Manor Farm, Tredington, Shipston-On-Stour, England, CV36 4NJ
        </p>
        <div class="flex flex-row mx-auto lg:ml-0 gap-4">
          <a href="#"
            ><img
              src="/assets/facebook-logo.svg"
              alt="cea logo"
              class="mx-auto grid-col-start-1 select-none"
              draggable="false"
          /></a>
          <a href="#"
            ><img
              src="/assets/instagram-logo.svg"
              alt="cea logo"
              class="mx-auto grid-col-start-1 select-none"
              draggable="false"
          /></a>
        </div>
      </div>
      <div class="shop-resources flex flex-col my-4 gap-4">
        <h4 class="text-theme-white">Shop Resources</h4>
        <router-link to="/gcse" class="text-theme-gray3 text-sm">For GCSEs</router-link>
        <router-link to="/a-level" class="text-theme-gray3 text-sm">For A-Levels</router-link>
        <router-link to="/bundles" class="text-theme-gray3 text-sm">Bindle Bundles</router-link>
      </div>
      <div class="company flex flex-col my-4 gap-4 lg:grid-start-5">
        <h4 class="text-theme-white">Company</h4>
        <router-link to="/privacy-policy" class="text-theme-gray3 text-sm"
          >Privacy Policy</router-link
        >
        <router-link to="/terms-and-conditions" class="text-theme-gray3 text-sm"
          >Terms and Conditions</router-link
        >
        <router-link to="/contact-us" class="text-theme-gray3 text-sm">Contact Us</router-link>
      </div>
    </div>
    <hr class="border-1 w-full text-sm mt-2" style="border-color: #2e3e54" />
    <div class="text-sm text-theme-white mt-6">
      &copy; Bindle {{ currentYear }}, All Rights Reserved.
    </div>
  </div>
</template>
