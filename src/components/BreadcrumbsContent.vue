<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

interface Props {
  breadcrumbs: { name?: RouteRecordName; text?: string; path: string }[];
  currentPath: string;
}
defineProps<Props>();

const formatBreadcrumbText = (text?: string) => {
  if (text === undefined) {
    return undefined;
  } else {
    return text.length <= 3 ? text.toUpperCase() : text;
  }
};
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumbs flex flex-row flex-wrap gap-2 sm:gap-4">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item inline text-sm"
      >
        <span v-if="index > 0" class="mr-3">/</span>
        <router-link v-if="breadcrumb.path !== currentPath" :to="breadcrumb.path">{{
          formatBreadcrumbText(breadcrumb.text)
        }}</router-link>
        <span v-else class="text-theme-darkgray">{{ formatBreadcrumbText(breadcrumb.text) }}</span>
      </li>
    </ol>
  </nav>
</template>
