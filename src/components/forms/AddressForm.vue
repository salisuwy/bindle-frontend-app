<script setup lang="ts">
import { computed, watch, toRef } from 'vue';

import FormTextField from './FormTextField.vue';
import FormCountrySelectField from './FormCountrySelectField.vue';
import FormRowContainer from './FormRowContainer.vue';

import { useAddressForm } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

interface Props {
  id: string;
  modelValue: Partial<Address>;
  showAllErrors?: boolean;
  disabled?: boolean;
  hideForm?: boolean;
  loading?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: Partial<Address>];
  blur: [value: Partial<Address>];
}>();

const concatId = (id: string) => `${props.id}_${id}`;

const {
  values,
  setValues,
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
} = useAddressForm({
  initialValues: props.modelValue,
  showAllErrors: toRef(props, 'showAllErrors'),
});

watch(values, () => {
  emit('update:modelValue', values);
});

watch(
  () => props.modelValue,
  () => {
    setValues(props.modelValue);
  }
);

const handleBlur = () => {
  emit('blur', values);
};

const disableForm = computed(() => props.disabled || props.hideForm || props.loading);

const loadingPlaceholder = (placeholder: string) => (props.loading ? 'Loading...' : placeholder);
</script>

<template>
  <FormRowContainer>
    <FormTextField
      :id="concatId('first_name')"
      :disabled="disableForm"
      label="First name *"
      :placeholder="loadingPlaceholder('Enter your first name')"
      v-model="firstName"
      v-bind="firstNameAttrs"
      @blur="handleBlur"
    />
    <FormTextField
      :id="concatId('last_name')"
      :disabled="disableForm"
      label="Last name *"
      :placeholder="loadingPlaceholder('Enter your last name')"
      v-model="lastName"
      v-bind="lastNameAttrs"
      @blur="handleBlur"
    />
  </FormRowContainer>
  <FormRowContainer>
    <FormTextField
      type="tel"
      :id="concatId('phone')"
      :disabled="disableForm"
      label="Phone number *"
      :placeholder="loadingPlaceholder('Enter your phone number')"
      v-model="phoneNumber"
      v-bind="phoneNumberAttrs"
      @blur="handleBlur"
    />
    <FormTextField
      type="email"
      :id="concatId('email')"
      :disabled="disableForm"
      label="Email *"
      :placeholder="loadingPlaceholder('Enter your email')"
      v-model="email"
      v-bind="emailAttrs"
      @blur="handleBlur"
    />
  </FormRowContainer>
  <FormTextField
    :id="concatId('address1')"
    :disabled="disableForm"
    label="Address line 1 *"
    :placeholder="loadingPlaceholder('Enter your Address line 1')"
    v-model="address1"
    v-bind="address1Attrs"
    @blur="handleBlur"
  />
  <FormTextField
    :id="concatId('address2')"
    :disabled="disableForm"
    label="Address line 2"
    :placeholder="loadingPlaceholder('Enter your Address line 2')"
    v-model="address2"
    v-bind="address2Attrs"
    @blur="handleBlur"
  />
  <FormRowContainer>
    <FormTextField
      :id="concatId('city')"
      :disabled="disableForm"
      label="Town/City *"
      :placeholder="loadingPlaceholder('Enter your city')"
      v-model="city"
      v-bind="cityAttrs"
      @blur="handleBlur"
    />
    <FormTextField
      :id="concatId('zip')"
      :disabled="disableForm"
      label="Postcode / ZIP *"
      :placeholder="loadingPlaceholder('Enter your postcode')"
      v-model="zip"
      v-bind="zipAttrs"
      @blur="handleBlur"
    />
  </FormRowContainer>
  <FormRowContainer padRight>
    <FormCountrySelectField
      :id="concatId('country')"
      :disabled="disableForm"
      label="Select Country *"
      :placeholder="loadingPlaceholder('Select option')"
      v-model="country"
      v-bind="countryAttrs"
      @blur="handleBlur"
    />
  </FormRowContainer>
</template>

<style scoped></style>
