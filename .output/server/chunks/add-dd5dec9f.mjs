import { inject, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
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
    inject("$awn");
    const urlParams = new URLSearchParams(window.location.search);
    ref("");
    const path = window.location.href;
    path.split("/").slice(0, 3).join("/");
    const form = reactive({
      tracking_url: "",
      destination_url: "",
      task_id: urlParams.get("task_id"),
      seo_title: "",
      seo_description: "",
      seo_image_url: "",
      facebook_link: "no"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-cd36e5a5><div id="last-tracking-url" data-v-cd36e5a5><h1 class="font-bold py-4 uppercase" data-v-cd36e5a5>Add New Tracking URL</h1><form data-v-cd36e5a5><div class="overflow-hidden shadow sm:rounded-md" data-v-cd36e5a5><div class="px-4 py-5 sm:p-6" data-v-cd36e5a5><div class="flex flex-row py-2" data-v-cd36e5a5><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Tracking URL </div><div class="basis-1/3 px-1.5" data-v-cd36e5a5><input type="text"${ssrRenderAttr("value", unref(form).tracking_url)}${ssrIncludeBooleanAttr(unref(form).tracking_url) ? " disabled" : ""} id="tracking_url" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-cd36e5a5></div><div class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-cd36e5a5><button type="button" title="Copy Command To Clipboard" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-cd36e5a5></path></svg></button><a${ssrRenderAttr("href", `${unref(form).tracking_url}`)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-cd36e5a5></path></svg></a></div></div><div class="flex flex-row py-2" data-v-cd36e5a5><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Link to facebook </div><div class="basis-1/3 px-1.5" data-v-cd36e5a5><label class="flex items-center relative w-max cursor-pointer select-none" data-v-cd36e5a5><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).facebook_link, "yes")) ? " checked" : ""}${ssrIncludeBooleanAttr(!unref(form).facebook_link) ? " disabled" : ""} id="facebook_link" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-cd36e5a5><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-cd36e5a5> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-cd36e5a5> Yes </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-cd36e5a5></span></label></div></div><div class="flex flex-row py-2" data-v-cd36e5a5><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Destination URL </div><div class="basis-1/2" data-v-cd36e5a5><input type="text"${ssrRenderAttr("value", unref(form).destination_url)} id="destination_url" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-cd36e5a5></div><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-cd36e5a5><button type="button" title="Copy Command To Clipboard" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-cd36e5a5></path></svg></button><a${ssrRenderAttr(
        "href",
        ((_a = unref(form).destination_url) == null ? void 0 : _a.includes("http")) ? unref(form).destination_url : "http://" + unref(form).destination_url
      )} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-cd36e5a5></path></svg></a><p class="pl-2" data-v-cd36e5a5>Obligatory, by user</p></div></div><div class="flex flex-row py-2" data-v-cd36e5a5><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Task ID </div><div class="basis-1/4" data-v-cd36e5a5><input type="text"${ssrRenderAttr("value", unref(form).task_id)} id="task_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required disabled data-v-cd36e5a5></div><div class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" data-v-cd36e5a5></path></svg><p class="pl-7" data-v-cd36e5a5>Obligatory, by user</p></div></div><p class="text-sm font-medium text-gray-700 pt-2" data-v-cd36e5a5> Tracking URL markup: </p><div class="col-span-12 sm:col-span-12 rounded-lg border-solid border-2 border-[#cbd5e1] shadow-sm p-4 mt-2" data-v-cd36e5a5><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-cd36e5a5><div class="col-span-12" data-v-cd36e5a5><div class="grid grid-cols-12" data-v-cd36e5a5><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Tracking url title </div><div class="col-span-9 px-1.5" data-v-cd36e5a5><input type="text"${ssrRenderAttr("value", unref(form).seo_title)} id="seo_title" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-cd36e5a5></div></div></div><div class="col-span-12" data-v-cd36e5a5><div class="grid grid-cols-12" data-v-cd36e5a5><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Tracking url description </div><div class="col-span-9 px-1.5" data-v-cd36e5a5><textarea id="seo_description" rows="6" class="bg-[#dddddd] h-20 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-cd36e5a5>${ssrInterpolate(unref(form).seo_description)}</textarea></div></div></div><div class="col-span-12" data-v-cd36e5a5><div class="grid grid-cols-12" data-v-cd36e5a5><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-cd36e5a5> Tracking url image link </div><div class="col-span-7 px-1.5" data-v-cd36e5a5><input type="text"${ssrRenderAttr("value", unref(form).seo_image_url)} id="seo_image_url" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-cd36e5a5></div><div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-cd36e5a5><button type="button" title="Copy Command To Clipboard" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-cd36e5a5></path></svg></button><a${ssrRenderAttr("href", unref(form).seo_image_url)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-cd36e5a5><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-cd36e5a5><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-cd36e5a5></path></svg></a></div></div></div></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full" data-v-cd36e5a5><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-cd36e5a5> Create tracking URL </button></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tracking-url/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cd36e5a5"]]);

export { add as default };
//# sourceMappingURL=add-dd5dec9f.mjs.map
