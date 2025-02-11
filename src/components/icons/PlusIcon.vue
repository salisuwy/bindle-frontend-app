<script setup>
const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  colour: { type: String, default: 'currentColor' },
  backgroundColour: { type: String, default: 'none' },
});
</script>
<template>
  <svg
    :class="props.class"
    :style="props.style"
    :width="props.width"
    :height="props.height"
    viewBox="0 0 24 24"
    :fill="props.backgroundColour"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.9883 21.999V1.99902"
      stroke-width="3.33333"
      stroke-linecap="round"
      :stroke="props.colour"
    />
    <path
      d="M1.98828 11.999L21.9883 11.999"
      stroke-width="3.33333"
      stroke-linecap="round"
      :stroke="props.colour"
    />
  </svg>
</template>
