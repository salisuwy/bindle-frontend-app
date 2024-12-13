<template>
    <BasicLayout>
        <div class="user-profile min-h-96 flex flex-row px-12 py-8 mt-6">
            <div class="profile-sidebar w-auto px-12">
                <h3 class="border-b mb-3 pb-3">MY ACCOUNT </h3>
                <ul>
                    <li class="pb-4 text-left">
                        My Profile
                    </li>
                    <li class="pb-4 text-left">
                        Orders
                    </li>
                    <li class="pb-4 text-left">
                        My E-books
                    </li>
                    <li class="pb-4 text-left">
                        Bindle Buddy
                    </li>
                </ul>
            </div>
            <div class="profile-settings flex-grow">
                <h2 class="">My Profile</h2>
                <div class="flex flex-wrap">
                    <div class="profile-firstname w-full sm:w-1/2 px-4 mb-4">
                        <label for="user-firstname-1">
                            First name
                        </label>
                        <input
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            id="user-firstname-1" placeholder="Enter your first name">
                    </div>

                    <div class="profile-lastname w-full sm:w-1/2 px-4 mb-4">
                        <label for="user-lastname-1">
                            Last name
                        </label>
                        <input
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            id="user-lastname-1" placeholder="Enter your last name">
                    </div>
                    <div class="profile-lastname w-full sm:w-1/2 px-4 mb-4">
                        <label for="user-lastname-1">
                            Last name
                        </label>
                        <input
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            id="user-lastname-1" placeholder="Enter your last name">
                    </div>
                    <div class="profile-lastname w-full sm:w-1/2 px-4 mb-4">
                        <label for="user-lastname-1">
                            Last name
                        </label>
                        <input
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            id="user-lastname-1" placeholder="Enter your last name">
                    </div>
                </div>
                <div class="password-reset border p-4 mb-4">
                    <h2 class="border-b pb-3 mb-3">Change Password</h2>
                </div>
                <div class="account-delete border p-4 mb-4">
                    <h2 class="border-b pb-3 mb-3">Account Delete</h2>
                </div>
            </div>
        </div>
    </BasicLayout>

</template>

<script setup>
import BasicLayout from "@/views/shared/BasicLayout.vue";
</script>