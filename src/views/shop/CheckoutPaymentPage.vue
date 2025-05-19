<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import AddressManager from '@/components/forms/AddressManager.vue';
import BindleButton from '@/components/BindleButton.vue';
import CheckoutLayout from './CheckoutLayout.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';
import FormPayment from './components/FormPayment.vue';
import BindleCheckbox from '@/components/BindleCheckbox.vue';
//import CouponSection from './components/CouponSection.vue';
import CouponOfferV2 from '@/components/coupons/CouponOfferV2.vue';

import { useAuthStore } from '@/store/useAuthStore';
import { useCurrentOrder } from '@/composables/useCurrentOrder';
import {
  createFromSavedAddress,
  EMPTY_ADDRESS,
  isAddressEqual,
  isAddressValid,
} from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

import { DeferredPromise, consoleLog } from '@/components/helpers/tsUtils';

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
  coupons,
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
const handleDeliveryUpdated = (address: Partial<Address>) => {
  if (!isAddressEqual(address, orderDeliveryAddress.value)) {
    setPartialDeliveryAddress(address, billingSameAsDelivery.value);
  }
};

const billingSameAsDelivery = ref(false);
watch(billingSameAsDelivery, (newVal) => {
  if (newVal) {
    billingAddress.value = { ...deliveryAddress.value };
    handleBillingUpdated(billingAddress.value);
  } else {
    billingAddress.value = savedAddresses.value[0] || { ...EMPTY_ADDRESS };
  }
});

const billingAddress = ref<Partial<Address>>({ ...EMPTY_ADDRESS });
const showBillingAddressErrors = ref(false);
const handleBillingUpdated = (address: Partial<Address>) => {
  if (!isAddressEqual(address, orderBillingAddress.value)) {
    setPartialBillingAddress(address);
  }
};

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

// Logic to interact with FormPayment component
// TODO: simplify when time allows!
const paymentInProgress = ref(false);
const triggerPayment = ref(0);
let paymentProcessingPromise = new DeferredPromise<void>();
const handleStartPayment = () => {};
const handleEndPayment = () => {
  consoleLog('handleStartPayment');
  paymentProcessingPromise.resolve();
};

const handleClick = async () => {
  consoleLog('Button clicked!');
  const deliveryAddressFinal = deliveryAddress.value;
  const billingAddressFinal = billingAddress.value;

  if (!isAddressValid(deliveryAddressFinal)) {
    showDeliveryAddressErrors.value = true;
    document.getElementById('delivery-address')?.scrollIntoView({ behavior: 'smooth' });
  } else if (!billingSameAsDelivery.value && !isAddressValid(billingAddressFinal)) {
    showBillingAddressErrors.value = true;
    document.getElementById('billing-address')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    //consoleLog('We can place the order!');
    paymentInProgress.value = true;
    paymentProcessingPromise = new DeferredPromise<void>();
    triggerPayment.value += 1;
    await paymentProcessingPromise.promise;
    paymentInProgress.value = false;
    //consoleLog('Payment flow finished');
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
          :disabled="paymentInProgress"
          v-model="deliveryAddress"
          :savedAddresses="savedAddresses"
          :showAllFormErrors="showDeliveryAddressErrors"
          @blur="handleDeliveryUpdated"
        />
        <AddressManager
          id="billing-address"
          title="Billing Address"
          :disabled="paymentInProgress"
          v-model="billingAddress"
          :savedAddresses="savedAddresses"
          :showAllFormErrors="showBillingAddressErrors"
          :hideForm="billingSameAsDelivery"
          @blur="handleBillingUpdated"
          ><template #header-control>
            <BindleCheckbox v-model="billingSameAsDelivery" :disabled="paymentInProgress"
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
      <CouponOfferV2 :coupons="coupons" />
      <!--<CouponSection :coupons="coupons" />-->
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
