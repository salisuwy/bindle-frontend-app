<template>
  <div
    class="relative flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-md:mt-9"
  >
    <CouponSection />
    <PriceDetails />
    <button
      class="justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5"
    >
      Proceed to Checkout
    </button>
  </div>
</template>

<script setup>
import CartItem from "./CartItem.vue";
import CouponSection from "./CouponSection.vue";
import PriceDetails from "./PriceDetails.vue";

const cartItems = [
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e8388aa43c46492c4048b38e19ff48cfd2e85f26f2fd8ebc5d37180cac5561ad?apiKey=dfe4afa8cc374219a8d8cb734251eae7&",
    title:
      "New Grade 9-1 GCSE Chemistry: AQA Revision Guide with Online Edition",
    type: "Paperback",
    price: "£5.30",
    originalPrice: "£5.30",
    discount: "",
    availableStock: 5,
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/76cde9daa1c8f8de3a849677f75e85b64a82ebb1825f232f2f68106c906ad6ce?apiKey=dfe4afa8cc374219a8d8cb734251eae7&",
    title:
      "New Grade 9-1 GCSE Chemistry: AQA Revision Guide with Online Edition",
    type: "Paperback",
    price: "£5.30",
    originalPrice: "£6.00",
    discount: "15% OFF",
    availableStock: 5,
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1dfc0a158836568f9d5a8bd1dc2db8ed692685da3e911a103f6c2f834c2686f0?apiKey=dfe4afa8cc374219a8d8cb734251eae7&",
    title:
      "New Grade 9-1 GCSE Chemistry: AQA Revision Guide with Online Edition",
    type: "Paperback",
    price: "£5.30",
    originalPrice: "£6.00",
    discount: "15% OFF",
    availableStock: 0,
  },
];
</script>
