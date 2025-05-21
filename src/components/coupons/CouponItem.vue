<script setup lang="ts">
import { computed } from 'vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
import { defineProps, defineEmits } from 'vue';
import type { CouponItem } from '@/store/cart-api';

interface Props {
  coupon: CouponItem;
  isPending: boolean;
  isApplied: boolean;
  isRemoveCouponError: boolean;
}
const props = defineProps<Props>();

const savings = computed(() => props.coupon.coupon_amount + '%');
const description = computed(() => {
  if (props.coupon.coupon_description !== null) {
    return props.coupon.coupon_description;
  } else {
    return props.coupon.coupon_amount + '% off your purchase';
  }
});

const emit = defineEmits(['onRemoveCoupon']);

function removeCoupon() {
  emit('onRemoveCoupon', props.coupon.coupon_code);
}
</script>

<template>
  <article class="p-2.5" :class="{ 'mt-8': !isApplied }">
    <div class="flex justify-between items-start gap-2.5">
      <div class="flex flex-col justify-center" :class="{ 'border-red-500': isRemoveCouponError }">
        <div
          class="justify-center w-fit px-2 py-1 text-xs font-semibold leading-5 text-teal-500 uppercase whitespace-nowrap rounded-sm border border-teal-500 border-dashed"
        >
          {{ coupon.coupon_code }}
        </div>
        <div class="mt-1.5 font-medium leading-[157%] text-neutral-800">Save {{ savings }}</div>
      </div>
      <button
        @click="removeCoupon"
        :class="{
          'justify-center self-start px-3.5 py-2.5 font-semibold whitespace-nowrap rounded-sm min-w-[80px]': true,
          'text-teal-500 bg-white border border-teal-500 border-solid': isApplied,
          'text-white bg-teal-500': !isApplied,
        }"
        :disabled="isPending"
      >
        <span v-if="isPending">
          <SpinnerIcon class="w-6 h-6" />
        </span>
        <span v-else>
          {{ isApplied ? 'Remove' : 'Apply' }}
        </span>
      </button>
    </div>
    <div class="mt-1 font-light leading-6 text-zinc-500">
      {{ description }}
    </div>
  </article>
</template>
