<script setup lang="ts">
import type { RouteRecordName } from 'vue-router';

interface Props {
  breadcrumbs: { name?: RouteRecordName; text: string; path: string }[];
  currentPath: string;
}
defineProps<Props>();
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
          breadcrumb.text.length <= 3 ? breadcrumb.text.toUpperCase() : breadcrumb.text
        }}</router-link>
        <span v-else class="text-theme-darkgray">{{
          breadcrumb.text.length <= 3 ? breadcrumb.text.toUpperCase() : breadcrumb.text
        }}</span>
      </li>
    </ol>
  </nav>
</template>
