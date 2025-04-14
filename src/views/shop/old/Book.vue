<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBindleApiStore } from '@/store/bindle-api.js';
import { Util } from '@/components/helpers/Util';
import { trackEvent } from '@/components/helpers/analytics';
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
//import BundleV2 from '@/views/shared/BundleV2.vue';
import Accordion from '@/components/Accordion.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';

import { toast } from 'vue3-toastify';
import AddToCartNotification from './components/AddToCartNotification.vue';
import FeaturedBooks from '@/views/shared/old/FeaturedBooks.vue';
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query';
import { addToCart, setUuid, getOrderCart } from '@/store/cart-api';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import AddToCartErrorNotification from './components/AddToCartErrorNotification.vue';
import { useHead } from '@unhead/vue';

const queryClient = useQueryClient();

const { data: order } = useQuery({
  queryKey: ['cartItems'],
  queryFn: getOrderCart,
});

const bookStock = computed(() => {
  return order.value?.order?.book_stock ?? {};
});

const bindleApiStore = useBindleApiStore();
const route = useRoute();
const book = ref(null);
const bundle = ref(null);
const level = ref(null);
const subjects = ref(null);
const examboard = ref(null);
const types = ref(null);
const bookImage = computed(() => {
  return book.value === null
    ? Util.getPlaceholderBookImage(1)
    : Util.ensureSsl(book.value.image_url);
});
const ebookSelected = ref(book.value && book.value.is_ebook);

const getTags = computed(() => {
  if (
    book.value === null ||
    subjects.value === null ||
    level.value === null ||
    examboard.value === null
  ) {
    return [];
  } else {
    const tags = [];
    tags.push(level.value.name);
    tags.push(examboard.value.name);
    subjects.value.forEach((subject) => {
      tags.push(subject['name']);
    });
    return tags;
  }
});
const getPrice = computed(() => {
  if (book.value === null) return '';
  return ebookSelected.value
    ? Util.toFixedDisplay(book.value.price_ebook, 2)
    : Util.toFixedDisplay(book.value.price_amount, 2);
});

const getSubjectsList = computed(() => {
  return subjects.value ? Util.column(subjects.value, 'name').join(', ') : '';
});

const getTypesList = computed(() => {
  return types.value ? Util.column(types.value, 'name').join(', ') : '';
});

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
  trackEvent('addToBasket', {
    item_id: book.value?.id,
    item_type: 'book',
    item_name: book.value?.title,
    value: getPrice.value,
    currency: 'GBP',
  });

  mutate({
    item_type: 'book',
    item_id: book.value?.id,
    is_ebook: ebookSelected.value,
    anonid: localStorage.getItem('anonid'),
    uuid: localStorage.getItem('uuid'),
  });
};

const prepBook = async () => {
  const slug = route.path.split('/').slice(-1)[0];
  book.value = await bindleApiStore.fetchBookBySlug(slug);
  ebookSelected.value = book.value && book.value.is_ebook;
  level.value = await bindleApiStore.getLevelById(book.value.level_id);
  subjects.value = await bindleApiStore.getSubjectsById(book.value.subject_ids);
  examboard.value = await bindleApiStore.getExamboardById(book.value.examboard_id);
  types.value = await bindleApiStore.getTypesById([book.value.type_id]);
  bundle.value = await await bindleApiStore.getRandomBundles(1)[0];
};

watch(
  () => route.path,
  () => {
    prepBook();
  }
);

useHead({
  title: () => `Bindle - Book: ${book.value?.title}`,
});

onMounted(async () => {
  await prepBook();

  // Track page view
  // TODO: Add subject, level and examboard
  // console.log(">>> BOOK: ", book.value);
  trackEvent('viewContent', {
    item_id: book.value?.id,
    item_type: 'book',
    item_name: book.value?.title,
    value: getPrice.value,
    currency: 'GBP',
  });
});

const itemsInStock = computed(() => {
  if (!book.value === null || bookStock.value === null) {
    return 0;
  }

  if (book.value.id in bookStock.value) {
    return bookStock.value[book.value.id];
  }
  return book.value.quantity_in_stock;
});
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
            <div v-for="tag in getTags" class="bg-theme-pale px-2 md:px-4 py-2 h-fit">
              {{ tag }}
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4 w-full">
          <div class="w-full md:w-1/2 p-8 bg-theme-pale relative">
            <img :src="bookImage" alt="product" class="w-4/5 mx-auto md:sticky md:top-12" />
          </div>
          <div class="w-full md:w-1/2 px-8 py-2" v-if="book">
            <h3 class="inline-block text-theme-navyblue uppercase" v-for="type in types">
              {{ type.name }}
            </h3>
            <h1>{{ book.title }}</h1>
            <div class="text-3xl font-semibold my-4">&pound;{{ getPrice }}</div>
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
                <div>&pound; {{ Util.toFixedDisplay(book.price_ebook, 2) }}</div>
              </div>
              <div
                @click="ebookSelected = false"
                :class="
                  'format-selector text-center cursor-pointer w-36 border-2 rounded px-8 py-2 ' +
                  (ebookSelected ? '' : 'selected bg-theme-pale border-theme-teal')
                "
              >
                <div>Paperback</div>
                <div>&pound; {{ Util.toFixedDisplay(book.price_amount, 2) }}</div>
              </div>
            </div>
            <div class="mb-8">
              <button
                class="bg-theme-teal w-full rounded"
                @click="addToBasket()"
                :disabled="isPending || (!ebookSelected && itemsInStock <= 0)"
              >
                <!-- {{ itemsInStock }} - {{ book.quantity_in_stock }} -->

                <span v-if="!isPending && (ebookSelected || itemsInStock > 0)">
                  Add to basket - &pound;{{ getPrice }}
                </span>
                <span v-if="!isPending && !ebookSelected && itemsInStock <= 0"> Out of stock </span>
                <span v-if="isPending" class="flex gap-4 justify-center items-center">
                  <SpinnerIcon class="w-5 h-5 text-white" />
                  Adding to basket...
                </span>
              </button>
            </div>

            <div v-if="bundle">
              <h2>Get this in a bundle and save money</h2>
            </div>

            <div class="my-6" v-if="book">
              <accordion
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
              </accordion>
            </div>

            <hr />

            <div class="my-6" v-if="examboard">
              <accordion
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
                    <td>{{ level.name }}</td>
                  </tr>
                  <tr>
                    <td>Exam Board</td>
                    <td>{{ examboard.name }}</td>
                  </tr>
                  <tr>
                    <td>Subject(s)</td>
                    <td>{{ getSubjectsList }}</td>
                  </tr>
                  <tr>
                    <td>Type(s)</td>
                    <td>{{ getTypesList }}</td>
                  </tr>
                </table>
              </accordion>
            </div>

            <!-- <hr />

            <div class="my-6">
              <accordion
                content-class="text-sm text-theme-darkgray2 mt-2"
                title-class="linklike"
                indicator-class="float-right"
              >
                <template #title
                  ><h3 class="inline-block text-2xl">
                    Delivery and returns
                  </h3></template
                >
                <template #indicator
                  ><chevron-icon down class="inline-block"
                /></template>
                <div>Delivery and returns info placeholder</div>
              </accordion>
            </div> -->
          </div>
        </div>

        <featured-books title="Recommended Resources" />
      </div>
    </div>
  </LayoutV2>
</template>
<style scoped></style>
