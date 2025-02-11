<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
  open: { type: Boolean, default: false },
  width: { type: String, default: '600px' },
  backgroundColour: { type: String, default: 'white' },
  textColour: { type: String, default: null },
  openClass: { type: [String, Array, Object], default: null },
  closeClass: { type: [String, Array, Object], default: 'transition-modal-close-button' },
  noOpenButton: { type: Boolean, default: false },
  noCloseButton: { type: Boolean, default: false },
  closeButtonColour: { type: String, default: '#1B3E3E' },
  overlay: { type: Boolean, default: true },
  overlayClickCloses: { type: Boolean, default: true },
  closeButtonStyle: { type: [String, Object], default: null },
  left: { type: Boolean, default: null },
  right: { type: Boolean, default: null },
  up: { type: Boolean, default: null },
  down: { type: Boolean, default: null },
  trigger: { type: Boolean, default: false },
});

onMounted(() => {
  let directionCount = 0;
  if (props.left !== null) directionCount++;
  if (props.right !== null) directionCount++;
  if (props.up !== null) directionCount++;
  if (props.down !== null) directionCount++;
  if (directionCount > 1) {
    throw 'SlideIn : please provide a single direction only';
  }
  if (props.trigger) {
    //console.log('trigger!')
    open.value = true;
  }
});

const open = ref(props.open); /* the desired state */
const state = ref(props.open ? 'open' : 'closed'); /* the actual state */

const direction = computed(() => {
  if (props.left) {
    return 'left';
  } else if (props.up) {
    return 'up';
  } else if (props.down) {
    return 'down';
  } else {
    return 'right'; /* the default */
  }
});

//const emit = defineEmits(['opened','closed']);

const transitionBeforeOpen = () => {
  if (props.overlay) {
    document.body.classList.add('transition-modal-open');
  }
  state.value = 'opening';
};
const transitionAfterOpen = () => {
  state.value = 'open';
  //emit('opened');
};
const transitionBeforeClose = () => {
  if (props.overlay) {
    document
      .getElementsByClassName('transition-modal-overlay')[0]
      .classList.add('transition-modal-overlay-out');
  }
  state.value = 'closing';
};
const transitionAfterClose = () => {
  if (props.overlay) {
    document.body.classList.remove('transition-modal-open');
    document
      .getElementsByClassName('transition-modal-overlay')[0]
      .classList.remove('transition-modal-overlay-out');
  }
  state.value = 'closed';
  //emit('closed');
};

const getModalStyles = () => {
  const styles = ['width:' + props.width, 'max-width:100%'];
  if (props.backgroundColour !== null) {
    styles.push('background-color:' + props.backgroundColour);
  }
  if (props.textColour !== null) {
    styles.push('color:' + props.backgroundColour);
  }
  if (props.style !== null) {
    if (typeof props.style === 'string') {
      styles.push(props.style);
    } else if (typeof props.style === 'object') {
      styles.push(...props.style);
    }
  }
  return styles.join(';');
};

const overlayClicked = () => {
  if (props.overlayClickCloses) {
    open.value = false;
  }
};

const triggerOpen = () => {
  open.value = true;
};

const triggerClose = () => {
  open.value = false;
};
const isOpen = () => {
  return state.value === 'open';
};

defineExpose({ triggerOpen, triggerClose, isOpen });
</script>
<template>
  <div>
    <div
      v-if="!props.trigger && !props.noOpenButton"
      @click="open = true"
      :class="['inline-block', props.openClass]"
    >
      <slot name="open-button">
        <button>Open Slide-in</button>
      </slot>
    </div>
    <!--    <teleport to="#app"> -->
    <div v-if="props.overlay" class="transition-modal-overlay" @click="overlayClicked()"></div>
    <transition
      :name="'slide-in-' + direction"
      @before-enter="transitionBeforeOpen()"
      @after-enter="transitionAfterOpen()"
      @before-leave="transitionBeforeClose()"
      @after-leave="transitionAfterClose()"
    >
      <div
        v-if="open"
        :class="['transition-modal-' + direction, props.class]"
        :style="getModalStyles()"
      >
        <div
          class="transition-modal-close-button"
          @click="open = false"
          :style="props.closeButtonStyle"
          v-if="!props.noCloseButton"
        >
          <slot name="close">
            <svg
              width="26"
              height="23"
              viewBox="0 0 26 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.59961 1.82422L21.8986 20.1763M2.59961 1.82422L21.8986 20.1763"
                :stroke="props.closeButtonColour"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.54297 20.1143L21.9587 1.88577M2.54297 20.1143L21.9587 1.88577"
                :stroke="props.closeButtonColour"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </slot>
        </div>
        <slot> default slot content </slot>
      </div>
    </transition>
    <!--   </teleport> -->
  </div>
</template>

<style scoped>
.transition-modal-right {
  position: fixed;
  top: 0;
  right: 0;
  min-height: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: 0;
  z-index: 50;
  padding: 42px 24px 24px;
  overflow-y: auto;
  pointer-events: auto;
}

.transition-modal-left {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  height: 100%;
  margin-left: 0;
  margin-right: auto;
  z-index: 50;
  padding: 42px 24px 24px;
  overflow-y: auto;
  pointer-events: auto;
}

.transition-modal-up {
  position: fixed;
  bottom: 0;
  left: 0;
  min-width: 100%;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
  z-index: 50;
  padding: 42px 24px 24px;
  overflow-y: auto;
  pointer-events: auto;
}

.transition-modal-down {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  width: 100%;
  margin-top: 0;
  margin-bottom: auto;
  z-index: 50;
  padding: 42px 24px 24px;
  overflow-y: auto;
  pointer-events: auto;
}

.transition-modal-close-button {
  position: absolute;
  top: 10px;
  right: 50px;
  cursor: pointer;
}

.slide-in-right-enter-active {
  animation: slide-in-right-animation 0.5s;
}

.slide-in-right-leave-active {
  animation: slide-in-right-animation 0.5s reverse;
}

@keyframes slide-in-right-animation {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in-left-enter-active {
  animation: slide-in-left-animation 0.5s;
}

.slide-in-left-leave-active {
  animation: slide-in-left-animation 0.5s reverse;
}

@keyframes slide-in-left-animation {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in-up-enter-active {
  animation: slide-in-up-animation 0.5s;
}

.slide-in-up-leave-active {
  animation: slide-in-up-animation 0.5s reverse;
}

@keyframes slide-in-up-animation {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-in-down-enter-active {
  animation: slide-in-down-animation 0.5s;
}

.slide-in-down-leave-active {
  animation: slide-in-down-animation 0.5s reverse;
}

@keyframes slide-in-down-animation {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.transition-modal-overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  animation: background-transparency-animation 0.5s;
  display: none;
  z-index: 40;
  pointer-events: auto;
}

.transition-modal-overlay-out {
  animation: background-transparency-animation-out 0.5s;
}

@keyframes background-transparency-animation {
  from {
    background-color: inherit;
  }
  to {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

@keyframes background-transparency-animation-out {
  from {
    background-color: rgba(0, 0, 0, 0.2);
  }
  to {
    background-color: inherit;
  }
}
</style>
<style>
body.transition-modal-open {
  overflow: hidden;
  padding-right: 15px; /*  avoid width reflow due to scrollbar : doesn't work properly if there isn't one!! */
  pointer-events: none;
}

body.transition-modal-open .transition-modal-overlay {
  display: block;
}
</style>
