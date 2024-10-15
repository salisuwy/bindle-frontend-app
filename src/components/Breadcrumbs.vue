<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { Util } from "@/components/helpers/Util.js";

const props = defineProps({
  class: { type: [String, Array, Object], default: null },
  style: { type: [String, Object], default: null },
});

const route = useRoute();
const router = useRouter();
//const routes = router.getRoutes();
const path = computed(() => route.path);

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split("/");
  const build = [];

  for (let idx = 0; idx < pathSegments.length; idx++) {
    const matchPath =
      idx === 0 ? "/" : pathSegments.slice(0, idx + 1).join("/");
    let matchingRoute = router.resolve(matchPath);
    if (matchingRoute) {
      let text;
      if (typeof matchingRoute.meta.breadcrumb === "function") {
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
const getClass = Util.ensureDefault(props.class, "breadcrumbs-nav");
</script>
<template>
  <nav aria-label="breadcrumb" :style="props.style" :class="getClass">
    <ol class="breadcrumbs flex flex-row flex-wrap gap-2 sm:gap-4">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item inline text-sm"
      >
        <span v-if="index > 0" class="mr-3">/</span>
        <router-link
          v-if="breadcrumb.path !== path"
          :to="breadcrumb.path"
          >{{ breadcrumb.text.length <= 3 ? breadcrumb.text.toUpperCase() : breadcrumb.text }}</router-link
        >
        <span
          v-else
          class="text-theme-darkgray"
          >{{ breadcrumb.text.length <= 3 ? breadcrumb.text.toUpperCase() : breadcrumb.text }}</span
        >
      </li>
    </ol>
  </nav>
</template>
