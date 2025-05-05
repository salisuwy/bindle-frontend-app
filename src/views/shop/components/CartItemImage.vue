<script setup lang="ts">
import { toRef, computed, useAttrs } from 'vue';
import type { ComputedRef } from 'vue';
import { useBook, useBundle } from '@/composables/useBindleData';

interface Props {
  itemType: 'book' | 'bundle';
  title: string;
  slug: string;
  outOfStock: boolean;
}
const props = defineProps<Props>();

let productImage: ComputedRef<undefined | string>;
if (props.itemType == 'book') {
  const { book } = useBook(toRef(props.slug));
  productImage = computed(() => book.value?.image_url || undefined);
} else {
  const { bundle } = useBundle(toRef(props.slug));
  productImage = computed(() => bundle.value?.image_url.mid || undefined);
}

const attrs = useAttrs();
const classList = computed(() => attrs.class as string | undefined);
</script>

<template>
  <div
    v-if="productImage === undefined"
    class="shrink-0 bg-gray-100 rounded-lg"
    :class="classList"
  ></div>
  <img
    v-else
    :src="productImage"
    :alt="title"
    class="shrink-0 object-contain object-center"
    :class="{
      'opacity-75 mix-blend-multiply': outOfStock,
      classList: true,
    }"
  />
</template>

<style scoped></style>
