import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { inject, ref, reactive, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import moment from 'moment-timezone';
import 'ufo';
import './server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$awn");
    ref([]);
    const searchdatas = ref([]);
    const search = reactive({
      vaClDa: ""
    });
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div id="click_data" class="shadow sm:rounded-md"><div class="flex justify-between"><h1 class="font-bold py-4 uppercase">Click list</h1><div class="flex items-start"><div class="flex border-2 rounded border-blue-600"><div class="relative"><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600" placeholder="Search..."><button class="absolute inset-y-0 right-0 px-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700"><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></button></div></div></div><div class="flex items-center justify-center"></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2">Tracking URL</th><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2">Device</th><th class="text-left py-3 px-2">Date / Time</th><th class="text-left py-3 px-2">Country</th><th class="text-left py-3 px-2">City</th><th class="text-left py-3 px-2">Referrer</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        var _a;
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tracking-url/${(_a = clickdata == null ? void 0 : clickdata.Redirect) == null ? void 0 : _a.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = clickdata == null ? void 0 : clickdata.Redirect) == null ? void 0 : _a2.tracking_url.slice(-7))}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b = clickdata == null ? void 0 : clickdata.Redirect) == null ? void 0 : _b.tracking_url.slice(-7)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/click-list/detail/${clickdata == null ? void 0 : clickdata.task_id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.task_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.task_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">${ssrInterpolate(clickdata == null ? void 0 : clickdata.device)}</td><td class="py-3 px-2">${ssrInterpolate(formatDate(clickdata == null ? void 0 : clickdata.timestamp, "YYYY-MM-DD H:m"))}</td><td class="py-3 px-2">${ssrInterpolate(clickdata == null ? void 0 : clickdata.country)}</td><td class="py-3 px-2">${ssrInterpolate(clickdata == null ? void 0 : clickdata.city)}</td><td class="py-3 px-2">${ssrInterpolate(clickdata == null ? void 0 : clickdata.referrer_url)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/click-list/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-b27329cb.mjs.map
