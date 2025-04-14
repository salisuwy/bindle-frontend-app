<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import ExploreLayout from './ExploreLayout.vue';
import Pagination from '@/components/Pagination.vue';
import ExploreSingleFilterV2 from './ExploreSingleFilterV2.vue';
import ExploreMultiFilter from './ExploreMultiFilter.vue';

import { useBooks, useBundles } from '@/composables/useBindleData';
import {
  useSubjectsFilter,
  useFormatFilter,
  useLevelFilter,
  useResourceTypeFilter,
  useExamboardFilter,
  useFilteredBooks,
  useFilteredBundles,
  usePaginatedProducts,
  useTitleFilter,
} from '@/composables/useResourceFilters';

interface Props {
  mode: 'all' | 'level-subject' | 'bundles';
}
const props = defineProps<Props>();

const {
  options: subjectOptions,
  selectedSlugs: subjectSelectedSlugs,
  singleSelectedSlug: subjectSelectedSlug,
  selectedOptions: subjectSelectedOptions,
  bookMatchesFilter: subjectFilter,
  initialised: subjectsInitialised,
} = useSubjectsFilter(computed(() => ['all', 'bundles'].includes(props.mode)));
const subjectsOpen = ref(false);

const {
  options: levelOptions,
  selectedSlugs: levelSelectedSlugs,
  singleSelectedSlug: levelSelectedSlug,
  bookMatchesFilter: levelFilter,
  initialised: levelsInitialised,
} = useLevelFilter(computed(() => ['all', 'bundles'].includes(props.mode)));
const levelsOpen = ref(false);

const {
  options: formatOptions,
  selectedSlugs: formatSelectedSlugs,
  bookMatchesFilter: formatBookFilter,
  bundleMatchesFilter: formatBundleFilter,
  initialised: formatsInitialised,
} = useFormatFilter();
const formatsOpen = ref(false);

const {
  options: resourceTypeOptions,
  selectedSlugs: resourceTypeSelectedSlugs,
  bookMatchesFilter: resourceTypeFilter,
  isBundleOnly,
  initialised: resourceTypesInitialised,
} = useResourceTypeFilter(computed(() => props.mode == 'bundles'));
const resourceTypesOpen = ref(false);

const {
  options: examboardOptions,
  selectedSlugs: examboardSelectedSlugs,
  bookMatchesFilter: examboardFilter,
  initialised: examboardsInitialised,
} = useExamboardFilter();
const examboardsOpen = ref(false);

const { bookMatchesFilter: titleFilter } = useTitleFilter();

const filtersLoaded = computed(
  () =>
    subjectsInitialised.value &&
    formatsInitialised.value &&
    levelsInitialised.value &&
    resourceTypesInitialised.value &&
    examboardsInitialised.value
);

const openIfSelected = () => {
  console.log('open if selected');
  subjectsOpen.value =
    subjectSelectedSlugs.value.length > 0 || subjectSelectedSlug.value !== undefined;
  levelsOpen.value = levelSelectedSlugs.value.length > 0 || levelSelectedSlug.value !== undefined;
  formatsOpen.value = formatSelectedSlugs.value.length > 0;
  resourceTypesOpen.value = resourceTypeSelectedSlugs.value.length > 0;
  examboardsOpen.value = examboardSelectedSlugs.value.length > 0;
};

watch(filtersLoaded, () => {
  console.log('filtersLoaded', filtersLoaded.value);
  if (filtersLoaded.value) {
    openIfSelected();
  }
});

const resetFilters = () => {
  subjectSelectedSlugs.value = [];
  subjectsOpen.value = false;
  levelSelectedSlugs.value = [];
  levelsOpen.value = false;
  formatSelectedSlugs.value = [];
  formatsOpen.value = false;
  resourceTypeSelectedSlugs.value = [];
  resourceTypesOpen.value = false;
  examboardSelectedSlugs.value = [];
  examboardsOpen.value = false;
  pageIndex.value = 1;
};

const quickfilter = ({ subjects, levels }: { subjects?: string[]; levels?: string[] }) => {
  resetFilters();

  if (subjects) {
    subjectSelectedSlugs.value = subjects;
    subjectsOpen.value = true;
  }

  if (levels) {
    levelSelectedSlugs.value = levels;
    levelsOpen.value = true;
  }
};

const bookFilters = computed(() => [
  subjectFilter,
  formatBookFilter,
  levelFilter,
  resourceTypeFilter,
  examboardFilter,
  titleFilter,
]);
const bundleFilters = computed(() => [formatBundleFilter]);

const { books, isLoading: isBooksLoading } = useBooks();
const { bundles, isLoading: isBundlesLoading } = useBundles();
const isProductsLoading = computed(() => isBooksLoading.value || isBundlesLoading.value);

const { filteredBooks } = useFilteredBooks(books, bookFilters, isBundleOnly);
const { filteredBundles } = useFilteredBundles(bundles, bookFilters, bundleFilters);

const ITEMS_PER_PAGE = 16;
const { products, totalItems, pageIndex } = usePaginatedProducts(
  filteredBooks,
  filteredBundles,
  isProductsLoading,
  ITEMS_PER_PAGE
);
watch(
  [
    subjectSelectedSlugs,
    formatSelectedSlugs,
    levelSelectedSlugs,
    resourceTypeSelectedSlugs,
    examboardSelectedSlugs,
  ],
  () => {
    if (filtersLoaded.value) {
      pageIndex.value = 1;
    }
  }
);

const pageTitle = computed(() => {
  const suffix = props.mode == 'bundles' ? 'Bundles' : 'Resources';
  return subjectSelectedOptions.value.length == 0
    ? suffix
    : `${subjectSelectedOptions.value[0].name} ${suffix}`;
});

const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, 100);
};
</script>
<template>
  <ExploreLayout
    :title="pageTitle"
    :filtersLoaded="filtersLoaded"
    :productsLoaded="!isProductsLoading"
    :products="products"
  >
    <template #filters>
      <template v-if="['all', 'bundles'].includes(mode)">
        <div class="quick-select hidden md:block">
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
      </template>

      <ExploreSingleFilterV2
        title="EXAM SUBJECT"
        name="subject"
        :showAll="['all', 'bundles'].includes(mode)"
        :options="subjectOptions"
        v-model="subjectSelectedSlug"
        v-model:open="subjectsOpen"
        :initialised="filtersLoaded"
      />
      <hr class="mb-2" />
      <ExploreMultiFilter
        title="RESOURCE FORMAT"
        name="format"
        :options="formatOptions"
        v-model="formatSelectedSlugs"
        v-model:open="formatsOpen"
        :initialised="filtersLoaded"
      />
      <hr class="mb-2" />
      <ExploreMultiFilter
        v-if="['all', 'bundles'].includes(mode)"
        title="QUALIFICATION LEVEL"
        name="level"
        :options="levelOptions"
        v-model="levelSelectedSlugs"
        v-model:open="levelsOpen"
        :initialised="filtersLoaded"
      />
      <ExploreSingleFilterV2
        v-else
        title="QUALIFICATION LEVEL"
        name="level"
        :options="levelOptions"
        v-model="levelSelectedSlug"
        v-model:open="levelsOpen"
        :initialised="filtersLoaded"
      />
      <hr class="mb-2" />
      <ExploreMultiFilter
        title="RESOURCE TYPE"
        name="type"
        :options="resourceTypeOptions"
        v-model="resourceTypeSelectedSlugs"
        v-model:open="resourceTypesOpen"
        :initialised="filtersLoaded"
      />
      <hr class="mb-2" />
      <ExploreMultiFilter
        title="EXAMBOARD"
        name="examboard"
        :options="examboardOptions"
        v-model="examboardSelectedSlugs"
        v-model:open="examboardsOpen"
        :initialised="filtersLoaded"
      />
    </template>
    <template #pagination>
      <pagination
        v-if="totalItems > 0"
        class="gap-4 md:col-start-2 md:col-span-3 row-start-5 mt-8 ml-auto"
        item-class="bg-transparent text-black rounded-sm px-3 py-1"
        item-selected-class="!opacity-100 !text-theme-teal outline outline-2 outline-theme-teal"
        arrow-class="!text-theme-teal disabled:!text-theme-black disabled:opacity-30"
        v-model="pageIndex"
        :items-per-page="ITEMS_PER_PAGE"
        :total-items="totalItems"
        arrow-controls
        @navigation="scrollToTop"
      />
    </template>
  </ExploreLayout>
</template>

<style scoped></style>
