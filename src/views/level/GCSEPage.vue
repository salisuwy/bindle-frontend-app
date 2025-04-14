<script setup>
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import SubjectGridV2 from '@/views/shared/SubjectGridV2.vue';
import PopularBundlesV2 from '../shared/PopularBundlesV2.vue';
</script>
<template>
  <LayoutV2>
    <div class="bg-theme-white relative">
      <div class="bg-theme-verylightteal py-10">
        <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
          <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
          <h1 class="mt-12">GCSE revision<br />material</h1>
          <div class="my-12 text-xl">Everything you need for your GCSE examinations</div>
        </div>
      </div>
      <div class="bg-theme-white py-10">
        <SubjectGridV2 stub="gcse" />
        <PopularBundlesV2 title="Popular Bundles" :count="6" levelSlug="gcse" />
      </div>
    </div>
  </LayoutV2>
</template>
