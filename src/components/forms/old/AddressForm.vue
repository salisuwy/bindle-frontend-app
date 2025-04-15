<script setup lang="ts">
import { computed, watch, toRef } from 'vue';

import FormContainer from './FormContainer.vue';
import FormTextField from './FormTextField.vue';
import FormCountrySelectField from './FormCountrySelectField.vue';
import FormRowContainer from './FormRowContainer.vue';

import { useAddressForm } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

import { typedKeys, consoleLog } from '../helpers/tsUtils';

interface Props {
  id: string;
  title: string;
  address: Address;
  showAllErrors?: boolean;
  disabled?: boolean;
  hideForm?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  updated: [value: [isValid: boolean, address: Address, key: number]];
}>();

const concatId = (id: string) => `${props.id}_${id}`;

const {
  //meta,
  //errors,
  values,
  validateSync,
  setValues,
  resetForm,
  firstName,
  firstNameAttrs,
  lastName,
  lastNameAttrs,
  phoneNumber,
  phoneNumberAttrs,
  email,
  emailAttrs,
  address1,
  address1Attrs,
  address2,
  address2Attrs,
  city,
  cityAttrs,
  zip,
  zipAttrs,
  country,
  countryAttrs,
} = useAddressForm(toRef(props, 'showAllErrors'));

const handleUpdated = (keyVal: number) => {
  emit('updated', [validateSync(values), { ...values }, keyVal]);
};

// for debugging purposes only
// TODO: remove this!
let key = 0;

const disableForm = computed(() => props.disabled || props.hideForm);

watch(
  () => props.address,
  (newVal, oldVal) => {
    key += 1;
    consoleLog(key, props.id, 'ADDRESS CHANGED FROM ', oldVal, ' TO ', newVal);
    if (typedKeys(props.address).every((k) => props.address[k] === undefined)) {
      resetForm();
    }
    setValues({
      ...props.address,
    });

    handleUpdated(key);
  },
  { immediate: true }
);
</script>

<template>
  <FormContainer :id="id" :title="title" :hideForm="hideForm">
    <template #header-control>
      <slot name="header-control"></slot>
    </template>
    <FormRowContainer>
      <FormTextField
        :id="concatId('first_name')"
        :disabled="disableForm"
        label="First name *"
        placeholder="Enter your first name"
        v-model="firstName"
        v-bind="firstNameAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        :id="concatId('last_name')"
        :disabled="disableForm"
        label="Last name *"
        placeholder="Enter your last name"
        v-model="lastName"
        v-bind="lastNameAttrs"
        @blur="handleUpdated"
      />
    </FormRowContainer>
    <FormRowContainer>
      <FormTextField
        type="tel"
        :id="concatId('phone')"
        :disabled="disableForm"
        label="Phone number *"
        placeholder="Enter your phone number"
        v-model="phoneNumber"
        v-bind="phoneNumberAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        type="email"
        :id="concatId('email')"
        :disabled="disableForm"
        label="Email *"
        placeholder="Enter your email"
        v-model="email"
        v-bind="emailAttrs"
        @blur="handleUpdated"
      />
    </FormRowContainer>
    <FormTextField
      :id="concatId('address1')"
      :disabled="disableForm"
      label="Address line 1 *"
      placeholder="Enter your Address line 1"
      v-model="address1"
      v-bind="address1Attrs"
      @blur="handleUpdated"
    />
    <FormTextField
      :id="concatId('address2')"
      :disabled="disableForm"
      label="Address line 2"
      placeholder="Enter your Address line 2"
      v-model="address2"
      v-bind="address2Attrs"
      @blur="handleUpdated"
    />
    <FormRowContainer>
      <FormTextField
        :id="concatId('city')"
        :disabled="disableForm"
        label="Town/City *"
        placeholder="Enter your city"
        v-model="city"
        v-bind="cityAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        :id="concatId('zip')"
        :disabled="disableForm"
        label="Postcode / ZIP *"
        placeholder="Enter your postcode"
        v-model="zip"
        v-bind="zipAttrs"
        @blur="handleUpdated"
      />
    </FormRowContainer>
    <FormRowContainer padRight>
      <FormCountrySelectField
        :id="concatId('country')"
        :disabled="disableForm"
        label="Select Country *"
        placeholder="Select option"
        v-model="country"
        v-bind="countryAttrs"
        @blur="handleUpdated"
      />
    </FormRowContainer>
  </FormContainer>
</template>

<style scoped></style>
