<script setup>
const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  preserveAspectRatio: { type: String, default: 'none' },
  colour: { type: String, default: 'currentColor' },
  barColour: { type: String, default: 'black' },
  barOpacity: { type: String, default: '1.0' },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  backgroundColour: { type: String, default: null },
  rounded: { type: String, default: '10' },
  strokeWidth: { type: String, default: '5' },
});
</script>
<template>
  <svg
    :class="props.class"
    :style="props.style"
    :width="props.width"
    :height="props.height"
    :preserveAspectRatio="props.preserveAspectRatio"
    fill="none"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      v-if="props.backgroundColour"
      width="44"
      height="44"
      :rx="props.rounded"
      :fill="props.backgroundColour"
    />
    <path
      d="M6 8H38"
      :stroke="props.barColour"
      :stroke-opacity="props.barOpacity"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 22H38"
      :stroke="props.barColour"
      :stroke-opacity="props.barOpacity"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 36H38"
      :stroke="props.barColour"
      :stroke-opacity="props.barOpacity"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
