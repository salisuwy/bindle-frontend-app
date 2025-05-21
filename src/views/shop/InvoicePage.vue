<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

import CheckoutLayout from './CheckoutLayout.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import OrderNotFound from './components/OrderNotFound.vue';
import FormAddressConfirmation from './components/FormAddressConfirmation.vue';
import SectionFrame from './components/SectionFrame.vue';
import OrderPlacedBanner from './components/OrderPlacedBanner.vue';

import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { getOrderCompleted, getOrderInvoice } from '@/store/cart-api';
import { useRoute } from 'vue-router';

import { consoleLog } from '@/components/helpers/tsUtils';

const queryClient = useQueryClient();
const route = useRoute();
const anonId = route.params.anonId as string;
const orderId = route.params.orderId as string;
consoleLog('Anon:', anonId);
consoleLog('Invoice:', orderId);
const processing = ref(false);
const transition = new Date().getTime().toString();

const { data, isPending } = useQuery({
  queryKey: ['order', orderId],
  queryFn: () => getOrderCompleted(anonId, orderId),
});

const cartItems = computed(() => {
  return data.value?.order?.items ?? [];
});

const order = computed(() => {
  return data.value?.order ?? {};
});

onBeforeMount(() => {
  localStorage.removeItem('uuid');
  queryClient.invalidateQueries({ queryKey: ['cartItems'] });
});

async function downloadInvoice() {
  processing.value = true;
  try {
    const url = await getOrderInvoice(anonId, orderId);
    // open new tab with url.url
    window.open(url.url, '_blank');
  } catch (error) {
    console.error('downloadInvoice error', error);
  }
  processing.value = false;
}
</script>

<template>
  <CheckoutLayout :loading="isPending" :showEmptyState="Object.keys(order).length === 0">
    <template #empty><OrderNotFound /></template>
    <template #form>
      <div class="flex flex-col">
        <OrderPlacedBanner
          v-if="order"
          class="hidden lg:flex lg:mb-6"
          :billing_first_name="order.billing_first_name"
          :payment_date="order.payment_date"
        />
        <FormAddressConfirmation :order="order" :editable="false" :transition="transition" />
      </div>
    </template>
    <template #order>
      <OrderPlacedBanner
        id="second-banner"
        v-if="order"
        class="flex lg:hidden"
        :billing_first_name="order.billing_first_name"
        :payment_date="order.payment_date"
      />
      <SectionFrame class="max-lg:mt-5">
        <ShoppingCart
          :items="cartItems"
          :transition="transition"
          :editable="false"
          :showTotalItemsCount="false"
          :orderId="order?.uuid"
          title="Order Details"
          :showScrollBar="true"
          cssClasses="border-none !px-0 !py-0"
        />
      </SectionFrame>
      <SectionFrame class="mt-9">
        <PriceDetails
          :order="order"
          title="Order Summary"
          :showDivider="true"
          :showAsAccordion="true"
        />

        <button
          class="flex justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5"
          @click="downloadInvoice"
          :disabled="processing"
        >
          <SpinnerIcon v-if="processing" class="w-5 h-5 mr-2 animate-spin" />
          <span v-if="!processing"> Download Invoice </span>
        </button>

        <router-link
          to="/resources"
          class="justify-center px-3.5 py-3 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white my-4 text-center"
          >Continue Shopping</router-link
        >
      </SectionFrame>
    </template>
  </CheckoutLayout>
</template>

<style scoped></style>
