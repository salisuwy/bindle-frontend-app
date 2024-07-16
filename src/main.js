import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes.js'
import './style.css'
import './font-awesome.css'

import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     staleTime: 1000 * 60 * 5,
  //     cacheTime: 1000 * 60 * 30,
  //   },
  // },
// });
const toastifyOptions = {
  closeOnClick: false,
  hideProgressBar: true,
  autoClose: 1500,
  theme: "light",
  position: "bottom-center",
};


const pinia = createPinia();

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(Vue3Toasity, toastifyOptions);
app.use(pinia);
app.use(router);
app.mount('#app');
