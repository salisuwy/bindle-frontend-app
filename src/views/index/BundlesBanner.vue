<script setup>
import {onBeforeMount, ref} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import {Util} from "@/components/helpers/Util.js";

const bindleApiStore = useBindleApiStore();
const bookUrls = ref([
  Util.getPlaceholderBookImage(0),
  Util.getPlaceholderBookImage(1),
  Util.getPlaceholderBookImage(2),
  Util.getPlaceholderBookImage(0),
  Util.getPlaceholderBookImage(1),
  Util.getPlaceholderBookImage(2),
]);
onBeforeMount(() => {
  bindleApiStore.getBooks().then(() => {
    let books = bindleApiStore.books;
    bindleApiStore.getPopularBundles(2).then((bundles) => {
      const book1_ids = bundles[0]['book_ids'];
      const book2_ids = bundles[1]['book_ids'];
      if (book1_ids[0] && (book1_ids[0] in books)) bookUrls.value[0] = Util.ensureSsl(books[book1_ids[0]]['image_url']);
      if (book1_ids[1] && (book1_ids[1] in books)) bookUrls.value[1] = Util.ensureSsl(books[book1_ids[1]]['image_url']);
      if (book1_ids[2] && (book1_ids[2] in books)) bookUrls.value[2] = Util.ensureSsl(books[book1_ids[2]]['image_url']);
      if (book2_ids[0] && (book2_ids[0] in books)) bookUrls.value[3] = Util.ensureSsl(books[book2_ids[0]]['image_url']);
      if (book2_ids[1] && (book2_ids[1] in books)) bookUrls.value[4] = Util.ensureSsl(books[book2_ids[1]]['image_url']);
      if (book2_ids[2] && (book2_ids[2] in books)) bookUrls.value[5] = Util.ensureSsl(books[book2_ids[2]]['image_url']);
    });
  });
})
</script>
<template>
    <div class="bg-theme-teal w-full">
        <div class="max-w-8xl mx-auto overflow-hidden pt-4 pb-12 lg:pb-20 flex flex-col lg:flex-row">
            <div class="grow lg:hidden">&nbsp;</div>
            <div class="rotate-5 flex flex-row px-10 mt-8 mx-auto overflow-hidden lg:grow">
                <div class="w-1/3"><img :src="bookUrls[0]" class="scale-80 ml-auto" alt="book image"/></div>
                <div class="w-1/3"><img :src="bookUrls[1]" class="mx-auto" alt="book image"/></div>
                <div class="w-1/3"><img :src="bookUrls[2]" class="scale-80 mr-auto" alt="book image"/></div>
            </div>
            <div>
                <h3 class="text-theme-white mt-12 lg:text-2xl">BUNDLES. We have lots of them.</h3>
                <p class="px-12 lg:px-2 mt-2 text-theme-white text-sm lg:text-base">Special Core and workbooks bundles,
                subject specific bundles and example level bundles</p>
                <router-link to="/bundles/explore" class="mt-8 mx-auto px-6 py-4 inline-block bg-theme-white rounded-sm">Explore all bundles</router-link>
            </div>
            <div class="rotate-5 hidden xl:flex flex-row px-10 mt-8 mx-auto overflow-hidden xl:grow">
                <div class="w-1/3"><img :src="bookUrls[3]" class="scale-80 ml-auto" alt="book image"/></div>
                <div class="w-1/3"><img :src="bookUrls[4]" class="mx-auto" alt="book image"/></div>
                <div class="w-1/3"><img :src="bookUrls[5]" class="scale-80 mr-auto" alt="book image"/></div>
            </div>
            <div class="grow lg:hidden">&nbsp;</div>
        </div>
    </div>
</template>