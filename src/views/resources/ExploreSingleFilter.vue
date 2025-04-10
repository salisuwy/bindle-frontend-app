<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue';

import Accordion from '@/components/Accordion.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';

import type { FilterOption } from '@/composables/useResourceFilters';

interface Props {
  title: string;
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
  get: () => props.modelValue && props.modelValue[0],
  set: (val?: string) => {
    console.log('innerModel.set', val);
    emit('update:modelValue', val ? [val] : []);
  },
});

const isOpen = ref(!!props.open);
watch(
  () => props.open,
  () => (isOpen.value = !!props.open)
);
watch(isOpen, () => emit('update:open', isOpen.value));
watch(
  () => props.initialised,
  async () => {
    if (props.initialised && props.modelValue && props.modelValue.length > 0) {
      await nextTick();
      isOpen.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <accordion
    v-model:open="isOpen"
    content-class="filter-content w-full flex flex-col"
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

    <div class="radio-links">
      <div>
        <input v-model="innerModel" id="filter-subject-all" type="radio" :value="undefined" />
        <label for="filter-subject-all" class="cursor-pointer mr-auto">All</label>
      </div>
      <div v-for="option in options || []" :key="option.id">
        <input
          v-model="innerModel"
          type="radio"
          name="subject"
          :value="option.slug"
          :id="'filter-subject-' + option.slug"
        />
        <label :for="'filter-subject-' + option.slug" class="cursor-pointer mr-auto">{{
          option.name
        }}</label>
      </div>
    </div>
  </accordion>
</template>

<style scoped>
:deep(.filter-content) {
  position: relative;
  top: -8px;
}
</style>
