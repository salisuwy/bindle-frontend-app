import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { apiClient } from './axiosClient';
import { useAuthStore } from '@/store/useAuthStore';

/*
This file contains implementations of user profile API data refactored to use tanstack query. Any implementations
of the same API data in authStore should be considered deprecated.
*/

export const useOrders = () => {
  const authStore = useAuthStore();

  const queryClient = useQueryClient();

  const { data, isPending, isLoading, isError } = useQuery<any[] | null>({
    queryKey: ['profile', 'orders', authStore.user?.id],
    staleTime: Infinity,
    queryFn: async ({ queryKey: currentQueryKey }) => {
      if (authStore.user) {
        // remove any cached queries for other users
        queryClient.removeQueries({
          queryKey: ['profile', 'orders'],
          predicate: ({ queryKey }) => queryKey[2] != currentQueryKey[2],
        });
        const resp = await apiClient.get(`profile/orders?per_page=999999`);
        return resp.data.data;
      } else {
        return null;
      }
    },
  });

  return { data, isPending, isLoading, isError };
};
