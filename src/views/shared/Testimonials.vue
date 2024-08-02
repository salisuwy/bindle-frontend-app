<script setup>
import QuoteIcon from "@/components/icons/QuoteIcon.vue";
</script>
<template>
  <div class="bg-white max-w-8xl mx-auto w-full px-5 md:px-10 py-10">
    <div class="flex flex-col md:flex-row gap-4 lg:max-w-8xl mx-auto items-left justify-left text-left bg-theme-verylightteal pt-6 pb-12 px-10">
      <div class="testimonial  md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2">Bindle's approach is FAR BETTER than school learning. 100% recommend.</div>
        <div class="text-xl font-medium my-4">Someone, A company</div>
      </div>
      <div class="testimonial  md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2">Both my children used Bindle resources alongside their studies. They were amazing and really helped as additional tools alongside school taught material.</div>
        <div class="text-xl font-medium my-4">Someone, A company</div>
      </div>
      <div class="testimonial  md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2 text-left" >Bindle helped my son pass his Maths GCSEs, with grades above what was predicted.</div>
        <div class="text-xl font-medium my-4">Someone, A company</div>
      </div>
    </div>
  </div>
</template>
