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

  export type UpdatedAddress = Omit<
    SavedAddress,
    'user_id' | 'created_at' | 'updated_at',
    'is_delivery_default' | 'is_billing_default'
  > & { is_delivery_default: boolean; is_billing_default: boolean };

  export type NewAddress = Omit<UpdatedAddress, 'id'>;

  export interface AuthState {
    allAddresses: SavedAddress[];
    currentAddress: SavedAddress | null;
    currentAddressLoading: boolean;
    updateAddressLoading: boolean;
    createAddressLoading: boolean;
  }

  export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    user_type: string;
    updated_at: string;
    created_at: string;
  };

  export interface AuthStore {
    state: AuthState;
    isGuest: ComputedRef<boolean>;
    user: User | null;
    fetchAddresses: () => Promise<void>;
    getAddressById: ({ id: string }) => void;
    updateAddress: (address: UpdatedAddress) => void;
    createAddress: (address: NewAddress) => void;
  }

  // Define the store explicitly to include the `state` property
  const useAuthStore: () => AuthStore;

  export { useAuthStore };
}
