<script setup>
import { toRef } from 'vue';

import { Util } from '@/components/helpers/Util.js';
import { toast } from 'vue3-toastify';
import { trackEvent } from '../../components/helpers/analytics';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { addToCart, setUuid } from '@/store/cart-api';
import AddToCartErrorNotification from '../shop/components/AddToCartErrorNotification.vue';
import AddToCartNotification from '../shop/components/AddToCartNotification.vue';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';

import { useBookDetails } from '@/composables/useBindleData';

const props = defineProps({
  product: { type: Object },
  fullWidthButton: { type: Boolean, default: true },
  mobileFlexRow: { type: Boolean, default: false },
  showBestSeller: { type: Boolean, default: false },
});

// CART OPERATIONS
// TODO: Factor this out into useCurrentOrder composable
const queryClient = useQueryClient();

const { isPending, mutate } = useMutation({
  mutationFn: addToCart,
  onMutate: () => {
    console.log('mutating');
  },
  onError: (error) => {
    console.error('mutation error', error);
    toast(AddToCartErrorNotification);
  },
  onSuccess: ({ data }) => {
    console.log('mutation success', data);
    setUuid(data?.order?.uuid);
    toast(AddToCartNotification);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cartItems'] });
  },
});

const addToBasket = () => {
  const item_id = props.product['id'];
  const item_name = props.product['title'];
  const item_type = 'book';
  const currency = 'GBP';
  const is_ebook = props.product['is_ebook'] ? true : false;
  const value = Util.toFixedDisplay(
    props.product['is_ebook'] ? props.product['price_ebook'] : props.product['price_amount'],
    2
  );

  trackEvent('addToBasket', {
    item_id: item_id,
    item_type: item_type,
    item_name: item_name,
    value: value,
    currency: currency,
  });

  mutate({
    item_type: item_type,
    item_id: item_id,
    is_ebook: is_ebook,
    anonid: localStorage.getItem('anonid'),
    uuid: localStorage.getItem('uuid'),
  });
};

const { productUrl, ebookSelected, itemsInStock } = useBookDetails(toRef(props, 'product'));
</script>

<template>
  <div
    v-if="product"
    class="bindle relative w-full h-full flex flex-col overflow-hidden group py-4 px-4 bg-white hover:bg-slate-50"
  >
    <div
      v-if="showBestSeller"
      class="uppercase text-sm text-white bg-yellow-500 min-w-[40%] px-4 py-1 absolute left-0 top-0 z-20"
    >
      Best Seller
    </div>

    <div class="image relative bg-white group-hover:bg-slate-50 px-3 py-6 h-72">
      <img
        draggable="false"
        :src="Util.ensureSsl(product['image_url'])"
        :alt="product['title']"
        class="max-h-full max-w-full w-full h-auto object-contain object-center mx-auto"
      />
    </div>
    <div class="text-theme-navyblue font-bold text-left pt-4 pb-2 h-12">
      <div v-for="type in product.types" :key="type.id" class="uppercase">
        {{ type['name'] }}
      </div>
    </div>

    <div class="flex gap-4 justify-center items-center flex-wrap my-4">
      <router-link
        :to="productUrl"
        class="bg-white hover:bg-zinc-50 text-theme-teal border border-theme-teal text-center buttonlike w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
        draggable="false"
        >View Product
      </router-link>
      <button
        class="bg-theme-teal rounded-none hover:bg-teal-400 w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
        @click="addToBasket"
        :disabled="isPending || (!ebookSelected && itemsInStock <= 0)"
      >
        <span v-if="!isPending && (ebookSelected || itemsInStock > 0)"> Add to Cart </span>
        <span v-if="!isPending && !ebookSelected && itemsInStock <= 0"> Out of stock </span>
        <span v-if="isPending" class="flex gap-4 justify-center items-center">
          <SpinnerIcon class="w-5 h-5 text-white" />
          Adding...
        </span>
      </button>
    </div>

    <p class="text-2xl text-left font-normal mt-1 mb-5 line-clamp-2" :title="product['title']">
      <router-link :to="productUrl" class="font-normal">
        {{ product['title'] }}
      </router-link>
    </p>

    <div class="flex justify-start items-center gap-2">
      <span
        v-if="product['is_ebook']"
        class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm"
      >
        E-book
      </span>
      <span
        class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm"
        :class="{ 'text-gray-500': product['quantity_in_stock'] > 0 }"
      >
        Paperback
      </span>
    </div>

    <div class="text-left text-theme-darkgray">From:</div>
    <div class="flex flex-row items-end gap-4">
      <div class="text-3xl">
        <router-link :to="productUrl">
          £{{
            Util.toFixedDisplay(
              product['is_ebook'] ? product['price_ebook'] : product['price_amount'],
              2
            )
          }}
        </router-link>
      </div>
    </div>
  </div>
  <div v-else class="working-spinner">loading...</div>
</template>
