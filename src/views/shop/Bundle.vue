<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useBindleApiStore } from "@/store/bindle-api.js";
import { Util } from "@/components/helpers/Util.js";
import Layout from "@/views/shared/Layout.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Book from "@/views/shared/Book.vue";
import BundleBook from "@/views/shared/BundleBook.vue";
import Accordion from "@/components/Accordion.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import PlusIcon from "@/components/icons/PlusIcon.vue";
import PopularBundles from "@/views/shared/PopularBundles.vue";
import FeaturedBooks from "@/views/shared/FeaturedBooks.vue";

import { toast } from "vue3-toastify";
import AddToCartNotification from "./components/AddToCartNotification.vue";
import AddToCartErrorNotification from "./components/AddToCartErrorNotification.vue";
import SpinnerIcon from "../../components/icons/SpinnerIcon.vue";
import { useMutation, useQueryClient, useQuery } from "@tanstack/vue-query";
import { addToCart, setUuid, getOrderCart } from "@/store/cart-api";

const queryClient = useQueryClient();

const { data: order } = useQuery({
  queryKey: ["cartItems"],
  queryFn: getOrderCart,
});

const bundleStock = computed(() => {
  return data.value?.order?.bundle_stock ?? {};
});

const route = useRoute();
const bindleApiStore = useBindleApiStore();

const bundle = ref(null);
const books = ref([]);

const getTags = computed(() => {
  if (
    bundle.value === null ||
    bindleApiStore.examboards === null ||
    bindleApiStore.levels === null ||
    bindleApiStore.subjects === null
  ) {
    return [];
  } else {
    const tags = [];
    tags.push(...getLevels.value);
    tags.push(...getExamboards.value);
    tags.push(...getSubjects.value);
    return Util.unique(tags);
  }
});

const getLevels = computed(() => {
  const levels = [];
  if (bundle.value !== null && bindleApiStore.levels !== null) {
    for (let idx = 0; idx < bundle.value.book_ids.length; idx++) {
      const book = bindleApiStore.books[bundle.value.book_ids[idx]];
      if (book.level_id in bindleApiStore.levels) {
        const levelName = bindleApiStore.levels[book.level_id].name;
        if (!(levelName in levels)) {
          levels.push(levelName);
        }
      }
    }
  }
  return levels;
});

const getExamboards = computed(() => {
  const examboards = [];
  if (bundle.value !== null && bindleApiStore.examboards !== null) {
    for (let idx = 0; idx < bundle.value.book_ids.length; idx++) {
      const book = bindleApiStore.books[bundle.value.book_ids[idx]];
      if (book.examboard_id in bindleApiStore.examboards) {
        const examboardName = bindleApiStore.examboards[book.examboard_id].name;
        if (!(examboardName in examboards)) {
          examboards.push(examboardName);
        }
      }
    }
  }
  return examboards;
});

const getSubjects = computed(() => {
  const subjects = [];
  if (bundle.value !== null && bindleApiStore.subjects !== null) {
    for (let idx = 0; idx < bundle.value.book_ids.length; idx++) {
      const book = bindleApiStore.books[bundle.value.book_ids[idx]];
      book.subject_ids.forEach((subject_id) => {
        if (subject_id in bindleApiStore.subjects) {
          const subjectName = bindleApiStore.subjects[subject_id].name;
          if (!(subjectName in subjects)) {
            subjects.push(subjectName);
          }
        }
      });
    }
  }
  return subjects;
});

const getTypes = computed(() => {
  const types = [];
  if (bundle.value !== null && bindleApiStore.types !== null) {
    for (let idx = 0; idx < bundle.value.book_ids.length; idx++) {
      const book = bindleApiStore.books[bundle.value.book_ids[idx]];
      book.type_ids.forEach((type_id) => {
        if (type_id in bindleApiStore.types) {
          const typeName = bindleApiStore.types[type_id].name;
          if (!(typeName in types)) {
            types.push(typeName);
          }
        }
      });
    }
  }
  return types;
});

const getBookTypes = (bookIdx) => {
  const types = [];
  const book_id = bundle.value.books[bookIdx].id;
  bindleApiStore.books[book_id].type_ids.forEach((type_id) => {
    types.push(bindleApiStore.types[type_id].name);
  });
  return types;
};

const getBookUrl = (bookIdx) => {
  const level_id = bundle.value.books[idx].level_id;
  const level = bindleApiStore.levels[level_id];
  const subject_ids = bundle.value.books[idx].subject_ids;
  const subjects = bindleApiStore.getSubjectsById(subject_ids);
  if (subjects.length === 1) {
  }
};

const bundleImages = computed(() => {
  if (bundle.value === null || bundle.value.books.length === 0) {
    return [
      Util.getPlaceholderBookImage(0),
      Util.getPlaceholderBookImage(1),
      Util.getPlaceholderBookImage(2),
    ];
  } else {
    return [
      0 in bundle.value.books
        ? bundle.value.books[0].image_url
        : Util.getPlaceholderBookImage(0),
      1 in bundle.value.books
        ? bundle.value.books[1].image_url
        : Util.getPlaceholderBookImage(1),
      2 in bundle.value.books
        ? bundle.value.books[2].image_url
        : Util.getPlaceholderBookImage(2),
    ];
  }
});

const { isPending, mutate } = useMutation({
  mutationFn: addToCart,
  onMutate: () => {
    console.log("mutating");
  },
  onError: (error) => {
    console.error("mutation error", error);
    toast(AddToCartErrorNotification);
  },
  onSuccess: ({data}) => {
    console.log("mutation success", data);
    setUuid(data?.order?.uuid);
    toast(AddToCartNotification);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["cartItems"]);
  },
});

const addToBasket = () => {
  mutate({
    item_type: "bundle",
    item_id: bundle.value?.id,
    anonid: localStorage.getItem("anonid"),
    uuid: localStorage.getItem("uuid"),
  });
};

onMounted(async () => {
  await bindleApiStore.getBundles();
  const slug = route.path.split("/").slice(-1)[0];
  bundle.value = await bindleApiStore.getBundleBySlug(slug);
  await bindleApiStore.getExamboards();
  await bindleApiStore.getLevels();
  await bindleApiStore.getSubjects();
  await bindleApiStore.getTypes();
  books.value = Object.values(
    await bindleApiStore.getBooksById(bundle.value.book_ids)
  );
  for (let idx = 0; idx < books.value.length; idx++) {
    books.value[idx].url = await bindleApiStore.getBookUrl(books.value[idx].id);
  }
});
</script>
<template>
  <layout>
    <div class="bundle bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <breadcrumbs
            class="text-left w-full col-start-1 md:col-span-4 mb-4 grow"
          />
          <div
            class="flex flex-row gap-1 md:gap-4 relative -top-2 md:-top-3 ml-auto md:ml-0 whitespace-nowrap"
          >
            <div
              v-for="tag in getTags"
              class="bg-theme-pale px-2 md:px-4 py-2 h-fit"
            >
              {{ tag }}
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-4 w-full">
          <div class="w-full md:w-1/2 p-8 relative">
            <div
              class="flex flex-row h-fit sticky top-12 bg-theme-pale w-full py-6"
            >
              <img
                :src="bundleImages[0]"
                alt="book image"
                class="w-1/3 mx-auto scale-70 rotate-5"
              />
              <img
                :src="bundleImages[1]"
                alt="book image"
                class="w-1/3 mx-auto"
              />
              <img
                :src="bundleImages[2]"
                alt="book image"
                class="w-1/3 mx-auto scale-70 -rotate-5"
              />
            </div>
          </div>
          <div v-if="bundle" class="w-full md:w-1/2 p-8">
            <h3 class="text-theme-teal uppercase">
              {{ bundle.is_core_bundle ? "Core " : "" }}Bundle
            </h3>
            <h1>{{ bundle.title }}</h1>
            <div class="text-theme-darkgray mb-4">Bindle Experts</div>
            <div
              v-if="bundle.price_amount < bundle.price_total_of_books"
              class="text-theme-darkgray line-through"
            >
              &pound;{{ Util.toFixedDisplay(bundle.price_total_of_books, 2) }}
            </div>
            <div class="flex flex-row gap-2 my-4 items-end">
              <div class="text-3xl font-semibold">
                &pound;{{ Util.toFixedDisplay(bundle.price_amount, 2) }}
              </div>
              <div v-if="'active_discount' in bundle && bundle.active_discount">
                <div
                  class="bg-red-600 text-white px-2 py-1 relative rounded text-xs"
                  style="top: -6px"
                >
                  {{ bundle.active_discount.percentage }}&percnt;
                </div>
              </div>
            </div>
            <div v-for="book in books" class="my-12">
              <hr />
              <bundle-book :book="book" />
            </div>
            <div class="mb-8">



            <button
                class="bg-theme-teal w-full rounded"
                @click="addToBasket()"
                :disabled="isPending || bundle.quantity_in_stock === 0"
              >
                <span v-if="!isPending && bundle.quantity_in_stock > 0">
                  Add to basket - &pound;{{ Util.toFixedDisplay(bundle.price_amount, 2) }}
                </span>
                <span v-if="!isPending && bundle.quantity_in_stock <= 0">
                  Out of stock
                </span>
                <span v-if="isPending" class="flex gap-4 justify-center items-center">
                  <SpinnerIcon class="w-5 h-5 text-white" />
                  Adding to basket...
                </span>
              </button>
            </div>

            <div class="my-6">
              <accordion
                content-class="text-sm text-theme-darkgray2 mt-2"
                title-class="linklike"
                indicator-class="float-right"
                open
              >
                <template #title
                  ><h3 class="inline-block text-2xl">
                    Product Description
                  </h3></template
                >
                <template #indicator
                  ><chevron-icon down class="inline-block"
                /></template>
                <div>
                  {{ bundle.description }}
                  Currently the bundle descriptions from the database/api are
                  all null.
                </div>
              </accordion>
            </div>

            <hr />

            <div class="my-6">
              <accordion
                content-class="text-sm text-theme-darkgray2 mt-2"
                title-class="linklike"
                indicator-class="float-right"
              >
                <template #title
                  ><h3 class="inline-block text-2xl">
                    Item Specification
                  </h3></template
                >
                <template #indicator
                  ><chevron-icon down class="inline-block"
                /></template>
                <table class="info">
                  <tr>
                    <td>Level{{ getLevels.length > 1 ? "s" : "" }}</td>
                    <td>{{ getLevels.join(", ") }}</td>
                  </tr>
                  <tr>
                    <td>Exam Board{{ getExamboards.length > 1 ? "s" : "" }}</td>
                    <td>{{ getExamboards.join(", ") }}</td>
                  </tr>
                  <tr>
                    <td>Subject{{ getSubjects.length > 1 ? "s" : "" }}</td>
                    <td>{{ getSubjects.join(", ") }}</td>
                  </tr>
                  <tr>
                    <td>Type{{ getTypes.length > 1 ? "s" : "" }}</td>
                    <td>{{ getTypes.join(", ") }}</td>
                  </tr>
                </table>
              </accordion>
            </div>

            <hr />

            <div class="my-6">
              <accordion
                content-class="text-sm text-theme-darkgray2 mt-2"
                title-class="linklike"
                indicator-class="float-right"
              >
                <template #title
                  ><h3 class="inline-block text-2xl">
                    Shipping and returns
                  </h3></template
                >
                <template #indicator
                  ><chevron-icon down class="inline-block"
                /></template>
                <div>Shipping and returns info placeholder</div>
              </accordion>
            </div>
          </div>
        </div>
        <div v-if="bundle" class="w-full text-center my-8">
          <h2 class="text3xl">What's inside?</h2>
          <div class="max-w-2/3 md:w-1/2 mx-auto my-4">
            Tailored for {{ getExamboards.join(" / ") }} Exam Board{{
              getExamboards.length > 0 ? "s" : ""
            }}
            deep dive into {{ getLevels.join(" / ") }}
            {{ getSubjects.join(" / ") }} to ensure you're well prepared for
            exam success.
          </div>
          <div
            class="md:mx-8 flex flex-col md:flex-row items-center justify-center mx-auto gap-4 md:gap-0"
          >
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <img
                :src="bundleImages[0]"
                alt="book image"
                class="w-full h-auto"
              />
              <div></div>
            </div>
            <div class="hidden md:block md:w-1/12">
              <plus-icon class="mx-auto" />
            </div>
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <img
                :src="bundleImages[1]"
                alt="book image"
                class="w-full h-auto"
              />
            </div>
            <div class="hidden md:block md:w-1/12">
              <plus-icon class="mx-auto" />
            </div>
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <img
                :src="bundleImages[2]"
                alt="book image"
                class="w-full h-auto"
              />
            </div>
          </div>
          <div
            v-if="books"
            class="md:mx-8 flex flex-col md:flex-row items-center md:items-start justify-center mx-auto gap-4 md:gap-0 py-4"
          >
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <div v-if="0 in books">
                <div class="text-theme-navyblue">
                  {{ getBookTypes(0).join("/") }}
                </div>
                <div class="mb-4 text-2xl">{{ books[0].title }}</div>
                <router-link
                  v-if="books[0].url"
                  :to="books[0].url"
                  class="text-theme-teal"
                  >View Product</router-link
                >
              </div>
            </div>
            <div class="hidden md:block md:w-1/12"></div>
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <div v-if="1 in books">
                <div class="text-theme-navyblue">
                  {{ getBookTypes(1).join("/") }}
                </div>
                <div class="mb-4 text-2xl">{{ books[1].title }}</div>
                <router-link
                  v-if="books[1].url"
                  :to="books[1].url"
                  class="text-theme-teal"
                  >View Product</router-link
                >
              </div>
            </div>
            <div class="hidden md:block md:w-1/12"></div>
            <div class="w-1/2 md:w-3/12 flex flex-col">
              <div v-if="2 in books">
                <div class="text-theme-navyblue">
                  {{ getBookTypes(2).join("/") }}
                </div>
                <div class="mb-4 text-2xl">{{ bundle.books[2].title }}</div>
                <router-link
                  v-if="books[2].url"
                  :to="books[2].url"
                  class="text-theme-teal"
                  >View Product</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <popular-bundles title="You may also like" />
        <featured-books title="Recommended Resources" />
      </div>
    </div>
  </layout>
</template>
