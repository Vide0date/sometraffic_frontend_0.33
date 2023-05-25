import { _ as _export_sfc, u as useRuntimeConfig, a as useRoute, e as useRouter, f as __nuxt_component_0$1 } from './server.mjs';
import { inject, ref, reactive, withAsyncContext, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, useSSRContext } from 'vue';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const accounts = ref([]);
    const accountsTotal = ref(0);
    const searchdatas = ref([]);
    const search = reactive({
      vaClDa: ""
    });
    const defUser = JSON.parse(localStorage.getItem("user"));
    const name = ref(localStorage.getItem("sometraffic_delete_account_name"));
    const form = reactive({
      id: "",
      user_id: "",
      name: "",
      description: ""
    });
    if (id) {
      const { data: user } = ([__temp, __restore] = withAsyncContext(() => useFetch(`${config.API_BASE_URL}groups/${id}`, {
        key: id
      }, "$ur5EPSeeGH")), __temp = await __temp, __restore(), __temp);
      form.id = user.value.id;
      form.user_id = defUser.userId;
      form.name = user.value.name;
      form.description = user.value.description;
    }
    const setAccounts = async () => {
      var _a;
      const { data } = await useFetch(`${config.API_BASE_URL}accounts/all`, "$Ju9kMaQg6a");
      searchdatas.value = data.value;
      accounts.value = data.value;
      accountsTotal.value = (_a = data.value) == null ? void 0 : _a.length;
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_account");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}accounts/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$Z6HPEjboWx"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
        const router = useRouter();
        router.go();
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_account");
      localStorage.removeItem("sometraffic_delete_account_name");
      name.value = "";
      await setAccounts();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "users_groups" }, _attrs))} data-v-78574737>`);
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
            _push2(`<div class="text" data-v-78574737${_scopeId}>Are you sure you want to delete ${ssrInterpolate(unref(name))}?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure you want to delete " + toDisplayString(unref(name)) + "?", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between" data-v-78574737><h1 class="font-bold py-4 capitalize" data-v-78574737>Accounts list (${ssrInterpolate(unref(accountsTotal))})</h1><div class="flex items-start" data-v-78574737><div class="flex border-2 rounded" data-v-78574737><div class="relative" data-v-78574737><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..." data-v-78574737><button class="absolute inset-y-0 right-0 px-2" data-v-78574737><svg color="black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-78574737><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-78574737></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700" data-v-78574737><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-v-78574737><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" data-v-78574737></path></svg></button><button class="flex items-center justify-center px-4 border-l border-grey-600 bg-grey-700" data-v-78574737><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-78574737><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" data-v-78574737></path></svg></button></div></div></div><div class="overflow-hidden shadow sm:rounded-md" data-v-78574737><div class="px-4 py-5 sm:p-6" data-v-78574737><div class="grid grid-cols-12" data-v-78574737><div class="col-span-12" data-v-78574737><div class="overflow-x-auto" data-v-78574737><table class="w-full whitespace-nowrap" data-v-78574737><thead class="bg-black/60" data-v-78574737><tr data-v-78574737><th class="text-left py-3 px-2" data-v-78574737>Item ID</th><th class="text-left py-3 px-2" data-v-78574737>Name</th><th class="text-left py-3 px-2" data-v-78574737>Description</th><th class="text-left py-3 px-2 rounded-r-lg" data-v-78574737>Actions</th></tr></thead><tbody data-v-78574737><!--[-->`);
      ssrRenderList(unref(searchdatas), (account) => {
        var _a;
        _push(`<tr class="border-b border-gray-700" data-v-78574737><td class="py-3 px-2" data-v-78574737>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/accounts/${account.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(account == null ? void 0 : account.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(account == null ? void 0 : account.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2" data-v-78574737>${ssrInterpolate(account.name)}</td><td class="py-3 px-2" data-v-78574737>${ssrInterpolate(((_a = account.description) == null ? void 0 : _a.length) > 100 ? account.description.slice(0, 100) + "..." : account.description)}</td><td class="py-3 px-2" data-v-78574737><div class="inline-flex items-center space-x-3" data-v-78574737>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/accounts/${account.unique_identifier}`,
          title: "Edit"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span title="Edit" class="hover:text-white" data-v-78574737${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" data-v-78574737${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" data-v-78574737${_scopeId}></path></svg></span>`);
            } else {
              return [
                createVNode("span", {
                  title: "Edit",
                  class: "hover:text-white"
                }, [
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
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white" data-v-78574737><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-78574737><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" data-v-78574737></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accounts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-78574737"]]);

export { index as default };
//# sourceMappingURL=index-7f03e12a.mjs.map
