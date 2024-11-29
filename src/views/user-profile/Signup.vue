<template>
  <div class="signup">
    <div class="header border-b">
      <router-link to="/">
        <bindle-logo />
      </router-link>
    </div>
    <div class="signup-container flex justify-center items-center">
      <div v-if="!user" class="signup-box w-full max-w-md bg-white rounded-lg shadow-md text-left">
        <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Sign up to Bindle</h1>
        <div class="p-6">
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
            @click="onSignupUser" :disabled="isLoading">
            <span v-if="isLoading">Signing up...</span>
            <span v-else>Continue</span>
          </button>

          <!-- Error Message -->
          <p v-if="isError" class="text-red-500 text-sm mt-2">Error: {{ error.message }}</p>

          <!-- Success Message -->
          <p v-if="isSuccess" class="text-green-500 text-sm mt-2">Signup successful!</p>

          <!-- Login Link -->
          <p class="text-sm text-gray-500 text-center mt-2">
            Already have an account?
            <a href="/login" class="text-teal-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
      <div v-if="isSuccess" class="signup-box-user-details w-full max-w-md bg-white rounded-lg shadow-md text-left">
        <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Sign up to Bindle</h1>
        <div class="p-6">
          <!-- Firstname Input -->
          <div class="mb-4">
            <label for="first_name" class="block font-medium text-gray-700">First Name</label>
            <input type="first_name" id="first_name" placeholder="Enter your firstname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="firstname" />
          </div>

          <!-- Lastname Input -->
          <div class="mb-4">
            <label for="last_name" class="block font-medium text-gray-700">Lastname</label>
            <input type="last_name" id="last_name" placeholder="Enter your lastname"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              v-model="lastname" />
          </div>

          <!-- Continue Button -->
          <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md mb-4"
            @click="onUpdateUser" :disabled="isUpdateUserLoading">
            <span v-if="isUpdateUserLoading">Updating...</span>
            <span v-else>Continue</span>
          </button>

          <!-- Error Message -->
          <p v-if="isUpdateUserError" class="text-red-500 text-sm mt-2">Error: {{ updateUserError.message }}</p>

          <!-- Success Message -->
          <p v-if="isUpdateUserSuccess" class="text-green-500 text-sm mt-2">Update successful!</p>


        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useMutation } from "@tanstack/vue-query";
import { signupUser, updateUser } from "@/store/user-profile-api";

import BindleLogo from "@/views/shared/BindleLogo.vue";

const router = useRouter();

const email = ref("");
const password = ref("");
const firstname = ref("");
const lastname = ref("");

const { mutate: signup, isLoading, isError, isSuccess, error, data: user } = useMutation({
  mutationFn: signupUser, // Ensure signupUser is passed as mutationFn
});

const onSignupUser = () => {
  signup({
    email: email.value,
    password: password.value,
    first_name: "A",
    last_name: "B",
    phone: "1234567890",
  });
  if (isSuccess) {
    console.log("Hello success", user)
  }
};


const { mutate: update, isUpdateUserLoading, isUpdateUserError, isUpdateUserSuccess, updateUserError, data: updatedUser } = useMutation({
  mutationFn: updateUser,
});

const onUpdateUser = () => {

  console.log("user user", user)
  update({
    params: {
      first_name: firstname.value,
      last_name: lastname.value,
    },
    token: user.value?.token
  });
  if (isUpdateUserSuccess) {
    console.log("Hello success on update", user)
  }
}


</script>

<style scoped>
.signup {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background: linear-gradient(113.52deg, #e5f3f1 0%, #f8f9f9 100%);
}

.header {
  text-align: center;
  padding: 1.5rem 0 1.5rem 2rem;
}
</style>
