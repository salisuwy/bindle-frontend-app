import { ref, computed, watch, onMounted, toRef } from 'vue';
import type { Ref } from 'vue';

import { useSubjects, useLevels, useResourceTypes, useExamboards } from './useBindleData';
import { useSyncQueryParam } from './useSyncQueryParam';
import type { Book, Bundle, ResourceType } from './useBindleData';

import { useRoute } from 'vue-router';
import { useSyncRouteParam } from './useSyncRouteParam';

export type FilterOption = { id: number; slug: string; name: string };

export const useFilter = (options: Ref<FilterOption[] | undefined>) => {
  const getSelectedOption = (slug?: string) =>
    slug && options.value ? options.value.find((o) => o.slug == slug) : undefined;

  const selectedSlugs = ref<string[]>([]);

  const singleSelectedSlug = computed<string | undefined>({
    get: () => selectedSlugs.value[0],
    set: (slug: string | undefined) => {
      if (slug) {
        selectedSlugs.value = [slug];
      } else {
        selectedSlugs.value = [];
      }
    },
  });

  const selectedOptions = computed(() =>
    selectedSlugs.value.flatMap((slug) => {
      const option = getSelectedOption(slug);
      return option ? [option] : [];
    })
  );
  return { selectedSlugs, singleSelectedSlug, selectedOptions };
};

export const useSubjectsFilter = (syncQueryParam: Ref<boolean> | boolean) => {
  const { navSubjects, isLoading } = useSubjects();
  const { selectedSlugs, singleSelectedSlug, selectedOptions } = useFilter(navSubjects);

  const _syncQueryParam = toRef(syncQueryParam);

  const queryParamSync = useSyncQueryParam(
    'subject',
    selectedSlugs,
    (val: string) => (navSubjects.value || []).some((n) => n.slug == val),
    computed(() => !_syncQueryParam.value)
  );
  const routeParamSync = useSyncRouteParam(
    'subject',
    singleSelectedSlug,
    (val: string) => (navSubjects.value || []).some((n) => n.slug == val),
    _syncQueryParam
  );

  const initialiseSync = () => {
    if (_syncQueryParam.value) {
      queryParamSync.initialise();
    } else {
      routeParamSync.initialise();
    }
  };

  const initialised = computed(() =>
    _syncQueryParam.value ? queryParamSync.initialised.value : routeParamSync.initialised.value
  );

  watch(
    [isLoading, _syncQueryParam],
    () => {
      if (!isLoading.value) {
        initialiseSync();
      }
    },
    { immediate: true }
  );

  const bookMatchesFilter = (book: Book) =>
    selectedOptions.value.length == 0 || selectedOptions.value.some((o) => o.id == book.subject_id);

  return {
    options: navSubjects,
    selectedSlugs,
    singleSelectedSlug,
    selectedOptions,
    bookMatchesFilter,
    initialised,
  };
};

export const useLevelFilter = (syncQueryParam: Ref<boolean> | boolean) => {
  const { allLevels, isLoading } = useLevels();

  const { selectedSlugs, singleSelectedSlug, selectedOptions } = useFilter(allLevels);

  const _syncQueryParam = toRef(syncQueryParam);

  const queryParamSync = useSyncQueryParam(
    'level',
    selectedSlugs,
    (val: string) => (allLevels.value || []).some((n) => n.slug == val),
    computed(() => !_syncQueryParam.value)
  );
  const routeParamSync = useSyncRouteParam(
    'level',
    singleSelectedSlug,
    (val: string) => (allLevels.value || []).some((n) => n.slug == val),
    _syncQueryParam
  );

  const initialiseSync = () => {
    if (_syncQueryParam.value) {
      queryParamSync.initialise();
    } else {
      routeParamSync.initialise();
    }
  };

  const initialised = computed(() =>
    _syncQueryParam.value ? queryParamSync.initialised : routeParamSync.initialised
  );

  watch(
    [isLoading, _syncQueryParam],
    () => {
      if (!isLoading.value) {
        initialiseSync();
      }
    },
    { immediate: true }
  );

  const bookMatchesFilter = (book: Book) =>
    selectedOptions.value.length == 0 || selectedOptions.value.some((o) => o.id == book.level_id);

  return {
    options: allLevels,
    selectedSlugs,
    singleSelectedSlug,
    selectedOptions,
    bookMatchesFilter,
    initialised,
  };
};

export const useFormatFilter = () => {
  const options = ref([
    {
      id: 1,
      name: 'E-Book',
      slug: 'ebook',
    },
    { id: 2, name: 'Paperback', slug: 'paperback' },
  ]);
  const { selectedSlugs, selectedOptions } = useFilter(options);
  const { initialise, initialised } = useSyncQueryParam('format', selectedSlugs, (val: string) =>
    options.value.some((n) => n.slug == val)
  );
  onMounted(initialise);

  const productMatchesFilter = (product: Book | Bundle) => {
    if (selectedSlugs.value.length != 1) {
      return true;
    } else {
      const isEbookSelected = selectedSlugs.value[0] == 'ebook';
      return (
        (isEbookSelected && product.is_ebook == 1) || (!isEbookSelected && product.is_ebook == 0)
      );
    }
  };

  return {
    options,
    selectedSlugs,
    selectedOptions,
    bookMatchesFilter: productMatchesFilter,
    bundleMatchesFilter: productMatchesFilter,
    initialised,
  };
};

export const useResourceTypeFilter = () => {
  const { allResourceTypes, isLoading } = useResourceTypes();

  const extendedResourceTypes = computed(() => {
    if (allResourceTypes.value === undefined) {
      return [];
    } else {
      return [
        ...allResourceTypes.value,
        {
          id: 999999,
          slug: 'bundle',
          name: 'Bundle',
        } as ResourceType,
      ];
    }
  });

  const { selectedSlugs, selectedOptions } = useFilter(extendedResourceTypes);
  const { initialise, initialised } = useSyncQueryParam('type', selectedSlugs, (val: string) =>
    (extendedResourceTypes.value || []).some((n) => n.slug == val)
  );

  watch(
    isLoading,
    () => {
      if (!isLoading.value) {
        initialise();
      }
    },
    { immediate: true }
  );

  const isBundleOnly = computed(
    () => selectedSlugs.value.length == 1 && selectedSlugs.value[0] == 'bundle'
  );

  const bookMatchesFilter = (book: Book) =>
    selectedOptions.value.length == 0 ||
    isBundleOnly.value ||
    selectedOptions.value.some((o) => o.id == book.type_id);

  return {
    options: extendedResourceTypes,
    selectedSlugs,
    selectedOptions,
    bookMatchesFilter,
    isBundleOnly,
    initialised,
  };
};

export const useExamboardFilter = () => {
  const { allExamboards, isLoading } = useExamboards();

  const { selectedSlugs, selectedOptions } = useFilter(allExamboards);
  const { initialise, initialised } = useSyncQueryParam('examboard', selectedSlugs, (val: string) =>
    (allExamboards.value || []).some((n) => n.slug == val)
  );

  watch(
    isLoading,
    () => {
      if (!isLoading.value) {
        initialise();
      }
    },
    { immediate: true }
  );

  const bookMatchesFilter = (book: Book) =>
    selectedOptions.value.length == 0 ||
    selectedOptions.value.some((o) => o.id == book.examboard_id);

  return { options: allExamboards, selectedSlugs, selectedOptions, bookMatchesFilter, initialised };
};

export const useTitleFilter = () => {
  const route = useRoute();
  const bookMatchesFilter = (book: Book) => {
    const q = route.query.q;
    if (typeof q === 'string' && book.title.search(new RegExp(q, 'i')) === -1) {
      return false;
    } else {
      return true;
    }
  };

  return { bookMatchesFilter };
};

export const useFilteredBooks = (
  books: Ref<Book[] | null>,
  bookFilters: Ref<((book: Book) => boolean)[]> = ref([]),
  isBundleOnly: Ref<boolean>
) => {
  const filteredBooks = computed(() => {
    if (books.value == null || isBundleOnly.value) {
      return [];
    } else if (bookFilters.value.length == 0) {
      return books.value;
    } else {
      return books.value.filter((b) => bookFilters.value.every((f) => f(b)));
    }
  });

  return { filteredBooks };
};

export const useFilteredBundles = (
  bundles: Ref<Bundle[] | null>,
  bookFilters: Ref<((book: Book) => boolean)[]> = ref([]),
  bundleFilters: Ref<((book: Bundle) => boolean)[]> = ref([])
) => {
  const filteredBundles = computed(() => {
    if (bundles.value == null) {
      return [];
    } else if (bookFilters.value.length == 0 && bundleFilters.value.length == 0) {
      return bundles.value;
    } else {
      return bundles.value.filter((bundle) => {
        const bundleMatches =
          bundleFilters.value.length == 0 || bundleFilters.value.every((f) => f(bundle));
        const bookMatches =
          bookFilters.value.length == 0 ||
          bundle.books.some((book) => bookFilters.value.every((f) => f(book)));
        return bundleMatches && bookMatches;
      });
    }
  });

  return { filteredBundles };
};

export const usePaginatedProducts = (
  books: Ref<Book[]>,
  bundles: Ref<Bundle[]>,
  isProductsLoading: Ref<boolean>,
  itemsPerPage: Ref<number> | number
) => {
  const _itemsPerPage = toRef(itemsPerPage);
  const totalItems = computed(() => bundles.value.length + books.value.length);

  const maxPageIndex = computed(() => Math.ceil(totalItems.value / _itemsPerPage.value));
  const pageIndex = ref(1);
  watch([maxPageIndex, pageIndex, isProductsLoading], () => {
    if (!isProductsLoading.value && pageIndex.value > maxPageIndex.value) {
      pageIndex.value = 1;
    }
  });

  const { initialise } = useSyncQueryParam(
    'page',
    computed({
      get: () => {
        return pageIndex.value > 1 ? [String(pageIndex.value)] : [];
      },
      set: (paramVal?: string[]) => {
        if (paramVal && paramVal.length == 1) {
          pageIndex.value = parseInt(paramVal[0]) || 1;
        } else {
          pageIndex.value = 1;
        }
      },
    }),
    (pageParam: string) => {
      const parsedParam = parseInt(pageParam);
      return String(parsedParam) == pageParam;
    }
  );
  onMounted(initialise);

  const products = computed(() => {
    const allProducts = [...bundles.value, ...books.value];
    const startIndex = (pageIndex.value - 1) * _itemsPerPage.value;
    return allProducts.slice(startIndex, startIndex + _itemsPerPage.value);
  });

  return { pageIndex, totalItems, products };
};
