<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import CartDrawerItem from './CartDrawerItem.vue';
import { useRoute } from 'vue-router';

const emits = defineEmits(['checkoutLinkClicked']);
const route = useRoute();
const editable = computed(() => {
  if (route.name === 'checkout-payment' || route.name === 'checkout-address') {
    return false;
  }
  return true;
});

const props = defineProps({
  items: Array,
  total: String,
  count: Number,
  bookStock: Object,
  bundleStock: Object,
});

const gotoCheckout = () => {
  emits('checkoutLinkClicked');
};
</script>

<template>
  <div class="flex flex-col justify-start items-stretch w-full bg-white">
    <header
      class="flex gap-5 justify-start items-center self-stretch px-0 w-full bg-white border-b border-solid border-zinc-200 pb-4"
    >
      <h1 class="flex px-2 gap-1 items-center h-full font-medium min-w-[240px] w-full">
        <span class="text-2xl leading-none text-zinc-950">My Cart</span>
        <span class="text-sm leading-loose text-teal-500 ml-2"
          >({{ count }} Item{{ count > 1 ? 's' : '' }})</span
        >
      </h1>
    </header>

    <main class="flex flex-col w-full px-4">
      <section
        class="flex flex-col items-start pb-1.5 mt-6 max-w-full text-base bg-white rounded-md w-full overflow-hidden"
      >
        <p class="tracking-tight leading-5 text-gray-400 text-wrap text-left">
          Your order is eligible for
          <strong class="font-medium text-teal-500">FREE Delivery</strong>. Select this option at
          checkout.
        </p>
        <div class="flex flex-col mt-6 w-full text-neutral-800">
          <div class="flex gap-5 justify-between items-start w-full">
            <span>Total Amount</span>
            <span class="font-medium">£{{ props.total }}</span>
          </div>
        </div>
        <button
          class="gap-2 self-stretch px-3.5 py-3 mt-6 w-full text-sm font-semibold text-white bg-teal-500 rounded-sm min-h-[42px]"
          @click="gotoCheckout"
        >
          Go to Cart
        </button>
      </section>
      <section
        class="flex overflow-hidden overflow-x-auto flex-col justify-center py-0 mt-6 max-w-full bg-white rounded-md w-full"
      >
        <CartDrawerItem
          v-for="(item, index) in props.items"
          :key="index"
          :item="item"
          :bookStock="props.bookStock"
          :bundleStock="props.bundleStock"
          :editable="editable"
        />
      </section>
    </main>
  </div>
</template>
