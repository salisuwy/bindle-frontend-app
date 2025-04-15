<script setup>
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
</script>
<template>
  <div class="bg-white max-w-8xl mx-auto w-full px-6 py-10">
    <div
      class="flex flex-col md:flex-row gap-4 lg:max-w-8xl mx-auto items-left justify-left text-left bg-theme-verylightteal pt-6 pb-12 px-10"
    >
      <div class="testimonial md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2">
          The suggested core and workbook bundles made it so easy to find the right study resources.
          Discounted too!
        </div>
        <div class="text-xl font-medium my-4">Sarah, Hampshire</div>
      </div>
      <div class="testimonial md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2">
          Last year I wasted £70 on unnecessary textbooks. This year, the bundles helped me get only
          what my kids needed.
        </div>
        <div class="text-xl font-medium my-4">David, West Midlands</div>
      </div>
      <div class="testimonial md:w-1/3">
        <quote-icon class="w-10 h-10" />
        <div class="my-2 text-left">
          The cheap e-book options were a lifesaver! I could take all my textbooks on holiday to
          revise for mock season on my laptop.
        </div>
        <div class="text-xl font-medium my-4">Emma, London</div>
      </div>
    </div>
  </div>
</template>
