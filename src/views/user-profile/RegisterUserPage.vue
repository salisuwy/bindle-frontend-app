<template>
  <MinimalLayout>
    <div class="flex py-4 overflow-auto">
      <div class="m-auto w-full max-w-md bg-white rounded-lg shadow-md text-left">
        <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Pick your subjects</h1>
        <div class="p-6">
          <div
            v-for="course in selectedCourses"
            :key="course.id"
            class="border-l-4 w-50 bg-theme-pal flex flex-row pt-2 mb-4 relative"
            :class="`border-l-teal-400`"
          >
            <input
              type="text"
              :value="course.name"
              :readonly="true"
              class="border-b p-2 grow ml-4"
            />
            <i
              class="cursor-pointer fa fa-solid fa-times text-teal-400 absolute right-2 top-1/2 -translate-y-1/2"
              @click="unselectCourse(course)"
            ></i>
          </div>
          <div
            v-if="selectedCourses.length < 4"
            class="border-l-4 w-50 bg-theme-pal flex flex-row pt-2 mb-4 items-center border-l-teal-400"
          >
            <input
              ref="courseSearchInputRef"
              type="text"
              v-model="searchText"
              placeholder="Type to Search"
              class="border-b p-2 grow ml-2"
            />

            <i
              v-if="isLoading && searchText.length > 0"
              class="fa fa-solid fa-circle-notch fa-spin ml-2 text-theme-darkgray"
            ></i>
          </div>
          <div v-if="searchText.length > 0" class="min-h-[400px]">
            <div
              v-if="isLoading"
              class="w-full h-[400px] flex flex-col justify-center items-center text-theme-darkgray"
            >
              <span class="text-sm mb-2">Fetching Subjects</span>
              <i class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
            </div>
            <template v-else-if="searchResults.length > 0">
              <ul>
                <li
                  v-for="course in searchResults"
                  :key="course.id"
                  @click="selectCourse(course)"
                  class="bg-theme-pale my-2 p-2 grow ml-4 border-solid border-theme-lightgray cursor-pointer hover:bg-theme-lightteal flex flex-row justify-between"
                >
                  <span>{{ course.name }}</span>
                  <i class="fa fa-solid fa-plus ml-2 text-teal-400 self-center"></i>
                </li>
              </ul>
            </template>
            <div
              v-else
              class="w-full h-[400px] flex flex-col justify-center items-center text-theme-darkgray"
            >
              <span class="text-sm mb-2">No subjects found</span>
              <i class="fa fa-solid fa-book-open ml-2"></i>
            </div>
          </div>

          <button
            class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md my-4"
            @click="onAttachCourses"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </MinimalLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import MinimalLayout from '@/views/shared/MinimalLayout.vue';

import { useAuthStore } from '@/store/useAuthStore';

import { useCourses } from '@/composables/useCourses';
import type { Course } from '@/composables/useCourses';

const authStore = useAuthStore();
const router = useRouter();

const { isLoading, searchCourses, attachMultipleCourses } = useCourses();

const searchText = ref('');
const selectedCourses = ref<Course[]>([]);
const searchResults = computed(() => searchCourses(searchText.value));

const selectCourse = (course: Course) => {
  selectedCourses.value.push(course);
  searchText.value = '';
};

const unselectCourse = (course: Course) => {
  selectedCourses.value = selectedCourses.value.filter((c) => c.id != course.id);
};

const onAttachCourses = async () => {
  const courseIds = selectedCourses.value.map((course) => course.id);
  await attachMultipleCourses({
    course_ids: courseIds,
  });
  if (authStore.user) {
    router.push(`/user/${authStore.user.id}`);
  } else {
    router.push('/');
  }
};
</script>
