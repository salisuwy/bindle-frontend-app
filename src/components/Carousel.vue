<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, useSlots, watch} from "vue";
import { Util } from './helpers/Util.js';

const props = defineProps({
  class: { type:[String,Array,Object], default:null },
  style: { type:[String, Object], default:null },
  arrows: { type:Boolean, default:false },
  controls: { type:Boolean, default:false },
  controlItemClass: { type:String, default:'default-controls' },
  visibleItems: { type:Number, default:1 },
  gapWidth: { type:String, default:'0' },
  controlsGap: { type:String, default:'' },
  draggable: { type:Boolean, default:true },
  initialIdx: { type:Number, default:0 },
  resizeDebounceMs: { type:Number, default:250 },
  transitionSecs: { type:Number, default:1 },
  unselectedScale: { type:Number, default:1 },
  controlsClass: { type:[String,Array,Object], default:[] },
  controlsStyle: { type:[String, Object], default:null },
})

const slots = useSlots();
const items = ref([])
const itemRefs = ref([])
const slideIndex = ref(null)
const viewportRef = ref(null)
const trackRef = ref(null)
const debouncedWidth = ref(window.innerWidth)
const debouncedHeight = ref(window.innerHeight)
let dragStartX = 0;
let dragStartTranslateX = 0;
const dragTranslateX = ref(0)

const debouncedResize = Util.debounce(()=> {
  debouncedWidth.value = window.innerWidth
  debouncedHeight.value = window.innerHeight
}, props.resizeDebounceMs, false)

onMounted(()=>{
  window.addEventListener("resize", debouncedResize)
  // @ts-ignore
  items.value = slots.default()
  if (items.value.length>0) {
    slideIndex.value = props.initialIdx;
    itemRefs.value = trackRef.value.querySelectorAll('.carousel-item')
    if (!itemRefs.value.length) {
      throw "The Carousel has no content!"
    }
    recalculateItems()
    nextTick().then(()=> {
      trackRef.value.classList.add('apply-transition')
      selectIndex(slideIndex.value)
    })
    if (props.draggable) {
      viewportRef.value.addEventListener('mousedown', startDrag)
      viewportRef.value.addEventListener('touchstart', startDrag)
    }
  }
  else {
    throw "No slots found ... so sad :-("
  }
})

onUnmounted(()=> {
  window.removeEventListener("resize", debouncedResize)
})

watch(debouncedWidth,async()=> {
  recalculateItems()
})
watch(debouncedHeight,async()=> {
  recalculateItems()
})

const startDrag = (event)=> {
  dragStartX = event.type.includes('mouse')
      ? event.clientX
      : event.touches[0].clientX
  dragStartTranslateX = dragTranslateX.value
  trackRef.value.classList.remove('apply-transition')
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('mouseleave', endDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', endDrag)
}

const onDrag = (event) => {
  const currentX = event.type.includes('mouse')
      ? event.clientX
      : event.touches[0].clientX
  const deltaX = currentX - dragStartX
  dragTranslateX.value = dragStartTranslateX + deltaX
  trackRef.value.style.transform = "translate("+dragTranslateX.value+"px, 0)"
}

const endDrag = (event) => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('mouseleave', endDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', endDrag)
  trackRef.value.classList.add('apply-transition')
  const offsets = Array.from(itemRefs.value).map(item => {
    return item.offsetLeft - trackRef.value.offsetLeft
  });
  const widths = Array.from(itemRefs.value).map(item => {
    return item.offsetWidth
  });
  let translateX = -dragTranslateX.value
  for (let idx=0; idx<offsets.length-1; idx++)
  {
    if (translateX < ((offsets[idx] + widths[idx] + offsets[idx+1]) / 2) - (debouncedWidth.value/2)) {
      selectIndex(idx)
      return;
    }
  }
  selectIndex(offsets.length-1);
}

const recalculateItems = ()=> {
  const offsets = Array.from(itemRefs.value).map(item => {
    return item.offsetLeft - trackRef.value.offsetLeft
  });
  const widths = Array.from(itemRefs.value).map(item => {
    return item.offsetWidth
  });
  const itemGap = trackRef.value.offsetWidth - widths[slideIndex.value]
  let offset = offsets[slideIndex.value] - (itemGap/2)
  trackRef.value.style.transform = "translate("+(0-offset)+"px, 0)"
  dragTranslateX.value = (0-offset)
}

const slideIndexes = computed(()=> {
  let idxes = items.value ? Object.keys(items.value) : []
  return idxes;
})

const next = ()=> {
  if (typeof slideIndex.value === 'number' && (slideIndex.value < (items.value.length-1))) {
    selectIndex(slideIndex.value+1)
  }
}
const prev = ()=> {
  if (slideIndex.value && slideIndex.value>0) {
    selectIndex(slideIndex.value-1)
  }
}

const selectIndex = (index) => {
  itemRefs.value[slideIndex.value].classList.remove('selected')
  slideIndex.value = index
  itemRefs.value[slideIndex.value].classList.add('selected')
  recalculateItems()
  emits('slideChanged', slideIndex.value)
}

const index = ()=> slideIndex.value


const count = () => itemRefs.value.length

defineExpose({next, prev, index, count, selectIndex})
let emits = defineEmits(['slideChanged'])

let carouselStyles = computed(()=> {
  return {
    '--track-transition': 'transform '+props.transitionSecs+'s ease-in-out',
    '--track-gap': props.gapWidth,
    '--item-transition': 'transform '+props.transitionSecs+'s ease-in-out',
    '--unselected-scale': props.unselectedScale,
    'overflow': 'hidden',
  }
})

const controlsClass = computed(()=> Util.ensureDefault(props.controlsClass, 'carousel-controls'))

</script>
<template>
  <div :class="['carousel', props.class]" :style="carouselStyles">
    <div ref="viewportRef" class="carousel-viewport" style="position:relative">
      <div ref="trackRef" class="carousel-track">
        <slot>
        </slot>
      </div>
      <slot v-if="props.controls" name="controls">
        <div :class="controlsClass" :style="props.controlsClass" v-if="items!==null && props.controls">
          <input v-for="index in slideIndexes" :key="index" :class="controlItemClass" v-model="slideIndex" :value="index" name="index" type="radio" @click="selectIndex(index)">
        </div>
      </slot>
    </div>
  </div>
</template>
<style>
.carousel-item {
  transition:var(--item-transition);
}
.carousel-item:not(.selected) {
  transform:scale(var(--unselected-scale));
}
.carousel-item.selected {
  z-index:100;
}
</style>
<style scoped>
.carousel-viewport {
  max-width:100%;
  overflow:hidden;
}
.carousel-track {
  display:flex;
  flex-direction: row;
  gap:var(--track-gap);
}
.carousel-controls {
  width:100%;
}
.carousel-controls.inside {
  position:absolute;
  bottom:16px;
}
.carousel-track.apply-transition {
  transition:var(--track-transition);
}
input[type=radio] {
  cursor:pointer;
  border-radius:10px;
  appearance: none;
  height:8px;
  width:8px;
  margin:0 6px;
}
input[type=radio] {
  background-color:#777;
}
input[type=radio]:checked {
  background-color:white;
}
</style>
