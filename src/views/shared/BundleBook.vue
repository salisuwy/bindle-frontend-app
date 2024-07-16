<script setup>
import {computed, onMounted, ref} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import {Util} from "@/components/helpers/Util.js";

const props = defineProps({
    book: {type:Object, required:true}
});
const bindleApiStore = useBindleApiStore();
const types = ref(null);
const level = ref(null);
const subjects = ref(null);
const selectedFormat = ref("Paperback");

const getTypeNames = computed(()=> {
    if (!types.value) return "";
    const typeNames = [];
    Object.values(types.value).forEach((type) => {
        typeNames.push(type.name);
    });
    return typeNames.join(", ");
})

const productUrl = computed(()=> {
    if (!level.value || !subjects.value) {
        return null
    }
    if (props.book.subject_ids.length > 1) {
        return "/" + level.slug + "/subjects/" + props.book.slug;
    } else {
        return  "/"+ level.value.slug + "/" + subjects.value[0].slug + "/" + props.book.slug;
    }
});
const getFormats = computed(()=> {
    const formats = ['Paperback']
    if (props.book.is_ebook) {
        formats.push("E-book");
    }
    return formats;
});

const getPrice = computed(()=> {
    // todo: honour the format's price as soon as David pulls his f***ing finger out
    return Util.toFixedDisplay(props.book.price_amount,2);
})


onMounted(async()=> {
    types.value = await bindleApiStore.getTypesById(props.book.type_ids);
    level.value = await bindleApiStore.getLevelById(props.book.level_id);
    subjects.value = await bindleApiStore.getSubjectsById(props.book.subject_ids);
})
</script>
<template>
    <div class="flex flex-row my-6 items-stretch">
        <div><img :src="props.book.image_url" alt="book image" class="max-h-32"/></div>
        <div class="flex flex-col flex-grow px-4 py-4">
            <div class="flex-grow flex items-center text-theme-darkgray2">1 x {{getTypeNames}}</div>
            <div class="flex-grow flex items-center" v-if="productUrl"><router-link :to="productUrl" class="underline">{{props.book.title}}</router-link></div>
        </div>
        <div class="flex flex-col flex-grow px-4 py-4">
            <div class="flex-grow flex items-center">£{{Util.toFixedDisplay(props.book.price_amount,2)}}</div>
            <div class="flex-grow flex items-center text-theme-darkgray2">
                <div v-if="getFormats.length===1">{{getFormats[0]}}</div>
                <select v-else v-model="selectedFormat">
                    <option v-for="format in getFormats">{{format}}</option>
                </select>
            </div>
        </div>
    </div>
</template>