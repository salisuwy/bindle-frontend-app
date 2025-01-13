<template>
    <UserProfileTabLayout>
        <div>
            <div v-if="authStore.state.currentAddressLoading"
                class="w-full h-[100%] flex flex-col justify-center items-center">
                <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                <span class="pt-3 font-light text-lg">Fetching Address</span>
            </div>

            <div v-else class="flex flex-col w-full bg-white rounded-md border border-solid border-zinc-200 p-4 md:p-8">
                <div class="flex flex-col items-start">
                    <!-- <h2 class="mb-4 pb-3 font-normal">Address ID: #{{ authStore.state.currentAddress?.id }}</h2> -->
                    <section class="flex flex-col flex-wrap mt-6 bg-white max-md:max-w-full text-left mb-6">
                        <div class="flex gap-5 text-base tracking-tighter leading-6 max-md:flex-wrap">
                            <div class="flex flex-col flex-1">
                                <label for="delivery_first_name" class="font-medium text-neutral-600">First name
                                    *</label>
                                <Field type="text" id="delivery_first_name" name="delivery_first_name"
                                    placeholder="Enter your first name" v-model="first_name"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                            <div class="flex flex-col flex-1">
                                <label for="delivery_last_name" class="font-medium text-neutral-600">Last name *</label>
                                <Field type="text" id="delivery_last_name" name="delivery_last_name"
                                    placeholder="Enter your last name" v-model="last_name"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                        </div>
                        <div class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap">
                            <div class="flex flex-col flex-1">
                                <label for="phoneNumber" class="font-medium text-neutral-600">Phone number *</label>
                                <Field type="tel" id="phoneNumber" name="delivery_phone"
                                    placeholder="Enter your phone number" v-model="phone"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                            <div class="flex flex-col flex-1">
                                <label for="email" class="font-medium text-neutral-600">Email *</label>
                                <Field type="email" id="email" name="delivery_email" placeholder="Enter your email"
                                    v-model="email"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                        </div>
                        <label for="addressLine1"
                            class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full">
                            Address line 1 *
                        </label>
                        <Field type="text" id="addressLine1" name="delivery_address1"
                            placeholder="Enter your Address line 1" v-model="address1"
                            class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
                            @blur="updateOnBlur" />
                        <label for="addressLine2"
                            class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full">
                            Address line 2
                        </label>
                        <Field type="text" id="addressLine2" name="delivery_address2"
                            placeholder="Enter your Address line 2" v-model="address2"
                            class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
                            @blur="updateOnBlur" />
                        <div class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap">
                            <div class="flex flex-col flex-1">
                                <label for="town" class="font-medium text-neutral-600">Town *</label>
                                <Field type="text" id="town" name="delivery_town" placeholder="Enter your town"
                                    v-model="town"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                            <div class="flex flex-col flex-1">
                                <label for="city" class="font-medium text-neutral-600">City *</label>
                                <Field type="text" id="city" name="delivery_city" placeholder="Enter your city"
                                    v-model="city"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                            <div class="flex flex-col flex-1">
                                <label for="postalCode" class="font-medium text-neutral-600">
                                    ZIP/Postal code *
                                </label>
                                <Field type="text" id="postalCode" name="delivery_zip" placeholder="Enter your code"
                                    v-model="zip"
                                    class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
                                    @blur="updateOnBlur" />
                            </div>
                        </div>
                        <label for="country"
                            class="self-start mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600">
                            Select Country *
                        </label>
                        <div class="flex justify-center self-start pr-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-neutral-200 text-neutral-400"
                            @blur="updateOnBlur">
                            <Field as="select" id="country" name="delivery_country"
                                class="flex-1 bg-transparent border-none" required @change="updateOnBlur"
                                v-model="country">
                                <option value="">Select option</option>
                                <option v-for="country in countries" :key="country.code" :value="country.code">
                                    {{ country.name }}
                                </option>
                            </Field>
                        </div>
                    </section>



                    <button v-if="authStore.state.currentAddress && route.params.addressId !== 'new'"
                        @click="onEditAddress">
                        <span v-if="authStore.state.updateAddressLoading">Editing <i
                                class="fa fa-solid fa-circle-notch fa-spin ml-2"></i></span>
                        <span v-else>Edit Address</span>
                    </button>
                    <button v-else @click="onCreateAddress">

                        <span v-if="authStore.state.createAddressLoading">Saving <i
                                class="fa fa-solid fa-circle-notch fa-spin ml-2"></i></span>
                        <span v-else>Save Address</span>
                    </button>


                    <!-- Update Error Message -->
                    <p v-if="authStore.state.updateAddressError" class="text-red-500 text-sm mt-2">Error: {{
                        authStore.state.updateAddressError }}</p>


                    <!-- Create Error Message -->
                    <p v-if="authStore.state.createAddressError" class="text-red-500 text-sm mt-2">Error: {{
                        authStore.state.createAddressError }}</p>

                </div>
            </div>
        </div>
    </UserProfileTabLayout>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Field } from "vee-validate";

import UserProfileTabLayout from "@/views/shared/UserProfileTabLayout.vue";

import { useAuthStore } from "@/store/useAuthStore";
import { countries } from "@/components/helpers/countries";
import { onBeforeUnmount } from "vue";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const errors = ref({})

const authStore = useAuthStore();
const address = ref(null);

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const phone = ref("");
const address1 = ref("");
const address2 = ref("");
const town = ref("");
const city = ref("");
const zip = ref("");
const country = ref("");

const resetAddressFields = () => {
    first_name.value = "";
    last_name.value = "";
    email.value = "";
    phone.value = "";
    address1.value = "";
    address2.value = "";
    town.value = "";
    city.value = "";
    zip.value = "";
    country.value = "";
}

onBeforeMount(() => {
    authStore.getAddressById({
        id: route.params.addressId
    });
    resetAddressFields();
});

onMounted(() => {
    resetAddressFields();
})

watch(() => authStore.state.currentAddressLoading, (newVal) => {
    if (!newVal) {
        address.value = authStore.state.currentAddress;
        if (address.value && route.params.addressId !== 'new') {
            first_name.value = address.value.first_name;
            last_name.value = address.value.last_name;
            email.value = address.value.email;
            phone.value = address.value.phone;
            address1.value = address.value.address1;
            address2.value = address.value.address2;
            town.value = address.value.town;
            city.value = address.value.city;
            zip.value = address.value.zip;
            country.value = address.value.country;
        }
    }
});

watch(() => route.params.addressId, (newId, oldId) => {
    console.log("watch", newId, oldId);
    resetAddressFields();
    if (newId !== 'new') {
        authStore.getAddressById({
            id: newId
        });
    }
}, { immediate: true });

const updateOnBlur = () => {
    // Handle blur event if needed
};



const onEditAddress = () => {
    const updatedAddress = {
        id: route.params.addressId,
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone: phone.value,
        address1: address1.value,
        address2: address2.value,
        town: town.value,
        city: city.value,
        zip: zip.value,
        country: country.value
    };
    authStore.updateAddress(updatedAddress);
    // router.push(`/user/${authStore.user?.id}/addresses`);
    // resetAddressFields();
};

const onCreateAddress = () => {
    const newAddress = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone: phone.value,
        address1: address1.value,
        address2: address2.value,
        town: town.value,
        city: city.value,
        zip: zip.value,
        country: country.value
    };
    authStore.createAddress(newAddress);
    // router.push(`/user/${authStore.user?.id}/addresses`);
    // resetAddressFields();
}
</script>
