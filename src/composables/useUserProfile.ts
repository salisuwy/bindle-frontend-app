import { useQuery } from '@tanstack/vue-query';
import { apiClient } from './axiosClient';
import { useAuthStore } from '@/store/useAuthStore';

/*
This file contains implementations of user profile API data refactored to use tanstack query. Any implementations
of the same API data in authStore should be considered deprecated.
*/

export const useOrders = () => {
  const authStore = useAuthStore();

  const { data, isPending, isLoading, isError } = useQuery<any[] | undefined>({
    queryKey: ['profile', authStore.user?.id, 'orders'],
    staleTime: Infinity,
    queryFn: async () => {
      if (authStore.user) {
        const resp = await apiClient.get(`profile/orders?per_page=999999`);
        return resp.data.data;
      } else {
        return undefined;
      }
    },
  });

  return { data, isPending, isLoading, isError };
};
