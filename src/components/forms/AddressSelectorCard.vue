<script setup lang="ts">
import { computed } from 'vue';

import type { Address } from '@/composables/useAddressForm';

interface Props {
  address: Address;
  modelValue: string;
  value: string;
  disabled?: boolean;
}
const props = defineProps<Props>();

const convertToCompact = ({
  first_name,
  last_name,
  address1,
  address2,
  city,
  zip,
  country,
  email,
  phone,
}: Address) => {
  const name = [first_name, last_name];
  const address = [address1];
  if (address2) {
    address.push(address2);
  }
  address.push(city, zip, country);

  return {
    name: name.join(' '),
    address: address.join(', '),
    email,
    phone,
  };
};

const compactAddress = computed(() => convertToCompact(props.address));
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="flex flex-row">
    <input
      class="!mr-8 !mt-3 bindle-radio"
      type="radio"
      :checked="modelValue == value"
      @change="emit('update:modelValue', value)"
      :value="value"
      :disabled="disabled"
    />

    <div class="flex flex-col align-start">
      <span class="text-theme-navyblue font-bold text-sm uppercase">{{ compactAddress.name }}</span>
      <span class="text-base font-normal text-neutral-900 mt-2">{{ compactAddress.address }}</span>
      <span class="mt-3 font-medium text-neutral-900"
        ><span class="font-normal text-gray-400">Email:&nbsp;</span>{{ compactAddress.email }}</span
      >
      <span class="mt-3 font-medium text-neutral-900"
        ><span class="font-normal text-gray-400">Phone no:&nbsp;</span
        >{{ compactAddress.phone }}</span
      >
    </div>
  </div>
</template>

<style scoped></style>
