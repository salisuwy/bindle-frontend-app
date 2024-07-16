<script setup>
import {computed} from "vue";
import {Util} from "@/components/helpers/Util.js";

const props = defineProps({
  class: { type:[String,Array,Object], default: {} },
  style: { type:[String, Object], default:{} },
})

const classes = computed(()=> Util.ensureDefault(props.class, 'carousel-item'));
</script>
<template>
  <div :class="classes" :style="props.style">
    <slot></slot>
  </div>
</template>
<style scoped>
.carousel-item {
  user-select: none;
}
</style>