<script setup>
const emits = defineEmits(["nextSlide", "prevSlide"]);

const nextSlide = () => emits("nextSlide");
const prevSlide = () => emits("prevSlide");
</script>
<template>
  <div
    class="flex flex-row items-start justify-center mx-auto gap-4 md:gap-0 py-4"
  >
    <button
      @click="prevSlide"
      class="rounded-none font-extrabold mx-2 hover:bg-teal-400 focus:ring-0 focus:outline-none hover:ring-0"
    >
      &#10216;
    </button>
    <button
      @click="nextSlide"
      class="rounded-none font-extrabold mx-2 hover:bg-teal-400 focus:ring-0 focus:outline-none hover:ring-0"
    >
      &#10217;
    </button>
  </div>
</template>
