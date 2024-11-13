<script setup>
import {nextTick, ref, useSlots, watch} from "vue";

const props = defineProps({
    open: {type: Boolean, default: false},
    class: {type: [String, Array, Object], default: null},
    style: {type: [String, Object], default: null},
    contentClass: {type: [String, Array, Object], default: null},
    contentStyle: {type: [String, Object], default: null},
    noIndicator: {type: Boolean, default: false},
    titleClass: {type: [String, Array, Object], default: null},
    titleStyle: {type: [String, Object], default: null},
    indicatorClass: {type: [String, Array, Object], default: null},
});
const isOpen = ref(props.open);
const contentRef = ref();
const indicatorStyle = ref({transform: 'rotate(0deg)', transition: 'transform 0.5s ease', display: 'inline-block'});

const toggle = () => {
    isOpen.value = !isOpen.value;
}
const open = () => {
    if (!isOpen.value) {
      isOpen.value = true;
    }
}
const close = () => {
    if (isOpen.value) {
        isOpen.value = false;
    }
}

const setHeight = (element, value) => {
    element.style.height = value;
}

const animateOpening = async (element) => {
    setHeight(element, 'auto');
    const height = element.clientHeight + "px";
    setHeight(element, '0px');
    await nextTick();
    element.offsetHeight; // no-op read forces reflow
    requestAnimationFrame(() => {
        setHeight(element, height);
    })
}

const animateClosing = (element) => {
    const height = element.clientHeight + 'px';
    requestAnimationFrame(() => {
        setHeight(element, height);
        requestAnimationFrame(() => {
            setHeight(element, '0px');
        });
    });
};

if (props.open) {
    indicatorStyle.value['transform'] = 'rotate(180deg)';
}

watch(isOpen, async (newValue) => {
    if (contentRef.value !== null) {
        if (newValue) {
            indicatorStyle.value['transform'] = 'rotate(180deg)';
            await animateOpening(contentRef.value);
        } else {
            indicatorStyle.value['transform'] = 'rotate(0deg)';
            await animateClosing(contentRef.value)
        }
    }
})
nextTick(() => {
    if (!props.open && contentRef.value) {
        setHeight(contentRef.value, '0px')
    }
})

watch(
    () => props.open,
    (newVal) => {
        isOpen.value = newVal;
    }
);
defineExpose({toggle, open, close})
</script>
<template>
    <div :class="props.class" :style="props.style">
        <div :class="props.titleClass" :style="{position:'relative', ...props.titleStyle}" @click="toggle()">
            <slot name="title"></slot>
            <div v-if="!noIndicator" :class="props.indicatorClass" :style="indicatorStyle">
                <slot name="indicator">▼</slot>
            </div>
        </div>
        <div ref="contentRef" :class="['accordion-content', props.contentClass]"
             :style="{'overflow':'hidden', transition: 'height 0.3s ease, transform 0.3s ease', ...props.contentStyle}">
            <slot></slot>
        </div>
        <div>
            <slot name="footer"></slot>
        </div>
    </div>
</template>
