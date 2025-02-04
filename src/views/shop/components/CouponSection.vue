<template>
  <section>
    <div class="flex flex-wrap gap-4 justify-between px-0.5 py-2">
      <h2 class="my-auto text-xl font-medium leading-7 text-gray-700">Available Coupon</h2>
      <button
        @click="show"
        class="justify-center px-4 md:px-12 py-2.5 text-sm font-semibold text-white whitespace-nowrap bg-teal-500 rounded-sm"
      >
        Add
      </button>
    </div>
    <hr class="border border-zinc-200 my-1.5" />
  </section>
  <CouponsOffer v-if="showCoupon" @hide="hide" :coupons="coupons" />
</template>

<script setup>
import { ref, defineProps } from 'vue';
import CouponsOffer from './CouponsOffer.vue';

const props = defineProps({
  coupons: Array,
});

const showCoupon = ref(false);

function show() {
  showCoupon.value = !showCoupon.value;
}

function hide() {
  showCoupon.value = false;
}
</script>
