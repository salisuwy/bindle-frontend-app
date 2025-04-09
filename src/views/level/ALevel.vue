<script setup>
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import RecommendedBundles from '@/views/shared/RecommendedBundles.vue';
//import PopularProducts from '@/views/shared/PopularProducts.vue';
import SubjectGrid from '@/views/shared/SubjectGrid.vue';
</script>
<template>
  <LayoutV2>
    <div class="bg-theme-white relative">
      <div class="bg-theme-verylightteal py-10">
        <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
          <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
          <h1 class="mt-12">A-Levels revision<br />material</h1>
          <div class="my-12 text-xl">Everything you need for your A-Level examinations</div>
        </div>
      </div>
      <div class="bg-theme-white py-10">
        <subject-grid stub="a-level" />
        <recommended-bundles />
        <!-- <popular-products/> -->
      </div>
    </div>
  </LayoutV2>
</template>
