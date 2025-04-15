<script setup lang="ts">
interface Props {
  title?: string;
  hideForm?: boolean;
  hideHeader?: boolean;
}
defineProps<Props>();
</script>

<template>
  <form
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:max-w-full"
  >
    <header
      v-if="!hideHeader"
      class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">{{ title }}</h1>
      <slot name="header-control"></slot>
    </header>
    <template v-if="!hideForm">
      <hr v-if="!hideHeader" class="mt-4 h-px border border-zinc-200" />
      <section
        class="flex flex-col bg-white max-md:max-w-full gap-6"
        :class="{ 'mt-6': !hideHeader }"
      >
        <slot> </slot>
      </section>
    </template>
  </form>
</template>

<style scoped></style>
