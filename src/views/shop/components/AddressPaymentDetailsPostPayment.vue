<script setup>
import { watch, computed, defineProps, defineEmits } from "vue";
import { countries } from "@/components/helpers/countries";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  transition: String,
  currentStage: Number,
});

const order = computed(() => {
  return props.order;
});

const emit = defineEmits(["setCurrentStage"]);

const transition = computed(() => {
  return props.transition;
});

watch(transition, async (_) => {
  if (props.currentStage === 3) {
    // emit("setCurrentStage", 3);
    // downloadInvoice();
  }
});
</script>

<template>
  <br />
  <br />
  <br />
  <section
    class="flex flex-col px-6 py-8 bg-white rounded-md border border-solid border-zinc-200 w-full max-md:px-5"
  >
    <header
      class="items-start pt-2 pb-6 text-xl font-medium leading-7 text-gray-700 border-b border-solid border-zinc-200 max-md:pr-5 max-md:max-w-full"
    >
      Customer Information
    </header>
    <div
      class="flex flex-col justify-center px-6 mt-6 bg-white rounded-md max-md:px-5 max-md:max-w-full"
    >
      <div class="justify-between max-md:max-w-full">
        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
          <!-- w-6/12 -->
          <article class="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div
              class="flex flex-col grow pb-5 w-full text-base font-medium bg-white rounded-md text-zinc-900"
            >
              <h2 class="text-lg text-slate-800">Delivery address</h2>
              <p class="mt-6 text-sm font-bold text-cyan-800 uppercase">
                {{ order?.delivery_first_name }}
                {{ order?.delivery_lastname_name }}
              </p>
              <p class="mt-2">
                {{ order?.delivery_address1 }},
                {{
                  order?.delivery_address2
                    ? order?.delivery_address2 + ", "
                    : ""
                }}
                {{ order?.delivery_city }}, {{ order?.delivery_zip }},
                {{ order?.delivery_country }}
              </p>
              <p class="mt-3">
                <span class="text-zinc-500">Email: </span>
                {{ order?.delivery_email }}
              </p>
              <p class="mt-3">
                <span class="text-zinc-500">Phone no: </span>
                {{ order?.delivery_phone }}
              </p>
            </div>
          </article>

          <article class="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div
              class="flex flex-col grow pb-5 w-full text-base font-medium bg-white rounded-md text-zinc-900 max-md:mt-8"
            >
              <h2 class="text-lg text-slate-800">Billing address</h2>
              <p class="mt-6 text-sm font-bold text-cyan-800 uppercase">
                {{ order?.billing_first_name }}
                {{ order?.billing_lastname_name }}
              </p>
              <p class="mt-2">
                {{ order?.billing_address1 }},
                {{
                  order?.billing_address2 ? order?.billing_address2 + ", " : ""
                }}
                {{ order?.billing_city }}, {{ order?.billing_zip }},
                {{ order?.billing_country }}
              </p>
              <p class="mt-3">
                <span class="text-zinc-500">Email: </span>
                {{ order?.billing_email }}
              </p>
              <p class="mt-3">
                <span class="text-zinc-500">Phone no: </span>
                {{ order?.billing_phone }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
    <article
      class="flex flex-col justify-center items-start px-6 mt-6 text-base font-medium bg-white rounded-md text-zinc-900 max-md:px-5 max-md:max-w-full"
    >
      <div class="flex flex-col bg-white rounded-md">
        <h2 class="text-lg text-slate-800">Payment details</h2>
        <p class="mt-6 text-sm font-bold text-cyan-800 uppercase">
          {{ order?.payment_nameoncard ?? (order?.billing_first_name + " " + order?.billing_lastname_name) }}
        </p>
        <p class="mt-4">
          <span class="text-zinc-500">Card Number: </span>
          **** **** **** {{ order?.payment_last4 }}
        </p>
        <p class="mt-4">
          <span class="text-zinc-500">Expiration Date: </span>
          {{ order?.payment_expiry_month }}/{{
            order?.payment_expiry_year.toString().slice(-2)
          }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup></script>
