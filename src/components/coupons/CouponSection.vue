<script setup>
import { ref, watch, defineProps } from 'vue';
import CouponItem from './CouponItem.vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
import ErrorToastNotification from '@/components/ErrorToastNotification.vue';
import { addCoupon as serverAddCoupon, removeCoupon as serverRemoveCoupon } from '@/store/cart-api';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { consoleLog } from '@/components/helpers/tsUtils';
import { toast } from 'vue3-toastify';

defineProps({
  coupons: Array,
});
const queryClient = useQueryClient();

const userInput = ref('');
const isAddCouponError = ref(false);
const addCouponErrorMessage = ref(undefined);
watch(userInput, () => {
  isAddCouponError.value = false;
  addCouponErrorMessage.value = undefined;
});
const isRemoveCouponError = ref(false);

function applyCoupon() {
  if (userInput.value) {
    mutate({ operation: 'add', coupon_code: userInput.value });
  }
}

function removeCoupon(code) {
  mutate({ operation: 'remove', coupon_code: code });
}

const { isPending, mutate } = useMutation({
  mutationFn: (args) =>
    args.operation === 'add' ? serverAddCoupon(args) : serverRemoveCoupon(args),
  onMutate: (args) => {
    if (args.operation === 'add') {
      isAddCouponError.value = false;
    } else {
      isRemoveCouponError.value = false;
    }
  },
  onError: (error, args) => {
    console.error('coupon mutation error', error, args);
    if (args.operation === 'add') {
      isAddCouponError.value = true;
      addCouponErrorMessage.value = error?.response?.data?.message;
    } else {
      isRemoveCouponError.value = true;
      toast(ErrorToastNotification, {
        expand: true,
        data: {
          message: 'There was an error removing your coupon. Please try again later.',
        },
      });
    }
  },
  onSuccess: ({ data }) => {
    consoleLog('coupon mutation success', data);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cartItems'] });
  },
});
</script>

<template>
  <h1 class="grow text-xl leading-7 text-gray-700">Coupons</h1>
  <hr class="mt-4 h-px border border-zinc-200" />
  <div class="rounded-br-lg rounded-bl-lg w-full my-4">
    <template v-if="coupons.length == 0">
      <form
        @submit.prevent="applyCoupon"
        class="flex gap-0 justify-center px-4 py-2 mt-4 tracking-tighter bg-white rounded-sm border border-zinc-200 leading-[157%]"
        :class="{ '!border-red-500 border-2': isAddCouponError }"
      >
        <label for="couponInput" class="sr-only">Enter the coupon code</label>
        <input
          id="couponInput"
          type="text"
          v-model="userInput"
          class="flex-1 font-light text-neutral-400"
          placeholder="Enter the coupon code"
        />
        <button type="submit" class="font-medium text-teal-500" :disabled="isPending">
          <span v-if="isPending">
            <SpinnerIcon class="w-6 h-6" />
          </span>
          <span v-else>Apply</span>
        </button>
      </form>
      <p class="text-red-500 text-center mt-2" v-if="addCouponErrorMessage !== undefined">
        {{ addCouponErrorMessage }}
      </p>
    </template>

    <template v-else>
      <CouponItem
        v-for="coupon in coupons"
        :key="coupon.coupon_code"
        :coupon="coupon"
        :isPending="isPending"
        :isRemoveCouponError="isRemoveCouponError"
        isApplied
        @onRemoveCoupon="removeCoupon"
      />
    </template>
  </div>
</template>
