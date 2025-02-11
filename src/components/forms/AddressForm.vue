<script setup lang="ts">
import { computed, watch, toRef, onMounted } from 'vue';

import FormTextField from './FormTextField.vue';
import FormCountrySelectField from './FormCountrySelectField.vue';
import FormRowContainer from './FormRowContainer.vue';

import { useAddressForm } from '@/composables/useAddressForm';
import type { Address } from '@/composables/useAddressForm';

interface Props {
  id: string;
  initialAddress: Address;
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
  initialValues: props.initialAddress,
  showAllErrors: toRef(props, 'showAllErrors'),
});

const handleUpdated = () => {
  emit('updated', [validateSync(values), { ...values }, 0]);
};

const disableForm = computed(() => props.disabled || props.hideForm);

onMounted(handleUpdated);
</script>

<template>
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
</template>

<style scoped></style>
