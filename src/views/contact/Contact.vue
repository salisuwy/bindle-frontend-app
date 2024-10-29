<script setup>
import Layout from "@/views/shared/Layout.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import BenefitsBanner from "@/views/index/BenefitsBanner.vue";
import { onMounted, ref } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { saveMessage } from "@/store/cart-api";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";
import { trackEvent } from "../../components/helpers/analytics";

const showForm = ref(true);
const isProcessing = ref(false);

const schema = yup.object({
  name: yup.string().required("Name is required"),
  phone_number: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .email("Email is invalid")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format"
    ),
  message: yup.string().required("Message is required"),
});

const { handleSubmit, values, setFieldValue, setFieldError, errors } = useForm({
  validationSchema: schema,
});

async function sendMessage() {
  trackEvent("contact", {
    contact_method: "email",
    message_subject: "Support Inquiry",
  });

  isProcessing.value = true;
  try {
    await schema.validate(values, { abortEarly: false });
    await saveMessage(values);
    showForm.value = false;
    console.log("form submitted");
  } catch (err) {
    err.inner.forEach((error) => {
      setFieldError(error.path, error.message);
    });
  }
  isProcessing.value = false;
}
</script>
<template>
  <layout>
    <div class="bg-theme-white relative">
      <div class="bg-theme-verylightteal py-10">
        <div class="mx-auto max-w-8xl w-full px-6 text-left mb-8">
          <breadcrumbs
            class="text-left w-full col-start-1 md:col-span-4 mb-4"
          />
          <h1 class="mt-12">Contact Us</h1>
          <div class="my-6 text-xl">
            If you have any questions, be sure to let us know!
          </div>
        </div>
      </div>
      <div class="bg-theme-white py-10 px-6">
        <div
          class="max-w-8xl mx-auto flex flex-col md:flex-row w-full gap-6 pt-10 pb-20"
        >
          <div class="w-full flex flex-col">
            <div class="w-full px-6 pt-6 pb-20 grow text-left relative">
              <h1 class="text-4xl mb-12">Get in touch with us.</h1>

              <div class="flex justify-start items-center gap-4 my-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <h2 class="text-gray-600 font-medium">
                  <a
                    class="text-gray-600 font-medium"
                    href="mailto:support@bindle.co.uk"
                    >support@bindle.co.uk</a
                  >
                </h2>
              </div>

              <div class="flex justify-start items-center gap-4 my-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <h2 class="text-gray-600 font-medium">
                  Main Office address: 110 Curtain Road, EC2A 3AH, London
                </h2>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col items-start">
            <div class="min-h-[100px] flex items-center gap-4" v-if="!showForm">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 h-16 w-16 text-theme-teal"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </span>
              <div>
                <h2>Thank you for contacting us</h2>
                <p>We will respond as soon as possible</p>
              </div>
            </div>

            <div
              class="w-full bg-theme-navyblue rounded-3xl text-white px-8 pt-6 pb-20 grow text-left relative"
              v-if="showForm"
            >
              <h2 class="text-white text-3xl mb-4">Send Us a Message</h2>
              <form @submit.prevent="sendMessage" class="space-y-6" novalidate>
                <!-- Name Field -->
                <div>
                  <label for="name" class="block text-xl font-medium text-white"
                    >Name</label
                  >
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-xl text-gray-700"
                    :class="{
                      'border-red-500 bg-red-100': errors.name,
                    }"
                  />
                  <ErrorMessage name="name" class="text-red-500 mx-1 mt-1" />
                </div>

                <!-- Email Field -->
                <div>
                  <label
                    for="email"
                    class="block text-xl font-medium text-white"
                    >Email</label
                  >
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-xl text-gray-700"
                    :class="{
                      'border-red-500 bg-red-100': errors.email,
                    }"
                  />
                  <ErrorMessage name="email" class="text-red-500 mx-1 mt-1" />
                </div>

                <!-- Phone Number Field -->
                <div>
                  <label
                    for="phone_number"
                    class="block text-xl font-medium text-white"
                    >Phone Number</label
                  >
                  <Field
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-xl text-gray-700"
                    :class="{
                      'border-red-500 bg-red-100': errors.phone_number,
                    }"
                  />
                  <ErrorMessage
                    name="phone_number"
                    class="text-red-500 mx-1 mt-1"
                  />
                </div>

                <!-- Message Field -->
                <div>
                  <label
                    for="message"
                    class="block text-xl font-medium text-white"
                    >Message</label
                  >
                  <Field
                    as="textarea"
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Enter your message"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-xl text-gray-700"
                    :class="{
                      'border-red-500 bg-red-100': errors.message,
                    }"
                  />
                  <ErrorMessage name="message" class="text-red-500 mx-1 mt-1" />
                </div>

                <!-- Submit Button -->
                <div class="">
                  <button
                    type="submit"
                    class="w-full bg-theme-teal text-white py-2 px-4 rounded-md shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:bg-theme-teal focus:ring-offset-2 text-xl flex justify-center items-center"
                    :disabled="isProcessing"
                  >
                    <span v-show="isProcessing"
                      ><SpinnerIcon class="w-5 h-5 text-white" />
                    </span>
                    <span v-show="!isProcessing">Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <benefits-banner />
      </div>
    </div>
  </layout>
</template>
