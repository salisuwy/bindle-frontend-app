<template>
  <article class="flex justify-between items-start gap-2.5 p-2.5" :class="{ 'mt-8': !isApplied }">
    <div class="flex flex-col justify-center"
    :class="{ 'border-red-500': isRemoveCouponError }"
    >
      <div
        class="justify-center w-fit px-2 py-1 text-xs font-semibold leading-5 text-teal-500 uppercase whitespace-nowrap rounded-sm border border-teal-500 border-dashed"
      >
        {{ code }}
      </div>
      <div class="mt-1.5 font-medium leading-[157%] text-neutral-800">
        Save {{ savings }}
      </div>
      <div class="mt-1.5 font-light leading-6 text-zinc-500">
        {{ description }}
        <!-- <br />Expires on: {{ expiryDate }} -->
      </div>
    </div>
    <button
      @click="removeCoupon"
      :class="{
        'justify-center self-start px-3.5 py-2.5 font-semibold whitespace-nowrap rounded-sm min-w-[80px]': true,
        'text-teal-500 bg-white border border-teal-500 border-solid': isApplied,
        'text-white bg-teal-500': !isApplied,
      }"
      :disabled="isPending"
    >
      <span v-if="isPending">
        <SpinnerIcon class="w-6 h-6" />
      </span>
      <span v-else>
        {{ isApplied ? "Remove" : "Apply" }}
      </span>
    </button>
  </article>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
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
    default: "",
  },
  isApplied: {
    type: Boolean,
    default: false,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  isRemoveCouponError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onRemoveCoupon"]);

function removeCoupon() {
  emit("onRemoveCoupon", props.code);
}
</script>
