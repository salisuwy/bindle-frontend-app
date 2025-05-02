<script setup>
import Layout from '@/views/shared/Layout.vue';
import EmptyCart from './components/EmptyCart.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import CouponSection from './components/CouponSection.vue';
import PriceDetails from './components/PriceDetails.vue';
import FormAddress from './components/FormAddress.vue';
import FormPayment from './components/FormPayment.vue';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { getOrderCart } from '@/store/cart-api';
import { computed, onMounted, ref, watch } from 'vue';
import { setUuid } from '../../store/cart-api';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import { useRouter } from 'vue-router';
import { consoleLog } from '@/components/helpers/tsUtils';

const router = useRouter();

const breadcrumbs = ref([
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'You Cart', path: '' },
]);

const isGuest = ref(false);
const formAddressRef = ref(null);
const isTransitioning = ref(false);
const transitionAddress = ref('');
const transitionPayment = ref('');
const isAddressValid = ref(false);
const isCardValid = ref(false);
const isAddressValidTransition = ref('');
const isCardValidTransition = ref('');

watch(isAddressValidTransition, async (_) => {
  if (isAddressValid.value) {
    consoleLog('Address is valid, starting payment');
    performTransition('payment');
  }
});

const { data, isLoading, isPending, error } = useQuery({
  queryKey: ['cartItems'],
  queryFn: getOrderCart,
});

const order = computed(() => {
  return data.value?.order ?? {};
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

const showLoginLink = computed(() => {
  return isGuest.value && false;
});

watch(order, (newOrder) => {
  setUuid(newOrder?.uuid);
});

function performTransition(field) {
  if (field === 'address') {
    transitionAddress.value = new Date().getTime().toString();
    consoleLog('performTransition [address]', transitionAddress.value);
  } else if (field === 'payment') {
    transitionPayment.value = new Date().getTime().toString();
    consoleLog('performTransition [payment]', transitionAddress.value);
  }
}

function startTransition() {
  consoleLog('startTransition');
  isTransitioning.value = true;
}

function stopTransition() {
  consoleLog('stopTransition');
  isTransitioning.value = false;
}

function setValidity(obj) {
  consoleLog('setValidity', obj);
  isTransitioning.value = false;
  if (obj?.key === 'address') {
    isAddressValid.value = obj?.value;
    isAddressValidTransition.value = new Date().getTime().toString();
    if (!obj?.value) {
      if (formAddressRef.value) {
        formAddressRef.value.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
  if (obj?.key === 'card') {
    isCardValid.value = obj?.value;
    isCardValidTransition.value = new Date().getTime().toString();
  }
}

onMounted(() => {
  // scroll to bottom
  window.scrollTo(0, document.body.scrollHeight);
});
</script>
<template>
  <layout>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <nav aria-label="breadcrumb" class="text-left w-full col-start-1 md:col-span-4 grow mb-8">
            <ol class="breadcrumbs flex flex-row flex-wrap gap-2 sm:gap-4">
              <li
                v-for="(breadcrumb, index) in breadcrumbs"
                :key="index"
                class="breadcrumb-item inline text-sm"
              >
                <span v-if="index > 0" class="mr-3">/</span>
                <router-link v-if="breadcrumb.path !== ''" :to="breadcrumb.path">{{
                  breadcrumb.text
                }}</router-link>
                <span v-else class="text-theme-darkgray">{{ breadcrumb.text }}</span>
              </li>
            </ol>
          </nav>
        </div>

        <EmptyCart v-if="cartItems.length === 0" />

        <div v-if="cartItems.length > 0" class="flex gap-5 max-md:flex-col max-md:gap-0">
          <section class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full order-2 md:order-1">
            <div
              v-if="showLoginLink"
              class="justify-end items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-md:px-5 max-md:max-w-full md:mb-6"
            >
              Already have an account?
              <span class="font-medium text-teal-500">Log in</span>
            </div>

            <div ref="formAddressRef"></div>

            <FormAddress
              :order="order"
              :transition="transitionAddress"
              @setValidity="setValidity"
              @startTransition="startTransition"
              @stopTransition="stopTransition"
            />

            <FormPayment
              :order="order"
              :transition="transitionPayment"
              :isTransitioning="isTransitioning"
              @setValidity="setValidity"
              @startTransition="startTransition"
              @stopTransition="stopTransition"
            />

            <div
              class="flex flex-col justify-center items-center rounded-md border border-solid border-zinc-200 p-5 mt-0 max-md:max-w-full"
            >
              <!-- <div>
                <pre>Address: {{ isAddressValid }}</pre>
                <pre>Card: {{ isCardValid }}</pre>
              </div> -->

              <button
                class="flex justify-center items-center px-3.5 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5 w-full md:w-full"
                @click="performTransition('address')"
                :disabled="isTransitioning"
              >
                <SpinnerIcon v-if="isTransitioning" class="w-5 h-5 mr-2 animate-spin" />
                <span v-if="!isTransitioning"> Place Order </span>
              </button>
            </div>
            <div class="mt-6">
              <p class="text-[16px] text-gray-400 font-light">
                Your personal data will be used to process your order, support your experience
                throughout this website, and for other purposes described in our
                <router-link to="/privacy-policy" class="underline text-theme-teal"
                  >privacy policy.</router-link
                >
              </p>
            </div>
          </section>

          <aside
            class="md:sticky md:top-0 flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit order-1 md:order-2"
          >
            <div
              class="flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-md:mt-9"
            >
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

              <div class="mt-5">
                <PriceDetails :order="order" :showDivider="false" :showAsAccordion="true" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </layout>
</template>
