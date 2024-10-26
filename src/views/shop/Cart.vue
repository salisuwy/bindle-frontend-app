<script setup>
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { getOrderCart } from "@/store/cart-api";
import { computed } from "vue";
import CartDrawer from "./components/CartDrawer.vue";
import { useRouter } from "vue-router";
import { defineEmits } from "vue";

const emits = defineEmits(["checkoutLinkClicked"]);

const router = useRouter();

const gotoCheckout = () => {
  emits("checkoutLinkClicked");
  router.push("/checkout");
};

const { data, isLoading, isPending, error } = useQuery({
  queryKey: ["cartItems"],
  queryFn: getOrderCart,
});

const order = computed(() => {
  return data.value?.order ?? {};
});


const bookStock = computed(() => {
  return data.value?.order?.book_stock ?? {};
});

const bundleStock = computed(() => {
  return data.value?.order?.bundle_stock ?? {};
});

const cartItems = computed(() => {
  return data.value?.order?.items ?? [];
});

const cartItemsCount = computed(() => {
  const items = data.value?.order?.items ?? [];
  return items.reduce((acc, item) => acc + item.quantity, 0);
});

const orderTotalPlusShipping = computed(() => {
  const orderFinal = isNaN(Number.parseFloat(order.value?.order_final))
    ? 0
    : Number.parseFloat(order.value?.order_final);
  const shippingCost = isNaN(Number.parseFloat(order.value?.shipping_cost))
    ? 0
    : Number.parseFloat(order.value?.shipping_cost);
  const totalTo2Decimals = (orderFinal + shippingCost).toFixed(2);
  return totalTo2Decimals;
});
</script>
<template>
  <div v-if="cartItems.length === 0">
    <h3>Basket</h3>
    <router-link
      to="/checkout"
      class="bg-theme-teal mt-8 block buttonlike"
      @click="gotoCheckout"
      >Continue to Checkout
      <chevron-icon height="20" width="20" right class="inline"></chevron-icon
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
