import { computed } from 'vue';
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

export type Subject = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  show_on_nav: boolean;
};

export const useSubjects = () => {
  const { data: allSubjects, isLoading } = useMenuItemQuery<Subject>(
    'subjects',
    'v2/subjects?per_page=100'
  );
  const navSubjects = computed(() => allSubjects?.value?.filter((s) => s.show_on_nav));
  return { allSubjects, navSubjects, isLoading };
};

export type ResourceType = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export const useResourceTypes = () => {
  const { data: allResourceTypes, isLoading } = useMenuItemQuery<ResourceType>(
    'types',
    'v2/types?per_page=100'
  );
  return { allResourceTypes, isLoading };
};

export type Level = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export const useLevels = () => {
  const { data: allLevels, isLoading } = useMenuItemQuery<Level>(
    'levels',
    'v2/levels?per_page=100'
  );
  return { allLevels, isLoading };
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

export type Bindle = {
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
  const { data } = useQuery({
    queryKey: ['books', 'popular', nBooks],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      const resp = await apiClient.get<{
        data: JoinedBook<{ level: Level; subject: Subject; types: ResourceType[] }>[];
      }>(`v2/books?per_page=${nBooks}&sort=-view_count&include=level,subject,types`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const books = computed(() => Object.values(data.value || []));
  return { books };
};

export const usePopularBundles = (nBundles: 4) => {
  const { data } = useQuery({
    queryKey: ['bundles', 'popular', nBundles],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      const resp = await apiClient.get<{
        data: Bindle[];
      }>(`v2/bindles?per_page=${nBundles}&sort=-view_count`);
      return keyBy(resp.data.data, 'id');
    },
  });

  const bundles = computed(() => Object.values(data.value || []));
  return { bundles };
};

export const updateBookStock = (bookStock?: Record<number, number>) => {
  if (bookStock === undefined) {
    return;
  }

  const queryClient = useQueryClient();
  queryClient.setQueriesData({ queryKey: ['books'] }, (oldData?: Record<string, Book>) => {
    if (oldData !== undefined) {
      Object.entries(bookStock).forEach(([id, newStock]) => {
        if (id in oldData) {
          oldData[id].quantity_in_stock = newStock;
        }
      });
    }
    return oldData;
  });
};
