<script setup>
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import BestSelling from '@/views/bundles/BestSelling.vue';
import BenefitsBanner from '@/views/index/BenefitsBanner.vue';
//import SubjectIconLinks from '@/views/shared/SubjectIconLinks.vue';
import BundlesBannerV2 from '@/views/index/BundlesBannerV2.vue';
import BundleTypesV2 from '@/views/index/BundleTypesV2.vue';
import { onMounted, ref } from 'vue';
import { useBindleApiStore } from '@/store/bindle-api.js';
//import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import RecommendedBundles from '@/views/shared/RecommendedBundles.vue';

const levels = ref([]);
const bindleApiStore = useBindleApiStore();

onMounted(async () => {
  await bindleApiStore.getLevels();
  levels.value = bindleApiStore.levels;
});
</script>
<template>
  <LayoutV2>
    <div class="bg-theme-white relative">
      <div class="bg-theme-verylightteal py-10">
        <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
          <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
          <h1 class="mt-12">Explore all of our<br />bundles</h1>
          <div class="my-12 text-xl">
            Bundles of material for every subject, level and exam board
          </div>
        </div>
      </div>
      <div class="bg-theme-white py-10">
        <div class="max-w-8xl mx-auto flex flex-col sm:flex-row w-full gap-6 pt-10 pb-20">
          <div class="w-full flex flex-col">
            <img src="/assets/bundles/core-bundles.png" alt="core bundles image" class="w-full" />
            <div class="w-full bg-theme-teal text-white px-6 pt-6 pb-20 grow text-left relative">
              <h2 class="text-white mb-2">Core Bundles</h2>
              <div>
                Dive deep into a single subject with our tailored Core Bundles, blending three
                essential study resources to ensure you're well prepared for exam success.
              </div>
              <div class="absolute bottom-6 left-0 right-0 px-6 text-left">
                <a href="/bundles/explore" class="px-5 py-2.5 bg-white text-black"
                  >Shop Core Bundles</a
                >
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col">
            <img
              src="/assets/bundles/workbook-bundles.png"
              alt="core bundles image"
              class="w-full"
            />
            <div
              class="w-full bg-theme-navyblue text-white px-6 pt-6 pb-20 grow text-left relative"
            >
              <h2 class="text-white mb-2">Workbook Bundles</h2>
              <div>
                Elevate your exam technique with our collection of Workbook Bundles - carefully
                curated collections that does beyond the basics.
              </div>
              <div class="absolute bottom-6 left-0 right-0 px-6 text-left">
                <a
                  href="/bundles/explore?subject=all&type=workbook"
                  class="px-5 py-2.5 bg-white text-black"
                  >Shop Workbook Bundles</a
                >
              </div>
            </div>
          </div>
        </div>
        <benefits-banner />
        <best-selling v-for="level in levels" :level="level" />
      </div>
      <!--            <div class="bg-theme-light py-10">-->
      <!--                <div class="mx-10 flex flex-row">-->
      <!--                    <div class="text-left flex-1"><h2>Shop bundles by subject</h2></div>-->
      <!--                    <router-link class="text-theme-teal" to="/bundles/explore">Shop all bundles <chevron-icon right width="16px" height="16px" class="inline" /></router-link>-->
      <!--                </div>-->
      <!--                <subject-icon-links slug="/bundles/explore"/>-->
      <!--            </div>-->
      <div class="mt-10 mb-2">
        <recommended-bundles />
      </div>
      <BundlesBannerV2 />
      <BundleTypesV2 />
    </div>
  </LayoutV2>
</template>
