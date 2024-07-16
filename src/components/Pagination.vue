<script setup>
import {computed, ref} from "vue";
import {Util} from "@/components/helpers/Util.js";

const props = defineProps({
    class: { type:[String,Array,Object], default:[] },
    style: { type:[String, Object], default:[] },
    itemClass: { type:[String,Array,Object], default:[] },
    itemSelectedClass: { type:[String,Array,Object], default:[] },
    itemStyle: { type:[String, Object], default:[] },
    arrowClass: { type:[String,Array,Object], default:[] },
    arrowDisabledClass: { type:[String,Array,Object], default:[] },
    modelValue: {type:Number},
    itemsPerPage: {type:Number, default:16 },
    totalItems: {type:Number, default:0 },
    showRange: {type:Number, default:1 },
    arrowControls: { type:Boolean, default:false }
});

const highestIdx = ref(0);

const rangeItems = computed(()=> {
  const startIdx = Math.max(1, props.modelValue - props.showRange);
  highestIdx.value = Math.ceil(props.totalItems / props.itemsPerPage);
  const endIdx = Math.min(startIdx + (props.showRange*2), highestIdx.value);
  const items = [];
  if (startIdx>1) {
    items.push(1)
    if (startIdx>2) {
      items.push(null); // ellipsis
    }
  }
  for (let pageIdx=startIdx; pageIdx<=endIdx; pageIdx++) {
    //console.log(pageIdx);
    items.push(pageIdx);
  }
  if (endIdx<highestIdx.value) {
    if (endIdx<highestIdx.value-1) {
      items.push(null);
    }
    items.push(highestIdx.value);
  }
  return items;
})

const getClass = computed(()=> {
  return Util.ensureDefault(props.class,['pagination','flex','flex-row', 'justify-center', 'items-center']);
});

const emit = defineEmits(['update:modelValue', 'navigation']);
const clickPage = (pageIdx) => {
  if (pageIdx>0 && pageIdx<=highestIdx.value) {
    emit('update:modelValue', pageIdx);
    emit('navigation', pageIdx);
  }
}

const incrementPage = ()=> {
  if (props.modelValue+1<highestIdx.value) {
    clickPage(props.modelValue+1);
  }
}
const decrementPage = ()=> {
  if (props.modelValue>1) {
    clickPage(props.modelValue-1);
  }
}
const getButtonClass = (pageIdx) => pageIdx===props.modelValue ? Util.ensureDefault(props.itemClass,props.itemSelectedClass) : props.itemClass;
const getArrowClass = computed(() => Util.ensureDefault(props.itemClass,props.arrowClass));
const getLeftClass = computed(()=> props.modelValue>1 ? getArrowClass.value : Util.ensureDefault(getArrowClass.value, props.arrowDisabledClass));
const getRightClass = computed(()=> props.modelValue>1 ? getArrowClass.value : Util.ensureDefault(getArrowClass.value, props.arrowDisabledClass));

</script>
<template>
  <div v-if="rangeItems.length>1" :class="getClass" :style="props.style">
    <div v-if="props.arrowControls">
      <button :class="getLeftClass" :style="props.itemStyle" :disabled="props.modelValue<2" @click="decrementPage()"><slot name="control-decrement">&lt;</slot></button>
    </div>
    <div v-for="(pageIdx, idx) in rangeItems" :key="idx">
      <button :class="getButtonClass(pageIdx)" :style="props.itemStyle" v-if="pageIdx!=null" @click="clickPage(pageIdx)" :data-selected="pageIdx===props.modelValue ? true : null" :disabled="pageIdx===props.modelValue">{{pageIdx}}</button>
      <div :class="props.itemClass" :style="props.itemStyle" v-else><slot name="control-ellipsis">&hellip;</slot></div>
    </div>
    <div v-if="props.arrowControls">
      <button :class="getRightClass" :style="props.itemStyle" :disabled="props.modelValue>=highestIdx" @click="incrementPage()"><slot name="control-increment">&gt;</slot></button>
    </div>
  </div>
</template>