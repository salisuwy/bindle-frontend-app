<template>
  <section
    class="flex flex-col justify-center p-4 text-sm bg-white rounded-md border-0 border-solid shadow-lg border-zinc-200 max-w-[500px]"
  >
    <div class="flex justify-between items-center">
      <div class="flex flex-1 gap-1 md:gap-4 items-center my-auto">
        <span
          class="text-red-700 bg-red-100 rounded-full p-2 md:p-4 flex justify-center items-center"
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
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </span>

        <h3 class="md:text-lg font-medium text-zinc-950">
          Error encontered, please try again
        </h3>
      </div>
      <a href="/checkout" class="font-semibold text-theme-teal">View Cart</a>
    </div>
  </section>
</template>

<script setup>
</script>
