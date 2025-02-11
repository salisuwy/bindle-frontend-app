<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { Util } from '@/components/helpers/Util.js';

import BreadcrumbsContent from './BreadcrumbsContent.vue';

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
});

const route = useRoute();
const router = useRouter();
//const routes = router.getRoutes();
const path = computed(() => route.path);

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/');
  const build = [];

  for (let idx = 0; idx < pathSegments.length; idx++) {
    const matchPath = idx === 0 ? '/' : pathSegments.slice(0, idx + 1).join('/');
    const matchingRoute = router.resolve(matchPath);
    if (matchingRoute) {
      let text;
      if (typeof matchingRoute.meta.breadcrumb === 'function') {
        text = matchingRoute.meta.breadcrumb(route);
      } else if (Util.isString(typeof matchingRoute.meta.breadcrumb)) {
        text = matchingRoute.meta.breadcrumb;
      } else {
        text = Util.humaniseSnakeCase(matchingRoute.name);
      }
      build.push({
        name: matchingRoute.name,
        path: matchingRoute.path,
        text: text,
      });
    } else {
      // the breadcrumb trail has broken down
      break;
    }
  }
  return build;
});
const getClass = Util.ensureDefault(props.class, 'breadcrumbs-nav');
</script>
<template>
  <BreadcrumbsContent
    :style="props.style"
    :class="getClass"
    :breadcrumbs="breadcrumbs"
    :currentPath="path"
  />
</template>
