<script setup>
import { ref, watch, computed, defineProps, defineEmits, onMounted } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  setOrderAddress,
  setUuid,
  createPaymentIntent,
} from "@/store/cart-api";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";

const router = useRouter();
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


let cardHolderName = ref("");
let cardHolderNameError = ref("")

watch(cardHolderName, (newVal) => {
  if(!newVal?.trim()) {
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


watch(transition, async (_) => {
  if (props.currentStage === 2) {
    console.log("starting payment");
    if(!cardHolderName.value) {
      emit("setCurrentStage", 2);
      cardHolderNameError.value = "Please enter card holder name";
      return;
    }

    if(cardDetailsError.value) {
      emit("setCurrentStage", 2);
      return;
    }

    await makePayment();

    console.log("payment done");
  }
});

onMounted(async () => {
  console.log("mounted");

  stripe = await loadStripe(
    "pk_test_51LlArcBasD2xizKYlH8SLE274JDiDfn8OJYOi5yoPWQ1sypLol1AN0UbqsIYCG9HPt2vu9fx9TGP3PltbQrgXfID008qdlrto0"
  );

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

    const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails,
    });

    if (paymentMethodError) {
      throw new Error("Error encountered while validating card information");
    }

    const { paymentIntent, error: paymentIntentError } = await stripe.confirmCardPayment(secret, {
      payment_method: paymentMethod.id,
    });

    if (paymentIntentError) {
      if (paymentIntentError.type === "card_error" || paymentIntentError.type === "validation_error") {
        throw new Error("An error is encountered while making payment");
      } else {
        throw new Error(
          "An unexpected error is encountered while making payment"
        );
      }
    } else {
      console.log("success payment", paymentIntent);
      console.log("next page is: /invoice/", localStorage.getItem("uuid"));
      localStorage.removeItem("uuid");
      queryClient.setQueryData(["cartItems"], {});
      queryClient.invalidateQueries(["cartItems"]);
      // queryClient.removeQueries(["cartItems"]);
      router.push(`/invoice/${order.value?.uuid}`);
      //emit("setCurrentStage", 4);
    }
  } catch (error) {
    console.log("[Catch] error", error);
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
    <hr class="mt-4 h-px border border-zinc-200" />

    <div
      class="mt-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
    >
      <div
        class="mb-6 font-medium tracking-tighter text-neutral-600 max-md:max-w-full"
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
