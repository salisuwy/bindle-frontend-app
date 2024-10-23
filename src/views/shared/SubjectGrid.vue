<script setup>
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useBindleApiStore} from "@/store/bindle-api.js";
import {Util} from "@/components/helpers/Util.js";
import ChevronIcon from "@/components/icons/ChevronIcon.vue";

const props = defineProps({
  stub:{type:String, required:true}
});
const route = useRoute();
const bindleApiStore = useBindleApiStore();
const subjects = ref(null)
const prioritisedIndex = ref([])
onMounted(async () => {
    subjects.value = await bindleApiStore.getSubjects();
    console.error("Subjects>>>", subjects.value)
    prioritisedIndex.value = await bindleApiStore.getPrioritisedSubjectsIndex();
});


const subjectClass = (idx) => {
  switch (idx) {
    case 0:
      return "relative row-start-1 md:col-start-1 md:col-span-3 md:row-span-2";
    case 1:
      return "relative row-start-2 md:col-start-4 md:col-span-3 md:row-start-1";
    case 2:
      return "relative row-start-3 md:col-start-4 md:col-span-3 md:row-start-2";
    case 3:
      return "relative row-start-4 md:col-start-1 md:col-span-2 md:row-start-3";
    case 4:
      return "relative row-start-5 md:col-start-3 md:col-span-2 md:row-start-3";
    case 5:
      return "relative row-start-6 md:col-start-5 md:col-span-2 md:row-start-3";
    case 6:
      return "relative row-start-7 md:col-start-1 md:col-span-2 md:row-start-4";
    case 7:
      return "relative row-start-8 md:col-start-3 md:col-span-2 md:row-start-4";
    case 8:
      return "relative row-start-9 md:col-start-5 md:col-span-2 md:row-start-4";
    default:
      return "relative row-start-" + (idx + 1) + " md:col-start-" + (1 + (idx % 3) * 2) + " md:col-span-2 md:row-start-" + (Math.floor(idx / 3) + 5);
  }
}
</script>
<template>
  <div class="mx-auto max-w-8xl grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
    <router-link v-for="(id, idx) in prioritisedIndex"
                 :to="'/'+props.stub+'/'+subjects[id]['slug']"
                 :class="subjectClass(idx)+' flex align-center justify-center'">
                 <!-- <pre>{{ subjects[id]['image_url'] }}</pre> -->
      <img v-if="idx<9 && subjects[id]['image_url']"
           :src="Util.ensureSsl(subjects[id]['image_url'])"
           :alt="subjects[id]['name']"
           class="max-h-48 w-full max-w-full md:max-h-full object-cover">
      <div v-if="idx<9" class="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center">
        <div class="bg-white p-6 rounded-xl text-2xl">{{ subjects[id]['name'] }}</div>
      </div>
      <div v-else class="w-full flex flex-row p-6 bg-theme-lightgray rounded-xl">
        <div class="flex-grow text-left text-2xl">{{ subjects[id]['description'] }}</div>
        <div>
          <chevron-icon right width="32" height="32"/>
        </div>
      </div>
    </router-link>
  </div>
</template>