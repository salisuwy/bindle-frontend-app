import { createRouter, createWebHistory } from "vue-router";
import { useBindleApiStore } from "@/store/bindle-api.js";
import { Util } from "@/components/helpers/Util.js";
import Index from "@/views/index/Index.vue";
import Contact from "@/views/contact/Contact.vue";
import PrivacyPolicy from "@/views/policies/PrivacyPolicy.vue";
import TermsAndConditions from "@/views/policies/TermsAndConditions.vue";
import Resources from "@/views/resources/Resources.vue";
import SubjectExplore from "@/views/level/SubjectExplore.vue";
import Book from "@/views/shop/Book.vue";
import GCSE from "@/views/level/GCSE.vue";
import ALevel from "@/views/level/ALevel.vue";
import Bundles from "@/views/bundles/Bundles.vue";
import Bundle from "@/views/shop/Bundle.vue";
import ExploreBundles from "@/views/bundles/Explore.vue";
import GenericLevel from "@/views/level/GenericLevel.vue";
import Explore from "@/views/resources/Explore.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Tokens from "@/views/Tokens.vue";
import Test from "@/views/Test.vue";
import Checkout from "@/views/shop/Checkout.vue";
import CheckoutV2 from "@/views/shop/CheckoutV2.vue";
import CheckoutAddress from "@/views/shop/CheckoutAddress.vue";
import CheckoutPayment from "@/views/shop/CheckoutPayment.vue";
import CheckoutPaymentV2 from "@/views/shop/CheckoutPaymentV2.vue";
import Invoice from "@/views/shop/Invoice.vue";
import { useHead } from "@unhead/vue";

const routes = [
  {
    name: "index",
    path: "/",
    component: Index,
    meta: { breadcrumb: "Home", title: "Home" },
  },
  {
    name: "contact-us",
    path: "/contact-us",
    component: Contact,
    meta: { breadcrumb: "Contact Us", title: "Contact Us" },
  },
  {
    name: "privacy-policy",
    path: "/privacy-policy",
    component: PrivacyPolicy,
    meta: {
      breadcrumb: "Privacy Policy",
      title: "Privacy Policy",
    },
  },
  {
    name: "terms-and-conditions",
    path: "/terms-and-conditions",
    component: TermsAndConditions,
    meta: { breadcrumb: "Terms and Conditions", title: "Terms and Conditions" },
  },
  {
    name: "explore-resources",
    path: "/resources/explore",
    component: Explore,
    meta: { breadcrumb: "Explore" },
  },
  {
    name: "resources",
    path: "/resources",
    component: Resources,
    meta: { breadcrumb: "Resources", title: "Resources" },
  },
  {
    name: "bundles",
    path: "/bundles",
    component: Bundles,
    meta: {
      breadcrumb: "Bundles",
      title: "Bundles",
    },
  },
  {
    name: "explore-bundles",
    path: "/bundles/explore",
    component: ExploreBundles,
    meta: {
      breadcrumb: "ExploreBundles",
    },
  },
  {
    name: "bundle",
    path: "/bundles/:bundle",
    component: Bundle,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.bundle),
    },
  },
  // {
  //   name: "checkout",
  //   path: "/checkout",
  //   component: Checkout,
  //   meta: { breadcrumb: "Checkout", title: "Checkout" },
  // },
  {
    name: "checkout",
    path: "/checkout",
    component: CheckoutV2,
    meta: { breadcrumb: "Checkout", title: "Checkout" },
  },
  {
    name: "checkout-address",
    path: "/checkout-address",
    component: CheckoutAddress,
    meta: { breadcrumb: "Checkout", title: "Checkout Address" },
  },
  // {
  //   name: "checkout-payment",
  //   path: "/checkout-payment",
  //   component: CheckoutPayment,
  //   meta: { breadcrumb: "Checkout", title: "Checkout Payment" },
  // },
  {
    name: "checkout-payment",
    path: "/checkout-payment",
    component: CheckoutPaymentV2,
    meta: { breadcrumb: "Checkout", title: "Checkout Payment" },
  },
  {
    name: "invoice",
    path: "/invoice/:anonId/:orderId",
    component: Invoice,
    meta: { breadcrumb: "Invoice", title: "Invoice" },
  },
  {
    name: "gcse",
    path: "/gcse",
    component: GCSE,
    meta: {
      breadcrumb: "GCSE",
      title: "GCSE",
    },
  },
  {
    name: "a-level",
    path: "/a-level",
    component: ALevel,
    meta: {
      breadcrumb: "A-Level",
      title: "A-Level",
    },
  },
  {
    name: "book",
    path: "/:level/:subject/:book",
    component: Book,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.book),
    },
    beforeEnter: async (to, from, next) => {
      const bindleStore = useBindleApiStore();
      await bindleStore.getLevels();
      await bindleStore.getSubjects();
      await bindleStore.getBooks();
      if (
        !Object.values(bindleStore.levels).some(
          (level) => level["slug"] === to.params.level
        )
      ) {
        bindleStore.routingFailed = true;
      }
      if (
        to.params.subject !== "mixed" &&
        !Object.values(bindleStore.subjects).some(
          (subject) => subject["slug"] === to.params.subject
        )
      ) {
        bindleStore.routingFailed = true;
      }
      if (
        !Object.values(bindleStore.books).some(
          (book) => book["slug"] === to.params.book
        )
      ) {
        bindleStore.routingFailed = true;
      }
      next();
    },
  },
  {
    name: "subject",
    path: "/:level/:subject",
    component: SubjectExplore,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.subject),
      preventScrollBehaviour: (to, from, savedPosition) =>
        to.name === from.name,
    },
    beforeEnter: async (to, from, next) => {
      const bindleStore = useBindleApiStore();
      await bindleStore.getLevels();
      await bindleStore.getSubjects();
      if (
        !Object.values(bindleStore.levels).some(
          (level) => level["slug"] === to.params.level
        ) ||
        !Object.values(bindleStore.subjects).some(
          (subject) => subject["slug"] === to.params.subject
        )
      ) {
        useBindleApiStore().routingFailed = true;
      }
      next();
    },
  },
  {
    name: "tokens",
    path: "/tokens",
    component: Tokens,
  },
  {
    name: "test",
    path: "/test",
    component: Test,
  },
  {
    name: "generic-level",
    path: "/:level",
    component: GenericLevel,
    meta: {
      breadcrumb: (route) => Util.humaniseSnakeCase(route.params.level),
      title: "Generic Level",
    },
    beforeEnter: async (to, from, next) => {
      const bindleStore = useBindleApiStore();
      await bindleStore.getLevels();
      if (
        !Object.values(bindleStore.levels).some(
          (level) => level["slug"] === to.params.level
        )
      ) {
        useBindleApiStore().routingFailed = true;
      }
    },
  },
  {
    name: "page-not-found",
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
    meta: {
      title: "Page Not Found",
    },
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if ("preventScrollBehaviour" in to.meta) {
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

router.beforeEach((to, from, next) => {
  useBindleApiStore().routingFailed = false;
  next();
});

router.afterEach((to) => {
  const pageTitle = to.meta.title || "";
  if (pageTitle) {
    useHead({ title: `Bindle - ${pageTitle}` });
  }
});

export default router;
export { routes };
