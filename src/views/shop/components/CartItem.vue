<template>
  <div class="flex gap-5 justify-between my-6 w-full max-sm:flex-wrap max-sm:max-w-full">
    <div class="flex gap-4 max-md:flex-wrap">
      <CartItemImage
        class="w-[55%] sm:aspect-[0.72] sm:w-[78px]"
        :itemType="item.item_type"
        :title="item.title"
        :slug="item.slug"
        :outOfStock="itemsInStock === 0"
      />
      <div class="flex flex-col justify-start max-md:max-w-full">
        <span
          class="text-xs font-bold text-cyan-800 uppercase max-md:max-w-full"
          :class="{ 'text-gray-500': itemsInStock === 0 }"
        >
          {{ item.item_type }}
        </span>
        <h2
          class="mt-2 text-base text-zinc-950 max-md:max-w-full"
          :class="{ 'text-gray-500': itemsInStock === 0 }"
        >
          {{ item.title }}
        </h2>
        <div class="flex gap-2 items-center">
          <span
            class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm uppercase"
            :class="{ 'text-gray-500': itemsInStock === 0 }"
          >
            {{ item.is_ebook ? 'E-BOOK' : 'PAPERBACK' }}
          </span>
          <span
            v-show="!item.is_ebook && itemsInStock === 0 && editable"
            class="py-1 my-2 font-medium leading-6 text-rose-500"
            >Out of stock</span
          >
        </div>
        <div class="flex gap-4 self-start mt-1.5 font-medium">
          <div class="flex gap-2 text-xl leading-7 justify-start items-center">
            <span v-if="!editable" class="text-zinc-95 text-[16px] mr-5"
              >Quantity: {{ item.quantity }}</span
            >
            <span class="text-zinc-950">&#163;{{ item.discounted_price }}</span>
            <span
              v-if="item.price !== item.discounted_price && editable"
              class="text-zinc-400 line-through"
              >&#163;{{ item.price }}</span
            >
          </div>
          <span v-if="item.discount > 0 && editable" class="text-lg leading-6 text-rose-500">
            ({{ Math.floor(item.discount) }}% OFF)
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="editable"
      class="flex gap-1.5 justify-center self-start text-base font-medium whitespace-nowrap rounded-sm border-2 border-solid bg-stone-100 border-zinc-200 border-opacity-0 text-zinc-950"
    >
      <button
        type="submit"
        :disabled="item.quantity === 0 || isPending"
        @click.prevent="decreaseQuantity"
        class="cursor-pointer py-1.5 px-3 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>

      <span v-if="isPending" class="flex justify-center items-center">
        <SpinnerIcon class="w-6 h-6" />
      </span>
      <span v-if="!isPending" class="py-1.5">{{ item.quantity }}</span>
      <button
        type="submit"
        :disabled="itemsInStock === 0 || isPending || item.is_ebook"
        @click="increaseQuantity"
        class="cursor-pointer py-1.5 px-3 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';
import { toast } from 'vue3-toastify';

import AddToCartErrorNotification from './AddToCartErrorNotification.vue';
import SpinnerIcon from '../../../components/icons/SpinnerIcon.vue';
import CartItemImage from './CartItemImage.vue';

import { addToCart, removeFromCart, setUuid } from '@/store/cart-api';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trackEvent } from '../../../components/helpers/analytics';
import { consoleLog } from '@/components/helpers/tsUtils';

const queryClient = useQueryClient();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  bookStock: {
    type: Object,
    default: () => {},
  },
  bundleStock: {
    type: Object,
    default: () => {},
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const { item } = toRefs(props);

const itemsInStock = computed(() => {
  let count = 0;
  if (item.value.item_type === 'book' && props.bookStock !== undefined) {
    count = item.value.item_id in props.bookStock ? props.bookStock[item.value.item_id] : 0;
  } else if (props.bundleStock !== undefined) {
    count = item.value.item_id in props.bundleStock ? props.bundleStock[item.value.item_id] : 0;
  }
  return count;
});

const { isPending, mutate } = useMutation({
  mutationFn: (args) => (args.operation === 'add' ? addToCart(args) : removeFromCart(args)),
  onMutate: (args) => {},
  onError: (error) => {
    console.error('mutation error', error);
    toast(AddToCartErrorNotification);
  },
  onSuccess: ({ data }) => {
    consoleLog('mutation success', data);
    setUuid(data?.order?.uuid);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cartItems'] });
  },
});

function increaseQuantity() {
  if (itemsInStock.value > 0) {
    trackEvent('addToBasket', {
      item_id: item.value.item_id,
      item_type: item.value.item_type,
      item_name: item.value?.title,
      value: item.value?.discounted_price,
      currency: 'GBP',
    });

    // optimistic update
    item.value.quantity = item.value.quantity + 1;
    mutate({
      operation: 'add',
      item_type: item.value.item_type,
      item_id: item.value.item_id,
      is_ebook: item.value.is_ebook,
    });
  }
}

function decreaseQuantity() {
  if (item.value.quantity > 0) {
    // optimistic update
    item.value.quantity = item.value.quantity - 1;
    mutate({
      operation: 'remove',
      item_type: item.value.item_type,
      item_id: item.value.item_id,
      is_ebook: item.value.is_ebook,
    });
  }
}
</script>
