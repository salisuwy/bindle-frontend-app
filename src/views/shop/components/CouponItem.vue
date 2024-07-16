<template>
  <article class="flex gap-2.5 p-2.5" :class="{ 'mt-8': !isApplied }">
    <div class="flex flex-col justify-center">
      <div class="justify-center w-fit px-2 py-1 text-xs font-semibold leading-5 text-teal-500 uppercase whitespace-nowrap rounded-sm border border-teal-500 border-dashed">
        {{ code }}
      </div>
      <div class="mt-1.5 font-medium leading-[157%] text-neutral-800">
        Save {{ savings }}
      </div>
      <div class="mt-1.5 font-light leading-6 text-zinc-500">
        {{ description }}<br />Expires on: {{ expiryDate }}
      </div>
    </div>
    <button
      :class="{
        'justify-center self-start px-3.5 py-2.5 font-semibold whitespace-nowrap rounded-sm min-w-[80px]': true,
        'text-teal-500 bg-white border border-teal-500 border-solid': isApplied,
        'text-white bg-teal-500': !isApplied
      }"
    >
      {{ isApplied ? 'Remove' : 'Apply' }}
    </button>
  </article>
</template>

<script setup>

import { defineProps } from 'vue';
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  savings: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  isApplied: {
    type: Boolean,
    default: false,
  },

});

</script>