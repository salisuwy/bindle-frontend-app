<script setup lang="ts">
import { watch, ref, onMounted, nextTick } from 'vue';

import FormContainer from '@/components/forms/FormContainer.vue';
import BindleButton from '@/components/BindleButton.vue';

import AddressForm from './AddressForm.vue';
import AddressSelector from './AddressSelector.vue';

import { EMPTY_ADDRESS, isAddressEmpty, isAddressEqual } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

interface Props {
  id: string;
  title: string;
  initialAddress: Address;
  savedAddresses: Address[];
  hideForm?: boolean;
  showAllFormErrors?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  updated: [value: [isValid: boolean, address: Address, key: number]];
}>();

const selectedAddress = ref(props.initialAddress);
const showAddressForm = ref(false);

const initialise = () => {
  selectedAddress.value = props.initialAddress;
  if (props.savedAddresses.length == 0) {
    showAddressForm.value = true;
  } else if (isAddressEmpty(props.initialAddress)) {
    showAddressForm.value = false;
    selectedAddress.value = props.savedAddresses[0];
  } else {
    const index = props.savedAddresses.findIndex((a) => isAddressEqual(a, props.initialAddress));
    showAddressForm.value = index == -1;
  }

  if (!showAddressForm.value) {
    emit('updated', [true, selectedAddress.value, 0]);
  }
};

onMounted(initialise);
watch(
  () => props.hideForm,
  (newVal) => {
    if (!newVal) {
      initialise();
    }
  }
);

const formElement = ref<HTMLDivElement | null>(null);
const scrollToTopOfForm = () => {
  document.getElementById(props.id)?.scrollIntoView({ behavior: 'smooth' });
};

const handleNewAddress = async () => {
  selectedAddress.value = { ...EMPTY_ADDRESS };
  showAddressForm.value = true;
  await nextTick();
  scrollToTopOfForm();
};

const handleShowSelector = async () => {
  selectedAddress.value = props.savedAddresses[0];
  showAddressForm.value = false;
  await nextTick();
  scrollToTopOfForm();
};

const handleFormUpdate = (vals: [boolean, Address, number]) => {
  emit('updated', vals);
};

watch(selectedAddress, () => {
  emit('updated', [true, selectedAddress.value, 0]);
});
</script>

<template>
  <FormContainer class="scroll-mt-4" :id="id" ref="formElement" :title="title" :hideForm="hideForm">
    <template #header-control>
      <slot name="header-control"></slot>
    </template>
    <template v-if="showAddressForm">
      <AddressForm
        :id="id"
        :initialAddress="selectedAddress"
        :showAllErrors="showAllFormErrors"
        @updated="handleFormUpdate"
      />
      <BindleButton v-if="savedAddresses.length > 0" type="secondary" @click="handleShowSelector"
        >Use a saved addresses</BindleButton
      >
    </template>
    <template v-else>
      <AddressSelector v-model="selectedAddress" :savedAddresses="savedAddresses" />
      <BindleButton type="secondary" @click="handleNewAddress"
        >Use a different address</BindleButton
      >
    </template>
  </FormContainer>
</template>

<style scoped></style>
