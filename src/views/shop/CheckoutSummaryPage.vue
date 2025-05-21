<script setup lang="ts">
import CheckoutLayout from './CheckoutLayout.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';
import CouponOfferV2 from '@/components/coupons/CouponOfferV2.vue';

import { useCurrentOrder } from '@/composables/useCurrentOrder';

const breadcrumbs = [
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'Your Cart', path: '/checkout' },
];

const { order, bookStock, bundleStock, cartItems, coupons } = useCurrentOrder();
</script>

<template>
  <CheckoutLayout :breadcrumbs="breadcrumbs" :showEmptyState="cartItems.length === 0">
    <template #form>
      <ShoppingCart
        :items="cartItems"
        :bookStock="bookStock"
        :bundleStock="bundleStock"
        :editable="true"
      />
    </template>
    <template #order>
      <CouponOfferV2 :coupons="coupons" />
      <PriceDetails :order="order" :showDivider="false" />

      <button
        class="flex justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-theme-teal rounded-sm max-md:px-5"
        @click="$router.push({ name: 'checkout-payment' })"
      >
        <span> Proceed to Checkout </span>
      </button>
    </template>
  </CheckoutLayout>
</template>

<style scoped></style>
