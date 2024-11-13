<script setup>
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import { Util } from "@/components/helpers/Util.js";
import { onMounted, ref, computed } from "vue";
import { useBindleApiStore } from "@/store/bindle-api.js";
import { toast } from "vue3-toastify";
import { trackEvent } from "../../components/helpers/analytics";
import { useMutation, useQueryClient, useQuery } from "@tanstack/vue-query";
import { addToCart, setUuid, getOrderCart } from "@/store/cart-api";
import AddToCartErrorNotification from "../shop/components/AddToCartErrorNotification.vue";
import AddToCartNotification from "../shop/components/AddToCartNotification.vue";
import SpinnerIcon from "../../components/icons/SpinnerIcon.vue";

const props = defineProps({
  product: { type: Object },
  fullWidthButton: { type: Boolean, default: true },
  mobileFlexRow: { type: Boolean, default: false },
  showBestSeller: { type: Boolean, default: false },
});

// CART OPERATIONS
const queryClient = useQueryClient();

const { data: order } = useQuery({
  queryKey: ["cartItems"],
  queryFn: getOrderCart,
});

const ebookSelected = props.product["is_ebook"] ? true : false;

const bookStock = computed(() => {
  return order.value?.order?.book_stock ?? {};
});

const itemsInStock = computed(() => {
  if (props.product === null || bookStock.value === null) {
    return 0;
  }

  if (props.product["id"] in bookStock.value) {
    return bookStock.value[props.product["id"]];
  }
  return props.product["quantity_in_stock"];
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
  onSuccess: ({ data }) => {
    console.log("mutation success", data);
    setUuid(data?.order?.uuid);
    toast(AddToCartNotification);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["cartItems"]);
  },
});

const addToBasket = () => {
  const item_id = props.product["id"];
  const item_name = props.product["title"];
  const item_type = "book";
  const currency = "GBP";
  const is_ebook = props.product["is_ebook"] ? true : false;
  const value = Util.toFixedDisplay(
    props.product["is_ebook"]
      ? props.product["price_ebook"]
      : props.product["price_amount"],
    2
  );

  trackEvent("addToBasket", { item_id, item_name, value, currency });

  mutate({
    item_type: item_type,
    item_id: item_id,
    is_ebook: is_ebook,
    anonid: localStorage.getItem("anonid"),
    uuid: localStorage.getItem("uuid"),
  });
};

// CART OPERATIONS

const bindleApiStore = useBindleApiStore();
const types = ref(null);
const productTypes = computed(() => {
  const buildTypes = [];
  if (types.value) {
    if (props.product.type_ids.length > 0) {
      for (let idx = 0; idx < props.product.type_ids; idx++) {
        if (props.product.type_ids[idx] in types.value) {
          buildTypes.push(types.value[props.product.type_ids[idx]]);
        }
      }
    } else {
      if (props.product.type_id in types.value) {
        buildTypes.push(types.value[props.product.type_id]);
      }
    }
  }
  return buildTypes;
});

onMounted(async () => {
  await bindleApiStore.getLevels();
  await bindleApiStore.getSubjects();
  await bindleApiStore.getTypes();
  types.value = bindleApiStore.types;
});
</script>
<template>
  <div
    v-if="props.product"
    class="bindle relative w-full h-full flex flex-col overflow-hidden group py-4 px-4 bg-white hover:bg-slate-50"
  >
    <div
      v-if="props.showBestSeller"
      class="uppercase text-sm text-white bg-yellow-500 min-w-[40%] px-4 py-1 absolute left-0 top-0 z-20"
    >
      Best Seller
    </div>

    <div class="image relative bg-white group-hover:bg-slate-50 px-3 py-6 h-72">
      <img
        draggable="false"
        :src="Util.ensureSsl(props.product['image_url'])"
        :alt="props.product['title']"
        class="max-h-full max-w-full w-full h-auto object-contain object-center mx-auto"
      />
      <!-- class="max-h-full max-w-3/4 w-auto h-auto mx-auto" -->
    </div>
    <div class="text-theme-navyblue font-bold text-left pt-4 pb-2 h-12">
      <div v-for="type in productTypes" :key="type" class="uppercase">
        {{ type["name"] }}
      </div>
    </div>

    <div class="flex gap-4 justify-center items-center flex-wrap my-4">
      <router-link
        :to="product.product_url"
        class="bg-white text-theme-teal border border-theme-teal text-center buttonlike w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
        draggable="false"
        >View Product
      </router-link>
      <button
        class="bg-theme-teal rounded-none hover:bg-teal-400 w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
        @click="addToBasket"
        :disabled="isPending || (!ebookSelected && itemsInStock <= 0)"
      >
        <!-- <span>{{ itemsInStock }}</span> -->
        <span v-if="!isPending && (ebookSelected || itemsInStock > 0)">
          Add to Cart
        </span>
        <span v-if="!isPending && !ebookSelected && itemsInStock <= 0">
          Out of stock
        </span>
        <span v-if="isPending" class="flex gap-4 justify-center items-center">
          <SpinnerIcon class="w-5 h-5 text-white" />
          Adding...
        </span>
      </button>
    </div>

    <p
      class="text-2xl text-left font-normal mt-1 mb-5 line-clamp-2"
      :title="props.product['title']"
    >
      <router-link :to="product.product_url" class="font-normal">
        {{ props.product["title"] }}
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
        <router-link :to="product.product_url">
          £{{
            Util.toFixedDisplay(
              props.product["is_ebook"]
                ? props.product["price_ebook"]
                : props.product["price_amount"],
              2
            )
          }}
        </router-link>
      </div>
      <!-- <div v-if="!props.fullWidthButton" class="text-right grow">
        <router-link
          v-if="product.product_url"
          :to="product.product_url"
          class="text-theme-teal"
          >View Product
          <chevron-icon right width="12px" height="12px" class="inline" />
        </router-link>
        <div v-else class="working-spinner">
          View Product
          <chevron-icon right width="12px" height="12px" class="inline" />
        </div>
      </div> -->
    </div>
    <!-- <div
      v-if="props.fullWidthButton"
      :class="
        'py-4 mt-4 mb-8 text-center ' +
        (props.mobileFlexRow
          ? 'col-start-1 col-span-2 row-start-2 md:col-span-1 md:row-start-3'
          : 'row-start-3')
      "
    >
      <router-link
        v-if="product.product_url"
        :to="product.product_url"
        class="bg-theme-teal text-white buttonlike w-full inline-block whitespace-nowrap"
        draggable="false"
      >
        View Product
        <chevron-icon right width="12px" height="12px" class="inline" />
      </router-link>
      <a
        v-else
        class="bg-theme-teal text-white buttonlike w-full inline-block opacity-50"
        >View Product</a
      >
    </div> -->
  </div>
  <div v-else class="working-spinner">loading...</div>
</template>
