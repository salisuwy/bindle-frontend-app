<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

import UserProfileTabLayout from '@/views/shared/UserProfileTabLayout.vue';
import AddressForm from '@/components/forms/AddressForm.vue';
import FormContainer from '@/components/forms/FormContainer.vue';
import BindleButton from '@/components/BindleButton.vue';

import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from 'vue-router';

import {
  EMPTY_ADDRESS,
  createFromSavedAddress,
  isAddressEqual,
  isAddressValid,
} from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const saving = computed(
  () => authStore.state.updateAddressLoading || authStore.state.createAddressLoading
);
const disableForm = computed(() => loading.value || saving.value);

const initialAddress = ref<Partial<Address>>({ ...EMPTY_ADDRESS });
const address = ref<Partial<Address>>({ ...EMPTY_ADDRESS });
const showAddressErrors = ref(false);

const isNew = computed(() => route.params.addressId == 'new');
onMounted(async () => {
  if (route.params.addressId != 'new') {
    authStore.getAddressById({
      id: route.params.addressId,
    });
  } else {
    loading.value = false;
  }
});

watch(
  () => authStore.state.currentAddressLoading,
  (newVal) => {
    if (!newVal) {
      if (authStore.state.currentAddress !== null) {
        initialAddress.value = createFromSavedAddress(authStore.state.currentAddress);
        address.value = initialAddress.value;
      }
      loading.value = false;
    }
  }
);

const hasChanged = computed(() => !isAddressEqual(initialAddress.value, address.value));

const handleClick = () => {
  const innerAddress = address.value;
  if (isAddressValid(innerAddress)) {
    if (isNew.value) {
      console.log('add a new address:', innerAddress);
      createAddress(innerAddress);
    } else {
      console.log('update an existing address', innerAddress);
      updateAddress(innerAddress);
    }
  } else {
    showAddressErrors.value = true;
  }
};

const updateAddress = (a: Address) => {
  const updatedAddress = {
    id: parseInt(route.params.addressId as string),
    first_name: a.first_name,
    last_name: a.last_name,
    email: a.email,
    phone: a.phone,
    address1: a.address1,
    address2: a.address2 === undefined ? null : a.address2,
    town: a.city,
    city: a.city,
    zip: a.zip,
    country: a.country,
    is_delivery_default: authStore.state.currentAddress?.is_delivery_default || false,
    is_billing_default: authStore.state.currentAddress?.is_billing_default || false,
  };
  authStore.updateAddress(updatedAddress);
};

const createAddress = (a: Address) => {
  const newAddress = {
    first_name: a.first_name,
    last_name: a.last_name,
    email: a.email,
    phone: a.phone,
    address1: a.address1,
    address2: a.address2,
    town: a.city,
    city: a.city,
    zip: a.zip,
    country: a.country,
    is_delivery_default: authStore.state.allAddresses.length === 0 ? true : false,
    is_billing_default: authStore.state.allAddresses.length === 0 ? true : false,
  };
  authStore.createAddress(newAddress);
};
</script>

<template>
  <UserProfileTabLayout>
    <FormContainer hideHeader>
      <AddressForm
        id="profile_address"
        v-model="address"
        :loading="loading"
        :disabled="disableForm"
        :showAllErrors="showAddressErrors"
      />
      <BindleButton
        @click="handleClick"
        :disabled="!hasChanged"
        :loading="saving"
        class="min-w-[12rem] max-md:w-full"
        type="primary"
        >{{ isNew ? 'Save' : 'Update' }}</BindleButton
      >
    </FormContainer>
  </UserProfileTabLayout>
</template>

<style scoped></style>
