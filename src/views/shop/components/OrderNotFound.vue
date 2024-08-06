<template>
  <section class="flex flex-col px-5 max-w-[273px] mx-auto my-8">
    <img loading="lazy" src="/assets/basket.svg" />
    <h2 class="self-center mt-3 text-2xl font-medium leading-8 text-red-400">
      Order not found
    </h2>
    <p
      class="mt-1 w-full text-xl font-light tracking-tighter leading-7 text-center text-zinc-500"
    >
      We could not find the order you are looking for.
    </p>
    <button
      @click="exploreShop"
      class="justify-center items-center px-3.5 py-2.5 mt-5 w-full text-sm font-semibold text-white bg-teal-500 rounded-sm"
    >
      Explore Shop
    </button>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function exploreShop() {
  router.push("/resources");
}
</script>
