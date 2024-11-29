import axios from "axios";

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "https://service.bindle.co.uk/api/";

/**
 * All our user profile functions here
 * 1) Signup
 * 2) Login
 * 3) Update User Details
 */

export async function signupUser(params) {
  console.log(params);
  const resp = await axios.post(`${API_ENDPOINT}auth/signup`, params);
  console.log("signupUser", resp.data);
  return resp.data;
}

export async function loginUser(params) {
  console.log(params);
  const resp = await axios.post(`${API_ENDPOINT}auth/login`, params);
  console.log("loginUser", resp.data);
  return resp.data;
}

export async function updateUser(params) {
  console.log(params);
  const resp = await axios.post(
    `${API_ENDPOINT}profile/update`,
    params.params,
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("updateUser", resp.data);
  return resp.data;
}
