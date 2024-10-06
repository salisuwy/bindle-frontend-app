<script setup>
import { ref, watch, computed, defineProps, defineEmits, onMounted } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { preConfirmPayment, createPaymentIntent } from "@/store/cart-api";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";
import { getAnonIdAndUuid, getOrderMode, STRIPE_PUBLIC_KEY, STRIPE_PUBLIC_KEY_LIVE, STRIPE_PUBLIC_KEY_TEST } from "../../../store/cart-api";

const router = useRouter();
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  transition: String,
  currentStage: Number,
  isTransitioning: Boolean,
});
const emit = defineEmits(["setCurrentStage", "performTransition"]);

const queryClient = useQueryClient();

let stripe = null;
let elements = null;

const transition = computed(() => {
  return props.transition;
});

const order = computed(() => {
  return props.order;
});

const fullName = computed(() => {
  return `${order?.value?.billing_first_name} ${order?.value?.billing_last_name}`;
});

let otherErrors = ref("");

let cardHolderName = ref("");
let cardHolderNameError = ref("");

watch(cardHolderName, (newVal) => {
  if (!newVal?.trim()) {
    cardHolderNameError.value = "Please enter card holder name";
  } else {
    cardHolderNameError.value = "";
  }
});

let cardDetailsError = ref("");

const style = {
  base: {
    iconColor: "#000",
    color: "#000",
    fontWeight: "400",
    fontFamily: "Outfit, system-ui, sans-serif",
    fontSize: "14px",
    fontSmoothing: "antialiased",
    ":-webkit-autofill": {
      color: "#fce883",
    },
    "::placeholder": {
      color: "#9ca3af",
    },
  },
  invalid: {
    iconColor: "#FFC7EE",
    color: "red",
  },
};

const performTransition = () => {
  emit("performTransition");
};

async function handlePaymentPreConfirm(paymentIntent) {
  try {
    await preConfirmPayment({ payment_intent: paymentIntent });
    return true;
  } catch (error) {
    console.log("Error encountered while pre-confirming payment", error);
    return false;
  }
}

watch(transition, async (_) => {
  if (props.currentStage === 2) {
    console.log("starting payment");

    otherErrors.value = "";   // reset the other error

    if (!cardHolderName.value) {
      emit("setCurrentStage", 2);
      cardHolderNameError.value = "Please enter card holder name";
      return;
    }

    if (cardDetailsError.value) {
      emit("setCurrentStage", 2);
      return;
    }

    await makePayment();

    console.log("payment done");
  }
});


onMounted(async () => {
  console.log("mounted");
    
  const ORDER_MODE = await getOrderMode();
  const SELECTED_STRIPE_KEY = ORDER_MODE === 'test' ? STRIPE_PUBLIC_KEY_TEST : STRIPE_PUBLIC_KEY_LIVE; 

  const TEN_CHARS = (SELECTED_STRIPE_KEY ? String(SELECTED_STRIPE_KEY) : '').substring(0, 15);
  console.log(`>>> STRIPE - mode: ${ORDER_MODE} | pk: ${TEN_CHARS}`);

  stripe = await loadStripe(SELECTED_STRIPE_KEY);

  elements = stripe.elements();
  const element = elements.create("card", {
    hidePostalCode: true,
    style,
    fields: {
      billingDetails: {
        name: "never",
        email: "never",
        phone: "never",
        address: "never",
      },
    },
  });

  element.on("change", function (event) {
    var errorEl = document.getElementById("card-errors");
    var cardEl = document.getElementById("payment-element");
    if (event.error) {
      cardDetailsError.value = event.error.message;
      cardEl.classList.add("payment-element-error");
      errorEl.textContent = event.error.message;
    } else {
      errorEl.textContent = "";
      cardDetailsError.value = "";
      cardEl.classList.remove("payment-element-error");
    }
  });

  element.mount("#payment-element");
});

async function makePayment() {
  const billingDetails = {
    name: cardHolderName.value,
    email: order.value.billing_email,
    address: {
      city: order.value.billing_city,
      line1: order.value.billing_address1,
      state: order.value.billing_city,
      postal_code: order.value.billing_zip,
    },
  };

  const cardElement = elements.getElement("card");

  try {
    const response = await createPaymentIntent({
      order: props.order,
    });

    const secret = response?.data?.client_secret;

    const { paymentMethod, error: paymentMethodError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails,
      });

    if (paymentMethodError) {
      const errMsg = paymentMethodError?.message || "An error is encountered while validating card information";
      throw new Error(errMsg);
    }

    const { paymentIntent, error: paymentIntentError } =
      await stripe.confirmCardPayment(secret, {
        payment_method: paymentMethod.id,
      });

    if (paymentIntentError) {
      if (
        paymentIntentError.type === "card_error" ||
        paymentIntentError.type === "validation_error"
      ) {
        const errMsg = paymentIntentError?.message || "An error is encountered while making payment";
        throw new Error(errMsg);
      } else {
        throw new Error(
          "An unexpected error is encountered while making payment"
        );
      }
    } else {
      console.log("success payment", paymentIntent);
      const payConfirm = await handlePaymentPreConfirm(paymentIntent);
      if (!payConfirm) {
        throw new Error("An error is encountered while confirming payment");
      }

      const anonUuid = { ...getAnonIdAndUuid() };
      console.log("anonUuid", anonUuid);

      console.log("next page is: /invoice");
      localStorage.removeItem("uuid");
      queryClient.setQueryData(["cartItems"], {});
      queryClient.invalidateQueries(["cartItems"]);
      router.push(`/invoice/${anonUuid.anonid}/${anonUuid.uuid}`);
    }
  } catch (error) {
    const errMsg = error?.message || "An error is encountered while processing payment. Please try again";
    console.log("[Catch] error", errMsg);
    otherErrors.value = errMsg
    emit("setCurrentStage", 2);
  }
}
</script>

<template>
  <div
    class="flex flex-col px-6 py-8 w-full bg-white rounded-md border border-solid border-zinc-200 max-md:px-5 mt-12 max-md:mt-9 max-md:max-w-full mb-12"
  >
    <header
      class="flex flex-wrap gap-2 justify-between items-center self-stretch pt-2.5 pb-0.5"
    >
      <h1 class="grow text-xl leading-7 text-gray-700">Payment Details</h1>
    </header>
    <hr class="my-4 h-px border border-zinc-200" />

    <div
        v-if="otherErrors"
        class="justify-end items-start px-6 pt-5 pb-6 text-base font-light tracking-normal leading-4 text-red-500 bg-red-50 rounded-md max-md:px-5 max-md:max-w-full"
      >
        {{ otherErrors }}
      </div>

    <div
      class="mt-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
    >
      <div
        class="mb-2 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
      >
        <label for="cardDetails">Card details *</label>
      </div>
      <div id="payment-element" class="payment-element"></div>
      <span id="card-errors" class="text-red-500 text-sm mt-1 hidden"></span>
      <span v-if="cardDetailsError" class="text-red-500 text-sm mt-1">{{
        cardDetailsError
      }}</span>

      <div
        class="mt-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
      >
        <label for="cardHolderName">Card holder name *</label>
      </div>
      <input
        id="cardHolderName"
        type="text"
        placeholder="Enter your card holder name"
        class="justify-center px-4 py-2 mt-2 tracking-tighter bg-white rounded-sm border border-solid border-zinc-200 text-neutral-400 max-md:max-w-full w-full"
        :class="{ 'border-red-500': cardHolderNameError }"
        v-model="cardHolderName"
      />
      <span v-if="cardHolderNameError" class="text-red-500 text-sm mt-1">{{
        cardHolderNameError
      }}</span>
    </div>

    <div class="flex justify-start items-center">
      <button
        class="flex justify-center items-center px-3.5 py-2.5 mt-8 text-sm font-semibold text-white bg-teal-500 rounded-sm max-md:px-5 w-full md:w-1/3"
        @click="performTransition"
        :disabled="props.isTransitioning"
      >
        <SpinnerIcon
          v-if="props.isTransitioning"
          class="w-5 h-5 mr-2 animate-spin"
        />
        <span v-if="!props.isTransitioning"> Place Order </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-element {
  border: 1px solid #d1d1d1;
  padding: 10px;
  border-radius: 3px;
}

.payment-element-error {
  border: 1px solid #ff0000;
}
</style>
