<script setup lang="ts">
import { computed, watch } from 'vue';

import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Accordion from '@/components/Accordion.vue';
import FeaturedBooksV2 from '@/views/shared/FeaturedBooksV2.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';

import { useBook, useBookDetails } from '@/composables/useBindleData';
import type { Book } from '@/composables/useBindleData';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';

import { trackEvent } from '@/components/helpers/analytics.js';
import { toast } from 'vue3-toastify';
import AddToCartNotification from '@/views/shop/components/AddToCartNotification.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { addToCart, setUuid } from '@/store/cart-api';
import AddToCartErrorNotification from '@/views/shop/components/AddToCartErrorNotification.vue';
import { consoleLog } from '@/components/helpers/tsUtils';

const route = useRoute();
const router = useRouter();
const { book, isLoading, isError } = useBook(computed(() => route.params['book'] as string));
const {
  tags,
  level,
  subject,
  examboard,
  resourceTypes,
  price,
  priceEbook,
  pricePaperback,
  ebookSelected,
  bookImage,
  itemsInStock,
} = useBookDetails(book);

watch([book, level, subject], () => {
  if (book.value === undefined || level.value === undefined || subject.value === undefined) {
    return;
  }
  if (route.params['level'] != level.value.slug || route.params['subject'] != subject.value.slug) {
    router.replace({
      name: 'book',
      params: { level: level.value.slug, subject: subject.value.slug, book: book.value.slug },
    });
  }
});

useHead({
  title: () => `Bindle - Book: ${book.value?.title}`,
});

watch(
  book,
  () => {
    if (book.value !== undefined) {
      trackEvent('viewContent', {
        item_id: book.value.id,
        item_type: 'book',
        item_name: book.value.title,
        value: price.value,
        currency: 'GBP',
      });
    }
  },
  { immediate: true }
);

const queryClient = useQueryClient();
const { isPending, mutate } = useMutation({
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

const addToBasket = (book: Book) => {
  trackEvent('addToBasket', {
    item_id: book.id,
    item_type: 'book',
    item_name: book.title,
    value: price.value,
    currency: 'GBP',
  });

  mutate({
    item_type: 'book',
    item_id: book.id,
    is_ebook: ebookSelected.value,
    anonid: localStorage.getItem('anonid'),
    uuid: localStorage.getItem('uuid'),
  });
};
</script>

<template>
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4 grow" />
          <div
            class="flex flex-row gap-1 md:gap-4 relative -top-2 md:-top-3 ml-auto md:ml-0 whitespace-nowrap"
          >
            <div v-for="tag in tags" :key="tag.id" class="bg-theme-pale px-2 md:px-4 py-2 h-fit">
              {{ tag.name }}
            </div>
          </div>
        </div>
        <template v-if="isLoading"> <div class="w-full h-72 working-spinner"></div></template>
        <template v-else-if="isError">
          <div class="w-full h-72 p-4 flex justify-center items-center">
            <p>Error loading book</p>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col md:flex-row gap-4 w-full">
            <div class="w-full md:w-1/2 p-8 bg-theme-pale relative">
              <img :src="bookImage" alt="product" class="w-4/5 mx-auto md:sticky md:top-12" />
            </div>
            <div class="w-full md:w-1/2 px-8 py-2" v-if="book">
              <h3
                class="inline-block text-theme-navyblue uppercase"
                v-for="type in resourceTypes"
                :key="type.id"
              >
                {{ type.name }}
              </h3>
              <h1>{{ book.title }}</h1>
              <div class="text-3xl font-semibold my-4">&pound;{{ price }}</div>
              <hr />
              <div class="flex flex-row gap-4 my-8">
                <div
                  v-if="book.is_ebook"
                  @click="ebookSelected = true"
                  :class="
                    'format-selector text-center cursor-pointer w-36 border-2 rounded px-8 py-2 ' +
                    (ebookSelected ? 'selected bg-theme-pale border-theme-teal' : '')
                  "
                >
                  <div>E-book</div>
                  <div>&pound; {{ priceEbook }}</div>
                </div>
                <div
                  @click="ebookSelected = false"
                  :class="
                    'format-selector text-center cursor-pointer w-36 border-2 rounded px-8 py-2 ' +
                    (ebookSelected ? '' : 'selected bg-theme-pale border-theme-teal')
                  "
                >
                  <div>Paperback</div>
                  <div>&pound; {{ pricePaperback }}</div>
                </div>
              </div>
              <div class="mb-8">
                <button
                  class="bg-theme-teal w-full rounded"
                  @click="addToBasket(book)"
                  :disabled="isPending || (!ebookSelected && itemsInStock <= 0)"
                >
                  <span v-if="!isPending && (ebookSelected || itemsInStock > 0)">
                    Add to basket - &pound;{{ price }}
                  </span>
                  <span v-if="!isPending && !ebookSelected && itemsInStock <= 0">
                    Out of stock
                  </span>
                  <span v-if="isPending" class="flex gap-4 justify-center items-center">
                    <SpinnerIcon class="w-5 h-5 text-white" />
                    Adding to basket...
                  </span>
                </button>
              </div>

              <div>
                <h2>Get this in a bundle and save money</h2>
              </div>

              <div class="my-6" v-if="book">
                <Accordion
                  content-class="text-sm text-theme-darkgray2 mt-2"
                  title-class="linklike"
                  indicator-class="float-right"
                  open
                >
                  <template #title
                    ><h3 class="inline-block text-2xl">Product Description</h3></template
                  >
                  <template #indicator><chevron-icon down class="inline-block" /></template>
                  <div>
                    {{ book.description ?? '' }}
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
                  <template #indicator><chevron-icon down class="inline-block" /></template>
                  <table class="info">
                    <tr>
                      <td>Level</td>
                      <td>{{ level?.name }}</td>
                    </tr>
                    <tr>
                      <td>Exam Board</td>
                      <td>{{ examboard?.name }}</td>
                    </tr>
                    <tr>
                      <td>Subject</td>
                      <td>{{ subject?.name }}</td>
                    </tr>
                    <tr>
                      <td>Type(s)</td>
                      <td>{{ resourceTypes?.map((t) => t.name).join(', ') }}</td>
                    </tr>
                  </table>
                </Accordion>
              </div>
            </div>
          </div>
        </template>
        <FeaturedBooksV2 title="Recommended Resources" />
      </div>
    </div>
  </LayoutV2>
</template>

<style scoped></style>
