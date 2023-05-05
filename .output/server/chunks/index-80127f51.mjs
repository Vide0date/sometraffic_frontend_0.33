import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { inject, ref, reactive, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { _ as _export_sfc, a as useRuntimeConfig } from './server.mjs';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: ""
    });
    const config = /* @__PURE__ */ useRuntimeConfig();
    const setClickDatas = async () => {
      const { data } = await useFetch(
        `${config.API_BASE_URL}category-items/all`,
        "$U2wNUdWFfJ"
      );
      const _data = data.value.reduce((ds, d) => {
        let newD = d;
        if (d.priority === 1) {
          newD = Object.assign({}, d, { priority: "high" });
        } else if (d.priority === 2) {
          newD = Object.assign({}, d, { priority: "medium" });
        } else if (d.priority === 3) {
          newD = Object.assign({}, d, { priority: "low" });
        } else {
          newD = Object.assign({}, d, { priority: "N/A" });
        }
        return ds.concat(newD);
      }, []);
      clickdatas.value = _data;
      searchdatas.value = _data;
      clickdatasTotal.value = _data.length;
    };
    const handleDelete = async () => {
      const id = localStorage.getItem("sometraffic_delete_category");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}category-items/delete/${id}`,
        {
          method: "GET",
          params: { id }
        },
        "$f2yLIhc8fC"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_category");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-b67b49de><div id="click_data" class="shadow sm:rounded-md" data-v-b67b49de>`);
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
            _push2(`<div class="text" data-v-b67b49de${_scopeId}> There are tasks or information records related to this category item. By deleting this item, they will also be deleted. Deleting can not be undone! Are you sure you want to delete the Category item and related records from the database? </div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, " There are tasks or information records related to this category item. By deleting this item, they will also be deleted. Deleting can not be undone! Are you sure you want to delete the Category item and related records from the database? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between" data-v-b67b49de><h1 class="font-bold py-4 capitalize" data-v-b67b49de> Category Items list (${ssrInterpolate(unref(clickdatasTotal))}) </h1><button type="button" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-3 px-4 mb-2 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-b67b49de> Add category item (Alt + C) </button><div class="flex items-start" data-v-b67b49de><div class="flex border-2 rounded" data-v-b67b49de><div class="relative" data-v-b67b49de><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..." data-v-b67b49de><button class="absolute inset-y-0 right-0 px-2" data-v-b67b49de><svg color="black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b67b49de><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-b67b49de></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700" data-v-b67b49de><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-v-b67b49de><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" data-v-b67b49de></path></svg></button><button class="flex items-center justify-center px-4 border-l border-grey-600 bg-grey-700" data-v-b67b49de><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b67b49de><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" data-v-b67b49de></path></svg></button></div></div></div><div class="flex items-center justify-center" data-v-b67b49de></div><div class="overflow-x-auto" data-v-b67b49de><table class="w-full whitespace-nowrap" data-v-b67b49de><thead class="bg-black/60" data-v-b67b49de><tr data-v-b67b49de><th class="text-left py-3 px-2" data-v-b67b49de>Item ID</th><th class="text-left py-3 px-2" data-v-b67b49de>Category</th><th class="text-left py-3 px-2" data-v-b67b49de>Priority</th><th class="text-left py-3 px-2" data-v-b67b49de>Group</th><th class="text-left py-3 px-2 title-th" data-v-b67b49de>Title</th><th class="text-left py-3 px-2 rounded-r-lg" data-v-b67b49de>Actions</th></tr></thead><tbody data-v-b67b49de><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        var _a;
        _push(`<tr class="border-b border-gray-700" data-v-b67b49de><td class="py-3 px-2" data-v-b67b49de>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2 capitalize" data-v-b67b49de>${ssrInterpolate(clickdata == null ? void 0 : clickdata.category)}</td><td class="py-3 px-2 capitalize" data-v-b67b49de>${ssrInterpolate(clickdata == null ? void 0 : clickdata.priority)}</td><td class="py-3 px-2 capitalize" data-v-b67b49de>${ssrInterpolate((_a = clickdata == null ? void 0 : clickdata.Users_Group) == null ? void 0 : _a.name)}</td><td class="py-3 px-2 title-td" data-v-b67b49de>${ssrInterpolate(clickdata == null ? void 0 : clickdata.item_title)}</td><td class="py-3 px-2" data-v-b67b49de><div class="inline-flex items-center space-x-3" data-v-b67b49de>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" data-v-b67b49de${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" data-v-b67b49de${_scopeId}></path></svg>`);
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
        _push(`<span title="Delete" class="hover:text-white" data-v-b67b49de><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-b67b49de><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" data-v-b67b49de></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category-items/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b67b49de"]]);

export { index as default };
//# sourceMappingURL=index-80127f51.mjs.map
