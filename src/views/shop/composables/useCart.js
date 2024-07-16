import { ref, computed } from "vue";
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import axios from "axios";

const cart = ref([]);
const API_ENDPOINT = "https://bindle-backend.test/api";

export function useCart() {
  const queryClient = useQueryClient();

  const addToCart = async (item) => {
    console.log("[useCart] - addToCart", item);
    const resp = await axios.post(`${API_ENDPOINT}/orders/add`, item, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(resp.data);
  };

  const removeFromCart = (item) => {
    console.log("[useCart] - removeFromCart", item);
  };

  return {
    // getItems,
    // totalItems,
    // totalPrice,
    addToCart,
    removeFromCart,
  };
}
