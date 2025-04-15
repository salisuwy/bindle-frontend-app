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
  modelValue: Partial<Address>;
  savedAddresses: Address[];
  hideForm?: boolean;
  showAllFormErrors?: boolean;
  disabled?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: Partial<Address>];
  blur: [value: Partial<Address>];
}>();

const selectedAddress = ref<Partial<Address>>(props.modelValue);
const showAddressForm = ref(false);

const initialise = () => {
  selectedAddress.value = props.modelValue;
  if (props.savedAddresses.length == 0) {
    showAddressForm.value = true;
  } else if (isAddressEmpty(props.modelValue)) {
    showAddressForm.value = false;
    selectedAddress.value = props.savedAddresses[0];
  } else {
    const index = props.savedAddresses.findIndex((a) => isAddressEqual(a, props.modelValue));
    showAddressForm.value = index == -1;
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

watch(selectedAddress, () => {
  emit('update:modelValue', selectedAddress.value);
  if (showAddressForm.value == false) {
    emit('blur', selectedAddress.value);
  }
});

const formElement = ref<HTMLDivElement | null>(null);
const scrollToTopOfForm = () => {
  document.getElementById(props.id)?.scrollIntoView({ behavior: 'smooth' });
};

const handleNewAddress = async () => {
  selectedAddress.value = { ...EMPTY_ADDRESS };
  emit('blur', selectedAddress.value);
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
</script>

<template>
  <FormContainer class="scroll-mt-4" :id="id" ref="formElement" :title="title" :hideForm="hideForm">
    <template #header-control>
      <slot name="header-control"></slot>
    </template>
    <template v-if="showAddressForm">
      <AddressForm
        :id="id"
        v-model="selectedAddress"
        :disabled="disabled"
        :showAllErrors="showAllFormErrors"
        @blur="$emit('blur', $event)"
      />
      <BindleButton
        v-if="savedAddresses.length > 0"
        type="secondary"
        @click="handleShowSelector"
        :disabled="disabled"
        >Use a saved address</BindleButton
      >
    </template>
    <template v-else>
      <AddressSelector
        v-model="selectedAddress"
        :disabled="disabled"
        :savedAddresses="savedAddresses"
      />
      <BindleButton type="secondary" @click="handleNewAddress" :disabled="disabled"
        >Use a different address</BindleButton
      >
    </template>
  </FormContainer>
</template>

<style scoped></style>
