<template>
  <div
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full"
  >
    <header
      class="flex gap-2 items-center self-start pt-2.5 pb-0.5 font-medium"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">{{ props.title }}</h1>
      <span class="text-sm leading-5 text-teal-500" v-if="props.items.length > 0 && props.editable"
        >({{ cartItemsCount }} Items)</span
      >
    </header>
    <hr class="mt-4 h-px border border-zinc-200" />
    <CartItem
      v-for="(item, index) in props.items"
      :key="index"
      :item="item"
      :bookStock="props.bookStock"
      :bundleStock="props.bundleStock"
      :editable="editable"
    />
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import CartItem from "./CartItem.vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  items: Array,
  bookStock: Object,
  bundleStock: Object,
  transition: String,
  currentStage: Number,
  editable: Boolean,
  title: {
    type: String,
    default: "My Cart",
  
  },
});

const emit = defineEmits(["setCurrentStage"]);

const transition = computed(() => {
  return props.transition;
});

const cartItemsCount = computed(() => {
  const items = props.items ?? [];
  return items.reduce((acc, item) => acc + item.quantity, 0);
});

watch(transition, (_) => {
  if (props.currentStage === 0) {
    emit("setCurrentStage", 1);
  }
});
</script>
