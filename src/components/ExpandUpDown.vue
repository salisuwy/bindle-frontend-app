<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { Util } from '@/components/helpers/Util.js';
const isOpen = ref(false);

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  buttonClass: { type: [String, Array, Object], default: null },
  hideButtonWhenOpen: { type: Boolean, default: false },
});

const toggleUpDown = () => {
  isOpen.value = !isOpen.value;
};
const hideWhenOpen = computed(() => {
  return props.hideButtonWhenOpen && isOpen.value;
});
</script>
<template>
  <div>
    <button
      @click="toggleUpDown"
      :class="props.buttonClass"
      :style="hideWhenOpen ? 'display:none' : ''"
    >
      <slot name="button"> Toggle </slot>
    </button>
  </div>
  <div :class="'slide-up-down' + (isOpen ? ' open' : '')">
    <div class="slide-up-down-content" :class="props.class" :style="props.style">
      <slot> Default slot content (replace with something useful!) </slot>
    </div>
  </div>
</template>
<style scoped>
.slide-up-down {
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.5s ease;
  height: 0;
}
.slide-up-down.open {
  transform: scaleY(1);
  height: auto;
}
</style>
