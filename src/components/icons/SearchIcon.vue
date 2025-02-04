<script setup>
const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  width: { type: String, default: '24' },
  height: { type: String, default: '24' },
  colour: { type: String, default: 'currentColor' },
});
</script>
<template>
  <svg
    :class="props.class"
    :style="props.style"
    :width="props.width"
    :height="props.height"
    fill="none"
    viewBox="0 0 14 15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-355.000000, -250.000000)" stroke-width="1.5">
        <g transform="translate(356.000000, 251.000000)">
          <circle :stroke="props.colour" cx="5" cy="5" r="5"></circle>
          <line
            x1="8.25746783"
            y1="8.80037914"
            x2="12"
            y2="13"
            :stroke="props.colour"
            stroke-linecap="round"
          ></line>
        </g>
      </g>
    </g>
  </svg>
</template>
