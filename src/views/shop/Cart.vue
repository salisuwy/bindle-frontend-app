<script setup>
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import CartDrawer from './components/CartDrawer.vue';

import { useRouter } from 'vue-router';
import { useCurrentOrder } from '@/composables/useCurrentOrder';

const emits = defineEmits(['checkoutLinkClicked']);

const router = useRouter();

const gotoCheckout = () => {
  emits('checkoutLinkClicked');
  router.push('/checkout');
};

const { bookStock, bundleStock, cartItems, cartItemsCount, orderTotalPlusShipping } =
  useCurrentOrder();
</script>

<template>
  <div v-if="cartItems.length === 0">
    <h3>Basket</h3>
    <router-link to="/checkout" class="bg-theme-teal mt-8 block buttonlike" @click="gotoCheckout"
      >Continue to Checkout <chevron-icon height="20" width="20" right class="inline"></chevron-icon
    ></router-link>
  </div>

  <CartDrawer
    v-else
    :items="cartItems"
    :count="cartItemsCount"
    :total="orderTotalPlusShipping"
    :bookStock="bookStock"
    :bundleStock="bundleStock"
    @checkoutLinkClicked="gotoCheckout"
  />
</template>
