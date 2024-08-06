import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes.js'
import "vue3-toastify/dist/index.css";

import './style.css'
import './font-awesome.css'

import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import Vue3Toasity from "vue3-toastify";

const queryClient = new QueryClient()
// {
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
  position: "bottom-center",
};


const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);

app.use(VueQueryPlugin, queryClient);
app.use(Vue3Toasity, toastifyOptions);

app.mount('#app');
