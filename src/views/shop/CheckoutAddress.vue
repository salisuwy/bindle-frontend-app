<script setup>
import Layout from '@/views/shared/Layout.vue';
import EmptyCart from './components/EmptyCart.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import CouponSection from './components/CouponSection.vue';
import PriceDetails from './components/PriceDetails.vue';
import FormAddress from './components/FormAddress.vue';
import FormPayment from './components/FormPayment.vue';
import FormAddressConfirmation from './components/FormAddressConfirmation.vue';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { getOrderCart } from '@/store/cart-api';
import { computed, ref, watch } from 'vue';
import { setUuid } from '../../store/cart-api';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const breadcrumbs = ref([
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'You Cart', path: '' },
]);

const stages = ['CART', 'ADDRESS', 'CARD'];
const stagesRoute = ['/checkout', '/checkout-address', '/checkout-payment'];
const stagesButtonText = ['Proceed to Checkout', 'Continue', 'Place Order'];

const isGuest = ref(false);
const currentStage = ref(1);
const transition = ref('');
const isTransitioning = ref(false);

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
  return isGuest.value && (currentStage.value === 1 || currentStage.value === 2);
});

watch(order, (newOrder) => {
  setUuid(newOrder?.uuid);
});

function performTransition() {
  isTransitioning.value = true;
  transition.value = new Date().getTime().toString();
  console.log('performTransition', transition.value);
}

function setCurrentStage(stage) {
  console.log('setCurrentStage', stage);
  isTransitioning.value = false;
  if (currentStage.value !== stage) {
    const nextRoute = stagesRoute[stage];
    router.push(nextRoute);
  }
  //currentStage.value = stage;
}
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
          <section class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full">
            <div
              v-if="showLoginLink"
              class="justify-end items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-md:px-5 max-md:max-w-full md:mb-6"
            >
              Already have an account?
              <span class="font-medium text-teal-500">Log in</span>
            </div>

            <ShoppingCart
              v-if="currentStage === 0 || currentStage === 2"
              :items="cartItems"
              :bookStock="bookStock"
              :bundleStock="bundleStock"
              :transition="transition"
              :currentStage="currentStage"
              :editable="currentStage !== 2"
              @setCurrentStage="setCurrentStage"
            />

            <FormAddress
              v-if="currentStage === 1"
              :order="order"
              :transition="transition"
              :currentStage="currentStage"
              @setCurrentStage="setCurrentStage"
            />

            <FormAddressConfirmation
              v-if="currentStage === 2"
              :order="order"
              :transition="transition"
              :currentStage="currentStage"
              @setCurrentStage="setCurrentStage"
            />

            <FormPayment
              v-if="currentStage === 2"
              :order="order"
              :transition="transition"
              :isTransitioning="isTransitioning"
              :currentStage="currentStage"
              @setCurrentStage="setCurrentStage"
              @performTransition="performTransition"
            />
          </section>

          <aside class="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit">
            <div
              class="relative flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-md:mt-9"
            >
              <CouponSection v-if="currentStage < 3" :coupons="coupons" />
              <PriceDetails :order="order" :showDivider="currentStage === 3" />

              <button
                class="flex justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5"
                @click="performTransition"
                :disabled="isTransitioning"
              >
                <SpinnerIcon v-if="isTransitioning" class="w-5 h-5 mr-2 animate-spin" />
                <span v-if="!isTransitioning">
                  {{ stagesButtonText[currentStage] }}
                </span>
              </button>
            </div>
            <p class="text-[16px] text-gray-400 font-light">
              Your personal data will be used to process your order, support your experience
              throughout this website, and for other purposes described in our
              <router-link to="/privacy-policy" class="underline text-theme-teal"
                >privacy policy.</router-link
              >
            </p>
          </aside>
        </div>
      </div>
    </div>
  </layout>
</template>
