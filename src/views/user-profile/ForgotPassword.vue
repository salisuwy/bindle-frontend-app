<template>
    <MinimalLayout>
        <div class="login-container flex justify-center items-center">
            <div v-if="!authStore.state.forgotPassword"
                class="login-box w-full max-w-md bg-white rounded-lg shadow-md text-left"
                @keydown.enter="onForgotPassword">
                <h1 class="text-xl font-semibold text-gray-900 border-b px-6 py-4">Forgot Your Password?</h1>
                <div class="p-6">
                    <!-- Email Input -->
                    <p class="text-sm mb-3 text-theme-darkgray2">Please enter the email address you'd like your password
                        reset</p>
                    <div class="mb-4">
                        <label for="email" class="block font-medium text-gray-700 text-sm">Email</label>
                        <input type="email" id="email" placeholder="Enter your email address"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            v-model="email" />
                    </div>





                    <!-- Continue Button -->
                    <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md mb-4"
                        @click="onForgotPassword">
                        <span v-if="authStore.isLoading">Resetting <i v-if="authStore.isLoading"
                                class="fa fa-solid fa-circle-notch fa-spin ml-2"></i></span>
                        <span v-else>Continue</span>
                    </button>

                    <!-- Error Message -->
                    <p v-if="authStore.error" class="text-red-500 text-sm mt-2">Error: {{ authStore.error }}</p>

                    <!-- Success Message -->
                    <!-- <p v-if="isSuccess" class="text-green-500 text-sm mt-2">Login successful!</p> -->

                    <!-- Signup Link -->
                    <p class="text-sm text-gray-500 text-center mt-1">

                        <a href="/login"
                            class="text-theme-darkgray hover:text-teal-500 focus:text-teal-500 hover:underline"> <i
                                class="fa fa-angle-left mr-1"></i>
                            Back to Login</a>
                    </p>
                </div>

            </div>
            <div v-else class="p-6 w-full max-w-md bg-white rounded-lg shadow-md text-center">
                <div class="text-lg mb-3 text-teal-500 p-1 rounded flex flex-col mt-6">
                    <i class="fa far fa-check-circle fa-2x"></i>
                    {{ authStore.state.forgotPassword.message }}
                </div>
                <!-- <p class=" text-theme-darkgray mb-8" @dblclick="copyPassword">Your new password is <br> <span
                        ref="myPassword"
                        class=" text-neutral-600 font-medium bg-theme-pale px-2 py-1 rounded cursor-pointer">{{
                            authStore.state.forgotPassword.new_password }}</span>

                    <span v-if="passwordCopied" class="text-sm pl-6 absolute">copied! <i
                            class="fa fa-copy ml-2"></i></span>
                </p> -->

                <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-md"
                    @click="navigateToLogin">
                    <i class="fa fa-angle-left mr-1"></i>
                    Back to Login
                </button>
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
const myPassword = ref(null);

const passwordCopied = ref(false);

const onForgotPassword = () => {
    authStore.forgotPassword({
        email: email.value,
    });
};

const navigateToLogin = () => {
    router.push("/login");
}

const copyPassword = () => {
    navigator.clipboard.writeText(authStore.state.forgotPassword.new_password);
    passwordCopied.value = true;
}
</script>
