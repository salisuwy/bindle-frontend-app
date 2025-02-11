import { defineStore } from 'pinia';

import { computed, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@/store/useLocalStorage';
import { useAuthStore } from '@/store/useAuthStore';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://service.bindle.co.uk/api/';

export const useCoursesStore = defineStore('courses', () => {
  const router = useRouter();

  const { setStorage, getStorage, clearStorage } = useLocalStorage();
  const state = reactive({
    courses: null,
    isCoursesLoading: false,
  });

  // >> GETTERS
  const courses = computed(() => state.courses);
  const isCoursesLoading = computed(() => state.isCoursesLoading);

  // >> ACTIONS
  const fetchCourses = async (params) => {
    const { accessToken } = useAuthStore();
    state.isCoursesLoading = true;
    const urlParams = new URLSearchParams(params);
    await axios
      .get(`${API_ENDPOINT}courses/search?${urlParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data, status) => {
        state.courses = data.data.courses.data;
        state.isCoursesLoading = false;
      })
      .catch((error) => {
        state.isCoursesLoading = false;
      });
  };

  const resetCourses = () => {
    state.courses = null;
    state.isCoursesLoading = false;
  };

  const attachMultipleCourses = async (params) => {
    const { accessToken } = useAuthStore();
    await axios
      .post(`${API_ENDPOINT}courses/attach-multiple`, params, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data, status) => {
        console.log('Attached data', data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  return {
    state,
    courses,
    isCoursesLoading,
    fetchCourses,
    resetCourses,
    attachMultipleCourses,
  };
});
