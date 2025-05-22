<script setup lang="ts">
import { useWelcomeCoupon } from '@/composables/useCoupons';
import CouponIcon from '@/components/icons/CouponIcon.vue';

const { couponStatus } = useWelcomeCoupon();
</script>

<template>
  <div
    v-if="['not_signed_in', 'available'].includes(couponStatus)"
    class="w-full p-4 sticky top-0 z-10 flex justify-center items-center gap-6 border-b border-theme-gray bg-white"
  >
    <div
      class="rounded-full border-solid border-theme-teal border h-14 flex items-center py-3 px-6"
    >
      <CouponIcon class="text-theme-teal h-6 rotate-45" />
      <span class="text-theme-teal font-medium ml-3">WELCOME50</span>
    </div>
    <span v-if="couponStatus == 'not_signed_in'" class="text-gray-700 font-medium"
      >Sign up today and get 50% off your first book</span
    >
    <span v-else class="text-gray-700 font-medium"
      >Make an order and get 50% off your first book</span
    >
    <button
      v-if="couponStatus === 'not_signed_in'"
      class="rounded-full"
      @click="$router.push({ name: 'user-profile-signup' })"
    >
      Claim Offer
    </button>
    <!--<span class="text-gray-700">{{ couponStatus }}</span>-->
  </div>
</template>

<style scoped></style>
