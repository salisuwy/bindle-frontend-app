<script setup lang="ts">
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import BreadcrumbsContent from '@/components/BreadcrumbsContent.vue';

interface Props {
  breadcrumbs: { text: string; path: string }[];
}
defineProps<Props>();
</script>

<template>
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <BreadcrumbsContent
          class="text-left w-full col-start-1 lg:col-span-4 grow mb-8"
          :breadcrumbs="breadcrumbs"
          :currentPath="$route.path"
        />
        <div class="flex gap-5 max-lg:flex-col max-lg:gap-9">
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
            class="lg:sticky lg:top-0 flex flex-col ml-5 w-[32%] min-w-[400px] max-lg:ml-0 max-lg:w-full h-fit order-1 lg:order-2"
          >
            <div
              class="flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-lg:mt-9"
            >
              <slot name="order"></slot>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </LayoutV2>
</template>

<style scoped></style>
