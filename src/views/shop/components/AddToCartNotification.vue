<template>
  <section
    class="flex flex-col justify-center p-4 text-sm bg-white rounded-md border-0 border-solid shadow-lg border-zinc-200 max-w-[500px]"
  >
    <div class="flex justify-between items-center">
      <div class="flex flex-1 gap-1 md:gap-4 items-center my-auto">
        <span
          class="text-teal-700 bg-teal-100 rounded-full p-2 md:p-4 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </span>
        <h3 class="md:text-lg font-medium text-zinc-950">Product added to basket</h3>
      </div>
      <a href="/checkout" class="font-semibold text-theme-teal">View Cart</a>
      
    </div>
  </section>
</template>

<script setup></script>
