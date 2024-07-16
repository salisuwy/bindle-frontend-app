<template>
  <section
    class="absolute top-0 right-0 flex flex-col items-center pb-0 text-sm bg-white rounded-lg min-w-[300px] max-w-[400px] border"
  >
    <header
      class="flex flex-col justify-center self-stretch p-2 w-full text-xl font-medium leading-7 text-gray-700 bg-white border-b border-zinc-200 rounded-tr-lg rounded-tl-lg"
    >
      <div class="flex gap-5 justify-between items-center">
        <h4 class="pl-2">Coupons & Bank Offers</h4>
        <span @click="emits('hide')"
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
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </span>
      </div>
    </header>
    <div class="bg-stone-50 p-4 rounded-br-lg rounded-bl-lg">
      <form
        class="flex gap-0 justify-center px-4 py-2 mt-4 tracking-tighter bg-white rounded-sm border border-zinc-200 leading-[157%]"
      >
        <label for="couponInput" class="sr-only">Enter the coupon code</label>
        <input
          id="couponInput"
          type="text"
          class="flex-1 font-light text-neutral-400"
          placeholder="Enter the coupon code"
        />
        <button type="submit" class="font-medium text-teal-500">Apply</button>
      </form>
      <section
        class="flex flex-col p-4 mt-6 w-full bg-white rounded-sm border border-solid border-zinc-200 max-w-[362px]"
      >
        <CouponItem
          code="BOOKSREWARD"
          savings="£63.88"
          description="20% off on minimum purchase of £63.88"
          expiryDate="3th July 2024 11:59 PM"
          isApplied
        />
        <CouponItem
          code="BOOKSREWARD"
          savings="£63.88"
          description="20% off on minimum purchase of £63.88"
          expiryDate="3th July 2024 11:59 PM"
          :isApplied="false"
        />
      </section>
    </div>
  </section>
</template>

<script setup>
import { defineEmits } from "vue";
import CouponItem from "./CouponItem.vue";

const emits = defineEmits(["hide"]);
</script>
