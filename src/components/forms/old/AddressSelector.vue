<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import FormContainer from './FormContainer.vue';
import AddressCard from './AddressCard.vue';
import BindleButton from '@/components/BindleButton.vue';
import BindleCheckbox from '@/components/BindleCheckbox.vue';

import type { Address } from '@/composables/useAddressForm';
import type { SavedAddress } from '@/store/useAuthStore';

interface Props {
  title: string;
  type: 'billing' | 'delivery';
  savedAddresses: SavedAddress[];
  useDeliveryForBilling?: boolean;
}
const props = defineProps<Props>();

const addresses = computed(() => {
  const defaultAddresses = props.savedAddresses
    .filter(
      (a) =>
        (props.type == 'billing' && a.is_billing_default == 1) ||
        (props.type == 'delivery' && a.is_delivery_default == 1)
    )
    .map(convertToAddress);

  const otherAddresses = props.savedAddresses
    .filter(
      (a) =>
        (props.type == 'billing' && a.is_billing_default == 0) ||
        (props.type == 'delivery' && a.is_delivery_default == 0)
    )
    .map(convertToAddress);

  return defaultAddresses.concat(otherAddresses);
});

const convertToAddress = (sa: SavedAddress): Address => {
  return {
    first_name: sa.first_name,
    last_name: sa.last_name,
    address1: sa.address1,
    address2: sa.address2 === null ? undefined : sa.address2,
    city: sa.city,
    zip: sa.zip,
    country: sa.country,
    email: sa.email,
    phone: sa.phone,
  };
};

const selected = ref<string>('0');

const key = 0;
const emit = defineEmits<{
  new: [value: void];
  updated: [value: [isValid: boolean, address: Address, key: number]];
}>();

watch([addresses, () => props.useDeliveryForBilling], () => {
  if (addresses.value.length > 0 && !props.useDeliveryForBilling) {
    emit('updated', [true, addresses.value[0], key]);
  }
});

watch(selected, (newVal) => {
  const address = addresses.value[parseInt(newVal)];
  if (address) {
    emit('updated', [true, address, key]);
  }
});
</script>

<template>
  <FormContainer :title="title" :hideForm="useDeliveryForBilling">
    <template #header-control>
      <slot name="header-control"></slot>
    </template>
    <AddressCard
      v-for="(address, i) in addresses"
      v-model="selected"
      :key="address.address1"
      :address="address"
      :value="String(i)"
    />
    <BindleButton @click="$emit('new')" class="mt-2" type="secondary">New Address</BindleButton>
  </FormContainer>
</template>

<style scoped>
.address {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
</style>
