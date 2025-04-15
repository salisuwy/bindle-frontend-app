<script setup lang="ts">
import { computed, watch } from 'vue';

import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

import Accordion from '@/components/Accordion.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import BundleBook from '@/components/product_details/BundleBook.vue';
import BundleWhatsInsideSection from '@/components/product_details/BundleWhatsInside/BundleWhatsInsideSection.vue';
import PopularBundlesV2 from '@/views/shared/PopularBundlesV2.vue';
import FeaturedBooksV2 from '@/views/shared/FeaturedBooksV2.vue';

import AddToCartNotification from '@/views/shop/components/AddToCartNotification.vue';
import AddToCartErrorNotification from '@/views/shop/components/AddToCartErrorNotification.vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

import { Util } from '@/components/helpers/Util.js';
import { trackEvent } from '@/components/helpers/analytics.js';

import { useBundle, useBundleDetails } from '@/composables/useBindleData';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';

import { toast } from 'vue3-toastify';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { addToCart, setUuid } from '@/store/cart-api';
import { consoleLog } from '@/components/helpers/tsUtils';

const route = useRoute();
const { bundle, isError, isLoading } = useBundle(computed(() => route.params['bundle'] as string));
const {
  levels,
  examboards,
  subjects,
  types,
  tags,
  price,
  priceTotalBooks,
  itemsInStock,
  ebookSelected,
} = useBundleDetails(bundle);

useHead({
  title: () => `Bindle - Bundle: ${bundle.value?.title}`,
});

const queryClient = useQueryClient();
const { isPending: isAddToBasketPending, mutate } = useMutation({
  mutationFn: addToCart,
  onMutate: () => {
    consoleLog('mutating');
  },
  onError: (error) => {
    console.error('mutation error', error);
    toast(AddToCartErrorNotification);
  },
  onSuccess: ({ data }) => {
    consoleLog('mutation success', data);
    setUuid(data?.order?.uuid);
    toast(AddToCartNotification);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['cartItems'] });
  },
});

const addToBasket = () => {
  trackEvent('addToBasket', {
    item_id: bundle.value?.id,
    item_type: 'bundle',
    item_name: bundle.value?.title,
    value: price.value,
    currency: 'GBP',
  });

  mutate({
    item_type: 'bundle',
    item_id: bundle.value?.id,
    is_ebook: ebookSelected.value,
    anonid: localStorage.getItem('anonid'),
    uuid: localStorage.getItem('uuid'),
  });
};

watch(
  bundle,
  () => {
    if (bundle.value !== undefined) {
      trackEvent('viewContent', {
        item_id: bundle.value.id,
        item_type: 'bundle',
        item_name: bundle.value.title,
        value: price.value,
        currency: 'GBP',
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <LayoutV2>
    <div class="bundle bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4 grow" />
          <div
            class="flex flex-row gap-1 md:gap-4 relative -top-2 md:-top-3 ml-auto md:ml-0 whitespace-nowrap"
          >
            <div v-for="tag in tags" :key="tag" class="bg-theme-pale px-2 md:px-4 py-2 h-fit">
              {{ tag }}
            </div>
          </div>
        </div>
        <template v-if="isLoading"> <div class="w-full h-72 working-spinner"></div></template>
        <template v-else-if="isError">
          <div class="w-full h-72 p-4 flex justify-center items-center">
            <p>Error loading bundle</p>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col md:flex-row gap-4 w-full">
            <div class="w-full md:w-1/2 p-8 relative">
              <div class="flex flex-row h-fit sticky top-12 bg-theme-pale w-full py-6">
                <img
                  :src="bundle?.image_url?.main"
                  :alt="bundle?.title"
                  class="w-full h-auto object-contain object-center aspect-auto"
                />
              </div>
            </div>
            <div v-if="bundle" class="w-full md:w-1/2 p-8">
              <h3 class="text-theme-teal uppercase">
                {{ bundle.is_core_bundle ? 'Core ' : '' }}Bundle
              </h3>
              <h1>{{ bundle.title }}</h1>
              <div class="text-theme-darkgray mb-4">Bindle Experts</div>
              <div v-if="price < priceTotalBooks" class="text-theme-darkgray line-through">
                &pound;{{ priceTotalBooks }}
              </div>
              <div class="flex flex-row gap-2 my-4 items-end">
                <div class="text-3xl font-semibold">&pound;{{ price }}</div>
                <div v-if="'active_discount' in bundle && bundle.active_discount">
                  <div
                    class="bg-red-600 text-white px-2 py-1 relative rounded text-xs"
                    style="top: -6px"
                  >
                    {{ bundle.active_discount.percentage }}&percnt;
                  </div>
                </div>
              </div>

              <hr />
              <div class="flex flex-row gap-4 my-8">
                <div
                  v-if="bundle.is_ebook"
                  @click="ebookSelected = true"
                  :class="
                    'format-selector text-center cursor-pointer w-36 border-2 rounded px-8 py-2 ' +
                    (ebookSelected ? 'selected bg-theme-pale border-theme-teal' : '')
                  "
                >
                  <div>E-book</div>
                  <div>&pound; {{ Util.toFixedDisplay(bundle.price_ebook, 2) }}</div>
                </div>
                <div
                  @click="ebookSelected = false"
                  :class="
                    'format-selector text-center cursor-pointer w-36 border-2 rounded px-8 py-2 ' +
                    (ebookSelected ? '' : 'selected bg-theme-pale border-theme-teal')
                  "
                >
                  <div>Paperback</div>
                  <div>&pound; {{ Util.toFixedDisplay(bundle.price_amount, 2) }}</div>
                </div>
              </div>
              <div v-for="book in bundle?.books || []" :key="book.id" class="my-12">
                <hr />
                <BundleBook :book="book" :ebookSelected="ebookSelected" />
              </div>

              <div class="mb-8">
                <button
                  class="bg-theme-teal w-full rounded"
                  @click="addToBasket()"
                  :disabled="isAddToBasketPending || (!ebookSelected && itemsInStock <= 0)"
                >
                  <span v-if="!isAddToBasketPending && (ebookSelected || itemsInStock > 0)">
                    Add to basket - &pound;{{ price }}
                  </span>
                  <span v-if="!isAddToBasketPending && !ebookSelected && itemsInStock <= 0">
                    Out of stock
                  </span>
                  <span v-if="isAddToBasketPending" class="flex gap-4 justify-center items-center">
                    <SpinnerIcon class="w-5 h-5 text-white" />
                    Adding to basket...
                  </span>
                </button>
              </div>

              <div class="my-6">
                <Accordion
                  content-class="text-sm text-theme-darkgray2 mt-2"
                  title-class="linklike"
                  indicator-class="float-right"
                  open
                >
                  <template #title
                    ><h3 class="inline-block text-2xl">Product Description</h3></template
                  >
                  <template #indicator><ChevronIcon down class="inline-block" /></template>
                  <div>
                    {{ bundle.description ?? '' }}
                    <!-- Currently the bundle descriptions from the database/api are
                  all null. -->
                  </div>
                </Accordion>
              </div>

              <hr />

              <div class="my-6">
                <Accordion
                  content-class="text-sm text-theme-darkgray2 mt-2"
                  title-class="linklike"
                  indicator-class="float-right"
                >
                  <template #title
                    ><h3 class="inline-block text-2xl">Item Specification</h3></template
                  >
                  <template #indicator><ChevronIcon down class="inline-block" /></template>
                  <table class="info">
                    <tr>
                      <td>Level{{ levels.length > 1 ? 's' : '' }}</td>
                      <td>{{ levels.join(', ') }}</td>
                    </tr>
                    <tr>
                      <td>Exam Board{{ examboards.length > 1 ? 's' : '' }}</td>
                      <td>{{ examboards.join(', ') }}</td>
                    </tr>
                    <tr>
                      <td>Subject{{ subjects.length > 1 ? 's' : '' }}</td>
                      <td>{{ subjects.join(', ') }}</td>
                    </tr>
                    <tr>
                      <td>Type{{ types.length > 1 ? 's' : '' }}</td>
                      <td>{{ types.join(', ') }}</td>
                    </tr>
                  </table>
                </Accordion>
              </div>
            </div>
          </div>
          <BundleWhatsInsideSection
            v-if="bundle"
            :levels="levels"
            :examboards="examboards"
            :subjects="subjects"
            :books="bundle.books"
          />
        </template>

        <PopularBundlesV2 title="You may also like" />
        <FeaturedBooksV2 title="Recommended Resources" />
      </div>
    </div>
  </LayoutV2>
</template>

<style scoped></style>
