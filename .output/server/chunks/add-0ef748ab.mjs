import { inject, ref, reactive, unref, isRef, withCtx, createVNode, useSSRContext } from 'vue';
import { _ as _export_sfc, u as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { Modal } from 'usemodal-vue3';
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

const _sfc_main = {
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$awn");
    useRuntimeConfig();
    const shouldShowDialog = ref(false);
    let user = localStorage.getItem("user");
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    ref("");
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      createdBy: JSON.parse(user).userName,
      timestamp,
      unique_identifier: "",
      description: "",
      name: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-716f6f30><div id="last-tracking-url" data-v-716f6f30>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "Are you sure?",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => _ctx.handleSave() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-716f6f30${_scopeId}> This item already exists in the database. Are you sure that you want to create it double? </div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, " This item already exists in the database. Are you sure that you want to create it double? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<form data-v-716f6f30><div class="flex justify-between" data-v-716f6f30><h1 class="font-bold py-4 capitalize" data-v-716f6f30>Create a new account</h1><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-716f6f30> Create Account </button></div><div class="overflow-hidden shadow sm:rounded-md" data-v-716f6f30><div class="px-4 py-5 sm:p-6" data-v-716f6f30><div class="col-span-12" data-v-716f6f30><div class="grid grid-cols-12" data-v-716f6f30><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-716f6f30> Item ID </div><div class="col-span-3" data-v-716f6f30><input type="text"${ssrRenderAttr("value", unref(form).unique_identifier)}${ssrIncludeBooleanAttr(unref(form).unique_identifier) ? " disabled" : ""} id="unique_identifier" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-716f6f30></div></div></div><div class="flex flex-row mt-4" data-v-716f6f30><div class="basis-1/2 pr-1.5" data-v-716f6f30><div class="col-span-12" data-v-716f6f30><div class="grid grid-cols-12" data-v-716f6f30><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-716f6f30> Created </div><div class="col-span-9" data-v-716f6f30><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-716f6f30></div></div></div></div><div class="basis-1/2 pl-1.5" data-v-716f6f30><div class="col-span-12" data-v-716f6f30><div class="grid grid-cols-12" data-v-716f6f30><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-716f6f30> Created By </div><div class="col-span-9" data-v-716f6f30><input type="text"${ssrRenderAttr("value", unref(form).createdBy)}${ssrIncludeBooleanAttr(unref(form).createdBy) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-716f6f30></div></div></div></div></div><div class="col-span-12 mt-4" data-v-716f6f30><div class="grid grid-cols-12" data-v-716f6f30><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-716f6f30> Account name * </div><div class="col-span-9" data-v-716f6f30><input placeholder="Need to enter account name (obligatory)" type="text"${ssrRenderAttr("value", unref(form).name)} id="name" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-716f6f30></div></div></div><div class="col-span-12 sm:col-span-12 mt-4" data-v-716f6f30><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-716f6f30><div class="col-span-12 sm:col-span-12" data-v-716f6f30><label for="description" class="block text-sm font-medium text-gray-700" data-v-716f6f30>Description</label><textarea rows="6" id="description" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project" data-v-716f6f30>${ssrInterpolate(unref(form).description)}</textarea></div></div></div></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounts/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-716f6f30"]]);

export { add as default };
//# sourceMappingURL=add-0ef748ab.mjs.map
