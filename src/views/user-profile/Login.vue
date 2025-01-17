<template>
    <MinimalLayout>
        <div class="login-container flex justify-center items-center">
            <div class="login-box w-full max-w-md bg-white rounded-lg shadow-md text-left" @keydown.enter="onLoginUser">
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
                    <div class="mb-3 relative">
                        <label for="password" class="block font-medium text-gray-700">Password</label>
                        <input :type="isPasswordVisible ? 'text' : 'password'" id="password"
                            placeholder="Enter your password"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            v-model="password" />
                        <p class="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                        <span @click="togglePasswordVisibility"
                            class="absolute top-8 right-3 text-gray-500 cursor-pointer">
                            <i :class="isPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'" class="pt-2"></i>
                        </span>
                    </div>

                    <p class="text-sm text-gray-500 text-right mb-3">
                        <a href="/forgot-password"
                            class="text-theme-darkgray focus:text-teal-500 hover:text-teal-500 hover:underline">Forgot
                            Password?</a>
                    </p>


                    <!-- Continue Button -->
                    <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md mb-4"
                        @click="onLoginUser">
                        <span v-if="authStore.isLoading">Logging In <i v-if="authStore.isLoading"
                                class="fa fa-solid fa-circle-notch fa-spin ml-2"></i></span>
                        <span v-else>Continue</span>
                    </button>

                    <!-- Error Message -->
                    <p v-if="authStore.error" class="text-red-500 text-sm mt-2">Error: {{ authStore.error }}</p>

                    <!-- Success Message -->
                    <!-- <p v-if="isSuccess" class="text-green-500 text-sm mt-2">Login successful!</p> -->

                    <!-- Divider -->
                    <div class="flex items-center justify-center mb-4">
                        <hr class="w-full border-gray-300" />
                        <span class="px-2 text-gray-500 text-sm">OR</span>
                        <hr class="w-full border-gray-300" />
                    </div>

                    <!-- Signup with Google -->
                    <button class="w-full flex items-center justify-center border border-gray-300 text-gray-700
            font-normal py-2 rounded-md mb-3 bg-gray-100 hover:bg-gray-200" @click="onSignupWithGoogle">
                        <span class="mr-4">
                            <img loading="lazy" src="/assets/google.svg" class="w-5" />
                        </span>
                        Continue with Google
                    </button>

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

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const onLoginUser = () => {
    authStore.login({
        email: email.value,
        password: password.value
    });
};


const onSignupWithGoogle = async () => {
    const googleUrl = await authStore.signupWithGoogle();
    const authWindow = window.open(
        googleUrl,
        "_blank",
        "width=500,height=600"
    );

    if (!authWindow) {
        console.error("Unable to open authentication window.");
        return;
    }

    const interval = setInterval(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            console.log("Token received from localStorage:", token);
            authStore.setAccessToken(token);

            // Cleanup
            clearInterval(interval);
            localStorage.removeItem("authToken");
            authWindow.close();
            authStore.getProfile({
                redirectFrom: 'login'
            });
        }
    }, 1000); // Poll every second
};

</script>
