<script setup>
import {computed, onMounted, ref} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Slide, Navigation } from 'vue3-carousel'
import Bundle from "@/views/shared/Bundle.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import {useWindowSize} from "@vueuse/core";

const { width } = useWindowSize();

const itemsToShow = computed(()=> {
    if (width.value<640) {
        return 1;
    }
    else if (width.value<1024) {
        return 2;
    }
    else if (width.value<1280) {
        return 3;
    }
    else {
        return 4;
    }
})

const props = defineProps({
    level: {type: Object, required: true},
});
const apiBindleStore = useBindleApiStore();
const bundles = ref([]);

onMounted(async () => {
    await apiBindleStore.getBundles();
    bundles.value = await apiBindleStore.getBestsellingBundles(props.level.slug);
    //console.log(bundles.value);
})
</script>
<template>
    <div class="mt-10 mb-2 max-w-8xl mx-auto"  v-if="bundles.length>0">
        <div class="flex flex-row mx-4">
            <div class="text-left flex-1"><h2 >Best-Selling {{ level.name }} Bundles</h2></div>
            <router-link :to="'/bundles/explore?level='+level.slug" class="text-theme-teal">Shop all {{level.name}} Bundles <chevron-icon right width="16px" height="16px" class="inline" /></router-link>
        </div>
        <carousel  class="py-2"  :transition="1000" :wrap-around="true" :autoplay="6000" :items-to-show="itemsToShow">
            <slide v-for="bundle in bundles" :key="bundle.id" >
                <bundle :bundle="bundle" />
            </slide>
            <template #addons>
                <navigation>
                    <template #next>
                        <span>&gt;</span>
                    </template>
                    <template #prev>
                        <span>&lt;</span>
                    </template>
                </navigation>
            </template>
        </carousel>
    </div>
</template>
<style scoped>
.carousel__slide {
    border-left: 8px solid white;
    border-right: 8px solid white;
}
</style>

