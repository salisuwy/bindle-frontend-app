<script setup>
import { Util } from "@/components/helpers/Util.js";
import { computed, onMounted, ref } from "vue";
import { useBindleApiStore } from "@/store/bindle-api.js";
import InfoIcon from "@/components/icons/InfoIcon.vue";
import TickIcon from "@/components/icons/TickIcon.vue";
import { trackEvent } from "../../components/helpers/analytics";

const inputRef = ref();
const emailValid = ref(false);
const makingRequest = ref(false);
const subscribeResponse = ref(null);

onMounted(() => {
  inputContentChanged();
});

const bindleApiStore = useBindleApiStore();

const inputContentChanged = () => {
  emailValid.value =
    inputRef.value &&
    inputRef.value.value.length > 0 &&
    Util.validateEmail(inputRef.value.value);
};
const subscribe = () => {
  if (inputRef.value) {
    trackEvent("contact", {
      contact_method: "email",
      message_subject: "Subscribing to Updates",
    });
    trackEvent("lead", {
      lead_type: "subscription",
      value: 0,
    });

    makingRequest.value = true;
    bindleApiStore.addSubscriber(inputRef.value.value).then((response) => {
      makingRequest.value = false;
      subscribeResponse.value = response;
    });
  }
};

const submitButtonDisabled = computed(() => {
  if (!emailValid.value) return true;
  if (makingRequest.value) return true;
  if (subscribeResponse.value) return true;
  return false;
});
</script>
<template>
  <div class="bg-theme-teal px-4 pt-10 pb-16">
    <h5 class="text-theme-white text-xs">
      <span class="hidden sm:inline">JOIN </span>NEWSLETTER
    </h5>
    <h2 class="text-theme-white mt-6 mb-12 text-4xl">
      Stay up to date with all our latest products and deals
    </h2>
    <div
      v-if="subscribeResponse === null"
      class="w-full flex flex-col items-center justify-center sm:flex-row gap-4"
    >
      <input
        ref="inputRef"
        type="email"
        :class="
          'px-6 h-11 rounded-sm' +
          (emailValid ? ' text-theme-black' : ' text-gray-600')
        "
        @keyup="inputContentChanged"
        autocomplete="off"
      />
      <button
        :class="
          'bg-theme-darkblue rounded-sm' +
          (makingRequest ? ' working-spinner' : '')
        "
        :disabled="submitButtonDisabled"
        @click="subscribe"
      >
        Subscribe
      </button>
    </div>
    <div v-else-if="subscribeResponse === true" class="text-green-800">
      <tick-icon
        class="text-green-800 inline mr-1"
        width="12"
        height="12"
        style="position: relative; top: -2px"
      />
      Your email has been added!
    </div>
    <div v-else-if="subscribeResponse === false" class="text-red-800">
      A problem was encountered processing your request.
    </div>
    <div v-else class="text-gray-800">
      <info-icon
        class="inline mr-1"
        width="16"
        height="16"
        style="position: relative; top: -2px"
      />{{ subscribeResponse }}
    </div>
  </div>
</template>
