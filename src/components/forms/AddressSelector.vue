<script setup lang="ts">
import { ref, watch } from 'vue';

import AddressSelectorCard from './AddressSelectorCard.vue';

import { isAddressEqual } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

interface Props {
  modelValue: Partial<Address>;
  savedAddresses: Address[];
}
const props = defineProps<Props>();

const selected = ref('0');

const emit = defineEmits<{
  'update:modelValue': [address: Address];
}>();

watch(
  props.modelValue,
  () => {
    const index = props.savedAddresses.findIndex((a) => isAddressEqual(props.modelValue, a));
    if (index > -1) {
      selected.value = String(index);
    } else {
      selected.value = '0';
    }
  },
  { immediate: true }
);

watch(selected, () => {
  const address = props.savedAddresses[parseInt(selected.value)];
  if (address) {
    emit('update:modelValue', address);
  }
});
</script>

<template>
  <AddressSelectorCard
    v-for="(address, i) in savedAddresses"
    v-model="selected"
    :key="address.address1"
    :address="address"
    :value="String(i)"
  />
</template>

<style scoped>
.address {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
</style>
