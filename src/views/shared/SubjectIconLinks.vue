<script setup>
import { useBindleApiStore } from '@/store/bindle-api.js';
import { computed, onBeforeMount, ref } from 'vue';
import { Util } from '@/components/helpers/Util.js';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

const props = defineProps({
  slug: { type: String, required: true },
});

const bindleApiStore = useBindleApiStore();
const subjects = ref(null);
onBeforeMount(() => {
  bindleApiStore.getSubjects().then((data) => {
    subjects.value = data;
  });
});
const subjectLength = computed(() => {
  if (Util.isLiteralObject(subjects.value)) {
    return Object.keys(subjects.value).length;
  } else {
    return 0;
  }
});
const breakpoints = {
  640: {
    itemsToShow: 6,
  },
  1024: {
    itemsToShow: 8,
  },
};
</script>
<template>
  <div class="w-full bg-theme-light pt-6 pb-2">
    <carousel
      class="subject-icons"
      button-class="text-theme-gray"
      :items-to-show="4"
      :breakpoints="breakpoints"
      :transition="1000"
      :wrap-around="true"
      :autoplay="2000"
    >
      <slide
        v-if="subjectLength > 0"
        v-for="(subject, index) in subjects"
        :key="index"
        class="subject-link text-theme-white pb-2 select-none"
      >
        <router-link class="subject-link" :to="props.slug + '?subject=' + subject['slug']">
          <div class="rounded-full w-8 h-8 flex items-center justify-center mx-auto">
            <i
              :class="
                'fa fa-solid text-theme-teal ' + bindleApiStore.getSubjectIconClass(subject['slug'])
              "
            />
          </div>
          <div class="leading-tight line-clamp-2 mb-10 pb-10">{{ subject['name'] }}</div>
        </router-link>
      </slide>
    </carousel>
  </div>
</template>
<style scoped>
.subject-link {
  overflow: hidden;
  border-radius: 10px;
  min-width: 100px;
  height: 70px;
}
</style>
