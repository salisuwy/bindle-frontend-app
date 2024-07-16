<template>
  <div
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full"
  >
    <header
      class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">Payment Details</h1>
    </header>
    <hr class="mt-4 h-px border border-zinc-200" />

    <form>
      <div
        class="mt-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
      >
        <label for="cardNumber">Card number *</label>
      </div>
      <input
        id="cardNumber"
        type="text"
        placeholder="Enter your card number"
        class="justify-center px-4 py-2 mt-2 tracking-tighter bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full w-full"
        required
      />
      <div class="flex gap-5 mt-6 tracking-tighter max-md:flex-wrap">
        <div class="flex flex-col flex-1">
          <label for="expiryDate" class="font-medium text-neutral-600"
            >Expiry date *</label
          >
          <input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            class="justify-center px-4 py-2 mt-2 whitespace-nowrap bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
        <div class="flex flex-col flex-1">
          <label for="cvv" class="font-medium text-neutral-600">CVV *</label>
          <input
            id="cvv"
            type="text"
            placeholder="CVV"
            class="justify-center px-4 py-2 mt-2 whitespace-nowrap bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
            required
          />
        </div>
      </div>
      <div
        class="mt-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
      >
        <label for="cardHolderName">Card holder name *</label>
      </div>
      <input
        id="cardHolderName"
        type="text"
        placeholder="Enter your card holder name"
        class="justify-center px-4 py-2 mt-2 tracking-tighter bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full w-full"
        required
      />
    </form>
  </div>
</template>

<script setup></script>
