<script setup lang="ts">
import { useAttrs, computed } from 'vue';
import { countries } from '@/components/helpers/countries';

interface Props {
  id: string;
  type?: string;
  label: string;
  placeholder: string;
  modelValue?: string;
  errorMessage?: string;
}
const props = defineProps<Props>();

const attrs = useAttrs();

const emit = defineEmits<{
  'update:modelValue': [value?: string];
  blur: [value: void];
}>();

const innerModel = computed({
  get: () => props.modelValue,
  set: (value?: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="flex flex-col flex-1">
    <label
      :for="id"
      class="self-start text-base font-medium tracking-tighter leading-6 text-neutral-600"
    >
      {{ label }}
    </label>
    <div
      class="w-full flex justify-center self-start pr-4 py-2 mt-2 text-base tracking-tighter leading-6 rounded-sm border border-solid bg-white focus-within:border-zinc-500"
      :class="{
        'border-zinc-200': errorMessage === undefined,
        'border-red-500': errorMessage !== undefined,
        'text-neutral-400': modelValue.length > 0,
        'text-neutral-300': modelValue === undefined || modelValue.length == 0,
      }"
    >
      <select
        v-model="innerModel"
        v-bind="attrs"
        @change="$emit('blur')"
        :id="id"
        :name="id"
        class="flex-1 bg-transparent border-none focus:outline-none"
        required
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="country in countries" :key="country.code" :value="country.name">
          {{ country.name }}
        </option>
      </select>
    </div>
    <span :name="id" v-if="errorMessage !== undefined" class="text-red-500">{{
      errorMessage
    }}</span>
  </div>
</template>

<style scoped></style>
