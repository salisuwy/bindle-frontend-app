<script setup>
import Layout from '@/views/shared/Layout.vue';
import BannerCarousel from '@/views/index/BannerCarousel.vue';
import BenefitsBanner from '@/views/index/BenefitsBanner.vue';
import PopularBundles from '@/views/shared/PopularBundles.vue';
import PopularBooks from '@/views/shared/PopularBooks.vue';
import PartnersBanner from '@/views/index/PartnersBanner.vue';
import SmartSavingsBanner from '@/views/index/SmartSavingsBanner.vue';
import BundlesBanner from '@/views/index/BundlesBanner.vue';
import SubjectIconLinks from '@/views/shared/SubjectIconLinks.vue';
import BundleTypes from '@/views/index/BundleTypes.vue';
import { useBindleApiStore } from '@/store/bindle-api.js';
import { onMounted } from 'vue';

const bindleApiStore = useBindleApiStore();

onMounted(async () => {
  try {
    const data = await bindleApiStore.getHomepageData();
  } catch (e) {
    console.error(e);
  }
});
</script>
<template>
  <layout>
    <banner-carousel />
    <benefits-banner />
    <popular-bundles :count="4" />
    <popular-books :count="4" />
    <partners-banner />
    <smart-savings-banner />
    <bundles-banner />
    <!-- <subject-icon-links slug="/resources/explore" /> -->
    <bundle-types />
  </layout>
</template>
