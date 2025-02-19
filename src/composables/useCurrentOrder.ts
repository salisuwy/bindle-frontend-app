import { computed, ref } from 'vue';

import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { getOrderCart, setOrderAddressPartial, setOrderAddress, setUuid } from '@/store/cart-api';

import { EMPTY_ADDRESS, type Address } from './useAddressForm';
import type {
  OrderCartResponse,
  OrderDeliveryAddress,
  OrderBillingAddress,
  OrderAddressArg,
} from '@/store/cart-api';

import { typedKeys } from '@/components/helpers/tsUtils';

export const convertToDeliveryAddress = (address: Partial<Address>): OrderDeliveryAddress =>
  typedKeys(address).reduce((deliveryAddress, key) => {
    deliveryAddress[`delivery_${key}`] = address[key] || '';
    return deliveryAddress;
  }, {} as Partial<OrderDeliveryAddress>) as OrderDeliveryAddress;

export const convertToBillingAddress = (address: Partial<Address>): OrderBillingAddress =>
  typedKeys(address).reduce((billingAddress, key) => {
    billingAddress[`billing_${key}`] = address[key] || '';
    return billingAddress;
  }, {} as Partial<OrderBillingAddress>) as OrderBillingAddress;

export const useCurrentOrder = ({
  onFirstCall,
}: { onFirstCall?: (data: OrderCartResponse) => void } = {}) => {
  let firstCallPerformed = false;

  const { data, isLoading } = useQuery<OrderCartResponse>({
    queryKey: ['cartItems'],
    queryFn: async () => {
      console.log('useCurrentOrder: queryFn');
      const data = await getOrderCart();
      if (!firstCallPerformed && onFirstCall) {
        onFirstCall(data);
      }
      firstCallPerformed = true;
      return data;
    },
  });

  const order = computed(() => {
    return data.value?.order;
  });

  const bookStock = computed(() => {
    return data.value?.order?.book_stock ?? {};
  });

  const bundleStock = computed(() => {
    return data.value?.order?.bundle_stock ?? {};
  });

  const cartItems = computed(() => {
    return data.value?.order?.items ?? [];
  });

  const coupons = computed(() => {
    return data.value?.order?.coupons ?? [];
  });

  const deliveryAddress = computed<Partial<Address>>(() => {
    if (order.value === undefined) {
      return { ...EMPTY_ADDRESS };
    } else {
      return {
        first_name: order.value.delivery_first_name,
        last_name: order.value.delivery_last_name,
        phone: order.value.delivery_phone,
        email: order.value.delivery_email,
        address1: order.value.delivery_address1,
        address2: order.value.delivery_address2,
        city: order.value.delivery_city,
        zip: order.value.delivery_zip,
        country: order.value.delivery_country,
      };
    }
  });

  const billingAddress = computed<Partial<Address>>(() => {
    if (order.value === undefined) {
      return { ...EMPTY_ADDRESS };
    } else {
      return {
        first_name: order.value.billing_first_name,
        last_name: order.value.billing_last_name,
        phone: order.value.billing_phone,
        email: order.value.billing_email,
        address1: order.value.billing_address1,
        address2: order.value.billing_address2,
        city: order.value.billing_city,
        zip: order.value.billing_zip,
        country: order.value.billing_country,
      };
    }
  });

  const queryClient = useQueryClient();
  const { mutate: mutateAddress } = useMutation({
    mutationFn: async ({
      isPartial,
      payload,
    }:
      | {
          isPartial: true;
          payload: Partial<OrderAddressArg>;
        }
      | { isPartial: false; payload: OrderAddressArg }) => {
      if (isPartial) {
        return await setOrderAddressPartial(payload);
      } else {
        return await setOrderAddress(payload);
      }
    },
    onError: (error) => {
      console.error('mutateAddress error', error);
    },
    onSuccess: ({ order }, variables) => {
      setUuid(order.uuid);
    },
    onSettled: (newData) => {
      if (newData !== undefined) {
        queryClient.setQueryData(['cartItems'], (oldData: OrderCartResponse) => {
          const updatedData = oldData
            ? {
                order: { ...oldData.order, ...newData.order },
              }
            : oldData;
          return updatedData;
        });
      }
    },
  });

  const setPartialDeliveryAddress = (address: Partial<Address>, billingSameAsDelivery = false) =>
    mutateAddress({
      isPartial: true,
      payload: billingSameAsDelivery
        ? Object.assign({}, convertToDeliveryAddress(address), convertToBillingAddress(address))
        : convertToDeliveryAddress(address),
    });

  const setPartialBillingAddress = (address: Partial<Address>) =>
    mutateAddress({ isPartial: true, payload: convertToBillingAddress(address) });

  const setFinalAddresses = ({
    deliveryAddress,
    billingAddress,
  }: {
    deliveryAddress: Address;
    billingAddress: Address;
  }) =>
    mutateAddress({
      isPartial: false,
      payload: {
        ...convertToDeliveryAddress(deliveryAddress),
        ...convertToBillingAddress(billingAddress),
      },
    });

  return {
    isLoading,
    order,
    bookStock,
    bundleStock,
    cartItems,
    coupons,
    deliveryAddress,
    billingAddress,
    setPartialDeliveryAddress,
    setPartialBillingAddress,
    setFinalAddresses,
  };
};
