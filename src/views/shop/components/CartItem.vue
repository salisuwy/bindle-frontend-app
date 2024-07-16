<template>
  <div
    class="flex gap-5 justify-between my-6 w-full max-sm:flex-wrap max-sm:max-w-full"
  >
    <div class="flex gap-4 max-md:flex-wrap">
      <img
        :src="item.image"
        :alt="item.title"
        class="shrink-0 w-full object-cover object-right-top sm:aspect-[0.72] sm:w-[78px]"
        :class="{ 'opacity-75 mix-blend-multiply': item.availableStock === 0 }"
      />
      <div class="flex flex-col justify-between max-md:max-w-full">
        <span
          class="text-xs font-bold text-cyan-800 uppercase max-md:max-w-full"
          :class="{ 'text-gray-500': item.availableStock === 0 }"
        >
          revision guide
        </span>
        <h2
          class="mt-2 text-base text-zinc-950 max-md:max-w-full"
          :class="{ 'text-gray-500': item.availableStock === 0 }"
        >
          {{ item.title }}
        </h2>
        <div class="flex gap-2 items-center">
          <span
            class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm"
            :class="{ 'text-gray-500': item.availableStock === 0 }"
          >
            {{ item.type }}
          </span>
          <span
            v-show="item.availableStock === 0"
            class="py-1 my-2 font-medium leading-6 text-rose-500"
            >Out of stock</span
          >
        </div>
        <div
          class="flex gap-4 self-start mt-1.5 font-medium"
          v-show="item.availableStock > 0"
        >
          <div class="flex gap-2 text-xl leading-7">
            <span class="text-zinc-950">{{ item.price }}</span>
            <span
              v-if="item.price !== item.originalPrice"
              class="text-zinc-400 line-through"
              >{{ item.originalPrice }}</span
            >
          </div>
          <span class="text-lg leading-6 text-rose-500">{{
            item.discount
          }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="item.availableStock > 0"
      class="flex gap-1.5 justify-center self-start text-base font-medium whitespace-nowrap rounded-sm border-2 border-solid bg-stone-100 border-zinc-200 border-opacity-0 text-zinc-950"
    >
      <span
        @click="decreaseQuantity"
        class="cursor-pointer py-1.5 px-3 hover:bg-stone-200" :class="{ 'cursor-not-allowed text-gray-400': quantity === 0 }"
        aria-label="Decrease quantity"
        >-</span
      >
      <span class="py-1.5">{{ quantity }}</span>
      <span
        @click="increaseQuantity"
        class="cursor-pointer py-1.5 px-3 hover:bg-stone-200" :class="{ 'cursor-not-allowed text-gray-400': quantity === item.availableStock }"
        aria-label="Increase quantity"
        >+</span
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import {toast} from "vue3-toastify";
import AddToCartNotification from "./AddToCartNotification.vue";
const { item } = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const quantity = ref(1);

function increaseQuantity() {
  if (item.availableStock > quantity.value) {
    quantity.value++;
  }
}

function decreaseQuantity() {
  if (quantity.value > 0) {
    quantity.value--;
  }
}

function showToast() {
  toast(AddToCartNotification);
}
</script>
