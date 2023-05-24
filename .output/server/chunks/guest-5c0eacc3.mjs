import { g as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/vue';
import '@unhead/dom';
import '@unhead/ssr';
import 'vue-router';
import 'h3';
import 'ufo';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import 'vue/server-renderer';
import './config.mjs';
import 'destr';
import 'scule';

const guest = defineNuxtRouteMiddleware(async (to, from) => {
});

export { guest as default };
//# sourceMappingURL=guest-5c0eacc3.mjs.map
