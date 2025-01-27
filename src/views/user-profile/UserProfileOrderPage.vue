<template>
    <UserProfileLayout>

        <div v-if="!authStore.currentOrderLoading && authStore.currentOrder" class="w-full text-left">

            <div class="flex flex-row justify-between items-start mb-10">
                <div class="flex flex-col">
                    <h2 class="text-3xl md:text-5xl font-normal text-left mb-2">Order Details </h2>
                    <span class=" text-gray-500">Order ID: <span class=" text-theme-black font-medium">#{{
                        authStore.currentOrder.uuid }}</span></span>
                </div>


                <a :href="authStore.currentOrderInvoice" target="_blank"
                    class=" bg-teal-500 text-white px-3 py-2 rounded hover:bg-teal-600 cursor-pointer">Download
                    Invoice</a>
            </div>

            <h1 class="grow text-xl leading-7 text-gray-700 text-left font-medium mb-2" :class="{
                'text-teal-500': authStore.currentOrder.status === 'DISP_BY_GARDNER'
            }">{{
                orderStatusMapping[authStore.currentOrder.status] }}</h1>
            <p class="pb-4">Ordered on {{ formattedDate(authStore.currentOrder.created_at) }}</p>
            <div
                class=" flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full mb-6 text-left p-8">
                <h2 class="mb-4 border-b pb-3 font-medium">Customer Information</h2>
                <div class="order-details pt-3">
                    <div>
                        <h3 class="pb-4 font-medium">Delivery address</h3>
                        <ul class="break-all md:break-normal">
                            <li class="font-medium customer-name">{{
                                authStore.currentOrder.delivery_first_name?.toUpperCase() }} {{
                                    authStore.currentOrder.delivery_last_name?.toUpperCase() }}</li>
                            <li>{{ authStore.currentOrder.delivery_address1 }} {{
                                authStore.currentOrder.delivery_address2 }},
                                {{ authStore.currentOrder.delivery_town }} {{
                                    authStore.currentOrder.delivery_city }},
                                {{ authStore.currentOrder.delivery_zip }}, {{
                                    authStore.currentOrder.delivery_country }}</li>
                            <li class="text-gray-500">Phone: <span class="text-theme-black font-medium">{{
                                authStore.currentOrder.delivery_phone }}</span> </li>
                            <li class="text-gray-500">Email: <span class="text-theme-black font-medium">{{
                                authStore.currentOrder.delivery_email }}</span> </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="pb-4 font-medium">Billing address</h3>
                        <ul class="break-all md:break-normal">
                            <li class="font-medium customer-name">{{
                                authStore.currentOrder.billing_first_name?.toUpperCase() }} {{
                                    authStore.currentOrder.billing_last_name?.toUpperCase() }}</li>
                            <li>{{ authStore.currentOrder.billing_address1 }} {{
                                authStore.currentOrder.billing_address2 }},
                                {{ authStore.currentOrder.billing_town }} {{ authStore.currentOrder.billing_city
                                }},
                                {{ authStore.currentOrder.billing_zip }}, {{
                                    authStore.currentOrder.billing_country }}</li>
                            <li class="text-gray-500">Phone: <span class="text-theme-black font-medium">{{
                                authStore.currentOrder.billing_phone }}</span></li>
                            <li class="text-gray-500">Email: <span class="text-theme-black font-medium">{{
                                authStore.currentOrder.billing_email }}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="pb-4 font-medium">Payment details</h3>
                        <ul>
                            <li class=" font-bold customer-name">{{
                                authStore.currentOrder.payment_nameoncard?.toUpperCase() }}</li>
                            <li class="text-gray-500">Card Number: <span class="text-theme-black font-medium">**** ****
                                    **** {{ authStore.currentOrder.payment_last4 }}</span> </li>
                            <li class="text-gray-500">Expiration Date: <span class="text-theme-black font-medium">{{
                                authStore.currentOrder.payment_expiry_month }}/{{
                                        authStore.currentOrder.payment_expiry_year
                                    }}</span> </li>
                        </ul>
                    </div>
                </div>

            </div>
            <div
                class=" flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full mb-6 text-left p-8">
                <h2 class="mb-4 border-b pb-3 font-normal">Items <span v-if="authStore.currentOrder.items.length > 0"
                        class="text-sm text-teal-400">({{
                            authStore.currentOrder.items.length }})</span></h2>
                <!-- <div v-for="item in authStore.currentOrder.items" :key="item.id"
                    class="item-details flex justify-start items-start mb-3">
                    <img :src="item.images[0]" class=" w-36">
                    <div class="pl-4 flex flex-col">
                        <p class=" font-light text-sm">{{ item.slug }}</p>
                        <p class="text-lg pb-3">{{ item.title }}</p>
                        <p class="bg-theme-pale text-gray-400 px-3 py-1">{{ item.item_type }}</p>
                        <p>
                            <span>Quantity: {{ item.quantity }}</span>
                            <span class="pl-6 font-semibold text-lg">
                                £{{ item.price }}
                            </span>
                        </p>

                    </div>
                </div> -->
                <div v-for="item in authStore.currentOrder.items" :key="item.id">
                    <CartItem :item="item" />
                </div>
            </div>

            <div
                class=" flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full mb-6 text-left px-8 pb-8 pt-4">

                <PriceDetails :order="authStore.currentOrder" :showDivider="true" />
                <!-- <h2 class="mb-4 border-b pb-3 font-normal">Price Details</h2> -->
                <!-- <div class="flex flex-col">
                    <div class="flex flex-row justify-between items-center pb-3">
                        <span>Subtotal</span>
                        <span>{{ authStore.currentOrder.order_total_before_discount }}</span>
                    </div>
                    <div class="flex flex-row justify-between items-center pb-3">
                        <span>Coupon Discount</span>
                        <span>{{ authStore.currentOrder.coupons_total_discount }}</span>
                    </div>
                    <div class="flex flex-row justify-between items-center pb-3">
                        <span>Overall Discount</span>
                        <span>{{ authStore.currentOrder.order_savings }} </span>
                    </div>
                    <div class="flex flex-row justify-between items-center pb-3">
                        <span>Shipping Fee</span>
                        <span>{{ authStore.currentOrder.shipping_cost }}</span>
                    </div>
                    <div class="flex flex-row justify-between items-center pb-3 pt-3 border-t">
                        <span>Total Amount</span>
                        <span>{{ authStore.currentOrder.order_final }}</span>
                    </div>
                </div> -->

            </div>
        </div>
        <div v-else class="w-full h-[100%] flex flex-col justify-center items-center">
            <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
            <span class="pt-3 font-light text-lg">Loading Your Order ... </span>
        </div>
    </UserProfileLayout>

</template>

<script setup>
import { onBeforeMount, onUnmounted, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../store/useAuthStore";
import UserProfileLayout from "@/views/shared/UserProfileLayout.vue";
import CartItem from "@/views/shop/components/CartItem.vue";
import PriceDetails from "@/views/shop/components/PriceDetails.vue";

const authStore = useAuthStore();

const orderStatusMapping = {
    'CHECKOUT': "Order Confirmed!",
    'OTHERS': "Processing",
    'DISP_BY_GARDNER': "Order Dispatched!",
    'DELIVERED': "Delivered"
}

const formattedDate = (date) => {
    const newDate = new Date(date);
    return newDate.toDateString();
}

onBeforeMount(() => {
    const route = useRoute();
    const orderId = route.params.orderId;
    authStore.fetchOrderById({
        id: orderId
    });
    authStore.fetchOrderInvoiceById({
        id: orderId
    });
})

onUnmounted(() => {
    authStore.resetCurrentOrder();
})

</script>
<style scoped>
.order-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 3rem;
    column-gap: 4rem;
}

.customer-name {
    color: rgba(39, 85, 118, 1);
}
</style>