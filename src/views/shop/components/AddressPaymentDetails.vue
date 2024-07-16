<template>
  <section
    class="flex flex-col items-start px-6 py-8 mt-6 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header
      class="flex gap-4 justify-between items-center self-stretch max-md:flex-wrap max-md:max-w-full"
    >
      <h2
        class="pt-2 pb-0.5 my-auto text-xl font-medium leading-7 text-gray-700"
      >
        Billing Details
      </h2>
      <button
        class="justify-center px-3.5 py-2.5 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white"
      >
        Edit Details
      </button>
      
    </header>
    <h3 class="mt-6 text-sm font-bold text-cyan-800 uppercase">Anne Smith</h3>
    <p class="mt-2 text-base text-zinc-900">
      456 Elm Street, London, E1 6AN, United Kingdom
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Email: </span> Anne.smith@gmail.com
    </p>
    <p class="mt-3 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Phone no: </span> +44 20 7946 5351
    </p>
  </section>
  <section
    class="flex flex-col items-start px-6 py-8 mt-6 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header
      class="flex gap-4 justify-between self-stretch max-md:flex-wrap max-md:max-w-full"
    >
      <h2
        class="pt-2 pb-0.5 my-auto text-xl font-medium leading-7 text-gray-700"
      >
        Payment Details
      </h2>
      <button
        class="justify-center px-3.5 py-2.5 text-sm font-semibold text-teal-500 rounded-sm border border-teal-500 border-solid bg-white"
      >
        Edit Details
      </button>
    </header>
    <h3 class="mt-6 text-sm font-bold text-cyan-800 uppercase">John Smith</h3>
    <p class="mt-6 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Card Number: </span>**** **** **** 1234
    </p>
    <p class="mt-6 text-base font-medium text-zinc-900">
      <span class="text-zinc-500">Expiration Date: </span> 12/25
    </p>
  </section>
</template>

<script setup></script>
