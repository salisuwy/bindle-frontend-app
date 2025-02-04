<template>
  <UserProfileLayout>
    <div class="w-full">
      <h2 class="text-left mb-6 text-2xl">{{ capitalize(selectedTab.title) }}</h2>

      <div class="profile-tabs flex flex-wrap mb-8">
        <button
          class="px-4 py-2"
          :class="{
            ' bg-teal-950 text-white hover:bg-teal-800': isCurrentTab('profile'),
            'bg-theme-pale text-gray-400 hover:text-gray-600 focus:outline-none':
              !isCurrentTab('profile'),
          }"
          @click.prevent.stop="changeTab('profile')"
        >
          Profile Details
        </button>
        <button
          class="px-4 py-2 ml-4 mt-2 md:mt-0"
          :class="{
            ' bg-teal-950 text-white hover:bg-teal-800': isCurrentTab('addresses'),
            ' bg-theme-pale text-gray-400 hover:text-gray-600 focus:outline-none':
              !isCurrentTab('addresses'),
          }"
          @click.prevent.stop="changeTab('addresses')"
        >
          Addresses
        </button>
      </div>
      <div
        v-if="
          isCurrentTab('addresses') &&
          !route.fullPath.includes('new') &&
          !route.params.addressId &&
          authStore.state.allAddresses?.length > 0
        "
        class="flex justify-end mb-4"
      >
        <button
          class="px-4 py-2 ml-4 mt-2 md:mt-0 text-teal-500 border-teal-500 bg-transparent hover:bg-teal-500 hover:text-white"
          @click.prevent.stop="router.push(`/user/${authStore.user.id}/addresses/new`)"
        >
          Add New Address
        </button>
      </div>
      <div
        v-if="route.fullPath.includes('new') || route.params.addressId"
        class="flex justify-start mb-4"
      >
        <button
          class="px-0 py-2 mt-2 md:mt-0 text-teal-500 bg-transparent underline text-lg focus:outline-none"
          @click.prevent.stop="router.push(`/user/${authStore.user.id}/addresses`)"
        >
          <i class="fa fa-angle-left pr-2"></i>
          Back to Addresses
        </button>
      </div>
      <slot></slot>
    </div>
  </UserProfileLayout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Field } from 'vee-validate';

import UserProfileLayout from '@/views/shared/UserProfileLayout.vue';

import { useAuthStore } from '@/store/useAuthStore';
import { watch } from 'vue';

const router = useRouter();
const route = useRoute();
const errors = ref({});

const authStore = useAuthStore();

const defaultAddress = ref(null);

const first_name = ref('');
const last_name = ref('');
const email = ref('');
const phone = ref('');
const old_password = ref('');
const new_password = ref('');
const new_password_confirmation = ref('');

const userName = authStore.user?.name?.split(' ');

first_name.value = userName && userName[0];
last_name.value = (userName && userName[1]) || '';
email.value = authStore.user?.email;
phone.value = authStore.user?.phone;

const checkErrors = (key, event) => {
  if (!event.target.value) errors.value[key] = true;
  else errors.value[key] = false;
};

const onSaveProfileDetails = () => {
  if (!first_name.value) errors.value.first_name = true;
  if (!last_name.value) errors.value.last_name = true;
  if (!phone.value) errors.value.phone = true;
  if (!email.value) errors.value.email = true;

  if (
    !errors.value.first_name &&
    !errors.value.last_name &&
    !errors.value.email &&
    !errors.value.phone
  ) {
    authStore.updateUser({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      phone: phone.value,
    });
  }
};

const onChangePassword = () => {
  if (!old_password.value) errors.value.old_password = true;
  if (!new_password.value) errors.value.new_password = true;
  if (!new_password_confirmation.value) errors.value.new_password_confirmation = true;

  if (
    !errors.value.old_password &&
    !errors.value.new_password &&
    !errors.value.new_password_confirmation
  ) {
    authStore.changePassword({
      old_password: old_password.value,
      new_password: new_password.value,
      new_password_confirmation: new_password_confirmation.value,
    });
    old_password.value = '';
    new_password.value = '';
    new_password_confirmation.value = '';
  }
};

const onDeleteUser = () => {
  authStore.deleteUser();
};

const tabs = [
  {
    title: 'My Profile',
    id: 'profile',
  },
  {
    title: 'Addresses',
    id: 'addresses',
  },
];

const selectedTab = ref({
  title: 'My Profile',
  id: 'profile',
});

const isCurrentTab = (tab) => {
  if (selectedTab.value.id === tab) return true;
  return false;
};

const changeTab = (tab) => {
  if (tab) {
    selectedTab.value = tabs.find((t) => t.id === tab);
    if (tab === 'addresses') {
      router.push(`/user/${authStore.user.id}/addresses`);
    } else {
      router.push(`/user/${authStore.user.id}`);
    }
  }
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const onDeleteAddress = (id) => {
  authStore.deleteAddress(id);
};

const onSetDefaultAddress = (id) => {
  authStore.setDefaultAddress({
    params: {
      type: 'delivery',
      default: true,
    },
    id,
  });
};

onBeforeMount(() => {
  authStore.fetchAddresses();
  console.log('onBeforeMount', route);
  if (route.fullPath.includes('addresses')) {
    selectedTab.value = tabs.find((t) => t.id === 'addresses');
  } else {
    selectedTab.value = tabs.find((t) => t.id === 'profile');
  }
});

watch(defaultAddress, (newAddress) => {
  authStore.setDefaultAddress({
    params: {
      type: 'delivery',
      default: true,
    },
    id: newAddress.id,
  });
});
</script>
