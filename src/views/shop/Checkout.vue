<script setup>
import Layout from "@/views/shared/Layout.vue";

import { useQueryClient } from "@tanstack/vue-query";
import EmptyCart from "./components/EmptyCart.vue";
import PriceDetail from "./components/PriceDetails.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import ShoppingSummary from "./components/ShoppingSummary.vue";
import FormAddress from "./components/FormAddress.vue";
import FormPayment from "./components/FormPayment.vue";
import AddressPaymentDetails from "./components/AddressPaymentDetails.vue";
import AddressPaymentDetailsPostPayment from "./components/AddressPaymentDetailsPostPayment.vue";

const queryClient = useQueryClient();
const cartItems = queryClient.getQueryData("cartItems", []);

function addToCart() {
  queryClient.setQueryData("cartItems", (old) => {
    return [
      ...old,
      {
        title: "Random " + new Date().getTime(),
        price: 22.99,
        discount: "15%",
        purchasePice: 19.55,
        type: "Paperback",
      },
    ];
  });
}

</script>
<template>
    <layout>
        <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div class="flex flex-col md:flex-row">
          <breadcrumbs
            class="text-left w-full col-start-1 md:col-span-4 mb-4 grow"
          />
        </div>

        <EmptyCart v-if="false" />

        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
          <section class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full">

            <ShoppingCart />

            <br />
            <div
              class="justify-end items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-md:px-5 max-md:max-w-full md:mb-6"
            >
              Already have an account?
              <span class="font-medium text-teal-500">Log in</span>
            </div>

            <FormPayment />



            <br />
            <AddressPaymentDetails />


            <br />
            <br />

            <FormAddress />

            <br />
            <br />
            <br />

            
            <AddressPaymentDetailsPostPayment /> 


          </section>

          <aside class="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit">
            <ShoppingSummary />
          </aside>
        </div>
      </div>
    </div>
    </layout>
</template>
