<script setup>
import { computed, onBeforeMount } from 'vue';
import { consoleLog } from '@/components/helpers/tsUtils';

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  colour: { type: String, default: 'currentColor' },
  left: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
  up: { type: Boolean, default: false },
  down: { type: Boolean, default: false },
});

onBeforeMount(() => {
  if (!props.left && !props.right && !props.up && !props.down) {
    consoleLog("You should specify 'up', 'down', 'left' or 'right'");
  }
});

const getPathData = computed(() => {
  if (props.up) {
    return 'M6 15L12 9L18 15';
  } else if (props.down) {
    return 'M6 9L12 15L18 9';
  } else if (props.left) {
    return 'M15 6L9 12L15 18';
  } else {
    return 'M9 6L15 12L9 18';
  }
});
</script>
<template>
  <svg
    :class="props.class"
    :style="props.style"
    :width="props.width"
    :height="props.height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :d="getPathData"
      :stroke="props.colour"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
