import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { AsyncQueue } from '@/components/helpers/AsyncQueue';

import { isEqual } from 'lodash-es';

const routeParamUpdateQueue = new AsyncQueue();

export const useSyncRouteParam = (
  key: string,
  paramRef: Ref<string | undefined>,
  validate: (val: string) => boolean,
  disable = ref(false)
) => {
  const router = useRouter();
  const route = useRoute();

  const updateFromRouteParam = async () => {
    //console.log('updateFromRouteParam', key, route.params);
    const currentParamVal = route.params[key];
    if (typeof currentParamVal == 'string' && validate(currentParamVal)) {
      paramRef.value = currentParamVal;
      return;
    } else {
      router.push({ name: 'index' });
    }
  };

  const updateFromRef = async () => {
    //console.log('updateFromRef', key, paramRef.value);
    await router.replace({ params: { ...route.params, [key]: paramRef.value } });
  };

  const initialised = ref(false);
  const initialise = async () => {
    if (disable.value) return;
    initialised.value = false;
    //console.log('useSyncRouteParam: set initialise to false');
    await routeParamUpdateQueue.enqueue(updateFromRouteParam);
    initialised.value = true;
  };

  watch(paramRef, (newVal, oldVal) => {
    if (disable.value) return;
    if (!isEqual(newVal, oldVal)) {
      //console.log('enqueue updateFromRef', key, paramRef.value);
      routeParamUpdateQueue.enqueue(updateFromRef);
    }
  });
  watch(
    () => route.params[key],
    (newVal, oldVal) => {
      if (disable.value) return;
      if (!isEqual(newVal, oldVal)) {
        //console.log('enqueue updateFromRouteParam', key, route.params[key]);
        routeParamUpdateQueue.enqueue(updateFromRouteParam);
      }
    }
  );

  return { initialise, initialised };
};
