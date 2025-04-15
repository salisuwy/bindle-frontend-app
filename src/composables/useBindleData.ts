import { ref, computed, watch, toRef } from 'vue';
import type { Ref } from 'vue';

import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { apiClient } from './axiosClient';
import { Util } from '@/components/helpers/Util.js';
import { keyBy } from 'lodash-es';
import { consoleLog } from '@/components/helpers/tsUtils';

const useCategoryQuery = <T>(key: string, endpoint: string) => {
  return useQuery<T[]>({
    queryKey: [key],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      const resp = await apiClient.get<{ data: T[] }>(endpoint);
      return resp.data.data;
    },
  });
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export type Subject = Category & {
  show_on_nav: boolean;
};

export const useSubjects = () => {
  const { data: allSubjects, isLoading } = useCategoryQuery<Subject>(
    'subjects',
    'v2/subjects?per_page=999999'
  );
  const navSubjects = computed(() => allSubjects?.value?.filter((s) => s.show_on_nav));
  return { allSubjects, navSubjects, isLoading };
};
export const useSubject = (
  product: Ref<{ subject?: Subject; subject_id: number | null } | undefined>
) => {
  const { allSubjects } = useSubjects();
  const subject = computed<Subject | undefined>(() => {
    if (product.value === undefined) {
      return undefined;
    } else if (product.value.subject) {
      return product.value.subject;
    } else if (product.value.subject_id) {
      return getCategoryById(product.value.subject_id, allSubjects.value);
    } else {
      return undefined;
    }
  });

  return { subject };
};

export type ResourceType = Category;
export const useResourceTypes = () => {
  const { data: allResourceTypes, isLoading } = useCategoryQuery<ResourceType>(
    'types',
    'v2/types?per_page=999999'
  );
  return { allResourceTypes, isLoading };
};
export const useResourceType = (
  product: Ref<{ types?: ResourceType[]; type_id: number | null } | undefined>
) => {
  const { allResourceTypes } = useResourceTypes();
  const resourceTypes = computed<ResourceType[] | undefined>(() => {
    if (product.value === undefined) {
      return undefined;
    } else if (product.value.types) {
      return product.value.types;
    } else if (product.value.type_id) {
      const type = getCategoryById(product.value.type_id, allResourceTypes.value);
      return type ? [type] : undefined;
    } else {
      return undefined;
    }
  });

  return { resourceTypes };
};

export type Level = Category;

export const useLevels = () => {
  const { data: allLevels, isLoading } = useCategoryQuery<Level>(
    'levels',
    'v2/levels?per_page=999999'
  );
  return { allLevels, isLoading };
};
export const useLevel = (product: Ref<{ level?: Level; level_id: number | null } | undefined>) => {
  const { allLevels } = useLevels();
  const level = computed<Level | undefined>(() => {
    if (product.value === undefined) {
      return undefined;
    } else if (product.value.level) {
      return product.value.level;
    } else if (product.value.level_id) {
      return getCategoryById(product.value.level_id, allLevels.value);
    } else {
      return undefined;
    }
  });
  return { level };
};

export type Examboard = Category;

export const useExamboards = () => {
  const { data: allExamboards, isLoading } = useCategoryQuery<Examboard>(
    'examboards',
    'v2/examboards?per_page=999999'
  );
  return { allExamboards, isLoading };
};
export const useExamboard = (
  product: Ref<{ examboard?: Examboard; examboard_id: number | null } | undefined>
) => {
  const { allExamboards } = useExamboards();
  const examboard = computed<Examboard | undefined>(() => {
    if (product.value === undefined) {
      return undefined;
    } else if (product.value.examboard) {
      return product.value.examboard;
    } else if (product.value.examboard_id) {
      return getCategoryById(product.value.examboard_id, allExamboards.value);
    } else {
      return undefined;
    }
  });
  return { examboard };
};

export const getCategoryById = <T extends Category>(id: number, categories?: T[]): T | undefined =>
  categories ? categories.find((c) => c.id == id) : undefined;

export const getCategoriesByIds = <T extends Category>(
  ids: number[],
  categories?: T[]
): T[] | undefined =>
  categories
    ? ids.flatMap((id) => {
        const category = getCategoryById(id, categories);
        return category ? [category] : [];
      })
    : undefined;

// https://staging-backend.bindle.co.uk/docs/api#/schemas/BookResource
export type Book = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  isbn: string | null;
  isbn_10: string | null;
  is_ebook: number;
  isbn_ebook: string | null;
  quantity_in_stock: number | null;
  supply_quantity: number | null;
  price_amount: string;
  price_ebook: string;
  price_currency: string;
  subject_id: number | null;
  level_id: number | null;
  examboard_id: number | null;
  type_id: number | null;
  view_count: number;
  author: string | null;
  publisher: string | null;
  publish_date: number | null;
  series: string | null;
  weight: string | null;
  dimension: string | null;
  pages: number | null;
};

export type JoinedBook<Joins extends Record<string, Level | Subject | ResourceType[]>> = Book &
  Joins;

export type Bundle = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  is_core_bundle: true;
  is_featured: 0;
  image_url: { main: string; mid: string; thumb: string };
  images_urls: string;
  view_count: 0;
  is_ebook: number;
  price_currency: string;
  price_amount: string | number;
  price_ebook: string | number;
  price_total_of_books: string | number;
  price_ebook_total_of_books: string | number;
  active_discount: {
    id: number;
    percentage: string;
  } | null;
  quantity_in_stock: string | number;
  supply_quantity: string | number;
  books: Book[];
};

export type JoinedBundle<
  Joins extends Record<string, Level[] | Examboard[] | Subject[] | ResourceType[]>,
> = Bundle & Joins;

export const usePopularBooks = (nBooks: number) => {
  consoleLog('usePopularBooks() called');

  const { data } = useQuery({
    queryKey: ['books', 'popular', nBooks],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      consoleLog('usePopularBooks: queryFn called');
      const resp = await apiClient.get<{
        data: JoinedBook<{ level: Level; subject: Subject; types: ResourceType[] }>[];
      }>(`v2/books?per_page=${nBooks}&sort=-view_count&include=level,subject,types`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const { applyBookStockOverrides } = useOverrideBookStock();
  const books = computed(() => applyBookStockOverrides(Object.values(data.value || {})));
  return { books };
};

export const usePopularBundles = (
  nBundles: number,
  levelSlug?: Ref<string | undefined> | string | undefined
) => {
  consoleLog('usePopularBundles() called');

  const _levelSlug = toRef(levelSlug);

  const { data } = useQuery({
    queryKey: ['bundles', 'popular', nBundles],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      consoleLog('usePopularBundles: queryFn called');
      const resp = await apiClient.get<{
        data: Bundle[];
      }>(`v2/bindles?per_page=${nBundles}&sort=-view_count`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const { bundles: allBundles } = useBundles();
  const { allLevels } = useLevels();

  const bundles = computed(() => {
    if (_levelSlug.value === undefined) {
      return Object.values(data.value || {});
    }

    // Currently the v2 api does not allow filtering by level, so we have to fetch all
    // bundles to perform the filter.
    const level = allLevels.value?.find((c) => c.slug == _levelSlug.value);
    if (level !== undefined) {
      return allBundles.value
        .filter((bundle) => bundle.books.some((b) => b.level_id == level.id))
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, nBundles);
    }
    return [];
  });
  return { bundles };
};

const bookStockOverrides = ref<Record<string, number>>({});
export const useOverrideBookStock = () => {
  const setBookStockOverride = (bookStock?: Record<string, number>) => {
    bookStockOverrides.value = { ...(bookStock || {}) };
  };

  const applyBookStockOverrides = (books: Book[]) => {
    const idsToOverride = Array.from(Object.keys(bookStockOverrides.value));
    return books.map((book) => {
      if (idsToOverride.includes(String(book.id))) {
        return { ...book, quantity_in_stock: bookStockOverrides.value[book.id] };
      } else {
        return book;
      }
    });
  };

  return { setBookStockOverride, applyBookStockOverrides };
};

const bundleStockOverrides = ref<Record<string, number>>({});
export const useOverrideBundleStock = () => {
  const setBundleStockOverride = (bookStock?: Record<string, number>) => {
    bundleStockOverrides.value = { ...(bookStock || {}) };
  };

  const applyBundleStockOverrides = (bundles: Bundle[]) => {
    const idsToOverride = Array.from(Object.keys(bundleStockOverrides.value));
    return bundles.map((bundle) => {
      if (idsToOverride.includes(String(bundle.id))) {
        return { ...bundle, quantity_in_stock: bundleStockOverrides.value[bundle.id] };
      } else {
        return bundle;
      }
    });
  };

  return { setBundleStockOverride, applyBundleStockOverrides };
};

export const useUpdateBookStock = () => {
  const queryClient = useQueryClient();

  const updateBookStock = (bookStock?: Record<number, number>) => {
    if (bookStock === undefined) {
      return;
    }

    queryClient.setQueriesData({ queryKey: ['books'] }, (oldData?: Record<string, Book>) => {
      if (oldData === undefined) {
        return undefined;
      } else {
        const dataCopy = structuredClone(oldData);
        Object.entries(bookStock).forEach(([id, newStock]) => {
          if (id in dataCopy) {
            consoleLog(`udpating stock of ${id} to ${newStock}`);
            dataCopy[id].quantity_in_stock = newStock;
          }
        });
        return dataCopy;
      }
    });
  };

  return { updateBookStock };
};

export const useBooks = () => {
  consoleLog('useBooks() called');

  const { data, isLoading } = useQuery({
    queryKey: ['books', 'all'],
    staleTime: Infinity,
    queryFn: async () => {
      consoleLog('useBooks() queryFn');
      const resp = await apiClient.get<{
        data: Book[];
      }>(`v2/books?per_page=999999`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const { applyBookStockOverrides } = useOverrideBookStock();
  const books = computed(() => applyBookStockOverrides(Object.values(data.value || {})));
  return { books, isLoading };
};

export const useBundles = () => {
  consoleLog('useBundles() called');

  const { data, isLoading } = useQuery({
    queryKey: ['bundles', 'all'],
    staleTime: Infinity,
    queryFn: async () => {
      consoleLog('useBundles() queryFn');
      const resp = await apiClient.get<{
        data: Bundle[];
      }>(`v2/bindles?per_page=999999`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const bundles = computed(() => Object.values(data.value || {}));
  return { bundles, isLoading };
};

export const isBundle = (product: Book | Bundle): product is Bundle => 'books' in product;
export const isBook = (product: Book | Bundle): product is Book => !isBundle(product);

export const useBundle = (slug: Ref<string>) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bundles', { slug }],
    queryFn: async () => {
      const resp = await apiClient.get<{
        data: JoinedBundle<{ levels: Level[]; examboards: Examboard[]; subjects: Subject[] }>;
      }>(`v2/bindles/${encodeURI(slug.value)}?include=levels,examboards,subjects`);
      return resp.data.data;
    },
  });

  return { bundle: data, isLoading, isError };
};

export const useBundleDetails = (
  bundle: Ref<
    JoinedBundle<{ levels: Level[]; examboards: Examboard[]; subjects: Subject[] }> | undefined
  >
) => {
  const levels = computed(() =>
    bundle.value === undefined ? [] : bundle.value.levels.map((v) => v.name)
  );
  const examboards = computed(() =>
    bundle.value === undefined ? [] : bundle.value.examboards.map((v) => v.name)
  );
  const subjects = computed(() =>
    bundle.value === undefined ? [] : bundle.value.subjects.map((v) => v.name)
  );

  const { allResourceTypes } = useResourceTypes();
  const types = computed(() =>
    bundle.value === undefined || allResourceTypes.value === undefined
      ? []
      : bundle.value.books.flatMap((b) => {
          const resourceType = allResourceTypes.value.find((t) => t.id == b.type_id);
          return resourceType ? [resourceType.name] : [];
        })
  );

  const tags = computed(() => [...levels.value, ...examboards.value, ...subjects.value]);

  const ebookSelected = ref(false);
  watch(bundle, () => {
    if (bundle.value) {
      ebookSelected.value = bundle.value.is_ebook == 1;
    }
  });

  const price = computed(() => {
    if (bundle.value === undefined) return '';
    return ebookSelected.value
      ? Util.toFixedDisplay(bundle.value.price_ebook, 2)
      : Util.toFixedDisplay(bundle.value.price_amount, 2);
  });

  const priceTotalBooks = computed(() => {
    if (bundle.value === undefined) return '';
    return ebookSelected.value
      ? Util.toFixedDisplay(bundle.value.price_ebook_total_of_books, 2)
      : Util.toFixedDisplay(bundle.value.price_total_of_books, 2);
  });

  const { applyBundleStockOverrides } = useOverrideBundleStock();
  const itemsInStock = computed(() => {
    if (bundle.value === undefined) {
      return 0;
    } else {
      return +applyBundleStockOverrides([bundle.value])[0].quantity_in_stock;
    }
  });

  return {
    levels,
    examboards,
    subjects,
    types,
    tags,
    price,
    priceTotalBooks,
    itemsInStock,
    ebookSelected,
  };
};

export const useBook = (slug: Ref<string> | string) => {
  const _slug = toRef(slug);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bundles', { slug: _slug }],
    queryFn: async () => {
      const resp = await apiClient.get<{
        data: JoinedBook<{
          level: Level;
          subject: Subject;
          examboard: Examboard;
          types: ResourceType[];
        }>;
      }>(`v2/books/${encodeURI(_slug.value)}?include=subject,level,examboard,types`);
      return resp.data.data;
    },
  });

  return { book: data, isLoading, isError };
};

export const useBookDetails = (
  book: Ref<
    | JoinedBook<{
        level?: Level;
        subject?: Subject;
        examboard?: Examboard;
        types?: ResourceType[];
      }>
    | undefined
  >
) => {
  const { level } = useLevel(book);
  const { subject } = useSubject(book);
  const { resourceTypes } = useResourceType(book);
  const { examboard } = useExamboard(book);

  const tags = computed(() =>
    [level.value, examboard.value, subject.value].filter((t) => t !== undefined)
  );

  const productUrl = computed<string | undefined>(() => {
    if (!level.value || !subject.value || !book.value) {
      return undefined;
    } else {
      return '/' + level.value.slug + '/' + subject.value.slug + '/' + book.value.slug;
    }
  });

  const priceEbook = computed(() =>
    book.value === undefined ? '' : Util.toFixedDisplay(book.value.price_ebook, 2)
  );

  const pricePaperback = computed(() =>
    book.value === undefined ? '' : Util.toFixedDisplay(book.value.price_amount, 2)
  );

  const price = computed<string>(() => {
    if (!book.value) {
      return '';
    } else {
      return ebookSelected.value ? priceEbook.value : pricePaperback.value;
    }
  });

  const bookImage = computed(() => {
    return book.value === undefined
      ? Util.getPlaceholderBookImage(1)
      : Util.ensureSsl(book.value.image_url);
  });

  const ebookSelected = ref(false);
  watch(book, () => {
    if (book.value) {
      ebookSelected.value = book.value.is_ebook == 1;
    }
  });

  const { applyBookStockOverrides } = useOverrideBookStock();
  const itemsInStock = computed(() => {
    if (book.value === undefined) {
      return 0;
    } else {
      return applyBookStockOverrides([book.value])[0].quantity_in_stock || 0;
    }
  });

  return {
    level,
    subject,
    resourceTypes,
    examboard,
    tags,
    productUrl,
    price,
    priceEbook,
    pricePaperback,
    bookImage,
    ebookSelected,
    itemsInStock,
  };
};
