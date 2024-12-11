<script setup>
import Layout from "@/views/shared/Layout.vue";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBindleApiStore } from "@/store/bindle-api.js";
import FiltersIcon from "@/components/icons/FiltersIcon.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
import Accordion from "@/components/Accordion.vue";
import Bundle from "@/views/shared/Bundle.vue";
import Book from "@/views/shared/Book.vue";
import Pagination from "@/components/Pagination.vue";
import { useHead } from "@unhead/vue";
import { trackEvent } from "../../components/helpers/analytics";

const route = useRoute();
const router = useRouter();
const bindleApiStore = useBindleApiStore();

const subjects = ref(null);
const levels = ref(null);
const types = ref({});
const formats = ref([]);
const trueTypeSlugs = ref([]);
const examboards = ref({});
const bundles = ref({});
const books = ref({});

const subject = ref(null);
const level = ref(null);

const itemsPerPage = ref(16);

const filtersLoaded = ref(false);
const filtersRef = ref(null);

const pageTitle = ref("");
const navbarTitle = ref('View Subject');


// special case just to make things difficult
const bundleType = { id: 4, name: "Bundles", slug: "bundles" };

const filterSubject = computed(() => {
  return subject.value?.slug;
});
const filterSubjectId = computed(() => {
  return subject.value.id;
});
const filterLevel = computed({
  get: () => {
    if (Array.isArray(route.query.level)) return route.query.level; // it really shouldn't be!
    return route.query.level ? route.query.level.split(",") : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query };
    if ("page" in newQuery && newQuery.page !== 1) {
      newQuery.page = 1;
    }
    if (newValue.length > 0) {
      newQuery.level = newValue.join(",");
    } else {
      delete newQuery.level;
    }
    router.push({ query: { ...route.query, level: newValue } }).catch((err) => {
      console.error(err);
    });
  },
});
const filterLevelIds = computed(() => {
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
    return route.query.type ? route.query.type.split(",") : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query };
    if ("page" in newQuery && newQuery.page !== 1) {
      newQuery.page = 1;
    }
    if (newValue.length > 0) {
      newQuery.type = newValue.join(",");
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
  const buildFilterTypeIds = [];
  Object.values(types.value).forEach((type) => {
    if (filterType.value.includes(type.slug)) {
      buildFilterTypeIds.push(type.id);
    }
  });
  return buildFilterTypeIds;
});
const hasOneTrueFilterType = computed(() => {
  let count = 0;
  trueTypeSlugs.value.forEach((slug) => {
    if (filterType.value.includes(slug)) {
      count += 1;
    }
  });
  return count > 0;
});
const trueFilterTypeIds = computed(() => {
  return filterTypeIds.value.filter((typeId) => typeId !== bundleType.id);
});
const bundleOnlyFilter = computed(() => {
  return filterTypeIds.value.includes(bundleType.id);
});

const filterExamboard = computed({
  get: () => {
    return route.query.examboard ? route.query.examboard.split(",") : [];
  },
  set: (newValue) => {
    const newQuery = { ...route.query, page: 1 };
    if ("page" in newQuery && newQuery.page !== 1) {
      newQuery.page = 1;
    }
    if (newValue.length > 0) {
      newQuery.examboard = newValue.join(",");
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
      router
        .push({ query: { ...route.query, page: newValue } })
        .catch((err) => {
          console.error(err);
        });
    }
  },
});

const filteredProducts = computed(() => {
  let buildFilteredProducts = [];
  if (bundles.value && books.value) {
    let filteredBundles = Object.values(bundles.value).filter((bundle) => {
      const bundleBooks = Object.values(books.value).filter((bundleBook) =>
        bundle.book_ids.includes(bundleBook.id)
      );

      // format type ebook and paperback
      if (formats.value.length > 0) {
        if (
          formats.value.includes("ebook") &&
          formats.value.includes("paperback")
        ) {
        } else if (formats.value.includes("ebook") && !bundle.is_ebook) {
          return false;
        } else if (formats.value.includes("paperback") && bundle.is_ebook) {
          return false;
        }
      }

      // subjects
      if (
        filterSubject.value !== "all" &&
        !bundleBooks.some((book) =>
          book.subject_ids.includes(filterSubjectId.value)
        )
      ) {
        return false;
      }
      // qualification level
      if (
        filterLevel.value.length > 0 &&
        filterLevel.value.length < Object.keys(levels.value).length &&
        !bundleBooks.some((book) =>
          filterLevelIds.value.includes(book.level_id)
        )
      ) {
        return false;
      }
      // resource type
      if (
        hasOneTrueFilterType.value &&
        !bundleBooks.some((book) =>
          trueFilterTypeIds.value.includes(book.type_id)
        )
      ) {
        return false;
      }
      // examboards
      if (
        filterExamboard.value.length > 0 &&
        filterExamboard.value.length < Object.keys(examboards.value).length &&
        !bundleBooks.some((book) =>
          filterExamboardIds.value.includes(book.examboard_id)
        )
      ) {
        return false;
      }
      return true;
    });
    buildFilteredProducts.push(...filteredBundles);
  }
  if (books.value && !bundleOnlyFilter.value) {
    let filteredBooks = Object.values(books.value).filter((book) => {
      // format type ebook and paperback
      if (formats.value.length > 0) {
        if (
          formats.value.includes("ebook") &&
          formats.value.includes("paperback")
        ) {
        } else if (formats.value.includes("ebook") && !book.is_ebook) {
          return false;
        } else if (formats.value.includes("paperback") && book.is_ebook) {
          return false;
        }
      }

      // subject
      if (filterSubject.value !== "all") {
        if (!book.subject_ids.includes(filterSubjectId.value)) {
          return false;
        }
      }
      // level
      if (
        filterLevel.value.length > 0 &&
        filterLevel.value.length < Object.keys(levels.value).length &&
        !filterLevelIds.value.includes(book.level_id)
      ) {
        return false;
      }
      // resource type
      if (
        hasOneTrueFilterType.value &&
        !trueFilterTypeIds.value.includes(book.type_id)
      ) {
        return false;
      }
      // examboard
      if (
        filterExamboard.value.length > 0 &&
        filterExamboard.value.length < Object.keys(examboards.value).length &&
        !filterExamboardIds.value.includes(book.examboard_id)
      ) {
        return false;
      }
      return true;
    });
    buildFilteredProducts.push(...filteredBooks);
  }
  return buildFilteredProducts;
});

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(
    (pageIdx.value - 1) * itemsPerPage.value,
    pageIdx.value * itemsPerPage.value
  );
});

const filterSubjectAccordionRef = ref();
const filterLevelAccordionRef = ref();
const filterTypeAccordionRef = ref();
const filterExamboardAccordionRef = ref();

const toggleMobileFilters = () => {
  if (filtersRef.value) {
    if (!filtersRef.value.classList.contains("mobile-menu")) {
      filtersRef.value.classList.add("mobile-menu");
    }
    if (filtersRef.value.classList.contains("mobile-menu-open")) {
      filtersRef.value.classList.remove("mobile-menu-open");
    } else {
      filtersRef.value.classList.add("mobile-menu-open");
    }
  }
};

const closeMobileFilters = () => {
  if (filtersRef.value.classList.contains("mobile-menu-open")) {
    filtersRef.value.classList.remove("mobile-menu-open");
  }
};

const resizeWindow = () => {
  if (
    window.innerWidth >= 768 &&
    filtersRef.value &&
    filtersRef.value.classList.contains("mobile-menu")
  ) {
    filtersRef.value.classList.remove("mobile-menu");
    filtersRef.value.classList.remove("mobile-menu-open");
  } else if (
    window.innerWidth < 768 &&
    filtersRef.value &&
    !filtersRef.value.classList.contains("mobile-menu")
  ) {
    filtersRef.value.classList.add("mobile-menu");
  }
};

const updateSubject = async (subjectSlug) => {
  subject.value = await bindleApiStore.getSubjectBySlug(subjectSlug);
  const newUrl = "/" + level.value["slug"] + "/" + subjectSlug;
  if (subject.value) {
    /*if (level.value) {
      pageTitle.value = level.value["name"] + " " + subject.value["name"];
    } else {
      pageTitle.value = subject.value["name"];
    }*/
    
    pageTitle.value = subject.value["name"];
    navbarTitle.value = pageTitle.value;
  }
  await router.push({ path: newUrl, query: route.query });
};

watch(
  () => [route.params.level, route.params.subject],
  async (newParams, oldParams) => {
    if (newParams !== oldParams) {
      if (newParams[0] !== oldParams[0]) {
        level.value = Object.values(levels.value).find(
          (checkLevel) => checkLevel["slug"] === route.params.level
        );
      }
      if (newParams[1] !== oldParams[1]) {
        subject.value = Object.values(subjects.value).find(
          (checkSubject) => checkSubject["slug"] === route.params.subject
        );
      }
    }
  }
);

useHead({
  title: () => `Bindle - ${navbarTitle.value}`,
});

watch([filterSubject, filterLevel, filterType, formats, filterExamboard], () => {
  const filterParams = {
    bindle_subjects: filterSubject.value,
    bindle_levels: filterLevel.value?.join(", "),
    bindle_types: filterType.value?.join(", "),
    bindle_formats: formats.value?.join(", "),
    bindle_examboards: filterExamboard.value?.join(", "),
  };

  // console.log("applyFilter", filterParams);
  trackEvent("applyFilter", filterParams);
});

onMounted(async () => {
  window.addEventListener("resize", resizeWindow);

  await bindleApiStore.getSubjects();
  subjects.value = bindleApiStore.subjects;
  subjects.value = Object.values(subjects.value).filter((subject) => {
    return subject.show_on_nav === 1;
  });
  
  subject.value = Object.values(subjects.value).find(
    (checkSubject) => checkSubject["slug"] === route.params.subject
  );

  await bindleApiStore.getLevels();
  levels.value = bindleApiStore.levels;
  level.value = Object.values(levels.value).find(
    (checkLevel) => checkLevel["slug"] === route.params.level
  );

  await bindleApiStore.getTypes();
  Object.keys(bindleApiStore.types).forEach((key) => {
    trueTypeSlugs.value.push(bindleApiStore.types[key].slug);
  });
  types.value = bindleApiStore.types;
  types.value[bundleType.id] = bundleType;

  await bindleApiStore.getExamboards();
  examboards.value = bindleApiStore.examboards;
  filtersLoaded.value = true;

  if (subject.value) {
    // if (level.value) {
    //   pageTitle.value = level.value["name"] + " " + subject.value["name"];
    // } else {
    //   pageTitle.value = subject.value["name"];
    // }
    pageTitle.value = subject.value["name"];
    navbarTitle.value = pageTitle.value;
  }

  await bindleApiStore.getBooks();
  books.value = bindleApiStore.books;
  await bindleApiStore.getBundles();
  bundles.value = bindleApiStore.bundles;

  await nextTick();
  filterSubjectAccordionRef.value.open();

  if ("level" in route.query) {
    await nextTick();
    filterLevelAccordionRef.value.open();
  }
  if ("type" in route.query) {
    await nextTick();
    filterTypeAccordionRef.value.open();
  }
  if ("examboard" in route.query) {
    await nextTick();
    filterExamboardAccordionRef.value.open();
  }
});
onUnmounted(async () => {
  window.removeEventListener("resize", resizeWindow);
});
const paginationNavigation = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, 100);
};
</script>
<template>
  <layout>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <breadcrumbs class="text-left w-full col-start-1 md:col-span-4 mb-4" />
      </div>

      <div
        class="mx-auto max-w-8xl w-full text-left px-6 grid grid-cols-1 md:grid-cols-4"
      >
        <div
          class="titlebar md:col-start-2 md:col-span-3 row-start-2 text-wrap"
        >
          <div class="flex flex-row pb-4">
            <h1 class="text-4xl md:text-4xl">{{ pageTitle }}</h1>
            <div
              class="md:hidden grow pt-2 cursor-pointer"
              @click="toggleMobileFilters()"
            >
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
          <accordion
            ref="filterSubjectAccordionRef"
            content-class="w-full filter-subjects flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">SUBJECTS</h3></template>
            <template #indicator>
              <chevron-icon down class="inline-block" />
            </template>

            <hr class="hidden md:block w-full my-4" />

            <div v-if="filtersLoaded" class="radio-links">
              <div v-for="listSubject in subjects">
                <input
                  :id="'filter-subject-' + listSubject['slug']"
                  v-model="filterSubject"
                  class="bindle-radio"
                  type="radio"
                  name="subject"
                  :value="listSubject['slug']"
                  @click="updateSubject(listSubject['slug'])"
                />
                <label
                  :for="'filter-subject-' + listSubject['slug']"
                  class="cursor-pointer mr-auto"
                  >{{ listSubject["name"] }}</label
                >
              </div>
            </div>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterTypeAccordionRef"
            content-class="filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title
              ><h3 class="inline-block">RESOURCE FORMAT</h3></template
            >
            <template #indicator
              ><chevron-icon down class="inline-block"
            /></template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input v-model="formats" type="checkbox" value="ebook" />
              E-Book
            </label>
            <label
              v-if="filtersLoaded"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input v-model="formats" type="checkbox" value="paperback" />
              Paperback
            </label>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterLevelAccordionRef"
            content-class="w-full filter-level flex flex-col"
            title-class="md:text-xs lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title
              ><h3 class="inline-block">QUALIFICATION LEVEL</h3></template
            >
            <template #indicator>
              <chevron-icon down class="inline-block" />
            </template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              v-for="level in levels"
              :key="level['slug']"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input
                v-model="filterLevel"
                type="checkbox"
                :value="level['slug']"
              />
              {{ level["name"] }}s
            </label>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterTypeAccordionRef"
            content-class="w-full filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title
              ><h3 class="inline-block">RESOURCE TYPE</h3></template
            >
            <template #indicator>
              <chevron-icon down class="inline-block" />
            </template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              v-for="type in types"
              :key="type['slug']"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input
                v-model="filterType"
                type="checkbox"
                :value="type['slug']"
              />
              {{ type["name"] }}
            </label>
          </accordion>

          <hr class="mb-2" />

          <accordion
            ref="filterExamboardAccordionRef"
            content-class="w-full filter-level flex flex-col"
            title-class="md:text-sm lg:text-base cursor-pointer linklike"
            indicator-class="float-right"
          >
            <template #title><h3 class="inline-block">EXAM BOARD</h3></template>
            <template #indicator>
              <chevron-icon down class="inline-block" />
            </template>
            <hr class="hidden md:block w-full my-4" />
            <label
              v-if="filtersLoaded"
              v-for="examboard in examboards"
              :key="examboard['slug']"
              class="bindle-checkbox cursor-pointer mr-auto"
            >
              <input
                type="checkbox"
                v-model="filterExamboard"
                :value="examboard['slug']"
              />
              {{ examboard["description"] }}
            </label>
          </accordion>

          <div class="md:hidden">
            <hr class="mb-2" />
            <button class="mx-auto block mt-4" @click="closeMobileFilters">
              Close Filters
            </button>
          </div>
        </div>
        <div
          class="products md:col-start-2 md:col-span-3 row-start-3 text-wrap flex flex-row flex-wrap"
        >
          <div v-if="filteredProducts.length === 0">
            There are no resources for the selected filters.
          </div>
          <div
            v-else
            v-for="product in paginatedProducts"
            class="w-full sm:w-1/2 xl:w-1/4 px-2"
          >
            <bundle
              v-if="'books' in product"
              :bundle="product"
              mobile-flex-row
            />
            <book
              v-else-if="!bundleOnlyFilter"
              :product="product"
              mobile-flex-row
            />
          </div>
        </div>
        <pagination
          v-if="filteredProducts.length > 0"
          class="gap-4 md:col-start-2 md:col-span-3 row-start-5 my-4"
          v-model="pageIdx"
          :items-per-page="itemsPerPage"
          :total-items="filteredProducts.length"
          arrow-controls
          @navigation="paginationNavigation"
        />
      </div>
    </div>
  </layout>
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
