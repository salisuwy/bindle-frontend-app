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
    isError: false,
    error: null,
    isLoading: false,
    updateUserLoading: false,
    updateUserError: null,
    changePasswordLoading: false,
    changePasswordError: null,
    deleteUserLoading: false,
    deleteUserError: null,
  });

  // >> GETTERS
  const user = computed(() => state.user);
  const accessToken = computed(() => state.token);
  const isGuest = computed(() => state.user.role === "guest");
  const error = computed(() => state.error);
  const isLoading = computed(() => state.isLoading);

  // >> ACTIONS

  const signup = async (params) => {
    state.isLoading = true;
    await axios
      .post(`${API_ENDPOINT}auth/signup`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
        router.push("/register-user");
        state.isLoading = false;
      })
      .catch((error, status) => {
        console.log("Error", error);
        state.isLoading = false;
        state.isError = true;
        const errorsList = error.response.data.errors;
        state.error = errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const login = async (params) => {
    state.isLoading = true;
    await axios
      .post(`${API_ENDPOINT}auth/login`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage("auth/user", JSON.stringify(state.user));
        setStorage("auth/token", JSON.stringify(state.token));
        router.push(`/user/${state.user.id}`);
        state.isLoading = false;
      })
      .catch((error, status) => {
        console.log("Error", error);
        state.isLoading = false;
        state.isError = true;
        state.error = error.response.data.message;
      });
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
          Authorization: `Bearer ${accessToken.value}`,
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
    console.log("updateUser", params);
    state.updateUserError = null;
    state.updateUserLoading = true;
    await axios
      .post(`${API_ENDPOINT}profile/update`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      })
      .then((data, status) => {
        console.log("updateUser then", data, status);
        state.user = data.data.user;
        setStorage("auth/user", JSON.stringify(state.user));
        state.updateUserLoading = false;
      })
      .catch((error) => {
        state.updateUserLoading = false;
        const errorsList = error.response.data.errors;
        state.updateUserError = errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const changePassword = async (params) => {
    console.log("changePassword", params);
    state.changePasswordError = null;
    state.changePasswordLoading = true;
    await axios
      .post(`${API_ENDPOINT}profile/change-password`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        console.log("changePassword", data);
        state.token = data.data.token;
        setStorage("auth/token", JSON.stringify(state.token));
        state.changePasswordLoading = false;
      })
      .catch((error) => {
        state.changePasswordLoading = false;
        console.log("changePassword error", error);
        const message = error.response.data.message;
        const errorsList = error.response.data.errors;
        state.changePasswordError = message
          ? message
          : errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const deleteUser = async () => {
    state.deleteUserLoading = true;
    state.deleteUserError = null;
    await axios
      .post(
        `${API_ENDPOINT}profile/delete-account`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      )
      .then((data) => {
        state.user = null;
        state.token = null;
        clearStorage("auth/user");
        clearStorage("auth/token");
        state.deleteUserLoading = false;
        router.push(`/`);
      })
      .catch((error) => {
        state.deleteUserLoading = false;
        console.log("deleteUser error", error);
        state.deleteUserError = error.response.data.error;
      });
  };

  onBeforeMount(() => {
    state.token = getStorage("auth/token", "");
    state.user = getStorage("auth/user", null);
    state.error = null;
    state.isError = false;
    state.isLoading = false;
  });

  return {
    state,
    accessToken,
    user,
    isGuest,
    error,
    isLoading,
    signup,
    login,
    logout,
    getProfile,
    updateUser,
    changePassword,
    deleteUser,
  };
});
