import { ref, computed } from 'vue';
import type { Ref } from 'vue';

import { isEqual } from 'lodash-es';
import { DeferredPromise } from '@/components/helpers/tsUtils';

export const useValidatedObject = <T>(object: Ref<T>) => {
  const _isValid = ref(false);
  // make isValid computed so that it is read only
  const isValid = computed(() => _isValid.value);

  const initialValidationInProgress = new DeferredPromise<void>();

  const handleUpdated = ([isValid, newObject]: [boolean, T]) => {
    initialValidationInProgress.resolve();
    if (!isEqual(newObject, object.value)) {
      object.value = newObject;
    }
    _isValid.value = isValid;
    //console.log('handleUpdated', isValid, newObject);
  };

  return {
    isValid,
    handleUpdated,
    initialValidationInProgress: initialValidationInProgress.promise,
  };
};
