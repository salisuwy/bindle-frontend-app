<script setup>
const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  preserveAspectRatio: { type: String, default: 'none' },
  backgroundColour: { type: String, default: 'transparent' },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  rounded: { type: String, default: '10' },
  colour: { type: String, default: 'currentColor' },
});
</script>
<template>
  <svg
    :class="props.class"
    :style="props.style"
    :width="props.width"
    :height="props.height"
    :preserveAspectRatio="props.preserveAspectRatio"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" :rx="props.rounded" :fill="props.backgroundColour" />
    <path
      d="M12.5996 12.8242L31.8986 31.1763M12.5996 12.8242L31.8986 31.1763"
      :stroke="props.colour"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.543 31.1143L31.9587 12.8858M12.543 31.1143L31.9587 12.8858"
      :stroke="props.colour"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
