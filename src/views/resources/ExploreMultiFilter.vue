<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';

import Accordion from '@/components/Accordion.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';

import type { FilterOption } from '@/composables/useResourceFilters';

interface Props {
  title: string;
  name: string;
  open?: boolean;
  options?: FilterOption[];
  modelValue?: string[];
  initialised?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value?: string[]];
  'update:open': [value: boolean];
}>();

const innerModel = computed({
  get: () => props.modelValue,
  set: (vals?: string[]) => emit('update:modelValue', vals),
});

const isOpen = ref(!!props.open);
watch(
  () => props.open,
  () => (isOpen.value = !!props.open)
);
watch(isOpen, () => emit('update:open', isOpen.value));

const openIfSelected = () => {
  if (!props.initialised) return;
  if (props.modelValue === undefined || props.modelValue.length == 0) {
    isOpen.value = false;
  } else if (props.modelValue.length > 0) {
    isOpen.value = true;
  }
};
onMounted(openIfSelected);
watch([() => props.modelValue, () => props.initialised], () => {
  openIfSelected();
});
</script>

<template>
  <accordion
    v-model:open="isOpen"
    content-class="w-full filter-content flex flex-col"
    title-class="md:text-sm lg:text-base cursor-pointer linklike"
    indicator-class="float-right"
  >
    <template #title
      ><h3 class="inline-block">{{ title }}</h3></template
    >
    <template #indicator>
      <chevron-icon down class="inline-block" />
    </template>
    <hr class="hidden md:block w-full my-4" />
    <label
      v-for="option in options"
      :key="option.slug"
      :for="`filter-${name}-` + option.slug"
      class="bindle-checkbox cursor-pointer mr-auto"
    >
      <input
        v-model="innerModel"
        :id="`filter-${name}-` + option.slug"
        type="checkbox"
        :value="option.slug"
      />
      {{ option.name }}
    </label>
  </accordion>
</template>

<style scoped>
:deep(.filter-content) {
  position: relative;
  top: -8px;
}
</style>
