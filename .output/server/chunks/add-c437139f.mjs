import { inject, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
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
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    inject("$awn");
    let local_data = localStorage.getItem("user");
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      category_item_id: id,
      username: JSON.parse(local_data).userName,
      timestamp,
      item_id: "",
      url_1_txt: "",
      url_1_link: "",
      url_2_txt: "",
      url_2_link: "",
      posts_per_month: null,
      posts_today: null,
      members_total: null,
      members_new: null
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-de91e41f><div id="add-information-item" data-v-de91e41f><h1 class="font-bold py-4 capitalize" data-v-de91e41f>Add Information Item</h1><form data-v-de91e41f><div class="overflow-hidden shadow sm:rounded-md" data-v-de91e41f><div class="px-4 py-5 sm:p-6" data-v-de91e41f><div class="flex flex-row py-2" data-v-de91e41f><div class="basis-1/3 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).username)}${ssrIncludeBooleanAttr(unref(form).username) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-de91e41f></div><div class="basis-1/3 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-de91e41f></div><div class="basis-1/3 px-1.5" data-v-de91e41f><div class="flex flex-row" data-v-de91e41f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> Item ID </div><div class="basis-3/4" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).item_id)}${ssrIncludeBooleanAttr(unref(form).item_id) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-de91e41f></div></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-de91e41f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-de91e41f><div class="col-span-12 sm:col-span-12" data-v-de91e41f><label for="information" class="block text-sm font-medium text-gray-700" data-v-de91e41f>Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="Some message or content here..." required data-v-de91e41f>${ssrInterpolate(unref(form).information)}</textarea></div></div></div><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4" data-v-de91e41f><div class="col-span-12" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> URL 1 information </div><div class="col-span-9 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).url_1_txt)} id="url_1_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div><div class="col-span-12" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> URL 1 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-de91e41f><button type="button" title="Copy Command To Clipboard" data-v-de91e41f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-de91e41f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-de91e41f></path></svg></button><a${ssrRenderAttr("href", unref(form).url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-de91e41f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-de91e41f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-de91e41f></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).url_1_link)} id="url_1_link" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div><div class="col-span-12" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> URL 2 information </div><div class="col-span-9 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).url_2_txt)} id="url_2_txt" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div><div class="col-span-12" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-de91e41f><button type="button" title="Copy Command To Clipboard" data-v-de91e41f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-de91e41f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-de91e41f></path></svg></button><a${ssrRenderAttr("href", unref(form).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-de91e41f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-de91e41f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-de91e41f></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-de91e41f><input type="text"${ssrRenderAttr("value", unref(form).url_2_link)} id="url_2_link" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div><div class="col-span-12" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-3" data-v-de91e41f></div><div class="col-span-9" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-6" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="pt-4 col-span-4 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> Posts </div><div class="col-span-8 px-1.5" data-v-de91e41f><p class="" data-v-de91e41f>Per month</p><input type="text"${ssrRenderAttr("value", unref(form).posts_per_month)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div><div class="grid grid-cols-12" data-v-de91e41f><div class="pt-4 col-span-4 w-fit flex items-center text-sm font-medium text-gray-700" data-v-de91e41f> Members </div><div class="col-span-8 px-1.5" data-v-de91e41f><p class="" data-v-de91e41f>Total</p><input type="text"${ssrRenderAttr("value", unref(form).members_total)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div><div class="col-span-6" data-v-de91e41f><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-12 px-1.5" data-v-de91e41f><p class="" data-v-de91e41f>Today</p><input type="text"${ssrRenderAttr("value", unref(form).posts_today)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div><div class="grid grid-cols-12" data-v-de91e41f><div class="col-span-12 px-1.5" data-v-de91e41f><p class="" data-v-de91e41f>New</p><input type="text"${ssrRenderAttr("value", unref(form).members_new)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-de91e41f></div></div></div></div></div></div></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full" data-v-de91e41f><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-de91e41f> Submit </button></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/information-items/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de91e41f"]]);

export { add as default };
//# sourceMappingURL=add-c437139f.mjs.map
