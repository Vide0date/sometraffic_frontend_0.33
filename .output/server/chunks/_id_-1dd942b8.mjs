import { u as useRuntimeConfig, a as useRoute, f as __nuxt_component_0$1, _ as _export_sfc } from './server.mjs';
import { _ as _sfc_main$3, a as _sfc_main$2, b as _sfc_main$1$1, c as _sfc_main$4, d as _imports_0$1 } from './TasksHistory-1f72d154.mjs';
import { useSSRContext, inject, withAsyncContext, ref, reactive, resolveDirective, unref, withCtx, createTextVNode, mergeProps, isRef, createVNode, toDisplayString, openBlock, createBlock, toRefs } from 'vue';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrGetDirectiveProps, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import moment from 'moment-timezone';
import { Modal } from 'usemodal-vue3';
import { _ as _imports_0 } from './loading-aeba0513.mjs';
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
import './config.mjs';
import 'destr';
import 'scule';
import './paths.mjs';
import 'ohash';

const __default__$1 = {
  name: "InformationItems",
  props: ["limit", "itemid"]
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign(__default__$1, {
  __ssrInlineRender: true,
  props: {
    limit: Number,
    itemid: Number
  },
  setup(__props) {
    const props = __props;
    const AWN = inject("$awn");
    const { id } = useRoute().params;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const clickdatastotal = ref(0);
    const config = useRuntimeConfig();
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const setClickDatas = async () => {
      const { limit, itemid } = toRefs(props);
      const { data } = await useFetch(
        `${config.API_BASE_URL}information-items/allByItemId?limit=${limit.value}&itemid=${itemid.value}`,
        "$bD1cKDODKc"
      );
      clickdatas.value = data.value.data;
      clickdatastotal.value = data.value.count;
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_info");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}information-items/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$WlP2Xv7PrS"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_info");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-85683d57>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can NOT undo this action",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleDelete() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-85683d57${_scopeId}> Are you sure? </div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, " Are you sure? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between" data-v-85683d57><h1 class="font-bold py-4 capitalize" data-v-85683d57> Information Items (${ssrInterpolate(unref(clickdatastotal))}) </h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/information-items?id=${unref(id)}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle({ "width": "20px", "margin-top": "20px" })}"${ssrRenderAttr("src", _imports_0$1)} class="information-items" data-v-85683d57${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                style: { "width": "20px", "margin-top": "20px" },
                src: _imports_0$1,
                class: "information-items"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="overflow-x-auto" data-v-85683d57><table class="w-full whitespace-nowrap" data-v-85683d57><thead class="bg-black/60" data-v-85683d57><tr data-v-85683d57><th class="text-left py-3 px-2" data-v-85683d57>Info ID</th><th class="text-left py-3 px-2" data-v-85683d57>Item ID</th><th class="text-left py-3 px-2" data-v-85683d57>Information</th><th class="text-left py-3 px-2" data-v-85683d57>Category</th><th class="text-left py-3 px-2" data-v-85683d57>Posts/Month</th><th class="text-left py-3 px-2" data-v-85683d57>Date/Time</th><th class="text-left py-3 px-2" data-v-85683d57>Actions</th></tr></thead><tbody data-v-85683d57><!--[-->`);
      ssrRenderList(unref(clickdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700" data-v-85683d57><td class="py-3 px-2" data-v-85683d57>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/information-items/${clickdata.item_id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.item_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.item_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2" data-v-85683d57>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2 tooltip" data-v-85683d57>${ssrInterpolate(clickdata.information.length > 90 ? clickdata.information.slice(0, 90) + "..." : clickdata.information)}</td><td class="py-3 px-2 capitalize" data-v-85683d57>${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize" data-v-85683d57>${ssrInterpolate(clickdata == null ? void 0 : clickdata.posts_per_month)}</td><td class="py-3 px-2 capitalize" data-v-85683d57>${ssrInterpolate(formatDate(clickdata == null ? void 0 : clickdata.timestamp, "YYYY-MM-DD H:m"))}</td><td class="py-3 px-2" data-v-85683d57><div class="inline-flex items-center space-x-3" data-v-85683d57>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/information-items/${clickdata.item_id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" data-v-85683d57${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" data-v-85683d57${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  class: "w-5 h-5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white" data-v-85683d57><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-85683d57><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" data-v-85683d57></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InformationItems.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-85683d57"]]);
const __default__ = {
  data() {
    return {
      tab: 1
    };
  },
  methods: {
    activeTabOne() {
      this.tab = 1;
    },
    activeTabTwo() {
      this.tab = 2;
    },
    activeTabThree() {
      this.tab = 3;
    },
    activeTabFour() {
      this.tab = 4;
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    inject("$awn");
    const config = useRuntimeConfig();
    const { id } = ([__temp, __restore] = withAsyncContext(() => useRoute().params), __temp = await __temp, __restore(), __temp);
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    localStorage.getItem("user");
    let defaultProject = parseInt(localStorage.getItem("activeProject"));
    const projects = ref([]);
    const groups = ref([]);
    const uniqueUrl = ref("");
    const isLoading = ref(false);
    const showProjectsList = ref(false);
    const showGroupsList = ref(false);
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      id: "",
      username: "",
      timestamp,
      item_id: "",
      information: "",
      category: "",
      item_title: "",
      group: "",
      priority: "",
      visibility: null,
      url_1_link: "",
      url_2_txt: "",
      url_2_link: "",
      plan_frequency: "",
      automatic_status: null,
      createdAt: "",
      project: defaultProject ? defaultProject : null
    });
    const { data: user } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `${config.API_BASE_URL}category-items/identifier/${id}`,
      { key: id },
      "$S9TS9Shr5R"
    )), __temp = await __temp, __restore(), __temp);
    if (user.value) {
      form.id = user.value.id;
      form.username = user.value.username;
      form.timestamp = new Date(user.value.timestamp).toLocaleTimeString();
      form.item_id = user.value.unique_identifier;
      form.information = user.value.information;
      form.category = user.value.category;
      form.item_title = user.value.item_title;
      form.group = user.value.cat_group;
      form.priority = user.value.priority;
      form.visibility = user.value.visibility;
      form.url_1_link = user.value.url_1_link;
      form.url_2_txt = user.value.url_2_txt;
      form.url_2_link = user.value.url_2_link;
      form.plan_frequency = user.value.plan_frequency;
      form.automatic_status = user.value.automatic_status;
      form.createdAt = user.value.createdAt;
    }
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    ref(
      localStorage.getItem("activeAccount")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TasksAll = _sfc_main$3;
      const _component_TasksUnscheduled = _sfc_main$2;
      const _component_TasksPlanned = _sfc_main$1$1;
      const _component_TasksHistory = _sfc_main$4;
      const _component_InformationItems = __nuxt_component_5;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)}><div id="last-tracking-url"><div class="flex justify-between"><h1 class="font-bold py-4 capitalize">Update Category Item</h1><span><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/information-items/add",
          query: { id: unref(form).id }
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
      _push(`</button><button class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 text-black">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: {
          path: "/tasks/add",
          query: { id: unref(form).id, priority: unref(form).priority }
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
      _push(`</button></span></div><form><div class="overflow-hidden shadow sm:rounded-md"><div class="px-4 py-5 sm:p-6"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Created </div><div class="col-span-3"><input type="text"${ssrRenderAttr("value", formatDate(unref(form).createdAt, "YYYY-MM-DD HH:mm"))} class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" disabled></div></div></div><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Item title </div><div class="col-span-9"><input placeholder="Need to enter the title or subject (obligatory)" type="text"${ssrRenderAttr("value", unref(form).item_title)} id="item_title" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div><div class="col-span-12 pt-4"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> Item Url <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"><button type="button" title="Copy Command To Clipboard"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg></button><a${ssrRenderAttr("href", unref(form).url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a></div></div><div class="col-span-9"><input type="text" id="url_1_link"${ssrRenderAttr("value", unref(form).url_1_link)} class="${ssrRenderClass([
        unref(uniqueUrl) === "valid" ? "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading valid" : unref(uniqueUrl) === "invalid" ? "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading invalid" : "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading",
        "outline-none"
      ])}"><svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))}><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg><img${ssrRenderAttr("src", _imports_0)} class="loading" style="${ssrRenderStyle(unref(isLoading) === true ? null : { display: "none" })}"></div></div></div><div class="col-span-12 py-2"><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Category * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))}><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="col-span-9"><select id="category" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required><option value="facebook">Facebook</option><option value="linkedin">LinkedIn</option><option value="prospect">Prospect</option><option value="anything">Anything</option></select></div></div></div><div class="col-span-12 sm:col-span-12 mt-2"><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"><div class="col-span-12 sm:col-span-12"><label for="information" class="block text-sm font-medium text-gray-700">Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project">${ssrInterpolate(unref(form).information)}</textarea></div></div></div><div class="col-span-12 mt-2"><div class="flex items-center mb-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).information, "New found group, no strategy yet.")) ? " checked" : ""} id="default-radio-1" type="radio" value="New found group, no strategy yet." name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"><label for="default-radio-1" class="ml-2 text-sm font-medium text-gray-700">New found group, no strategy yet.</label></div><div class="flex items-center"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).information, "This group is inactive, no actions needed.")) ? " checked" : ""} id="default-radio-2" type="radio" value="This group is inactive, no actions needed." name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"><label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-700">This group is inactive, no actions needed.</label></div></div><div><div class="flex flex-row py-2 mt-4"><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700"> Project <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: `<div>You should try to create some projects to organise the Items in. When you get clicks, you can see how many clicks there were from specific projects created by you.<br />
            Example for remote working projects: Freelancers, Work from Home, Digital Nomad. You will learn over time what projects give you the most clicks per post. <br />
            We advise to use 4-6 projects per project.</div>`,
        html: true
      }, void 0, { right: true })))}><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="basis-3/4"><div id="form-project-selector" class="relative text-sm"><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black"><button class="font-medium" type="button">${ssrInterpolate(unref(projects).length ? unref(projects).find((project) => project.id === unref(form).project) ? unref(projects).find((project) => project.id === unref(form).project).name : "Select project" : "Select project")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showProjectsList) }, "absolute right-3 top-1/2 -translate-y-1"])}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve"><g id="Rounded_Rectangle_33_copy_4_1_"><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showProjectsList) ? null : { display: "none" })}" class="absolute overflow-y-auto max-h-96 w-3/5 top-12 z-10 flex flex-col bg-[#bcbcbc] rounded-md text-black"><!--[-->`);
      ssrRenderList(unref(projects), (project) => {
        _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2"><button type="button">${ssrInterpolate(project.name)}</button></div>`);
      });
      _push(`<!--]--><hr><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300">+ Add a project</button><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300">View projects list</button></div></div></div></div><div class="flex flex-row py-2 mt-4"><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700"> Group * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))}><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="basis-3/4"><div id="group-selector" class="relative text-sm"><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black"><button class="font-medium" type="button">${ssrInterpolate(unref(groups).length ? unref(groups).find((group) => group.id === unref(form).group) ? unref(groups).find((group) => group.id === unref(form).group).name : "Select Group" : "Select Group")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showGroupsList) }, "absolute right-3 top-1/2 -translate-y-1"])}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve"><g id="Rounded_Rectangle_33_copy_4_1_"><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showGroupsList) ? null : { display: "none" })}" class="absolute overflow-y-auto max-h-96 top-12 z-10 w-3/5 flex flex-col bg-[#bcbcbc] rounded-md text-black"><!--[-->`);
      ssrRenderList(unref(groups), (group) => {
        _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 flex cursor-pointer flex-col gap-y-2"><button type="button">${ssrInterpolate(group.name)}</button></div>`);
      });
      _push(`<!--]--><hr><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300">+ Add a group</button><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300">View groups list</button></div></div></div></div><div class="flex flex-row py-2"><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700"> Priority * <svg${ssrRenderAttrs(mergeProps({
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
      }, void 0, { right: true })))}><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="basis-1/3"><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex"><li class="w-full"><div class="flex items-center pl-3"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Low</label></div></li><li class="w-full"><div class="flex items-center pl-3"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Medium</label></div></li><li class="w-full"><div class="flex items-center pl-3"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="priority" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">High </label></div></li></ul></div></div><div class="flex flex-row py-2"><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700"> Visibility * </div><div class="basis-1/4"><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex"><li class="w-full"><div class="flex items-center pl-3"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).visibility, "private")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="private" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Private </label></div></li><li class="w-full"><div class="flex items-center pl-3"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).visibility, "public")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="public" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900">Public</label></div></li></ul></div></div></div><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> URL 2 information </div><div class="col-span-9 px-1.5"><input type="text"${ssrRenderAttr("value", unref(form).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"></div></div></div><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"><button type="button" title="Copy Command To Clipboard"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg></button><a${ssrRenderAttr("href", unref(form).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a></div></div><div class="col-span-9 px-1.5"><input type="text"${ssrRenderAttr("value", unref(form).url_2_link)} id="url_2_link" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"></div></div></div><div class="col-span-12"><p class="text-sm font-medium text-gray-700 pt-2"> Automatic scheduling: </p></div><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> Planning frequency </div><div class="col-span-5 px-1.5"><select id="plan_frequency" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"><option${ssrRenderAttr("value", null)} disabled> Every 4, 6, 8 hours, 2 days, week, month... </option><option value="4">4 hours</option><option value="6">6 hours</option><option value="8">8 hours</option><option value="12">12 hours</option><option value="24">Daily</option><option value="48">2 days</option><option value="72">3 days</option><option value="120">5 days</option><option value="168">Weekly</option><option value="336">Bi weekly</option><option value="720">Monthly</option><option value="1440">Bi Monthly</option></select></div></div></div></div><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> Automatic status </div><div class="col-span-3 px-1.5"><label class="flex items-center relative w-max cursor-pointer select-none"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).automatic_status, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"><span class="absolute font-medium text-xs uppercase right-1 text-white"> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white"> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200"></span></label></div></div></div><div class="flex flex-row mt-4"><div class="basis-1/3 px-1.5"><input type="text"${ssrRenderAttr("value", unref(form).username)}${ssrIncludeBooleanAttr(unref(form).username) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div><div class="basis-1/3 px-1.5"><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div><div class="basis-1/3 px-1.5"><div class="flex flex-row"><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700"> Item ID </div><div class="basis-3/4"><input type="text"${ssrRenderAttr("value", unref(form).item_id)}${ssrIncludeBooleanAttr(unref(form).item_id) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full"><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> Submit </button></div></div></form><div id="tasks_list" class="shadow sm:rounded-md"><div class="px-4 py-5 sm:p-6"><h1 class="font-bold py-4 capitalize">Tasks</h1><div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"><ul class="flex flex-wrap -mb-px"><li class="mr-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `#`,
        onClick: _ctx.activeTabOne,
        class: _ctx.tab === 1 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` All `);
          } else {
            return [
              createTextVNode(" All ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="mr-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `#`,
        onClick: _ctx.activeTabTwo,
        class: _ctx.tab === 2 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Unscheduled `);
          } else {
            return [
              createTextVNode(" Unscheduled ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="mr-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `#`,
        onClick: _ctx.activeTabThree,
        class: _ctx.tab === 3 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Planned `);
          } else {
            return [
              createTextVNode(" Planned ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="mr-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `#`,
        onClick: _ctx.activeTabFour,
        class: _ctx.tab === 4 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` History `);
          } else {
            return [
              createTextVNode(" History ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="mt-4"><div style="${ssrRenderStyle(_ctx.tab === 1 ? null : { display: "none" })}">`);
      _push(ssrRenderComponent(_component_TasksAll, {
        limit: 5,
        showSearch: false,
        itemid: unref(form).id
      }, null, _parent));
      _push(`</div><div style="${ssrRenderStyle(_ctx.tab === 2 ? null : { display: "none" })}">`);
      _push(ssrRenderComponent(_component_TasksUnscheduled, {
        limit: 5,
        showSearch: false,
        itemid: unref(form).id
      }, null, _parent));
      _push(`</div><div style="${ssrRenderStyle(_ctx.tab === 3 ? null : { display: "none" })}">`);
      _push(ssrRenderComponent(_component_TasksPlanned, {
        limit: 5,
        showSearch: false,
        itemid: unref(form).id
      }, null, _parent));
      _push(`</div><div style="${ssrRenderStyle(_ctx.tab === 4 ? null : { display: "none" })}">`);
      _push(ssrRenderComponent(_component_TasksHistory, {
        limit: 5,
        showSearch: false,
        itemid: unref(form).id
      }, null, _parent));
      _push(`</div></div></div></div><div id="information_items" class="shadow sm:rounded-md my-4"><div class="px-4 py-5 sm:p-6">`);
      _push(ssrRenderComponent(_component_InformationItems, {
        limit: 5,
        itemid: unref(form).id
      }, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category-items/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-1dd942b8.mjs.map
