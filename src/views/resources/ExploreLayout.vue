<script setup lang="ts">
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import { ref, onMounted, onUnmounted } from 'vue';

import FiltersIcon from '@/components/icons/FiltersIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import BundleV2 from '@/views/shared/BundleV2.vue';
import BookV2 from '@/views/shared/BookV2.vue';
//import Pagination from '@/components/Pagination.vue';

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

const paginationNavigation = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, 100);
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
          <!--<div class="quick-select hidden md:block">
            <h3 class="md:text-sm lg:text-base">BROWSE ALL RESOURCES BY</h3>
            <div
              @click="quickfilter({ subjects: [], levels: ['gcse'] })"
              class="cursor-pointer linklike"
            >
              GCSEs
            </div>
            <div
              @click="quickfilter({ subjects: [], levels: ['a-level'] })"
              class="cursor-pointer linklike"
            >
              A-Levels
            </div>
          </div>

          <hr class="hidden md:block mb-2" />
          <ExploreSingleFilter
            title="EXAM SUBJECT"
            :options="subjectOptions"
            v-model="subjectSelectedSlugs"
            v-model:open="subjectsOpen"
            :initialised="filtersLoaded"
          />
          <hr class="mb-2" />
          <ExploreMultiFilter
            title="RESOURCE FORMAT"
            :options="formatOptions"
            v-model="formatSelectedSlugs"
            v-model:open="formatsOpen"
            :initialised="filtersLoaded"
          />
          <hr class="mb-2" />
          <ExploreMultiFilter
            title="QUALIFICATION LEVEL"
            :options="levelOptions"
            v-model="levelSelectedSlugs"
            v-model:open="levelsOpen"
            :initialised="filtersLoaded"
          />
          <hr class="mb-2" />
          <ExploreMultiFilter
            title="RESOURCE TYPE"
            :options="resourceTypeOptions"
            v-model="resourceTypeSelectedSlugs"
            v-model:open="resourceTypesOpen"
            :initialised="filtersLoaded"
          />
          <hr class="mb-2" />
          <ExploreMultiFilter
            title="EXAMBOARD"
            :options="examboardOptions"
            v-model="examboardSelectedSlugs"
            v-model:open="examboardsOpen"
            :initialised="filtersLoaded"
          />
        -->

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
        <!--<pagination
          v-if="totalItems > 0"
          class="gap-4 md:col-start-2 md:col-span-3 row-start-5 mt-8 ml-auto"
          item-class="bg-transparent text-black rounded-sm px-3 py-1"
          item-selected-class="!opacity-100 !text-theme-teal outline outline-2 outline-theme-teal"
          arrow-class="!text-theme-teal disabled:!text-theme-black disabled:opacity-30"
          v-model="pageIndex"
          :items-per-page="ITEMS_PER_PAGE"
          :total-items="totalItems"
          arrow-controls
          @navigation="paginationNavigation"
        />-->
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
