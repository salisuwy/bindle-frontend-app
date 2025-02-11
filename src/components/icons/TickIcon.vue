<script setup>
const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  preserveAspectRatio: { type: String, default: 'none' },
  colour: { type: String, default: 'currentColor' },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  backgroundColour: { type: String, default: 'none' },
});
</script>
<template>
  <svg
    :width="props.width"
    :height="props.height"
    :fill="props.backgroundColour"
    :class="props.class"
    :style="props.style"
    :preserveAspectRatio="props.preserveAspectRatio"
    viewBox="0 0 18 15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 6.94118L7.35294 12.7059L16 2"
      :stroke="props.colour"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
