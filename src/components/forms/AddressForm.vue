<script setup lang="ts">
import { watch, toRef } from 'vue';

import FormContainer from './FormContainer.vue';
import FormTextField from './FormTextField.vue';
import FormCountrySelectField from './FormCountrySelectField.vue';
import FormRowContainer from './FormRowContainer.vue';

import { useAddressForm } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

interface Props {
  id: string;
  address: Address;
  showAllErrors?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  updated: [value: [isValid: boolean, address: Address]];
}>();

const concatId = (id: string) => `${props.id}_${id}`;

const {
  values,
  validate,
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

const handleUpdated = async () => {
  const res = await validate();
  emit('updated', [res.valid, { ...values }]);
};

watch(
  () => props.address,
  async () => {
    resetForm();
    setValues(props.address);
    await handleUpdated();
  },
  { immediate: true }
);
</script>

<template>
  <FormContainer title="Delivery Address">
    <FormRowContainer>
      <FormTextField
        :id="concatId('first_name')"
        label="First name *"
        placeholder="Enter your first name"
        v-model="firstName"
        v-bind="firstNameAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        :id="concatId('last_name')"
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
        label="Phone number *"
        placeholder="Enter your phone number"
        v-model="phoneNumber"
        v-bind="phoneNumberAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        type="email"
        :id="concatId('email')"
        label="Email *"
        placeholder="Enter your email"
        v-model="email"
        v-bind="emailAttrs"
        @blur="handleUpdated"
      />
    </FormRowContainer>
    <FormTextField
      :id="concatId('address1')"
      label="Address line 1 *"
      placeholder="Enter your Address line 1"
      v-model="address1"
      v-bind="address1Attrs"
      @blur="handleUpdated"
    />
    <FormTextField
      :id="concatId('address2')"
      label="Address line 2"
      placeholder="Enter your Address line 2"
      v-model="address2"
      v-bind="address2Attrs"
      @blur="handleUpdated"
    />
    <FormRowContainer>
      <FormTextField
        :id="concatId('city')"
        label="Town/City *"
        placeholder="Enter your city"
        v-model="city"
        v-bind="cityAttrs"
        @blur="handleUpdated"
      />
      <FormTextField
        :id="concatId('zip')"
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
