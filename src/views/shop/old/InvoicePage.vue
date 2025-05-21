<script setup>
import LayoutV2 from '@/views/shared/LayoutV2.vue';
import EmptyCart from './components/EmptyCart.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import PriceDetails from './components/PriceDetails.vue';
import AddressPaymentDetailsPostPayment from './components/AddressPaymentDetailsPostPayment.vue';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { getOrderCompleted, getOrderInvoice } from '@/store/cart-api';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { setUuid } from '../../store/cart-api';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import OrderNotFound from './components/OrderNotFound.vue';
import { useRoute } from 'vue-router';
import FormAddressConfirmation from './components/FormAddressConfirmation.vue';
import { consoleLog } from '@/components/helpers/tsUtils';

const breadcrumbs = ref([
  { text: 'Home', path: '/' },
  { text: 'Shop Resources', path: '/resources' },
  { text: 'You Cart', path: '' },
]);

const queryClient = useQueryClient();
const route = useRoute();
const anonId = route.path.split('/').slice(-2)[0];
const orderId = route.path.split('/').slice(-1)[0];
consoleLog('Anon:', anonId);
consoleLog('Invoice:', orderId);
const isGuest = ref(false);
const processing = ref(false);
const transition = new Date().getTime().toString();

const { data, isLoading, isPending, error } = useQuery({
  queryKey: ['order', orderId],
  queryFn: () => getOrderCompleted(anonId, orderId),
});

const cartItems = computed(() => {
  return data.value?.order?.items ?? [];
});

const order = computed(() => {
  return data.value?.order ?? {};
});

// Adding the order id back seems like a bad idea now the order is completed?
// TODO: confirm this
/*watch(order, (newOrder) => {
  setUuid(newOrder?.uuid);
});*/

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
  <LayoutV2>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <!-- <nav
            aria-label="breadcrumb"
            class="text-left w-full col-start-1 md:col-span-4 grow mb-8"
          >
            <ol class="breadcrumbs flex flex-row flex-wrap gap-2 sm:gap-4">
              <li
                v-for="(breadcrumb, index) in breadcrumbs"
                :key="index"
                class="breadcrumb-item inline text-sm"
              >
                <span v-if="index > 0" class="mr-3">/</span>
                <router-link
                  v-if="breadcrumb.path !== ''"
                  :to="breadcrumb.path"
                  >{{ breadcrumb.text }}</router-link
                >
                <span v-else class="text-theme-darkgray">{{
                  breadcrumb.text
                }}</span>
              </li>
            </ol>
          </nav> -->
        </div>

        <div
          v-if="isPending"
          class="flex justify-center items-center h-[300px] bg-white rounded-md"
        >
          <SpinnerIcon class="w-10 h-10 animate-spin" />
        </div>

        <OrderNotFound v-if="!isPending && Object.keys(order).length === 0" />

        <div v-if="Object.keys(order).length > 0" class="flex gap-5 max-md:flex-col max-md:gap-0">
          <section class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full order-2 md:order-1">
            <div
              class="hidden md:flex justify-start w-full items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-md:px-5 max-md:max-w-full md:mb-6"
            >
              <div
                class="w-full flex flex-col gap-3 md:flex-row md:gap-0 justify-between items-start"
              >
                <div>
                  <h3 class="font-medium text-lg text-teal-500 mb-2">
                    Order placed, Thank you
                    {{ order?.billing_first_name }}!
                  </h3>
                  <p class="text-theme-darkgray2">Confirmation will be sent to your email.</p>
                </div>
                <span class="text-theme-darkgray2 font-semibold"
                  >Ordered on
                  {{
                    new Date(order?.created_at)?.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}</span
                >
              </div>
            </div>

            <FormAddressConfirmation :order="order" :editable="false" :transition="transition" />
          </section>

          <aside
            class="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit order-1 md:order-2"
          >
            <div
              class="flex md:hidden w-full justify-start items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-md:px-5 max-md:max-w-full md:mb-6"
            >
              <div
                class="w-full flex flex-col gap-3 md:flex-row md:gap-0 justify-between items-start"
              >
                <div>
                  <h3 class="font-medium text-lg text-teal-500 mb-2">
                    Order placed, Thank you
                    {{ order?.billing_first_name }}!
                  </h3>
                  <p class="text-theme-darkgray2">Confirmation will be sent to your email.</p>
                </div>
                <span class="text-theme-darkgray2 font-semibold"
                  >Ordered on
                  {{
                    new Date(order?.created_at)?.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}</span
                >
              </div>
            </div>

            <div
              class="relative flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 max-md:mt-5"
            >
              <ShoppingCart
                :items="cartItems"
                :bookStock="bookStock"
                :bundleStock="bundleStock"
                :transition="transition"
                :editable="false"
                :showTotalItemsCount="false"
                :orderId="order?.uuid"
                title="Order Details"
                :showScrollBar="true"
                cssClasses="border-none !px-0 !py-0"
              />
            </div>
            <div
              class="relative flex flex-col grow px-4 py-6 mx-auto w-full bg-white rounded-md border border-solid border-zinc-200 mt-9"
            >
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
            </div>
          </aside>
        </div>
      </div>
    </div>
  </LayoutV2>
</template>
