<script setup lang="ts">
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import BannerCarouselV2 from '@/views/index/BannerCarouselV2.vue';
import BenefitsBanner from '@/views/index/BenefitsBanner.vue';
import PopularBundlesV2 from '@/views/shared/PopularBundlesV2.vue';
import PopularBooksV2 from '@/views/shared/PopularBooksV2.vue';
import PartnersBanner from '@/views/index/PartnersBanner.vue';
import SmartSavingsBanner from '@/views/index/SmartSavingsBanner.vue';
import BundlesBannerV2 from '@/views/index/BundlesBannerV2.vue';
import BundleTypesV2 from '@/views/index/BundleTypesV2.vue';
</script>

<template>
  <LayoutV2>
    <BannerCarouselV2 />
    <BenefitsBanner />
    <PopularBundlesV2 title="Popular Bundles" :count="4" />
    <PopularBooksV2 :count="4" />
    <PartnersBanner />
    <SmartSavingsBanner />
    <BundlesBannerV2 />
    <BundleTypesV2 />
  </LayoutV2>
</template>
