<script setup lang="ts">
interface Props {
  title: string;
}
defineProps<Props>();
</script>

<template>
  <form
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5">
      <h1 class="grow text-xl leading-7 text-gray-700">{{ title }}</h1>
    </header>
    <hr class="mt-4 h-px border border-zinc-200" />
    <section class="flex flex-col mt-6 bg-white max-md:max-w-full gap-6">
      <slot> </slot>
    </section>
  </form>
</template>

<style scoped></style>
