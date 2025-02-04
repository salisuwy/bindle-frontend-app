<script setup>
import { computed, ref } from 'vue';
import ChevronIcon from '../components/icons/ChevronIcon.vue';
import { Util as Utils } from '@/components/helpers/Util.js';

const props = defineProps({
  horizontal: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  class: { type: [String, Array, Object], default: {} },
  style: { type: [String, Object], default: {} },
  buttons: { type: Boolean, default: false },
  buttonClass: { type: [String, Array, Object], default: '' },
  buttonStyle: { type: [String, Object], default: '' },
  scrollSpeed: { type: Number, default: 10 },
});

const isDragging = ref(false);
const startPosition = ref(0);
const flexRef = ref(null);
let scrollInterval = null;

const isHorizontal = computed(() => {
  if (props.vertical) {
    return false;
  }
  if (props.horizontal) {
    return true;
  }
  return false;
});

const getStyle = computed(() => {
  let styleObj = { display: 'flex', 'overscroll-behavior': 'none' };
  if (props.draggable) {
    if (!isDragging.value) {
      styleObj['cursor'] = 'grab';
    } else {
      styleObj['cursor'] = 'grabbing';
    }
  }
  if (isHorizontal.value) {
    styleObj['flex-direction'] = 'row';
    styleObj['overflow-x'] = 'auto';
    styleObj['overflow-y'] = 'hidden';
  } else {
    styleObj['flex-direction'] = 'column';
    styleObj['overflow-x'] = 'hidden';
    styleObj['overflow-y'] = 'auto';
  }
  return styleObj;
});

const startDrag = (event) => {
  if (!props.draggable) return;
  event.preventDefault();
  isDragging.value = true;
  if (isHorizontal.value) {
    startPosition.value = event.clientX || event.touches[0].clientX;
  } else {
    startPosition.value = event.clientY || event.touches[0].clientY;
  }
};

const onDrag = (event) => {
  if (!props.draggable) return;
  if (!isDragging.value) return;
  event.preventDefault();
  if (isHorizontal.value) {
    const currentX = event.clientX || event.touches[0].clientX;
    const dx = currentX - startPosition.value;
    flexRef.value.scrollLeft -= dx;
    startPosition.value = currentX;
  } else {
    const currentY = event.clientY || event.touches[0].clientY;
    const dy = currentY - startPosition.value;
    flexRef.value.scrollTop -= dy;
    startPosition.value = currentY;
  }
};

const endDrag = () => {
  if (!props.draggable) return;
  isDragging.value = false;
};

const startScrolling = (direction) => {
  if (scrollInterval !== null) {
    console.warn('already scrolling!');
    return;
  }
  const amount = direction === 'left' ? -props.scrollSpeed : props.scrollSpeed;
  scrollInterval = setInterval(() => {
    if (flexRef !== null) {
      const flex = flexRef.value;
      flex.scrollLeft += amount;
    }
  }, 20);
};

const stopScrolling = () => {
  if (scrollInterval !== null) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
};

const computedButtonClass = computed(() => {
  return Utils.ensureDefault(props.buttonClass, 'cursor-pointer');
});
</script>
<template>
  <div v-if="props.horizontal && props.buttons" class="buttons">
    <div>
      <chevron-icon
        :class="computedButtonClass"
        :style="props.buttonStyle"
        @mousedown="startScrolling('left')"
        @touchstart="startScrolling('left')"
        @mouseup="stopScrolling()"
        @touchend="stopScrolling()"
        left
      />
    </div>
    <div
      ref="flexRef"
      :class="props.class"
      :style="[getStyle, props.style]"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag"
    >
      <slot></slot>
    </div>
    <div>
      <chevron-icon
        :class="computedButtonClass"
        :style="props.buttonStyle"
        style="cursor: pointer"
        @mousedown="startScrolling('right')"
        @touchstart="startScrolling('right')"
        @mouseup="stopScrolling()"
        @touchend="stopScrolling()"
        right
      />
    </div>
  </div>
  <div
    v-else
    ref="flexRef"
    :class="props.class"
    :style="[getStyle, props.style]"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="onDrag"
    @touchmove="onDrag"
    @mouseup="endDrag"
    @touchend="endDrag"
    @mouseleave="endDrag"
  >
    <slot></slot>
  </div>
</template>
<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.buttons > div:nth-child(2) {
  flex-grow: 1;
}
</style>
