<template>
  <div
    class="flex gap-5 justify-between my-6 w-full flex-wrap max-w-full"
  >
    <div class="flex gap-4">
      <img
        :src="item.images[0]"
        :alt="item.title"
        class="shrink-0 object-contain object-center aspect-[0.72] w-[78px]"
        :class="{
          'opacity-75 mix-blend-multiply': item.quantity_in_stock === 0,
        }"
      />
      <div class="flex flex-col items-start justify-between max-md:max-w-full">
        <span
          class="text-xs font-bold text-cyan-800 uppercase max-md:max-w-full"
          :class="{ 'text-gray-500': item.quantity_in_stock === 0 }"
        >
            <!-- {{ item.type ? item.type : "MIXED" }} -->
            {{ item.item_type }}
        </span>
        <h2
          class="mt-2 text-sm sm:text-base text-zinc-950 max-w-full text-wrap text-left"
          :class="{ 'text-gray-500': item.quantity_in_stock === 0 }"
        >
        <!-- <router-link :to="'/bundles/'+item.slug" > -->
          {{ item.title }}
          <!-- </router-link> -->
        </h2>
        <div class="flex gap-2 items-center">
          <span
            class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm uppercase"
            :class="{ 'text-gray-500': item.quantity_in_stock === 0 }"
          >
            <!-- {{ item.item_type }} -->
            {{ item.is_ebook ? 'E-BOOK' : "PAPERBACK" }}
          </span>
          <span class="text-zinc-95 text-[16px] ml-5"
              >Quantity: {{ item.quantity }}</span
            >
          <span
            v-show="!item.is_ebook && item.quantity_in_stock === 0"
            class="py-1 my-2 font-medium leading-6 text-rose-500"
            >Out of stock</span
          >
        </div>
        <div class="flex gap-4 self-start mt-1.5 font-medium">
          <div class="flex gap-2 text-sm sm:text-xl leading-7 justify-start items-center">
            
            <span class="text-zinc-950">&#163;{{ item.discounted_price }}</span>
            <span
              v-if="item.price !== item.discounted_price"
              class="text-zinc-400 line-through"
              >&#163;{{ item.price }}</span
            >
          </div>
          <span
            v-if="item.discount > 0"
            class="text-sm sm:text-lg leading-6 text-rose-500"
          >
            ({{ Math.floor(item.discount) }}% OFF)
          </span>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { defineProps, ref, toRefs, computed } from "vue";


const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const { item } = toRefs(props);



</script>
