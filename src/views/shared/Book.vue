<script setup>
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import {Util} from "@/components/helpers/Util.js";
import {onMounted, ref, computed} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";

const props = defineProps({
    product: {type: Object},
    fullWidthButton: {type: Boolean, default: true},
    mobileFlexRow: {type: Boolean, default: false}
});
const bindleApiStore = useBindleApiStore();
const types =  ref(null)
const productTypes = computed(()=> {
    const buildTypes=[];
    if ( types.value) {
        if (props.product.type_ids.length>0) {
            for (let idx = 0; idx < props.product.type_ids; idx++) {
                if (props.product.type_ids[idx] in types.value) {
                    buildTypes.push(types.value[props.product.type_ids[idx]]);
                }
            }
        }
        else {
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
    <div v-if="props.product" class="bindle w-full h-full flex flex-col overflow-hidden">
        <div class="image relative bg-theme-pale px-4 py-6 h-72">
            <img draggable="false" :src="Util.ensureSsl(props.product['image_url'])" :alt="props.product['title']" class="max-h-full max-w-3/4 w-auto h-auto mx-auto"/>
        </div>
        <div class="text-theme-navyblue font-bold text-left pt-4 pb-2 h-12">
            <div v-for="(type) in productTypes" :key="type">{{type['name']}}</div>
        </div>
        <h3 class="text-2xl text-left font-normal h-16 line-clamp-2" :title="props.product['title']">
            {{ props.product['title'] }}</h3>
        <div class="text-left text-theme-darkgray">From:</div>
        <div class="flex flex-row items-end gap-4">
            <div class="text-3xl">£{{ Util.toFixedDisplay(props.product['price_amount'], 2) }}</div>
            <div v-if="!props.fullWidthButton" class="text-right grow">
                <router-link v-if="product.product_url" :to="product.product_url" class="text-theme-teal">View Product
                    <chevron-icon right width="12px" height="12px" class="inline"/>
                </router-link>
                <div v-else class="working-spinner">View Product
                    <chevron-icon right width="12px" height="12px" class="inline"/>
                </div>
            </div>
        </div>
        <div v-if="props.fullWidthButton"
             :class="'py-4 mt-4 mb-8 text-center ' + (props.mobileFlexRow ? 'col-start-1 col-span-2 row-start-2 md:col-span-1 md:row-start-3' : 'row-start-3') ">
            <router-link v-if="product.product_url" :to="product.product_url" class="bg-theme-teal text-white buttonlike w-full inline-block whitespace-nowrap" draggable="false">
                View Product <chevron-icon right width="12px" height="12px" class="inline"/>
            </router-link>
            <a v-else class="bg-theme-teal text-white buttonlike w-full inline-block opacity-50">View Product</a>
        </div>
    </div>
    <div v-else class="working-spinner">
        loading...
    </div>
</template>
