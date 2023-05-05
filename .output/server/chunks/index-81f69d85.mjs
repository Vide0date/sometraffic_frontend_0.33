import { u as useRoute, a as useRuntimeConfig } from './server.mjs';
import { inject, ref, reactive, withAsyncContext, mergeProps, unref, isRef, withCtx, createVNode, useSSRContext } from 'vue';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { Modal } from 'usemodal-vue3';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const clickdatasTotal = ref(0);
    const defUser = JSON.parse(localStorage.getItem("user"));
    const form = reactive({
      id: "",
      user_id: "",
      name: "",
      description: ""
    });
    if (id) {
      const { data: user } = ([__temp, __restore] = withAsyncContext(() => useFetch(`${config.API_BASE_URL}groups/${id}`, {
        key: id
      }, "$oAw4SAftOf")), __temp = await __temp, __restore(), __temp);
      form.id = user.value.id;
      form.user_id = defUser.userId;
      form.name = user.value.name;
      form.description = user.value.description;
    }
    const setClickDatas = async () => {
      var _a;
      const { data } = await useFetch(`${config.API_BASE_URL}groups/all?userid=${defUser.userId}`, "$h6hmIRjp3D");
      clickdatas.value = data.value;
      clickdatasTotal.value = (_a = data.value) == null ? void 0 : _a.length;
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_group");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}groups/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$Gvnm0xgY9a"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_group");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "users_groups" }, _attrs))}>`);
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
            _push2(`<div class="text"${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="overflow-hidden shadow sm:rounded-md"><div class="px-4 py-5 sm:p-6"><div class="grid grid-cols-12"><div class="col-span-12"><form><div class="grid"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"> Name </div><div class="col-span-9 px-1.5"><input type="text"${ssrRenderAttr("value", unref(form).name)} id="name" maxlength="100" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"></div></div><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Description </div><div class="col-span-9 px-1.5"><textarea id="description" rows="6" maxlength="500" class="bg-[#dddddd] h-20 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm">${ssrInterpolate(unref(form).description)}</textarea></div></div><div class="px-2 py-3 text-right sm:px-2 w-full sm:w-full"><button type="submit" class="bg-[#bcbcbc] inline-flex justify-end rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> Submit </button></div></div></div></form></div><div class="col-span-12"><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2 rounded-l-lg">ID</th><th class="text-left py-3 px-2">Name</th><th class="text-left py-3 px-2">Description</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(clickdatas), (clickdata) => {
        var _a;
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">${ssrInterpolate(clickdata.id)}</td><td class="py-3 px-2">${ssrInterpolate(clickdata.name)}</td><td class="py-3 px-2">${ssrInterpolate(((_a = clickdata.description) == null ? void 0 : _a.length) > 100 ? clickdata.description.slice(0, 100) + "..." : clickdata.description)}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3"><span title="Edit" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg></span><span title="Delete" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user-groups/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-81f69d85.mjs.map
