import axios from 'axios';
import uniqid from 'uniqid';

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export function getAnonId() {
  let anonId = localStorage.getItem('anonid');
  if (!anonId) {
    anonId = uniqid() + '-' + uniqid();
    localStorage.setItem('anonid', anonId);
  }
  return anonId;
}

export function getUuid() {
  const uuid = localStorage.getItem('uuid') || '';
  return uuid;
}

export function setUuid(uuid) {
  if (uuid !== undefined && typeof uuid == 'string') {
    localStorage.setItem('uuid', uuid);
  }
}

export function getAnonIdAndUuid() {
  const data = {};
  if (getAnonId()) {
    data.anonid = getAnonId();
  }
  if (getUuid()) {
    data.uuid = getUuid();
  }

  console.log('getAnonIdAndUuid()', data);
  return data;
}

export async function addToCart(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('addToCart', data);

  return axios.post(`${API_ENDPOINT}orders/cart/add`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function removeFromCart(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('removeFromCart', data);

  return axios.post(`${API_ENDPOINT}orders/cart/remove`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getOrderCart() {
  const data = getAnonIdAndUuid();
  const urlParams = new URLSearchParams(data);

  console.log('getOrderCart', data);

  const resp = await axios.get(`${API_ENDPOINT}orders/cart?${urlParams}`);
  setUuid(resp?.data?.order?.uuid);
  return resp.data;
}

export async function getOrderCompleted(anonid, uuid) {
  const data = { ...getAnonIdAndUuid(), anonid, uuid };

  console.log('getOrderCompleted: ', data);

  const urlParams = new URLSearchParams(data);
  const resp = await axios.get(`${API_ENDPOINT}orders/cart/completed?${urlParams}`);
  return resp.data;
}

export async function getOrderInvoice(anonid, uuid) {
  const data = { ...getAnonIdAndUuid(), anonid, uuid };

  console.log('getOrderInvoice: ', data);

  const urlParams = new URLSearchParams(data);
  const resp = await axios.get(`${API_ENDPOINT}orders/cart/completed/invoice?${urlParams}`);
  return resp.data;
}

export async function setOrderAddress(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('setOrderAddress', data);

  const resp = await axios.post(`${API_ENDPOINT}orders/cart/address`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
}

export async function setOrderAddressPartial(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('setOrderAddressPartial', data);

  const resp = await axios.post(`${API_ENDPOINT}orders/cart/address-partial`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
}

export async function createPaymentIntent(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('createPaymentIntent', data);

  return axios.post(`${API_ENDPOINT}orders/cart/payment`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function preConfirmPayment(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('preConfirmPayment', data);

  return axios.post(`${API_ENDPOINT}orders/cart/payment/pre-confirm`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function addCoupon(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('addCoupon', data);

  return axios.post(`${API_ENDPOINT}orders/coupon/add`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function removeCoupon(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('removeCoupon', data);

  return axios.post(`${API_ENDPOINT}orders/coupon/remove`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getOrderMode() {
  console.log('getOrderMode');

  const resp = await axios.get(`${API_ENDPOINT}env-mode`);
  return resp?.data?.mode;
}

export async function saveMessage(data) {
  const newData = {
    ...data,
    ...getAnonIdAndUuid(),
  };

  console.log('Save Message', data);

  return axios.post(`${API_ENDPOINT}message`, newData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
