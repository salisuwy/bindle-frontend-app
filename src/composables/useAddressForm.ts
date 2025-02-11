import { watch, onUnmounted } from 'vue';
import type { Ref } from 'vue';

import * as yup from 'yup';
import { useForm, type PublicPathState } from 'vee-validate';
import { typedKeys } from '@/components/helpers/tsUtils';

import type { SavedAddress } from '@/store/useAuthStore';

export type Address = {
  first_name: string | undefined;
  last_name: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  address1: string | undefined;
  address2: string | undefined;
  city: string | undefined;
  zip: string | undefined;
  country: string | undefined;
};

export const EMPTY_ADDRESS: Address = {
  first_name: undefined,
  last_name: undefined,
  phone: undefined,
  email: undefined,
  address1: undefined,
  address2: undefined,
  city: undefined,
  zip: undefined,
  country: undefined,
};

export const isAddressEmpty = (address: Address) => {
  return typedKeys(address).every((k) => (address[k] || '') == '');
};

export const isAddressEqual = (a1: Address, a2: Address) => {
  return typedKeys(a1).every((k) => (a1[k] || '') === (a2[k] || ''));
};

export const createFromSavedAddress = (sa: SavedAddress): Address => {
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

export const useAddressForm = ({
  initialValues,
  showAllErrors,
}: {
  initialValues: Address;
  showAllErrors: Ref<boolean | undefined>;
}) => {
  const schema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    phone: yup.string().required('Phone number is required'),
    email: yup
      .string()
      .email('Email is invalid')
      .required('Email is required')
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Email is invalid'),
    address1: yup.string().required('Address line 1 is required'),
    address2: yup.string(),
    city: yup.string().required('Town/City is required'),
    zip: yup.string().required('Postcode/ZIP is required'),
    country: yup.string().required('Country is required'),
  });

  const { values, errors, validate, resetForm, defineField, setValues, setErrors, meta } =
    useForm<Address>({
      validationSchema: schema,
      initialValues: initialValues,
    });

  const unwatch = watch(showAllErrors, async () => {
    if (showAllErrors.value) {
      await validate();
    }
  });
  onUnmounted(unwatch);

  const fieldValidationOptions = (state: PublicPathState) => {
    return {
      props: { errorMessage: state.touched || showAllErrors.value ? state.errors[0] : undefined },
      validateOnModelUpdate: state.errors.length > 0,
    };
  };
  const [firstName, firstNameAttrs] = defineField('first_name', fieldValidationOptions);
  const [lastName, lastNameAttrs] = defineField('last_name', fieldValidationOptions);
  const [phoneNumber, phoneNumberAttrs] = defineField('phone', fieldValidationOptions);
  const [email, emailAttrs] = defineField('email', fieldValidationOptions);
  const [address1, address1Attrs] = defineField('address1', fieldValidationOptions);
  const [address2, address2Attrs] = defineField('address2', fieldValidationOptions);
  const [city, cityAttrs] = defineField('city', fieldValidationOptions);
  const [zip, zipAttrs] = defineField('zip', fieldValidationOptions);
  const [country, countryAttrs] = defineField('country', fieldValidationOptions);

  const validateSync = (values: any) => {
    try {
      // Use yup to get an immediate synchronous answer
      schema.validateSync(values, { abortEarly: true });
      return true;
    } catch {
      // run async vee-validate validation to update error feedback... eventually
      validate();
      return false;
    }
  };

  return {
    values,
    errors,
    meta,
    validate,
    validateSync,
    resetForm,
    setValues,
    setErrors,
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
  };
};
