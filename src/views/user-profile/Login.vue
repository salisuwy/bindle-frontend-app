<template>
    <MinimalLayout>
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

                    <!-- Signup Link -->
                    <p class="text-sm text-gray-500 text-center mt-1">
                        Don't have an account?
                        <a href="/signup" class="text-teal-500 hover:underline">Sign Up</a>
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

const {
    login,
} = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const onLoginUser = () => {
    login({
        email: email.value,
        password: password.value
    });
};
</script>
