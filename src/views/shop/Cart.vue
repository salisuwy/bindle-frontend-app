<script setup>
import ChevronIcon from "@/components/icons/ChevronIcon.vue";
const emit = defineEmits(['checkoutLinkClicked'])
const checkoutLinkClicked = ()=> {
    emit('checkoutLinkClicked');
}
</script>
<template>
    <div>
        <h3>Basket</h3>
        <router-link to="/checkout" class="bg-theme-teal mt-8 block buttonlike" @click="checkoutLinkClicked">Continue to Checkout <chevron-icon height="20" width="20" right class="inline"></chevron-icon></router-link>
    </div>
</template>