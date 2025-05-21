<script setup lang="ts">
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';
import BreadcrumbsContent from '@/components/BreadcrumbsContent.vue';

interface Props {
  breadcrumbs?: { text: string; path: string }[];
  showEmptyState?: boolean;
  loading?: boolean;
}
defineProps<Props>();
</script>

<template>
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <BreadcrumbsContent
          v-if="breadcrumbs"
          class="text-left w-full col-start-1 lg:col-span-4 grow mb-8"
          :breadcrumbs="breadcrumbs"
          :currentPath="$route.path"
        />
        <slot v-if="loading">
          <div class="flex justify-center items-center h-[300px] bg-white rounded-md">
            <SpinnerIcon class="w-10 h-10 animate-spin" />
          </div>
        </slot>
        <slot v-else-if="showEmptyState" name="empty"></slot>
        <div v-else class="flex gap-5 max-lg:flex-col max-lg:gap-9">
          <section
            class="flex flex-col w-[68%] max-lg:ml-0 max-lg:w-full order-2 lg:order-1 max-lg:gap-9 gap-8"
          >
            <slot name="form"></slot>
            <p class="text-[16px] text-gray-400 font-light">
              Your personal data will be used to process your order, support your experience
              throughout this website, and for other purposes described in our
              <router-link to="/privacy-policy" class="underline text-theme-teal"
                >privacy policy.</router-link
              >
            </p>
          </section>
          <aside
            class="lg:sticky lg:top-0 flex flex-col ml-5 w-[32%] min-w-[350px] max-lg:ml-0 max-lg:w-full h-fit order-1 lg:order-2"
          >
            <slot name="order"></slot>
          </aside>
        </div>
      </div>
    </div>
  </LayoutV2>
</template>

<style scoped></style>
