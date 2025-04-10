<script setup lang="ts">
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import { ref, onMounted, onUnmounted } from 'vue';

import FiltersIcon from '@/components/icons/FiltersIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import BundleV2 from '@/views/shared/BundleV2.vue';
import BookV2 from '@/views/shared/BookV2.vue';

import { isBundle } from '@/composables/useBindleData';
import type { Book, Bundle } from '@/composables/useBindleData';

interface Props {
  title: string;
  filtersLoaded: boolean;
  productsLoaded: boolean;
  products: (Bundle | Book)[];
}

defineProps<Props>();

const filtersRef = ref<HTMLDivElement | null>(null);

const toggleMobileFilters = () => {
  if (filtersRef.value) {
    if (!filtersRef.value.classList.contains('mobile-menu')) {
      filtersRef.value.classList.add('mobile-menu');
    }
    if (filtersRef.value.classList.contains('mobile-menu-open')) {
      filtersRef.value.classList.remove('mobile-menu-open');
    } else {
      filtersRef.value.classList.add('mobile-menu-open');
    }
  }
};

const closeMobileFilters = () => {
  if (filtersRef.value?.classList.contains('mobile-menu-open')) {
    filtersRef.value.classList.remove('mobile-menu-open');
  }
};

onMounted(async () => {
  window.addEventListener('resize', resizeWindow);
});
onUnmounted(async () => {
  window.removeEventListener('resize', resizeWindow);
});

const resizeWindow = () => {
  if (
    window.innerWidth >= 768 &&
    filtersRef.value &&
    filtersRef.value.classList.contains('mobile-menu')
  ) {
    filtersRef.value.classList.remove('mobile-menu');
    filtersRef.value.classList.remove('mobile-menu-open');
  } else if (
    window.innerWidth < 768 &&
    filtersRef.value &&
    !filtersRef.value.classList.contains('mobile-menu')
  ) {
    filtersRef.value.classList.add('mobile-menu');
  }
};
</script>
<template>
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div ref="exploreRef" class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
      </div>

      <div class="mx-auto max-w-8xl w-full text-left px-6 grid grid-cols-1 md:grid-cols-4">
        <div class="titlebar md:col-start-2 md:col-span-3 row-start-2 text-wrap">
          <div class="flex flex-row pb-4">
            <h1 class="text-4xl md:text-4xl">{{ title }}</h1>
            <div class="md:hidden grow pt-2 cursor-pointer" @click="toggleMobileFilters()">
              <filters-icon class="ml-auto" />
            </div>
          </div>
        </div>

        <div
          ref="filtersRef"
          :class="
            'filters hidden md:flex md:flex-col md:row-start-2 col-start-1 md:row-span-3 text-wrap pr-4 gap-2' +
            (filtersLoaded ? '' : ' working-spinner pointer-events-none')
          "
        >
          <slot name="filters"></slot>
          <hr class="mb-2" />
          <div class="md:hidden">
            <hr class="mb-2" />
            <button class="mx-auto block mt-4" @click="closeMobileFilters">Close Filters</button>
          </div>
        </div>

        <div
          :class="'products md:col-start-2 md:col-span-3 row-start-3 text-wrap flex flex-row flex-wrap'"
        >
          <template v-if="!filtersLoaded || !productsLoaded">
            <div class="w-full h-72 working-spinner"></div>
          </template>
          <template v-else-if="products.length > 0">
            <div
              v-for="product in products"
              :key="`${isBundle(product) ? 'bundle' : 'book'}-${product.id}`"
              class="w-full sm:w-1/2 xl:w-1/4 px-2"
            >
              <BundleV2 v-if="isBundle(product)" :bundle="product" mobile-flex-row />
              <BookV2 v-else :product="product" mobile-flex-row />
            </div>
          </template>
          <div v-else>No results</div>
        </div>
        <slot name="pagination"></slot>
      </div>
    </div>
  </LayoutV2>
</template>

<style scoped>
.filters.mobile-menu {
  opacity: 0;
  display: flex;
  flex-direction: column;
  transition: 200ms opacity ease-in-out;
  position: absolute;
  top: 168px;
  left: 0;
  right: 0;
  box-shadow: 0 0 5px #555;
  padding: 20px;
}

.filters.mobile-menu-open {
  background-color: white;
  opacity: 1;
  z-index: 1;
}
</style>
