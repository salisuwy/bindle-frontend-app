<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBindleApiStore } from '@/store/bindle-api.js';
import { Util } from '@/components/helpers/Util.js';

import BindleLogo from '@/views/shared/BindleLogo.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import HorizontalMenuBar from '@/components/HorizontalMenuBar.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import CartIcon from '@/components/icons/CartIcon.vue';
import UserIcon from '@/components/icons/UserIcon.vue';
import HelpIcon from '@/components/icons/HelpIcon.vue';
import BurgerIcon from '@/components/icons/BurgerIcon.vue';
import SlideIn from '@/components/SlideIn.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import Cart from '@/views/shop/Cart.vue';

import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { getOrderCart } from '@/store/cart-api';
import { trackEvent } from '../../components/helpers/analytics';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();

const bindleApiStore = useBindleApiStore();
const route = useRoute();
const router = useRouter();

const menuBar = ref(null);

const searchText = ref(route.query.q || '');
const subjects = ref(null);
const levels = ref(null);
const types = ref(null);
const books = ref(null);
const loadCount = ref(0);
const cartSliderRef = ref(null);

const threeRandomALevelBooks = ref([]);
const threeRandomGCESLevelBooks = ref([]);
const mobileSearchInputRef = ref(null);
const mobileSearchRef = ref(null);

const navSubjects = computed(() => {
  return Object.values(subjects.value).filter((subject) => {
    return subject.show_on_nav === 1;
  });
});

onBeforeMount(() => {
  bindleApiStore.getSubjects().then(() => {
    subjects.value = bindleApiStore.subjects;
    //navSubjects.value = subjects.value;
    // navSubjects.value = subjects.value.filter(subject => subject.show_on_nav);
    loadCount.value++;
  });
  bindleApiStore.getTypes().then(() => {
    types.value = bindleApiStore.types;
    loadCount.value++;
  });
  bindleApiStore.getLevels().then(() => {
    levels.value = bindleApiStore.levels;
    loadCount.value++;
  });
  bindleApiStore.getBooks().then(() => {
    books.value = bindleApiStore.books;
    loadCount.value++;
  });

  bindleApiStore.getRandomBooks(3).then((books) => {
    threeRandomGCESLevelBooks.value = books;
  });

  bindleApiStore.getRandomBooks(3).then((books) => {
    threeRandomALevelBooks.value = books;
  });
});

onMounted(() => {
  window.addEventListener('resize', debouncedResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize);
});

const debouncedResize = Util.debounce(
  () => {
    if (window.innerWidth >= 1024) {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu.classList.contains('visible')) {
        navMenu.classList.remove('visible');
      }
    }
    if (window.innerWidth >= 640) {
      if (mobileSearchRef.value.isOpen()) {
        mobileSearchRef.value.triggerClose();
      }
    }
  },
  500,
  false
);

const loaded = computed(() => loadCount.value >= 4);

const mobileMenu = () => {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu.classList.contains('visible')) {
    navMenu.classList.remove('visible');
    navMenu.querySelectorAll('input[name=menuradios]').forEach((item) => {
      item.checked = false;
    });
  } else {
    navMenu.classList.add('visible');
  }
};

const performSearch = () => {
  if (mobileSearchRef.value.isOpen()) {
    mobileSearchRef.value.triggerClose();
  }

  const searchParams = {
    search_term: searchText.value,
    search_category: 'resources',
  };

  trackEvent('search', searchParams);

  router.push('/resources/explore?q=' + encodeURIComponent(searchText.value));
};
const bookUrl = (level, idx) => {
  idx = Math.min(3, idx);
  if (level === 'gcse') {
    if (threeRandomGCESLevelBooks.value.length > 0 && idx in threeRandomGCESLevelBooks.value) {
      return Util.ensureSsl(threeRandomGCESLevelBooks.value[idx]['image_url']);
    } else {
      return Util.getPlaceholderBookImage(idx);
    }
  } else {
    if (threeRandomALevelBooks.value.length > 0 && idx in threeRandomALevelBooks.value) {
      return Util.ensureSsl(threeRandomALevelBooks.value[idx]['image_url']);
    } else {
      return Util.getPlaceholderBookImage(idx);
    }
  }
};
const toggleCart = () => {
  if (cartSliderRef.value !== null) {
    cartSliderRef.value.triggerOpen();
  }
};

const closeSlideIn = () => {
  if (cartSliderRef.value !== null) {
    cartSliderRef.value.triggerClose();
  }
};

const { data, isLoading, isPending, error } = useQuery({
  queryKey: ['cartItems'],
  queryFn: getOrderCart,
});

const cartItemsCount = computed(() => {
  const items = data.value?.order?.items ?? [];
  return items.reduce((acc, item) => acc + item.quantity, 0);
});

// Returns User initials using firstname and lastname of the user
const initials = () => {
  const firstName = authStore.user?.name?.split(' ')[0];
  const lastName = authStore.user?.name?.split(' ')[1];

  const firstInitial = firstName?.charAt(0) || '';
  const lastInitial = lastName?.charAt(0) || '';
  return (firstInitial + lastInitial).toUpperCase();
};

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleUserAction = (action) => {
  isDropdownOpen.value = false;
  switch (action) {
    case 'login':
      router.push('/login');
      break;
    case 'signup':
      router.push('/signup');
      break;
    case 'profile':
      router.push(`/user/${authStore.user.id}`);
      break;
    case 'logout':
      authStore.logout();
      router.push('/');
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="flex flex-row gap-6 lg:gap-10 whitespace-nowrap mt-8 max-w-8xl overflow-hidden">
    <div class="flex-1 text-left ml-8 mb-8">
      <router-link to="/">
        <bindle-logo />
      </router-link>
    </div>
    <horizontal-menu-bar
      ref="menuBar"
      class="mt-2 child-w-screen block lg:visible mr-4 lg:mr-0"
      list-class="gap-10 invisible lg:visible"
      link-class="h-full block"
      submenu-class="bg-white border-t border-theme-gray shadow-md"
      active-colour="#00bfa6"
      active-text-decoration="underline"
      :items="{
        'Shop Resources': '/resources',
        GCSEs: '/gcse',
        'A-Levels': '/a-level',
        'Explore Bundles': '/bundles',
      }"
    >
      <template v-slot:shop-resources>
        <div
          id="shop-resources"
          v-if="!loaded"
          class="loading max-w-full w-8xl mx-auto h-48 working-spinner"
        >
          &nbsp;
        </div>
        <div
          v-else
          id="shop-resources"
          class="max-w-full w-8xl mx-auto text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 px-10 py-6"
        >
          <div class="sm:col-start-1 md:col-span-2 xl:col-span-3 mb-4">
            <h2>SUBJECTS</h2>
            <div class="w-full flex flex-col md:flex-row md:flex-wrap">
              <router-link
                v-for="(subject, index) in navSubjects"
                :key="index"
                :to="'/resources/explore?subject=' + subject.slug"
                class="md:w-1/2 xl:w-1/3"
              >
                {{ subject.name }}
              </router-link>
            </div>
          </div>
          <div
            class="sm:col-start-2 md:col-start-3 xl:col-start-4 xl:col-span-3 flex flex-col xl:flex-row xl:flex-wrap"
          >
            <div class="xl:w-1/3 mb-4 flex flex-col">
              <h2>QUALIFICATION</h2>
              <router-link v-for="(level, index) in levels" :key="index" :to="'/' + level.slug">
                {{ level.description }}
              </router-link>
            </div>
            <div class="xl:w-1/3 mb-4 flex flex-col">
              <h2>RESOURCE TYPE</h2>
              <router-link :to="'/resources/explore?type=' + type.slug" v-for="type in types">{{
                type.name
              }}</router-link>
            </div>
            <!--
                        <div class="xl:w-1/3 mb-4 flex flex-col">
                            <h2>COLLECTION</h2>
                            <a href="/bestsellers">Bestsellers</a>
                            <a href="/sale">Sale</a>
                        </div>
                        -->
          </div>
        </div>
        <div class="max-w-full w-8xl mx-auto text-left pb-6">
          <router-link to="/resources" class="text-theme-teal ml-8"
            >Shop all resources
            <chevron-icon width="12" height="12" right class="inline" />
          </router-link>
        </div>
      </template>
      <template v-slot:gcses>
        <div
          id="gcses"
          v-if="!loaded"
          class="loading max-w-full w-8xl mx-auto h-48 working-spinner"
        >
          &nbsp;
        </div>
        <div
          v-else
          class="max-w-full w-8xl mx-auto text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 px-10 py-6"
        >
          <div class="sm:col-start-1 md:col-span-2 xl:col-span-3 mb-4">
            <h2>SUBJECTS</h2>
            <div class="w-full flex flex-col md:flex-row md:flex-wrap">
              <router-link
                v-for="(subject, index) in navSubjects"
                :key="index"
                :to="'/gcse/' + subject.slug"
                class="md:w-1/2 xl:w-1/3"
                >{{ subject.name }}
              </router-link>
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:flex-wrap md:col-span-2 xl:col-span-3">
            <div class="flex flex-col w-1/2 lg:w-1/3">
              <h2>RESOURCE TYPE</h2>
              <router-link
                :to="'/resources/explore?level=gcse&type=' + type.slug"
                v-for="type in types"
                >{{ type.name }}</router-link
              >
            </div>
            <div class="bg-theme-lightteal w-1/2 lg:w-2/3 centered py-8 min-h-40">
              <div class="flex flex-row -rotate-5">
                <img
                  :src="bookUrl('gcse', 0)"
                  class="w-1/3 scale-60"
                  style="transform-origin: 90% 50%"
                  alt="textbook"
                />
                <img :src="bookUrl('gcse', 1)" class="w-1/3 scale-90" alt="textbook" />
                <img
                  :src="bookUrl('gcse', 2)"
                  class="w-1/3 scale-60"
                  style="transform-origin: 10% 50%"
                  alt="textbook"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="max-w-full w-8xl mx-auto text-left pb-6">
          <router-link to="/gcse" class="ml-8 text-theme-teal"
            >Shop all GCSE resources
            <chevron-icon width="12" height="12" right class="inline"></chevron-icon>
          </router-link>
        </div>
      </template>
      <template v-slot:a-levels>
        <div
          id="alevels"
          v-if="!loaded"
          class="loading max-w-full w-8xl mx-auto h-48 working-spinner"
        >
          &nbsp;
        </div>
        <div
          v-else
          class="max-w-full w-8xl mx-auto text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 px-10 py-6"
        >
          <div class="sm:col-start-1 md:col-span-2 xl:col-span-3 mb-4">
            <h2>SUBJECTS</h2>
            <div class="w-full flex flex-col md:flex-row md:flex-wrap">
              <router-link
                v-for="(subject, index) in navSubjects"
                :key="index"
                :to="'/a-level/' + subject.slug"
                class="md:w-1/2 xl:w-1/3"
                >{{ subject.name }}
              </router-link>
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:flex-wrap md:col-span-2 xl:col-span-3">
            <div class="flex flex-col w-1/2 lg:w-1/3">
              <h2>RESOURCE TYPE</h2>
              <!--
                            <a href="">Textbooks</a>
                            <a href="">Study Guides</a>
                            <a href="">Exam Workbooks</a>
                            <a href="">Bundles</a>
                            <a href="">EBooks</a>
                            -->
              <router-link
                :to="'/resources/explore?level=a-level&type=' + type.slug"
                v-for="type in types"
                >{{ type.name }}</router-link
              >
            </div>
            <div class="bg-theme-lightteal w-1/2 lg:w-2/3 centered py-8 min-h-40">
              <div class="flex flex-row -rotate-5">
                <img
                  :src="bookUrl('alevel', 0)"
                  class="w-1/3 scale-60"
                  style="transform-origin: 90% 50%"
                  alt="textbook"
                />
                <img :src="bookUrl('alevel', 1)" class="w-1/3 scale-90" alt="textbook" />
                <img
                  :src="bookUrl('alevel', 2)"
                  class="w-1/3 scale-60"
                  style="transform-origin: 10% 50%"
                  alt="textbook"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="max-w-full w-8xl mx-auto text-left pb-6">
          <router-link to="/a-level" class="ml-8 text-theme-teal"
            >Shop all A-Level resources
            <chevron-icon width="12" height="12" right class="inline"></chevron-icon>
          </router-link>
        </div>
      </template>
    </horizontal-menu-bar>
    <div class="block sm:hidden shrink mt-2">
      <slide-in ref="mobileSearchRef" down class="bg-white">
        <template v-slot:open-button>
          <search-icon class="inline linklike" width="24" height="24" />
        </template>
        <template v-slot:close>
          <close-icon />
        </template>
        <div class="rounded-full bg-theme-pale w-full bg-theme-pal flex flex-row py-2">
          <input
            ref="mobileSearchInputRef"
            type="text"
            v-model="searchText"
            v-on:keyup.enter="performSearch"
            class="bg-theme-pale p-2 grow ml-4 border-solid border-r-2 border-theme-lightgray"
          />
          <search-icon
            class="cursor-pointer inline mx-4 relative top-3"
            width="16"
            height="16"
            @click="performSearch"
          />
        </div>
      </slide-in>
    </div>
    <div class="hidden sm:flex sm:flex-row sm:flex-nowrap justify-center items-center">
      <div class="rounded-full bg-theme-pale h-10 mb-8">
        <input
          type="text"
          v-model="searchText"
          class="placeholder:text-xs xl:placeholder:text-sm xl:w-80 mt-2 ml-4 outline-none bg-theme-pale border-solid border-r-2 border-theme-lightgray"
          placeholder="Search for study resources by keywords..."
          v-on:keyup.enter="performSearch"
        />
        <search-icon
          class="cursor-pointer inline mx-4 relative -top-1"
          width="16"
          height="16"
          @click="performSearch"
        />
      </div>
    </div>
    <div class="shrink mt-2 lg:mr-4 flex gap-2 lg:gap-4">
      <a @click="toggleDropdown" class="p-0 rounded-full bg-white m-0 cursor-pointer">
        <div
          v-if="authStore.user"
          class="w-6 h-6 flex items-center justify-center rounded-full text-white bg-teal-500"
        >
          {{ initials() }}
        </div>
        <user-icon v-else width="25" height="25" class="mx-auto cursor-pointer font-medium" />
      </a>
      <div v-if="isDropdownOpen" class="absolute mt-8 w-48 bg-white rounded-lg shadow-lg z-50">
        <ul class="text-gray-700">
          <li v-if="!authStore.user">
            <a
              class="block w-full px-4 py-2 font-normal hover:bg-teal-500 hover:text-white cursor-pointer"
              @click="handleUserAction('signup')"
            >
              Sign Up
            </a>
          </li>
          <li v-if="!authStore.user">
            <a
              class="block w-full px-4 py-2 font-normal hover:bg-teal-500 hover:text-white cursor-pointer"
              @click="handleUserAction('login')"
            >
              Log In
            </a>
          </li>
          <li v-if="authStore.user">
            <a
              class="block w-full px-4 py-2 font-normal hover:bg-teal-500 hover:text-white cursor-pointer"
              @click="handleUserAction('profile')"
            >
              My Profile
            </a>
          </li>
          <li v-if="authStore.user">
            <a
              class="block w-full px-4 py-2 font-normal text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
              @click="handleUserAction('logout')"
            >
              Log Out
            </a>
          </li>
        </ul>
      </div>
      <router-link to="/contact-us" title="Contact Us">
        <help-icon
          width="25"
          height="25"
          class="mx-auto cursor-pointer font-medium text-teal-500"
        />
      </router-link>

      <div class="relative">
        <cart-icon
          width="24"
          height="24"
          class="mx-auto cursor-pointer text-theme-teal"
          @click="toggleCart"
        />
        <span
          v-if="cartItemsCount > 0"
          class="absolute -top-2 -right-1 rounded-full text-white bg-theme-teal h-5 w-5 text-[12px] text-center"
          >{{ cartItemsCount }}
        </span>
      </div>
    </div>

    <div class="shrink mt-2 lg:hidden">
      <burger-icon
        class="mx-auto cursor-pointer linklike mr-8"
        width="24"
        height="24"
        @click="mobileMenu"
      />
    </div>
    <slide-in ref="cartSliderRef" right no-open-button background-colour="white">
      <cart @checkoutLinkClicked="closeSlideIn" />
    </slide-in>
  </div>
</template>
<style>
@media (max-width: 1024px) {
  ul#nav-menu {
    display: flex;
    padding-left: 28px;
    background-color: white;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 108px;
    z-index: 200;
    width: 100%;
    visibility: visible;
    gap: 1rem;
    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.5s ease,
      opacity 0.5s ease;
  }

  ul#nav-menu:not(.visible) {
    z-index: -100;
  }

  ul#nav-menu.visible {
    max-height: 1000px;
    opacity: 1;
  }

  ul#nav-menu > li {
    visibility: visible !important;
    background-color: white;
    position: relative;
  }

  ul#nav-menu > li > label > a {
    font-size: 26px;
    height: fit-content;
    padding-left: 30px;
    padding-right: 30px;
    text-align: left;
  }

  ul#nav-menu > li > label:hover {
    opacity: 0.6;
    cursor: pointer;
  }

  ul#nav-menu > li.has-children > label:before {
    position: absolute;
    left: 12px;
    top: 8px;
    content: '⇕';
    font-size: 0.8rem;
    color: #777;
  }

  ul#nav-menu > li.has-children > label > a {
    pointer-events: none;
    cursor: pointer;
  }

  ul#nav-menu > li > ul {
    position: static !important;
    visibility: visible !important;
    border-top: none;
    background-color: white;
    box-shadow: 0 0 #0000;
  }

  ul#nav-menu > li > ul > li > div {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 30px;
  }

  input[name='menuradios'] ~ ul {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-in-out !important;
  }

  input[name='menuradios']:checked ~ ul {
    max-height: 1000px;
  }
}
</style>
