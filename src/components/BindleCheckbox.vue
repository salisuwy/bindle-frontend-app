<script setup lang="ts">
interface Props {
  disabled?: boolean;
  modelValue: boolean;
}
defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<template>
  <label
    class="text-base tracking-tighter leading-6 text-neutral-400 bindle-checkbox cursor-pointer mr-4"
  >
    <input
      type="checkbox"
      class="mr-1"
      :checked="modelValue"
      @change="$emit('update:modelValue', !modelValue)"
      :disabled="disabled"
    />
    <slot></slot>
  </label>
</template>

<style scoped></style>
