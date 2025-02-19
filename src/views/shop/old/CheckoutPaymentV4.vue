<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import AddressManager from '@/components/forms/AddressManager.vue';
import BindleButton from '@/components/BindleButton.vue';
import CheckoutLayout from './CheckoutLayout.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';
import FormPayment from './components/FormPayment.vue';
import BindleCheckbox from '@/components/BindleCheckbox.vue';

import { useAuthStore } from '@/store/useAuthStore';
import { useCurrentOrder } from '@/composables/useCurrentOrder';
import {
  createFromSavedAddress,
  EMPTY_ADDRESS,
  isAddressEqual,
} from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';
import { useValidatedObject } from '@/composables/useValidatedObject';

import { DeferredPromise } from '@/components/helpers/tsUtils';

const breadcrumbs = [
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'Your Cart', path: '/checkout-payment' },
];

const authStore = useAuthStore();
const isSavedAddressesLoading = ref(true);
onMounted(async () => {
  await authStore.fetchAddresses();
  isSavedAddressesLoading.value = false;
});

const {
  isLoading: isOrderLoading,
  order,
  cartItems,
  bookStock,
  bundleStock,
  deliveryAddress: orderDeliveryAddress,
  billingAddress: orderBillingAddress,
  setPartialDeliveryAddress,
  setPartialBillingAddress,
} = useCurrentOrder();

const isLoading = computed(() => isOrderLoading.value || isSavedAddressesLoading.value);

const deliveryAddress = ref<Partial<Address>>({ ...EMPTY_ADDRESS });
const showDeliveryAddressErrors = ref(false);
const { isValid: isDeliveryValid, handleUpdated: handleDeliveryUpdated } =
  useValidatedObject(deliveryAddress);
watch(deliveryAddress, () => {
  if (!isAddressEqual(deliveryAddress.value, orderDeliveryAddress.value)) {
    console.log('updating delivery address to:', deliveryAddress.value);
    setPartialDeliveryAddress(deliveryAddress.value, billingSameAsDelivery.value);
  }
});

const billingSameAsDelivery = ref(false);
watch(billingSameAsDelivery, (newVal) => {
  if (newVal) {
    billingAddress.value = { ...deliveryAddress.value };
  } else {
    billingAddress.value = savedAddresses.value[0] || { ...EMPTY_ADDRESS };
  }
});

const billingAddress = ref<Partial<Address>>({ ...EMPTY_ADDRESS });
const showBillingAddressErrors = ref(false);
const { isValid: isBillingValid, handleUpdated: handleBillingUpdated } =
  useValidatedObject(billingAddress);
watch(billingAddress, () => {
  if (!isAddressEqual(billingAddress.value, orderBillingAddress.value)) {
    console.log('updating billing address to:', billingAddress.value);
    setPartialBillingAddress(billingAddress.value);
  }
});

const savedAddresses = ref<Address[]>([]);

const isInitialised = ref(false);
const unwatch = watch(
  isLoading,
  (newVal) => {
    if (!newVal) {
      deliveryAddress.value = orderDeliveryAddress.value;
      billingAddress.value = orderBillingAddress.value;
      billingSameAsDelivery.value = isAddressEqual(deliveryAddress.value, billingAddress.value);
      savedAddresses.value = authStore.state.allAddresses.map(createFromSavedAddress);
      unwatch();
      isInitialised.value = true;
    }
  },
  { immediate: true }
);

const paymentInProgress = ref(false);
const triggerPayment = ref(0);
let paymentProcessingPromise = new DeferredPromise<void>();
const handleStartPayment = () => {
  //console.log('handleStartPayment');
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
  if (!isDeliveryValid.value) {
    showDeliveryAddressErrors.value = true;
    document.getElementById('delivery-address')?.scrollIntoView({ behavior: 'smooth' });
  } else if (!isBillingValid.value && !billingSameAsDelivery.value) {
    showBillingAddressErrors.value = true;
    document.getElementById('billing-address')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    //console.log('We can place the order!');
    paymentInProgress.value = true;
    paymentProcessingPromise = new DeferredPromise<void>();
    triggerPayment.value += 1;
    await paymentProcessingPromise.promise;
    paymentInProgress.value = false;
    //console.log('Payment flow finished');
  }
};
</script>

<template>
  <CheckoutLayout :breadcrumbs="breadcrumbs">
    <template #form>
      <template v-if="!isInitialised">
        <p>Loading</p>
      </template>
      <template v-else>
        <AddressManager
          id="delivery-address"
          title="Delivery Address"
          @updated="handleDeliveryUpdated"
          :initialAddress="deliveryAddress"
          :savedAddresses="savedAddresses"
          :showAllFormErrors="showDeliveryAddressErrors"
        />
        <AddressManager
          id="billing-address"
          title="Billing Address"
          @updated="handleBillingUpdated"
          :initialAddress="billingAddress"
          :savedAddresses="savedAddresses"
          :hideForm="billingSameAsDelivery"
          :showAllFormErrors="showBillingAddressErrors"
          ><template #header-control>
            <BindleCheckbox v-model="billingSameAsDelivery"
              >Same as Delivery Address</BindleCheckbox
            >
          </template>
        </AddressManager>
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
