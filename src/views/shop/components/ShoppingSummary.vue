<template>
  <div
    class="relative flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-md:mt-9"
  >
    <CouponSection />
    <PriceDetails />
    <button
      class="justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5"
    >
      Proceed to Checkout
    </button>
  </div>
</template>

<script setup>
import CartItem from './CartItem.vue';
import CouponSection from './CouponSection.vue';
import PriceDetails from './PriceDetails.vue';
</script>
