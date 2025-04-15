<script setup>
import { ref } from 'vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import { Util } from '@/components/helpers/Util';

const placeholderImages = [
  Util.getPlaceholderBookImage(0),
  Util.getPlaceholderBookImage(1),
  Util.getPlaceholderBookImage(2),
  Util.getPlaceholderBookImage(3),
  Util.getPlaceholderBookImage(4),
  Util.getPlaceholderBookImage(5),
];

const selected = ref('core');
const topNavRef = ref(null);

const selectPane = (paneId, scrollToTopNav = false) => {
  selected.value = paneId;
  if (scrollToTopNav && topNavRef.value !== null) {
    topNavRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const getBookImgUrl = (type, idx) => {
  if (type === 'core') {
    return placeholderImages[idx];
  } else {
    return placeholderImages[3 + idx];
  }
};
</script>
<template>
  <div class="bundle-types max-w-8xl mx-auto flex flex-col mt-12">
    <div ref="topNavRef" class="nav-container flex flex-row gap-0 py-4 px-4 w-full">
      <button
        :class="'py-4 w-1/2 rounded-none' + (selected === 'core' ? ' selected' : '')"
        @click="selectPane('core')"
      >
        Core Bundle
      </button>
      <button
        :class="'py-4 w-1/2 rounded-none' + (selected === 'workbook' ? ' selected' : '')"
        @click="selectPane('workbook')"
      >
        Workbook Bundle
      </button>
    </div>
    <div class="tabbed-pane-container grow pt-12">
      <div v-show="selected === 'core'" ref="coreBundlesPaneRef" class="tabbed-pane selected">
        <h1 class="text-3xl">What's in a Core Bundle?</h1>
        <p class="leading-6 mt-4 px-2">
          Dive deep into a single subject with our tailored Core Bundles, blending three essential
          study resources to ensure you're well-prepared for exam success.
        </p>
        <div
          class="flex flex-col lg:flex-row w-full h-fit items-center justify-center gap-6 pt-10 pb-4 px-10"
        >
          <div class="flex flex-col pt-4">
            <div class="mx-auto w-1/2 -rotate-5 mb-8">
              <img
                :src="getBookImgUrl('core', 0)"
                alt="book image"
                class="w-full h-auto shadow-1"
              />
            </div>
            <div
              class="bg-theme-teal rounded-full w-10 h-10 leading-10 text-theme-white text-2xl mx-auto my-4"
            >
              1
            </div>
            <h3 class="text-xl font-medium">Subject Textbook</h3>
            <p class="my-4 px-6">A comprehensive textbook covering an entire course or subject</p>
          </div>
          <div class="mb-4">
            <plus-icon />
          </div>
          <div>
            <div class="mx-auto w-1/2 mb-8">
              <img
                :src="getBookImgUrl('core', 1)"
                alt="book image"
                class="w-full h-auto shadow-1"
              />
            </div>
            <div
              class="bg-theme-teal rounded-full w-10 h-10 leading-10 text-theme-white text-2xl mx-auto my-4"
            >
              1
            </div>
            <h3 class="text-xl font-medium">Revision Guide</h3>
            <p class="my-4 px-6">
              A condensed revision guide focusing on the most fundamental information
            </p>
          </div>
          <div>
            <plus-icon />
          </div>
          <div>
            <div class="mx-auto w-1/2 mb-8 rotate-5">
              <img
                :src="getBookImgUrl('core', 2)"
                alt="book image"
                class="w-full h-auto shadow-1"
              />
            </div>
            <div
              class="bg-theme-teal rounded-full w-10 h-10 leading-10 text-theme-white text-2xl mx-auto my-4"
            >
              1
            </div>
            <h3 class="text-xl font-medium">Exam Workbook</h3>
            <p class="my-4 px-6">
              Subject specific end-of-chapter Q&amp;A pages to consolidate your learning
            </p>
          </div>
        </div>
      </div>
      <div v-show="selected === 'workbook'" ref="workbookBundlesPaneRef" class="tabbed-pane">
        <h1 class="text-3xl">What's in a Workbook Bundle?</h1>
        <p class="leading-6 mt-4 mb-10 px-2">
          Enhance your exam technique with three subject-specific workbooks, packed with essential
          exam-style questions.
        </p>
        <div class="flex flex-col md:flex-row justify-center md:px-10">
          <div class="mx-auto w-1/2 md:w-auto mb-8 -rotate-5 md:grow">
            <img
              :src="getBookImgUrl('workbook', 0)"
              alt="book image"
              class="mx-auto w-1/2 md:w-fit h-auto shadow-1 md:ml-auto"
            />
          </div>
          <div class="mx-auto w-1/2 md:w-fit mb-8">
            <img
              :src="getBookImgUrl('workbook', 1)"
              alt="book image"
              class="mx-auto w-1/2 md:w-fit h-auto shadow-1 md:mx-auto"
            />
          </div>
          <div class="mx-auto w-1/2 md:w-auto mb-8 rotate-5 md:grow">
            <img
              :src="getBookImgUrl('workbook', 2)"
              alt="book image"
              class="mx-auto w-1/2 md:w-fit h-auto shadow-1 md:mr-auto"
            />
          </div>
        </div>
        <div
          class="bg-theme-teal rounded-full w-10 h-10 leading-10 text-theme-white text-2xl mx-auto my-4"
        >
          3
        </div>
        <h3 class="text-xl font-medium">Exam Workbooks</h3>
        <p class="my-4 px-6">
          Subject specific end-of-chapter Q&amp;A pages to consolidate your learning
        </p>
      </div>
    </div>
    <div class="nav-container flex flex-row gap-0 py-4 px-4 w-full lg:hidden mb-8">
      <button
        :class="'py-4 w-1/2 rounded-none' + (selected === 'core' ? ' selected' : '')"
        @click="selectPane('core', true)"
      >
        Core Bundle
      </button>
      <button
        :class="'py-4 w-1/2 rounded-none' + (selected === 'workbook' ? ' selected' : '')"
        @click="selectPane('workbook', true)"
      >
        Workbook Bundle
      </button>
    </div>
  </div>
</template>
<style scoped>
.nav-container button {
  background-color: var(--color-theme-gray2);
  color: var(--color-theme-black);
  /* transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out ; */
}

.nav-container button.selected {
  background-color: var(--color-theme-darkblue);
  color: var(--color-theme-white);
  pointer-events: none;
}
img {
  max-width: 200px; /* stupid tailwind max-w rules aren't generated/working 🤷 */
}
</style>
