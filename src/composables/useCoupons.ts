import { computed } from 'vue';
import { useOrders } from '@/composables/useUserProfile';
import { useCurrentOrder } from '@/composables/useCurrentOrder';

export const useWelcomeCoupon = () => {
  const { data, isPending } = useOrders();
  const { coupons, cartItemsCount } = useCurrentOrder();
  const isApplied = computed(() => coupons.value?.some((c) => c.coupon_code === 'WELCOME50'));

  const couponStatus = computed(() => {
    if (isPending.value) {
      return 'pending';
    }
    if (data.value === undefined || data.value === null) {
      return 'not_signed_in';
    } else if (data.value.length > 0) {
      return 'not_available';
    } else if (!isApplied.value) {
      return 'available';
    } else if (cartItemsCount.value > 1) {
      return 'applied';
    } else {
      return 'applied_single_item';
    }
  });

  return { couponStatus };
};
