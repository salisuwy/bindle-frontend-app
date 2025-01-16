<template>
    <UserProfileLayout>
        <div v-if="authStore.allOrdersLoading" class="w-full h-[100%] flex flex-col justify-center items-center">
            <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
            <span class="pt-3 font-light text-lg">Loading Orders ... </span>
        </div>
        <div v-else class="w-full">
            <section v-if="authStore.state.allOrders?.length === 0"
                class="flex flex-col px-5 max-w-[273px] mx-auto my-8">
                <img loading="lazy" src="/assets/orders.svg" />
                <h2 class="self-center mt-3 text-2xl font-medium leading-8 text-slate-800">
                    No Orders Placed Yet
                </h2>
                <p class="mt-1 w-full text-xl font-light tracking-tighter leading-7 text-center text-zinc-500">
                    Don’t wait & Let’s make your first purchase now.
                </p>
                <button @click="exploreShop"
                    class="justify-center items-center px-3.5 py-2.5 mt-5 w-full text-sm font-semibold text-white bg-teal-500 rounded-sm hover:bg-teal-600">
                    Explore Shop
                </button>
            </section>
            <div v-else>
                <h2 class="text-left mb-6">Your Orders <span v-if="ordersCount > 0" class="text-sm text-gray-400">{{
                    ordersCount }}</span></h2>

                <!-- <div class="order-tabs flex mb-8">
                    <button class="px-4 py-2"
                        :class="{ ' bg-teal-950 text-white': isCurrentTab('all'), 'bg-theme-pale text-gray-400 ': !isCurrentTab('all') }"
                        @click.prevent.stop="selectedTab = 'all'"> All
                        Orders</button>
                    <button class="px-4 py-2 ml-4"
                        :class="{ ' bg-teal-950 text-white': isCurrentTab('cancelled'), ' bg-theme-pale text-gray-400 ': !isCurrentTab('cancelled') }"
                        @click.prevent.stop="selectedTab = 'cancelled'">Cancelled
                        Orders</button>
                </div> -->
                <div>
                    <div v-for="order in authStore.state.allOrders" :key="order.id"
                        class="flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full mb-6">
                        <header
                            class="px-6 py-10 flex flex-row gap-2 justify-between items-center self-stretch pt-6 pb-0.5">
                            <h1 class="grow text-xl leading-7 text-gray-700 text-left font-medium" :class="{
                                'text-teal-500': order.status === 'DISP_BY_GARDNER'
                            }">{{
                                orderStatusMapping[order.status] }}</h1>
                            <span class=" text-gray-500 text-right">Order ID: <span
                                    class=" text-theme-black font-medium">#{{
                                        order.uuid }}</span></span>
                        </header>
                        <hr class="mt-4 h-px border border-zinc-200" />
                        <section class="px-6 py-8 flex flex-row justify-between items-end max-md:max-w-full flex-wrap">
                            <div class="w-[80%]">
                                <p class="pb-6 text-left">Ordered on {{ formattedDate(order.created_at) }}</p>
                                <div class="flex flex-row pt-6 pr-6 overflow-scroll">
                                    <img v-for="image in order.images" :key="image" class="pr-3 w-28" :src="image">
                                </div>
                            </div>
                            <a class="bg-transparent text-teal-500 py-0 items-center cursor-pointer mt-6 md:mt-0"
                                @click="goToOrderPage(order.id)">View
                                Details
                                <i class="fa fa-solid fa-angle-right ml-2 text-lg"></i>
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>


    </UserProfileLayout>

</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/useAuthStore";
import UserProfileLayout from "@/views/shared/UserProfileLayout.vue";

const router = useRouter();
const authStore = useAuthStore();

const orderStatusMapping = {
    'CHECKOUT': "Order Confirmed!",
    'OTHERS': "Processing",
    'DISP_BY_GARDNER': "Order Dispatched!",
    'DELIVERED': "Delivered"
}
const ordersCount = ref(0);
const selectedTab = ref('all');
const isCurrentTab = (tab) => {
    if (selectedTab.value === tab) return true;
    return false;
}

const goToOrderPage = (orderId) => {
    router.push(`orders/${orderId}`);
}

const formattedDate = (date) => {
    const newDate = new Date(date);
    return newDate.toDateString();
}

const exploreShop = () => {
    router.push("/resources");
}

onBeforeMount(() => {
    authStore.fetchAllOrders({
        page: 1,
    });
})
</script>
