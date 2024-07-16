<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useBindleApiStore} from "@/store/bindle-api.js";
import Bundle from "@/views/shared/Bundle.vue";
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Slide, Navigation } from 'vue3-carousel'
import {useWindowSize} from "@vueuse/core";

const route = useRoute();

const bindleApiStore = useBindleApiStore();
const popularBundles = ref([]);
const levelName = ref(null);
const levelFilter = ref(null);

const props = defineProps({
    class: { type:[String,Array,Object], default:null },
    style: { type:[String, Object], default:null },
})

onMounted(async () => {
    await bindleApiStore.getLevels();
    await bindleApiStore.getBundles();
    const level = bindleApiStore.getLevelBySlug(route.name);
    levelFilter.value = route.name==='generic-level' ? route.params.level : level.slug;
    levelName.value = level.name;
    popularBundles.value = await bindleApiStore.getPopularBundles(6, null, levelFilter.value);
});

const getPopularBundles = computed(()=> {
    return popularBundles.value.length>0
        ? popularBundles.value
        : Object.assign(new Array(5), null)
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
    <div class="recommended-bundles" v-if="popularBundles.length>0">
        <h2>Recommended {{ levelName }} Bundles</h2>
        <carousel  class="py-2"  :transition="1000" :wrap-around="true" :autoplay="6000" :items-to-show="itemsToShow">
            <slide v-for="(bundle,idx) in getPopularBundles" :key="idx">
                <bundle :bundle="bundle" class="max-w-full" />
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