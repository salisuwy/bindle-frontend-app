<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { isEqual } from 'lodash-es';

import AddressForm from '@/components/forms/AddressForm.vue';
import BindleButton from '@/components/BindleButton.vue';
import BindleCheckbox from '@/components/BindleCheckbox.vue';
import AddressSelector from '@/components/forms/AddressSelector.vue';

import CheckoutLayout from './CheckoutLayout.vue';
import FormPayment from './components/FormPayment.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';

import { useAuthStore } from '@/store/useAuthStore';
import { useCurrentOrder, orderAddressesMatch } from '@/composables/useCurrentOrder';
import { useValidatedObject } from '@/composables/useValidatedObject';
import { EMPTY_ADDRESS, type Address } from '@/composables/useAddressForm';
import { DeferredPromise } from '@/components/helpers/tsUtils';
import type { OrderCartResponse } from '@/store/cart-api';
import { consoleLog } from '@/components/helpers/tsUtils';

const breadcrumbs = [
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'Your Cart', path: '/checkout-payment' },
];

const useObjectSync = <T,>(
  object: Ref<T>,
  syncObject: ComputedRef<T>,
  onUpdate: (newObject: T) => void,
  label?: string
) => {
  watch(syncObject, () => {
    consoleLog(label, 'syncObject has changed');
    if (!isEqual(syncObject.value, object.value)) {
      consoleLog(
        label,
        'synching object with syncObject',
        { ...syncObject.value },
        { ...object.value }
      );
      object.value = syncObject.value;
    }
  });

  watch(object, () => {
    if (!isEqual(object.value, syncObject.value)) {
      consoleLog(label, 'calling onUpdate with object');
      onUpdate(object.value);
    }
  });
};

const authStore = useAuthStore();
onMounted(async () => {
  await authStore.fetchAddresses();
});

const useDeliveryForBilling = ref(true);

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
} = useCurrentOrder({
  onFirstCall: (data: OrderCartResponse) => {
    if (orderAddressesMatch(data)) {
      useDeliveryForBilling.value = true;
    }
  },
});

const _deliveryAddress = ref<Address>(deliveryAddress.value);
const showDeliveryAddressErrors = ref(false);
watch(_deliveryAddress, () => (showDeliveryAddressErrors.value = false));

const { isValid: isDeliveryAddressValid, handleUpdated: handleDeliveryUpdated } =
  useValidatedObject<Address>(_deliveryAddress);

useObjectSync(
  _deliveryAddress,
  deliveryAddress,
  (newAddress: Address) => {
    consoleLog('useObjectSync: setPartialDeliveryAddress', newAddress);
    setPartialDeliveryAddress(newAddress, useDeliveryForBilling.value);
  },
  'delivery address'
);

const newDeliveryAddress = ref(false);
const handleNewDeliveryAddress = async () => {
  _deliveryAddress.value = { ...EMPTY_ADDRESS };
  newDeliveryAddress.value = true;
  await nextTick();
  document.getElementById('delivery_address')?.scrollIntoView({ behavior: 'smooth' });
};

const _billingAddress = ref<Address>(billingAddress.value);
const showBillingAddressErrors = ref(false);
watch(_billingAddress, () => (showBillingAddressErrors.value = false));

const { isValid: isBillingAddressValid, handleUpdated: handleBillingUpdated } =
  useValidatedObject<Address>(_billingAddress);

useObjectSync(
  _billingAddress,
  billingAddress,
  (newAddress: Address) => {
    consoleLog('useObjectSync: setPartialBillingAddress', newAddress);
    setPartialBillingAddress(newAddress);
  },
  'billing address'
);

const newBillingAddress = ref(false);
const handleNewBillingAddress = async () => {
  _billingAddress.value = { ...EMPTY_ADDRESS };
  newBillingAddress.value = true;
  await nextTick();
  document.getElementById('billing_address')?.scrollIntoView({ behavior: 'smooth' });
};

watch(useDeliveryForBilling, () => {
  if (useDeliveryForBilling.value) {
    _billingAddress.value = { ...deliveryAddress.value };
  } else {
    _billingAddress.value = { ...EMPTY_ADDRESS };
  }
});

const paymentInProgress = ref(false);
const triggerPayment = ref(0);
let paymentProcessingPromise = new DeferredPromise<void>();
const handleStartPayment = () => {
  consoleLog('handleStartPayment');
};
const handleEndPayment = () => {
  consoleLog('handleStartPayment');
  paymentProcessingPromise.resolve();
};

/*
Our validation logic relies on the fact that address validation takes place
on blur and that blur events and handlers will complete before click events.
Therefore, it's important that the form validation remains synchronous. Any async
functions in the chain will break this guarantee.
*/
const handleClick = async () => {
  consoleLog('Button clicked!');
  if (!isDeliveryAddressValid.value) {
    showDeliveryAddressErrors.value = true;
    document.getElementById('delivery_address')?.scrollIntoView({ behavior: 'smooth' });
  } else if (!isBillingAddressValid.value) {
    showBillingAddressErrors.value = true;
    document.getElementById('billing_address')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    consoleLog('We can place the order!');
    paymentInProgress.value = true;
    paymentProcessingPromise = new DeferredPromise<void>();
    triggerPayment.value += 1;
    await paymentProcessingPromise.promise;
    paymentInProgress.value = false;
    consoleLog('Payment flow finished');
  }
};
</script>

<template>
  <CheckoutLayout :breadcrumbs="breadcrumbs">
    <template #form>
      <AddressSelector
        title="Select Delivery Address"
        v-if="!authStore.isGuest && authStore.state.allAddresses.length > 0 && !newDeliveryAddress"
        type="delivery"
        @updated="handleDeliveryUpdated"
        @new="handleNewDeliveryAddress"
        :savedAddresses="authStore.state.allAddresses"
      />
      <AddressForm
        v-else
        :title="newDeliveryAddress ? 'New Delivery Address' : 'Delivery Address'"
        id="delivery_address"
        :address="_deliveryAddress"
        :showAllErrors="showDeliveryAddressErrors"
        :disabled="isLoading"
        @updated="handleDeliveryUpdated"
      />
      <AddressSelector
        title="Select Billing Address"
        v-if="!authStore.isGuest && authStore.state.allAddresses.length > 0 && !newBillingAddress"
        type="billing"
        @updated="handleBillingUpdated"
        @new="handleNewBillingAddress"
        :savedAddresses="authStore.state.allAddresses"
        :useDeliveryForBilling="useDeliveryForBilling"
      >
        <template #header-control>
          <BindleCheckbox v-model="useDeliveryForBilling" :disabled="isLoading"
            >Same as Delivery Address</BindleCheckbox
          >
        </template></AddressSelector
      >
      <AddressForm
        v-else
        :title="newBillingAddress ? 'New Billing Address' : 'Billing Address'"
        id="billing_address"
        :address="_billingAddress"
        :showAllErrors="showBillingAddressErrors"
        :disabled="isLoading"
        :hideForm="useDeliveryForBilling"
        @updated="handleBillingUpdated"
      >
        <template #header-control>
          <BindleCheckbox v-model="useDeliveryForBilling" :disabled="isLoading"
            >Same as Delivery Address</BindleCheckbox
          >
        </template>
      </AddressForm>
      <FormPayment
        class="!my-0"
        :order="order || {}"
        :transition="String(triggerPayment)"
        @startTransition="handleStartPayment"
        @stopTransition="handleEndPayment"
      />
      <div
        class="flex flex-col justify-center items-center rounded-md border border-solid border-zinc-200 p-5 mt-0 max-md:max-w-full"
      >
        <BindleButton
          type="primary"
          block
          @click="handleClick"
          :disabled="isLoading"
          :loading="paymentInProgress"
          >Place Order</BindleButton
        >
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
