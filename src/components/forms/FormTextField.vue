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
  loading?: boolean;
}
const props = defineProps<Props>();

const attrs: any = useAttrs();

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
    <label :for="id" class="font-medium text-neutral-600 text-left">{{ label }}</label>
    <div v-if="loading" class="mt-2 h-[2.625rem] bg-gray-200 rounded-lg animate-pulse w-full"></div>
    <template v-else>
      <input
        v-model="innerModel"
        v-bind="attrs"
        @blur="$emit('blur')"
        :disabled="disabled"
        :type="type || 'text'"
        :id="id"
        :name="id"
        :placeholder="placeholder"
        class="justify-center px-4 py-2 mt-2 rounded-sm border border-solid text-neutral-400 bg-white focus-within:border-teal-500 placeholder-neutral-300"
        :class="{
          'border-zinc-200': errorMessage === undefined,
          'border-red-500': errorMessage !== undefined,
        }"
      />
      <span :name="id" v-if="errorMessage !== undefined" class="text-red-500">{{
        errorMessage
      }}</span>
    </template>
  </div>
</template>

<style scoped></style>
