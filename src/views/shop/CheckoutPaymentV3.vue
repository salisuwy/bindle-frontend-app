<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { isEqual } from 'lodash-es';

import AddressForm from '@/components/forms/AddressForm.vue';
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue';

import CheckoutLayout from './CheckoutLayout.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';

import { useCurrentOrder } from '@/composables/useCurrentOrder';
import { useValidatedObject } from '@/composables/useValidatedObject';
import type { Address } from '@/composables/useAddressForm';
import { DeferredPromise } from '@/components/helpers/tsUtils';

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
  order,
  cartItems,
  bookStock,
  bundleStock,
  deliveryAddress,
  billingAddress,
  setPartialDeliveryAddress,
  setPartialBillingAddress,
} = useCurrentOrder();

const _deliveryAddress = ref<Address>(deliveryAddress.value);
const showDeliveryAddressErrors = ref(false);
const { isValid: isDeliveryAddressValid, handleUpdated: handleDeliveryUpdated } =
  useValidatedObject<Address>(_deliveryAddress);
useObjectSync(_deliveryAddress, deliveryAddress, (newAddress: Address) => {
  console.log('useObjectSync: setPartialDeliveryAddress', newAddress);
  setPartialDeliveryAddress(newAddress);
});

const _billingAddress = ref<Address>(billingAddress.value);
const showBillingAddressErrors = ref(false);
const { isValid: isBillingAddressValid, handleUpdated: handleBillingUpdated } =
  useValidatedObject<Address>(_billingAddress);
useObjectSync(_billingAddress, billingAddress, (newAddress: Address) => {
  console.log('useObjectSync: setPartialBillingAddress', newAddress);
  setPartialBillingAddress(newAddress);
});

const disable = ref(false);
const paymentTransition = ref(0);
let paymentProcessingPromise = new DeferredPromise<void>();
const handleStartPayment = () => {
  console.log('handleStartPayment');
};
const handleEndPayment = () => {
  console.log('handleStartPayment');
  paymentProcessingPromise.resolve();
};

/*
Our validation logic relies on the fact that address validation takes place
on blur and that blur events and handlers will complete before click events.
Therefore, it's important that the form validation remains synchronous. Any async
functions in the chain will break this guarantee.
*/
const handleClick = async () => {
  console.log('Button clicked!');
  if (!isDeliveryAddressValid.value) {
    showDeliveryAddressErrors.value = true;
    document.getElementById('delivery_address')?.scrollIntoView({ behavior: 'smooth' });
  } else if (!isBillingAddressValid.value) {
    showBillingAddressErrors.value = true;
    document.getElementById('billing_address')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.log('We can place the order!');
    paymentProcessingPromise = new DeferredPromise<void>();
    paymentTransition.value += 1;
    await paymentProcessingPromise.promise;
    console.log('Payment flow finished');
  }
};
</script>

<template>
  <CheckoutLayout :breadcrumbs="breadcrumbs">
    <template #form>
      <AddressForm
        title="Delivery Address"
        id="delivery_address"
        :address="deliveryAddress"
        :showAllErrors="showDeliveryAddressErrors"
        @updated="handleDeliveryUpdated"
      />
      <AddressForm
        title="Billing Address"
        id="billing_address"
        :address="billingAddress"
        :showAllErrors="showBillingAddressErrors"
        @updated="handleBillingUpdated"
      />

      <div
        class="flex flex-col justify-center items-center rounded-md border border-solid border-zinc-200 p-5 mt-0 max-md:max-w-full"
      >
        <button
          class="flex justify-center items-center px-3.5 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5 w-full md:w-full"
          @click="handleClick"
          :disabled="disable"
        >
          <SpinnerIcon v-if="disable" class="w-5 h-5 mr-2 animate-spin" />
          <span v-if="!disable"> Place Order </span>
        </button>
      </div>
    </template>
    <template #order>
      <ShoppingCart
        :items="cartItems"
        :bookStock="bookStock"
        :bundleStock="bundleStock"
        :editable="false"
        :showTotalItemsCount="true"
        title="Order Summary"
        :showScrollBar="true"
        cssClasses="border-none !px-0 !py-0"
      />
      <PriceDetails class="mt-5" :order="order" :showDivider="false" :showAsAccordion="true" />
    </template>
  </CheckoutLayout>
</template>

<style scoped></style>
