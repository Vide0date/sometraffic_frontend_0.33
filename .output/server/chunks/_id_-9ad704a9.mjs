import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { inject, ref, withAsyncContext, reactive, resolveDirective, unref, isRef, withCtx, createVNode, createTextVNode, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, u as useRoute, a as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrGetDirectiveProps, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import moment from 'moment-timezone';
import { Modal } from 'usemodal-vue3';
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const AWN = inject("$awn");
    const urlParams = new URLSearchParams(window.location.search);
    const categoryItem = ref(null);
    const shouldShowDialog = ref(false);
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { id } = ([__temp, __restore] = withAsyncContext(() => useRoute().params), __temp = await __temp, __restore(), __temp);
    const _id = urlParams.get("id");
    (/* @__PURE__ */ new Date()).toLocaleTimeString();
    setInterval(() => {
      (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const { data: catItem } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `${config.API_BASE_URL}category-items/id/${_id}`,
      { key: _id },
      "$l7JlbUySrm"
    )), __temp = await __temp, __restore(), __temp);
    if (catItem.value) {
      categoryItem.value = catItem.value;
    }
    const form = reactive({
      id: "",
      username: "",
      timestamp: "",
      task_id: "",
      category_item_id: "",
      information: "",
      title: "",
      priority: "",
      email_notification: "",
      status: "",
      due_date: "",
      due_time: "",
      url_1_txt: "",
      url_1_link: "",
      url_2_txt: "",
      url_2_link: "",
      createdAt: ""
    });
    const { data: user } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `${config.API_BASE_URL}tasks/identifier/${id}`,
      { key: id },
      "$3lhPsiex5d"
    )), __temp = await __temp, __restore(), __temp);
    console.log("categoryItem & user: ", categoryItem, user);
    if (user.value) {
      form.id = user.value.id;
      form.category_item_id = user.value.category_item_id;
      form.username = user.value.username;
      form.timestamp = user.value.status;
      form.task_id = user.value.task_id;
      form.information = user.value.information;
      form.title = user.value.title;
      if (user.value.due_date_time) {
        form.due_date = new Date(user.value.due_date_time).toISOString().substring(0, 10);
        form.due_time = new Date(user.value.due_date_time).toISOString().substring(11, 16);
      }
      form.priority = user.value.priority;
      form.email_notification = user.value.email_notification == "1" ? "on" : "off";
      form.status = user.value.status;
      form.url_1_txt = user.value.url_1_txt;
      form.url_1_link = user.value.url_1_link;
      form.url_2_txt = user.value.url_2_txt;
      form.url_2_link = user.value.url_2_link;
      form.createdAt = user.value.createdAt;
    }
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const markDone = async () => {
      const id2 = localStorage.getItem("sometraffic_mark_done");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}tasks/update/${id2}`,
        {
          method: "PUT",
          body: {
            id: form.id,
            category_item_id: form.category_item_id,
            username: form.username,
            timestamp: /* @__PURE__ */ new Date(),
            task_id: form.task_id,
            status: "history",
            email_notification: false
          }
        },
        "$QO6XlB1WUh"
      );
      if (data.value) {
        await AWN.success("Task marked as done and moved to history.");
        navigateTo("/tasks");
      }
      if (error.value) {
        await AWN.alert(error.value.statusMessage);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_nuxt_link = __nuxt_component_0;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-ef07251f><div id="add-information-item" data-v-ef07251f>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can always restart this task.",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => markDone() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-ef07251f${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="font-bold py-4 capitalize" data-v-ef07251f>Update Task</h1><div class="border border-white border-solid sm:rounded-md mb-6" data-v-ef07251f><div class="px-4 py-5 sm:p-6 information-item" data-v-ef07251f><div class="flex justify-between" data-v-ef07251f><h1 class="font-bold text-gray-700 py-4 capitalize" data-v-ef07251f> Category Item </h1><span data-v-ef07251f><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black" data-v-ef07251f>`);
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
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black" data-v-ef07251f>`);
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
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black" data-v-ef07251f>`);
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
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 text-black" data-v-ef07251f>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/tracking-url/add/?id=000000",
          query: {
            task_id: (_e = unref(user)) == null ? void 0 : _e.task_id
          }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Add URL YYY`);
          } else {
            return [
              createTextVNode("Add URL YYY")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button></span></div><div class="" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 label font-medium text-gray-700 mb-2" data-v-ef07251f> Created </div><div class="col-span-3" data-v-ef07251f><input type="text"${ssrRenderAttr(
        "value",
        formatDate((_f = unref(categoryItem)) == null ? void 0 : _f.createdAt, "YYYY-MM-DD HH:mm")
      )} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-ef07251f></div></div><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 label font-medium text-gray-700 mb-2" data-v-ef07251f> Item title </div><div class="col-span-9" data-v-ef07251f><input placeholder="Need to enter the title or subject (obligatory)" type="text"${ssrRenderAttr("value", unref(categoryItem).item_title)} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-ef07251f></div><div class="col-span-3 w-fit flex label font-medium text-gray-700 mb-2" data-v-ef07251f> Item url${ssrInterpolate(" ")} <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-ef07251f><button type="button" title="Copy Command To Clipboard" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-ef07251f></path></svg></button><a${ssrRenderAttr("href", (_g = unref(categoryItem)) == null ? void 0 : _g.url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-ef07251f></path></svg></a></div></div><div class="col-span-9" data-v-ef07251f><input disabled type="text" id="url_1_link"${ssrRenderAttr("value", unref(categoryItem).url_1_link)} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading" data-v-ef07251f><svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))} data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-ef07251f></path></svg></div><div class="col-span-12 py-2" data-v-ef07251f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-ef07251f><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Category * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))} data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-ef07251f></path></svg></div><div class="col-span-9" data-v-ef07251f><select id="category" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-ef07251f><option value="facebook" data-v-ef07251f>Facebook</option><option value="linkedin" data-v-ef07251f>LinkedIn</option><option value="meetup" data-v-ef07251f>Meetup</option><option value="anything" data-v-ef07251f>Anything</option></select></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-ef07251f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-ef07251f><div class="col-span-12 sm:col-span-12" data-v-ef07251f><label for="information" class="block text-sm font-medium text-gray-700" data-v-ef07251f>Information</label><textarea disabled rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project" data-v-ef07251f>${ssrInterpolate(unref(categoryItem).information)}</textarea></div></div></div><div class="col-span-12" data-v-ef07251f><div class="flex flex-row py-2" data-v-ef07251f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Group * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))} data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-ef07251f></path></svg></div><div class="basis-1/2" data-v-ef07251f><select disabled id="priority" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f><!--[-->`);
      ssrRenderList(_ctx.clickdatas, (clickdata) => {
        _push(`<option${ssrRenderAttr("value", `${clickdata.id}`)} data-v-ef07251f>${ssrInterpolate(clickdata.name)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="flex flex-row py-2" data-v-ef07251f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Priority * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))} data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-ef07251f></path></svg></div><div class="basis-1/3" data-v-ef07251f><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-ef07251f><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Low</label></div></li><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Medium</label></div></li><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="c_priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>High </label></div></li></ul></div></div><div class="flex flex-row py-2" data-v-ef07251f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Visibility * </div><div class="basis-1/4" data-v-ef07251f><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-ef07251f><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).visibility, "private")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="private" name="c_visibility" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Private </label></div></li><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).visibility, "public")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="public" name="c_visibility" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Public</label></div></li></ul></div></div></div><div class="col-span-12 mb-2" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 2 information </div><div class="col-span-9 px-1.5" data-v-ef07251f><input disabled type="text"${ssrRenderAttr("value", unref(categoryItem).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-12 mb-2" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-ef07251f><button type="button" title="Copy Command To Clipboard" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-ef07251f></path></svg></button><a${ssrRenderAttr("href", unref(categoryItem).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-ef07251f></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-ef07251f><input disabled type="text"${ssrRenderAttr("value", unref(categoryItem).url_2_link)} id="url_2_link" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-12 mb-2" data-v-ef07251f><p class="text-sm font-medium text-gray-700 pt-2" data-v-ef07251f> Automatic scheduling: </p></div><div class="col-span-12 mb-2" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Planning frequency </div><div class="col-span-5 px-1.5" data-v-ef07251f><select disabled id="plan_frequency" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f><option${ssrRenderAttr("value", null)} disabled data-v-ef07251f> Every 4, 6, 8 hours, 2 days, week, month... </option><option value="4" data-v-ef07251f>4 hours</option><option value="6" data-v-ef07251f>6 hours</option><option value="8" data-v-ef07251f>8 hours</option><option value="12" data-v-ef07251f>12 hours</option><option value="24" data-v-ef07251f>Daily</option><option value="48" data-v-ef07251f>2 days</option><option value="72" data-v-ef07251f>3 days</option><option value="120" data-v-ef07251f>5 days</option><option value="168" data-v-ef07251f>Weekly</option><option value="336" data-v-ef07251f>Bi weekly</option><option value="720" data-v-ef07251f>Monthly</option><option value="1440" data-v-ef07251f>Bi Monthly</option></select></div></div></div><div class="col-span-12 mb-2" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Automatic status </div><div class="col-span-3 px-1.5" data-v-ef07251f><label class="flex items-center relative w-max cursor-pointer select-none" data-v-ef07251f><input disabled${ssrIncludeBooleanAttr(ssrLooseEqual(unref(categoryItem).automatic_status, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-ef07251f><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-ef07251f> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-ef07251f> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-ef07251f></span></label></div></div></div><div class="col-span-12" data-v-ef07251f><div class="flex flex-row mt-4" data-v-ef07251f><div class="basis-1/3 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(categoryItem).username)} disabled id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-ef07251f></div><div class="basis-1/3 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(categoryItem).timestamp)} disabled id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-ef07251f></div><div class="basis-1/3 px-1.5" data-v-ef07251f><div class="flex flex-row" data-v-ef07251f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Item ID </div><div class="basis-3/4" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(categoryItem).unique_identifier)} disabled id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div></div></div></div></div></div></div><form data-v-ef07251f><div class="border border-white border-solid overflow-hidden sm:rounded-md" data-v-ef07251f><div class="px-4 py-5 sm:p-6" data-v-ef07251f><div class="col-span-12" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Created </div><div class="col-span-3" data-v-ef07251f><input type="text"${ssrRenderAttr("value", formatDate(unref(form).createdAt, "YYYY-MM-DD HH:mm"))} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled data-v-ef07251f></div></div></div><div class="flex flex-row py-2" data-v-ef07251f><div class="basis-1/3 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).username)}${ssrIncludeBooleanAttr(unref(form).username) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-ef07251f></div><div class="basis-1/3 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-ef07251f></div><div class="basis-1/3 px-1.5" data-v-ef07251f><div class="flex flex-row" data-v-ef07251f><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Task ID </div><div class="basis-3/4" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).task_id)}${ssrIncludeBooleanAttr(unref(form).task_id) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-ef07251f></div></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-ef07251f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-ef07251f><div class="col-span-12 sm:col-span-12" data-v-ef07251f><label for="information" class="block text-sm font-medium text-gray-700" data-v-ef07251f>Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="Some message or content here..." required data-v-ef07251f>${ssrInterpolate(unref(form).information)}</textarea></div><div class="col-span-6" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Priority * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))} data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-ef07251f></path></svg></div><div class="col-span-9" data-v-ef07251f><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-ef07251f><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Low</label></div></li><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>Medium</label></div></li><li class="w-full" data-v-ef07251f><div class="flex items-center pl-3" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-ef07251f><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-ef07251f>High </label></div></li></ul></div></div></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-ef07251f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-ef07251f><div class="col-span-6" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Status </div><div class="col-span-9" data-v-ef07251f><select id="status" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required disabled data-v-ef07251f><option${ssrRenderAttr("value", null)} disabled data-v-ef07251f> Unscheduled, planned or history </option><option value="unscheduled" data-v-ef07251f>Unscheduled</option><option value="planned" data-v-ef07251f>Planned</option><option value="history" data-v-ef07251f>History</option></select></div></div></div></div></div><div class="col-span-12 sm:col-span-12 my-6" data-v-ef07251f><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-ef07251f><div class="col-span-4" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Due date </div><div class="col-span-9" data-v-ef07251f><input placeholder="" type="date"${ssrRenderAttr("value", unref(form).due_date)} id="due_date" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-4" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> Due Time </div><div class="col-span-9" data-v-ef07251f><input placeholder="" type="time"${ssrRenderAttr("value", unref(form).due_time)} id="due_time" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-4" data-v-ef07251f><div class="grid grid-cols-12 w-fit flex items-center mt-2" data-v-ef07251f><div class="col-span-9 text-sm font-medium text-gray-700" data-v-ef07251f> Email notification </div><div class="col-span-3 px-1.5" data-v-ef07251f><label class="flex items-center relative w-max cursor-pointer select-none" data-v-ef07251f><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).email_notification, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-ef07251f><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-ef07251f> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-ef07251f> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-ef07251f></span></label></div></div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4" data-v-ef07251f><div class="col-span-12" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 1 information </div><div class="col-span-9 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).url_1_txt)} id="url_1_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-12" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 1 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-ef07251f><button type="button" title="Copy Command To Clipboard" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-ef07251f></path></svg></button><a${ssrRenderAttr("href", unref(form).url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-ef07251f></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).url_1_link)} id="url_1_link" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-12" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 2 information </div><div class="col-span-9 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div><div class="col-span-12" data-v-ef07251f><div class="grid grid-cols-12" data-v-ef07251f><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-ef07251f> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-ef07251f><button type="button" title="Copy Command To Clipboard" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-ef07251f></path></svg></button><a${ssrRenderAttr("href", unref(form).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-ef07251f><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-ef07251f><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-ef07251f></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-ef07251f><input type="text"${ssrRenderAttr("value", unref(form).url_2_link)} id="url_2_link" placeholder="https://www.example.com" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-ef07251f></div></div></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full" data-v-ef07251f><button type="button" class="bg-green-500 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2" data-v-ef07251f> Mark as Done </button><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-ef07251f> Submit </button></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tasks/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef07251f"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-9ad704a9.mjs.map
