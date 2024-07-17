<script setup>
const props = defineProps({
  class: { type:String, default:'bg-theme-pale2'}
})
</script>
<template>
  <div :class="'w-full flex flex-col sm:flex-row items-center justify-center mt-8 py-8 sm:px-20 ' + props.class">
    <div class="w-3/5 flex flex-row gap-4 mb-4 lg:mb-0 items-center justify-center">
      <div class="grow lg:p-4"><img src="/assets/cea-logo.svg" alt="cea logo" class="mx-auto grid-col-start-1 select-none" draggable="false" /></div>
      <div class="grow lg:p-4"><img src="/assets/wjec-logo.svg" alt="wjec logo" class="mx-auto  grid-col-start-2 select-none" draggable="false" /></div>
      <div class="grow lg:p-4"><img src="/assets/edexcel-logo.svg" alt="cea logo" class="mx-auto  grid-col-start-3 select-none" draggable="false" /></div>
    </div>
    <div class="w-2/5 flex flex-row gap-4 items-center justify-center">
      <div class="grow lg:p-4"><img src="/assets/aqa-logo.svg" alt="cea logo" class="mx-auto grid-col-start-1 select-none" draggable="false" /></div>
      <div class="grow lg:p-4"><img src="/assets/ocr-logo.svg" alt="cea logo" class="mx-auto select-none" draggable="false" /></div>
    </div>
  </div>
</template>