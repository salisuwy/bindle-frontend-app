import { createRouter, createWebHistory } from 'vue-router';

import { Util } from '@/components/helpers/Util.js';

import IndexPage from '@/views/index/IndexPage.vue';
import ContactPage from '@/views/contact/ContactPage.vue';
import PrivacyPolicyPage from '@/views/policies/PrivacyPolicyPage.vue';
import TermsAndConditionsPage from '@/views/policies/TermsAndConditionsPage.vue';
import ResourcesPage from '@/views/resources/ResourcesPage.vue';
import GCSEPage from '@/views/level/GCSEPage.vue';
import ALevelPage from '@/views/level/ALevelPage.vue';
import BundlesPage from '@/views/bundles/BundlesPage.vue';
import PageNotFoundPage from '@/views/PageNotFoundPage.vue';

import ExploreResourcesPage from '@/views/resources/ExploreResourcesPage.vue';
import BundleDetailPage from '@/views/product_details/BundleDetailPage.vue';
import BookDetailPage from '@/views/product_details/BookDetailPage.vue';

import CheckoutSummaryPage from '@/views/shop/CheckoutSummaryPage.vue';
import CheckoutPaymentPage from '@/views/shop/CheckoutPaymentPage.vue';
import InvoicePage from '@/views/shop/InvoicePage.vue';

import SignupPage from '@/views/user-profile/SignupPage.vue';
import LoginPage from '@/views/user-profile/LoginPage.vue';
import ForgotPasswordPage from '@/views/user-profile/ForgotPasswordPage.vue';
import RegisterUserPage from '@/views/user-profile/RegisterUserPage.vue';
import UserProfilePage from '@/views/user-profile/UserProfilePage.vue';
import UserProfileOrdersPage from '@/views/user-profile/UserProfileOrdersPage.vue';
import UserProfileBuddyPage from '@/views/user-profile/UserProfileBuddyPage.vue';
import UserProfileOrderPage from '@/views/user-profile/UserProfileOrderPage.vue';
import UserProfileAddressesPage from '@/views/user-profile/UserProfileAddressesPage.vue';
import UserProfileAddressPage from '@/views/user-profile/UserProfileAddressPage.vue';
import AuthSuccessPage from '@/views/AuthSuccessPage.vue';

import { useHead } from '@unhead/vue';

const routes = [
  {
    name: 'index',
    path: '/',
    component: IndexPage,
    meta: { breadcrumb: 'Home', title: 'Home' },
  },
  {
    name: 'contact-us',
    path: '/contact-us',
    component: ContactPage,
    meta: { breadcrumb: 'Contact Us', title: 'Contact Us' },
  },
  {
    name: 'privacy-policy',
    path: '/privacy-policy',
    component: PrivacyPolicyPage,
    meta: {
      breadcrumb: 'Privacy Policy',
      title: 'Privacy Policy',
    },
  },
  {
    name: 'terms-and-conditions',
    path: '/terms-and-conditions',
    component: TermsAndConditionsPage,
    meta: { breadcrumb: 'Terms and Conditions', title: 'Terms and Conditions' },
  },
  {
    name: 'resources',
    path: '/resources',
    component: ResourcesPage,
    meta: { breadcrumb: 'Resources', title: 'Resources' },
  },
  {
    name: 'bundles',
    path: '/bundles',
    component: BundlesPage,
    meta: {
      breadcrumb: 'Bundles',
      title: 'Bundles',
    },
  },
  {
    name: 'gcse',
    path: '/gcse',
    component: GCSEPage,
    meta: {
      breadcrumb: 'GCSE',
      title: 'GCSE',
    },
  },
  {
    name: 'a-level',
    path: '/a-level',
    component: ALevelPage,
    meta: {
      breadcrumb: 'A-Level',
      title: 'A-Level',
    },
  },
  // --------------- Product listing pages ---------------
  {
    name: 'explore-all',
    path: '/resources/explore',
    component: ExploreResourcesPage,
    meta: { breadcrumb: 'Explore' },
    props: { mode: 'all' },
  },
  {
    name: 'explore-bundles',
    path: '/bundles/explore',
    component: ExploreResourcesPage,
    meta: {
      breadcrumb: 'ExploreBundles',
    },
    props: { mode: 'bundles' },
  },
  {
    name: 'explore-level-subject',
    path: '/:level/:subject',
    component: ExploreResourcesPage,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.subject),
    },
    props: { mode: 'level-subject' },
  },
  // --------------- Product detail pages ---------------
  {
    name: 'bundle',
    path: '/bundles/:bundle',
    component: BundleDetailPage,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.bundle),
    },
  },
  {
    name: 'book',
    path: '/:level/:subject/:book',
    component: BookDetailPage,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.book),
    },
  },

  // -------------------- Checkout ----------------------
  {
    name: 'checkout',
    path: '/checkout',
    component: CheckoutSummaryPage,
    meta: { breadcrumb: 'Checkout', title: 'Checkout' },
  },
  {
    name: 'checkout-payment',
    path: '/checkout-payment',
    component: CheckoutPaymentPage,
    meta: { breadcrumb: 'Checkout', title: 'Checkout Payment' },
  },
  {
    name: 'invoice',
    path: '/invoice/:anonId/:orderId',
    component: InvoicePage,
    meta: { breadcrumb: 'Invoice', title: 'Invoice' },
  },

  // -------------------- User profile ----------------------
  {
    name: 'user-profile-signup',
    path: '/signup',
    component: SignupPage,
  },
  {
    name: 'user-profile-login',
    path: '/login',
    component: LoginPage,
  },
  {
    name: 'user-profile-forgot-password',
    path: '/forgot-password',
    component: ForgotPasswordPage,
  },
  {
    name: 'user-register',
    path: '/register-user',
    component: RegisterUserPage,
  },
  {
    name: 'user-profile',
    path: '/user/:userId',
    component: UserProfilePage,
  },
  {
    name: 'user-profile-orders',
    path: '/user/:userId/orders',
    component: UserProfileOrdersPage,
  },
  {
    name: 'user-profile-orders-page',
    path: '/user/:userId/orders/:orderId',
    component: UserProfileOrderPage,
  },
  {
    name: 'user-profile-buddy',
    path: '/user/:userId/buddy',
    component: UserProfileBuddyPage,
  },
  {
    name: 'user-profile-addresses',
    path: '/user/:userId/addresses',
    component: UserProfileAddressesPage,
  },
  {
    name: 'user-profile-address-page',
    path: '/user/:userId/addresses/:addressId',
    component: UserProfileAddressPage,
  },
  {
    path: '/auth/success',
    name: 'auth-success',
    component: AuthSuccessPage,
  },
  {
    name: 'page-not-found',
    path: '/:pathMatch(.*)*',
    component: PageNotFoundPage,
    meta: {
      title: 'Page Not Found',
    },
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if ('preventScrollBehaviour' in to.meta) {
      if (to.meta.preventScrollBehaviour(to, from, savedPosition)) {
        return {};
      }
    }
    if (savedPosition) {
      return savedPosition;
    } else if (to.path === from.path && to.query !== from.query) {
      return {};
    } else {
      return { top: 0 };
    }
  },
});

router.afterEach((to) => {
  const pageTitle = to.meta.title || '';
  if (pageTitle) {
    useHead({ title: `Bindle - ${pageTitle}` });
  }
});

export default router;
export { routes };
