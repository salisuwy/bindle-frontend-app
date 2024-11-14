<script setup>
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import { computed, onMounted, ref } from "vue";
import { Util } from "@/components/helpers/Util.js";
import { useBindleApiStore } from "@/store/bindle-api.js";
import { toast } from "vue3-toastify";
import { trackEvent } from "../../components/helpers/analytics";
import { useMutation, useQueryClient, useQuery } from "@tanstack/vue-query";
import { addToCart, setUuid, getOrderCart } from "@/store/cart-api";
import AddToCartErrorNotification from "../shop/components/AddToCartErrorNotification.vue";
import AddToCartNotification from "../shop/components/AddToCartNotification.vue";
import SpinnerIcon from "../../components/icons/SpinnerIcon.vue";

const props = defineProps({
  bundle: { type: Object },
  fullWidthButton: { type: Boolean, default: true },
  useRowLayout: { type: Boolean, default: false },
});

// CART OPERATIONS
const queryClient = useQueryClient();

const { data: order } = useQuery({
  queryKey: ["cartItems"],
  queryFn: getOrderCart,
});

const ebookSelected = props.bundle["is_ebook"] ? true : false;

const bundleStock = computed(() => {
  return order.value?.order?.bundle_stock ?? {};
});

const itemsInStock = computed(() => {
  if (props.bundle === null || bundleStock.value === null) {
    return 0;
  }

  if (props.bundle["id"] in bundleStock.value) {
    return bundleStock.value[props.bundle["id"]];
  }
  return props.bundle["quantity_in_stock"];
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
  const item_id = props.bundle["id"];
  const item_name = props.bundle["title"];
  const item_type = "bundle";
  const currency = "GBP";
  const is_ebook = props.bundle["is_ebook"] ? true : false;
  const value = Util.toFixedDisplay(
    props.bundle["is_ebook"]
      ? props.bundle["price_ebook"]
      : props.bundle["price_amount"],
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
const slug = computed(() => {
  return Util.snakeCase(props.bundle["title"]);
});
const getClasses = computed(() => {
  let classes = ["bindle", "w-full", "h-full", "grid"];
  if (props.useRowLayout) {
    classes.push("grid-cols-2", "auto-rows-min", "md:grid-cols-1");
  } else {
    classes.push("grid-cols-1", "auto-rows-min");
  }
  return classes;
});

const bookImageUrlsById = ref({});

onMounted(async () => {
  await bindleApiStore.getBooks();
  Object.values(bindleApiStore.books).forEach((book) => {
    bookImageUrlsById.value[book.id] = Util.ensureSsl(book.image_url);
  });
});

const getBundleType = computed(() => {
  return props.bundle.is_core_bundle ? "CORE BUNDLE" : "BUNDLE";
});

const getImagesClass = (book_ids) => {
  if (book_ids.length === 3) {
    const type = 1 + ((book_ids[0] + book_ids[1] + book_ids[2]) % 3);
    return "three-images three-images-" + type;
  } else {
    return "images";
  }
};
</script>
<template>
  <div
    v-if="props.bundle"
    :class="getClasses"
    class="group py-4 bg-white hover:bg-slate-50"
  >
    <div class="col-start-1 row-start-1">
      <div
        class="relative h-72 bg-white group-hover:bg-slate-50 overflow-hidden"
      >
        <img
          :src="bundle?.image_url?.thumb"
          :alt="bundle?.title"
          class="w-full h-full object-contain object-center aspect-auto"
        />
        <!-- <img
          v-for="(book_id, index) in props.bundle['book_ids']"
          :key="index"
          draggable="false"
          :src="bookImageUrlsById[book_id]"
          alt="book"
          class="h-40 w-auto"
        /> -->
      </div>
    </div>
    <div
      :class="
        props.useRowLayout
          ? 'px-4 col-start-2 row-start-1 md:px-0 md:col-start-1 md:row-start-2'
          : 'px-4 col-start-1 row-start-2'
      "
    >
      <div class="text-theme-navyblue font-bold text-left pt-4 pb-2">
        {{ getBundleType }}
      </div>

      <div class="flex gap-4 justify-center items-center flex-wrap my-4">
        <router-link
          :to="'/bundles/' + slug"
          class="bg-white hover:bg-zinc-50 text-theme-teal border border-theme-teal text-center buttonlike w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
          draggable="false"
          >View Product
        </router-link>
        <button
          class="bg-theme-teal rounded-none hover:bg-teal-400 w-auto w-min-[140px] flex-shrink-0 flex-grow inline-block"
          @click="addToBasket"
          :disabled="isPending || (!ebookSelected && itemsInStock <= 0)"
        >
          <!-- {{ itemsInStock }} - {{ bundle.quantity_in_stock }} -->
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
        class="text-2xl text-left font-normal my-4 md:line-clamp-2"
        :title="props.bundle['name']"
      >
        <router-link class="font-normal" :to="'/bundles/' + slug">
          {{ props.bundle["title"] }}
        </router-link>
      </p>

      <div class="flex justify-start items-center gap-2">
        <span
          v-if="props.bundle['is_ebook']"
          class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap rounded-sm bg-gray-200"
        >
          E-book
        </span>
        <span
          class="justify-center self-start px-2.5 py-2 mt-2 text-xs text-gray-600 whitespace-nowrap bg-gray-200 rounded-sm"
          :class="{ 'text-gray-500': props.bundle['quantity_in_stock'] > 0 }"
        >
          Paperback
        </span>
      </div>

      <div class="text-left text-theme-darkgray">From:</div>
      <div class="flex flex-col 2xs:flex-row flex-wrap items-start gap-4 mx-2">
        <div
          :class="
            'flex items-end ' +
            (props.useRowLayout
              ? 'flex-col xs:gap-4 xs:flex-row'
              : 'flex-row gap-4')
          "
        >
          <div class="text-3xl">
            <router-link :to="'/bundles/' + slug">
              £{{
                Util.toFixedDisplay(
                  props.bundle["is_ebook"]
                    ? props.bundle["price_ebook"]
                    : props.bundle["price_amount"],
                  2
                )
              }}
            </router-link>
          </div>
          <div class="line-through text-theme-darkgray">
            £{{
              Util.toFixedDisplay(
                props.bundle["is_ebook"]
                  ? props.bundle["price_ebook_total_of_books"]
                  : props.bundle["price_total_of_books"],
                2
              )
            }}
          </div>
        </div>
        <div
          v-if="!props.fullWidthButton"
          class="text-right grow"
          draggable="false"
        >
          <router-link
            :to="'/bundles/' + slug"
            class="text-theme-teal whitespace-nowrap"
            draggable="false"
            >View Product
            <chevron-icon right width="12px" height="12px" class="inline"
          /></router-link>
        </div>
      </div>
    </div>
    <div
      v-if="props.fullWidthButton"
      :class="
        'hidden hover:block py-4 mt-4 mb-8 text-center ' +
        (props.useRowLayout
          ? 'col-start-1 col-span-2 row-start-2 md:col-span-1 md:row-start-3'
          : 'row-start-3')
      "
    >
      <router-link
        :to="'/bundles/' + slug"
        class="bg-theme-teal text-white buttonlike w-full inline-block"
        draggable="false"
        >View Product
        <chevron-icon right width="12px" height="12px" class="inline"
      /></router-link>
    </div>
  </div>
  <div v-else class="working-spinner">loading...</div>
</template>
<style scoped>
.three-images-1 img {
  position: absolute;
  top: 20px;
}
.three-images-1 img:nth-child(1) {
  transform: rotate(-5deg);
  left: 5%;
}
.three-images-1 img:nth-child(2) {
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  top: 30%;
  z-index: 100;
}
.three-images-1 img:nth-child(3) {
  transform: rotate(5deg);
  right: 5%;
}

.three-images-2 img {
  position: absolute;
  top: 20px;
}
.three-images-2 img:nth-child(1) {
  transform: rotate(-5deg);
  left: 5%;
  top: 30%;
}
.three-images-2 img:nth-child(2) {
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  z-index: 100;
}
.three-images-2 img:nth-child(3) {
  transform: rotate(5deg);
  right: 5%;
  top: 30%;
}

.three-images-3 img {
  position: absolute;
  top: 20px;
}
.three-images-3 img:nth-child(1) {
  transform: scale(0.8);
  left: -10%;
  top: 30%;
}
.three-images-3 img:nth-child(2) {
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  top: 30%;
  z-index: 100;
}
.three-images-3 img:nth-child(3) {
  transform: scale(0.8);
  right: -10%;
  top: 30%;
}

.images img {
  position: absolute;
  top: 0;
  left: 5%;
}
.images img:hover,
.three-images img:hover {
  z-index: 101;
}
.images img:nth-child(1) {
  top: 20px;
  left: 10%;
}
.images img:nth-child(2) {
  top: 40px;
  left: 15%;
}

.images img:nth-child(3) {
  top: 60px;
  left: 20%;
}
.images img:nth-child(4) {
  top: 80px;
  left: 25%;
}
.images img:nth-child(5) {
  top: 100px;
  left: 30%;
}
.images img:nth-child(6) {
  top: 120px;
  left: 35%;
}
</style>
