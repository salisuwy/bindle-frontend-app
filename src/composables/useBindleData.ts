import { ref, computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { apiClient } from './axiosClient';

import { keyBy } from 'lodash-es';

const useMenuItemQuery = <T>(key: string, endpoint: string) => {
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
  const { data: allSubjects, isLoading } = useMenuItemQuery<Subject>(
    'subjects',
    'v2/subjects?per_page=999999'
  );
  const navSubjects = computed(() => allSubjects?.value?.filter((s) => s.show_on_nav));
  return { allSubjects, navSubjects, isLoading };
};

export type ResourceType = Category;
export const useResourceTypes = () => {
  const { data: allResourceTypes, isLoading } = useMenuItemQuery<ResourceType>(
    'types',
    'v2/types?per_page=999999'
  );
  return { allResourceTypes, isLoading };
};

export type Level = Category;

export const useLevels = () => {
  const { data: allLevels, isLoading } = useMenuItemQuery<Level>(
    'levels',
    'v2/levels?per_page=999999'
  );
  return { allLevels, isLoading };
};

export type Examboard = Category;

export const useExamboards = () => {
  const { data: allExamboards, isLoading } = useMenuItemQuery<Examboard>(
    'examboards',
    'v2/examboards?per_page=999999'
  );
  return { allExamboards, isLoading };
};

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
  image_url: string[];
  images_urls: string;
  view_count: 0;
  is_ebook: 0;
  price_currency: string;
  price_amount: string | number;
  price_ebook: string | number;
  price_total_of_books: string | number;
  price_ebook_total_of_books: string | number;
  quantity_in_stock: string | number;
  supply_quantity: string | number;
  books: Book[];
};

export const usePopularBooks = (nBooks: 4) => {
  console.log('usePopularBooks() called');

  const { data } = useQuery({
    queryKey: ['books', 'popular', nBooks],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      console.log('usePopularBooks: queryFn called');
      const resp = await apiClient.get<{
        data: JoinedBook<{ level: Level; subject: Subject; types: ResourceType[] }>[];
      }>(`v2/books?per_page=${nBooks}&sort=-view_count&include=level,subject,types`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const { applyStockOverrides } = useOverrideBookStock();
  const books = computed(() => applyStockOverrides(Object.values(data.value || {})));
  return { books };
};

export const usePopularBundles = (nBundles: 4) => {
  console.log('usePopularBundles() called');

  const { data } = useQuery({
    queryKey: ['bundles', 'popular', nBundles],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      console.log('usePopularBundles: queryFn called');
      const resp = await apiClient.get<{
        data: Bundle[];
      }>(`v2/bindles?per_page=${nBundles}&sort=-view_count`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const bundles = computed(() => Object.values(data.value || {}));
  return { bundles };
};

const bookStockOverrides = ref<Record<string, number>>({});
export const useOverrideBookStock = () => {
  const setBookStockOverride = (bookStock?: Record<string, number>) => {
    bookStockOverrides.value = { ...(bookStock || {}) };
  };

  const applyStockOverrides = (books: Book[]) => {
    const idsToOverride = Array.from(Object.keys(bookStockOverrides.value));
    return books.map((book) => {
      if (idsToOverride.includes(String(book.id))) {
        return { ...book, quantity_in_stock: bookStockOverrides.value[book.id] };
      } else {
        return book;
      }
    });
  };

  return { setBookStockOverride, applyStockOverrides };
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
            console.log(`udpating stock of ${id} to ${newStock}`);
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
  console.log('useBooks() called');

  const { data, isLoading } = useQuery({
    queryKey: ['books', 'all'],
    staleTime: Infinity,
    queryFn: async () => {
      const resp = await apiClient.get<{
        data: Book[];
      }>(`v2/books?per_page=999999`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const { applyStockOverrides } = useOverrideBookStock();
  const books = computed(() => applyStockOverrides(Object.values(data.value || {})));
  return { books, isLoading };
};

export const useBundles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['bundles', 'all'],
    staleTime: Infinity,
    queryFn: async () => {
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
