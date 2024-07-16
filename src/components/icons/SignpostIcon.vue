<script setup>
const props = defineProps({
  class: { type:[String,Array,Object], default:null },
  style: { type:[String, Object], default:null },
  width: { type:String, default:'24' },
  height: { type:String, default:'24' },
  colour: { type:String, default:'currentColor' },
  backgroundColour: { type:String, default:'none' },
})
</script>
<template>
  <svg
      :class="props.class"
      :style="props.style"
      :width="props.width"
      :height="props.height"
      viewBox="0 0 30 30"
      :fill="props.backgroundColour"
      xmlns="http://www.w3.org/2000/svg">
  <path d="M22.5 9H5.522C5.406 9 5.293 8.959 5.203 8.886L2.181 6.386C2.066 6.29 2 6.149 2 6C2 5.851 2.066 5.71 2.181 5.614L5.203 3.114C5.293 3.041 5.406 3 5.522 3H22.5C23.327 3 24 3.673 24 4.5V7.5C24 8.327 23.327 9 22.5 9ZM5.702 8H22.5C22.776 8 23 7.775 23 7.5V4.5C23 4.225 22.776 4 22.5 4H5.702L3.284 6L5.702 8Z"
        :fill="props.colour"
  />
  <path d="M23.174 17H6.5C5.673 17 5 16.327 5 15.5V12.5C5 11.673 5.673 11 6.5 11H23.174C23.282 11 23.388 11.035 23.474 11.101L26.8 13.601C26.926 13.694 27 13.843 27 14C27 14.157 26.926 14.306 26.8 14.399L23.474 16.899C23.388 16.965 23.282 17 23.174 17ZM6.5 12C6.224 12 6 12.225 6 12.5V15.5C6 15.775 6.224 16 6.5 16H23.007L25.668 14L23.007 12H6.5Z"
        :fill="props.colour"
  />
  <path d="M14.5 4C14.224 4 14 3.776 14 3.5V0.5C14 0.224 14.224 0 14.5 0C14.776 0 15 0.224 15 0.5V3.5C15 3.776 14.776 4 14.5 4Z"
        :fill="props.colour"
  />
  <path d="M14.5 12C14.224 12 14 11.776 14 11.5V8.5C14 8.224 14.224 8 14.5 8C14.776 8 15 8.224 15 8.5V11.5C15 11.776 14.776 12 14.5 12Z"
        :fill="props.colour"
  />
  <path d="M14.5 30C14.224 30 14 29.776 14 29.5V16.5C14 16.224 14.224 16 14.5 16C14.776 16 15 16.224 15 16.5V29.5C15 29.776 14.776 30 14.5 30Z"
        :fill="props.colour"
  />
  <path d="M18.5 30H10.5C10.224 30 10 29.776 10 29.5C10 29.224 10.224 29 10.5 29H18.5C18.776 29 19 29.224 19 29.5C19 29.776 18.776 30 18.5 30Z"
        :fill="props.colour"
  />
  </svg>
</template>