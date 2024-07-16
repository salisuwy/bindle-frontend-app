<template>

  <div
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full"
  >
    <header
      class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">Billing Address</h1>
      <div class="flex gap-2" v-show="false">
        <div class="flex flex-col justify-center p-1">
          <input
            type="checkbox"
            id="billingAddress"
            class="h-4 w-4 shrink-0 rounded-sm border border-zinc-200 text-teal-500 checked:ring-teal-500"
          />
        </div>
        <label
          for="billingAddress"
          class="text-base tracking-tighter leading-6 text-neutral-400"
        >
          Use this address for delivery details
        </label>
      </div>
    </header>
    <hr class="mt-4 h-px border border-zinc-200" />
    <form class="flex flex-col mt-6 bg-white max-md:max-w-full">
      <div
        class="flex gap-5 text-base tracking-tighter leading-6 max-md:flex-wrap"
      >
        <div class="flex flex-col flex-1">
          <label for="firstName" class="font-medium text-neutral-600"
            >First name *</label
          >
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
        <div class="flex flex-col flex-1">
          <label for="lastName" class="font-medium text-neutral-600"
            >Last name *</label
          >
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
      </div>
      <div
        class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
      >
        <div class="flex flex-col flex-1">
          <label for="phoneNumber" class="font-medium text-neutral-600"
            >Phone number *</label
          >
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Enter your phone number"
            class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
        <div class="flex flex-col flex-1">
          <label for="email" class="font-medium text-neutral-600"
            >Email *</label
          >
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
      </div>
      <label
        for="addressLine1"
        class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
      >
        Address line 1 *
      </label>
      <input
        type="text"
        id="addressLine1"
        placeholder="Enter your Address line 1"
        class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
        required
      />
      <label
        for="addressLine2"
        class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
      >
        Address line 2
      </label>
      <input
        type="text"
        id="addressLine2"
        placeholder="Enter your Address line 2"
        class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
      />
      <div
        class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
      >
        <div class="flex flex-col flex-1">
          <label for="city" class="font-medium text-neutral-600"
            >Town/ City *</label
          >
          <input
            type="text"
            id="city"
            placeholder="Enter your city"
            class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
        <div class="flex flex-col flex-1">
          <label for="postalCode" class="font-medium text-neutral-600">
            ZIP/ Postal code *
          </label>
          <input
            type="text"
            id="postalCode"
            placeholder="Enter your code"
            class="justify-center px-4 py-2 mt-2 bg-white bg-red-100 rounded-sm border border-solid border-zinc-200 text-neutral-400 border-red-400"
            required
          />
        </div>
      </div>
      <label
        for="country"
        class="self-start mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600"
      >
        Select Country *
      </label>
      <div
        class="flex justify-center self-start pr-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-neutral-200 text-neutral-400"
      >
        <select id="country" class="flex-1 bg-transparent border-none" required>
          <option value="">Select option</option>
          <option v-for="country in countries" :key="country.code" :value="country.name">
            {{ country.name }}
            </option>
        </select>
        
      </div>
    </form>
  </div>
</template>

<script setup>
  import { countries } from '@/components/helpers/countries';
</script>
