import { defineStore } from "pinia";

import { computed, reactive, onBeforeMount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@/store/useLocalStorage";

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "https://service.bindle.co.uk/api/";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const { setStorage, getStorage, clearStorage } = useLocalStorage();
  const state = reactive({
    user: null,
    token: "",
  });

  // >> GETTERS
  const user = computed(() => state.user);
  const accessToken = computed(() => state.token);
  const isGuest = computed(() => state.user.role === "guest");

  // >> ACTIONS

  const signup = async (params) => {
    await axios
      .post(`${API_ENDPOINT}auth/signup`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
        router.push("/register-user");
      })
      .catch(({ status }) => {});
  };

  const login = async (params) => {
    await axios
      .post(`${API_ENDPOINT}auth/login`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
        router.push(`/user/${state.user.id}`);
      })
      .catch(({ status }) => {});
  };

  const logout = async (params) => {
    await axios
      .post(`${API_ENDPOINT}auth/logout`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      })
      .then((data, status) => {
        state.user = null;
        state.token = null;
        clearStorage("auth/user");
        clearStorage("auth/token");
      })
      .catch(({ status }) => {});
  };

  const getProfile = async (params) => {
    await axios
      .get(`${API_ENDPOINT}profile/me`, {
        headers: {
          Authorization: `Bearer ${params.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
      })
      .catch(({ status }) => {});
  };

  const updateUser = async (params) => {
    await axios
      .post(`${API_ENDPOINT}profile/update`, params.params, {
        headers: {
          Authorization: `Bearer ${params.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
      })
      .catch(({ status }) => {});
  };

  onBeforeMount(() => {
    state.token = getStorage("auth/token", "");
    state.user = getStorage("auth/user", null);
  });

  return {
    state,
    accessToken,
    user,
    isGuest,
    signup,
    login,
    logout,
    getProfile,
    updateUser,
  };
});
