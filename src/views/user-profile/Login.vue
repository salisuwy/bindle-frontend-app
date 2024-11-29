<template>
    <div class="login">
        <div class="header border-b">
            <router-link to="/">
                <bindle-logo />
            </router-link>
        </div>
        <div class="login-container flex justify-center items-center">
            <div class="login-box w-full max-w-md bg-white rounded-lg shadow-md text-left">
                <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Login to Bindle</h1>
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
                        @click="onLoginUser" :disabled="isLoading">
                        <span v-if="isLoading">Logging In...</span>
                        <span v-else>Continue</span>
                    </button>

                    <!-- Error Message -->
                    <p v-if="isError" class="text-red-500 text-sm mt-2">Error: {{ error.message }}</p>

                    <!-- Success Message -->
                    <p v-if="isSuccess" class="text-green-500 text-sm mt-2">Login successful!</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useMutation } from "@tanstack/vue-query";
import { loginUser } from "@/store/user-profile-api";

import BindleLogo from "@/views/shared/BindleLogo.vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const { mutate: login, isLoading, isError, isSuccess, error, data: user } = useMutation({
    mutationFn: loginUser,
});

const onLoginUser = () => {
    login({
        email: email.value,
        password: password.value
    });
    if (isSuccess) {
        console.log("Hello success", user);
        router.push("/");
    }
};
</script>

<style scoped>
.login {
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
