<script setup lang="ts">
import { ref } from 'vue';

import Layout from '@/views/shared/Layout.vue';
import AddressForm from '@/components/forms/AddressForm.vue';

import { EMPTY_ADDRESS, type Address } from '@/composables/useAddressForm';
import { useValidatedObject } from '@/composables/useValidatedObject';

const deliveryAddress = ref<Address>({ ...EMPTY_ADDRESS });
const { isValid, handleUpdated } = useValidatedObject<Address>(deliveryAddress);

const showErrors = ref(false);

const handleSetAddress = () => {
  deliveryAddress.value = {
    first_name: 'Mr',
    last_name: 'Fake',
    email: 'fake@fake.com',
    phone: '123456',
    address1: '123 Fake Street',
    address2: undefined,
    city: 'FakeTown',
    zip: 'FK1 FAK',
    country: 'Finland',
  };
};

const handleClearAddress = () => {
  deliveryAddress.value = { ...EMPTY_ADDRESS };
};

const disable = ref(false);
</script>

<template>
  <Layout>
    <div class="bg-theme-white py-10 relative">
      <div class="mx-auto max-w-8xl w-full px-6 text-left mb-16">
        <div id="left-panel" class="flex gap-5 max-md:flex-col max-md:gap-0">
          <section class="flex flex-col w-[68%] max-md:ml-0 max-md:w-full order-2 md:order-1">
            <AddressForm
              id="delivery_address"
              title="Delivery Address"
              :address="deliveryAddress"
              :showAllErrors="showErrors"
              :disabled="disable"
              @updated="handleUpdated"
            />
          </section>
          <aside
            class="md:sticky md:top-0 flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full h-fit order-1 md:order-2"
          >
            <div class="placeholder flex flex-col gap-4">
              <button @click="showErrors = !showErrors">Show Errors</button>
              <button @click="handleSetAddress">Set Address</button>
              <button @click="handleClearAddress">Clear Address</button>
              <button @click="disable = !disable">Disable</button>
              <p :class="{ 'text-red-500': !isValid, 'text-green-500': isValid }">
                {{ deliveryAddress }}
              </p>
              <p>{{ isValid }}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.placeholder {
  outline: 1px dashed grey;
  border-radius: 0.5rem;
  width: 100%;
  height: 100%;
  min-height: 20rem;
}
</style>
