<script setup>
import {onBeforeMount, ref} from "vue";
import {useBindleApiStore} from "@/store/bindle-api.js";
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel'
import {Util} from "@/components/helpers/Util.js";


const bindleApiStore = useBindleApiStore();
const books = ref([]);
const threeRandomALevelBooks = ref([
    Util.getPlaceholderBookImage(0),
    Util.getPlaceholderBookImage(1),
    Util.getPlaceholderBookImage(2),
]);
const threeRandomGCESLevelBooks = ref([
    Util.getPlaceholderBookImage(0),
    Util.getPlaceholderBookImage(1),
    Util.getPlaceholderBookImage(2),
]);

onBeforeMount(() => {
    bindleApiStore.getBooks().then((data) => {
        books.value = data;
        bindleApiStore.getRandomBooks(3).then((books) => {
            threeRandomGCESLevelBooks.value[0] = books[0].image_url;
            threeRandomGCESLevelBooks.value[1] = books[1].image_url;
            threeRandomGCESLevelBooks.value[2] = books[2].image_url;
        })
        bindleApiStore.getRandomBooks(3).then((books) => {
          threeRandomALevelBooks.value[0] = books[0].image_url;
          threeRandomALevelBooks.value[1] = books[1].image_url;
          threeRandomALevelBooks.value[2] = books[2].image_url;
        })
    })
})

const bookUrl = (level, idx) => {
    idx = Math.min(3, idx)
    if (level === 'gcse') {
        if (threeRandomGCESLevelBooks.value.length > 0 && idx in threeRandomGCESLevelBooks.value) {
            return threeRandomGCESLevelBooks.value[idx]['imgurl']
        } else {
            return Util.getPlaceholderBookImage(idx)
        }
    } else {
        if (threeRandomALevelBooks.value.length > 0 && idx in threeRandomALevelBooks.value) {
            return threeRandomALevelBooks.value[idx]['imgurl']
        } else {
            return Util.getPlaceholderBookImage(idx)
        }
    }
}

</script>
<template>
    <carousel class="homepage-carousel w-full h-fit relative overflow-y-hidden" :transition="1000" :wrap-around="true" :autoplay="7500">
        <slide class="w-full"  style="background:url('/assets/slide1bg.png') no-repeat center center fixed; background-size:cover">
            <div class="carousel-content w-full">
                <h2 class="max-w-sm sm:max-w-md lg:max-w-2xl px-4 mx-auto text-xl md:text-3xl lg:text-5xl xl:text-6xl mt-12 leading-6 text-theme-black">
                    Affordable, bundled study resources
                </h2>
                <p class="max-w-sm sm:max-w-md xl:max-w-2xl mx-auto pointer-none mt-4 md:mt-10 text-sm md:text-lg lg:text-xl xl:text-2xl leading-4 2xs:leading-5 grow">
                    Streamline your GCSE and A-level journey with Bindle.
                    Our carefully curated bundles take the guesswork out of study resources.
                    <strong>Ease and affordability in every bundle</strong>
                </p>
                <div class="grow my-12">
                    <router-link to="/resources/explore" class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded">Shop Now</router-link>
                </div>
            </div>
        </slide>
        <slide class="w-full" style="background:url('/assets/slide2bg.png') no-repeat center center fixed; background-size:cover">
            <div class="carousel-content w-full">
                <h2 class="max-w-sm sm:max-w-md xl:max-w-2xl px-4 mx-auto text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-12 leading-6 text-theme-white">
                    Smart savings with <span style="white-space: nowrap">eco-friendly</span> <span
                    style="white-space: nowrap">E-books</span>
                </h2>
                <p class="max-w-sm sm:max-w-md  xl:max-w-2xl  mx-auto pointer-none mt-4 md:mt-10 text-sm md:text-xl leading-4 2xs:leading-5 text-theme-white grow">
                    Unlock affordability and sustainability with our e-books.
                    Choose our eco-friendly digital options for smart savings.
                    <strong>Quality educations that's kind to your wallet and the planet.</strong>
                </p>
                <div class="grow my-12">
                    <router-link to="/resources/explore" class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded-sm">Shop Now</router-link>
                </div>
            </div>
        </slide>
        <slide class="w-full" style="background-color:#dee6ea !important">
            <div class="carousel-content w-full" >
                <div class="flex flex-row">
                    <div class="hidden sm:block w-3/12 overflow-hidden relative">
                        <img :src="threeRandomGCESLevelBooks[0]" class="absolute rotate-5"
                             style="left:30%;top:20%; width:60%; height:auto"/>
                        <img :src="threeRandomGCESLevelBooks[1]" class="absolute -rotate-5"
                             style="left:-10%;top:30%;width:60%; height:auto"/>
                        <img :src="threeRandomGCESLevelBooks[2]" class="absolute -rotate-5"
                             style="left:30%;top:40%;width:60%; height:auto"/>
                    </div>
                    <div class="w-full sm:w-1/2">
                        <h2 class="max-w-sm sm:max-w-md xl:max-w-2xl px-4 mx-auto text-2xl lg:text-5xl xl:text-6xl mt-12 md:mt-14 lg:mt-24 xl:mt-32 leading-6 text-theme-black">
                            Textbooks, Revision Guides & Exam Workbooks
                        </h2>
                        <p class="max-w-sm sm:max-w-md xl:max-w-2xl mx-auto pointer-none mt-4 md:mt-10 text-sm lg:text-xl leading-4 2xs:leading-5 text-theme-black grow">
                            Master a subject with a comprehensive textbook. grasp essentials with a focused revision guide,
                            and sharpen skills with dedicated exam workbook.
                            <strong>In one place for your success.</strong>
                        </p>
                        <div class="grow my-12 mb-24">
                            <router-link to="/resources/explore" class="buttonlike cursor-pointer inline-block max-w-1/2 px-12 py-3 rounded-sm">Shop Now</router-link>
                        </div>
                    </div>
                    <div class="hidden sm:block w-3/12 overflow-hidden relative">
                        <img :src="threeRandomALevelBooks[0]" alt="textbook" class="absolute -rotate-5"
                             style="right:30%;top:20%; width:60%; height:auto"/>
                        <img :src="threeRandomALevelBooks[1]" class="absolute rotate-5"
                             style="right:-10%;top:30%;width:60%; height:auto"/>
                        <img :src="threeRandomALevelBooks[2]" class="absolute rotate-5"
                             style="right:30%;top:40%;width:60%; height:auto"/>
                    </div>
                </div>
            </div>
            <div style="opacity:0">&nbsp</div>
        </slide>
        <template #addons>
            <div class='absolute left-0 right-0 bottom-2 lg:bottom-10'>
                <pagination/>
            </div>
        </template>
    </carousel>
</template>