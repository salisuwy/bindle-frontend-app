<script setup>
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBindleApiStore } from '@/store/bindle-api.js';
import FiltersIcon from '@/components/icons/FiltersIcon.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import Accordion from '@/components/Accordion.vue';
import BundleV2 from '@/views/shared/BundleV2.vue';
import Pagination from '@/components/Pagination.vue';
import { useHead } from '@unhead/vue';
import { trackEvent } from '../../components/helpers/analytics';
import { consoleLog } from '@/components/helpers/tsUtils';

const route = useRoute();
const router = useRouter();
const bindleApiStore = useBindleApiStore();
const books = ref([]);
const bundles = ref([]);
const filterSubjectName = ref('');

const subjects = ref(null);
const levels = ref(null);
const types = ref([]);
const formats = ref([]);
const examboards = ref([]);

const itemsPerPage = ref(16);

const filtersLoaded = ref(false);
const filtersRef = ref(null);

const filterSubject = computed({
  get: () => route.query.subject || 'all',
  set: (newValue) => {
    const newQuery = { ...route.query, subject: newValue };
    if ('page' in newQuery && newQuery.page !== 1) {
      newQuery.page = 1;
    }
    router.push({ query: { ...route.query, subject: newValue } }).catch((err) => {
      console.error(err);
    });
  },
});
const filterSubjectId = computed(() => {
  if (!filterSubject.value) {
    return null;
  }
  const findSubject = Object.values(subjects.value).find(
    (subject) => subject.slug === filterSubject.value
  );
  return findSubject ? findSubject.id : null;
});

async function prepPageTitleText() {
  const routeSubj = route.query.subject || 'all';
  const findSubject = Object.values(subjects?.value ?? {})?.find(
    (subject) => subject.slug === routeSubj
  );
  const title = findSubject ? findSubject?.name : '';
  filterSubjectName.value = title;
}

const filterLevel = computed({
  get: () => {
    return route.query.level ? route.query.level.split(',') : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query };
    if (newValue.length > 0) {
      newQuery.level = newValue.join(',');
    } else {
      delete newQuery.level;
    }
    router.push({ query: newQuery }).catch((err) => {
      console.error(err);
    });
  },
});
const filterLevelId = computed(() => {
  if (!filterLevel.value) {
    return null;
  }
  const filterLevels = [];
  Object.values(levels.value).forEach((level) => {
    if (filterLevel.value.includes(level.slug)) {
      filterLevels.push(level.id);
    }
  });
  return filterLevels;
});

const filterType = computed({
  get: () => {
    return route.query.type ? route.query.type.split(',') : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query };
    if (newValue.length > 0) {
      newQuery.type = newValue.join(',');
    } else {
      delete newQuery.type;
    }
    router.push({ query: newQuery }).catch((err) => {
      console.error(err);
    });
  },
});
const filterTypeIds = computed(() => {
  if (!filterType.value) {
    return null;
  }
  const filterTypeIds = [];
  Object.values(types.value).forEach((type) => {
    if (filterType.value.includes(type.slug)) {
      filterTypeIds.push(type.id);
    }
  });
  return filterTypeIds;
});

const filterExamboard = computed({
  get: () => {
    return route.query.examboard ? route.query.examboard.split(',') : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query };
    if (newValue.length > 0) {
      newQuery.examboard = newValue.join(',');
    } else {
      delete newQuery.examboard;
    }
    router.push({ query: newQuery }).catch((err) => {
      console.error(err);
    });
  },
});
const filterExamboardIds = computed(() => {
  if (!filterExamboard.value) {
    return null;
  }
  const filterExamboardIds = [];
  Object.values(examboards.value).forEach((examboard) => {
    if (filterExamboard.value.includes(examboard.slug)) {
      filterExamboardIds.push(examboard.id);
    }
  });
  return filterExamboardIds;
});

const pageIdx = computed({
  get: () => parseInt(route.query.page, 10) || 1,
  set: (newValue) => {
    const intValue = parseInt(newValue, 10);
    if (intValue !== parseInt(route.query.page, 10)) {
      router.push({ query: { ...route.query, page: newValue } }).catch((err) => {
        console.error(err);
      });
    }
  },
});

const filteredBundles = computed(() => {
  if (bundles.value) {
    return Object.values(bundles.value).filter((bundle) => {
      const bundleBooks = Object.values(books.value).filter((bundleBook) =>
        bundle.book_ids.includes(bundleBook.id)
      );

      // format type ebook and paperback
      if (formats.value.length > 0) {
        if (formats.value.includes('ebook') && formats.value.includes('paperback')) {
        } else if (formats.value.includes('ebook') && !bundle.is_ebook) {
          return false;
        } else if (formats.value.includes('paperback') && bundle.is_ebook) {
          return false;
        }
      }

      // subjects
      if (
        filterSubject.value !== 'all' &&
        !bundleBooks.some((book) => book.subject_ids.includes(filterSubjectId.value))
      ) {
        return false;
      }
      // qualification level
      if (
        filterLevelId.value.length > 0 &&
        !bundleBooks.some((book) => filterLevelId.value.includes(book.level_id))
      ) {
        return false;
      }
      // resource type
      if (
        filterType.value.length > 0 &&
        filterType.value.length < Object.keys(types.value).length &&
        !bundleBooks.some((book) => filterTypeIds.value.includes(book.type_id))
      ) {
        return false;
      }
      // examboards
      if (
        filterExamboard.value.length > 0 &&
        filterExamboard.value.length < Object.keys(examboards.value).length &&
        !bundleBooks.some((book) => filterExamboardIds.value.includes(book.examboard_id))
      ) {
        return false;
      }
      return true;
    });
  } else {
    return [];
  }
});

const paginatedBundles = computed(() => {
  return filteredBundles.value.slice(
    (pageIdx.value - 1) * itemsPerPage.value,
    pageIdx.value * itemsPerPage.value
  );
});

const filterSubjectAccordionRef = ref();
const filterLevelAccordionRef = ref();
const filterTypeAccordionRef = ref();
const filterExamboardAccordionRef = ref();

const quickFilter = (type) => {
  if (type === 'gcse') {
    router.push({ query: { level: 'gcse' } });
    filterSubjectAccordionRef.value.close();
    filterLevelAccordionRef.value.open();
    filterTypeAccordionRef.value.close();
    filterExamboardAccordionRef.value.close();
  } else if (type === 'a-level') {
    router.push({ query: { level: 'a-level' } });
    filterSubjectAccordionRef.value.close();
    filterLevelAccordionRef.value.open();
    filterTypeAccordionRef.value.close();
    filterExamboardAccordionRef.value.close();
  } else if (type === 'bundle') {
    alert('not yet implemented');
  } else if (type === 'bestseller') {
    alert('not yet implemented');
  } else if (type === 'sale') {
    alert('not yet implemented');
  }
};

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
  if (filtersRef.value.classList.contains('mobile-menu-open')) {
    filtersRef.value.classList.remove('mobile-menu-open');
  }
};

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

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    consoleLog('Query parameters changed:', newQuery);
    prepPageTitleText();
  },
  { deep: true, immediate: true }
);

useHead({
  title: () => `Bindle - Explore Resource: ${filterSubjectName.value} Bundle`,
});

watch([filterSubject, filterLevel, filterType, formats, filterExamboard], () => {
  const filterParams = {
    bindle_subjects: filterSubject.value,
    bindle_levels: filterLevel.value?.join(', '),
    bindle_types: filterType.value?.join(', '),
    bindle_formats: formats.value?.join(', '),
    bindle_examboards: filterExamboard.value?.join(', '),
  };

  trackEvent('applyFilter', filterParams);
});

onMounted(async () => {
  window.addEventListener('resize', resizeWindow);
  await bindleApiStore.getSubjects();
  subjects.value = bindleApiStore.subjects;
  subjects.value = Object.values(subjects.value).filter((subject) => {
    return subject.show_on_nav === 1;
  });
  await bindleApiStore.getLevels();
  levels.value = bindleApiStore.levels;
  await bindleApiStore.getTypes();
  types.value = bindleApiStore.types;
  await bindleApiStore.getExamboards();
  examboards.value = bindleApiStore.examboards;
  filtersLoaded.value = true;

  const setParams = {};
  if (!route.query.subject) {
    setParams['subject'] = 'all';
  }
  if (Object.keys(setParams).length > 0) {
    await router.replace({ query: { ...route.query, ...setParams } });
    if (filterSubject.value === '') {
      filterSubject.value = 'all';
    }
  }

  if ('subject' in route.query) {
    await nextTick();
    filterSubjectAccordionRef.value.open();
  }
  if ('level' in route.query) {
    await nextTick();
    filterLevelAccordionRef.value.open();
  }
  if ('type' in route.query) {
    await nextTick();
    filterTypeAccordionRef.value.open();
  }
  if ('examboard' in route.query) {
    await nextTick();
    filterExamboardAccordionRef.value.open();
  }
  await bindleApiStore.getBundles();
  bundles.value = bindleApiStore.bundles;
  await bindleApiStore.getBooks();
  books.value = bindleApiStore.books;
  prepPageTitleText();
});
onUnmounted(async () => {
  window.removeEventListener('resize', resizeWindow);
});
const paginationNavigation = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, 100);
};
</script>
<template>
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
      </div>

      <div class="mx-auto max-w-8xl w-full text-left px-6 grid grid-cols-1 md:grid-cols-4">
        <div class="titlebar md:col-start-2 md:col-span-3 row-start-2 text-wrap">
          <div class="flex flex-row pb-4">
            <h1 class="text-4xl md:text-4xl">{{ filterSubjectName }} Bundles</h1>
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
          <div class="quick-select hidden md:block">
            <h3 class="md:text-sm lg:text-base">BROWSE ALL RESOURCES BY</h3>
            <div @click="quickFilter('gcse')" class="cursor-pointer linklike">GCSEs</div>
            <div @click="quickFilter('a-level')" class="cursor-pointer linklike">A-Levels</div>
            <!--                        <div @click="quickFilter('bundle')" class="cursor-pointer linklike">Explore Bundles</div>-->
            <!--                        <div @click="quickFilter('bestseller')" class="cursor-pointer linklike">Bestsellers</div>-->
            <!--                        <div @click="quickFilter('sale')" class="cursor-pointer linklike">Sale</div>-->
          </div>

          <hr class="hidden md:block mb-2" />

          <accordion
            ref="filterTypeAccordionRef"
            content-class="filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">RESOURCE FORMAT</h3></template>
            <template #indicator><chevron-icon down class="inline-block" /></template>
            <hr class="hidden md:block w-full my-4" />
            <label v-if="filtersLoaded" class="bindle-checkbox cursor-pointer mr-auto">
              <input v-model="formats" type="checkbox" value="ebook" />
              E-Book
            </label>
            <label v-if="filtersLoaded" class="bindle-checkbox cursor-pointer mr-auto">
              <input v-model="formats" type="checkbox" value="paperback" />
              Paperback
            </label>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterSubjectAccordionRef"
            content-class="filter-subjects flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">SUBJECTS</h3></template>
            <template #indicator><chevron-icon down class="inline-block" /></template>

            <hr class="hidden md:block w-full my-4" />

            <div class="radio-links">
              <div>
                <input
                  v-model="filterSubject"
                  id="filter-subject-all"
                  class="bindle-radio"
                  type="radio"
                  value="all"
                />
                <label class="cursor-pointer mr-auto" for="filter-subject-all">All</label>
              </div>
              <div v-for="subject in subjects" :key="subject['slug']">
                <input
                  :id="'filter-subject-' + subject['slug']"
                  v-model="filterSubject"
                  class="bindle-radio"
                  type="radio"
                  name="subject"
                  :value="subject['slug']"
                />
                <label :for="'filter-subject-' + subject['slug']" class="cursor-pointer mr-auto">{{
                  subject['name']
                }}</label>
              </div>
            </div>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterLevelAccordionRef"
            content-class="filter-level flex flex-col"
            title-class="md:text-xs lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">QUALIFICATION LEVEL</h3></template>
            <template #indicator><chevron-icon down class="inline-block" /></template>
            <hr class="hidden md:block w-full my-4" />
            <label class="cursor-pointer mr-auto bindle-checkbox"
              ><input v-model="filterLevel" type="checkbox" class="bindle-radio" value="gcse" />
              GCSEs</label
            >
            <label class="cursor-pointer mr-auto bindle-checkbox"
              ><input v-model="filterLevel" type="checkbox" class="bindle-radio" value="a-level" />
              A-Levels</label
            >
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterTypeAccordionRef"
            content-class="filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">RESOURCE TYPE</h3></template>
            <template #indicator><chevron-icon down class="inline-block" /></template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              v-for="type in types"
              :key="type['slug']"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input v-model="filterType" type="checkbox" :value="type['slug']" />
              {{ type['name'] }}
            </label>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterExamboardAccordionRef"
            content-class="filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">EXAM BOARD</h3></template>
            <template #indicator><chevron-icon down class="inline-block" /></template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              v-for="examboard in examboards"
              :key="examboard['slug']"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input type="checkbox" v-model="filterExamboard" :value="examboard['slug']" />
              {{ examboard['description'] }}
            </label>
          </accordion>

          <div class="md:hidden">
            <hr class="mb-2" />
            <button class="mx-auto block mt-4" @click="closeMobileFilters">Close Filters</button>
          </div>
        </div>
        <div
          class="products md:col-start-2 md:col-span-3 row-start-3 text-wrap flex flex-row flex-wrap"
        >
          <div v-for="bundle in paginatedBundles" class="w-full sm:w-1/2 xl:w-1/4 px-2">
            <BundleV2 :bundle="bundle" mobile-flex-row />
          </div>
        </div>
        <pagination
          v-if="filteredBundles.length > 0"
          class="gap-4 md:col-start-2 md:col-span-3 row-start-5 my-4"
          v-model="pageIdx"
          :items-per-page="itemsPerPage"
          :total-items="filteredBundles.length"
          arrow-controls
          @navigation="paginationNavigation"
        />
      </div>
    </div>
  </LayoutV2>
</template>
<style scoped>
:deep(.accordion-content) {
  position: relative;
  top: -8px;
}
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
