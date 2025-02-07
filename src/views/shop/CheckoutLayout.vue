<script setup lang="ts">
import Layout from '@/views/shared/Layout.vue';
import BreadcrumbsContent from '@/components/BreadcrumbsContent.vue';

interface Props {
  breadcrumbs: { text: string; path: string }[];
}
defineProps<Props>();
</script>

<template>
  <Layout>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <BreadcrumbsContent
          class="text-left w-full col-start-1 md:col-span-4 grow mb-8"
          :breadcrumbs="breadcrumbs"
          :currentPath="$route.path"
        />
        <div id="left-panel" class="flex gap-5 max-md:flex-col max-md:gap-9">
          <section
            class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full order-2 md:order-1 max-md:gap-9 gap-8"
          >
            <slot name="form"></slot>
          </section>
          <aside
            class="md:sticky md:top-0 flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit order-1 md:order-2"
          >
            <slot name="order"></slot>
          </aside>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped></style>
