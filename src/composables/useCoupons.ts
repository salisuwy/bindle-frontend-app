import { ref, computed } from 'vue';
import { useOrders } from '@/composables/useUserProfile';
import { useCurrentOrder } from '@/composables/useCurrentOrder';

export const useWelcomeCoupon = () => {
  const { data, isPending } = useOrders();

  const couponStatus = computed(() => {
    if (isPending.value) {
      return 'pending';
    }
    if (data.value === undefined) {
      return 'not_signed_in';
    } else if (data.value.length > 0) {
      return 'not_available';
    } else {
      return 'available';
    }
  });

  // const { coupons } = useCurrentOrder();
  const isApplied = ref(false);

  return { couponStatus, isApplied };
};
