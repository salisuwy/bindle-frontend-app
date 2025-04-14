<script setup lang="ts">
import { computed } from 'vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';

import { useSubjects } from '@/composables/useBindleData';
import type { Subject } from '@/composables/useBindleData';

interface Props {
  stub: string;
}
defineProps<Props>();

const { navSubjects } = useSubjects();

const subjectClass = (idx: number) => {
  switch (idx) {
    case 0:
      return 'relative row-start-1 md:col-start-1 md:col-span-3 md:row-span-2';
    case 1:
      return 'relative row-start-2 md:col-start-4 md:col-span-3 md:row-start-1';
    case 2:
      return 'relative row-start-3 md:col-start-4 md:col-span-3 md:row-start-2';
    case 3:
      return 'relative row-start-4 md:col-start-1 md:col-span-2 md:row-start-3';
    case 4:
      return 'relative row-start-5 md:col-start-3 md:col-span-2 md:row-start-3';
    case 5:
      return 'relative row-start-6 md:col-start-5 md:col-span-2 md:row-start-3';
    case 6:
      return 'relative row-start-7 md:col-start-1 md:col-span-2 md:row-start-4';
    case 7:
      return 'relative row-start-8 md:col-start-3 md:col-span-2 md:row-start-4';
    case 8:
      return 'relative row-start-9 md:col-start-5 md:col-span-2 md:row-start-4';
    default:
      return (
        'relative row-start-' +
        (idx + 1) +
        ' md:col-start-' +
        (1 + (idx % 3) * 2) +
        ' md:col-span-2 md:row-start-' +
        (Math.floor(idx / 3) + 5)
      );
  }
};

const SUBJECT_IMAGE_LOOKUP: Record<string, string> = {
  maths: '/assets/subjects/mathematics.png',
  'english-language': '/assets/subjects/english-language.png',
  'english-literature': '/assets/subjects/english-literature.png',
  chemistry: '/assets/subjects/chemistry.png',
  physics: '/assets/subjects/physics.png',
  biology: '/assets/subjects/biology.png',
  history: '/assets/subjects/history.png',
  geography: '/assets/subjects/geography.png',
  dt: '/assets/subjects/business-studies.png',
};

const SUBJECT_PRIORITY_LOOKUP: Record<string, number> = {
  maths: 1,
  'english-language': 2,
  'english-literature': 2,
  chemistry: 3,
  physics: 3,
  biology: 3,
  history: 3,
  geography: 3,
  dt: 3,
};

const getSubjectPriority = (subject: Subject) => SUBJECT_PRIORITY_LOOKUP[subject.slug] || 4;

const prioritisedSubjects = computed(() => {
  return [...(navSubjects.value || [])].sort(
    (a, b) => getSubjectPriority(a) - getSubjectPriority(b)
  );
});
</script>
<template>
  <div class="mx-auto max-w-8xl grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
    <router-link
      v-for="(subject, idx) in prioritisedSubjects"
      :key="subject.id"
      :to="'/' + stub + '/' + subject.slug"
      :class="subjectClass(idx) + ' flex align-center justify-center'"
    >
      <img
        v-if="idx < 9 && SUBJECT_IMAGE_LOOKUP[subject.slug] !== undefined"
        :src="SUBJECT_IMAGE_LOOKUP[subject.slug]"
        :alt="subject.name"
        class="max-h-48 w-full max-w-full md:max-h-full object-cover"
      />
      <div
        v-if="idx < 9"
        class="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center"
      >
        <div class="bg-white p-6 rounded-xl text-2xl">
          {{ subject.name }}
        </div>
      </div>
      <div v-else class="w-full flex flex-row p-6 bg-theme-lightgray rounded-xl">
        <div class="flex-grow text-left text-2xl">
          {{ subject.name }}
        </div>
        <div>
          <ChevronIcon right width="32" height="32" />
        </div>
      </div>
    </router-link>
  </div>
</template>
