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
    } else if (isApplied.value && cartItemsCount.value > 1) {
      return 'applied_active';
    } else if (isApplied.value && cartItemsCount.value == 1) {
      return 'applied_not_active';
    } else if (isApplied.value && cartItemsCount.value == 0) {
      return 'applied_no_order';
    } else if (data.value === undefined || data.value === null) {
      return 'not_signed_in';
    } else if (data.value.length > 0) {
      return 'not_available';
    } else {
      return 'available';
    }
  });

  return { couponStatus };
};
