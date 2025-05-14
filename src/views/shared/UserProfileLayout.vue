<template>
  <div class="w-full max-w-full border-b border-theme-gray">
    <layout-header class="max-w-8xl mx-auto"></layout-header>
  </div>
  <WelcomeCoupon />
  <main class="w-full">
    <div class="flex flex-col md:flex-row px-4 md:px-8 mt-6 max-w-18xl overflow-hidden max-w-8xl mx-auto">
      <nav aria-label="breadcrumb" class="text-left w-full col-start-1 md:col-span-4 grow">
        <ol class="breadcrumbs flex flex-row flex-wrap gap-2 sm:gap-4">
          <li v-for="(breadcrumb, index) in getBreadcrumbs" :key="index" class="breadcrumb-item inline text-sm">
            <span v-if="index > 0" class="mr-3">/</span>
            <router-link v-if="breadcrumb.path !== ''" :to="breadcrumb.path">{{
              breadcrumb.text
              }}</router-link>
            <span v-else class="text-theme-darkgray">{{ breadcrumb.text }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <div
      class="user-profile min-h-96 flex flex-col md:flex-row px-4 md:px-8 py-8 mt-6 max-w-18xl overflow-hidden max-w-8xl mx-auto">
      <div class="profile-sidebar w-full md:w-auto pr-0 md:pr-12 mb-6 md:mb-0 flex flex-wrap flex-col">
        <div class="flex">
          <button class="md:hidden mb-4" @click="toggleMobileMenu">☰</button>
        </div>

        <div :class="{
          hidden: !isMobileMenuVisible,
          block: isMobileMenuVisible,
          'md:block': true,
        }">
          <h3 class="border-b mb-3 pb-3 text-left max-w-fit">MY ACCOUNT</h3>
          <ul>
            <li class="pb-4 text-left cursor-pointer hover:text-teal-500"
              :class="{ 'text-teal-500': $route.name == 'user-profile' }"
              @click.prevent.stop="goToRoute('user-profile')">
              My Profile
            </li>
            <li class="pb-4 text-left cursor-pointer hover:text-teal-500"
              :class="{ 'text-teal-500': $route.name == 'user-profile-orders' }"
              @click.prevent.stop="goToRoute('user-profile-orders')">
              Orders
            </li>
            <li class="pb-4 text-left cursor-pointer hover:text-teal-500"
              :class="{ 'text-teal-500': $route.name == 'user-profile-buddy' }"
              @click.prevent.stop="goToRoute('user-profile-buddy')">
              Bindle Buddy
            </li>
            <li class="pb-4 text-left cursor-pointer hover:text-teal-500"
              :class="{ 'text-teal-500': $route.name == 'user-profile-e-reader' }"
              @click.prevent.stop="goToRoute('user-profile-e-reader')">
              E-reader
            </li>
            <li class="pb-4 text-left cursor-pointer hover:text-teal-500"
              :class="{ 'text-teal-500': $route.name == 'user-profile-study-plan' }"
              @click.prevent.stop="goToRoute('user-profile-study-plan')">
              Study Plan
            </li>
          </ul>
        </div>
      </div>
      <div class="px-0 md:pr-12 w-full">
        <slot></slot>
      </div>
    </div>
  </main>
  <div class="w-full max-w-full">
    <layout-footer />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useAuthStore } from '@/store/useAuthStore';

import LayoutHeader from './HeaderV2.vue';
import LayoutFooter from './Footer.vue';
import WelcomeCoupon from '@/components/WelcomeCoupon.vue';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const goToRoute = (routeName) => {
  router.push({ name: routeName, params: { userId: authStore.user.id } });
};

const getBreadcrumbs = computed(() => {
  const profileBreadcrumbs = [
    { text: 'Home', path: '/' },
    { text: 'My Account', path: `/user/${authStore.user?.id}` },
  ];

  const addressesBreadcrumbs = [
    { text: 'Home', path: '/' },
    { text: 'My Account', path: `/user/${authStore.user?.id}` },
    { text: 'Addresses', path: `/user/${authStore.user?.id}/addresses` },
  ];


  const addressPageBreadcrumbs = [...addressesBreadcrumbs, {
    text: 'Address ID: #' + authStore.state.currentAddress?.id,
    path: `/user/${authStore.user?.id}/addresses/${authStore.state.currentAddress?.id || ''}`
  }]

  const newAddressPageBreadcrumbs = [...addressesBreadcrumbs, {
    text: 'New Address',
    path: `/user/${authStore.user?.id}/addresses/new`
  }]

  const ordersBreadcrumbs = [
    { text: 'Home', path: '/' },
    { text: 'My Account', path: `/user/${authStore.user?.id}` },
    { text: 'Orders', path: `/user/${authStore.user?.id}/orders` },
  ];

  const orderPageBreadcrumbs = [
    { text: 'Home', path: '/' },
    { text: 'My Account', path: `/user/${authStore.user?.id}` },
    { text: 'Orders', path: `/user/${authStore.user?.id}/orders` },
    {
      text: `Order ID: #${authStore.currentOrder?.uuid}`,
      path: `/user/${authStore.user?.id}/orders/${authStore.currentOrder?.id}`,
    },
  ];

  const buddyBreadcrumbs = [
    { text: 'Home', path: '/' },
    { text: 'My Account', path: `/user/${authStore.user?.id}` },
    { text: 'Bindle Buddy', path: `/user/${authStore.user?.id}/buddy` },
  ];

  if (route.name == 'user-profile-orders') {
    if (authStore.currentOrder) {
      return orderPageBreadcrumbs;
    }
    return ordersBreadcrumbs;
  } else if (route.name == 'user-profile-buddy') {
    return buddyBreadcrumbs;
  } else if (route.name == 'user-profile-addresses') {
    return addressesBreadcrumbs
  } else if (route.name == 'user-profile-address-page') {
    return addressPageBreadcrumbs
  } else if (route.name == 'user-profile-address-page-new') {
    return newAddressPageBreadcrumbs
  } else {
    return profileBreadcrumbs;
  }
});

const isMobileMenuVisible = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuVisible.value = !isMobileMenuVisible.value;
};
</script>

<style scoped>
.profile-sidebar {
  width: 100% !important;
  max-width: 300px;
}
</style>
