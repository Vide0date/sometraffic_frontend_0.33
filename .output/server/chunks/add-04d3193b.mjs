import { inject, ref, reactive, resolveDirective, unref, isRef, withCtx, createVNode, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, u as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrGetDirectiveProps, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import 'ohash';

const _sfc_main = {
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    const config = useRuntimeConfig();
    const shouldShowDialog = ref(false);
    ref([]);
    ref(
      localStorage.getItem("activeAccount")
    );
    const projects = ref([]);
    const activeProject = ref(0);
    activeProject.value = localStorage.getItem("activeProject") ? parseInt(localStorage.getItem("activeProject")) : 0;
    localStorage.getItem("sometraffic_default_category");
    localStorage.getItem("sometraffic_default_group");
    localStorage.getItem("sometraffic_default_priority");
    let user = localStorage.getItem("user");
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    const uniqueUrl = ref("");
    ref(false);
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      name: "",
      description: "",
      unique_identifier: "",
      ProjectId: "",
      createdBy: JSON.parse(user).userName,
      timestamp
    });
    const handleSave = async () => {
      let a_data = {
        username: form.username,
        timestamp: /* @__PURE__ */ new Date(),
        name: form.name,
        unique_identifier: form.unique_identifier,
        description: form.description,
        category: form.category,
        priority: form.priority,
        cat_group: form.group,
        visibility: form.visibility,
        url_1_link: form.url_1_link,
        url_2_txt: form.url_2_txt,
        url_2_link: form.url_2_link,
        plan_frequency: form.plan_frequency,
        automatic_status: form.automatic_status
      };
      await useFetch(`${config.API_BASE_URL}category-items/create`, {
        method: "POST",
        body: a_data
      }, "$ogTQaoLDgL").then((result) => {
        if (result.data.value) {
          AWN.success(result.data.value.message);
          uniqueUrl.value = "";
          navigateTo("/category-items");
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message);
          shouldShowDialog.value = false;
          AWN.alert(error);
        }
      }).catch((error2) => {
        console.log("error value", error2);
        AWN.alert("Validation error");
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d31e6898><div id="last-tracking-url" data-v-d31e6898>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "Are you sure?",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleSave() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-d31e6898${_scopeId}> This item already exists in the database. Are you sure that you want to create it double? </div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, " This item already exists in the database. Are you sure that you want to create it double? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<form data-v-d31e6898><div class="flex justify-between" data-v-d31e6898><h1 class="font-bold py-4 capitalize" data-v-d31e6898>Add a new group</h1><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-d31e6898> Add group </button></div><div class="overflow-hidden shadow sm:rounded-md" data-v-d31e6898><div class="px-4 py-5 sm:p-6" data-v-d31e6898><div class="col-span-12" data-v-d31e6898><div class="grid grid-cols-12" data-v-d31e6898><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-d31e6898> ID </div><div class="col-span-3" data-v-d31e6898><input type="text"${ssrRenderAttr("value", unref(form).unique_identifier)}${ssrIncludeBooleanAttr(unref(form).unique_identifier) ? " disabled" : ""} id="unique_identifier" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-d31e6898></div></div></div><div class="flex flex-row mt-4" data-v-d31e6898><div class="basis-1/2 pr-1.5" data-v-d31e6898><div class="col-span-12" data-v-d31e6898><div class="grid grid-cols-12" data-v-d31e6898><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-d31e6898> Created </div><div class="col-span-9" data-v-d31e6898><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-d31e6898></div></div></div></div><div class="basis-1/2 pl-1.5" data-v-d31e6898><div class="col-span-12" data-v-d31e6898><div class="grid grid-cols-12" data-v-d31e6898><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-d31e6898> Created By </div><div class="col-span-9" data-v-d31e6898><input type="text"${ssrRenderAttr("value", unref(form).createdBy)}${ssrIncludeBooleanAttr(unref(form).createdBy) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-d31e6898></div></div></div></div></div><div class="col-span-12 py-2" data-v-d31e6898><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-d31e6898><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-d31e6898> Related to Project * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Obligatory, here you have to select which project you want to add group to.</div>",
        html: true
      }, void 0, { right: true })))} data-v-d31e6898><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-d31e6898></path></svg></div><div class="col-span-9" data-v-d31e6898><select id="category" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-d31e6898><!--[-->`);
      ssrRenderList(unref(projects), (project) => {
        _push(`<option${ssrRenderAttr("value", project.id)} data-v-d31e6898>${ssrInterpolate(project.name)}</option>`);
      });
      _push(`<!--]--></select></div></div></div><div class="col-span-12 mt-4" data-v-d31e6898><div class="grid grid-cols-12" data-v-d31e6898><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-d31e6898> Group name * </div><div class="col-span-9" data-v-d31e6898><input placeholder="Need to enter account name (obligatory)" type="text"${ssrRenderAttr("value", unref(form).name)} id="name" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-d31e6898></div></div></div><div class="col-span-12 sm:col-span-12 mt-4" data-v-d31e6898><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-d31e6898><div class="col-span-12 sm:col-span-12" data-v-d31e6898><label for="description" class="block text-sm font-medium text-gray-700" data-v-d31e6898>Description</label><textarea rows="6" id="description" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or group" data-v-d31e6898>${ssrInterpolate(unref(form).description)}</textarea></div></div></div></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user-groups/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d31e6898"]]);

export { add as default };
//# sourceMappingURL=add-04d3193b.mjs.map
