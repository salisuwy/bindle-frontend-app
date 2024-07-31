<script setup>
import {ref, onBeforeMount, computed} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Slide, Navigation } from 'vue3-carousel'
import Book from "@/views/shared/Book.vue";
import {useWindowSize} from "@vueuse/core";
import Bundle from "@/views/shared/Bundle.vue";


const props = defineProps({
    title: {type: String, default: 'Popular Products'},
    count: {type:Number,default:8},
    level_id: {type: String, default: null},
    subject_id: {type: String, default: null},
    use_carousel: {type: Boolean, default: true},
})

const loaded = ref(false);

const bindleApiStore = useBindleApiStore();
const products = ref([]);
onBeforeMount(() => {
    bindleApiStore.getPopularBooks(props.count, props.level_id, props.subject_id).then((results) => {
        products.value = results
        loaded.value = true
    })
})


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

</script>
<template>
    <div class="py-4 max-w-8xl mx-auto" v-if="products.length>0">
        <h2 class="text-4xl my-4">{{ props.title }}</h2>
        <carousel v-if="props.use_carousel" class="py-2"  :transition="1000" :wrap-around="true" :items-to-show="itemsToShow">
            <slide v-for="(product, index) in products" :key="index" class="bg-theme-white">
                <book :product="product"/>
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
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 max-w-screen-xl mx-auto">
            <div v-for="(product, index) in products" :key="index" class="bg-theme-white">
                <book :product="product" />
            </div>
        </div>
    </div>
</template>
<style scoped>
.carousel__slide {
    border-left: 8px solid white;
    border-right: 8px solid white;
}
</style>