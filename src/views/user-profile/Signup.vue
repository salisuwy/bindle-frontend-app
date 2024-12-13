<template>
  <MinimalLayout>
    <div class="signup-container flex justify-center items-center">
      <div class="signup-box w-full max-w-md bg-white rounded-lg shadow-md text-left">
        <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Sign up to Bindle</h1>
        <div class="p-6">

          <!-- Firstname Input -->
          <div class="mb-4">
            <label for="first_name" class="block font-medium text-gray-700">First Name</label>
            <input type="first_name" id="first_name" placeholder="Enter your firstname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="first_name" />
          </div>

          <!-- Lastname Input -->
          <div class="mb-4">
            <label for="last_name" class="block font-medium text-gray-700">Last Name</label>
            <input type="last_name" id="last_name" placeholder="Enter your lastname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="last_name" />
          </div>

          <!-- Email Input -->
          <div class="mb-4">
            <label for="email" class="block font-medium text-gray-700">Email</label>
            <input type="email" id="email" placeholder="Enter your email address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="email" />
          </div>

          <!-- Password Input -->
          <div class="mb-4">
            <label for="password" class="block font-medium text-gray-700">Password</label>
            <input type="password" id="password" placeholder="Enter your password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="password" />
            <p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>

          <!-- Continue Button -->
          <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md mb-4"
            @click="onSignupUser">
            Continue
            <i v-if="authStore.isLoading" class="fa fa-solid fa-circle-notch fa-spin ml-2"></i>
          </button>

          <!-- Error Message -->
          <p v-if="authStore.error" class="text-red-500 text-sm mt-2">Error: {{ authStore.error }}</p>

          <!-- Divider -->
          <!-- <div class="flex items-center justify-center mb-4">
            <hr class="w-full border-gray-300" />
            <span class="px-2 text-gray-500 text-sm">OR</span>
            <hr class="w-full border-gray-300" />
          </div> -->

          <!-- Signup with Google -->
          <!-- <button
            class="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-2 rounded-md mb-3 bg-gray-100 hover:bg-gray-200">
            <span class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19.428 15.341A8 8 0 1115.34 4.572m1.767 3.909h4m0 0v4m0-4L12 12" />
              </svg>
            </span>
            Signup with Google
          </button> -->

          <!-- Continue as Guest -->
          <!-- <button
            class="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <span class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
            </span>
            Continue as guest
          </button> -->

          <!-- Login Link -->
          <p class="text-sm text-gray-500 text-center mt-1">
            Already have an account?
            <a href="/login" class="text-teal-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  </MinimalLayout>

</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MinimalLayout from "@/views/shared/MinimalLayout.vue";
import { useAuthStore } from "@/store/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const first_name = ref("");
const last_name = ref("");

const onSignupUser = () => {
  authStore.signup({
    email: email.value,
    password: password.value,
    first_name: first_name.value,
    last_name: last_name.value
  });
};
</script>
