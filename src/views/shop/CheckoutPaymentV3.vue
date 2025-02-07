<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';

import CheckoutLayout from './CheckoutLayout.vue';
import AddressForm from '@/components/forms/AddressForm.vue';

import { useCurrentOrder } from '@/composables/useCurrentOrder';
import { useValidatedObject } from '@/composables/useValidatedObject';
import type { Address } from '@/composables/useAddressForm';
import { isEqual } from 'lodash-es';

const breadcrumbs = [
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'Your Cart', path: '/checkout-payment-dev' },
];

const useObjectSync = <T,>(
  object: Ref<T>,
  syncObject: ComputedRef<T>,
  onUpdate: (newObject: T) => void
) => {
  watch(syncObject, () => {
    if (!isEqual(syncObject.value, object.value)) {
      object.value = syncObject.value;
    }
  });

  watch(object, () => {
    if (!isEqual(object.value, syncObject.value)) {
      onUpdate(object.value);
    }
  });
};

const {
  isLoading,
  deliveryAddress,
  billingAddress,
  setPartialDeliveryAddress,
  setPartialBillingAddress,
} = useCurrentOrder();

const _deliveryAddress = ref<Address>(deliveryAddress.value);
const { handleUpdated: handleDeliveryUpdated } = useValidatedObject<Address>(_deliveryAddress);
useObjectSync(_deliveryAddress, deliveryAddress, (newAddress: Address) => {
  console.log('useObjectSync: setPartialDeliveryAddress', newAddress);
  setPartialDeliveryAddress(newAddress);
});

const _billingAddress = ref<Address>(billingAddress.value);
const { handleUpdated: handleBillingUpdated } = useValidatedObject<Address>(_billingAddress);
useObjectSync(_billingAddress, billingAddress, (newAddress: Address) => {
  console.log('useObjectSync: setPartialBillingAddress', newAddress);
  setPartialBillingAddress(newAddress);
});
</script>

<template>
  <CheckoutLayout :breadcrumbs="breadcrumbs">
    <template #form>
      <AddressForm
        title="Delivery Address"
        id="delivery_address"
        :address="deliveryAddress"
        @updated="handleDeliveryUpdated"
      />
      <AddressForm
        title="Billing Address"
        id="billing_address"
        :address="billingAddress"
        @updated="handleBillingUpdated"
      />
    </template>
    <template #order>
      <p>I'm the order</p>
      <p>isLoading: {{ isLoading }}</p>
    </template>
  </CheckoutLayout>
</template>

<style scoped></style>
