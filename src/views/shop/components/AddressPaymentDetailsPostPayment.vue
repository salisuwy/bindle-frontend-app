<template>
  <section class="flex flex-col px-6 py-8 bg-white rounded-md border border-solid border-zinc-200 w-full max-md:px-5">
    <header class="items-start pt-2 pb-6 text-xl font-medium leading-7 text-gray-700 border-b border-solid border-zinc-200 max-md:pr-5 max-md:max-w-full">
      Customer Information
    </header>
    <div class="flex flex-col justify-center px-6 mt-6 bg-white rounded-md max-md:px-5 max-md:max-w-full">
      <div class="justify-between max-md:max-w-full">
        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
          <!-- w-6/12 -->
          <article class="flex flex-col w-full max-md:ml-0 max-md:w-full">
            <div class="flex flex-col grow pb-5 w-full text-base font-medium bg-white rounded-md text-zinc-900 max-md:mt-8">
              <h2 class="text-lg text-slate-800">Delivery address</h2>
              <p class="mt-6 text-sm font-bold text-cyan-800 uppercase">John Smith</p>
              <p class="mt-2">456 Elm Street, London, E1 6AN, United Kingdom</p>
              <p class="mt-3">
                <span class="text-zinc-500">Email: </span>
                john.smith@gmail.com
              </p>
              <p class="mt-3">
                <span class="text-zinc-500">Phone no: </span>
                +44 20 7946 0958
              </p>
            </div>
          </article>
          
        </div>
      </div>
    </div>
    <article class="flex flex-col justify-center items-start px-6 mt-6 text-base font-medium bg-white rounded-md text-zinc-900 max-md:px-5 max-md:max-w-full">
      <div class="flex flex-col bg-white rounded-md">
        <h2 class="text-lg text-slate-800">Payment details</h2>
        <p class="mt-6 text-sm font-bold text-cyan-800 uppercase">John Smith</p>
        <p class="mt-4">
          <span class="text-zinc-500">Card Number: </span>
          **** **** **** 1234
        </p>
        <p class="mt-4">
          <span class="text-zinc-500">Expiration Date: </span>
          12/25
        </p>
      </div>
    </article>
  </section>
</template>

<script setup>

</script>