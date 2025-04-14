import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { AsyncQueue } from '@/components/helpers/AsyncQueue';

import { isEqual } from 'lodash-es';

const queryParamUpdateQueue = new AsyncQueue();

export const useSyncQueryParam = (
  key: string,
  paramRef: Ref<string[] | undefined>,
  validate: (val: string) => boolean,
  disable = ref(false)
) => {
  const router = useRouter();
  const route = useRoute();

  const updateFromQueryParam = async () => {
    const currentParamVal = route.query[key];
    //console.log('updateFromQueryParam', key, 'existing query = ', route.query);
    //console.log('updateFromQueryParam (currentParamValue)', key, currentParamVal);
    //console.log('updateFromQueryParam (paramRef)', paramRef.value);
    if (typeof currentParamVal == 'string') {
      const validParamVals = currentParamVal.split(',').filter(validate);
      if (validParamVals.length > 0) {
        paramRef.value = validParamVals;
        return;
      }
    } else {
      paramRef.value = [];
    }
    await router.replace({ query: { ...route.query, [key]: undefined } });
    //console.log('updateFromQueryParam', key, 'new query = ', route.query);
  };

  const updateFromRef = async () => {
    //console.log('updateFromRef', key, 'existing query = ', route.query);
    //console.log('updateFromRef', key, paramRef.value);

    await router.replace({ query: { ...route.query, [key]: paramRef.value?.join(',') } });
    //console.log('updateFromRef', key, 'new query = ', route.query);
  };

  const initialised = ref(false);
  const initialise = async () => {
    if (disable.value) return;
    console.log('useSyncQueryParam: set initialise to false');
    initialised.value = false;
    await queryParamUpdateQueue.enqueue(updateFromQueryParam);
    initialised.value = true;
  };

  watch(paramRef, (newVal, oldVal) => {
    if (disable.value) return;
    if (!isEqual(newVal, oldVal)) {
      queryParamUpdateQueue.enqueue(updateFromRef);
    }
  });
  watch(
    () => route.query[key],
    (newVal, oldVal) => {
      if (disable.value) return;
      if (!isEqual(newVal, oldVal)) {
        queryParamUpdateQueue.enqueue(updateFromQueryParam);
      }
    }
  );

  return { initialise, initialised };
};
