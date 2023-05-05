import AWN from "awesome-notifications";

const vuwAWNOptions = {
  position: "top-left",
  durations: { 
    global: 2000
},
};
const $awn = {
  install: (Vue, vuwAWNOptions) => {
    Vue.provide("$awn", new AWN(vuwAWNOptions));
  },
};
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use($awn, vuwAWNOptions);
});
