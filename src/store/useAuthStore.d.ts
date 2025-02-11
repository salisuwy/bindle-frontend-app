import type { ComputedRef } from 'vue';

declare module '@/store/useAuthStore' {
  export type SavedAddress = {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address1: string;
    address2: string | null;
    town: string | null;
    city: string;
    zip: string;
    country: string;
    is_delivery_default: 0 | 1;
    is_billing_default: 0 | 1;
    created_at: string;
    updated_at: string;
  };

  export interface AuthState {
    allAddresses: SavedAddress[];
  }

  export interface AuthStore {
    state: AuthState;
    isGuest: ComputedRef<boolen>;
    fetchAddresses: () => Promise<void>;
  }

  // Define the store explicitly to include the `state` property
  const useAuthStore: () => AuthStore;

  export { useAuthStore };
}
