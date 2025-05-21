<script setup lang="ts">
interface Props {
  billing_first_name: string;
  payment_date: string;
}
defineProps<Props>();
</script>

<template>
  <div
    class="justify-start w-full items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-teal-500 bg-teal-50 rounded-md max-lg:px-5 max-lg:max-w-full"
  >
    <div class="w-full flex flex-col gap-3 md:flex-row lg:gap-0 justify-between items-start">
      <div>
        <h3 class="font-medium text-lg text-teal-500 mb-2">
          Order placed, Thank you
          {{ billing_first_name }}!
        </h3>
        <p class="text-theme-darkgray2">Confirmation will be sent to your email.</p>
      </div>
      <span class="text-theme-darkgray2 font-semibold"
        >Ordered on
        {{
          new Date(payment_date)?.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        }}</span
      >
    </div>
  </div>
</template>

<style scoped></style>
