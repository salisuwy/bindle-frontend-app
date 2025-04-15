<script setup>
import { watch, computed, defineProps, defineEmits } from 'vue';
import { countries } from '@/components/helpers/countries';
import { consoleLog } from '@/components/helpers/tsUtils';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  transition: String,
  editable: { type: Boolean, default: true },
});

const order = computed(() => {
  return props.order;
});

const transition = computed(() => {
  return props.transition;
});

function gotoAddressForm() {
  consoleLog('Go to address form');
}
</script>

<template>
  <section
    class="flex flex-col items-start px-6 py-8 mt-4 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header
      class="flex gap-4 justify-between items-center self-stretch max-md:flex-wrap max-md:max-w-full"
    >
      <h2 class="pt-2 pb-0.5 my-auto text-xl font-medium leading-7 text-gray-700">
        Delivery Address
      </h2>
      <button
        v-if="props.editable"
        @click="gotoAddressForm"
        class="justify-center px-3.5 py-2.5 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white"
      >
        Edit Details
      </button>
    </header>
    <h3 class="mt-6 text-sm font-bold text-cyan-800 uppercase">
      {{ order?.delivery_first_name }}
      {{ order?.delivery_last_name }}
    </h3>
    <p class="mt-2 text-base text-zinc-900">
      {{ order?.delivery_address1 }},
      {{ order?.delivery_address2 ? order?.delivery_address2 + ', ' : '' }}
      {{ order?.delivery_city }}, {{ order?.delivery_zip }},
      {{ order?.delivery_country }}
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Email: </span> {{ order?.delivery_email }}
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Phone no: </span> {{ order?.delivery_phone }}
    </p>
  </section>

  <section
    class="flex flex-col items-start px-6 py-8 mt-6 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header
      class="flex gap-4 justify-between items-center self-stretch max-md:flex-wrap max-md:max-w-full"
    >
      <h2 class="pt-2 pb-0.5 my-auto text-xl font-medium leading-7 text-gray-700">
        Billing Details
      </h2>
      <button
        v-if="props.editable"
        @click="gotoAddressForm"
        class="justify-center px-3.5 py-2.5 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white"
      >
        Edit Details
      </button>
    </header>
    <h3 class="mt-6 text-sm font-bold text-cyan-800 uppercase">
      {{ order?.billing_first_name }}
      {{ order?.billing_last_name }}
    </h3>
    <p class="mt-2 text-base text-zinc-900">
      {{ order?.billing_address1 }},
      {{ order?.billing_address2 ? order?.billing_address2 + ', ' : '' }}
      {{ order?.billing_city }}, {{ order?.billing_zip }},
      {{ order?.billing_country }}
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Email: </span> {{ order?.billing_email }}
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Phone no: </span> {{ order?.billing_phone }}
    </p>
  </section>
  <section
    v-if="order?.payment_last4"
    class="flex flex-col items-start px-6 py-8 mt-6 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header class="flex gap-4 justify-between self-stretch max-md:flex-wrap max-md:max-w-full">
      <h2 class="pt-2 pb-0.5 my-auto text-xl font-medium leading-7 text-gray-700">
        Payment Details
      </h2>
      <button
        v-if="props.editable"
        class="justify-center px-3.5 py-2.5 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white"
      >
        Edit Details
      </button>
    </header>
    <h3 class="mt-6 text-sm font-bold text-cyan-800 uppercase">
      {{ order?.payment_nameoncard ?? order?.billing_first_name + ' ' + order?.billing_last_name }}
    </h3>
    <p class="mt-6 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Card Number: </span>**** **** ****
      {{ order?.payment_last4 }}
    </p>
    <p class="mt-6 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Expiration Date: </span>
      {{ order?.payment_expiry_month }}/{{ order?.payment_expiry_year?.toString().slice(-2) }}
    </p>
  </section>
</template>
