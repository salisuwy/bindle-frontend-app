<script setup>
import { computed, watch } from "vue";
import CartItem from "./CartItem.vue";
import { defineProps, defineEmits } from "vue";
import clsx from "clsx";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const props = defineProps({
  items: Array,
  bookStock: Object,
  bundleStock: Object,
  editable: Boolean,
  title: {
    type: String,
    default: "My Cart",
  },
  showTotalItemsCount: { type: Boolean, default: false },
  showScrollBar: { type: Boolean, default: false },
  orderId: { type: String, default: "" },
  cssClasses: { type: String, default: "" },
});


const cartItemsCount = computed(() => {
  const items = props.items ?? [];
  return items.reduce((acc, item) => acc + item.quantity, 0);
});

const mergedCssClass = computed(() => {
  console.log("props.cssClasses", props.cssClasses);
  const merged = clsx(
    "flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full",
    props.cssClasses
  );
  console.log("merged", merged);
  return merged;
});

</script>

<template>
  <div
    :class="
      clsx(
        'flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-0 max-md:max-w-full',
        props.cssClasses
      )
    "
  >
    <header
      class="flex gap-2 items-center self-start pt-2.5 pb-0.5 font-medium"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">{{ props.title }}</h1>
      <span
        class="text-sm leading-5 text-teal-500"
        v-if="
          props.items.length > 0 &&
          (props.editable || props.showTotalItemsCount)
        "
        >({{ cartItemsCount }} Item{{ cartItemsCount > 1 ? "s" : "" }})</span
      >
    </header>
    <p v-if="props.orderId && props.orderId.trim().length > 0" class="text-gray-400">Order ID: {{ props.orderId }}</p>
    <hr class="mt-4 h-px border border-zinc-200" />
    <template v-if="props.showScrollBar">
      <PerfectScrollbar class="px-2">
        <CartItem
          v-for="(item, index) in props.items"
          :key="index"
          :item="item"
          :bookStock="props.bookStock"
          :bundleStock="props.bundleStock"
          :editable="editable"
        />
      </PerfectScrollbar>
    </template>
    <template v-else>
      <CartItem
        v-for="(item, index) in props.items"
        :key="index"
        :item="item"
        :bookStock="props.bookStock"
        :bundleStock="props.bundleStock"
        :editable="editable"
      />
    </template>
  </div>
</template>

<style>
@import "vue3-perfect-scrollbar/style.css";

.ps {
  max-height: 500px;
}

@media screen and (max-width: 768px) {
  .ps {
    max-height: 100vh;
  }
}
</style>
