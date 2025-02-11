<template>
  <UserProfileTabLayout>
    <div>
      <form novalidate class="w-full mb-8">
        <div
          class="flex flex-col px-4 py-6 md:px-6 md:py-8 w-full bg-white rounded-md border border-solid border-zinc-200"
        >
          <header
            class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
          >
            <h1 class="grow text-xl leading-7 text-gray-700 text-left">Personal Information</h1>
          </header>
          <hr class="mt-4 h-px border border-zinc-200" />
          <section class="flex flex-col mt-6 bg-white">
            <div class="flex flex-col md:flex-row gap-5 text-base tracking-tighter leading-6">
              <div class="flex flex-col flex-1">
                <label for="profile_first_name" class="font-medium text-neutral-600 text-left"
                  >First name *</label
                >
                <Field
                  type="text"
                  v-model="first_name"
                  id="profile_first_name"
                  name="profile_first_name"
                  placeholder="Enter your first name"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.first_name,
                    'border-red-500 bg-red-50': errors.first_name,
                  }"
                  @blur="checkErrors('first_name', $event)"
                />
                <span v-if="errors.first_name" class="text-red-400 text-sm text-left"
                  >First name should not be empty!</span
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="profile_last_name" class="font-medium text-neutral-600 text-left"
                  >Last name *</label
                >
                <Field
                  type="text"
                  v-model="last_name"
                  id="profile_last_name"
                  name="profile_last_name"
                  placeholder="Enter your last name"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.last_name,
                    'border-red-500 bg-red-50': errors.last_name,
                  }"
                  @blur="checkErrors('last_name', $event)"
                />
                <span v-if="errors.last_name" class="text-red-400 text-sm text-left"
                  >Last name should not be empty!</span
                >
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-5 mt-6 text-base tracking-tighter leading-6">
              <div class="flex flex-col flex-1">
                <label for="profile_phone" class="font-medium text-neutral-600 text-left"
                  >Phone number *</label
                >
                <Field
                  type="tel"
                  v-model="phone"
                  id="profile_phone"
                  name="profile_phone"
                  placeholder="Enter your phone number"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.phone,
                    'border-red-500 bg-red-50': errors.phone,
                  }"
                  @blur="checkErrors('phone', $event)"
                />
                <span v-if="errors.phone" class="text-red-400 text-sm text-left"
                  >Phone number should not be empty!</span
                >
              </div>
              <div class="flex flex-col flex-1">
                <label for="profile_email" class="font-medium text-neutral-600 text-left"
                  >Email *</label
                >
                <Field
                  type="email"
                  v-model="email"
                  id="profile_email"
                  name="profile_email"
                  placeholder="Enter your email"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.email,
                    'border-red-500 bg-red-50': errors.email,
                  }"
                  @blur="checkErrors('email', $event)"
                />
                <span v-if="errors.email" class="text-red-400 text-sm text-left"
                  >Email address can't be empty!</span
                >
              </div>
            </div>
            <div class="flex mt-6">
              <button
                class="bg-teal-500 text-white hover:bg-teal-600"
                @click.prevent="onSaveProfileDetails"
              >
                <span v-if="authStore.state.updateUserLoading">
                  Saving Profile Changes
                  <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                </span>
                <span v-else> Save Changes </span>
              </button>
            </div>
            <!-- Error Message -->
            <p v-if="authStore.state.updateUserError" class="text-red-500 text-sm mt-1 text-left">
              Error: {{ authStore.state.updateUserError }}
            </p>
          </section>
        </div>
      </form>
      <form novalidate class="w-full mb-8">
        <div
          class="flex flex-col px-4 py-6 md:px-6 md:py-8 w-full bg-white rounded-md border border-solid border-zinc-200"
        >
          <header
            class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
          >
            <h1 class="grow text-xl leading-7 text-gray-700 text-left">Change Password</h1>
          </header>
          <hr class="mt-4 h-px border border-zinc-200" />
          <section class="flex flex-col mt-6 bg-white">
            <div class="flex flex-col md:flex-row gap-5 text-base tracking-tighter leading-6">
              <div class="flex flex-col flex-1">
                <label for="old_password" class="font-medium text-neutral-600 text-left"
                  >Current Password *</label
                >
                <Field
                  v-model="old_password"
                  type="password"
                  id="old_password"
                  name="old_password"
                  placeholder="Enter current password"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.old_password,
                    'border-red-500 bg-red-50': errors.old_password,
                  }"
                  @blur="checkErrors('old_password', $event)"
                />
                <span v-if="errors.old_password" class="text-red-400 text-sm text-left"
                  >Current password field can't be empty!</span
                >
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-5 mt-6 text-base tracking-tighter leading-6">
              <div class="flex flex-col flex-1">
                <label for="new_password" class="font-medium text-neutral-600 text-left"
                  >New Password *</label
                >
                <Field
                  v-model="new_password"
                  type="password"
                  id="new_password"
                  name="new_password"
                  placeholder="Enter new password"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.new_password,
                    'border-red-500 bg-red-50': errors.new_password,
                  }"
                  @blur="checkErrors('new_password', $event)"
                />
                <span v-if="errors.new_password" class="text-red-400 text-sm text-left"
                  >New password field can't be empty!</span
                >
              </div>
              <div class="flex flex-col flex-1">
                <label
                  for="new_password_confirmation"
                  class="font-medium text-neutral-600 text-left"
                  >Confirm New Password *</label
                >
                <Field
                  v-model="new_password_confirmation"
                  type="password"
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  placeholder="Re-enter new password"
                  class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid text-neutral-400"
                  :class="{
                    'border-zinc-200': !errors.new_password_confirmation,
                    'border-red-500 bg-red-50': errors.new_password_confirmation,
                  }"
                  @blur="checkErrors('new_password_confirmation', $event)"
                />
                <span v-if="errors.new_password_confirmation" class="text-red-400 text-sm text-left"
                  >Confirm password field can't be empty!</span
                >
              </div>
            </div>
            <div class="flex mt-6">
              <button
                class="bg-teal-500 text-white hover:bg-teal-600"
                @click.prevent="onChangePassword"
              >
                <span v-if="authStore.state.changePasswordLoading">
                  Updating Password
                  <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                </span>
                <span v-else> Update </span>
              </button>

              <!-- <button class=" text-teal-500 bg-white border-teal-500 ml-4">Forgot Password</button> -->
            </div>
            <!-- Error Message -->
            <p
              v-if="authStore.state.changePasswordError"
              class="text-red-500 text-sm mt-1 text-left"
            >
              Error:
              {{ authStore.state.changePasswordError }}
            </p>
          </section>
        </div>
      </form>
      <form novalidate class="w-full mb-8">
        <div
          class="flex flex-col px-4 py-6 md:px-6 md:py-8 w-full bg-white rounded-md border border-solid border-zinc-200"
        >
          <header
            class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
          >
            <h1 class="grow text-xl leading-7 text-gray-700 text-left">Delete Account</h1>
          </header>
          <hr class="mt-4 h-px border border-zinc-200" />
          <section class="flex flex-col mt-6 bg-white text-left">
            <p class="mb-4 text-neutral-400">
              Deleting your account is non-reversible. All of your data will be permanently deleted.
            </p>
            <div class="">
              <button
                class="bg-red-500 text-white px-6 hover:bg-red-600"
                @click.prevent="onDeleteUser"
              >
                <span v-if="authStore.state.deleteUserLoading">
                  Deleting User
                  <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
                </span>
                <span v-else> Delete </span>
              </button>
              <p v-if="authStore.state.deleteUserError" class="text-red-500 text-sm mt-1 text-left">
                Error:
                {{ authStore.state.deleteUserError }}
              </p>
            </div>
          </section>
        </div>
      </form>
    </div>
  </UserProfileTabLayout>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Field } from 'vee-validate';

import UserProfileTabLayout from '@/views/shared/UserProfileTabLayout.vue';

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

// const userName = authStore.user?.name?.split(" ");

// first_name.value = userName && userName[0];
// last_name.value = userName && userName[1] || "";
// email.value = authStore.user?.email;
// phone.value = authStore.user?.phone;

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
});

onMounted(() => {
  console.log('onMounted UserProfile', route.params.userId);
  if (route.params.userId === 'undefined') {
    console.log('onMounted UserProfile inside if', route.params.userId);
    router.push(`/user/${authStore.user.id}`);
  }

  const userName = authStore.user?.name?.split(' ');

  first_name.value = userName && userName[0];
  last_name.value = (userName && userName[1]) || '';
  email.value = authStore.user?.email;
  phone.value = authStore.user?.phone;
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
