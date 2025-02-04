import { defineStore } from 'pinia';

import { computed, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@/store/useLocalStorage';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://service.bindle.co.uk/api/';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const { setStorage, getStorage, clearStorage } = useLocalStorage();
  const state = reactive({
    user: null,
    token: '',
    isError: false,
    error: null,
    isLoading: false,
    forgotPassword: null,
    updateUserLoading: false,
    updateUserError: null,
    changePasswordLoading: false,
    changePasswordError: null,
    deleteUserLoading: false,
    deleteUserError: null,
    allOrders: [],
    allOrdersLoading: false,
    allOrdersError: null,
    currentOrder: null,
    currentOrderLoading: false,
    currentOrderError: null,
    currentOrderInvoice: null,
    allAddresses: [],
    allAddressesLoading: false,
    allAddressesError: null,
    currentAddress: null,
    currentAddressLoading: false,
    currentAddressError: null,
    updateAddressLoading: false,
    updateAddressError: null,
    setDefaultAddressLoading: false,
    setDefaultAddressError: null,
    deleteAddressLoading: false,
    deleteAddressError: null,
    createAddressLoading: false,
    createAddressError: null,
  });

  // >> GETTERS
  const user = computed(() => state.user);
  const accessToken = computed(() => state.token);
  const isGuest = computed(() => state.user.role === 'guest');
  const error = computed(() => state.error);
  const isLoading = computed(() => state.isLoading);
  const currentOrderLoading = computed(() => state.currentOrderLoading);
  const currentOrder = computed(() => state.currentOrder);
  const currentOrderInvoice = computed(() => state.currentOrderInvoice);
  const allOrdersLoading = computed(() => state.allOrdersLoading);
  const allOrdersError = computed(() => state.allOrdersError);

  // >> ACTIONS

  const signup = async (params) => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;
    await axios
      .post(`${API_ENDPOINT}auth/signup`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage('auth/user', JSON.stringify(state.user));
        setStorage('auth/token', JSON.stringify(state.token));
        router.push('/register-user');
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .catch((error, status) => {
        console.log('Error', error);
        state.isLoading = false;
        state.isError = true;
        const errorsList = error.response.data.errors;
        state.error = errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const login = async (params) => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;
    await axios
      .post(`${API_ENDPOINT}auth/login`, params)
      .then((data, status) => {
        state.user = data.data.user;
        state.token = data.data.token;
        setStorage('auth/user', JSON.stringify(state.user));
        setStorage('auth/token', JSON.stringify(state.token));
        router.push(`/user/${state.user.id}`);
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .catch((error, status) => {
        console.log('Error', error);
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
          'Content-Type': 'application/json',
        },
      })
      .then((data, status) => {
        state.user = null;
        state.token = null;
        clearStorage('auth/user');
        clearStorage('auth/token');
        router.push(`/login`);
      })
      .catch(({ status }) => {
        state.user = null;
        state.token = null;
        clearStorage('auth/user');
        clearStorage('auth/token');
        router.push(`/login`);
      });
  };

  const forgotPassword = async (params) => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;
    axios
      .post(`${API_ENDPOINT}auth/password-reset`, params)
      .then((data) => {
        state.forgotPassword = data.data;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .catch((error) => {
        console.log('Error', error);
        state.isLoading = false;
        state.isError = true;
        const message = error.response.data.message;
        const errorsList = error.response.data.errors;
        state.error = message ? message : errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const signupWithGoogle = async (params) => {
    return axios.get(`${API_ENDPOINT}auth/google/redirect`).then((data) => {
      console.log('signupWithGoogle', data.data);
      return data.data.url;
    });
  };

  const getProfile = async (params) => {
    console.log('getProfile', accessToken.value);
    await axios
      .get(`${API_ENDPOINT}profile/me`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        state.user = data.data.user;
        setStorage('auth/user', JSON.stringify(state.user));
        if (params.redirectFrom === 'login') {
          router.push(`/user/${data.data.user.id}`);
        } else if (params.redirectFrom === 'signup') {
          router.push(`/register-user`);
        }
      })
      .catch(({ status }) => {});
  };

  const updateUser = async (params) => {
    console.log('updateUser', params);
    state.updateUserError = null;
    state.updateUserLoading = true;
    await axios
      .post(`${API_ENDPOINT}profile/update`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data, status) => {
        console.log('updateUser then', data, status);
        state.user = data.data.user;
        setStorage('auth/user', JSON.stringify(state.user));
        state.updateUserLoading = false;
      })
      .catch((error) => {
        state.updateUserLoading = false;
        const errorsList = error.response.data.errors;
        state.updateUserError = errorsList[Object.keys(errorsList)[0]][0];
      });
  };

  const changePassword = async (params) => {
    console.log('changePassword', params);
    state.changePasswordError = null;
    state.changePasswordLoading = true;
    await axios
      .post(`${API_ENDPOINT}profile/change-password`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('changePassword', data);
        state.token = data.data.token;
        setStorage('auth/token', JSON.stringify(state.token));
        state.changePasswordLoading = false;
      })
      .catch((error) => {
        state.changePasswordLoading = false;
        console.log('changePassword error', error);
        const message = error.response.data.message;
        const errorsList = error.response.data.errors;
        state.changePasswordError = message ? message : errorsList[Object.keys(errorsList)[0]][0];
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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      )
      .then((data) => {
        state.user = null;
        state.token = null;
        clearStorage('auth/user');
        clearStorage('auth/token');
        state.deleteUserLoading = false;
        router.push(`/`);
      })
      .catch((error) => {
        state.deleteUserLoading = false;
        console.log('deleteUser error', error);
        state.deleteUserError = error.response.data.error;
      });
  };

  const fetchAllOrders = async (params) => {
    const urlParams = new URLSearchParams(params);
    state.allOrdersLoading = true;
    await axios
      .get(`${API_ENDPOINT}profile/orders?${urlParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('fetchAllOrders', data);
        state.allOrders = data.data.data;
        state.allOrdersLoading = false;
      })
      .catch((error) => {
        console.log('fetchAllOrders', error);
        state.allOrdersLoading = false;
        state.allOrdersError = error.response.data.error;
      });
  };

  const fetchOrderById = async (params) => {
    state.currentOrderLoading = true;
    await axios
      .get(`${API_ENDPOINT}profile/orders/${params.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('fetchOrderById', data);
        state.currentOrder = data.data;
        state.currentOrderLoading = false;
      })
      .catch((error) => {
        console.log('fetchOrderById', error);
        state.currentOrderLoading = false;
        state.currentOrderError = error.response.data.error;
      });
  };

  const fetchOrderInvoiceById = async (params) => {
    await axios
      .get(`${API_ENDPOINT}profile/orders/${params.id}/invoice`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('fetchOrderInvoiceById', data);
        state.currentOrderInvoice = data.data.url;
      })
      .catch((error) => {
        console.log('fetchOrderInvoiceById', error);
      });
  };

  const resetCurrentOrder = () => {
    console.log('resetCurrentOrder', state);
    state.currentOrder = null;
    state.currentOrderLoading = false;
    state.currentOrderError = null;
  };

  const fetchAddresses = () => {
    state.allAddressesLoading = true;
    axios
      .get(`${API_ENDPOINT}profile/addresses`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('fetchAddresses', data.data);
        state.allAddresses = data.data;
        state.allAddressesLoading = false;
      })
      .catch((error) => {
        state.allAddressesLoading = false;
        console.log('fetchAddresses', error);
        state.allAddressesError = error.response.data.error;
      });
  };

  const setDefaultAddress = (params) => {
    console.log('setDefaultAddress', params);
    axios
      .patch(`${API_ENDPOINT}profile/addresses/${params.id}/set-default`, params.params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('fetchAddresses', data.data);
        fetchAddresses();
      })
      .catch((error) => {});
  };

  // const removeDefaultAddress = (params) => {
  //   console.log("removeDefaultAddress", params);
  //   axios
  //     .patch(
  //       `${API_ENDPOINT}profile/addresses/${params.id}/set-default`,
  //       params.params,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken.value}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((data) => {
  //       console.log("fetchAddresses", data.data);
  //       fetchAddresses();
  //     })
  //     .catch((error) => {});
  // };

  const getAddressById = (params) => {
    state.currentAddressLoading = true;
    state.currentAddressError = null;
    axios
      .get(`${API_ENDPOINT}profile/addresses/${params.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        state.currentAddress = data.data;
        state.currentAddressLoading = false;
      })
      .catch((error) => {
        state.currentAddressError = error.response.data.error;
        state.currentAddressLoading = false;
      });
  };

  const createAddress = (params) => {
    state.createAddressLoading = true;
    axios
      .post(`${API_ENDPOINT}profile/addresses`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('createAddress', data.data);
        router.push(`/user/${state.user.id}/addresses`);
        state.currentAddress = null;
        state.createAddressLoading = false;
      })
      .catch((error) => {
        console.log(error);
        console.log('createAddress', error.response.data.error);
        state.createAddressError = error.response.data.error;
        state.createAddressLoading = false;
      });
  };

  const updateAddress = (params) => {
    state.updateAddressLoading = true;
    axios
      .patch(`${API_ENDPOINT}profile/addresses/${params.id}`, params, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('updateAddress', data.data);
        router.push(`/user/${state.user.id}/addresses`);
        state.currentAddress = null;
        state.updateAddressLoading = false;
      })
      .catch((error) => {
        console.log(error);
        console.log('updateAddress', error.response.data.error);
        state.updateAddressError = error.response.data.error;
        state.updateAddressLoading = false;
      });
  };

  const deleteAddress = (params) => {
    state.deleteAddressLoading = true;
    axios
      .delete(`${API_ENDPOINT}profile/addresses/${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        console.log('deleteAddress', data.data);
        state.deleteAddressLoading = false;
        fetchAddresses();
      })
      .catch((error) => {
        console.log(error);
        console.log('deleteAddress', error.response.data.error);
        state.deleteAddressError = error.response.data.error;
        state.deleteAddressLoading = false;
      });
  };

  const setUser = (user) => {
    state.user = user;
    setStorage('auth/user', JSON.stringify(state.user));
  };

  const setAccessToken = (token) => {
    state.token = token;
    setStorage('auth/token', JSON.stringify(state.token));
  };

  onBeforeMount(() => {
    state.token = getStorage('auth/token', '');
    state.user = getStorage('auth/user', null);
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
    currentOrderLoading,
    currentOrder,
    currentOrderInvoice,
    allOrdersLoading,
    allOrdersError,
    signup,
    login,
    logout,
    forgotPassword,
    signupWithGoogle,
    getProfile,
    updateUser,
    changePassword,
    deleteUser,
    fetchAllOrders,
    fetchOrderById,
    fetchOrderInvoiceById,
    resetCurrentOrder,
    fetchAddresses,
    setDefaultAddress,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setUser,
    setAccessToken,
  };
});
