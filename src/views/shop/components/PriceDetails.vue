<template>
  <section>
    <h2
      class="text-xl font-medium leading-7 text-gray-700"
      :class="{ 'my-4': showDivider, 'mt-8': !showDivider }"
    >
      {{ title }}
    </h2>
    <hr v-if="showDivider" class="border border-zinc-200 my-1.5" />

    <div
      class="flex gap-5 justify-between mt-8 text-base leading-6 whitespace-nowrap"
    >
      <span class="font-light text-neutral-500">Pre Discount</span>
      <span class="font-medium text-neutral-800"
        >£{{ order?.order_total_before_discount }}</span
      >
    </div>
    <div class="flex gap-5 justify-between mt-3 text-base leading-6">
      <span class="font-light text-neutral-500">Coupon Discount</span>
      <span class="font-medium text-neutral-800"
        >£{{ order?.coupons_total_discount }}</span
      >
    </div>
    <p
      v-if="coupon"
      class="mt-1 text-sm font-light tracking-normal leading-5 text-neutral-400"
    >
      (Applied using coupon code
      <span class="font-medium">{{ coupon }}</span> )
    </p>
    <div class="flex gap-5 justify-between mt-3 text-base leading-6">
      <span class="font-light text-neutral-500">Coupon + Bundle Saving</span>
      <span class="font-medium text-neutral-800">
        £{{ order?.order_savings }}
      </span>
    </div>
    <p
      v-if="order?.coupons_total_discount > 0"
      class="mt-1 text-sm font-light tracking-normal leading-5 text-neutral-400"
    >
      (Promotional offer applied)
    </p>
    <div class="flex gap-5 justify-between mt-3 text-base leading-6">
      <span class="font-light text-neutral-500">Delivery Fee</span>
      <span class="font-medium" v-if="order?.shipping_cost > 0">
        £{{ order?.shipping_cost }}
      </span>
      <span class="font-medium text-teal-500" v-else>FREE</span>
    </div>
    <p
      class="mt-1 text-sm font-medium tracking-normal leading-5 text-slate-400"
    >
      Free delivery for orders above £30
    </p>
    <hr class="border border-zinc-200 mt-4 mb-8" />
    <div
      class="flex gap-5 justify-between text-xl font-medium leading-6 text-neutral-800"
    >
      <span>Total Amount</span>
      <span>£{{ orderTotalPlusShipping }}</span>
    </div>
  </section>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";

const props = defineProps({
  order: Object,
  title: {
    type: String,
    default: "Price Details",
  },
  showDivider: {
    type: Boolean,
    default: false,
  },
});
const { order } = toRefs(props);

const coupon = computed(() => {
  const c = order.value?.coupons;
  return c ? c[0]?.coupon_code : "";
});

const orderTotalPlusShipping = computed(() => {
  const orderFinal = order.value?.order_final ?? 0;
  return orderFinal;
});
</script>
