<template>
    <UserProfileTabLayout>
        <div>
            <div v-if="authStore.state.allAddressesLoading"
                class="w-full h-[100%] flex flex-col justify-center items-center">
                <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                <span class="pt-3 font-light text-lg">Loading Addresses </span>
            </div>
            <div v-else class="flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 p-4 md:p-8">
                <div class="border-b flex flex-wrap justify-between">
                    <h2 class="mb-4 pb-3 font-normal">All Addresses</h2>
                    <div class="flex items-center">
                        <!-- <input type="checkbox" id="is_billing_address">
                            <label for="is_billing_address" class="pl-2 text-theme-darkgray">Use this address for
                                billing details</label> -->
                    </div>
                </div>

                <div v-for="(address, addressIndex) in authStore.state.allAddresses" :key="address.id"
                    class="flex flex-col md:flex-row pt-6 border-b pb-6"
                    :class="{ 'border-none': addressIndex === authStore.state.allAddresses.length - 1 }">
                    <div class="flex flex-wrap md:items-start justify-between w-full">
                        <label :for="`default-address-${address.id}`" class="text-left">
                            <ul>
                                <li class="font-medium customer-name">{{
                                    address.first_name?.toUpperCase() }} {{
                                        address.last_name?.toUpperCase() }}
                                </li>
                                <li>{{ address.address1 }} {{
                                    address.address2 }},
                                    {{ address.town }} {{
                                        address.city }},
                                    {{ address.zip }}, {{
                                        address.country }}</li>
                                <li class="text-gray-500">Phone: <span class="text-theme-black font-medium">{{
                                    address.phone }}</span> </li>
                                <li class="text-gray-500">Email: <span class="text-theme-black font-medium">{{
                                    address.email }}</span> </li>
                                <li v-if="address.is_delivery_default === 1" class="mt-1">
                                    <span
                                        class="text-sm border bg-teal-500 px-2 py-1 text-white uppercase rounded-lg font-medium">Default</span>
                                </li>
                            </ul>

                        </label>
                        <div class="flex mt-6 md:mt-0">

                            <button class=" text-teal-500 border-teal-500 bg-transparent text-sm"
                                @click.prevent="goToEditPage(address.id)">

                                <!-- <i class="fa fa-pencil"></i> -->
                                Edit
                            </button>

                            <!-- <button v-if="address.is_delivery_default === 1"
                                    class="text-red-500 border-red-500 bg-transparent ml-4 text-sm"
                                    @click.prevent="onSaveProfileDetails">

                                    Remove Default

                                </button> -->
                            <button v-if="address.is_delivery_default !== 1"
                                class=" text-teal-500 border-teal-500 bg-transparent ml-4 text-sm"
                                @click.prevent="onSetDefaultAddress(address.id)">

                                Set Default

                            </button>

                            <button class=" text-red-500 border-red-500 bg-transparent ml-4 text-sm"
                                @click.prevent="onDeleteAddress(address.id)">

                                <!-- <i class="fa fa-trash"></i> -->
                                Delete
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </UserProfileTabLayout>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { Field } from "vee-validate";

import UserProfileTabLayout from "@/views/shared/UserProfileTabLayout.vue";

import { useAuthStore } from "@/store/useAuthStore";
import { watch } from "vue";

const router = useRouter();
const errors = ref({})

const authStore = useAuthStore();

const defaultAddress = ref(null);

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const phone = ref("");
const old_password = ref("");
const new_password = ref("");
const new_password_confirmation = ref("");

const userName = authStore.user?.name?.split(" ");

first_name.value = userName && userName[0];
last_name.value = userName && userName[1] || "";
email.value = authStore.user?.email;
phone.value = authStore.user?.phone;

const checkErrors = (key, event) => {
    if (!event.target.value) errors.value[key] = true;
    else errors.value[key] = false;
}

const onSaveProfileDetails = () => {
    if (!first_name.value) errors.value.first_name = true;
    if (!last_name.value) errors.value.last_name = true;
    if (!phone.value) errors.value.phone = true;
    if (!email.value) errors.value.email = true;

    if (!errors.value.first_name && !errors.value.last_name && !errors.value.email && !errors.value.phone) {
        authStore.updateUser({
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            phone: phone.value
        });
    }
}

const onChangePassword = () => {
    if (!old_password.value) errors.value.old_password = true;
    if (!new_password.value) errors.value.new_password = true;
    if (!new_password_confirmation.value) errors.value.new_password_confirmation = true;

    if (!errors.value.old_password && !errors.value.new_password && !errors.value.new_password_confirmation) {
        authStore.changePassword({
            "old_password": old_password.value,
            "new_password": new_password.value,
            "new_password_confirmation": new_password_confirmation.value
        });
        old_password.value = "";
        new_password.value = "";
        new_password_confirmation.value = "";
    }
}

const onDeleteUser = () => {
    authStore.deleteUser();
}

const tabs = [
    {
        title: 'My Profile',
        id: 'profile'
    },
    {
        title: 'Addresses',
        id: 'addresses'
    }
]

const selectedTab = ref({
    title: 'My Profile',
    id: 'profile'
});

const isCurrentTab = (tab) => {
    if (selectedTab.value.id === tab) return true;
    return false;
}

const changeTab = (tab) => {
    if (tab) {
        selectedTab.value = tabs.find(t => t.id === tab);
        if (tab === 'addresses') {
            router.push(`/user/${authStore.user.id}/addresses`)
        } else {
            router.push(`/user/${authStore.user.id}`)
        }

    }
}

const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const onDeleteAddress = (id) => {
    authStore.deleteAddress(id);
}

const onSetDefaultAddress = (id) => {
    authStore.setDefaultAddress({
        params: {
            "type": "delivery",
            "default": true
        },
        id
    });
}

const goToEditPage = (id) => {
    router.push(`/user/${authStore.user.id}/addresses/${id}`);
}

onBeforeMount(() => {
    authStore.fetchAddresses();
})

watch(defaultAddress, (newAddress) => {
    authStore.setDefaultAddress({
        params: {
            "type": "delivery",
            "default": true
        },
        id: newAddress.id
    });
})
</script>
