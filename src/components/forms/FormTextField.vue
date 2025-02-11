<script setup lang="ts">
import { useAttrs, computed } from 'vue';

interface Props {
  id: string;
  type?: string;
  label: string;
  placeholder: string;
  modelValue?: string;
  errorMessage?: string;
  disabled?: boolean;
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
    <label :for="id" class="font-medium text-neutral-600">{{ label }}</label>
    <input
      v-model="innerModel"
      v-bind="attrs"
      @blur="$emit('blur')"
      :disabled="disabled"
      :type="type || 'text'"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      class="justify-center px-4 py-2 mt-2 rounded-sm border border-solid text-neutral-400 bg-white focus-within:border-zinc-500 placeholder-neutral-300"
      :class="{
        'border-zinc-200': errorMessage === undefined,
        'border-red-500': errorMessage !== undefined,
      }"
    />
    <span :name="id" v-if="errorMessage !== undefined" class="text-red-500">{{
      errorMessage
    }}</span>
  </div>
</template>

<style scoped></style>
