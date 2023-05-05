import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { inject, ref, withAsyncContext, reactive, resolveDirective, unref, withCtx, createTextVNode, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, a as useRuntimeConfig } from './server.mjs';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrGetDirectiveProps, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import moment from 'moment-timezone';
import 'ufo';
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
  __name: "add",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const priority = urlParams.get("priority");
    inject("$awn");
    const config = /* @__PURE__ */ useRuntimeConfig();
    let local_data = localStorage.getItem("user");
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    let status = "unscheduled";
    const categoryItem = ref(null);
    const clickdatas = ref([]);
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const { data: catItem } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `${config.API_BASE_URL}category-items/id/${id}`,
      { key: id },
      "$8BJfxsdWtT"
    )), __temp = await __temp, __restore(), __temp);
    if (catItem.value) {
      categoryItem.value = catItem.value;
    }
    console.log("Item: ", categoryItem);
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const form = reactive({
      username: JSON.parse(local_data).userName,
      timestamp,
      task_id: "",
      category_item_id: id,
      information: "",
      title: "",
      priority,
      email_notification: "off",
      status,
      due_date: "",
      due_time: "",
      url_1_txt: "",
      url_1_link: "",
      url_2_txt: "",
      url_2_link: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_nuxt_link = __nuxt_component_0;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-b0555073><div id="add-information-item" data-v-b0555073><h1 class="font-bold py-4 capitalize" data-v-b0555073>Add Task</h1><div class="border border-white border-solid sm:rounded-md mb-6" data-v-b0555073><div class="px-4 py-5 sm:p-6 information-item" data-v-b0555073><div class="flex justify-between" data-v-b0555073><h1 class="font-bold text-gray-700 py-4 capitalize" data-v-b0555073> Category Item </h1><span data-v-b0555073><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black" data-v-b0555073>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/category-items/" + ((_a = unref(categoryItem)) == null ? void 0 : _a.unique_identifier)
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Edit Category Item`);
          } else {
            return [
              createTextVNode("Edit Category Item")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black" data-v-b0555073>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/information-items/add",
          query: { id: (_b = unref(categoryItem)) == null ? void 0 : _b.id }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Add Information`);
          } else {
            return [
              createTextVNode("Add Information")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 text-black" data-v-b0555073>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/tasks/add",
          query: {
            id: (_c = unref(categoryItem)) == null ? void 0 : _c.id,
            priority: (_d = unref(categoryItem)) == null ? void 0 : _d.priority
          }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Add Task`);
          } else {
            return [
              createTextVNode("Add Task")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button></span></div><div class="" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 label font-medium text-gray-700 mb-2" data-v-b0555073> Created </div><div class="col-span-3" data-v-b0555073><input type="text"${ssrRenderAttr(
        "value",
        formatDate((_e = unref(categoryItem)) == null ? void 0 : _e.createdAt, "YYYY-MM-DD HH:mm")
      )} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-b0555073></div></div><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 label font-medium text-gray-700 mb-2" data-v-b0555073> Item title </div><div class="col-span-9" data-v-b0555073><input placeholder="Need to enter the title or subject (obligatory)" type="text"${ssrRenderAttr("value", unref(categoryItem).item_title)} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-b0555073></div><div class="col-span-3 w-fit flex label font-medium text-gray-700 mb-2" data-v-b0555073> Item url${ssrInterpolate(" ")} <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-b0555073><button type="button" title="Copy Command To Clipboard" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-b0555073></path></svg></button><a${ssrRenderAttr("href", (_f = unref(categoryItem)) == null ? void 0 : _f.url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-b0555073></path></svg></a></div></div><div class="col-span-9" data-v-b0555073><input disabled type="text" id="url_1_link"${ssrRenderAttr("value", unref(categoryItem).url_1_link)} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading" data-v-b0555073><svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>When you type or paste a URL here, after you leave the input field (item URL) the database will check if the URL already exists and make it red. Otherwise it will become green. <br />If you paste a new URL and leave, the system will show again that it is checking if it exists and become either green or red again.</div>",
        html: true
      }, void 0, { right: true })))} data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-b0555073></path></svg></div><div class="col-span-12 py-2" data-v-b0555073><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-b0555073><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Category * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Obligatory, here you have to select what social media platform you are using. If you would like to track traffic from one that is not listed, <br />you can select Anything and put for example Instragram in the title.</div>",
        html: true
      }, void 0, { right: true })))} data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-b0555073></path></svg></div><div class="col-span-9" data-v-b0555073><select id="category" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-b0555073><option value="facebook" data-v-b0555073>Facebook</option><option value="linkedin" data-v-b0555073>LinkedIn</option><option value="meetup" data-v-b0555073>Meetup</option><option value="anything" data-v-b0555073>Anything</option></select></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-b0555073><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-b0555073><div class="col-span-12 sm:col-span-12" data-v-b0555073><label for="information" class="block text-sm font-medium text-gray-700" data-v-b0555073>Information</label><textarea disabled rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project" data-v-b0555073>${ssrInterpolate(unref(categoryItem).information)}</textarea></div></div></div><div class="col-span-12" data-v-b0555073><div class="flex flex-row py-2" data-v-b0555073><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Group * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: `<div>You should try to create some groups to organise the Items in. When you get clicks, you can see how many clicks there were from specific groups created by you.<br />
                          Example for remote working groups: Freelancers, Work from Home, Digital Nomad. You will learn over time what groups give you the most clicks per post. <br />
                          We advise to use 4-6 groups per project.</div>`,
        html: true
      }, void 0, { right: true })))} data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-b0555073></path></svg></div><div class="basis-1/2" data-v-b0555073><select disabled id="priority" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073><!--[-->`);
      ssrRenderList(unref(clickdatas), (clickdata) => {
        _push(`<option${ssrRenderAttr("value", `${clickdata.id}`)} data-v-b0555073>${ssrInterpolate(clickdata.name)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="flex flex-row py-2" data-v-b0555073><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Priority * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Here you can select what the priority for this item will be. Inactive ones found groups are usually Low priority. <br />Normal groups are Medium and only groups with a lot of potential to get clicks are High. When unsure, you can select medium.</div>",
        html: true
      }, void 0, { right: true })))} data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-b0555073></path></svg></div><div class="basis-1/3" data-v-b0555073><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-b0555073><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Low</label></div></li><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Medium</label></div></li><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>High </label></div></li></ul></div></div><div class="flex flex-row py-2" data-v-b0555073><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Visibility * </div><div class="basis-1/4" data-v-b0555073><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-b0555073><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).visibility, "private")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="private" name="c_visibility" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Private </label></div></li><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).visibility, "public")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="public" name="c_visibility" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Public</label></div></li></ul></div></div></div><div class="col-span-12 mb-2" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 2 information </div><div class="col-span-9 px-1.5" data-v-b0555073><input disabled type="text"${ssrRenderAttr("value", unref(categoryItem).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-12 mb-2" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-b0555073><button type="button" title="Copy Command To Clipboard" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-b0555073></path></svg></button><a${ssrRenderAttr("href", unref(categoryItem).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-b0555073></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-b0555073><input disabled type="text"${ssrRenderAttr("value", unref(categoryItem).url_2_link)} id="url_2_link" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-12 mb-2" data-v-b0555073><p class="text-sm font-medium text-gray-700 pt-2" data-v-b0555073> Automatic scheduling: </p></div><div class="col-span-12 mb-2" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Planning frequency </div><div class="col-span-5 px-1.5" data-v-b0555073><select disabled id="plan_frequency" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073><option${ssrRenderAttr("value", null)} disabled data-v-b0555073> Every 4, 6, 8 hours, 2 days, week, month... </option><option value="4" data-v-b0555073>4 hours</option><option value="6" data-v-b0555073>6 hours</option><option value="8" data-v-b0555073>8 hours</option><option value="12" data-v-b0555073>12 hours</option><option value="24" data-v-b0555073>Daily</option><option value="48" data-v-b0555073>2 days</option><option value="72" data-v-b0555073>3 days</option><option value="120" data-v-b0555073>5 days</option><option value="168" data-v-b0555073>Weekly</option><option value="336" data-v-b0555073>Bi weekly</option><option value="720" data-v-b0555073>Monthly</option><option value="1440" data-v-b0555073>Bi Monthly</option></select></div></div></div><div class="col-span-12 mb-2" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Automatic status </div><div class="col-span-3 px-1.5" data-v-b0555073><label class="flex items-center relative w-max cursor-pointer select-none" data-v-b0555073><input disabled${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).automatic_status, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-b0555073><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-b0555073> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-b0555073> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-b0555073></span></label></div></div></div><div class="col-span-12" data-v-b0555073><div class="flex flex-row mt-4" data-v-b0555073><div class="basis-1/3 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(categoryItem).username)} disabled id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-b0555073></div><div class="basis-1/3 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(categoryItem).timestamp)} disabled id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-b0555073></div><div class="basis-1/3 px-1.5" data-v-b0555073><div class="flex flex-row" data-v-b0555073><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Item ID </div><div class="basis-3/4" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(categoryItem).unique_identifier)} disabled id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div></div></div></div></div></div></div><form data-v-b0555073><div class="border border-white border-solid overflow-hidden sm:rounded-md" data-v-b0555073><div class="px-4 py-5 sm:p-6" data-v-b0555073><div class="flex flex-row py-2" data-v-b0555073><div class="basis-1/3 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).username)}${ssrIncludeBooleanAttr(unref(form).username) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-b0555073></div><div class="basis-1/3 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-b0555073></div><div class="basis-1/3 px-1.5" data-v-b0555073><div class="flex flex-row" data-v-b0555073><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Task ID </div><div class="basis-3/4" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).task_id)}${ssrIncludeBooleanAttr(unref(form).task_id) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-b0555073></div></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-b0555073><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-b0555073><div class="col-span-12 sm:col-span-12" data-v-b0555073><label for="information" class="block text-sm font-medium text-gray-700" data-v-b0555073>Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="Some message or content here..." required data-v-b0555073>${ssrInterpolate(unref(form).information)}</textarea></div><div class="col-span-6" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Priority * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Here you can select what the priority for this item will be. Inactive ones found groups are usually Low priority. <br />Normal groups are Medium and only groups with a lot of potential to get clicks are High. When unsure, you can select medium.</div>",
        html: true
      }, void 0, { right: true })))} data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-b0555073></path></svg></div><div class="col-span-9" data-v-b0555073><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-b0555073><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Low</label></div></li><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>Medium</label></div></li><li class="w-full" data-v-b0555073><div class="flex items-center pl-3" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-b0555073><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-b0555073>High </label></div></li></ul></div></div></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-b0555073><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-b0555073><div class="col-span-6" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Status </div><div class="col-span-9" data-v-b0555073><select id="status" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required disabled data-v-b0555073><option${ssrRenderAttr("value", null)} disabled data-v-b0555073> Unscheduled, planned or history </option><option value="unscheduled" data-v-b0555073>Unscheduled</option><option value="planned" data-v-b0555073>Planned</option><option value="history" data-v-b0555073>History</option></select></div></div></div></div></div><div class="col-span-12 sm:col-span-12 my-6" data-v-b0555073><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-b0555073><div class="col-span-4" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Due date </div><div class="col-span-9" data-v-b0555073><input placeholder="" type="date"${ssrRenderAttr("value", unref(form).due_date)} id="due_date" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-4" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> Due Time </div><div class="col-span-9" data-v-b0555073><input placeholder="" type="time"${ssrRenderAttr("value", unref(form).due_time)} id="due_time" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-4" data-v-b0555073><div class="grid grid-cols-12 w-fit flex items-center mt-2" data-v-b0555073><div class="col-span-9 text-sm font-medium text-gray-700" data-v-b0555073> Email notification </div><div class="col-span-3 px-1.5" data-v-b0555073><label class="flex items-center relative w-max cursor-pointer select-none" data-v-b0555073><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).email_notification, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-b0555073><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-b0555073> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-b0555073> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-b0555073></span></label></div></div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4" data-v-b0555073><div class="col-span-12" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 1 information </div><div class="col-span-9 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).url_1_txt)} id="url_1_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-12" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 1 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-b0555073><button type="button" title="Copy Command To Clipboard" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-b0555073></path></svg></button><a${ssrRenderAttr("href", unref(form).url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-b0555073></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).url_1_link)} id="url_1_link" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-12" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 2 information </div><div class="col-span-9 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div><div class="col-span-12" data-v-b0555073><div class="grid grid-cols-12" data-v-b0555073><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-b0555073> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-b0555073><button type="button" title="Copy Command To Clipboard" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-b0555073></path></svg></button><a${ssrRenderAttr("href", unref(form).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-b0555073><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b0555073><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-b0555073></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-b0555073><input type="text"${ssrRenderAttr("value", unref(form).url_2_link)} id="url_2_link" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-b0555073></div></div></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full" data-v-b0555073><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-b0555073> Submit </button></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tasks/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0555073"]]);

export { add as default };
//# sourceMappingURL=add-8176de4e.mjs.map
