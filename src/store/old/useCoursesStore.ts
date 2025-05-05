import { defineStore } from 'pinia';

import { computed, reactive } from 'vue';
import { apiClient } from '@/composables/axiosClient';
//import axios from 'axios';
//import { useRouter } from 'vue-router';
//import { useLocalStorage } from '@/store/useLocalStorage';
//import { useAuthStore } from '@/store/useAuthStore';
import { consoleLog } from '@/components/helpers/tsUtils';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const useCoursesStore = defineStore('courses', () => {
  /*const router = useRouter();

  const { setStorage, getStorage, clearStorage } = useLocalStorage();*/
  const state = reactive({
    courses: null,
    isCoursesLoading: false,
  });

  // >> GETTERS
  const courses = computed(() => state.courses);
  const isCoursesLoading = computed(() => state.isCoursesLoading);

  // >> ACTIONS
  const fetchCourses = async (params: any) => {
    //const { accessToken } = useAuthStore();
    state.isCoursesLoading = true;
    const urlParams = new URLSearchParams(params);
    await apiClient
      .get(
        `courses/search?${urlParams}` /*, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }*/
      )
      .then((data) => {
        state.courses = data.data.courses.data;
        state.isCoursesLoading = false;
      })
      .catch(() => {
        state.isCoursesLoading = false;
      });
  };

  const resetCourses = () => {
    state.courses = null;
    state.isCoursesLoading = false;
  };

  const attachMultipleCourses = async (params: any) => {
    //const { accessToken } = useAuthStore();
    await apiClient
      .post(
        `${API_ENDPOINT}courses/attach-multiple`,
        params /*, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }*/
      )
      .then((data) => {
        consoleLog('Attached data', data);
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
