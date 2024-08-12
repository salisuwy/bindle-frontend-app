<script setup>
import { ref, watch, computed, defineProps, defineEmits } from "vue";
import { countries } from "@/components/helpers/countries";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { setOrderAddress, setUuid } from "@/store/cart-api";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  transition: String,
  currentStage: Number,
});
const emit = defineEmits(["setCurrentStage"]);
const queryClient = useQueryClient();

const { isPending, mutate } = useMutation({
  mutationFn: setOrderAddress,
  onMutate: () => {
    console.log("mutating");
  },
  onError: (error) => {
    console.error("mutation error", error);
    emit("setCurrentStage", 1);

    // toast(AddToCartErrorNotification);
  },
  onSuccess: ({ data }) => {
    console.log("mutation success", data);
    setUuid(data?.order?.uuid);
    emit("setCurrentStage", 2);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["cartItems"]);
  },
});

const transition = computed(() => {
  return props.transition;
});

const schema = yup.object({
  delivery_first_name: yup.string().required("First name is required"),
  delivery_last_name: yup.string().required("Last name is required"),
  delivery_phone: yup.string().required("Phone number is required"),
  delivery_email: yup
    .string()
    .email("Email is invalid")
    .required("Email is required"),
  delivery_address1: yup.string().required("Address line 1 is required"),
  delivery_city: yup.string().required("Town/City is required"),
  delivery_zip: yup.string().required("ZIP/Postal code is required"),
  delivery_country: yup.string().required("Country is required"),
  billing_first_name: yup.string().required("First name is required"),
  billing_last_name: yup.string().required("Last name is required"),
  billing_phone: yup.string().required("Phone number is required"),
  billing_email: yup
    .string()
    .email("Email is invalid")
    .required("Email is required"),
  billing_address1: yup.string().required("Address line 1 is required"),
  billing_city: yup.string().required("Town/City is required"),
  billing_zip: yup.string().required("ZIP/Postal code is required"),
  billing_country: yup.string().required("Country is required"),
});

function copyDeliveryAddressToBilling() {
  setFieldValue("billing_first_name", values.delivery_first_name);
  setFieldValue("billing_last_name", values.delivery_last_name);
  setFieldValue("billing_phone", values.delivery_phone);
  setFieldValue("billing_email", values.delivery_email);
  setFieldValue("billing_address1", values.delivery_address1);
  setFieldValue("billing_address2", values.delivery_address2);
  setFieldValue("billing_city", values.delivery_city);
  setFieldValue("billing_zip", values.delivery_zip);
  setFieldValue("billing_country", values.delivery_country);
}

const { handleSubmit, values, setFieldValue, setFieldError, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    delivery_first_name: props.order?.delivery_first_name || "",
    delivery_last_name: props.order?.delivery_last_name || "",
    delivery_phone: props.order?.delivery_phone || "",
    delivery_email: props.order?.delivery_email || "",
    delivery_address1: props.order?.delivery_address1 || "",
    delivery_address2: props.order?.delivery_address2 || "",
    delivery_city: props.order?.delivery_city || "",
    delivery_zip: props.order?.delivery_zip || "",
    delivery_country: props.order?.delivery_country || "",
    billing_first_name: props.order?.billing_first_name || "",
    billing_last_name: props.order?.billing_last_name || "",
    billing_phone: props.order?.billing_phone || "",
    billing_email: props.order?.billing_email || "",
    billing_address1: props.order?.billing_address1 || "",
    billing_address2: props.order?.billing_address2 || "",
    billing_city: props.order?.billing_city || "",
    billing_zip: props.order?.billing_zip || "",
    billing_country: props.order?.billing_country || "",
  },
});

const sharedAddress = ref(true);
watch(sharedAddress, async (value) => {
  if (value) {
    copyDeliveryAddressToBilling();
  }
});

watch(values, async (value) => {
  if (sharedAddress.value) {
    copyDeliveryAddressToBilling();
  }
});

watch(transition, async (_) => {
  if (props.currentStage === 1) {
    try {
      await schema.validate(values, { abortEarly: false });
      console.log("submitted", values);
      mutate(values);
    } catch (err) {
      err.inner.forEach((error) => {
        setFieldError(error.path, error.message);
      });
      emit("setCurrentStage", 1);
    }
  }
});
</script>

<template>
  <form novalidate>
    <div
      class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full"
    >
      <header
        class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
      >
        <h1 class="grow text-xl leading-7 text-gray-700">Delivery Address</h1>
        <div class="flex gap-2" v-show="true">
          <div class="flex flex-col justify-center p-1">
            <input
              v-model="sharedAddress"
              type="checkbox"
              id="billingAddress"
              class="h-4 w-4 shrink-0 rounded-sm border border-zinc-200 text-teal-500 checked:ring-teal-500"
            />
          </div>
          <label
            for="billingAddress"
            class="text-base tracking-tighter leading-6 text-neutral-400"
          >
            Use this address for delivery details
          </label>
        </div>
      </header>
      <hr class="mt-4 h-px border border-zinc-200" />
      <section class="flex flex-col mt-6 bg-white max-md:max-w-full">
        <div
          class="flex gap-5 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label
              for="delivery_first_name"
              class="font-medium text-neutral-600"
              >First name *</label
            >
            <Field
              type="text"
              id="delivery_first_name"
              name="delivery_first_name"
              placeholder="Enter your first name"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.delivery_first_name,
              }"
            />
            <ErrorMessage name="delivery_first_name" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="delivery_last_name" class="font-medium text-neutral-600"
              >Last name *</label
            >
            <Field
              type="text"
              id="delivery_last_name"
              name="delivery_last_name"
              placeholder="Enter your last name"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.delivery_last_name,
              }"
            />
            <ErrorMessage name="delivery_last_name" class="text-red-500" />
          </div>
        </div>
        <div
          class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label for="phoneNumber" class="font-medium text-neutral-600"
              >Phone number *</label
            >
            <Field
              type="tel"
              id="phoneNumber"
              name="delivery_phone"
              placeholder="Enter your phone number"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.delivery_phone,
              }"
            />
            <ErrorMessage name="delivery_phone" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="email" class="font-medium text-neutral-600"
              >Email *</label
            >
            <Field
              type="email"
              id="email"
              name="delivery_email"
              placeholder="Enter your email"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.delivery_email }"
            />
            <ErrorMessage name="delivery_email" class="text-red-500" />
          </div>
        </div>
        <label
          for="addressLine1"
          class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
        >
          Address line 1 *
        </label>
        <Field
          type="text"
          id="addressLine1"
          name="delivery_address1"
          placeholder="Enter your Address line 1"
          class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
          :class="{ 'border-red-500 bg-red-50': errors.delivery_address1 }"
        />
        <ErrorMessage name="delivery_address1" class="text-red-500" />
        <label
          for="addressLine2"
          class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
        >
          Address line 2
        </label>
        <Field
          type="text"
          id="addressLine2"
          name="delivery_address2"
          placeholder="Enter your Address line 2"
          class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
          :class="{ 'border-red-500 bg-red-50': errors.delivery_address2 }"
        />
        <ErrorMessage name="delivery_address2" class="text-red-500" />
        <div
          class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label for="city" class="font-medium text-neutral-600"
              >Town/City *</label
            >
            <Field
              type="text"
              id="city"
              name="delivery_city"
              placeholder="Enter your city"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.delivery_city }"
            />
            <ErrorMessage name="delivery_city" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="postalCode" class="font-medium text-neutral-600">
              ZIP/Postal code *
            </label>
            <Field
              type="text"
              id="postalCode"
              name="delivery_zip"
              placeholder="Enter your code"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.delivery_zip }"
            />
            <ErrorMessage name="delivery_zip" class="text-red-500" />
          </div>
        </div>
        <label
          for="country"
          class="self-start mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600"
        >
          Select Country *
        </label>
        <div
          class="flex justify-center self-start pr-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-neutral-200 text-neutral-400"
          :class="{ 'border-red-500 bg-red-50': errors.delivery_country }"
        >
          <Field
            as="select"
            id="country"
            name="delivery_country"
            class="flex-1 bg-transparent border-none"
            required
          >
            <option value="">Select option</option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.name"
            >
              {{ country.name }}
            </option>
          </Field>
        </div>
        <ErrorMessage name="delivery_country" class="text-red-500" />
      </section>
    </div>

    <div v-show="!sharedAddress">
      <br />
      <br />
    </div>

    <div
      v-show="!sharedAddress"
      class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 max-md:mt-9 max-md:max-w-full"
    >
      <header
        class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
      >
        <h1 class="grow text-xl leading-7 text-gray-700">Billing Address</h1>
        <div class="flex gap-2" v-show="false">
          <div class="flex flex-col justify-center p-1">
            <input
              v-model="sharedAddress"
              type="checkbox"
              id="billingAddress"
              class="h-4 w-4 shrink-0 rounded-sm border border-zinc-200 text-teal-500 checked:ring-teal-500"
            />
          </div>
          <label
            for="billingAddress"
            class="text-base tracking-tighter leading-6 text-neutral-400"
          >
            Use this address for billing details
          </label>
        </div>
      </header>
      <hr class="mt-4 h-px border border-zinc-200" />
      <section class="flex flex-col mt-6 bg-white max-md:max-w-full">
        <div
          class="flex gap-5 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label for="billing_first_name" class="font-medium text-neutral-600"
              >First name *</label
            >
            <Field
              type="text"
              id="billing_first_name"
              name="billing_first_name"
              placeholder="Enter your first name"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.billing_first_name,
              }"
            />
            <ErrorMessage name="billing_first_name" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="billing_last_name" class="font-medium text-neutral-600"
              >Last name *</label
            >
            <Field
              type="text"
              id="billing_last_name"
              name="billing_last_name"
              placeholder="Enter your last name"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.billing_last_name,
              }"
            />
            <ErrorMessage name="billing_last_name" class="text-red-500" />
          </div>
        </div>
        <div
          class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label for="phoneNumber" class="font-medium text-neutral-600"
              >Phone number *</label
            >
            <Field
              type="tel"
              id="phoneNumber"
              name="billing_phone"
              placeholder="Enter your phone number"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{
                'border-red-500 bg-red-50': errors.billing_phone,
              }"
            />
            <ErrorMessage name="billing_phone" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="email" class="font-medium text-neutral-600"
              >Email *</label
            >
            <Field
              type="email"
              id="email"
              name="billing_email"
              placeholder="Enter your email"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.billing_email }"
            />
            <ErrorMessage name="billing_email" class="text-red-500" />
          </div>
        </div>
        <label
          for="addressLine1"
          class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
        >
          Address line 1 *
        </label>
        <Field
          type="text"
          id="addressLine1"
          name="billing_address1"
          placeholder="Enter your Address line 1"
          class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
          :class="{ 'border-red-500 bg-red-50': errors.billing_address1 }"
        />
        <ErrorMessage name="billing_address1" class="text-red-500" />
        <label
          for="addressLine2"
          class="mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600 max-md:max-w-full"
        >
          Address line 2
        </label>
        <Field
          type="text"
          id="addressLine2"
          name="billing_address2"
          placeholder="Enter your Address line 2"
          class="justify-center px-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full"
          :class="{ 'border-red-500 bg-red-50': errors.billing_address2 }"
        />
        <ErrorMessage name="billing_address2" class="text-red-500" />
        <div
          class="flex gap-5 mt-6 text-base tracking-tighter leading-6 max-md:flex-wrap"
        >
          <div class="flex flex-col flex-1">
            <label for="city" class="font-medium text-neutral-600"
              >Town/City *</label
            >
            <Field
              type="text"
              id="city"
              name="billing_city"
              placeholder="Enter your city"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.billing_city }"
            />
            <ErrorMessage name="billing_city" class="text-red-500" />
          </div>
          <div class="flex flex-col flex-1">
            <label for="postalCode" class="font-medium text-neutral-600">
              ZIP/Postal code *
            </label>
            <Field
              type="text"
              id="postalCode"
              name="billing_zip"
              placeholder="Enter your code"
              class="justify-center px-4 py-2 mt-2 bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400"
              :class="{ 'border-red-500 bg-red-50': errors.billing_zip }"
            />
            <ErrorMessage name="billing_zip" class="text-red-500" />
          </div>
        </div>
        <label
          for="country"
          class="self-start mt-6 text-base font-medium tracking-tighter leading-6 text-neutral-600"
        >
          Select Country *
        </label>
        <div
          class="flex justify-center self-start pr-4 py-2 mt-2 text-base tracking-tighter leading-6 bg-white rounded-sm border border-solid border-neutral-200 text-neutral-400"
          :class="{ 'border-red-500 bg-red-50': errors.billing_country }"
        >
          <Field
            as="select"
            id="country"
            name="billing_country"
            class="flex-1 bg-transparent border-none"
            required
          >
            <option value="">Select option</option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.name"
            >
              {{ country.name }}
            </option>
          </Field>
        </div>
        <ErrorMessage name="billing_country" class="text-red-500" />
      </section>
    </div>
  </form>
</template>
