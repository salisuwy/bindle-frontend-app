<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import CouponItem from './CouponItem.vue';
import SpinnerIcon from '../../../components/icons/SpinnerIcon.vue';
import { addCoupon as serverAddCoupon, removeCoupon as serverRemoveCoupon } from '@/store/cart-api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query';

const props = defineProps({
  coupons: Array,
});
const emits = defineEmits(['hide']);
const queryClient = useQueryClient();

const userInput = ref('');
const isAddCouponError = ref(false);
const isRemoveCouponError = ref(false);

function hideModal() {
  console.log('hideModal');
  emits('hide');
}

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
    if (args.operation === 'add') {
      isAddCouponError.value = true;
    } else {
      isRemoveCouponError.value = true;
    }
    console.error('coupon mutation error', args);
  },
  onSuccess: ({ data }) => {
    console.log('coupon mutation success', data);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['cartItems']);
  },
});
</script>

<template>
  <div @click="hideModal" class="fixed inset-0 w-screen h-screen bg-black opacity-30 z-10"></div>
  <section
    class="absolute top-0 right-0 z-20 flex flex-col items-center pb-0 text-sm bg-white rounded-lg min-w-[350px] max-w-[400px] border"
  >
    <header
      class="flex flex-col justify-center self-stretch p-2 w-full text-xl font-medium leading-7 text-gray-700 bg-white border-b border-zinc-200 rounded-tr-lg rounded-tl-lg"
    >
      <div class="flex gap-5 justify-between items-center">
        <h4 class="pl-2">Coupons & Bank Offers</h4>
        <span
          @click="hideModal"
          class="p-2 cursor-pointer hover:text-red-500 hover:bg-stone-100 flex justify-center items-center rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </span>
      </div>
    </header>
    <div class="bg-stone-50 p-4 rounded-br-lg rounded-bl-lg w-full">
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
      </template>

      <section
        class="flex flex-col p-4 mt-6 w-full bg-white rounded-sm border border-solid border-zinc-200 max-w-[362px]"
      >
        <template v-for="coupon in coupons">
          <CouponItem
            :code="coupon.coupon_code"
            :savings="coupon.coupon_amount + '%'"
            :description="coupon.coupon_amount + '% off your purchase'"
            :isPending="isPending"
            isRemoveCouponError="isRemoveCouponError"
            isApplied
            @onRemoveCoupon="removeCoupon"
          />
        </template>

        <!-- centered div with message no coupon code -->
        <div v-if="coupons.length == 0" class="flex justify-center items-center my-4">
          <p class="text-sm text-neutral-400 uppercase">No coupon code applied</p>
        </div>

        <!-- <CouponItem
          code="BOOKSREWARD"
          savings="£63.88"
          description="20% off on minimum purchase of £63.88"
          expiryDate="3th July 2024 11:59 PM"
          :isApplied="false"
        /> -->
      </section>
    </div>
  </section>
</template>
